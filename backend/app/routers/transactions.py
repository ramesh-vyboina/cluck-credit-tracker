# backend/app/routes/transactions.py

from fastapi import APIRouter
from app.schemas.transaction import Transaction
from app.utils.sms import send_sms

router = APIRouter()

@router.post("/send-transaction-sms")
def send_transaction_sms(data: Transaction):
    if data.type == "credit":
        msg = f"Dear {data.name}, ₹{data.amount} credited to your account. Please return soon. - Cluck Shop"
    elif data.type == "repayment":
        msg = f"Thank you {data.name} for paying ₹{data.amount}. - Cluck Shop"
    else:
        return {"status": "error", "message": "Invalid transaction type"}

    result = send_sms(data.phone_number, msg)
    return {"status": "sent", "sms_response": result}
