import React from 'react';
import '../styles/FilterBar.css';

const FILTERS = [
  { id: 'all',       label: '◈  All' },
  { id: 'active',    label: '○  Pending' },
  { id: 'completed', label: '✓  Done' },
];

function FilterBar({ current, onChange }) {
  return (
    <div className="filter-bar">
      <span className="filter-bar__lbl">View</span>
      {FILTERS.map(f => (
        <button
          key={f.id}
          className={`f-btn${current === f.id ? ' f-btn--on' : ''}`}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
