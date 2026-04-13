# ReConnect – Alumni Engagement Platform (Node.js + MongoDB SaaS)

ReConnect is a modern, multi-tenant alumni network platform designed for institutions to manage their alumni ecosystems. It supports role-based access for Admins and Alumni, featuring a unique **Join by Code** system for smooth alumni onboarding.

---

## 🛠️ Technology Stack
- **Frontend**: React 19 (Vite), Tailwind CSS, Material Symbols
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt for secure password hashing

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/) (installed with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/Bhapee-2206/ReConnect.git
cd ReConnect
```

### 2. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    Check `backend/.env` and ensure the `MONGO_URI` and `JWT_SECRET` are present.
4.  Start the server:
    ```bash
    node server.js
    ```
    *Terminal should display: "Server started on port 5000" and "MongoDB Connected..."*

### 3. Frontend Setup
1.  Open a **new** terminal in the root directory.
2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    *Navigate to the local URL provided (usually `http://localhost:5173`).*

---

## ✨ Key Features

### For Institution Admins
- **Institution Launch**: Easy onboarding to create a dedicated network for your college.
- **Join Code System**: Generate a unique 8-character code to securely share with alumni.
- **Member Management**: Track alumni registration and invite new members via email.
- **Announcements & Events**: Create and manage institutional updates and upcoming events.

### For Alumni Members
- **Seamless Registration**: Join your specific institution using a shared Join Code.
- **Professional Directory**: Search and filter fellow alumni by Batch Year, Course, or Company.
- **Event Participation**: Browse upcoming institutional events and register with one click.
- **Personal Profile**: Manage your professional details and contact information.

---

## 📸 Project Gallery
High-quality screenshots and system diagrams (System Flow, Data Flow, ER, Use Case) are available in the repository:
- Check the `gallery/` folder for all PNG assets.
- View the full report in `reconnect_project_documentation.md`.

---

## 🔒 Security & Architecture
- **JWT Middleware**: Every API request is authenticated to ensure data security.
- **Multi-Tenancy**: Data is strictly isolated by `institution_id`, ensuring one college cannot access another's data.
- **RESTful API**: Clean separation between the React frontend and Express backend.

---

## 📄 License
© 2026 ReConnect Digital Systems.
