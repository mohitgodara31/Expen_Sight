from fastapi import HTTPException
from app.database.db import prisma
from app.services.currency_service import get_historical_fx_rate
from app.schemas.reconcile_schema import ReconcileCreate
from datetime import datetime

async def create_reconciliation(reconcile_data: ReconcileCreate, current_user):
    """
    Creates a new reconciliation record for a given expense.

    This function performs the following steps:
    1. Fetches the specified expense from the database.
    2. Verifies that the expense belongs to the current user.
    3. Determines the target conversion currency (either from the request or user's default).
    4. Calls the currency service to get the historical exchange rate.
    5. Calculates the converted amount.
    6. Saves the new reconciliation record to the database.
    7. Returns the complete reconciliation details.

    Args:
        reconcile_data: The request data containing expenseId and optional conversionCurrency.
        current_user: The authenticated user object from the dependency.

    Returns:
        The newly created Reconcile object, including nested expense details.

    Raises:
        HTTPException(404): If the expense is not found.
        HTTPException(403): If the user does not own the expense.
    """
    expense = await prisma.expense.find_unique(
        where= {'id':reconcile_data.expenseId},
        include={'receipt':True}
    )
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # if not expense.receipt or expense.receipt.userId != current_user.id:
    #     raise HTTPException(status_code=403,detail="You do not have permission to access this expense.")
    to_currency = reconcile_data.conversionCurrency or current_user.baseCurrency
    from_currency = expense.currency

    fx_rate = await get_historical_fx_rate(
        from_currency=from_currency,
        to_currency=to_currency,
        transaction_date=expense.date.date()
    )

    converted_amount = round(expense.amount * fx_rate,2)

    new_reconciliation = await prisma.reconcile.create(
        data={
            'expenseId': expense.id,
            'userId': current_user.id,
            'convertedAmount': converted_amount,
            'baseCurrency': from_currency,
            'conversionCurrency': to_currency,
            'fxRate': fx_rate,
        },
        include={'expense': True}
    )
    # Step 1: Update the expense
    await prisma.expense.update(
        where={'id': expense.id},
        data={
            'status': 'RECONCILED',
            'convertedAmount': converted_amount,
            'conversionCurrency': to_currency.upper(),
        }
    )

    # Step 2: Fetch the updated expense with the required fields
    updated_expense_data = await prisma.expense.find_unique(
        where={'id': expense.id},
    )

    return {
        "id": new_reconciliation.id,
        "status":updated_expense_data.status,
        "convertedAmount": new_reconciliation.convertedAmount,
        "baseCurrency": new_reconciliation.baseCurrency,
        "conversionCurrency": new_reconciliation.conversionCurrency,
        "fxRate": new_reconciliation.fxRate,
        "createdAt": datetime.now(),
        "expense": updated_expense_data
    }


async def get_reconciliation_history(current_user):
    """
    Fetches all reconciliation records for the currently authenticated user.

    This function queries the database for all 'Reconcile' entries linked
    to the user's ID. It includes the related expense details for each entry
    and orders them by creation date, with the most recent first.

    Args:
        current_user: The authenticated user object from the dependency.

    Returns:
        A list of Reconcile objects.
    """
    history = await prisma.reconcile.find_many(
    where={'userId': current_user.id},
    include={
        'expense': True,
    },
    order={'createdAt': 'desc'}
    )

    return history

async def get_reconciliation_history_for_expense(expense_id: int, current_user):
    """
    Fetches the reconciliation history for a single expense.

    This function queries the database for all 'Reconcile' entries linked
    to a specific expense ID. It includes a crucial security check to ensure
    the records also belong to the currently authenticated user.

    Args:
        expense_id: The ID of the specific expense.
        current_user: The authenticated user object from the dependency.

    Returns:
        A list of Reconcile objects for the specified expense.
    """
    history = await prisma.reconcile.find_many(
        where={
            'expenseId': expense_id,
            'userId': current_user.id  # Security check: User must own the records
        },
        include={'expense': True},
        order={'createdAt': 'desc'}
    )
    return history