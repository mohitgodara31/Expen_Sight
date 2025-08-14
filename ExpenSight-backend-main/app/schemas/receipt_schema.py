from pydantic import BaseModel
from datetime import datetime

class ReceiptBase(BaseModel):
    filename: str

class ReceiptSchema(ReceiptBase):
    id: int
    uploadedAt: datetime
    userId: int

    class Config:
        orm_mode = True