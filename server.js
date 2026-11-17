require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the Vite React development server.
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

// Convert incoming JSON request bodies into JavaScript objects.
app.use(express.json());

// A small route to check whether the server is running.
app.get('/', (req, res) => {
    res.json({ message: 'TaskFlow API is running' });
});

// All task endpoints begin with /api/tasks.
app.use('/api/tasks', taskRoutes);

// Handle invalid routes.
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// General error handler.
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Check the MySQL connection before starting the server.
async function startServer() {
    try {
        const connection = await db.getConnection();
        console.log('Connected to MySQL database!');
        connection.release();

        app.listen(PORT, () => {
            console.log(`TaskFlow backend running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Could not connect to MySQL:', error.message);
        process.exit(1);
    }
}

startServer();
