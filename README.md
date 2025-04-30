# Luna AI

A full-stack application with Next.js frontend and Node.js backend.

## Project Structure

```
luna-ai/
├── frontend/         # Next.js application
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   └── components/ # Reusable components
│   ├── public/       # Static assets
│   └── ...
├── backend/          # Node.js Express server
│   ├── server.js     # Main server file
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Install dependencies for both frontend and backend:

```bash
npm run install:all
```

### Development

To run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Production

Build the frontend:

```bash
npm run build:frontend
```

Start both services in production mode:

```bash
npm run start
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api

## API Endpoints

- `GET /api/hello`: Returns a greeting message from the backend