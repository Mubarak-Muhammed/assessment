from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.interaction import InteractionCreate, InteractionUpdate, InteractionInDB
from app.services.interaction_service import interaction_service

router = APIRouter()

@router.post("/form", response_model=InteractionInDB)
def log_interaction_form(data: InteractionCreate):
    return interaction_service.create_interaction(data)

@router.post("/chat", response_model=InteractionInDB)
def log_interaction_chat(data: InteractionCreate):
    # For now, it just creates an interaction. The actual chat logic 
    # and extraction will go through the agent endpoint.
    return interaction_service.create_interaction(data)

@router.put("/edit/{id}", response_model=InteractionInDB)
def edit_interaction(id: str, data: InteractionUpdate):
    interaction = interaction_service.update_interaction(id, data)
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction

@router.get("/all", response_model=List[InteractionInDB])
def get_all_interactions():
    return interaction_service.get_all_interactions()

@router.get("/{id}", response_model=InteractionInDB)
def get_interaction(id: str):
    interaction = interaction_service.get_interaction(id)
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return interaction
