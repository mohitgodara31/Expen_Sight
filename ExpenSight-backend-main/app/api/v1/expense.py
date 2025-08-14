from fastapi import APIRouter, Depends
from typing import List # Import List for the response model
from app.dependencies.deps import get_current_user
from app.controllers.expense_controller import get_all_expenses,add_expense_manually
from app.schemas.expense_schema import ExpenseOut,ExpenseIn

router = APIRouter(prefix="/v1/expense", tags=["Expense"])

@router.get(
    "/",
    response_model=List[ExpenseOut],
    summary="Get All User Expenses"
)
async def get_expenses_list(current_user=Depends(get_current_user)):
    """
    Retrieves a list of all expenses associated with the authenticated user.
    """
    return await get_all_expenses(user=current_user)

@router.post("/",response_model=ExpenseOut,summary="Add Expense Manually")
async def add_expense(expense:ExpenseIn,current_user=Depends(get_current_user)):
    return await add_expense_manually(expense,current_user)
