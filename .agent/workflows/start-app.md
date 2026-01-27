---
description: Start the MealMaster application (frontend and backend)
---

# Start MealMaster Application

This workflow helps you start both the frontend and backend servers.

## Prerequisites
- Java 17 or higher installed
- Node.js and npm installed
- Maven installed

## Steps

### 1. Start the Backend Server

Navigate to the backend directory and run:
```bash
cd /Users/chetan/Downloads/project/mmv1/mealmaster-backend
mvn spring-boot:run
```

The backend will be available at: `http://localhost:9090/api`

**Note:** If you get a "Port already in use" error, it means the backend is already running. You can check with:
```bash
lsof -i :9090
```

To stop the existing process:
```bash
kill -9 <PID>
```

### 2. Start the Frontend Development Server

In a new terminal, navigate to the frontend directory and run:
```bash
cd /Users/chetan/Downloads/project/mmv1/MealMaster
npm run dev
```

The frontend will be available at: `http://localhost:5173` (or another port shown in the terminal)

### 3. Access the Application

Open your browser and go to the frontend URL (usually `http://localhost:5173`)

The frontend will automatically connect to the backend at `http://localhost:9090/api`

## Testing the Setup

You can test if the backend is working by accessing:
- API Health: `http://localhost:9090/api/subscriptions`
- H2 Console: `http://localhost:9090/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `root`
  - Password: `cdaccdac`

## Stopping the Servers

- Frontend: Press `Ctrl+C` in the terminal running the frontend
- Backend: Press `Ctrl+C` in the terminal running the backend

## Common Issues

1. **Port 9090 already in use**: Backend is already running. Check with `lsof -i :9090`
2. **Port 5173 already in use**: Frontend is already running. Check with `lsof -i :5173`
3. **CORS errors**: Make sure backend is running before starting frontend
