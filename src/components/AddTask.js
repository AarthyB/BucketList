import React, { useState } from 'react';
import '../styles/AddTask.css';

export const CATEGORIES = [
  { value: 'adventure',  label: '🏔️  Adventure' },
  { value: 'travel',     label: '✈️  Travel' },
  { value: 'learning',   label: '📚  Learning' },
  { value: 'experience', label: '🎭  Experience' },
  { value: 'health',     label: '💪  Health' },
  { value: 'creative',   label: '🎨  Creative' },
  { value: 'other',      label: '✦   Other' },
];

function AddTask({ onAdd }) {
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('adventure');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ text: trimmed, note: note.trim(), category });
    setText('');
    setNote('');
    setCategory('adventure');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="add-task">
      <div className="add-task__label">
        <span className="add-task__label-dot" />
        Add a Dream
      </div>

      <div className="add-task__row1">
        <input
          className="add-task__input"
          type="text"
          placeholder="What's on your bucket list?"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <select
          className="add-task__select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="add-task__row2">
        <textarea
          className="add-task__textarea"
          placeholder="Add a note… (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <button
          className="add-task__btn"
          onClick={handleAdd}
          disabled={!text.trim()}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default AddTask;
