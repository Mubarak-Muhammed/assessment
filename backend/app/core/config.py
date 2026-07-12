from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-First CRM"
    API_V1_STR: str = "/api/v1"
    
    # LLM Settings
    GROQ_API_KEY: Optional[str] = None
    MODEL_NAME: str = "gemma2-9b-it" 
    # To switch to Llama 3, just change to "llama-3.3-70b-versatile"
    
    # Database (Placeholder)
    DATABASE_URL: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
