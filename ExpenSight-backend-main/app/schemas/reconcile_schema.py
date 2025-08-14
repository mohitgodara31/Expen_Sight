from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# --- Request Schemas ---

class ReconcileCreate(BaseModel):
    """
    Schema for the request body when creating a new reconciliation.
    The user must provide the expense ID and can optionally provide a target currency.
    If conversionCurrency is omitted, the user's default base currency will be used.
    """
    expenseId: int = Field(..., gt=0, description="The ID of the expense to be reconciled.")
    conversionCurrency: Optional[str] = Field(None, description="The currency to convert to (e.g., 'USD'). Defaults to user's base currency.")


# --- Response Schemas ---

class ExpenseForReconcile(BaseModel):
    """A simplified Expense model for nesting in the response."""
    id: int
    amount: float
    currency: str
    category: str
    status: str
    date: datetime

    class Config:
        from_attributes = True # Replaces orm_mode = True

class ReconcileResponse(BaseModel):
    """
    Schema for the response after a successful reconciliation.
    This provides full details of the conversion and the original expense.
    """
    id: int
    convertedAmount: float
    baseCurrency: Optional[str] = None
    conversionCurrency: Optional[str] = None
    fxRate: Optional[float] = None
    createdAt: Optional[datetime] = None
    expense: ExpenseForReconcile

    class Config:
        from_attributes = True

class ReconciliationHistoryResponse(BaseModel):
    """
    Schema for the history endpoint, returning a list of reconciliations.
    """
    message: str
    reconciliation_history: list[ReconcileResponse]

