# TaskTide – Backend (Express API)

## Overview

TaskTide Backend is a minimal REST API built with Express.js.
It manages tasks in memory and exposes endpoints to:

- List all tasks
- Create a new task
- Update a task's status
- Delete a task
- Check API health

This API is consumed by the TaskTide React frontend but can also be tested
independently using tools like Postman or Thunder Client.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework and routing |
| cors | Allows the React frontend to call the API |

---

## Prerequisites

- Node.js (LTS) and npm installed
- A terminal (PowerShell, CMD, or similar)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-backend-repo-url> tasktide-backend
cd tasktide-backend
```

If the backend lives inside a larger project, just `cd` into the `tasktide-backend` folder.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm start
```

The API listens on `http://localhost:3000` by default.
You should see the following in your terminal:

```
Server is running on port 3000
```

---

## Project Structure

```
tasktide-backend/
├── src/
│   ├── app.js              # Express setup, middleware, and route mounting
│   └── routes/
│       └── tasks.js        # Task endpoints and in-memory data store
├── package.json
└── package-lock.json
```

---

## API Endpoints

**Base URL:** `http://localhost:3000`

---

### GET /health

Check if the API is running.

```
GET http://localhost:3000/health
```

Response `200 OK`:

```json
{ "status": "ok", "app": "TaskTide" }
```

---

### GET /api/tasks

Return all tasks currently stored in memory.

```
GET http://localhost:3000/api/tasks
```

Response `200 OK`:

```json
[
  {
    "id": 1,
    "title": "Finish GenAI toolkit",
    "description": "Complete TaskTide prototype",
    "priority": "high",
    "status": "todo",
    "dueDate": "2026-03-21T00:00:00.000Z",
    "createdAt": "2026-03-19T14:06:34.548Z",
    "updatedAt": "2026-03-19T14:06:34.548Z"
  }
]
```

---

### POST /api/tasks

Create a new task.

```
POST http://localhost:3000/api/tasks
```

Request body:

```json
{
  "title": "Example task",
  "description": "Optional description",
  "priority": "high",
  "dueDate": "2026-03-21T00:00:00.000Z"
}
```

| Field | Required | Values |
|-------|----------|--------|
| title | ✅ Yes | Any string |
| description | No | Any string |
| priority | No | `low`, `medium` (default), `high` |
| dueDate | No | ISO 8601 date string or `null` |

Response `201 Created`:

```json
{
  "id": 1,
  "title": "Example task",
  "description": "Optional description",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-03-21T00:00:00.000Z",
  "createdAt": "2026-03-19T14:06:34.548Z",
  "updatedAt": "2026-03-19T14:06:34.548Z"
}
```

Response `400 Bad Request` (missing title):

```json
{ "error": "Title is required" }
```

---

### PATCH /api/tasks/:id/status

Update the status of a task.

```
PATCH http://localhost:3000/api/tasks/1/status
```

Request body:

```json
{ "status": "done" }
```

| Field | Required | Allowed values |
|-------|----------|----------------|
| status | ✅ Yes | `todo`, `in-progress`, `done` |

Response `200 OK`: returns the updated task object.

Response `400 Bad Request` (invalid status):

```json
{ "error": "Invalid status. Allowed: todo, in-progress, done" }
```

Response `404 Not Found`:

```json
{ "error": "Task not found" }
```

---

### DELETE /api/tasks/:id

Delete a task by ID.

```
DELETE http://localhost:3000/api/tasks/1
```

Response: `204 No Content`

Response `404 Not Found`:

```json
{ "error": "Task not found" }
```

---

## Important Note on Data Persistence

Tasks are stored **in memory only**. All data is lost when the server restarts.
This is intentional for this beginner toolkit — no database setup required.

---

## Troubleshooting

### "Cannot find module 'cors'" or "Cannot find module 'express'"

Dependencies are missing. Run:

```bash
npm install
```

### Port 3000 already in use

Another process is using port 3000. Either stop that process or change the port
by setting an environment variable before starting:

```bash
PORT=3001 npm start   # macOS / Linux
set PORT=3001 && npm start   # Windows CMD
```

Then update `API_BASE` in the frontend's `src/App.jsx` to match.

### Task not found on PATCH or DELETE

The server may have restarted, which clears all in-memory tasks. Create a
fresh task with `POST /api/tasks`, note the returned `id`, and use that in
your PATCH or DELETE request.
