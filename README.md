# Notification Hub

A real-time notification system built with FastAPI, React (Vite), and PostgreSQL.

## Features
- **Admin Panel**: Create notifications with role-based audience selection.
- **Real-time**: Instant delivery using WebSockets.
- **User Switching**: Simple dropdown to switch between 6 pre-seeded users.
- **Mark as Read**: Toggle notification status.
- **Search/Filter**: Filter notifications by content.
- **Glassmorphism UI**: Modern, premium design.

## Tech Stack
- **Frontend**: React, Radix UI (concepts), Vanilla CSS.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL.
- **DevOps**: Docker, Docker Compose.

## How to Run

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the app**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

## Seed Data
The database is automatically seeded on startup with:
- **Roles**: Admin, Manager, Editor, Viewer, Support.
- **Users**: 6 users with assigned roles (alice_admin, bob_manager, etc.).
