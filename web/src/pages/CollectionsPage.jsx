import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { DEFAULT_COLLECTIONS, CHURCH_SEASONS } from '../data/collectionsData';
import {
  PresenterIcon,
  AddIcon,
  ExportIcon,
  SingleCheckIcon,
  CloseIcon,
  MoreIcon,
  DeleteIcon,
} from '../config/icons';
import Swal from 'sweetalert2';

const CollectionsPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [hymns, setHymns] = useState([]);
  const [selectedCol, setSelectedCol] = useState(DEFAULT_COLLECTIONS[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId === null) return;
      const activeRef = menuRefs.current[openMenuId];
      if (activeRef && !activeRef.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);
  const [newColData, setNewColData] = useState({
    title: '',
    title_twi: '',
    description: '',
    season: 'General Worship',
    hymn_numbers: '',
  });

  useEffect(() => {
    loadHymns();
    const saved = localStorage.getItem('pcg_custom_collections');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCollections(parsed);
        setSelectedCol(parsed[0]);
      } catch (e) {}
    }
  }, []);

  const loadHymns = async () => {
    const { data } = await supabase
      .from('hymns')
      .select('id, hymn_number, title_en, title_twi, audio_url, lyrics_en')
      .order('hymn_number', { ascending: true });
    if (data) setHymns(data);
  };

  const saveCollections = (newList) => {
    setCollections(newList);
    localStorage.setItem('pcg_custom_collections', JSON.stringify(newList));
  };

  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (!newColData.title.trim()) return;

    const nums = newColData.hymn_numbers
      ? newColData.hymn_numbers
          .split(',')
          .map((n) => parseInt(n.trim(), 10))
          .filter((n) => !isNaN(n))
      : [];

    const newCol = {
      id: `col_${Date.now()}`,
      title: newColData.title.trim(),
      title_twi: newColData.title_twi.trim() || null,
      description: newColData.description.trim() || 'Curated hymnal set',
      season: newColData.season,
      color: '#18227c',
      hymn_numbers: nums,
    };

    const updated = [newCol, ...collections];
    saveCollections(updated);
    setSelectedCol(newCol);
    setIsAddModalOpen(false);
    Swal.fire('Created!', `Collection "${newCol.title}" added.`, 'success');
  };

  const handleRemoveHymnFromCollection = (hymnNum) => {
    const updatedHymnNums = selectedCol.hymn_numbers.filter((n) => n !== hymnNum);
    const updatedCol = { ...selectedCol, hymn_numbers: updatedHymnNums };
    const updatedList = collections.map((c) => (c.id === selectedCol.id ? updatedCol : c));
    saveCollections(updatedList);
    setSelectedCol(updatedCol);
  };

  const handleAddHymnToCollection = (hymnNum) => {
    if (!hymnNum || selectedCol.hymn_numbers.includes(hymnNum)) return;
    const updatedCol = { ...selectedCol, hymn_numbers: [...selectedCol.hymn_numbers, hymnNum] };
    const updatedList = collections.map((c) => (c.id === selectedCol.id ? updatedCol : c));
    saveCollections(updatedList);
    setSelectedCol(updatedCol);
  };

  const handleExportBulletin = () => {
    const matchedHymns = hymns.filter((h) => selectedCol.hymn_numbers.includes(h.hymn_number));
    let text = `PRESBYTERIAN CHURCH OF GHANA\nSERVICE HYMNAL BULLETIN - ${selectedCol.title.toUpperCase()}\n${'='.repeat(50)}\n\n`;

    matchedHymns.forEach((h) => {
      text += `HYMN #${h.hymn_number} - ${h.title_en.toUpperCase()}\n${h.title_twi ? `(${h.title_twi})\n` : ''}\n${h.lyrics_en}\n\n${'-'.repeat(40)}\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PCG_Service_${selectedCol.title.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  const matchedHymns = hymns.filter((h) => selectedCol?.hymn_numbers.includes(h.hymn_number));

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Church Seasons & Hymnal Collections</h1>
          <p>Curate themed service sets and sync with church calendar seasons</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleExportBulletin}>
            <ExportIcon /> Export Service Bulletin
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <AddIcon /> New Collection
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
        {/* Collections List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card-container" style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pcg-blue-dark)', marginBottom: 12 }}>
              Seasonal & Thematic Sets ({collections.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {collections.map((col) => {
                const isActive = col.id === selectedCol?.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => setSelectedCol(col)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: isActive ? 'var(--pcg-blue-subtle)' : '#ffffff',
                      border: isActive ? '1px solid var(--pcg-blue)' : '1px solid var(--border-color)',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-gold" style={{ fontSize: 10 }}>{col.season}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--pcg-blue)' }}>
                        {col.hymn_numbers.length} Hymns
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: isActive ? 'var(--pcg-blue)' : 'var(--text-primary)', marginTop: 6 }}>
                      {col.title}
                    </div>
                    {col.title_twi && (
                      <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
                        {col.title_twi}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Collection View & Hymns Editor */}
        {selectedCol && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header info */}
            <div className="card-container" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-blue">{selectedCol.season}</span>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--pcg-blue-dark)', marginTop: 6 }}>
                    {selectedCol.title}
                  </h2>
                  {selectedCol.title_twi && (
                    <p style={{ fontSize: 14, color: '#64748b', fontStyle: 'italic' }}>
                      {selectedCol.title_twi}
                    </p>
                  )}
                  <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 6 }}>
                    {selectedCol.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-gold btn-sm"
                    onClick={() => {
                      if (matchedHymns.length > 0) {
                        navigate(`/presenter/${matchedHymns[0].id}`);
                      } else {
                        navigate('/presenter');
                      }
                    }}
                  >
                    <PresenterIcon /> Launch Presenter Set
                  </button>
                </div>
              </div>

              {/* Quick Add Hymn Input */}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Add Hymn to Collection:</span>
                <select
                  className="form-select"
                  style={{ maxWidth: 300, padding: '6px 12px', fontSize: 13 }}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddHymnToCollection(parseInt(e.target.value, 10));
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Choose Hymn by Title / Number...</option>
                  {hymns.map((h) => (
                    <option key={h.id} value={h.hymn_number}>
                      #{h.hymn_number} - {h.title_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hymns in this collection table */}
            <div className="card-container" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
                Hymns Sequence ({selectedCol.hymn_numbers.length} hymns)
              </div>

              <table className="modern-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>#</th>
                    <th>Hymn Title</th>
                    <th>Twi Title</th>
                    <th>Audio Tune</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCol.hymn_numbers.map((hymnNum, index) => {
                    const hymnObj = hymns.find((h) => h.hymn_number === hymnNum);
                    return (
                      <tr key={hymnNum}>
                        <td>
                          <span className="hymn-number-badge">#{hymnNum}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {hymnObj ? hymnObj.title_en : `Hymn #${hymnNum}`}
                        </td>
                        <td style={{ color: '#64748b', fontStyle: 'italic' }}>
                          {hymnObj?.title_twi || '—'}
                        </td>
                        <td>
                          {hymnObj?.audio_url ? (
                            <span className="badge badge-green">✓ Ready</span>
                          ) : (
                            <span className="badge badge-gray">No audio</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div
                            className="action-menu-wrapper"
                            ref={(el) => {
                              menuRefs.current[hymnNum] = el;
                            }}
                          >
                            <button
                              type="button"
                              className={`ellipsis-btn ${openMenuId === hymnNum ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === hymnNum ? null : hymnNum);
                              }}
                              title="Actions"
                            >
                              <MoreIcon />
                            </button>

                            {openMenuId === hymnNum && (
                              <div className="dropdown-menu">
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    navigate(`/presenter/${hymnObj?.id || hymnNum}`);
                                  }}
                                >
                                  <PresenterIcon /> Launch Presenter
                                </button>
                                <button
                                  type="button"
                                  className="dropdown-item dropdown-item-danger"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleRemoveHymnFromCollection(hymnNum);
                                  }}
                                >
                                  <DeleteIcon /> Remove from Set
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Collection Modal */}
      {isAddModalOpen && (
        <div className="drawer-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="drawer-container" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>New Hymnal Collection</h2>
              <button className="page-btn" onClick={() => setIsAddModalOpen(false)} style={{ border: 'none' }}>
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCollection} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="drawer-body">
                <div className="form-group">
                  <label>Collection Title (English) *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newColData.title}
                    onChange={(e) => setNewColData({ ...newColData, title: e.target.value })}
                    placeholder="e.g. Easter Sunday Resurrection Hymns"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Collection Title (Twi)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newColData.title_twi}
                    onChange={(e) => setNewColData({ ...newColData, title_twi: e.target.value })}
                    placeholder="e.g. Wusɔreɛ Kwesida Nnwom"
                  />
                </div>

                <div className="form-group">
                  <label>Liturgical Church Season</label>
                  <select
                    className="form-select"
                    value={newColData.season}
                    onChange={(e) => setNewColData({ ...newColData, season: e.target.value })}
                  >
                    {CHURCH_SEASONS.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="General Worship">General Worship</option>
                    <option value="Sacraments">Sacraments</option>
                    <option value="Funerals & Memorials">Funerals & Memorials</option>
                    <option value="Youth & Children">Youth & Children</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: 80 }}
                    value={newColData.description}
                    onChange={(e) => setNewColData({ ...newColData, description: e.target.value })}
                    placeholder="Describe the occasion or purpose of this set..."
                  />
                </div>

                <div className="form-group">
                  <label>Initial Hymn Numbers (Comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newColData.hymn_numbers}
                    onChange={(e) => setNewColData({ ...newColData, hymn_numbers: e.target.value })}
                    placeholder="e.g. 142, 145, 148, 150"
                  />
                </div>
              </div>

              <div className="drawer-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <SingleCheckIcon /> Create Set
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
