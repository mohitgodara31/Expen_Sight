from fastapi import APIRouter,HTTPException
from app.schemas.user_schema import RegisterUserIn,LoginUserIn
from app.controllers.auth_controller import register_user as register_user_controller, login_user as login_user_controller

router = APIRouter(prefix="/v1/auth", tags=["auth"])

@router.post("/register")
async def register_user(user: RegisterUserIn):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    try:
        return await register_user_controller(user.email, user.password,user.baseCurrency)
    except HTTPException as e:
        raise e

@router.post("/login")
async def login_user(user:LoginUserIn):
    try:
        return await login_user_controller(user.email, user.password)
    except HTTPException as e:
        raise e
    