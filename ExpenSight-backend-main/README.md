# ExpenSight Backend API Documentation

## Overview
ExpenSight is a FastAPI-based expense tracking application with AI-powered receipt OCR, multi-currency support, and currency reconciliation features. The backend follows MVC architecture with Prisma ORM and PostgreSQL database.

## Tech Stack
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with OAuth2PasswordBearer
- **AI/OCR**: Google Gemini 2.0 Flash
- **Currency API**: Frankfurter API
- **File Upload**: Multipart form data
- **Password Security**: bcrypt hashing

## Database Schema

### Users Table
```sql
- id: Int (Primary Key, Auto-increment)
- email: String (Unique)
- hashedPassword: String
- created_at: DateTime (Default: now)
- baseCurrency: String (Default: "INR", 2-3 chars)
```

### Expense Table
```sql
- id: Int (Primary Key)
- amount: Float
- currency: String
- category: String
- date: DateTime
- userId: Int (Foreign Key → Users.id)
- createdAt: DateTime (Default: now)
- updatedAt: DateTime (Auto-update)
```

### Receipts Table
```sql
- id: Int (Primary Key)
- filename: String
- uploadedAt: DateTime (Default: now)
- userId: Int (Foreign Key → Users.id)
- expenseId: Int? (Optional, Unique Foreign Key → Expense.id)
```

### Reconcile Table
```sql
- id: Int (Primary Key)
- convertedAmount: Float
- baseCurrency: String
- conversionCurrency: String
- fxRate: Float
- createdAt: DateTime (Default: now)
- expenseId: Int (Foreign Key → Expense.id)
- userId: Int (Foreign Key → Users.id)
```

## API Endpoints

### Authentication Routes (`/v1/auth`)

#### POST `/v1/auth/register`
**Purpose**: Register new user
**Body**:
```json
{
  "email": "string",
  "password": "string", 
  "baseCurrency": "string" // 2-3 chars, e.g., "USD", "INR"
}
```
**Response**:
```json
{
  "message": "User registered successfully",
  "email": "string",
  "baseCurrency": "string"
}
```

#### POST `/v1/auth/login`
**Purpose**: User login
**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
**Response**:
```json
{
  "message": "User logged in successfully",
  "access_token": "string",
  "token_type": "bearer"
}
```

### User Routes (`/v1/user/profile`)
**Authentication**: Required (Bearer Token)

#### GET `/v1/user/profile/`
**Purpose**: Get current user profile
**Response**:
```json
{
  "id": int,
  "email": "string",
  "created_at": "datetime"
}
```

#### PATCH `/v1/user/profile/settings/update/`
**Purpose**: Update user base currency
**Body**:
```json
{
  "baseCurrency": "string" // 2-3 chars
}
```
**Response**:
```json
{
  "message": "Base currency updated to {currency} successfully."
}
```

### Expense Routes (`/v1/expense`)
**Authentication**: Required (Bearer Token)

#### GET `/v1/expense/`
**Purpose**: Get all user expenses (ordered by date desc)
**Response**:
```json
[
  {
    "id": int,
    "amount": float,
    "currency": "string",
    "category": "string",
    "date": "datetime"
  }
]
```

#### POST `/v1/expense/`
**Purpose**: Add expense manually
**Body**:
```json
{
  "amount": float,
  "currency": "string",
  "category": "string",
  "date": "datetime"
}
```
**Response**: Same as expense object above

### Receipt Routes (`/v1/receipt`)
**Authentication**: Required (Bearer Token)

#### POST `/v1/receipt/upload`
**Purpose**: Upload receipt for OCR processing
**Content-Type**: `multipart/form-data`
**Body**: 
- `file`: UploadFile (PNG, JPG, JPEG, PDF only)
**Response**:
```json
{
  "message": "Receipt uploaded and processed successfully.",
  "expense": {
    "amount": float,
    "currency": "string",
    "category": "string", 
    "date": "datetime"
  },
  "receipt": {
    "filename": "string",
    "userId": int,
    "expenseId": int
  }
}
```

### Reconciliation Routes (`/v1/reconcile`)
**Authentication**: Required (Bearer Token)

#### POST `/v1/reconcile/`
**Purpose**: Convert expense to different currency
**Body**:
```json
{
  "expenseId": int, // Must be > 0
  "conversionCurrency": "string" // Optional, defaults to user's baseCurrency
}
```
**Response**:
```json
{
  "id": int,
  "convertedAmount": float,
  "baseCurrency": "string",
  "conversionCurrency": "string", 
  "fxRate": float,
  "createdAt": "datetime",
  "expense": {
    "id": int,
    "amount": float,
    "currency": "string",
    "category": "string",
    "date": "datetime"
  }
}
```

#### GET `/v1/reconcile/history`
**Purpose**: Get all user reconciliation history
**Response**:
```json
{
  "message": "History fetched successfully",
  "reconciliation_history": [/* Array of reconciliation objects */]
}
```

#### GET `/v1/reconcile/history_specific?expense_id={id}`
**Purpose**: Get reconciliation history for specific expense
**Query Params**: 
- `expense_id`: int (optional)
**Response**:
```json
{
  "message": "History for expense ID {id} fetched successfully",
  "reconciliation_history": [/* Array of reconciliation objects */]
}
```

## Authentication Flow
1. **Registration**: User provides email, password, baseCurrency → Returns success message
2. **Login**: User provides credentials → Returns JWT access token
3. **Protected Routes**: Include `Authorization: Bearer {token}` header
4. **Token Validation**: Backend validates JWT and extracts user info

## Key Features

### 🤖 AI-Powered OCR
- Upload receipt images/PDFs
- Gemini AI extracts: amount, currency, category, date
- Auto-creates expense from OCR data
- Handles multiple image formats

### 💱 Currency Reconciliation
- Convert any expense to different currency
- Uses historical exchange rates (Frankfurter API)
- Maintains conversion history
- Supports 30+ currencies

### 🔐 Security
- bcrypt password hashing
- JWT token-based authentication
- User isolation (all data user-scoped)
- Input validation with Pydantic

### 📁 File Management
- Temporary file upload to `temp_uploads/`
- Auto-cleanup after processing
- File type validation
- Unique filename generation

## Error Handling

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (validation errors, invalid data)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `422`: Unprocessable Entity (request format errors)
- `500`: Internal Server Error
- `503`: Service Unavailable (external API failures)

### Sample Error Response
```json
{
  "detail": "Error message description"
}
```

## External Dependencies
- **Gemini AI**: Receipt OCR processing (requires GEMINI_API_KEY)
- **Frankfurter API**: Historical exchange rates (free, no key required)
- **PostgreSQL**: Database (requires DATABASE_URL)

## Environment Variables
```env
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your_gemini_key
SECRET_KEY=your_jwt_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## MVC Architecture
- **Models**: Prisma schema definitions (`/prisma/schema.prisma`)
- **Views**: FastAPI route handlers (`/app/api/v1/`)
- **Controllers**: Business logic (`/app/controllers/`)
- **Schemas**: Pydantic models for validation (`/app/schemas/`)
- **Services**: External integrations (`/app/services/`)
- **Security**: Auth utilities (`/app/security/`)

## Frontend Integration Notes
- All dates in ISO format
- Currency codes are 2-3 character strings (USD, EUR, INR, etc.)
- File uploads require multipart/form-data
- Bearer token required for all protected routes
- Expense amounts are float values
- User-specific data isolation enforced at API level 