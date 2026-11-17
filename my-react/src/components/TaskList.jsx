import { ClipboardList } from "lucide-react";
import TaskItem from "./TaskItem";
import "../styles/TaskList.css";

function TaskList({ tasks, onEditTask, onDeleteTask, onToggleStatus, onAddTask }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><ClipboardList size={28} /></div>
        <h3>No tasks found</h3>
        <p>There’s nothing here right now. Add a task to get started.</p>
        <button className="primary-button" type="button" onClick={onAddTask}> <span>＋</span> Create your first task</button>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
          onToggleStatus={() => onToggleStatus(task.id)}
        />
      ))}
    </div>
  );
}

export default TaskList;
