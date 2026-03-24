const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', app: 'TaskTide' });
});

app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});