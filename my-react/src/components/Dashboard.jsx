import { Plus } from "lucide-react";
import SummaryCards from "./SummaryCards";
import SearchBar from "./SearchBar";
import TaskList from "./TaskList";
import "../styles/Dashboard.css";

function Dashboard({
  tasks,
  taskCounts,
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
}) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const filters = [
    { label: "All Tasks", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Completed", value: "Completed" },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Welcome back!</h1>
          <p className="header-subtitle">Here’s what’s happening with your tasks today.</p>
        </div>
        <div className="header-actions">
          <div className="today-date">{formattedDate}</div>
          <button className="primary-button" onClick={onAddTask} type="button">
            <Plus size={18} />
            <span>Add New Task</span>
          </button>
        </div>
      </header>

      <SummaryCards taskCounts={taskCounts} />

      <section className="tasks-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR WORK, ORGANIZED</p>
            <h2>My Tasks</h2>
          </div>
          <span className="task-total">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
        </div>

        <div className="task-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter tasks">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`filter-tab ${activeFilter === filter.value ? "selected" : ""}`}
                onClick={() => onFilterChange(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>

        <TaskList
          tasks={tasks}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onToggleStatus={onToggleStatus}
          onAddTask={onAddTask}
        />
      </section>
    </div>
  );
}

export default Dashboard;
