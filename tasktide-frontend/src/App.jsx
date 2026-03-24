import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low:2,
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState("");


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

  const markDone = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/tasks/${id}/status`, {
        status: "done",
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

    const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };


  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>TaskTide</h1>

      <form onSubmit={createTask} style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "0.5rem", width: "60%", marginRight: "0.5rem" }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>

        <input
        type="date"
        value={dueDate}
        onChange={(e)=> setDueDate(e.target.value)}
        style={{padding:"0.5rem",marginRight:"0.5rem"}}
        />
        <button type="submit">Add task</button>
      </form>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {[...tasks]
          .sort((a, b) => {
            //priority high,medium,low
            const prioDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
            if (prioDiff !== 0) return prioDiff;

            //due date, earliest first
            if (a.dueDate && b.dueDate) {
              return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (a.dueDate) {
              return -1;
            } else if (b.dueDate) {
              return 1;
            }

            //default to created order
            return 0;
          })
          .map((task) => (
            <li
              key={task.id}
              style={{
                padding: "0.5rem 0",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{task.title}</strong>{" "}
                <span style={{ fontSize: "0.9rem", color: "#555" }}>
                  ({task.priority}) - {task.status}
                  {task.dueDate && (
                    <>.due {new Date(task.dueDate).toLocaleDateString()}</>
                  )}
                </span>
              </div>
              {task.status !== "done" && (
                <button onClick={() => markDone(task.id)}>Mark as done</button>
              )}
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
