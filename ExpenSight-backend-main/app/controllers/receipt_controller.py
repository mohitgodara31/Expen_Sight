from fastapi import HTTPException
import os, uuid, dotenv, re, json
import google.generativeai as genai
from app.database.db import prisma
from datetime import datetime
from pathlib import Path
import mimetypes

dotenv.load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


async def upload_receipt_file(file, current_user):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    file_location = None  # Define file_location here to access it in finally block
    try:
        if not file.filename.endswith(('.png', '.jpg', '.jpeg', '.pdf')):
            raise HTTPException(status_code=400, detail="Invalid file type. Only PNG, JPG, JPEG, and PDF files are allowed.")

        # Ensure the temp_uploads directory exists
        os.makedirs("temp_uploads", exist_ok=True)
        file_location = f"temp_uploads/{uuid.uuid4().hex}_{file.filename}"
        
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())

        parsed_data = await process_receipt(file_location)
        ocr_result = await create_expense_and_receipt(parsed_data, current_user, file.filename)

        return {
            "message": "Receipt uploaded and processed successfully.",
            "expense": ocr_result["expense"],
            "receipt": ocr_result["receipt"]
        }
    # This ensures that 4xx errors from deeper functions are not turned into 500 errors.
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while uploading the file and performing the ocr: {str(e)}")
    finally:
        if file_location and os.path.exists(file_location):
            os.remove(file_location)


async def process_receipt(file_path: str) -> dict:
    file_path = Path(file_path)
    mime_type, _ = mimetypes.guess_type(str(file_path))
    if not mime_type:
        raise ValueError("Could not determine MIME type of the uploaded file")

    with open(file_path, "rb") as f:
        file_blob = {
            "mime_type": mime_type,
            "data": f.read()
        }

    prompt = """
    You are an OCR assistant. Extract the following structured data from this receipt:
    - Total amount spent
    - Expense category (like food, groceries, fuel, etc.)
    - Date of transaction

    Respond only in JSON format:
    {
        "amount": <float>,
        "currency": "<string> e.g. USD, INR, EU , etc.",
        "category": "<string>",
        "date": "<YYYY-MM-DD>"
    }
    """
    response = model.generate_content(contents=[prompt, file_blob])

    if not response or not response.candidates:
        raise ValueError("No response from Gemini AI")

    try:
        match = re.search(r"\{.*\}", response.text, re.DOTALL)
        if not match:
            raise ValueError(f"No valid JSON object found in AI response. Raw text: {response.text}")
        
        json_string = match.group(0)
        parsed_data = json.loads(json_string)

    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to decode JSON from AI response: {e}. Raw text: {response.text}")

    if not all(key in parsed_data for key in ["amount", "currency", "category", "date"]):
        raise ValueError("Incomplete data extracted from receipt")
    return parsed_data


async def create_expense_and_receipt(parsed_data, current_user, filename: str):
    try:
        amount_val = parsed_data.get('amount')

        if amount_val is None:
            raise HTTPException(
                status_code=400,
                detail="Could not read the amount from the receipt. Please try a clearer image."
            )

        try:
            amount = float(amount_val)
            if amount <= 0:
                raise ValueError("Amount must be a positive number.")
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="Invalid amount extracted from receipt")

        currency = parsed_data.get('currency', 'INR')
        category = parsed_data.get('category', 'Uncategorized')
        date_str = parsed_data.get('date', datetime.now().strftime('%Y-%m-%d'))
        expense_date = datetime.strptime(date_str, '%Y-%m-%d')

        expense = await prisma.expense.create(
            data={
                'amount': amount,
                'currency': currency,
                'category': category,
                'date': expense_date,
                'userId':current_user.id
            }
        )

        receipt = await prisma.receipts.create(
            data={
                'filename': filename,
                'userId': current_user.id,
                'expenseId': expense.id
            }
        )
        return {
            "message": "Expense and receipt created successfully",
            "expense": {
                'amount': amount,
                'currency': currency,
                'category': category,
                'date': expense_date,
            },
            "receipt": {
                'filename': filename,
                'userId': current_user.id,
                'expenseId': expense.id
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create expense and receipt: {str(e)}")
