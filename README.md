# Cluck Credit Tracker
Frontend for managing your chicken-shop customer credits.

## Backend (FastAPI)

We've scaffolded a FastAPI backend to serve customer and order data.

### Quickstart

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs will appear at http://localhost:8000/docs
