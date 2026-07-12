from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date

class InteractionBase(BaseModel):
    hcp_name: str
    hospital: str
    specialization: Optional[str] = None
    interaction_date: date
    meeting_type: str
    visit_duration: Optional[int] = None
    discussion_topics: Optional[str] = None
    products_discussed: Optional[str] = None
    objections: Optional[str] = None
    competitor_mentioned: Optional[str] = None
    follow_up_required: bool = False
    follow_up_date: Optional[date] = None
    notes: Optional[str] = None
    sentiment: Optional[str] = None
    confidence_score: Optional[float] = None

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(InteractionBase):
    pass

class InteractionInDB(InteractionBase):
    id: str

    class Config:
        orm_mode = True

class AgentChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class AgentChatResponse(BaseModel):
    response: str
    extracted_data: Optional[Dict[str, Any]] = None
