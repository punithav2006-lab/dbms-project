import { CalendarDays, Check, Pencil, Trash2 } from "lucide-react";
import "../styles/TaskItem.css";

function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
  const formattedDueDate = task.dueDate
    ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No due date";

  return (
    <article className={`task-item ${task.status === "Completed" ? "is-completed" : ""}`}>
      <button
        className={`completion-check ${task.status === "Completed" ? "checked" : ""}`}
        type="button"
        onClick={onToggleStatus}
        aria-label={task.status === "Completed" ? "Mark as pending" : "Mark as completed"}
        title={task.status === "Completed" ? "Mark as pending" : "Mark as completed"}
      >
        {task.status === "Completed" && <Check size={14} strokeWidth={3} />}
      </button>

      <div className="task-main">
        <div className="task-title-row">
          <h3>{task.title}</h3>
          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            <span className="priority-dot" />{task.priority}
          </span>
        </div>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className="due-date"><CalendarDays size={14} />{formattedDueDate}</span>
          <span className={`status-badge status-${task.status.toLowerCase()}`}>{task.status}</span>
        </div>
      </div>

      <div className="task-actions">
        <button className="icon-button" type="button" onClick={onEdit} aria-label={`Edit ${task.title}`} title="Edit task">
          <Pencil size={16} />
        </button>
        <button className="icon-button delete-action" type="button" onClick={() => {
          if (window.confirm(`Delete "${task.title}"?`)) onDelete();
        }} aria-label={`Delete ${task.title}`} title="Delete task">
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
