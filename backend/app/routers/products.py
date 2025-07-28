# products.py
@router.post("/products", response_model=schemas.Product)
def add_product(prod: schemas.ProductCreate, db=Depends(get_db)):
    return crud.create_product(db, prod)

@router.patch("/products/{id}/price", response_model=schemas.Product)
def edit_price(id: int, price: float, db=Depends(get_db)):
    return crud.update_product_price(db, id, price)

# sales.py
@router.post("/sales", response_model=schemas.Sale)
def record_sale(sale: schemas.SaleCreate, db=Depends(get_db)):
    return crud.create_sale(db, sale)
