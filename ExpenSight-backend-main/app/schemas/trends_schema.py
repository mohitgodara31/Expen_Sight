from pydantic import BaseModel
from typing import List

class TrendPoint(BaseModel):
    name: str  # e.g., "Jan", "Feb"
    total: float

class TrendsData(BaseModel):
    data: List[TrendPoint]