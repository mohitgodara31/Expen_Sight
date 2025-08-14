from fastapi import HTTPException
from app.database.db import prisma
from app.schemas.expense_schema import ExpenseIn
from datetime import datetime
from typing import Optional

# async def get_all_expenses(user,start_date: Optional[datetime] = None, end_date: Optional[datetime] = None):
#     where_clause = {'userId': user.id}
#     if start_date:
#         where_clause['date'] = {'gte': start_date}
#     if end_date:
#         if 'date' in where_clause:
#             where_clause['date']['lte'] = end_date
#         else:
#             where_clause['date'] = {'lte': end_date}
    
#     # The key change is adding include={'receipt': True}
#     expenses = await prisma.expense.find_many(
#         where=where_clause,
#         order={'date': 'desc'},
#         include={'receipt': True} # This tells Prisma to join the related receipt
#     )
#     return expenses


async def add_expense_manually(expense:ExpenseIn,current_user):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not Authenticated")
    
    ex = await prisma.expense.create(
        data={
            'amount': expense.amount,
                'currency': expense.currency.upper(),
                'category': expense.category,
                'date': datetime.now(),
                'userId':current_user.id
        }
    )
    return ex


# ... existing function ...
async def get_all_expenses(user,start_date: Optional[datetime] = None, end_date: Optional[datetime] = None, limit: Optional[int] = None):
    
    where_clause = {'userId': user.id}
    if start_date:
        where_clause['date'] = {'gte': start_date}
    if end_date:
        if 'date' in where_clause:
            where_clause['date']['lte'] = end_date
        else:
            where_clause['date'] = {'lte': end_date}
    
    # The query is very simple now. It fetches the full Expense object,
    # which now includes the status and convertedAmount fields.
    expenses = await prisma.expense.find_many(
        where=where_clause,
        order={'createdAt': 'desc'},
        take=limit,
        include={'receipt': True}
    )

    # We return the raw Prisma models and let FastAPI serialize them using the schema
    return expenses
