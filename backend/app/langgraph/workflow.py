from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, SystemMessage
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from app.core.groq_client import llm
from app.tools.crm_tools import (
    log_interaction,
    edit_interaction,
    generate_follow_up_plan,
    doctor_insights,
    meeting_summary_generator
)

# ── Agent State ──────────────────────────────────────────────────────────────
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    extracted_data: dict

# ── Tool registry ────────────────────────────────────────────────────────────
tools = [
    log_interaction,
    edit_interaction,
    generate_follow_up_plan,
    doctor_insights,
    meeting_summary_generator
]

llm_with_tools = llm.bind_tools(tools)
tool_node = ToolNode(tools)

SYSTEM_PROMPT = """You are an AI assistant for a Life Sciences CRM system called PharmaCRM.
You help pharmaceutical field representatives manage their HCP (Healthcare Professional) interactions.

You have access to 5 powerful tools:
1. log_interaction - Extract structured CRM data from meeting notes
2. edit_interaction - Update a specific field of a logged interaction
3. generate_follow_up_plan - Create a strategic follow-up plan after a meeting
4. doctor_insights - Get AI-generated profile and engagement insights for a doctor
5. meeting_summary_generator - Convert raw notes into professional CRM summaries

Always be helpful, professional, and concise. When a user describes a meeting or visit,
automatically use the log_interaction tool. When they ask about next steps, use
generate_follow_up_plan. Always confirm actions taken."""

# ── Nodes ────────────────────────────────────────────────────────────────────
def call_model(state: AgentState):
    """LLM node: decides which tool to call or responds directly."""
    messages = list(state["messages"])
    
    # Inject system prompt if not present
    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + messages
    
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState) -> str:
    """Router: if LLM called a tool → execute it; otherwise → done."""
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

# ── Graph ────────────────────────────────────────────────────────────────────
def create_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", tool_node)
    
    workflow.set_entry_point("agent")
    
    workflow.add_conditional_edges(
        "agent",
        should_continue,
        {"tools": "tools", END: END}
    )
    # After tool executes, go back to agent for a final response
    workflow.add_edge("tools", "agent")
    
    return workflow.compile()

graph = create_graph()
