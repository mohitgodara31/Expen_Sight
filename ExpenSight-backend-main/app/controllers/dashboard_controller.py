from datetime import datetime, timedelta,date
from calendar import month_abbr
from app.database.db import prisma

async def get_dashboard_stats(current_user):
    """
    Calculates dashboard statistics for the given user.
    """
    # Get the start and end of the current month
    today = date.today()
    start_of_month = datetime(today.year, today.month, 1)
    
    # --- Perform database queries concurrently ---
    
    # 1. Get total number of expenses for the user
    total_receipts_count = await prisma.expense.count(
        where={'userId': current_user.id}
    )

    # 2. Get number of unique expenses that have been reconciled
    distinct_expenses = await prisma.reconcile.group_by(
    by=['expenseId'],
    where={'userId': current_user.id}
)
    reconciled_count = len(distinct_expenses)



    # 3. Get number of expenses created this month
    this_month_count = await prisma.expense.count(
        where={
            'userId': current_user.id,
            'createdAt': {
                'gte': start_of_month
            }
        }
    )

    # 4. Calculate pending count
    pending_count = total_receipts_count - reconciled_count

    # --- Assemble the response ---
    stats = {
        "totalReceipts": total_receipts_count,
        "converted": reconciled_count,
        "pending": pending_count,
        "thisMonth": this_month_count,
    }

    return stats


async def get_expense_trends(user):
    """
    Final corrected version for expense trends.
    This adds explicit ::timestamp casts to the SQL query to fix the operator error.
    """
    trends = []
    today = datetime.now()

    for i in range(5, -1, -1):
        current_month_num = today.month - i
        current_year = today.year
        if current_month_num <= 0:
            current_month_num += 12
            current_year -= 1
        
        month_start = datetime(current_year, current_month_num, 1)
        
        if month_start.month == 12:
            month_end = month_start.replace(year=month_start.year + 1, month=1) - timedelta(seconds=1)
        else:
            month_end = month_start.replace(month=month_start.month + 1) - timedelta(seconds=1)

        # The key fix is adding `::timestamp` to cast the parameters
        result = await prisma.query_raw(
            """
            SELECT SUM("amount") as total FROM "expenses" 
            WHERE "userId" = $1 AND "date" >= $2::timestamp AND "date" <= $3::timestamp
            """,
            user.id,
            month_start,
            month_end
        )
        
        month_name = month_abbr[month_start.month]
        total_amount = result[0]['total'] if result and result[0]['total'] is not None else 0

        trends.append({
            "name": month_name,
            "total": float(total_amount)
        })
        
    return {"data": trends}