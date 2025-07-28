# backend/main.py
# To run this:
# 1. Make sure you are in the 'backend' directory.
# 2. Run 'pip install -r requirements.txt'
# 3. Run 'uvicorn main:app --reload'

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.app.routers import transactions
from typing import List, Dict, Optional
from datetime import datetime
import uuid

# --- Pydantic Models (Data Schemas) ---
# These define the structure of your data.

class Client(BaseModel):
    id: str = ""
    name: str
    contact: Optional[str] = None
    totalCredit: float = 0.0
    totalPaid: float = 0.0

class Sale(BaseModel):
    id: str = ""
    clientId: str
    quantity: float
    pricePerKg: float
    totalAmount: float
    date: datetime = datetime.now()

class Payment(BaseModel):
    id: str = ""
    clientId: str
    amount: float
    date: datetime = datetime.now()

class Supplier(BaseModel):
    id: str = ""
    name: str
    contact: Optional[str] = None

class Purchase(BaseModel):
    id: str = ""
    supplierId: str
    quantity: float
    totalCost: float
    date: datetime = datetime.now()


# --- FastAPI Application Initialization ---
app = FastAPI(
    title="Cluck Credit Tracker API",
    description="Backend API for the Chicken Shop Credit Management Application.",
    version="1.0.0"
)

# --- CORS Middleware ---
# This allows your HTML frontend to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- In-Memory Database ---
# A simple dictionary to store data while the app is running.
# This will be replaced by your Azure database later.
db: Dict[str, List] = {
    "clients": [],
    "sales": [],
    "payments": [],
    "suppliers": [],
    "purchases": []
}

# --- API Endpoints ---

@app.get("/")
def read_root():
    """Root endpoint to check if the API is running."""
    return {"message": "Welcome to the Cluck Credit Tracker API!"}

# --- Client Endpoints ---

@app.get("/api/clients", response_model=List[Client])
def get_clients():
    """Fetch all clients."""
    return db["clients"]

@app.post("/api/clients", response_model=Client)
def create_client(client: Client):
    """Create a new client."""
    client.id = str(uuid.uuid4())
    db["clients"].append(client)
    return client

# --- Sale & Payment Endpoints ---

@app.post("/api/sales", response_model=Sale)
def record_sale(sale: Sale):
    """Record a new sale and update client's credit."""
    sale.id = str(uuid.uuid4())
    db["sales"].append(sale)
    
    # Update client's total credit
    for client in db["clients"]:
        if client.id == sale.clientId:
            client.totalCredit += sale.totalAmount
            break
    else:
        raise HTTPException(status_code=404, detail=f"Client with ID {sale.clientId} not found")
        
    return sale

@app.post("/api/payments", response_model=Payment)
def record_payment(payment: Payment):
    """Record a new payment and update client's paid amount."""
    payment.id = str(uuid.uuid4())
    db["payments"].append(payment)

    # Update client's total paid
    for client in db["clients"]:
        if client.id == payment.clientId:
            client.totalPaid += payment.amount
            break
    else:
        raise HTTPException(status_code=404, detail=f"Client with ID {payment.clientId} not found")

    return payment

# --- Supplier Endpoints (New Feature) ---

@app.get("/api/suppliers", response_model=List[Supplier])
def get_suppliers():
    """Fetch all suppliers."""
    return db["suppliers"]

@app.post("/api/suppliers", response_model=Supplier)
def create_supplier(supplier: Supplier):
    """Create a new supplier."""
    supplier.id = str(uuid.uuid4())
    db["suppliers"].append(supplier)
    return supplier

# --- Purchase Endpoints (New Feature) ---

@app.get("/api/purchases", response_model=List[Purchase])
def get_purchases():
    """Fetch all purchase records."""
    # In a real app, you might want to join this with supplier info.
    return db["purchases"]

@app.post("/api/purchases", response_model=Purchase)
def record_purchase(purchase: Purchase):
    """Record a new purchase from a supplier."""
    purchase.id = str(uuid.uuid4())
    
    # Check if supplier exists
    supplier_exists = any(s.id == purchase.supplierId for s in db["suppliers"])
    if not supplier_exists:
        raise HTTPException(status_code=404, detail=f"Supplier with ID {purchase.supplierId} not found")

    db["purchases"].append(purchase)
    return purchase

# --- Example Data (for testing) ---
def add_example_data():
    # Example Client
    example_client = Client(id="client-1", name="Blue Moon Restaurant", contact="Mr. Sharma", totalCredit=1500, totalPaid=500)
    db["clients"].append(example_client)
    # Example Supplier
    example_supplier = Supplier(id="supplier-1", name="Sneha Farms", contact="Sales Rep")
    db["suppliers"].append(example_supplier)

add_example_data()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # update for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)