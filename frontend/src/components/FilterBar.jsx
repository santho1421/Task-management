import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

const FilterBar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  onClearFilters,
}) => {
  const hasActiveFilters = searchQuery || statusFilter || priorityFilter || sortBy !== 'due_date_asc';

  return (
    <div
      className="card"
      style={{
        padding: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Search Input */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 240px',
          minWidth: '220px',
        }}
      >
        <Search
          size={18}
          color="var(--text-muted)"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="btn-icon"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.2rem',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter and Sort Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '130px', padding: '0.5rem 0.75rem' }}
          >
            <option value="">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '130px', padding: '0.5rem 0.75rem' }}
          >
            <option value="">Priority: All</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        {/* Sort Options */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '160px', padding: '0.5rem 0.75rem' }}
          >
            <option value="due_date_asc">Deadline: Soonest</option>
            <option value="due_date_desc">Deadline: Latest</option>
            <option value="created_at_desc">Newest First</option>
            <option value="created_at_asc">Oldest First</option>
            <option value="priority_desc">Priority: High to Low</option>
            <option value="title_asc">Title: A - Z</option>
          </select>
        </div>

        {/* Clear Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
            title="Reset filters"
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
