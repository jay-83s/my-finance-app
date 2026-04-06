# FinanceApp — Personal Finance Management Platform

A fullstack personal finance management web application built with React, Node.js, Express and MySQL. Designed to help users track income, manage savings and control expenses using the **Pay Yourself First** financial principle.

## 🌐 Live Demo
**Frontend:** https://my-finance-app-xi-six.vercel.app

## 📱 Features

### Authentication
- User signup and login with JWT authentication
- Password hashing with bcrypt
- Forgot password and reset password flow
- Edit profile and change password

### Pay Yourself First System
- Set a savings goal percentage (e.g. 20%)
- Savings are automatically deducted when income is added
- Cannot spend until savings target is met
- Real-time spending balance tracking
- Low funds warning at 5% remaining
- Insufficient funds protection
- Option to move savings to spending if needed

### Finance Tracking
- Add Income, Savings and Expense entries
- Category selection per transaction type
- Transaction history with color coding
- Filter transactions by category
- Delete transactions

### Analytics
- Real savings rate from actual data
- Monthly bar chart with 3M/6M/1Y filter
- Savings vs expenses trend line chart
- Category breakdown pie chart
- KES/USD currency switcher

### UI/UX
- Dark and light mode toggle
- Fully responsive — sidebar on desktop, bottom nav on mobile
- Lucide icons throughout
- Smooth transitions and animations

### Admin Dashboard
- View all registered users
- View all transactions across all users
- Delete users

## 🛠️ Tech Stack

**Frontend:**
- React 19 with Vite
- Recharts for data visualization
- Lucide React for icons
- Axios for API calls

**Backend:**
- Node.js with Express
- MySQL database
- JWT authentication
- Bcrypt password hashing
- Nodemailer / Resend for emails

**Deployment:**
- Frontend: Vercel
- Backend: Railway
- Database: Railway MySQL

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MySQL
- npm

### Frontend Setup
```bash
git clone https://github.com/jay-83s/my-finance-app.git
cd my-finance-app
npm install
npm run dev
```

### Backend Setup
```bash
git clone https://github.com/jay-83s/finance-backend.git
cd finance-backend
npm install
```

Create a `.env` file in the `finance-backend` folder:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=financeapp
JWT_SECRET=your_jwt_secret
PORT=3000
GMAIL_USER=yourgmail@gmail.com
GMAIL_PASS=your_app_password
RESEND_API_KEY=your_resend_key
```
```bash
npm run dev
```

### Database Setup
Run these SQL commands in MySQL:
```sql
CREATE DATABASE financeapp;
USE financeapp;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  savings_goal INT DEFAULT 20,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expiry DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  label VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  type ENUM('income', 'savings', 'expense', 'savings_withdrawal') NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  icon VARCHAR(10) DEFAULT '💰',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 📁 Project Structure
my-finance-app/
├── src/
│   ├── api/            # API calls to backend
│   ├── components/     # Reusable UI components
│   ├── context/        # Theme context
│   ├── data/           # Seed data
│   ├── hooks/          # Custom React hooks
│   ├── screens/        # App screens
│   └── utils/          # Theme and currency utilities