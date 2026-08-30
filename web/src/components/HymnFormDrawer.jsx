// src/components/HymnFormDrawer.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import Swal from 'sweetalert2';
import {
  CloseIcon,
  AudioIcon,
  PlayIcon,
  PauseIcon,
  SolfaIcon,
  SingleCheckIcon,
} from '../config/icons';

const emptyHymn = {
  hymn_number: '',
  title_en: '',
  title_twi: '',
  lyrics_en: '',
  lyrics_twi: '',
  tonic_solfa: '',
  composer: '',
  scripture_reference: '',
  meter: '',
  key_signature: '',
  category_id: '',
  is_published: true,
  audio_url: '',
};

const HymnFormDrawer = ({ hymnId, isOpen, onClose, onSaved }) => {
  const [hymn, setHymn] = useState(emptyHymn);
  const [categories, setCategories] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('lyrics'); // 'lyrics' | 'metadata' | 'music'
  const isEditing = !!hymnId;

  // Load categories and hymn on open
  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (hymnId) {
        loadHymn();
      } else {
        // Check for draft recovery in localStorage
        const savedDraft = localStorage.getItem('pcg_hymn_draft');
        if (savedDraft) {
          try {
            setHymn(JSON.parse(savedDraft));
          } catch (e) {
            setHymn(emptyHymn);
          }
        } else {
          setHymn(emptyHymn);
        }
      }
      setAudioFile(null);
      setError('');
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
      if (audioElement) {
        audioElement.pause();
      }
    }

    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [isOpen, hymnId]);

  // Draft auto-save for new hymns
  useEffect(() => {
    if (isOpen && !hymnId && (hymn.title_en || hymn.lyrics_en)) {
      localStorage.setItem('pcg_hymn_draft', JSON.stringify(hymn));
    }
  }, [hymn, isOpen, hymnId]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    setCategories(data || []);
  };

  const loadHymn = async () => {
    const { data, error } = await supabase.from('hymns').select('*').eq('id', hymnId).single();
    if (!error && data) {
      setHymn(data);
      if (data.audio_url) {
        setAudioPreviewUrl(data.audio_url);
      }
    }
  };

  const handleChange = (field, value) => {
    setHymn((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError('Please select a valid audio file (e.g. .mp3, .m4a, .wav)');
        return;
      }
      setAudioFile(file);
      const tempUrl = URL.createObjectURL(file);
      setAudioPreviewUrl(tempUrl);
    }
  };

  const toggleAudioPlay = () => {
    if (!audioPreviewUrl) return;
    if (!audioElement) {
      const audio = new Audio(audioPreviewUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play();
      setAudioElement(audio);
      setIsPlayingAudio(true);
    } else {
      if (isPlayingAudio) {
        audioElement.pause();
        setIsPlayingAudio(false);
      } else {
        audioElement.play();
        setIsPlayingAudio(true);
      }
    }
  };

  // Quick Stanza Formatter Helper
  const addStanzaHeader = (lang, stanzaNum) => {
    const field = lang === 'en' ? 'lyrics_en' : 'lyrics_twi';
    const current = hymn[field] || '';
    const prefix = current ? '\n\n' : '';
    const textToAdd = `${prefix}${stanzaNum}. `;
    handleChange(field, current + textToAdd);
  };

  const addChorusHeader = (lang) => {
    const field = lang === 'en' ? 'lyrics_en' : 'lyrics_twi';
    const current = hymn[field] || '';
    const prefix = current ? '\n\n' : '';
    const textToAdd = `${prefix}[Chorus / Nnyesoɔ]\n`;
    handleChange(field, current + textToAdd);
  };

  // Tonic Sol-fa notation helper symbols
  const insertSolfaSymbol = (sym) => {
    const current = hymn.tonic_solfa || '';
    handleChange('tonic_solfa', current + sym);
  };

  const handleAudioUpload = async () => {
    if (!audioFile) return null;
    setUploading(true);
    const fileExt = audioFile.name.split('.').pop();
    const fileName = `hymn_${hymn.hymn_number || 'new'}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, audioFile, {
        cacheControl: '3600',
        upsert: true,
      });

    setUploading(false);

    if (uploadError) {
      setError('Audio upload failed: ' + uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage.from('audio').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!hymn.hymn_number || !hymn.title_en || !hymn.lyrics_en) {
        setError('Hymn number, English title, and English lyrics are required.');
        setSaving(false);
        return;
      }

      let audioUrl = hymn.audio_url;

      if (audioFile) {
        const uploadedUrl = await handleAudioUpload();
        if (uploadedUrl) {
          audioUrl = uploadedUrl;
        }
      }

      const hymnPayload = {
        hymn_number: parseInt(hymn.hymn_number, 10),
        title_en: hymn.title_en.trim(),
        title_twi: hymn.title_twi ? hymn.title_twi.trim() : null,
        lyrics_en: hymn.lyrics_en.trim(),
        lyrics_twi: hymn.lyrics_twi ? hymn.lyrics_twi.trim() : null,
        tonic_solfa: hymn.tonic_solfa ? hymn.tonic_solfa.trim() : null,
        composer: hymn.composer ? hymn.composer.trim() : null,
        scripture_reference: hymn.scripture_reference ? hymn.scripture_reference.trim() : null,
        meter: hymn.meter ? hymn.meter.trim() : null,
        key_signature: hymn.key_signature ? hymn.key_signature.trim() : null,
        category_id: hymn.category_id || null,
        is_published: hymn.is_published,
        audio_url: audioUrl || null,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error: updateErr } = await supabase
          .from('hymns')
          .update(hymnPayload)
          .eq('id', hymnId);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('hymns')
          .insert([hymnPayload]);
        if (insertErr) throw insertErr;
        localStorage.removeItem('pcg_hymn_draft');
      }

      Swal.fire({
        title: isEditing ? 'Hymn Updated!' : 'Hymn Created!',
        text: `Hymn #${hymn.hymn_number} - "${hymn.title_en}" saved successfully.`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save hymn. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--pcg-blue-dark)' }}>
              {isEditing ? `Edit Hymn #${hymn.hymn_number}` : 'Add New PCG Hymn'}
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              Presbyterian Church of Ghana Hymnal Record
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className={`filter-pill ${activeTab === 'lyrics' ? 'active' : ''}`}
              onClick={() => setActiveTab('lyrics')}
            >
              Lyrics & Dual Translation
            </button>
            <button
              type="button"
              className={`filter-pill ${activeTab === 'metadata' ? 'active' : ''}`}
              onClick={() => setActiveTab('metadata')}
            >
              Details & Category
            </button>
            <button
              type="button"
              className={`filter-pill ${activeTab === 'music' ? 'active' : ''}`}
              onClick={() => setActiveTab('music')}
            >
              Audio & Sol-fa
            </button>
            <button
              type="button"
              className="page-btn"
              onClick={onClose}
              style={{ border: 'none', marginLeft: 8 }}
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="drawer-body">
            {error && (
              <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Quick Header Fields Always Visible */}
            <div className="form-grid-3">
              <div className="form-group">
                <label>Hymn Number *</label>
                <input
                  type="number"
                  className="form-input"
                  value={hymn.hymn_number}
                  onChange={(e) => handleChange('hymn_number', e.target.value)}
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <div className="form-group">
                <label>English Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={hymn.title_en}
                  onChange={(e) => handleChange('title_en', e.target.value)}
                  placeholder="e.g. Praise to the Lord"
                  required
                />
              </div>
              <div className="form-group">
                <label>Twi Title (Asɛmti)</label>
                <input
                  type="text"
                  className="form-input"
                  value={hymn.title_twi || ''}
                  onChange={(e) => handleChange('title_twi', e.target.value)}
                  placeholder="e.g. Kamfo Awurade"
                />
              </div>
            </div>

            {/* TAB 1: LYRICS & DUAL TRANSLATION */}
            {activeTab === 'lyrics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  {/* English Column */}
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label>English Lyrics (Verses) *</label>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addStanzaHeader('en', 1)}>+ V1</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addStanzaHeader('en', 2)}>+ V2</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addChorusHeader('en')}>+ Chorus</button>
                      </div>
                    </div>
                    <textarea
                      className="form-textarea lyrics-textarea"
                      value={hymn.lyrics_en}
                      onChange={(e) => handleChange('lyrics_en', e.target.value)}
                      placeholder="1. Praise to the Lord, the Almighty, the King of creation!&#10;O my soul, praise Him, for He is thy health and salvation!&#10;&#10;2. Praise to the Lord..."
                      required
                    />
                  </div>

                  {/* Twi Column */}
                  <div className="form-group">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label>Twi Lyrics (Nkyekyɛmu)</label>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addStanzaHeader('twi', 1)}>+ V1</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addStanzaHeader('twi', 2)}>+ V2</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => addChorusHeader('twi')}>+ Nnyesoɔ</button>
                      </div>
                    </div>
                    <textarea
                      className="form-textarea lyrics-textarea"
                      value={hymn.lyrics_twi || ''}
                      onChange={(e) => handleChange('lyrics_twi', e.target.value)}
                      placeholder="1. Kamfo Awurade, Otumfoɔ, abɔdeɛ Hene no!&#10;Me kra, kamfo No, na Ɔno ne w'apɔmuden ne nkwagyeɛ!&#10;&#10;2. Kamfo Awurade..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: METADATA & CATEGORY */}
            {activeTab === 'metadata' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-select"
                      value={hymn.category_id || ''}
                      onChange={(e) => handleChange('category_id', e.target.value || null)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name_en} {c.name_twi ? `(${c.name_twi})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Composer / Author</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hymn.composer || ''}
                      onChange={(e) => handleChange('composer', e.target.value)}
                      placeholder="e.g. Joachim Neander (1680)"
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Scripture Reference</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hymn.scripture_reference || ''}
                      onChange={(e) => handleChange('scripture_reference', e.target.value)}
                      placeholder="e.g. Psalm 103:1-6"
                    />
                  </div>

                  <div className="form-group">
                    <label>Hymn Meter</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hymn.meter || ''}
                      onChange={(e) => handleChange('meter', e.target.value)}
                      placeholder="e.g. 14. 14. 4. 7. 8"
                    />
                  </div>

                  <div className="form-group">
                    <label>Key Signature</label>
                    <input
                      type="text"
                      className="form-input"
                      value={hymn.key_signature || ''}
                      onChange={(e) => handleChange('key_signature', e.target.value)}
                      placeholder="e.g. G Major"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hymn.is_published}
                      onChange={(e) => handleChange('is_published', e.target.checked)}
                      style={{ width: 18, height: 18 }}
                    />
                    <span>Publish Hymn to Mobile Apps & Public Directory</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: AUDIO & TONIC SOL-FA */}
            {activeTab === 'music' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Audio Upload */}
                <div className="card-container" style={{ padding: 18 }}>
                  <label style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <AudioIcon /> Audio Recording (Organ / Choir)
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      id="hymn-audio-upload"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="hymn-audio-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                      Choose Audio File (.mp3, .m4a)
                    </label>

                    {audioFile && (
                      <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
                        ✓ {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    )}

                    {audioPreviewUrl && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={toggleAudioPlay}
                      >
                        {isPlayingAudio ? <PauseIcon /> : <PlayIcon />}
                        {isPlayingAudio ? 'Pause Preview' : 'Play Audio'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Tonic Sol-fa */}
                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <SolfaIcon /> Tonic Sol-fa Musical Notation
                    </label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['d', 'r', 'm', 'f', 's', 'l', 't', 'd\'', '|', ':', '-'].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          className="page-btn"
                          style={{ width: 28, height: 28, fontSize: 12 }}
                          onClick={() => insertSolfaSymbol(sym + ' ')}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="form-textarea solfa-textarea"
                    value={hymn.tonic_solfa || ''}
                    onChange={(e) => handleChange('tonic_solfa', e.target.value)}
                    placeholder="d : - : m | s : - : s | l : - : s | f : - : m&#10;m : - : r | d : - : - | r : - : m | d : - : -"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="drawer-footer">
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {!hymnId && 'Draft auto-saves locally'}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                <SingleCheckIcon />
                {saving || uploading ? 'Saving Hymn...' : (isEditing ? 'Update Hymn' : 'Save Hymn')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HymnFormDrawer;
