
# ExpenSight Frontend

A modern and responsive frontend for the AI-powered expense management application, ExpenSight. Built with React and Tailwind CSS.

## Overview

This project is the user-facing interface for the **ExpenSight Backend**. It provides a seamless and intuitive experience for users to manage their expenses, from uploading receipts for AI-powered data extraction to performing multi-currency reconciliations. The application is fully responsive and features a clean, aesthetic design system.

## ✨ Key Features

  * **Beautiful Landing Page**: A multi-section, animated landing page to greet new users.
  * **User Authentication**: A secure and aesthetic modal for user registration and login.
  * **AI-Powered OCR Upload**: A drag-and-drop interface to upload receipts for automatic data extraction.
  * **Manual Expense Entry**: A simple form to add expenses manually.
  * **Interactive Dashboard**: Displays key statistics (total expenses, pending, reconciled) and visual trends with charts.
  * **Comprehensive Expense Management**: A detailed table view to see all expenses, their source (OCR vs. Manual), reconciliation status, and converted amounts.
  * **Instant UI Updates**: The UI updates instantly after actions like reconciliation without requiring a page refresh.
  * **Responsive Design**: A mobile-first design that works beautifully on all screen sizes, featuring a functional hamburger menu.
  * **Polished UX**: Smooth animations, loading states, and toast notifications provide clear user feedback.

-----

## 🚀 Tech Stack

  * **Framework**: [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
  * **Styling**: [Tailwind CSS](https://tailwindcss.com/) with the `@tailwindcss/forms` plugin
  * **API Communication**: [Axios](https://axios-http.com/)
  * **Routing**: [React Router DOM](https://reactrouter.com/)
  * **Form Management**: [React Hook Form](https://react-hook-form.com/)
  * **Animations**: [Framer Motion](https://www.framer.com/motion/)
  * **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
  * **Charting**: [Recharts](https://recharts.org/)
  * **Icons**: [Heroicons](https://heroicons.com/)

-----

## 🏁 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

  * Node.js (v18 or later recommended)
  * `npm` or `yarn`
  * The [ExpenSight Backend](https://www.google.com/search?q=https://github.com/your-repo/expensight-backend) server must be running locally.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-repo/expensight-frontend.git
    cd expensight-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a new file named `.env` in the root of the project directory and add the following line. This tells the frontend where to find your backend API.

    ```env
    VITE_API_BASE_URL=http://127.0.0.1:8000/v1
    ```

4.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

-----

## 📁 Folder Structure

The project follows a standard feature-based folder structure to keep the code organized and scalable.

```
src/
├── api/          # Axios configuration and interceptors
├── components/   # Reusable components (e.g., Modals, Layout)
├── contexts/     # React contexts (e.g., AuthContext)
├── pages/        # Top-level page components for each route
├── services/     # (Legacy, api/ is preferred)
└── App.jsx       # Main application component with routing
```

## 🌐 API Integration

The frontend communicates with the ExpenSight backend via a configured Axios instance located at `src/services/api.js`. This instance automatically:

  * Uses the `VITE_API_BASE_URL` from your `.env` file.
  * Attaches the JWT authentication token from `localStorage` to the headers of all protected requests.