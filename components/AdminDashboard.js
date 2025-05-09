/* placeholder – paste AdminDasimport React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [checklists, setChecklists] = useState([]);
  const [filterTech, setFilterTech] = useState('');
  const [after, setAfter] = useState('');
  const [before, setBefore] = useState('');

  const fetchChecklists = async () => {
    let query = supabase.from('checklists').select('*').order('created_at', { ascending: false });
    if (filterTech) query = query.eq('technician', filterTech);
    if (after) query = query.gte('created_at', after);
    if (before) query = query.lte('created_at', before);

    const { data, error } = await query;
    if (!error) setChecklists(data);
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const buildExportQuery = () => {
    const params = new URLSearchParams();
    if (filterTech) params.append('technician', filterTech);
    if (after) params.append('after', after);
    if (before) params.append('before', before);
    return params.toString();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
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
        <button onClick={fetchChecklists}>Apply Filters</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <a href={`/api/export/pdf?${buildExportQuery()}`} target="_blank">
          <button>Export PDF</button>
        </a>
        <a href={`/api/export/pdf?format=excel&${buildExportQuery()}`} target="_blank">
          <button>Export Excel</button>
        </a>
      </div>

      {checklists.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <p><strong>{item.technician}</strong></p>
          <p style={{ fontSize: '0.85rem', color: '#555' }}>{format(new Date(item.created_at), 'PPPpp')}</p>
          <p>{item.notes}</p>
          <div>
            {(item.file_urls || []).map((url, idx) => (
              <a key={idx} href={url} target="_blank" rel="noreferrer" style={{ color: '#0070f3', display: 'block' }}>
                📎 File {idx + 1}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
hboard here */