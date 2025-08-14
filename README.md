
# 🚀 ExpenSight: AI-Powered Expense Management

**ExpenSight** is a full-stack, AI-powered web application designed to simplify global expense management. It allows users to upload receipts, automatically extract key information using AI, and reconcile expenses across multiple currencies using historical exchange rates.

---

## ✨ Key Features

* 🤖 **AI-Powered OCR**
  Upload receipt images or PDFs and let Google Gemini AI automatically extract the merchant, date, amount, and currency.

* 💱 **Historical Currency Reconciliation**
  Convert any expense to your base currency using the exchange rate from the transaction date—ensuring perfect accounting accuracy.

* 📈 **Interactive Dashboard**
  Get a high-level overview of your finances with key statistics and visual trend charts.

* 🧾 **Comprehensive Expense Tracking**
  View all expenses in a detailed table, showing their source (OCR vs. Manual), reconciliation status, and converted amounts.

* 🔐 **Secure User Authentication**
  JWT-based authentication with secure password hashing.

* 📱 **Fully Responsive UI**
  A mobile-first design built with React and Tailwind CSS that works beautifully on all screen sizes.

* ⚙️ **Modern Stack**
  A robust Python backend powered by FastAPI, and a dynamic frontend built with React.

---

## 🛠️ Tech Stack

| Category      | Technology                                                               |
| ------------- | ------------------------------------------------------------------------ |
| **Frontend**  | React (Vite), Tailwind CSS, React Router, Axios, Framer Motion, Recharts |
| **Backend**   | FastAPI (Python), Prisma ORM, PostgreSQL                                 |
| **AI & APIs** | Google Gemini (OCR), Frankfurter API (Currency Rates)                    |

---

## 🏁 Getting Started

To get the full application running locally, you will need to set up both the backend and the frontend.

### ✅ Prerequisites

* Node.js (v18 or later)
* Python (v3.10 or later)
* PostgreSQL server

---

### ⚙️ Backend Setup

```bash
# 1. Clone the backend repository
git clone https://github.com/your-repo/expensight-backend.git
cd expensight-backend

# 2. Set up a virtual environment and install dependencies
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the root folder and add the following:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
GEMINI_API_KEY="your_google_ai_api_key"
SECRET_KEY="your_jwt_secret_key"
```

```bash
# 3. Run Prisma migrations
npx prisma migrate dev --name "initial_migration"

# 4. Start the backend server
uvicorn app.main:app --reload
```

The backend API will now run at:
👉 `http://127.0.0.1:8000`

---

### 🌐 Frontend Setup

```bash
# 1. Clone the frontend repository
git clone https://github.com/your-repo/expensight-frontend.git
cd expensight-frontend

# 2. Install dependencies
npm install
```

Create a `.env` file in the root folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/v1
```

```bash
# 3. Run the frontend development server
npm run dev
```

The frontend will now be available at:
👉 `http://localhost:5173`

---

## 📁 Project Structure

### `expensight-backend/`

* Follows an MVC-like pattern:

  * **Controllers** – business logic
  * **Schemas** – data validation using Pydantic
  * **Routes** – API views

### `expensight-frontend/`

* Standard React structure:

  * Components
  * Pages
  * Contexts for global state management

---

<details>
<summary><strong>🌐 API Endpoints Overview</strong></summary>

#### Auth

* `POST /v1/auth/register`
* `POST /v1/auth/login`

#### User

* `GET /v1/user/profile`
* `PATCH /v1/user/profile/settings/update`

#### Expense

* `GET /v1/expense`
* `POST /v1/expense`

#### Receipt

* `POST /v1/receipt/upload`

#### Reconciliation

* `POST /v1/reconcile`
* `GET /v1/reconcile/history`

#### Dashboard

* `GET /v1/dashboard/stats`
* `GET /v1/dashboard/trends`

</details>

---

## 🤝 Contributing

Contributions are welcome!
To contribute:

```bash
# 1. Fork the repository

# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "Add AmazingFeature"

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---


### Made with love by Mohit Godara
