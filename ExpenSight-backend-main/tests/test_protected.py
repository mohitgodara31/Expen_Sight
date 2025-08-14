import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from app.database.db import prisma  # make sure this points to your Prisma client

@pytest.mark.asyncio
async def test_register_login_and_protected_route():
    await prisma.connect()

    # Cleanup: Remove user if already exists
    await prisma.users.delete_many(where={"email": "secureuser@example.com"})

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        
        # Step 1: Register
        register_response = await ac.post("/v1/auth/register", json={
            "email": "secureuser@example.com",
            "password": "securepassword"
        })
        assert register_response.status_code == 200
        
        # Step 2: Login and extract token
        login_response = await ac.post("/v1/auth/login", json={
            "email": "secureuser@example.com",
            "password": "securepassword"
        })
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]

        # Step 3: Access protected route with token
        headers = {
            "Authorization": f"Bearer {token}"
        }
        protected_response = await ac.get("/v1/user/me", headers=headers)
        assert protected_response.status_code == 200
        assert protected_response.json()["email"] == "secureuser@example.com"

    await prisma.disconnect()
