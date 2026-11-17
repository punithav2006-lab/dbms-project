import { CheckCircle2, ListTodo, Timer } from "lucide-react";
import "../styles/SummaryCards.css";

function SummaryCards({ taskCounts }) {
  const cards = [
    {
      label: "Total Tasks",
      value: taskCounts.total,
      note: "Tasks in your workspace",
      icon: ListTodo,
      style: "purple",
    },
    {
      label: "Pending Tasks",
      value: taskCounts.pending,
      note: "Still waiting for you",
      icon: Timer,
      style: "orange",
    },
    {
      label: "Completed Tasks",
      value: taskCounts.completed,
      note: "Great work, keep it up!",
      icon: CheckCircle2,
      style: "green",
    },
  ];

  return (
    <section className="summary-grid" aria-label="Task summary">
      {cards.map(({ label, value, note, icon: Icon, style }) => (
        <article className="summary-card" key={label}>
          <div className={`summary-icon ${style}`}><Icon size={21} /></div>
          <div className="summary-details">
            <p className="summary-label">{label}</p>
            <div className="summary-value">{value}</div>
            <p className="summary-note">{note}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export default SummaryCards;
