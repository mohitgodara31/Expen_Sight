from fastapi import APIRouter, Depends
from app.dependencies.deps import get_current_user
from app.controllers.user_controller import get_me,update_base_currency
from app.schemas.user_schema import UserSettingsUpdate


router = APIRouter(prefix="/v1/user/profile", tags=["user"])

@router.get("/")
async def me(current_user=Depends(get_current_user)):
    return await get_me(current_user)

# @router.delete("/settings/delete")
# async def delete_me(current_user=Depends(get_current_user)):
#     return await delete_current_user(current_user)

@router.patch("/settings/update/")
async def update_base(settings:UserSettingsUpdate,current_user = Depends(get_current_user)):
    return await update_base_currency(settings,current_user)