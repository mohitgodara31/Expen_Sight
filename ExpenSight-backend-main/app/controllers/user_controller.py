from app.database.db import prisma
from fastapi import HTTPException


async def get_me(current_user):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "id": current_user.id,
        "email": current_user.email,
        "baseCurrency":current_user.baseCurrency,
        "created_at": current_user.created_at
    }

# async def delete_current_user(current_user):
#     if not current_user:
#         raise HTTPException(status_code=401, detail="Not authenticated")
    
#     await prisma.users.delete(where={"id": current_user.id})
#     return {"message": "User deleted successfully"}

async def update_base_currency(settings,current_user):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    updated_user = await prisma.users.update(
        where={
            'id':current_user.id
        },
        data={
            'baseCurrency':settings.baseCurrency.upper()
        }
    )
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Return a confirmation message
    return {"message": f"Base currency updated to {updated_user.baseCurrency} successfully."}