from langchain_groq import ChatGroq
from app.core.config import settings

def get_llm():
    # To switch to Llama 3, we simply use settings.MODEL_NAME which can be changed in config or .env
    # e.g., MODEL_NAME="llama-3.3-70b-versatile" or "gemma2-9b-it"
    return ChatGroq(
        temperature=0,
        model_name=settings.MODEL_NAME,
        api_key=settings.GROQ_API_KEY or "MOCK_API_KEY", # fallback to mock for now
    )

llm = get_llm()
