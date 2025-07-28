# backend/app/schemas/transaction.py

from pydantic import BaseModel

class Transaction(BaseModel):
    name: str
    phone_number: str
    amount: float
    type: str  # "credit" or "repayment"
