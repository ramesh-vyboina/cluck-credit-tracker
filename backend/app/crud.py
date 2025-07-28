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
