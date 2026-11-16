import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AddTask from "./components/AddTask";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Complete DBMS Assignment",
    description: "Finish SQL queries and documentation",
    dueDate: "2026-11-20",
    priority: "High",
    status: "Pending",
  },
  {
    id: 2,
    title: "Revise React Hooks",
    description: "Practise useState and useEffect",
    dueDate: "2026-11-18",
    priority: "Medium",
    status: "Completed",
  },
  {
    id: 3,
    title: "Solve LeetCode Problems",
    description: "Practise two coding problems",
    dueDate: "2026-11-21",
    priority: "Low",
    status: "Pending",
  },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const taskCounts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "Pending").length,
    completed: tasks.filter((task) => task.status === "Completed").length,
  }), [tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        activeFilter === "All" || task.status === activeFilter;
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, activeFilter, searchTerm]);

  function handleSaveTask(taskDetails) {
    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...taskDetails }
            : task
        )
      );
    } else {
      const newTask = {
        id: Date.now(),
        ...taskDetails,
        status: "Pending",
      };
      setTasks((currentTasks) => [newTask, ...currentTasks]);
    }

    closeForm();
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingTask(null);
  }

  function handleEditTask(task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  function handleDeleteTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  }

  function handleToggleStatus(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "Completed" ? "Pending" : "Completed",
            }
          : task
      )
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        taskCounts={taskCounts}
      />

      <main className="main-content">
        <Dashboard
          tasks={visibleTasks}
          taskCounts={taskCounts}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddTask={() => setIsFormOpen(true)}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      </main>

      {isFormOpen && (
        <AddTask
          task={editingTask}
          onSave={handleSaveTask}
          onClose={closeForm}
        />
      )}
    </div>
  );
}

export default App;
