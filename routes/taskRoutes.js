const express = require('express');
const db = require('../db');

const router = express.Router();

const allowedPriorities = ['Low', 'Medium', 'High'];
const allowedStatuses = ['Pending', 'Completed'];

function isValidId(id) {
    return /^[1-9]\d*$/.test(String(id));
}

// GET /api/tasks/stats
// Return dashboard counts. Keep this route above GET /:id if you add that route later.
router.get('/stats', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                COUNT(*) AS total_tasks,
                COALESCE(SUM(status = 'Pending'), 0) AS pending_tasks,
                COALESCE(SUM(status = 'Completed'), 0) AS completed_tasks
            FROM tasks
        `);

        res.json(rows[0]);
    } catch (error) {
        console.error('Stats query failed:', error);
        res.status(500).json({ message: 'Could not retrieve task statistics' });
    }
});

// GET /api/tasks?status=Pending&search=React
router.get('/', async (req, res) => {
    try {
        const { status, search } = req.query;

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Status must be Pending or Completed'
            });
        }

        let sql = 'SELECT * FROM tasks WHERE 1 = 1';
        const values = [];

        if (status) {
            sql += ' AND status = ?';
            values.push(status);
        }

        if (search) {
            sql += ' AND task_title LIKE ?';
            values.push(`%${search}%`);
        }

        sql += ' ORDER BY created_at DESC, task_id DESC';

        const [tasks] = await db.execute(sql, values);
        res.json(tasks);
    } catch (error) {
        console.error('Get tasks failed:', error);
        res.status(500).json({ message: 'Could not retrieve tasks' });
    }
});

// POST /api/tasks
router.post('/', async (req, res) => {
    try {
        const { task_title, description, due_date, priority } = req.body;

        if (typeof task_title !== 'string' || !task_title.trim()) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        if (task_title.trim().length > 100) {
            return res.status(400).json({ message: 'Task title must be 100 characters or fewer' });
        }

        if (description != null && String(description).length > 255) {
            return res.status(400).json({ message: 'Description must be 255 characters or fewer' });
        }

        if (priority && !allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: 'Priority must be Low, Medium or High'
            });
        }

        const [result] = await db.execute(
            `INSERT INTO tasks (task_title, description, due_date, priority)
             VALUES (?, ?, ?, ?)`,
            [
                task_title.trim(),
                description || null,
                due_date || null,
                priority || 'Medium'
            ]
        );

        res.status(201).json({
            message: 'Task created successfully',
            task_id: result.insertId
        });
    } catch (error) {
        console.error('Create task failed:', error);
        res.status(500).json({ message: 'Could not create task. Check the supplied date and values.' });
    }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task_title, description, due_date, priority } = req.body;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        if (typeof task_title !== 'string' || !task_title.trim()) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        if (task_title.trim().length > 100) {
            return res.status(400).json({ message: 'Task title must be 100 characters or fewer' });
        }

        if (description != null && String(description).length > 255) {
            return res.status(400).json({ message: 'Description must be 255 characters or fewer' });
        }

        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: 'Priority must be Low, Medium or High'
            });
        }

        const [result] = await db.execute(
            `UPDATE tasks
             SET task_title = ?, description = ?, due_date = ?, priority = ?
             WHERE task_id = ?`,
            [
                task_title.trim(),
                description || null,
                due_date || null,
                priority,
                Number(id)
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Update task failed:', error);
        res.status(500).json({ message: 'Could not update task. Check the supplied date and values.' });
    }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Status must be Pending or Completed'
            });
        }

        const [result] = await db.execute(
            'UPDATE tasks SET status = ? WHERE task_id = ?',
            [status, Number(id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task status updated successfully' });
    } catch (error) {
        console.error('Update status failed:', error);
        res.status(500).json({ message: 'Could not update task status' });
    }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const [result] = await db.execute(
            'DELETE FROM tasks WHERE task_id = ?',
            [Number(id)]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task failed:', error);
        res.status(500).json({ message: 'Could not delete task' });
    }
});

module.exports = router;
