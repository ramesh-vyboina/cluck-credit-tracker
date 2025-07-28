from app.routers import products, sales
app.include_router(products.router, prefix="/api")
app.include_router(sales.router, prefix="/api")
