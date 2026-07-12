# PharmaCRM – AI-First CRM for Life Sciences

PharmaCRM is an AI-powered CRM application built for life sciences field representatives. It combines a structured CRM form with a conversational AI assistant to make HCP interaction logging faster, smarter, and more complete.

---

## 🚀 What This Project Provides

- **Structured CRM data capture** for doctor name, hospital, specialty, products, objections, sentiment, follow-up, and notes.
- **AI-assisted auto-fill** of form fields from natural meeting notes.
- **Split page workflow** with the form on the left and AI chat on the right.
- **Dynamic sidebar** that collapses and expands.
- **AI tools** for follow-up planning, doctor insights, and meeting summaries.

---

## 🧠 System Architecture

### Frontend

- Built with **React + Vite + TypeScript**.
- Uses **Redux Toolkit** for app state.
- Contains pages for Dashboard, Log Interaction, and Interactions List.
- The Log Interaction page uses a **split layout** and auto-fills form fields from chat output.
- Sidebar navigation supports **collapsed and expanded** states.

### Backend

- Built with **FastAPI**.
- Exposes REST endpoints for **interaction CRUD** and **AI chat**.
- Uses **Pydantic** for validation and clear typed models.
- Supports **SQLite by default** and can be configured for PostgreSQL.

### AI Layer

- Uses **LangGraph** + **LangChain** to orchestrate AI tool calls.
- The AI agent receives user prompts and selects one of the available tools:
  - `log_interaction`
  - `edit_interaction`
  - `generate_follow_up_plan`
  - `doctor_insights`
  - `meeting_summary_generator`
- Tool outputs are parsed as JSON and returned as `extracted_data`.
- Frontend maps `extracted_data` into the CRM form automatically.

---

## 📁 Project Structure

```
ASSESSMENT/
├── backend/
│   ├── app/
│   │   ├── api/endpoints/
│   │   │   ├── agent.py          # AI chat endpoint
│   │   │   └── interaction.py    # interaction CRUD router
│   │   ├── core/
│   │   │   ├── config.py         # environment settings
│   │   │   └── groq_client.py    # Groq LLM client helper
│   │   ├── database/
│   │   │   └── session.py        # SQLAlchemy engine/session
│   │   ├── langgraph/
│   │   │   └── workflow.py       # LangGraph workflow definition
│   │   ├── models/
│   │   │   └── interaction.py    # SQLAlchemy model
│   │   ├── repositories/
│   │   │   └── interaction_repo.py
│   │   ├── schemas/
│   │   │   └── interaction.py    # Pydantic schemas
│   │   ├── services/
│   │   │   └── interaction_service.py
│   │   └── tools/
│   │       └── crm_tools.py      # AI tool prompt definitions
│   ├── main.py                   # FastAPI app entrypoint
│   ├── requirements.txt
│   └── .env                      # environment variables
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── features/
    │   │   │   ├── LogForm.tsx
    │   │   │   └── ChatInterface.tsx
    │   │   └── ui/
    │   │       ├── Navbar.tsx
    │   │       └── Toast.tsx
    │   ├── hooks/
    │   │   └── useTypedDispatch.ts
    │   ├── pages/
    │   │   ├── Dashboard.tsx
    │   │   ├── LogInteraction.tsx
    │   │   └── InteractionsList.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── store/
    │   │   ├── agentSlice.ts
    │   │   ├── authSlice.ts
    │   │   ├── chatSlice.ts
    │   │   ├── interactionSlice.ts
    │   │   ├── uiSlice.ts
    │   │   └── index.ts
    │   ├── types/
    │   │   └── index.ts
    │   └── App.tsx
    ├── package.json
    └── tsconfig.json
```

---

## 🔧 Setup Instructions

### Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GROQ_API_KEY="your_groq_api_key"
MODEL_NAME="gemma2-9b-it"
```

### Start Backend

```bash
python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Open the app at **http://localhost:5173**

---

## 🔑 AI Keys and Environment Variables

Required:

```env
GROQ_API_KEY="your_groq_api_key"
MODEL_NAME="gemma2-9b-it"
```

Optional:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/crm_db"
```

Switch to a stronger model:

```env
MODEL_NAME="llama-3.3-70b-versatile"
```

---

## 🌐 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/interaction/all` | Retrieve saved interactions |
| `POST` | `/interaction/form` | Save CRM form data |
| `PUT` | `/interaction/edit/{id}` | Update a saved interaction |
| `GET` | `/interaction/{id}` | Get a single interaction |
| `POST` | `/agent/chat` | Send prompt to the AI agent |
| `GET` | `/health` | Health check |

### Example AI Chat Request

```json
POST /agent/chat
{
  "message": "I met Dr. Priya Sharma at Fortis Hospital today to discuss Cardivex 10mg. She was concerned about side effects and asked for a follow-up visit."
}
```

---

## 📘 How the System Works

### Frontend Flow

- **Log Interaction page** shows a split layout with the CRM form on the left and AI chat on the right.
- **ChatInterface** sends text to the backend and receives AI response + extracted data.
- **LogForm** can accept extracted field values and update the form state.
- **Navbar** supports a collapsible sidebar.

### Backend Flow

- **FastAPI** exposes `/agent/chat` and `/interaction/*` routes.
- **Agent endpoint** invokes the LangGraph workflow.
- **AI tool output** is parsed and returned as JSON in `extracted_data`.
- **Frontend mapping** maps extracted keys to the CRM form.

### AI Workflow

1. User enters the meeting information or task in chat.
2. Backend sends the prompt to LangGraph.
3. LangGraph chooses the appropriate tool.
4. Tool returns JSON data like `hcp_name`, `hospital`, `products_discussed`, `sentiment`, etc.
5. Frontend uses those values to auto-fill the form.

---

## 💡 Notes

- Keep `.env` secrets hidden.
- Use the AI chat when notes are free-form.
- Use the structured form for manual review and correction.
- The backend is modular and can be extended with new tools.

---

## ✅ Summary

This application demonstrates a complete AI-first CRM workflow:

- Structured HCP interaction logging
- Natural language AI extraction
- Dynamic sidebar layout
- Modular backend and frontend design
- AI tool-based interaction support

---

## 🗂️ Original README (Legacy Content)

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
| **Database** | SQLite (default) / PostgreSQL (via SQLAlchemy) |
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
```

Create `.env`:

```env
GROQ_API_KEY="your_key_here"
MODEL_NAME="gemma2-9b-it"
```

### 3. Start Backend

```bash
python -m uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup

```bash
cd ../frontend
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

## 🗄️ Database

By default, the backend uses **SQLite** (`crm.db` file created automatically). To switch to **PostgreSQL**:

1. Install PostgreSQL and create a database
2. Set `DATABASE_URL=postgresql://user:password@localhost:5432/crm_db` in `backend/.env`
3. Restart the backend — tables are created automatically on startup

---

## 📹 Demo Video

> Walk-through of the frontend, all 5 LangGraph tools, code structure, and task understanding.

---

## 📧 Submission

Submitted via: https://forms.gle/XdvLNBJkbdVDGADM8

'@
Set-Content README.md -Value $md -Encoding utf8
Get-Content README.md -Encoding utf8 | Select-Object -First 6