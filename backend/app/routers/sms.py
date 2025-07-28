from fastapi import APIRouter
from pydantic import BaseModel
from app.utils.sms import send_transaction_sms

router = APIRouter()

class SMSPayload(BaseModel):
    name: str
    phone_number: str
    amount: float
    type: str  # "credit" or "repayment"

@router.post("/send-transaction-sms")
async def send_sms(payload: SMSPayload):
    message = (
        f"{payload.name} has taken ₹{payload.amount} credit."
        if payload.type == "credit"
        else f"{payload.name} has repaid ₹{payload.amount}."
    )

    try:
        response = await send_transaction_sms(payload.phone_number, message)
        if response.status_code == 200:
            return {"status": "sent"}
        else:
            return {"status": "error", "detail": response.text}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

