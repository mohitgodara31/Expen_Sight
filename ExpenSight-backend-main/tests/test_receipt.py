import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
import io
import json
from unittest.mock import AsyncMock, MagicMock, patch
import sys
import os

# This line adds the project's root directory (e.g., 'backend/') to the Python path.
# It allows the tests to find and import the 'app' module.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


# --- IMPORTANT ---
# You must import your ACTUAL app object and dependencies from your project.
# These imports are examples. Adjust them to your file structure.
from main import app
from app.dependencies.deps import get_current_user
# The controller is imported so we can patch objects within it.
from app.controllers import receipt_controller

# --- Test Client ---
# Use your actual app object here
client = TestClient(app)

# --- Mock Data ---
VALID_USER_ID = 123
MOCKED_SUCCESSFUL_OCR = {
    "amount": 150.75,
    "currency": "USD",
    "category": "Office Supplies",
    "date": "2025-07-19"
}
MOCKED_CREATED_EXPENSE_ID = 1
MOCKED_CREATED_RECEIPT_ID = 1

# --- Pytest Fixtures and Tests ---

@pytest.fixture
def mock_gemini():
    """
    Fixture to mock the Gemini AI model.
    The path 'app.controllers.receipt_controller.model' must match
    exactly where the 'model' variable is located in your project.
    """
    with patch('app.controllers.receipt_controller.model') as mock_model:
        yield mock_model

@pytest.fixture
def mock_prisma():
    """
    Fixture to mock the Prisma client.
    The path 'app.controllers.receipt_controller.prisma' must match
    exactly where the 'prisma' variable is located in your project.
    """
    with patch('app.controllers.receipt_controller.prisma') as mock_prisma_client:
        # Configure async mocks for Prisma methods
        expense_mock = MagicMock()
        expense_mock.id = MOCKED_CREATED_EXPENSE_ID
        mock_prisma_client.expense.create = AsyncMock(return_value=expense_mock)
        
        receipt_mock = MagicMock()
        receipt_mock.id = MOCKED_CREATED_RECEIPT_ID
        mock_prisma_client.receipts.create = AsyncMock(return_value=receipt_mock)
        yield mock_prisma_client

# --- THE FIX IS HERE ---
def override_get_current_user():
    """
    Dependency override for a successfully authenticated user.
    Returns a mock object with an .id attribute to simulate the real user model.
    """
    mock_user = MagicMock()
    mock_user.id = VALID_USER_ID
    return mock_user

def override_get_unauthorized_user():
    """Dependency override for a user with an invalid token."""
    raise HTTPException(status_code=401, detail="Invalid token")


# --- Test Cases ---

def test_upload_receipt_happy_path(mock_gemini, mock_prisma):
    """Scenario: ✅ Happy Path -> 200 OK"""
    # Arrange
    mock_gemini.generate_content.return_value = MagicMock(text=json.dumps(MOCKED_SUCCESSFUL_OCR))
    app.dependency_overrides[get_current_user] = override_get_current_user
    file = ("receipt.png", io.BytesIO(b"fake-image-bytes"), "image/png")

    # Act
    response = client.post("/v1/receipt/upload", files={"file": file})

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Receipt uploaded and processed successfully."
    assert data["expense"] == MOCKED_CREATED_EXPENSE_ID
    assert data["receipt"] == MOCKED_CREATED_RECEIPT_ID
    app.dependency_overrides = {}


def test_upload_receipt_missing_file():
    """Scenario: ❌ Missing File -> 422 Unprocessable Entity"""
    # Arrange
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    # Act
    response = client.post("/v1/receipt/upload")

    # Assert
    assert response.status_code == 422
    assert "field required" in response.json()["detail"][0]["msg"].lower()
    app.dependency_overrides = {}


def test_upload_receipt_invalid_file_type(mock_gemini, mock_prisma):
    """Scenario: ❌ Invalid File Type -> 400 Bad Request"""
    # Arrange
    app.dependency_overrides[get_current_user] = override_get_current_user
    file = ("document.txt", io.BytesIO(b"this is not an image"), "text/plain")

    # Act
    response = client.post("/v1/receipt/upload", files={"file": file})

    # Assert
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]
    app.dependency_overrides = {}


def test_upload_receipt_invalid_token():
    """Scenario: ❌ Invalid Token -> 401 Unauthorized"""
    # Arrange
    app.dependency_overrides[get_current_user] = override_get_unauthorized_user
    file = ("receipt.jpg", io.BytesIO(b"fake-image-bytes"), "image/jpeg")

    # Act
    response = client.post("/v1/receipt/upload", files={"file": file})

    # Assert
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid token"
    app.dependency_overrides = {}


def test_upload_receipt_ocr_fails_null_amount(mock_gemini, mock_prisma):
    """Scenario: ❌ OCR Fails (null amount) -> 400 Bad Request"""
    # Arrange
    failed_ocr_response = MOCKED_SUCCESSFUL_OCR.copy()
    failed_ocr_response["amount"] = None
    mock_gemini.generate_content.return_value = MagicMock(text=json.dumps(failed_ocr_response))
    app.dependency_overrides[get_current_user] = override_get_current_user
    file = ("blank.png", io.BytesIO(b"blank-image-bytes"), "image/png")

    # Act
    response = client.post("/v1/receipt/upload", files={"file": file})

    # Assert
    assert response.status_code == 400
    assert "Could not read the amount from the receipt" in response.json()["detail"]
    app.dependency_overrides = {}


def test_upload_receipt_ocr_fails_bad_json(mock_gemini, mock_prisma):
    """Scenario: ❌ OCR Fails (invalid JSON) -> 500 Internal Server Error"""
    # Arrange
    mock_gemini.generate_content.return_value = MagicMock(text="Sorry, I could not read the receipt.")
    app.dependency_overrides[get_current_user] = override_get_current_user
    file = ("blurry.pdf", io.BytesIO(b"blurry-image-bytes"), "application/pdf")

    # Act
    response = client.post("/v1/receipt/upload", files={"file": file})

    # Assert
    assert response.status_code == 500
    assert "No valid JSON object found" in response.json()["detail"]
    app.dependency_overrides = {}


def test_upload_receipt_different_currency(mock_gemini, mock_prisma):
    """Scenario: ✅ Different Currency -> 200 OK"""
    # Arrange
    eur_ocr_response = MOCKED_SUCCESSFUL_OCR.copy()
    eur_ocr_response["currency"] = "EUR"
    mock_gemini.generate_content.return_value = MagicMock(text=json.dumps(eur_ocr_response))
    app.dependency_overrides[get_current_user] = override_get_current_user
    file = ("receipt_eur.png", io.BytesIO(b"eur-bytes"), "image/png")

    # Act
    response = client.post("/v1/receipt/upload", files={"file": file})

    # Assert
    assert response.status_code == 200
    mock_prisma.expense.create.assert_called_once()
    call_args, call_kwargs = mock_prisma.expense.create.call_args
    assert call_kwargs['data']['currency'] == 'EUR'
    assert call_kwargs['data']['amount'] == 150.75
    app.dependency_overrides = {}
