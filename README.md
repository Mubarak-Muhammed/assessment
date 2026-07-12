# PharmaCRM – AI-First CRM for Life Sciences

An enterprise-grade, AI-first CRM for Life Sciences Field Representatives. Built with React + Redux on the frontend and FastAPI + LangGraph on the backend. Allows field reps to log HCP (Healthcare Professional) interactions through a **structured form** or a **conversational AI chat interface**.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React)                  │
│  Dashboard | Log Interaction | Interactions List     │
│  Redux Toolkit (5 slices) | Axios | React Router     │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP (REST)
┌─────────────────────▼───────────────────────────────┐
│                BACKEND (FastAPI)                     │
│  /interaction/* (CRUD) | /agent/chat (AI)            │
│  Pydantic schemas | Service + Repository layers      │
└──────────────┬──────────────────────────────────────┘
               │ LangChain / LangGraph
┌──────────────▼──────────────────────────────────────┐
│             LANGGRAPH AI AGENT                       │
│  StateGraph → Agent Node → ToolNode → Agent Node     │
│  5 CRM Tools (Groq gemma2-9b-it LLM)                │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + TypeScript |
| **State Management** | Redux Toolkit (RTK) |
| **Routing** | React Router v7 |
| **HTTP Client** | Axios |
| **Backend** | FastAPI + Python 3.11 |
| **AI Agent** | LangGraph + LangChain |
| **LLM** | Groq API (`gemma2-9b-it`) |
| **Alt LLM** | `llama-3.3-70b-versatile` (config swap) |
| **Database** | In-memory mock (PostgreSQL-ready) |
| **Font** | Google Inter |

---

## 📁 Project Structure

```
ASSESSMENT/
├── backend/
│   ├── app/
│   │   ├── api/endpoints/
│   │   │   ├── agent.py          # POST /agent/chat — AI agent endpoint
│   │   │   └── interaction.py    # CRUD /interaction/*
│   │   ├── core/
│   │   │   ├── config.py         # Settings (GROQ_API_KEY, MODEL_NAME)
│   │   │   └── groq_client.py    # ChatGroq LLM client
│   │   ├── database/
│   │   │   └── mock_db.py        # In-memory dict store (swap for PostgreSQL)
│   │   ├── langgraph/
│   │   │   └── workflow.py       # LangGraph StateGraph with ToolNode
│   │   ├── models/
│   │   │   └── interaction.py    # SQLAlchemy model (ready, commented out)
│   │   ├── repositories/
│   │   │   └── interaction_repo.py
│   │   ├── schemas/
│   │   │   └── interaction.py    # Pydantic schemas
│   │   ├── services/
│   │   │   └── interaction_service.py
│   │   └── tools/
│   │       └── crm_tools.py      # ★ 5 LangGraph tools
│   ├── main.py                   # FastAPI app entry point
│   ├── requirements.txt
│   └── .env                      # GROQ_API_KEY (not committed)
│
└── frontend/
    └── src/
        ├── components/
        │   ├── features/
        │   │   ├── LogForm.tsx        # Structured HCP interaction form
        │   │   └── ChatInterface.tsx  # AI chat UI with tool result cards
        │   └── ui/
        │       ├── Navbar.tsx         # Sidebar navigation
        │       └── Toast.tsx          # Notification toasts
        ├── pages/
        │   ├── Dashboard.tsx          # Stats overview + recent interactions
        │   ├── LogInteraction.tsx     # Form/Chat dual-mode page
        │   └── InteractionsList.tsx   # Table + inline edit modal
        ├── store/
        │   ├── index.ts
        │   ├── interactionSlice.ts    # Async thunks: fetch/create/update
        │   ├── chatSlice.ts           # AI chat messages state
        │   ├── authSlice.ts
        │   ├── uiSlice.ts
        │   └── agentSlice.ts
        ├── services/
        │   └── api.ts                 # Axios API client
        ├── types/
        │   └── index.ts               # TypeScript interfaces
        └── App.tsx                    # React Router routes
```

---

## 🤖 LangGraph Agent & 5 CRM Tools

The LangGraph agent uses a `StateGraph` with an **agent-tools loop**:

```
START → [Agent Node: LLM decides] → [ToolNode: executes tool] → [Agent Node: forms response] → END
```

### Tool 1: `log_interaction`
Analyzes raw field rep notes using the LLM. Extracts: HCP name, hospital, specialty, products discussed, objections, competitor mentions, sentiment, confidence score. Returns structured JSON for CRM entry.

### Tool 2: `edit_interaction`
Updates a specific field of an already-logged interaction by ID. Validates field names against the allowed schema fields before updating.

### Tool 3: `generate_follow_up_plan`
Uses the LLM to generate a strategic follow-up plan: next visit timing, priority, agenda topics, talking points, and recommended materials.

### Tool 4: `doctor_insights`
Generates an AI profile for any HCP: buying interest, prescribing behavior, communication style, best visit time, influence score, and engagement strategy.

### Tool 5: `meeting_summary_generator`
Converts long, unstructured notes into a professional CRM summary: executive summary, key takeaways, action items with owners/deadlines, overall outcome.

---

## ⚙️ Setup & Running

### Prerequisites
- **Node.js** v18+
- **Python** 3.11+

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd ASSESSMENT
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GROQ_API_KEY="your_key_here" > .env
echo MODEL_NAME="gemma2-9b-it" >> .env
```

Get your Groq API key at: https://console.groq.com/keys

### 3. Start Backend
```bash
# From backend/ directory, with venv activated:
uvicorn main:app --reload --port 8000
```
Swagger docs available at: **http://localhost:8000/docs**

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App available at: **http://localhost:5173**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/interaction/all` | Fetch all interactions |
| `POST` | `/interaction/form` | Log interaction via form |
| `PUT` | `/interaction/edit/{id}` | Edit interaction by ID |
| `GET` | `/interaction/{id}` | Get specific interaction |
| `POST` | `/agent/chat` | Chat with LangGraph AI agent |
| `GET` | `/health` | Health check |

### Example: Chat with Agent
```json
POST /agent/chat
{
  "message": "I met Dr. Priya Sharma at Apollo Hospital today. We discussed Cardivex 10mg. She was very interested but raised concerns about dosage."
}
```

---

## 🔧 Switching LLM Model

In `backend/.env`, change `MODEL_NAME`:
```env
# Default (fast, efficient)
MODEL_NAME="gemma2-9b-it"

# Switch to larger model (better reasoning)
MODEL_NAME="llama-3.3-70b-versatile"
```

---

## 🗄️ Enabling Real PostgreSQL

The backend is structured for easy database swap:

1. Uncomment `backend/app/models/interaction.py`
2. Set `DATABASE_URL=postgresql://user:password@localhost/crm_db` in `.env`
3. Replace mock calls in `interaction_repo.py` with SQLAlchemy `session.add()` / `session.commit()`
4. Run `alembic upgrade head` for migrations

---

## 📹 Demo Video

> Walk-through of the frontend, all 5 LangGraph tools, code structure, and task understanding.

---

## 📧 Submission

Submitted via: https://forms.gle/XdvLNBJkbdVDGADM8
