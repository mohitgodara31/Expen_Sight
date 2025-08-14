from app.schemas.user_schema import RegisterUserOut, LoginUserOut
from app.security.jwt import create_access_token
from app.security.hash import hash_password, verify_password
from app.database.db import prisma
from fastapi import HTTPException

async def register_user(email:str,password:str,baseCurrency:str) -> RegisterUserOut:
    existing_user = await prisma.users.find_first(
        where= {
            "email": email
        }
    )
    if existing_user:
        raise HTTPException(status_code= 400, detail="Email already registered")
    hashed_password = hash_password(password)
    await prisma.users.create(
        data={
            "email": email,
            "hashedPassword": hashed_password,
            "baseCurrency":baseCurrency.upper()
        }
    )
    return RegisterUserOut(message="User registered successfully", email=email,baseCurrency=baseCurrency)


async def login_user(email:str,password:str) -> LoginUserOut:
    user = await prisma.users.find_first(
        where={"email": email}
    )
    if not user or not verify_password(password, user.hashedPassword):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email})
    return LoginUserOut(
        message="User logged in successfully",
        access_token=access_token,
        token_type="bearer"
    )