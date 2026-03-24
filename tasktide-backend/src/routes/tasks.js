const express = require('express');
const router = express.Router();

//Temp in-memory storage for tasks
let nextId=1;
const tasks = [];

//GET /api/tasks - return all tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

//POST /api/tasks - create a new task
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
        status:'todo',
        dueDate: dueDate || null,
        createdAt: now,
        updatedAt: now
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});


router.patch('/:id/status', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { status } = req.body;

    const allowedStatuses = ['todo', 'in-progress', 'done'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ 
            error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}`,
        });
    }

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();

    res.json(task);
});

router.delete('/:id', (req, res) => {
    const taskId = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === taskId);

    if (index === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks.splice(index, 1);

    res.status(204).send();
});
module.exports = router;