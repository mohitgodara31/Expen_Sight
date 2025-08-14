from fastapi import APIRouter, Depends
from app.database.db import prisma
from app.dependencies.deps import get_current_user
from app.schemas.dashboard_schema import DashboardStats
from app.controllers import dashboard_controller
from app.schemas.trends_schema import TrendsData 

router = APIRouter(
    prefix="/v1/dashboard",
    tags=["Dashboard"],
    responses={404: {"description": "Not found"}},
)

@router.get("/stats", response_model=DashboardStats)
async def read_dashboard_stats(
    current_user =Depends(get_current_user)
):
    """
    Retrieve aggregated statistics for the user's dashboard.
    """
    stats = await dashboard_controller.get_dashboard_stats(current_user)
    return stats

@router.get("/trends", response_model=TrendsData)
async def read_expense_trends(
    current_user = Depends(get_current_user)
):
    """
    Retrieve expense trends for the last 6 months.
    """
    trends_data = await dashboard_controller.get_expense_trends(user=current_user)
    return trends_data