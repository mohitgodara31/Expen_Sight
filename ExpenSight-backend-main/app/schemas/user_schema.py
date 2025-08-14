from pydantic import BaseModel,Field

class RegisterUserIn(BaseModel):
    email: str
    password: str
    baseCurrency: str = Field(..., min_length=2, max_length=3)

class RegisterUserOut(BaseModel):
    message: str
    email: str
    baseCurrency: str = Field(..., min_length=2, max_length=3)

class LoginUserIn(BaseModel):
    email: str
    password: str

class LoginUserOut(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"  # Optional, if you want to return a token on login

class UserSettingsUpdate(BaseModel):
    baseCurrency: str = Field(..., min_length=2, max_length=3)