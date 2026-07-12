# Gap Analysis – AI-First CRM HCP Module

## What Exists (Skeleton / Scaffolding Only)

### Backend ✅ (structure present, logic shallow)
| File | Status | Notes |
|------|--------|-------|
| `main.py` | ✅ Done | FastAPI app with CORS, routers registered |
| `core/config.py` | ✅ Done | Settings with GROQ_API_KEY, MODEL_NAME |
| `core/groq_client.py` | ✅ Done | `ChatGroq` client wired to settings |
| `schemas/interaction.py` | ✅ Done | All Pydantic schemas present |
| `database/mock_db.py` | ✅ Done | In-memory dict store (no real DB) |
| `repositories/interaction_repo.py` | ✅ Done | CRUD via mock_db |
| `services/interaction_service.py` | ✅ Done | Thin service layer |
| `api/endpoints/interaction.py` | ✅ Done | REST CRUD routes |
| `api/endpoints/agent.py` | ⚠️ Skeleton | Route exists but tool dispatch is mock |
| `tools/crm_tools.py` | ❌ Stub | All 5 tools return hardcoded strings – no real logic |
| `langgraph/workflow.py` | ❌ Stub | Graph defined but `execute_tool` node does nothing real (no `ToolNode`) |
| `models/interaction.py` | ❌ Commented out | SQLAlchemy model fully commented out |
| `.env` file | ❌ Missing | No actual GROQ_API_KEY set |
| `requirements.txt` | ⚠️ Incomplete | Missing `psycopg2`, `alembic`, `langchain-community` |

### Frontend ❌ (Almost entirely missing)
| File | Status | Notes |
|------|--------|-------|
| `package.json` | ✅ Done | Dependencies listed (RTK, axios, lucide-react, react-router) |
| `store/index.ts` | ✅ Done | Redux store configured with 5 slices |
| `store/interactionSlice.ts` | ⚠️ Skeleton | State shape defined, no async thunks |
| `store/chatSlice.ts` | ❌ Stub | Empty – no messages, no actions |
| `store/authSlice.ts` | ❌ Stub | Likely empty |
| `store/agentSlice.ts` | ❌ Stub | Likely empty |
| `store/uiSlice.ts` | ❌ Stub | Likely empty |
| `main.tsx` | ⚠️ Incomplete | No Redux `<Provider>` wrapping |
| `App.tsx` | ❌ Wrong | Still the Vite boilerplate – no routing, no CRM UI |
| `pages/` | ❌ Empty | No pages at all |
| `components/features/` | ❌ Empty | No feature components |
| `components/ui/` | ❌ Empty | No UI components |
| `services/` | ❌ Empty | No Axios API service calls |
| `types/` | ❌ Empty | No TypeScript interfaces |
| `hooks/` | ❌ Empty | No custom hooks |

---

## What Needs to Be Built (Remaining Work)

### 🔴 CRITICAL – Backend

1. **Real LangGraph Workflow with `ToolNode`**
   - Replace the stub `execute_tool` node with LangChain's `ToolNode`
   - Wire the conditional routing so tool_calls actually execute tools
   - Add `StateGraph` interrupt/loop for multi-turn chat

2. **Real Tool Implementations** (all 5 tools are stubs)
   - `log_interaction` – parse note with LLM, extract entities (HCP name, hospital, products, sentiment), store via `interaction_repo`
   - `edit_interaction` – accept ID + field updates, update in repo
   - `generate_follow_up_plan` – call LLM to suggest next visit date + agenda
   - `doctor_insights` – call LLM to generate HCP profile/buying interest summary
   - `meeting_summary_generator` – summarize notes → key takeaways + action items

3. **Agent endpoint properly uses repo** 
   - `agent.py` chat endpoint should pass `db` / repo context into tools so tools can persist data

4. **`__init__.py` files** – Python packages need `__init__.py` (likely already there but confirm)

5. **`.env` file** – Add actual `GROQ_API_KEY`

---

### 🔴 CRITICAL – Frontend

6. **`main.tsx`** – Wrap app in Redux `<Provider store={store}>` and `<BrowserRouter>`

7. **`App.tsx`** – Replace Vite boilerplate with React Router routes:
   - `/` → Dashboard
   - `/log` → Log Interaction Screen (Form + Chat tabs)
   - `/interactions` → Interactions List

8. **TypeScript types** (`src/types/index.ts`) – Define `Interaction`, `ChatMessage`, `AgentResponse` interfaces

9. **API service layer** (`src/services/api.ts`) – Axios instance + calls:
   - `logInteractionForm(data)`
   - `editInteraction(id, data)`
   - `getAllInteractions()`
   - `sendAgentMessage(message)`

10. **Redux slices – async thunks**
    - `interactionSlice`: `fetchInteractions`, `createInteraction`, `updateInteraction`
    - `chatSlice`: `sendMessage`, add `messages` state, `loading`, `extractedData`
    - `agentSlice`: `invokeAgent`

11. **Pages**
    - `pages/Dashboard.tsx` – Summary cards (total interactions, follow-ups due, etc.)
    - `pages/LogInteraction.tsx` – **Main deliverable screen** with two tabs:
      - Tab 1: Structured form (all fields from schema)
      - Tab 2: Conversational chat interface with agent
    - `pages/InteractionsList.tsx` – Table of all interactions with edit button

12. **Components**
    - `components/features/LogForm.tsx` – Full interaction form
    - `components/features/ChatInterface.tsx` – Chat bubbles + input + tool result cards
    - `components/features/InteractionCard.tsx` – Interaction display card
    - `components/ui/Navbar.tsx` – Navigation sidebar/header
    - `components/ui/Modal.tsx` – Edit interaction modal

13. **Styling** – Global CSS (`index.css`, `App.css`) using Google Inter font, dark/premium theme

---

### 🟡 IMPORTANT – Nice-to-Have

14. **Real DB (PostgreSQL)** – Uncomment SQLAlchemy model, add Alembic migrations
15. **`requirements.txt`** – Add `psycopg2-binary`, `alembic`, `python-multipart`
16. **README update** – Add `.env.example`, Groq API setup instructions
17. **Error handling** – Toast notifications, form validation, loading states

---

## Priority Build Order

```
1. Backend: Fix LangGraph workflow (ToolNode + real tool implementations)
2. Backend: .env with real GROQ_API_KEY
3. Frontend: main.tsx Provider + Router wiring
4. Frontend: Types + API service layer
5. Frontend: Redux async thunks
6. Frontend: Pages (LogInteraction is the main deliverable)
7. Frontend: Components (LogForm + ChatInterface)
8. Frontend: Styling + polish
9. README update
```
