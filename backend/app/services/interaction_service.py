from typing import List, Optional
from app.schemas.interaction import InteractionCreate, InteractionUpdate, InteractionInDB
from app.repositories.interaction_repo import interaction_repo

class InteractionService:
    def get_all_interactions(self) -> List[InteractionInDB]:
        return interaction_repo.get_all()

    def get_interaction(self, id: str) -> Optional[InteractionInDB]:
        return interaction_repo.get_by_id(id)

    def create_interaction(self, data: InteractionCreate) -> InteractionInDB:
        return interaction_repo.create(data)

    def update_interaction(self, id: str, data: InteractionUpdate) -> Optional[InteractionInDB]:
        return interaction_repo.update(id, data)

interaction_service = InteractionService()
