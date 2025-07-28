from sqlalchemy.orm import Session
from . import models, schemas

def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_cust = models.Customer(name=customer.name, phone=customer.phone)
    db.add(db_cust)
    db.commit()
    db.refresh(db_cust)
    return db_cust

# products
def create_product(db, prod: schemas.ProductCreate):
    dbp = models.Product(**prod.dict())
    db.add(dbp); db.commit(); db.refresh(dbp)
    return dbp

def update_product_price(db, product_id, new_price):
    p = db.query(models.Product).get(product_id)
    p.price = new_price; db.commit(); db.refresh(p)
    return p

# sales
def create_sale(db, sale: schemas.SaleCreate):
    prod = db.query(models.Product).get(sale.product_id)
    total = prod.price * sale.quantity
    dbs = models.Sale(**sale.dict(), total_price=total)
    db.add(dbs); db.commit(); db.refresh(dbs)
    return dbs
