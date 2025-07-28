from datetime import datetime
from pydantic import BaseModel

class OrderBase(BaseModel):
    date: datetime
    amount: float
    paid: bool

class OrderCreate(OrderBase):
    customer_id: int

class Order(OrderBase):
    id: int
    class Config:
        orm_mode = True

class CustomerBase(BaseModel):
    name: str
    phone: str

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    orders: list[Order] = []
    class Config:
        orm_mode = True
