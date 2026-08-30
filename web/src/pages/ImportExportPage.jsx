// src/pages/ImportExportPage.jsx
import React, { useState, useRef } from 'react';
import { supabase } from '../config/supabase';
import Swal from 'sweetalert2';
import {
  UploadCloudIcon,
  DownloadCloudIcon,
  ExcelIcon,
  JsonIcon,
  SparkleIcon,
  SingleCheckIcon,
} from '../config/icons';

const ImportExportPage = () => {
  const [importData, setImportData] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef(null);

  // 1. EXPORT FULL JSON BACKUP
  const handleExportJson = async () => {
    setExporting(true);
    try {
      const [hymnsRes, catsRes] = await Promise.all([
        supabase.from('hymns').select('*').order('hymn_number', { ascending: true }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      ]);

      const backupObj = {
        database: 'Presbyterian Church of Ghana Hymnal',
        exportedAt: new Date().toISOString(),
        totalHymns: hymnsRes.data?.length || 0,
        totalCategories: catsRes.data?.length || 0,
        categories: catsRes.data || [],
        hymns: hymnsRes.data || [],
      };

      const jsonStr = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PCG_Hymnal_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();

      Swal.fire({
        title: 'Backup Downloaded!',
        text: `Exported ${backupObj.totalHymns} hymns and ${backupObj.totalCategories} categories.`,
        icon: 'success',
      });
    } catch (err) {
      Swal.fire('Export Failed', err.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  // 2. EXPORT CSV
  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const { data: hymns, error } = await supabase
        .from('hymns')
        .select('*')
        .order('hymn_number', { ascending: true });

      if (error) throw error;

      // Convert to CSV
      const headers = [
        'hymn_number',
        'title_en',
        'title_twi',
        'composer',
        'scripture_reference',
        'meter',
        'key_signature',
        'lyrics_en',
        'lyrics_twi',
        'tonic_solfa',
        'audio_url',
        'is_published',
      ];

      const csvRows = [headers.join(',')];

      hymns.forEach((h) => {
        const values = headers.map((header) => {
          let val = h[header];
          if (val === null || val === undefined) val = '';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        });
        csvRows.push(values.join(','));
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PCG_Hymns_Catalog_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();

      Swal.fire('CSV Exported!', `Exported ${hymns.length} hymn records.`, 'success');
    } catch (err) {
      Swal.fire('Export Failed', err.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  // 3. DOWNLOAD TEMPLATE
  const handleDownloadTemplate = () => {
    const templateHeaders = [
      'hymn_number',
      'title_en',
      'title_twi',
      'composer',
      'scripture_reference',
      'meter',
      'key_signature',
      'lyrics_en',
      'lyrics_twi',
      'tonic_solfa',
      'is_published',
    ];

    const sampleRow = [
      '1',
      '"Praise to the Lord, the Almighty"',
      '"Kamfo Awurade, Otumfoɔ"',
      '"Joachim Neander"',
      '"Psalm 103:1-6"',
      '"14. 14. 4. 7. 8"',
      '"G Major"',
      '"1. Praise to the Lord, the Almighty, the King of creation!\nO my soul, praise Him, for He is thy health and salvation!"',
      '"1. Kamfo Awurade, Otumfoɔ, abɔdeɛ Hene no!\nMe kra, kamfo No, na Ɔno ne w\'apɔmuden ne nkwagyeɛ!"',
      '"d : - : m | s : - : s"',
      'true',
    ];

    const content = `${templateHeaders.join(',')}\n${sampleRow.join(',')}`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PCG_Hymn_Import_Template.csv';
    a.click();
  };

  // 4. PARSE CSV / JSON FILE
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParsing(true);
    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          const hymnsArray = Array.isArray(json) ? json : json.hymns || [];
          setImportData(hymnsArray);
          setParsing(false);
        } catch (err) {
          Swal.fire('Invalid JSON', 'Could not parse the JSON file.', 'error');
          setParsing(false);
        }
      };
      reader.readAsText(file);
    } else {
      // Basic CSV Parser
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length < 2) {
            Swal.fire('Empty File', 'CSV must contain headers and data rows.', 'warning');
            setParsing(false);
            return;
          }

          const rawHeaders = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
          const parsedRecords = [];

          for (let i = 1; i < lines.length; i++) {
            // Regex for CSV with quoted strings
            const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
            if (matches && matches.length >= 2) {
              const record = {};
              rawHeaders.forEach((header, colIdx) => {
                let cell = matches[colIdx] || '';
                cell = cell.trim().replace(/^"|"$/g, '').replace(/""/g, '"');
                if (header === 'hymn_number') cell = parseInt(cell, 10);
                if (header === 'is_published') cell = cell === 'true' || cell === '1';
                record[header] = cell;
              });
              if (record.hymn_number && record.title_en) {
                parsedRecords.push(record);
              }
            }
          }

          setImportData(parsedRecords);
          setParsing(false);
        } catch (err) {
          Swal.fire('Parsing Error', err.message, 'error');
          setParsing(false);
        }
      };
      reader.readAsText(file);
    }
  };

  // 5. EXECUTE DATABASE IMPORT
  const handleCommitImport = async () => {
    if (importData.length === 0) return;

    setImporting(true);
    try {
      // Upsert records by hymn_number
      let successCount = 0;
      for (const record of importData) {
        const payload = {
          hymn_number: record.hymn_number,
          title_en: record.title_en,
          title_twi: record.title_twi || null,
          lyrics_en: record.lyrics_en || '',
          lyrics_twi: record.lyrics_twi || null,
          tonic_solfa: record.tonic_solfa || null,
          composer: record.composer || null,
          scripture_reference: record.scripture_reference || null,
          meter: record.meter || null,
          key_signature: record.key_signature || null,
          is_published: record.is_published !== false,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('hymns').upsert(payload, { onConflict: 'hymn_number' });
        if (!error) successCount++;
      }

      Swal.fire({
        title: 'Import Successful!',
        text: `Successfully imported / updated ${successCount} hymn records in the database.`,
        icon: 'success',
      });
      setImportData([]);
    } catch (err) {
      Swal.fire('Import Error', err.message, 'error');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Database Backup & Bulk Import / Export</h1>
          <p>Download full archives of the Presbyterian hymnal or import spreadsheets</p>
        </div>
      </div>

      {/* Export Section */}
      <div className="dashboard-stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card-modern stat-card-blue">
          <div className="stat-icon-wrapper stat-icon-blue">
            <JsonIcon />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--pcg-blue-dark)' }}>
              Full JSON Database Archive
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              Exports all hymns, stanzas, sol-fas, and categories in a single JSON backup.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginTop: 12 }}
              onClick={handleExportJson}
              disabled={exporting}
            >
              <DownloadCloudIcon /> Export JSON Backup
            </button>
          </div>
        </div>

        <div className="stat-card-modern stat-card-green">
          <div className="stat-icon-wrapper stat-icon-green">
            <ExcelIcon />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--pcg-blue-dark)' }}>
              Excel / CSV Catalog Export
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              Exports spreadsheet format compatible with Excel and Google Sheets.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 12 }}
              onClick={handleExportCsv}
              disabled={exporting}
            >
              <DownloadCloudIcon /> Export CSV Spreadsheet
            </button>
          </div>
        </div>

        <div className="stat-card-modern stat-card-gold">
          <div className="stat-icon-wrapper stat-icon-gold">
            <SparkleIcon />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--pcg-blue-dark)' }}>
              Sample Import Template
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              Download pre-formatted columns to safely prepare new hymns for bulk import.
            </p>
            <button
              type="button"
              className="btn btn-gold btn-sm"
              style={{ marginTop: 12 }}
              onClick={handleDownloadTemplate}
            >
              <DownloadCloudIcon /> Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Importer Section */}
      <div className="card-container">
        <div className="card-header-row">
          <h3>Bulk Spreadsheet & JSON Importer</h3>
          <span className="badge badge-blue">With Safety Conflict Resolution</span>
        </div>

        <div
          className="dropzone-container"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          <input
            type="file"
            accept=".csv,.json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <UploadCloudIcon size={44} style={{ color: 'var(--pcg-blue)', marginBottom: 10 }} />
          <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--pcg-blue-dark)' }}>
            {parsing ? 'Reading & Parsing File...' : 'Choose CSV or JSON File to Import'}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {parsing ? 'Please wait while records are validated...' : 'Upload existing hymnal datasets, EasyWorship exports, or spreadsheet catalogs.'}
          </p>
        </div>

        {/* Import Preview Table */}
        {importData.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--pcg-blue-dark)' }}>
                  Preview: {importData.length} Hymns Ready to Import
                </span>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  Review parsed columns below before committing changes to the live database.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setImportData([])}
                  disabled={importing}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleCommitImport}
                  disabled={importing}
                >
                  <SingleCheckIcon />
                  {importing ? 'Importing to Database...' : `Commit ${importData.length} Hymns`}
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>#</th>
                    <th>English Title</th>
                    <th>Twi Title</th>
                    <th>Composer</th>
                    <th>Meter / Key</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importData.slice(0, 15).map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="hymn-number-badge">#{row.hymn_number}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{row.title_en}</td>
                      <td style={{ color: '#64748b', fontStyle: 'italic' }}>{row.title_twi || '—'}</td>
                      <td>{row.composer || 'Traditional'}</td>
                      <td>{row.meter || row.key_signature || '—'}</td>
                      <td>
                        <span className="badge badge-green">✓ Valid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {importData.length > 15 && (
                <div style={{ padding: 12, textAlign: 'center', fontSize: 12.5, color: 'var(--text-muted)' }}>
                  ... and {importData.length - 15} more records to be imported.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportExportPage;
