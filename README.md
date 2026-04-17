# Student Outing System (MERN)

## Requirements
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

## 1) Backend setup (Express + Mongo + JWT)
```bash
cd backend
npm install
copy .env.example .env
```

Edit `backend/.env` and set:
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN` (default is Vite dev URL)

### Seed a warden account
```bash
cd backend
npm run seed:warden
```

### Run API
```bash
cd backend
npm run dev
```
API runs on `http://localhost:5000`.

## 2) Frontend setup (React + Tailwind)
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
Frontend runs on `http://localhost:5173`.

Set `frontend/.env`:
- `VITE_API_URL=http://localhost:5000`

## Default flow
1. Login as **Warden**
2. Generate a **studentId**
3. Register a **Student** using that `studentId`
4. Student submits outing requests
5. Warden approves/rejects (rejection requires a reason)

## API endpoints
### Auth
- `POST /api/auth/warden/register`
- `POST /api/auth/warden/login` (name + password)
- `POST /api/auth/student/login` (name + rollNo + studentId)

### Student
- `POST /api/requests`
- `GET /api/requests/my`

### Warden
- `GET /api/requests?status=pending|approved|rejected`
- `PUT /api/requests/:id/approve`
- `PUT /api/requests/:id/reject`
- `POST /api/student-id` (register student + generate ID)

