from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import customers

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cluck Credit API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)

@app.get("/")
def read_root():
    return {"message": "Cluck Credit API is up!"}
