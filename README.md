# TaskFlow Backend

Backend for the TaskFlow To-Do List Management System.

## 1. Requirements

- Node.js and npm
- MySQL Server running
- Existing MySQL database named `todo_db`
- Existing table named `tasks` with these columns:
  `task_id`, `task_title`, `description`, `due_date`, `priority`,
  `status`, `created_at`, `updated_at`

## 2. Install

Open a terminal inside this `backend` folder and run:

```bash
npm install
```

Copy `.env.example` to a new file named `.env`, then enter your actual MySQL credentials.
Do not include `.env` in GitHub.

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=todo_db
DB_PORT=3306
```

If your MySQL root account has no password, leave `DB_PASSWORD=` empty.

## 3. Start the server

```bash
npm run dev
```

Or:

```bash
npm start
```

The server checks the MySQL connection before listening on port 5000.
Open `http://localhost:5000` to check the server status.

## 4. API endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks?status=Pending` | Filter by status |
| GET | `/api/tasks?search=React` | Search title |
| GET | `/api/tasks/stats` | Dashboard counts |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Edit task details |
| PATCH | `/api/tasks/:id/status` | Change task status |
| DELETE | `/api/tasks/:id` | Delete a task |

POST example JSON:

```json
{
  "task_title": "Learn Node.js",
  "description": "Understand Express",
  "due_date": "2026-11-25",
  "priority": "High"
}
```

PUT example JSON:

```json
{
  "task_title": "Learn Express",
  "description": "Practise Express routes",
  "due_date": "2026-11-26",
  "priority": "Medium"
}
```

PATCH example JSON:

```json
{
  "status": "Completed"
}
```

## 5. React Fetch API examples

Use this base URL in your React code:

```javascript
const API_URL = 'http://localhost:5000/api/tasks';
```

### Load tasks

```javascript
const response = await fetch(API_URL);
if (!response.ok) throw new Error('Could not load tasks');
const tasks = await response.json();
setTasks(tasks);
```

### Add a task

```javascript
const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        task_title: formData.task_title,
        description: formData.description,
        due_date: formData.due_date || null,
        priority: formData.priority
    })
});

if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Could not add task');
}

// Refresh from the database so React receives the generated task_id.
await loadTasks();
```

### Edit a task

```javascript
const response = await fetch(`${API_URL}/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        task_title: formData.task_title,
        description: formData.description,
        due_date: formData.due_date || null,
        priority: formData.priority
    })
});

if (!response.ok) throw new Error('Could not update task');
await loadTasks();
```

### Change task status

```javascript
const response = await fetch(`${API_URL}/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'Completed' })
});

if (!response.ok) throw new Error('Could not update status');
await loadTasks();
```

To mark it pending, send `{ status: 'Pending' }`.

### Delete a task

```javascript
const response = await fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE'
});

if (!response.ok) throw new Error('Could not delete task');
await loadTasks();
```

### Load dashboard statistics

```javascript
const response = await fetch(`${API_URL}/stats`);
if (!response.ok) throw new Error('Could not load statistics');
const stats = await response.json();

// Example properties:
// stats.total_tasks
// stats.pending_tasks
// stats.completed_tasks
```

### Filter and search

```javascript
const response = await fetch(`${API_URL}?status=Pending&search=React`);
if (!response.ok) throw new Error('Could not filter tasks');
const filteredTasks = await response.json();
setTasks(filteredTasks);
```

When putting user-entered search text into a URL, use `encodeURIComponent(searchText)`.

## 6. Important frontend/database field mapping

The database and API use snake_case names:
- `task_id`
- `task_title`
- `due_date`

Your React frontend may currently use camelCase names such as `id`, `title`, or `dueDate`.
Either update the frontend to use the API field names, or map the returned objects before setting state.

For example:

```javascript
const uiTasks = tasks.map(task => ({
    id: task.task_id,
    title: task.task_title,
    description: task.description,
    dueDate: task.due_date,
    priority: task.priority,
    status: task.status
}));
```

MySQL DATE values may be returned as strings or date objects depending on driver settings.
If a date needs formatting for an HTML date input, ensure it is in `YYYY-MM-DD` format.

## 7. Suggested React loading pattern

Define `loadTasks` inside your component and call it from `useEffect`:

```javascript
const loadTasks = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Could not load tasks');
    const data = await response.json();
    setTasks(data);
};

useEffect(() => {
    loadTasks().catch(error => console.error(error));
}, []);
```

After each successful add, edit, status update, or delete, call `loadTasks()` again.
This keeps the displayed list synchronized with MySQL.

## Notes

- All SQL values are passed using placeholders (`?`) and parameter arrays.
- The API validates task title, priority, status, and numeric task IDs.
- The API does not create or modify the database schema.
- Make sure your MySQL table uses the exact column names listed above.
