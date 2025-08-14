from pydantic import BaseModel
from datetime import datetime
from .receipt_schema import ReceiptSchema # Import the new schema
from typing import Optional
class ExpenseIn(BaseModel):
    amount: float
    currency: str
    category: str
    date: str

class ExpenseOut(BaseModel):
    """A simplified Expense model for nesting in the response."""
    id: int
    amount: float
    currency: str
    category: str
    date: datetime
    status: str
    convertedAmount: Optional[float] = None  # ✅ Optional float
    conversionCurrency: Optional[str] = None
    receipt: Optional[ReceiptSchema] = None

    class Config:
        orm_mode = True

class ReconciledInfo(BaseModel):
    convertedAmount: float
    conversionCurrency: str

class ExpenseSchema(BaseModel):
    id: int
    amount: float
    currency: str
    category: str
    date: str
    createdAt: str
    receipt: Optional[ReceiptSchema] = None
    
    # These are the crucial fields that need to be in the schema
    status: str
    convertedAmount: Optional[float] = None
    conversionCurrency: Optional[str] = None
    fxRate: Optional[float] = None

    class Config:
        orm_mode = True
