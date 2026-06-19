# Family Expense Tracker — Backend

REST API for the Family Expense Tracker app. Built with Node.js, Express, MongoDB, JWT auth, and pdfkit.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and a strong JWT secret.

4. Start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (default: 30d) |
| `FRONTEND_URL` | Allowed CORS origin |
| `NODE_ENV` | `development` or `production` |

## API Endpoints

### Health
- `GET /api/health` — health check

### Auth
- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — log in (returns JWT + sets httpOnly cookie)
- `POST /api/auth/logout` — log out
- `GET /api/auth/me` — current user

### Expenses (auth required)
- `POST /api/expenses` — create expense
- `GET /api/expenses` — list expenses (defaults to current month; optional `startDate`, `endDate`, `category`, `paymentType`)
- `GET /api/expenses/:id` — get one expense
- `PUT /api/expenses/:id` — update expense
- `DELETE /api/expenses/:id` — delete expense

### Reports (auth required)
- `GET /api/reports/summary?startDate=&endDate=` — totals and category breakdown
- `GET /api/reports/pdf?startDate=&endDate=` — download PDF report

## Example Request — Create Expense

```json
POST /api/expenses
{
  "date": "2026-06-19",
  "amount": 500,
  "category": "Groceries",
  "paymentType": "cash",
  "note": "Milk and vegetables"
}
```
