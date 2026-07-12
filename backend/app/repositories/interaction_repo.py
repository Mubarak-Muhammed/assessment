import uuid
from typing import List, Optional
from app.schemas.interaction import InteractionCreate, InteractionUpdate, InteractionInDB
from app.models.interaction import Interaction
from app.database.session import SessionLocal

class InteractionRepository:
    def get_all(self) -> List[InteractionInDB]:
        with SessionLocal() as session:
            items = session.query(Interaction).all()
            return [InteractionInDB.from_orm(item) for item in items]

    def get_by_id(self, id: str) -> Optional[InteractionInDB]:
        with SessionLocal() as session:
            item = session.query(Interaction).filter(Interaction.id == id).first()
            if item:
                return InteractionInDB.from_orm(item)
            return None

    def create(self, obj_in: InteractionCreate) -> InteractionInDB:
        new_id = str(uuid.uuid4())
        data = obj_in.dict()
        data["id"] = new_id
        db_obj = Interaction(**data)
        
        with SessionLocal() as session:
            session.add(db_obj)
            session.commit()
            session.refresh(db_obj)
            return InteractionInDB.from_orm(db_obj)

    def update(self, id: str, obj_in: InteractionUpdate) -> Optional[InteractionInDB]:
        with SessionLocal() as session:
            item = session.query(Interaction).filter(Interaction.id == id).first()
            if not item:
                return None
            
            update_data = obj_in.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(item, field, value)
                
            session.commit()
            session.refresh(item)
            return InteractionInDB.from_orm(item)

interaction_repo = InteractionRepository()
