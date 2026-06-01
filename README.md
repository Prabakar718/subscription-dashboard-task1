[README.md](https://github.com/user-attachments/files/28471762/README.md)
# Subscription Management Dashboard

A full-stack SaaS admin dashboard for managing subscriptions.

## Tech Stack

- **Frontend:** React.js (Vite), TailwindCSS v4, Redux Toolkit, React Hook Form, Zod
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens)

## Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017

### Backend

```bash
cd server
npm install
# Edit .env if needed (MONGO_URI, JWT secrets)
npm run seed       # Seed 4 sample plans
npm run dev        # Start on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev        # Start on http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/refresh` | — | Refresh access token |
| GET | `/api/plans` | — | List all plans |
| POST | `/api/subscribe/:planId` | User | Subscribe to plan |
| GET | `/api/my-subscription` | User | Get active subscription |
| GET | `/api/admin/subscriptions` | Admin | All subscriptions |
| GET | `/api/profile` | User | Get profile |
| PUT | `/api/profile` | User | Update profile |

## Creating an Admin User

Register normally, then update the role in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Author

Your Name — your@email.com
