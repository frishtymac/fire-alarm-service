import React, { useState } from 'react';

export default function AdminDashboard() {
  const [filterTech, setFilterTech] = useState('');
  const [after, setAfter] = useState('');
  const [before, setBefore] = useState('');

  const buildExportQuery = () => {
    const params = new URLSearchParams();
    if (filterTech) params.append('technician', filterTech);
    if (after) params.append('after', after);
    if (before) params.append('before', before);
    return params.toString();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Chubb Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <input
          placeholder="Filter by technician"
          value={filterTech}
          onChange={(e) => setFilterTech(e.target.value)}
        />
        <input
          type="date"
          value={after}
          onChange={(e) => setAfter(e.target.value)}
        />
        <input
          type="date"
          value={before}
          onChange={(e) => setBefore(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <a href={`/api/export/pdf?${buildExportQuery()}`} target="_blank">
          <button>Export PDF</button>
        </a>
        <a href={`/api/export/excel?${buildExportQuery()}`} target="_blank">
          <button>Export Excel</button>
        </a>
      </div>
    </div>
  );
}
