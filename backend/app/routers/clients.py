
from fastapi.responses import StreamingResponse
import csv, io


@router.get("/clients/{id}/statement")
def client_statement(id: int, db=Depends(get_db)):
    cust = db.query(models.Customer).get(id)
    sales = db.query(models.Sale).filter_by(customer_id=id).all()
    orders = db.query(models.Order).filter_by(customer_id=id).all()
    # Build a list of {date, type, amount, balance}
    # You can calculate running balance as you go.
    return {"customer": cust, "transactions": merged_list}




@router.get("/clients/{id}/statement.csv")
def download_statement(id: int, db=Depends(get_db)):
    data = client_statement(id, db)["transactions"]
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Date","Type","Amount","Balance"])
    for tx in data:
        writer.writerow([tx.date, tx.type, tx.amount, tx.balance])
    buf.seek(0)
    return StreamingResponse(buf, media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=statement_{id}.csv"})
