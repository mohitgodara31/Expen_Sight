from fastapi import APIRouter, Depends
from app.schemas.reconcile_schema import ReconcileCreate, ReconcileResponse,ReconciliationHistoryResponse
from app.controllers import reconcile_controller
from app.dependencies.deps import get_current_user
from typing import Optional

router = APIRouter(
    prefix="/v1/reconcile",
    tags=["Reconciliation"]
)

@router.post("/",response_model=ReconcileResponse)
async def reconcile_expense(reconcile_data: ReconcileCreate, current_user = Depends(get_current_user)):
    new_reconciliation = await reconcile_controller.create_reconciliation(reconcile_data=reconcile_data,current_user=current_user)
    return new_reconciliation

@router.get(
    "/history",
    response_model=ReconciliationHistoryResponse,
    summary="Get Reconciliation History",
    description="Retrieves a list of all currency conversions performed by the user."
)
async def get_history(current_user = Depends(get_current_user)):
    """
    This endpoint fetches the complete reconciliation history for the
    authenticated user.
    """
    history_list = await reconcile_controller.get_reconciliation_history(
        current_user=current_user
    )
    
    # We wrap the list in a dictionary to match the ReconciliationHistoryResponse schema
    return {
        "message": "History fetched successfully",
        "reconciliation_history": history_list
    }

@router.get(
    "/history_specific",
    response_model=ReconciliationHistoryResponse,
    summary="Get History for a Specific Expense",
    description="Retrieves the currency conversion history for a single expense."
)
async def get_specific_expense_history(
    expense_id: Optional[int] = None,
    current_user = Depends(get_current_user)
):
    """
    This endpoint fetches the complete reconciliation history for a single
    expense, ensuring the records belong to the authenticated user.
    """
    history_list = await reconcile_controller.get_reconciliation_history_for_expense(
        expense_id=expense_id,
        current_user=current_user
    )
    
    return {
        "message": f"History for expense ID {expense_id} fetched successfully",
        "reconciliation_history": history_list
    }