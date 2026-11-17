import { CheckCheck, ClipboardList, LayoutDashboard, ListTodo } from "lucide-react";
import "../styles/Sidebar.css";

function Sidebar({ activeFilter, onFilterChange, taskCounts }) {
  const navigation = [
    { label: "Dashboard", filter: "All", icon: LayoutDashboard },
    { label: "All Tasks", filter: "All", icon: ListTodo, count: taskCounts.total },
    { label: "Pending Tasks", filter: "Pending", icon: ClipboardList, count: taskCounts.pending },
    { label: "Completed Tasks", filter: "Completed", icon: CheckCheck, count: taskCounts.completed },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><CheckCheck size={21} strokeWidth={2.5} /></div>
        <span>Task<span className="brand-accent">Flow</span></span>
      </div>

      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, filter, icon: Icon, count }, index) => {
          const isActive =
            index === 0
              ? activeFilter === "All"
              : activeFilter === filter && (filter !== "All" || label === "All Tasks");

          return (
            <button
              className={`nav-item ${isActive ? "active" : ""}`}
              key={label}
              onClick={() => onFilterChange(filter)}
              type="button"
            >
              <Icon size={18} />
              <span>{label}</span>
              {count !== undefined && <span className="nav-count">{count}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <div className="tip-icon">✦</div>
          <p className="tip-title">Stay on track</p>
          <p className="tip-copy">Small steps every day lead to big results.</p>
        </div>
        <div className="sidebar-footer">Your personal task space</div>
      </div>
    </aside>
  );
}

export default Sidebar;
