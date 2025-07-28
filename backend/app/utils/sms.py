import os
import httpx


async def send_transaction_sms(phone_number: str, message: str):
    api_key = os.getenv("FAST2SMS_API_KEY")
    if not api_key:
        raise ValueError("FAST2SMS_API_KEY not set")

    sms_data = {
        "authorization": api_key,
        "message": message,
        "language": "english",
        "route": "q",
        "numbers": phone_number,
    }

    async with httpx.AsyncClient() as client:
        return await client.post("https://www.fast2sms.com/dev/bulkV2", data=sms_data)


def send_sms(phone_number: str, message: str):
    import os
    import requests

    api_key = os.getenv("FAST2SMS_API_KEY")
    if not api_key:
        print("❌ API Key not loaded from .env")
        return

    sms_data = {
        "authorization": api_key,
        "sender_id": "FSTSMS",
        "message": message,
        "language": "english",
        "route": "q",
        "numbers": phone_number,
    }

    response = requests.post("https://www.fast2sms.com/dev/bulkV2", data=sms_data)
    
    # 🔍 Log everything
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)

    return response.text
