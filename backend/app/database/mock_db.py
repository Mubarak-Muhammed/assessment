from typing import Dict, Any, List

# In-memory storage to simulate a database
# Tomorrow I will replace this with PostgreSQL.
# TODO: Replace mock storage with SQLAlchemy implementation.

class MockDatabase:
    def __init__(self):
        self.interactions: Dict[str, Any] = {}
        self.hcp_profiles: Dict[str, Any] = {}
        
    def add_interaction(self, interaction_id: str, data: Any):
        self.interactions[interaction_id] = data
        return data
        
    def get_interaction(self, interaction_id: str):
        return self.interactions.get(interaction_id)
        
    def update_interaction(self, interaction_id: str, data: Any):
        if interaction_id in self.interactions:
            self.interactions[interaction_id].update(data)
            return self.interactions[interaction_id]
        return None
        
    def list_interactions(self) -> List[Any]:
        return list(self.interactions.values())

db = MockDatabase()
