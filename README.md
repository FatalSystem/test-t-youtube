# Fullstack Application (Next.js + NestJS)

This is a fullstack application consisting of:

- **Frontend**: Built with [Next.js](https://nextjs.org/) located in the `frontend/` folder
- **Backend**: Built with [NestJS](https://nestjs.com/) located in the `backend/` folder

---

## 🧾 Project Structure

```
project-root/
├── frontend/   # Next.js frontend
└── backend/    # NestJS backend
```

---

## 🚀 Getting Started

### 1. Clone the Repository

---

## 🖥️ Frontend Setup (Next.js)

### 📁 Location

`/frontend`

### 📦 Install Dependencies

```bash
cd frontend
npm install
```

### ⚙️ Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_BASE_URL=
```

### 🧪 Run Development Server

```bash
npm run dev
```

---

## 🛠️ Backend Setup (NestJS)

### 📁 Location

`/backend`

### 📦 Install Dependencies

```bash
cd backend
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
YOUTUBE_API_KEY=your_youtube_api_key
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
PORT=5000
```

### 🧪 Run Development Server

```bash
npm run start:dev
```
