import uuid
from typing import List, Optional
from app.schemas.interaction import InteractionCreate, InteractionUpdate, InteractionInDB
from app.database.mock_db import db

class InteractionRepository:
    def get_all(self) -> List[InteractionInDB]:
        return [InteractionInDB(**item) for item in db.list_interactions()]

    def get_by_id(self, id: str) -> Optional[InteractionInDB]:
        item = db.get_interaction(id)
        if item:
            return InteractionInDB(**item)
        return None

    def create(self, obj_in: InteractionCreate) -> InteractionInDB:
        new_id = str(uuid.uuid4())
        data = obj_in.dict()
        data["id"] = new_id
        db.add_interaction(new_id, data)
        return InteractionInDB(**data)

    def update(self, id: str, obj_in: InteractionUpdate) -> Optional[InteractionInDB]:
        item = db.get_interaction(id)
        if not item:
            return None
        updated_data = {**item, **obj_in.dict(exclude_unset=True)}
        db.update_interaction(id, updated_data)
        return InteractionInDB(**updated_data)

interaction_repo = InteractionRepository()
