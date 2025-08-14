from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import prisma
import logging
from app.api.v1.auth import router as auth_router
from app.api.v1.user import router as user_router
from app.api.v1.receipt import router as receipt_router
from app.api.v1.reconcile import router as reconcile_router
from app.api.v1.expense import router as expense_router
from app.api.v1 import dashboard as dashboard_router


logging.basicConfig(level=logging.INFO)

async def lifespan(app:FastAPI):
    logging.info("Connecting to Prisma")
    await prisma.connect()
    yield
    logging.info("Disconnecting from Prisma")
    await prisma.disconnect()

app = FastAPI(title="ExpenSight",lifespan=lifespan)

origins = [
    "http://localhost:5173", # The default for Vite React
    "http://localhost:3000", # The default for Create React App
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(receipt_router)
app.include_router(expense_router)
app.include_router(reconcile_router)
app.include_router(dashboard_router.router)


@app.get("/")
async def root():
    return {"message": "Expensight API running!"} 