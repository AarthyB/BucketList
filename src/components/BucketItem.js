import React from 'react';
import '../styles/BucketItem.css';

const CAT_META = {
  adventure:  { label: '🏔️ Adventure',  col: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.22)' },
  travel:     { label: '✈️ Travel',     col: '#38bdf8', bg: 'rgba(56,189,248,0.09)', border: 'rgba(56,189,248,0.2)'  },
  learning:   { label: '📚 Learning',   col: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.22)'},
  experience: { label: '🎭 Experience', col: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.22)'},
  health:     { label: '💪 Health',     col: '#4ade80', bg: 'rgba(74,222,128,0.09)', border: 'rgba(74,222,128,0.2)' },
  creative:   { label: '🎨 Creative',   col: '#facc15', bg: 'rgba(250,204,21,0.09)', border: 'rgba(250,204,21,0.2)' },
  other:      { label: '✦ Other',       col: '#94a3b8', bg: 'rgba(148,163,184,0.08)',border: 'rgba(148,163,184,0.18)'},
};

function BucketItem({ item, onToggle, onEdit, onDelete }) {
  const cat = CAT_META[item.category] || CAT_META.other;

  const date = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      className={`bucket-item${item.completed ? ' bucket-item--done' : ''}`}
      style={{ '--item-color': cat.col }}
    >
      {/* Toggle */}
      <button
        className={`item-check${item.completed ? ' item-check--done' : ''}`}
        onClick={() => onToggle(item.id)}
        aria-label={item.completed ? 'Mark pending' : 'Mark done'}
        title={item.completed ? 'Mark as pending' : 'Mark as complete'}
      >
        {item.completed && <span className="item-check__icon">✓</span>}
      </button>

      {/* Content */}
      <div className="item-content">
        <div className="item-top">
          <span
            className="item-cat"
            style={{
              color: cat.col,
              background: cat.bg,
              borderColor: cat.border,
            }}
          >
            {cat.label}
          </span>
          <span className="item-date">{date}</span>
        </div>
        <p className="item-text">{item.text}</p>
        {item.note && <p className="item-note">{item.note}</p>}
      </div>

      {/* Actions */}
      <div className="item-actions">
        <button
          className="act-btn act-btn--edit"
          onClick={() => onEdit(item)}
          title="Edit"
          aria-label="Edit"
        >
          ✎
        </button>
        <button
          className="act-btn act-btn--del"
          onClick={() => onDelete(item.id)}
          title="Delete"
          aria-label="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default BucketItem;
