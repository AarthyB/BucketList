import React, { useState, useEffect, useCallback } from 'react';
import { CATEGORIES } from './AddTask';
import '../styles/EditModal.css';

function EditModal({ item, onSave, onClose }) {
  const [text, setText] = useState(item.text || '');
  const [note, setNote] = useState(item.note || '');
  const [category, setCategory] = useState(item.category || 'adventure');

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSave({ text: trimmed, note: note.trim(), category });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal" role="dialog" aria-modal="true">

        <div className="modal__hdr">
          <h2 className="modal__title">Edit <em>Dream</em></h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal__field">
          <label className="modal__lbl">Dream</label>
          <input
            className="modal__input"
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's your dream?"
            autoFocus
          />
        </div>

        <div className="modal__field">
          <label className="modal__lbl">Category</label>
          <select
            className="modal__select"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="modal__field">
          <label className="modal__lbl">Note</label>
          <textarea
            className="modal__textarea"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Details, inspiration… (optional)"
          />
        </div>

        <div className="modal__footer">
          <button className="modal__btn modal__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal__btn modal__btn--save"
            onClick={handleSave}
            disabled={!text.trim()}
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditModal;
