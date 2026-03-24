# Prompt-Powered Kickstart: Building a Beginner's Toolkit for Express.js Task APIs (with React UI)

---

## 1. Title & Objective

**Technology chosen:** Express.js (Node.js web framework) with a simple React (Vite) frontend.

**Why I chose it**
I wanted to learn how to build a basic REST API from scratch and connect it to a real frontend,
since this is a core skill for full-stack development.

**End goal**
Build a small "TaskTide" task manager where a user can create, view, update, and delete tasks
through an Express API and interact with it via a React web page.

---

## 2. Quick Summary of the Technology

### What is Express.js?

Express.js is a minimal and flexible web framework for Node.js that makes it easier to build
HTTP APIs and web servers. It provides routing, middleware, and helpers for handling requests
and responses.

### Where is it used?

Express is widely used to build REST APIs for web and mobile applications, from simple
prototypes to large production systems.

### Real-world example

Many JavaScript-based stacks (for example MERN: MongoDB, Express, React, Node) use Express.js
as the backend layer while React or other frameworks handle the frontend UI.

For the frontend of this toolkit, I used **React with Vite** for a fast development setup and
**axios** for making HTTP requests from the browser to the API.

---

## 3. System Requirements

- **Operating System:** Windows 10/11, macOS, or a modern Linux distribution
- **Tools:**
  - Node.js (LTS) and npm installed
  - VS Code or any code editor
  - Git (optional but recommended)
- **Backend dependencies:** `express`, `cors`, and optionally `nodemon` for auto-restarting during development
- **Frontend dependencies:** `react`, `react-dom`, `vite`, `axios`

---

## 4. Installation & Setup Instructions

> The project is organized into two parts:
> - `tasktide-backend` – Express API
> - `tasktide-frontend` – React + Vite UI

### 4.1 Backend: TaskTide Express API

**Step 1 – Get the code**

```bash
git clone <your-backend-repo-url> tasktide-backend
cd tasktide-backend
```

**Step 2 – Install dependencies**

```bash
npm install
```

**Step 3 – Project structure (simplified)**

```
tasktide-backend/
├── src/
│   ├── app.js
│   └── routes/
│       └── tasks.js
└── package.json
```

**Step 4 – Start the server**

```bash
npm start
```

You should see:

```
Server is running on port 3000
```

**Step 5 – Smoke test the API**

```
GET http://localhost:3000/health
→ Expected: { "status": "ok", "app": "TaskTide" }

GET http://localhost:3000/api/tasks
→ Expected: [] (empty array on first run)
```

---

### 4.2 Frontend: TaskTide React UI (Vite)

**Step 1 – Get the code**

```bash
git clone <your-frontend-repo-url> tasktide-frontend
cd tasktide-frontend
```

**Step 2 – Install dependencies**

```bash
npm install
```

**Step 3 – Start the Vite dev server**

```bash
npm run dev
```

You should see:

```
  ➜  Local:   http://localhost:5173/
```

**Step 4 – Open the UI**

Go to `http://localhost:5173/` in your browser. You should see the TaskTide UI with:

- A text input for the task title
- A priority dropdown (low / medium / high)
- A date picker for the due date
- An **Add task** button
- A message "No tasks yet." when the list is empty

> ⚠️ Make sure the backend is running on `http://localhost:3000` before using the frontend,
> otherwise API calls will fail.

---

## 5. Minimal Working Example

### 5.1 What the example does

TaskTide is a minimal full-stack app that demonstrates:

- Creating tasks with a title, priority, and optional due date
- Listing all tasks from the backend
- Updating a task's status (marking it as done)
- Deleting tasks
- Sorting tasks by priority (high → medium → low), and within each priority by earliest due date

It's small enough to understand quickly but realistic enough to resemble a real task API.

---

### 5.2 Backend: Example endpoint – POST /api/tasks

Below is the core endpoint used to create a task in memory:

```js
// src/routes/tasks.js

router.post('/', (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const now = new Date().toISOString();

  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    priority: priority || 'medium',
    status: 'todo',
    dueDate: dueDate || null,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});
```

**Request (JSON):**

```json
{
  "title": "Finish GenAI toolkit",
  "priority": "high",
  "dueDate": "2026-03-21T00:00:00.000Z"
}
```

**Response (JSON):**

```json
{
  "id": 1,
  "title": "Finish GenAI toolkit",
  "description": "",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-03-21T00:00:00.000Z",
  "createdAt": "2026-03-19T14:06:34.548Z",
  "updatedAt": "2026-03-19T14:06:34.548Z"
}
```

---

### 5.3 Frontend: axios + React example

In `src/App.jsx`, axios is used to communicate with the API:

```jsx
const API_BASE = "http://localhost:3000";

const [tasks, setTasks] = useState([]);
const [title, setTitle] = useState("");
const [priority, setPriority] = useState("medium");
const [dueDate, setDueDate] = useState("");
const [loading, setLoading] = useState(false);

const fetchTasks = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${API_BASE}/api/tasks`);
    setTasks(res.data);
  } catch (err) {
    console.error("Failed to fetch tasks", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchTasks();
}, []);

const createTask = async (e) => {
  e.preventDefault();
  if (!title.trim()) return;

  try {
    await axios.post(`${API_BASE}/api/tasks`, {
      title,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
    setTitle("");
    setPriority("medium");
    setDueDate("");
    fetchTasks();
  } catch (err) {
    console.error("Failed to create task", err);
  }
};
```

The component also includes:

- `markDone(id)` — calls `PATCH /api/tasks/:id/status`
- `deleteTask(id)` — calls `DELETE /api/tasks/:id`

---

### 5.4 Sorting by priority and due date

To make high-priority tasks appear first and earlier deadlines appear before later ones:

```jsx
const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

{[...tasks]
  .sort((a, b) => {
    // priority: high -> medium -> low
    const prioDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (prioDiff !== 0) return prioDiff;

    // due date, earliest first
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (a.dueDate) {
      return -1;
    } else if (b.dueDate) {
      return 1;
    }

    // if neither has a due date, keep original order
    return 0;
  })
  .map((task) => (
    // render each task here
  ))}
```

---

## 6. AI Prompt Journal

This section records how I used GenAI to learn and unblock myself throughout the project.

---

### Prompt 1 – Designing the Express Task API

**Prompt used:**
"Help me design a simple Express.js API for a task manager with endpoints to create, list, update status, and delete tasks in memory."

**AI response summary:**
The AI suggested using Express with separate routes, an in-memory tasks array, and typical REST
endpoints (GET /api/tasks, POST /api/tasks, PATCH /api/tasks/:id/status, DELETE /api/tasks/:id).
It also showed how to use `express.json()` middleware.

**How it influenced my work:**
I followed the recommended structure almost exactly, which helped me organize my backend cleanly
and understand how Express routing works.

**Helpfulness rating:** High – it accelerated the design phase and gave me a clear starting point.

---

### Prompt 2 – Debugging "Task not found" in PATCH

**Prompt used:**
"I get `{ "error": "Task not found" }` when calling PATCH /api/tasks/:id/status in Express.
I'm using an in-memory array. How do I debug this?"

**AI response summary:**
The AI explained that in-memory data is lost when the server restarts and that my PATCH might be
using an id that doesn't exist. It suggested checking GET /api/tasks first and confirming the id
from the POST response.

**How it influenced my work:**
I got into the habit of creating a new task with POST, reading the returned id, and using that
exact id in the PATCH URL.

**Helpfulness rating:** High – it clarified a common beginner pitfall with in-memory data.

---

### Prompt 3 – Fixing CORS between React and Express

**Prompt used:**
"My React (Vite) app on http://localhost:5173 gets 'blocked by CORS policy' when calling
http://localhost:3000/api/tasks with axios. How can I fix CORS in my Express API?"

**AI response summary:**
The AI told me to install the `cors` package, import it in `app.js`, and enable it with
`app.use(cors())` before my routes.

**How it influenced my work:**
After adding the CORS middleware, the browser stopped blocking requests and the React app
could communicate with the API normally.

**Helpfulness rating:** Very high – this was a show-stopper I wouldn't have fixed as quickly alone.

---

### Prompt 4 – Setting up Vite + React with axios

**Prompt used:**
"Show me how to set up a minimal React app with Vite that calls a local Express API using
axios and displays a list of tasks."

**AI response summary:**
The AI guided me through creating a Vite React project, installing axios, and writing a
component that uses `useEffect` to call GET /api/tasks, stores the response in state, and
maps over tasks to display them.

**How it influenced my work:**
I adapted that example directly into my `App.jsx`, then extended it with a form for creating
tasks and buttons for updating and deleting.

**Helpfulness rating:** High – it saved time and helped me connect the frontend and backend correctly.

---

### Prompt 5 – Sorting by priority and due date

**Prompt used:**
"How can I sort an array of task objects in JavaScript so that high priority tasks come first,
and within each priority group earlier due dates come before later ones?"

**AI response summary:**
The AI described how to write a custom comparison function for `Array.sort` using a priority
map and then comparing parsed dates.

**How it influenced my work:**
I implemented the combined sort logic (`PRIORITY_ORDER` + `new Date(dueDate)`) exactly as
suggested, which made my task list more meaningful to look at.

**Helpfulness rating:** Medium–high – it improved the UX and reinforced how custom sorting works in JavaScript.

---

## 7. Common Issues & Fixes

### 7.1 CORS error: React → Express

**Symptom:**

```
Access to XMLHttpRequest at 'http://localhost:3000/api/tasks' from origin
'http://localhost:5173' has been blocked by CORS policy…
```

**Root cause:**
Browsers block cross-origin requests if the server doesn't explicitly allow them.

**Fix:**

Install `cors` in the backend:

```bash
npm install cors
```

In `src/app.js`:

```js
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
```

Then restart the backend.

---

### 7.2 "Task not found" when updating status

**Symptom:**

```
{ "error": "Task not found" }
```

**Root cause:**
The id did not exist in the in-memory tasks array, usually because the server was restarted
after tasks were created, or the wrong id was used in the URL.

**Fix:**

1. Create a fresh task: `POST /api/tasks` → note the `id` in the response
2. Use that exact id: `PATCH /api/tasks/<id>/status`
3. Confirm available ids: `GET /api/tasks`

---

### 7.3 "Failed to resolve import 'axios'"

**Symptom:**

```
Failed to resolve import 'axios' from 'src/App.jsx'…
```

**Root cause:**
`axios` was imported before the package was installed.

**Fix:**

```bash
cd tasktide-frontend
npm install axios
npm run dev
```

---

### 7.4 Tasks not sorted by importance

**Symptom:**
Tasks were listed in creation order, making it hard to see what's important first.

**Fix:**
Sort tasks before rendering using a custom compare function based on both priority and due date
(see section 5.4).

---

## 8. References

- **Express.js – Routing guide:** https://expressjs.com/en/guide/routing.html
- **Express.js – Writing middleware:** https://expressjs.com/en/guide/writing-middleware.html
- **cors npm package:** https://www.npmjs.com/package/cors
- **MDN – Cross-Origin Resource Sharing (CORS):** https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- **MDN – Array.prototype.sort:** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
- **Vite – Getting started:** https://vitejs.dev/guide/
- **axios – Getting started:** https://axios-http.com/docs/intro
- **React – useEffect hook:** https://react.dev/reference/react/useEffect
- **React – useState hook:** https://react.dev/reference/react/useState

---

## 9. Reflection

Using GenAI as a "pair programmer" made it much faster to:

- Bootstrap an Express API and React frontend
- Debug tricky issues like CORS and missing tasks
- Improve the UX with sorting and due dates

The main challenge was keeping track of all moving pieces (backend, frontend, configs), but
the prompts helped me reason through errors and converge on a working toolkit that a beginner
can follow to build their own small full-stack project.
