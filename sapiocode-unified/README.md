# SapioCode - Intelligent Learning Platform

A single-player, AI-assisted educational coding platform designed to support a student's cognitive learning journey.

## Features

- **Skill Tree Progression** - 5 topics with 30 questions, unlock new stages as you master concepts
- **Monaco Editor** - VS Code-quality code editing with Python support
- **Socratic AI Tutor** - Get hints without direct answers (powered by Groq LLM)
- **Behavioral Telemetry** - Tracks idle time, backspace rate, run count to estimate frustration
- **Viva Verification** - Oral defense after solving problems to verify understanding
- **Progress Tracking** - MongoDB-backed progress persistence

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND (Port 3000)                 │
│  /login  /register  /dashboard  /progress  /workbench          │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Auth Backend   │  │   AI Backend    │  │    JDoodle      │
│   Port 8000     │  │   Port 8002     │  │   (External)    │
├─────────────────┤  ├─────────────────┤  └─────────────────┘
│ /auth/register  │  │ /api/agent/chat │
│ /auth/login     │  │ /api/analyze    │
│ /progress/*     │  │ /api/viva/*     │
│ /sessions/*     │  │                 │
├─────────────────┤  ├─────────────────┤
│    MongoDB      │  │   Groq LLM      │
└─────────────────┘  │   AST Parser    │
                     └─────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB (Atlas or local)

### 1. Clone and Setup

```bash
cd sapiocode-unified
```

### 2. Environment Variables

Create `.env.local` in `frontend/`:

```env
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
NEXT_PUBLIC_AUTH_API_URL=http://localhost:8000
NEXT_PUBLIC_AI_API_URL=http://localhost:8002/api
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

Create `.env` in `backend/ai/`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_PRIMARY_MODEL=moonshotai/kimi-k2-instruct
GROQ_FALLBACK_MODEL=llama-3.3-70b-versatile
PORT=8002
```

### 3. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Auth Backend
cd ../backend/auth
pip install -r requirements.txt

# AI Backend
cd ../ai
pip install -r requirements.txt
```

### 4. Run Services

```bash
# Terminal 1 - Auth Backend
cd backend/auth
uvicorn main:app --reload --port 8000

# Terminal 2 - AI Backend
cd backend/ai
uvicorn app.main:app --reload --port 8002

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### 5. Open Browser

Navigate to http://localhost:3000

## Curriculum

| Topic | Questions | Unlock Requirement |
|-------|-----------|-------------------|
| Variables & Basics | 6 | Default unlocked |
| Conditionals | 6 | 75% of Topic 1 |
| Loops | 6 | 75% of Topic 2 |
| Arrays & Lists | 6 | 75% of Topic 3 |
| Strings | 6 | 75% of Topic 4 |

## Cognitive Loop

```
Problem → Code → Telemetry → Frustration Score
    ↓
AI Hint (gentle/socratic/challenge based on frustration)
    ↓
Run Code (JDoodle) → Test Cases
    ↓
All Pass? → Viva Modal → Verify Understanding
    ↓
Pass → Update Progress → Unlock Next Topic
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, Monaco Editor, Tailwind CSS
- **Auth Backend**: FastAPI, MongoDB, JWT
- **AI Backend**: FastAPI, LangGraph, Groq (Kimi K2 / Llama 3.3)
- **Code Execution**: JDoodle API

## Project Structure

```
sapiocode-unified/
├── frontend/
│   ├── app/              # Next.js pages
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utils, API clients, types
│   └── package.json
│
├── backend/
│   ├── auth/             # Authentication & Progress
│   │   ├── main.py
│   │   ├── auth_routes.py
│   │   ├── progress_routes.py
│   │   └── session_routes.py
│   │
│   └── ai/               # Socratic AI Engine
│       ├── app/
│       │   ├── main.py
│       │   ├── api/routes.py
│       │   └── services/
│       │       ├── orchestrator.py
│       │       ├── ast_parser.py
│       │       ├── groq_client.py
│       │       └── viva.py
│       └── requirements.txt
│
└── docker-compose.yml
```

## API Reference

### Auth Backend (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Create new user |
| POST | /auth/login | Authenticate user |
| GET | /progress/{user_id} | Get user progress |
| POST | /progress/complete | Record completed question |
| POST | /sessions/create | Create AI session |
| GET | /sessions/{user_id} | Get session data |

### AI Backend (Port 8002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/agent/chat | Socratic chat (hint/chat/viva modes) |
| POST | /api/analyze | Raw AST analysis |
| GET | /health | Health check |

## Deployment

### Docker Compose

```bash
docker-compose up --build
```

### Individual Services

- **Frontend**: Vercel
- **Auth Backend**: Railway / fly.io
- **AI Backend**: Railway / fly.io
- **MongoDB**: MongoDB Atlas

## License

MIT
