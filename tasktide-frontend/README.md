# TaskTide – Frontend (React + Vite)

## Overview

TaskTide Frontend is a simple React application built with Vite.
It connects to the TaskTide Express API and lets users:

- View all tasks
- Create new tasks (title, priority, and optional due date)
- Mark tasks as done
- Delete tasks
- See tasks ordered by priority and nearest due date

This project is part of the **Beginner's Toolkit with GenAI** capstone and demonstrates
how a React UI can consume a REST API built with Express.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React (via Vite) | UI framework |
| Vite | Fast local development and bundling |
| Axios | HTTP requests to the backend API |
| JavaScript (ES6+) | Application logic |

The corresponding backend is a Node/Express API expected at `http://localhost:3000`.

---

## Prerequisites

Before running the frontend, make sure you have:

- Node.js (LTS) and npm installed
- The TaskTide backend up and running on `http://localhost:3000`

> See the backend README for setup instructions and available endpoints.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Annecrafted/tasktide.git
cd tasktide
cd tasktide-frontend
```


### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

You should see output similar to:

```
VITE v8.x.x  ready in ...
  ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173/` in your browser.

> ⚠️ Make sure the backend is running on `http://localhost:3000` before using the UI,
> otherwise API calls will fail.

---

## Project Structure

```
tasktide-frontend/
├── src/
│   ├── main.jsx      # Entry point – renders <App />
│   └── App.jsx       # Main UI: form, task list, and all axios calls
├── index.html
├── vite.config.js
└── package.json
```

---

## How It Works

### API Base URL

The frontend expects the backend at:

```js
const API_BASE = "http://localhost:3000";
```

This is set at the top of `src/App.jsx`. If your backend runs on a different port, update this value.

### Load Tasks

On component mount, the app fetches all tasks:

```js
axios.get(`${API_BASE}/api/tasks`)
```

The response array is stored in React state and displayed as a list.

### Create a Task

The form accepts a title (required), priority (`low`, `medium`, `high`), and an optional due date.
On submit, it calls:

```js
axios.post(`${API_BASE}/api/tasks`, {
  title,
  priority,
  dueDate: dueDate ? new Date(dueDate).toISOString() : null,
});
```

### Mark a Task as Done

```js
axios.patch(`${API_BASE}/api/tasks/${id}/status`, { status: "done" });
```

### Delete a Task

```js
axios.delete(`${API_BASE}/api/tasks/${id}`);
```

### Sorting

Before rendering, tasks are sorted so that:

- `high` priority tasks appear above `medium`, which appear above `low`
- Within the same priority, tasks with earlier due dates appear first
- Tasks without a due date appear after those that have one

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build the production bundle |
| `npm run preview` | Preview the production build locally |

---

## Troubleshooting

### CORS or "Network Error" in the browser console

- Make sure the backend is running on `http://localhost:3000`
- Confirm the backend has CORS enabled:

```js
const cors = require('cors');
app.use(cors());
```

### "Failed to resolve import 'axios'"

Run the following, then restart the dev server:

```bash
npm install axios
npm run dev
```

### Task list stays empty

- Open browser DevTools and check the Console for errors
- Verify the backend is reachable by visiting `http://localhost:3000/api/tasks`
  directly in your browser or testing it with Postman / Thunder Client
