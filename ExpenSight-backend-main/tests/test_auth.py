import pytest
from httpx import AsyncClient
from httpx import ASGITransport
from main import app
from app.database.db import prisma  # import your prisma instance

@pytest.mark.asyncio
async def test_register_and_login():
    await prisma.connect()

    # Delete user if already exists (clean up before test)
    await prisma.users.delete_many(where={"email": "testuser@example.com"})

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        response = await ac.post("/v1/auth/register", json={
            "email": "testuser@example.com",
            "password": "testpassword"
        })
        assert response.status_code == 200

        response = await ac.post("/v1/auth/login", json={
            "email": "testuser@example.com",
            "password": "testpassword"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data

    await prisma.disconnect()

