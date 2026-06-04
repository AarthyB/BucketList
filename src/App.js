import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import useLocalStorage from './hooks/useLocalStorage';
import AddTask from './components/AddTask';
import BucketItem from './components/BucketItem';
import FilterBar from './components/FilterBar';
import EditModal from './components/EditModal';


function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const STAR_COUNT = 160;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x:     Math.random(),
      y:     Math.random(),
      r:     Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      hue:   Math.random() > 0.7 ? 220 : 210,
    }));

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        const alpha = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.speed * 0.001 + s.phase));
        const grd = ctx.createRadialGradient(
          s.x * canvas.width, s.y * canvas.height, 0,
          s.x * canvas.width, s.y * canvas.height, s.r * 2.5
        );
        grd.addColorStop(0, `hsla(${s.hue},80%,98%,${alpha})`);
        grd.addColorStop(1, `hsla(${s.hue},80%,98%,0)`);
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

function App() {
  const [items, setItems] = useLocalStorage('bl-v3', []);
  const [filter, setFilter] = useState('all');
  const [editingItem, setEditingItem] = useState(null);

  /* ── Derived ── */
  const total     = items.length;
  const doneCount = items.filter(i => i.completed).length;
  const leftCount = total - doneCount;
  const pct       = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const visible = items.filter(item => {
    if (filter === 'completed') return item.completed;
    if (filter === 'active')    return !item.completed;
    return true;
  });

  /* ── Add ── */
  const handleAdd = ({ text, note, category }) => {
    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      note,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
  };

  /* ── Toggle ── */
  const handleToggle = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  /* ── Delete ── */
  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  /* ── Save edit ── */
  const handleSave = ({ text, note, category }) => {
    const id = editingItem.id;
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, text, note, category } : item
      )
    );
    setEditingItem(null);
  };

  /* ── Empty copy ── */
  const emptyIcon  = filter === 'completed' ? '🌟' : filter === 'active' ? '🌙' : '🗺️';
  const emptyTitle = filter === 'completed' ? 'Nothing achieved yet'
                   : filter === 'active'    ? 'All done — great work!'
                   : 'Your bucket list awaits';
  const emptySub   = filter === 'all'
                   ? 'Add your first dream above to get started.'
                   : 'Switch the filter to see other items.';

  return (
    <>
      <Starfield />
      <div className="app" style={{ position: "relative", zIndex: 1 }}>
      <div className="app__container">

        {/* Header */}
        <header className="app__header">
          <div className="app__pill">
            <span className="app__pill-dot" />
            Live fully
          </div>
          <h1 className="app__title">Bucket List</h1>
          <p className="app__subtitle">Your adventures, tracked &amp; conquered.</p>
        </header>

        {/* Stats */}
        {total > 0 && (
          <div className="stats-row">
            <div className="stat-card stat-card--dreams">
              <span className="stat-card__n">{total}</span>
              <span className="stat-card__l">Dreams</span>
            </div>
            <div className="stat-card stat-card--done">
              <span className="stat-card__n">{doneCount}</span>
              <span className="stat-card__l">Achieved</span>
            </div>
            <div className="stat-card stat-card--left">
              <span className="stat-card__n">{leftCount}</span>
              <span className="stat-card__l">Remaining</span>
            </div>
          </div>
        )}

        {/* Progress */}
        {total > 0 && (
          <div className="progress-wrap">
            <div className="progress-meta">
              <span className="progress-label">Progress</span>
              <span className="progress-pct">{pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {/* Add form */}
        <AddTask onAdd={handleAdd} />

        {/* Filter */}
        {total > 0 && (
          <FilterBar current={filter} onChange={setFilter} />
        )}

        {/* List or empty */}
        {visible.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">{emptyIcon}</div>
            <h3>{emptyTitle}</h3>
            <p>{emptySub}</p>
          </div>
        ) : (
          <div className="items-list">
            {visible.map((item, i) => (
              <div key={item.id} style={{ animationDelay: `${i * 0.035}s` }}>
                <BucketItem
                  item={item}
                  onToggle={handleToggle}
                  onEdit={setEditingItem}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Edit modal */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
    </>
  );
}

export default App;
