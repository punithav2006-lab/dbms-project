import { Search, X } from "lucide-react";
import "../styles/SearchBar.css";

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-box">
      <Search size={18} />
      <input
        type="search"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search tasks by title"
      />
      {searchTerm && (
        <button type="button" onClick={() => onSearchChange("")} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
