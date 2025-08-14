from pydantic import BaseModel

class DashboardStats(BaseModel):
    totalReceipts: int
    converted: int
    pending: int
    thisMonth: int

    class Config:
        orm_mode = True