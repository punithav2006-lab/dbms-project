import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "../styles/AddTask.css";

function AddTask({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "Medium");
  const [error, setError] = useState("");

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{task ? "UPDATE YOUR TASK" : "MAKE IT HAPPEN"}</p>
            <h2 id="task-modal-title">{task ? "Edit task" : "Create a task"}</h2>
          </div>
          <button className="icon-button close-button" type="button" onClick={onClose} aria-label="Close form">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Task title <span className="required">*</span></span>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Prepare project presentation"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) setError("");
              }}
              maxLength={100}
            />
          </label>

          <label className="form-field">
            <span>Description <span className="optional">(optional)</span></span>
            <textarea
              placeholder="Add a few details about this task..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={255}
            />
          </label>

          <div className="form-row">
            <label className="form-field">
              <span>Due date</span>
              <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
            </label>

            <label className="form-field">
              <span>Priority</span>
              <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit">{task ? "Save Changes" : "Add Task"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddTask;
