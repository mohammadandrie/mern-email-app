# MERN Email App

Full-stack MERN (MongoDB, Express, React, Node.js) application with TypeScript.

## Features

- **Authentication**: Login & Logout with timestamp recording
- **CRUD Contacts**: Create, Read, Update, Delete contacts
- **Send Email**: Send emails to contacts with template ("Hi Salam Kenal")
- **Email Logs**: Track sent emails
- **TypeScript**: Full TypeScript support on both frontend and backend

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript + MongoDB + Mongoose
- **Email**: Nodemailer
- **Auth**: JWT + bcrypt

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Docker)

### 1. Start MongoDB
```bash
docker run -d --name mongodb -p 27017:27017 mongo:7
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env  # Edit with your settings
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (records timestamp)
- `POST /api/auth/logout` - Logout (records timestamp)
- `GET /api/auth/me` - Get current user

### Contacts
- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Create contact
- `GET /api/contacts/:id` - Get contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Email
- `POST /api/email/send` - Send email
- `GET /api/email/logs` - Get email logs

## Email Template

Default email template:
```
Hi {name}!

Salam kenal! 👋
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-email-app
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## License

MIT
