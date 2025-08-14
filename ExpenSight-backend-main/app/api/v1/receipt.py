from fastapi import APIRouter,Depends,UploadFile, File
from app.dependencies.deps import get_current_user
from app.controllers.receipt_controller import upload_receipt_file


router = APIRouter(prefix="/v1/receipt",tags=["Receipt Upload"])

UPLOAD_DIR = "temp_uploads"

@router.post("/upload")
async def upload_receipt(file:UploadFile = File(...), current_user: str = Depends(get_current_user)):
    """
    Endpoint to upload a receipt file.
    """
    return await upload_receipt_file(file, current_user)