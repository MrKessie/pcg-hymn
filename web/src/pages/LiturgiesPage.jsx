// src/pages/LiturgiesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_LITURGIES } from '../data/liturgyData';
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  CloseIcon,
  CopyIcon,
  SingleCheckIcon,
  HymnIcon,
} from '../config/icons';
import Swal from 'sweetalert2';

const LiturgiesPage = () => {
  const navigate = useNavigate();
  const [liturgies, setLiturgies] = useState(DEFAULT_LITURGIES);
  const [selectedId, setSelectedId] = useState(DEFAULT_LITURGIES[0].id);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Edit/Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_twi: '',
    category: 'Creed',
    rubric: '',
    content_en: '',
    content_twi: '',
    recommended_hymns: '',
  });

  // Load custom liturgies from localStorage if saved
  useEffect(() => {
    const saved = localStorage.getItem('pcg_custom_liturgies');
    if (saved) {
      try {
        setLiturgies(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    }
  }, []);

  const saveLiturgiesToStorage = (newList) => {
    setLiturgies(newList);
    localStorage.setItem('pcg_custom_liturgies', JSON.stringify(newList));
  };

  const currentLiturgy = liturgies.find((l) => l.id === selectedId) || liturgies[0];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title_en: '',
      title_twi: '',
      category: 'Order of Service',
      rubric: '',
      content_en: '',
      content_twi: '',
      recommended_hymns: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title_en: item.title_en || '',
      title_twi: item.title_twi || '',
      category: item.category || 'Creed',
      rubric: item.rubric || '',
      content_en: item.content_en || '',
      content_twi: item.content_twi || '',
      recommended_hymns: item.recommended_hymns ? item.recommended_hymns.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title_en.trim() || !formData.content_en.trim()) {
      Swal.fire('Required Fields', 'Please provide English title and content.', 'warning');
      return;
    }

    const hymnsArray = formData.recommended_hymns
      ? formData.recommended_hymns
          .split(',')
          .map((n) => parseInt(n.trim(), 10))
          .filter((n) => !isNaN(n))
      : [];

    const newItem = {
      id: editingItem ? editingItem.id : `liturgy_${Date.now()}`,
      title_en: formData.title_en.trim(),
      title_twi: formData.title_twi.trim() || null,
      category: formData.category,
      rubric: formData.rubric.trim() || null,
      content_en: formData.content_en.trim(),
      content_twi: formData.content_twi.trim() || null,
      recommended_hymns: hymnsArray,
    };

    let updated;
    if (editingItem) {
      updated = liturgies.map((l) => (l.id === editingItem.id ? newItem : l));
    } else {
      updated = [newItem, ...liturgies];
      setSelectedId(newItem.id);
    }

    saveLiturgiesToStorage(updated);
    setIsModalOpen(false);
    Swal.fire({
      title: 'Saved!',
      text: `Liturgy "${newItem.title_en}" saved.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      title: 'Copied to Clipboard!',
      text: 'Liturgical text is ready to paste into your bulletin or slides.',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const categories = ['All', ...new Set(liturgies.map((l) => l.category))];

  const filteredLiturgies = liturgies.filter((l) => {
    if (selectedCategory !== 'All' && l.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.title_en.toLowerCase().includes(q) ||
        l.title_twi?.toLowerCase().includes(q) ||
        l.content_en.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Presbyterian Liturgies & Orders of Service</h1>
          <p>Creeds, Sacraments, Canticles, and Lord's Day service rituals in English & Twi</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <AddIcon /> Add Liturgy / Order
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        {/* Left: Liturgies Sidebar List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card-container" style={{ padding: 16 }}>
            {/* Search */}
            <div className="filter-search-box" style={{ width: '100%', marginBottom: 12 }}>
              <span className="search-icon-pos" style={{ left: 10, top: 10, position: 'absolute' }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search liturgies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '8px 12px 8px 32px' }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  style={{ fontSize: 11, padding: '3px 9px' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Liturgy Items Navigation List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 'calc(100vh - 340px)', overflowY: 'auto' }}>
              {filteredLiturgies.map((item) => {
                const isActive = item.id === selectedId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: isActive ? 'var(--pcg-blue-subtle)' : '#ffffff',
                      border: isActive ? '1px solid var(--pcg-blue)' : '1px solid var(--border-color)',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-gray" style={{ fontSize: 10 }}>{item.category}</span>
                      {item.recommended_hymns && item.recommended_hymns.length > 0 && (
                        <span style={{ fontSize: 11, color: 'var(--pcg-blue)', fontWeight: 600 }}>
                          {item.recommended_hymns.length} Hymns
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: isActive ? 'var(--pcg-blue)' : 'var(--text-primary)', marginTop: 4 }}>
                      {item.title_en}
                    </div>
                    {item.title_twi && (
                      <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
                        {item.title_twi}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Dual Column Display Panel */}
        {currentLiturgy ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Top Toolbar for Selected Liturgy */}
            <div className="card-container" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge-blue">{currentLiturgy.category}</span>
                  {currentLiturgy.rubric && (
                    <span className="rubric-text" style={{ margin: 0 }}>
                      ⚠️ {currentLiturgy.rubric}
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--pcg-blue-dark)', marginTop: 6 }}>
                  {currentLiturgy.title_en}
                </h2>
                {currentLiturgy.title_twi && (
                  <p style={{ fontSize: 14, color: '#64748b', fontStyle: 'italic' }}>
                    {currentLiturgy.title_twi}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleCopyText(`${currentLiturgy.title_en}\n\n${currentLiturgy.content_en}`)}>
                  <CopyIcon /> Copy English
                </button>
                {currentLiturgy.content_twi && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleCopyText(`${currentLiturgy.title_twi}\n\n${currentLiturgy.content_twi}`)}>
                    <CopyIcon /> Copy Twi
                  </button>
                )}
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenEdit(currentLiturgy)}>
                  <EditIcon /> Edit
                </button>
              </div>
            </div>

            {/* Recommended Linked Hymns */}
            {currentLiturgy.recommended_hymns && currentLiturgy.recommended_hymns.length > 0 && (
              <div className="card-container" style={{ padding: '14px 20px', background: 'var(--pcg-gold-light)', borderColor: '#fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HymnIcon style={{ color: '#b45309' }} />
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: '#92400e' }}>
                    Recommended Liturgical Hymns:
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {currentLiturgy.recommended_hymns.map((num) => (
                      <span
                        key={num}
                        className="hymn-number-badge"
                        style={{ background: '#ffffff', cursor: 'pointer' }}
                        onClick={() => navigate('/hymns')}
                      >
                        Hymn #{num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dual Content Columns */}
            <div className="liturgy-split-view" style={{ marginTop: 0 }}>
              {/* English Column */}
              <div className="liturgy-panel">
                <div className="liturgy-panel-header">
                  <span style={{ fontWeight: 700, color: 'var(--pcg-blue-dark)' }}>English Liturgical Text</span>
                  <span className="badge badge-blue">Official PCG Order</span>
                </div>
                <div className="liturgy-text-content">
                  {currentLiturgy.content_en}
                </div>
              </div>

              {/* Twi Column */}
              <div className="liturgy-panel">
                <div className="liturgy-panel-header">
                  <span style={{ fontWeight: 700, color: 'var(--pcg-blue-dark)' }}>Twi Kasasuo (Liturgi)</span>
                  <span className="badge badge-gold">Twi Translation</span>
                </div>
                <div className="liturgy-text-content">
                  {currentLiturgy.content_twi || (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No Twi translation provided for this liturgy yet.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Add / Edit Liturgy Modal */}
      {isModalOpen && (
        <div className="drawer-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="drawer-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 760 }}>
            <div className="drawer-header">
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                {editingItem ? 'Edit Liturgy Order' : 'Add New Presbyterian Liturgy'}
              </h2>
              <button className="page-btn" onClick={() => setIsModalOpen(false)} style={{ border: 'none' }}>
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="drawer-body">
                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Title (English) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      placeholder="e.g. Order for Confirmation"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Title (Twi)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title_twi}
                      onChange={(e) => setFormData({ ...formData, title_twi: e.target.value })}
                      placeholder="e.g. Gyedie Mu Kuruwa"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Creed">Creed</option>
                      <option value="Sacrament">Sacrament</option>
                      <option value="Prayer">Prayer</option>
                      <option value="Canticle">Canticle</option>
                      <option value="Order of Service">Order of Service</option>
                      <option value="Scripture">Scripture</option>
                      <option value="Law">Law</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Rubric (Liturgical instructions in red)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.rubric}
                      onChange={(e) => setFormData({ ...formData, rubric: e.target.value })}
                      placeholder="e.g. The Congregation stands"
                    />
                  </div>

                  <div className="form-group">
                    <label>Recommended Hymn Numbers (Comma separated)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.recommended_hymns}
                      onChange={(e) => setFormData({ ...formData, recommended_hymns: e.target.value })}
                      placeholder="e.g. 1, 45, 180"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>English Content *</label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: 200, fontFamily: 'var(--font-serif)' }}
                      value={formData.content_en}
                      onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                      placeholder="Enter liturgy dialogue, leader/congregation responses..."
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Twi Content (Nkyekyɛmu)</label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: 200, fontFamily: 'var(--font-serif)' }}
                      value={formData.content_twi}
                      onChange={(e) => setFormData({ ...formData, content_twi: e.target.value })}
                      placeholder="Fa Twi nsɛm no hyɛ ha..."
                    />
                  </div>
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <SingleCheckIcon /> Save Liturgy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiturgiesPage;
