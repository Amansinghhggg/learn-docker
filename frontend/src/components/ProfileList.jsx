import React, { useState } from 'react';

export default function ProfileList({
  profiles,
  isLoading,
  onEdit,
  onDelete,
  onSeed,
}) {
  const [search, setSearch] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState({});

  const togglePasswordVisibility = (id) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filtered = profiles.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.email?.toLowerCase().includes(query) ||
      p.phone?.toLowerCase().includes(query) ||
      p.address?.toLowerCase().includes(query) ||
      p.role?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
            Saved Profiles ({filtered.length})
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
            Stored in MongoDB database
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            style={{ width: '220px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            placeholder="🔍 Search profiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '1.1rem', color: '#38bdf8' }}>Loading profiles...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            No profiles found yet
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            Use the form on the left to create your first profile, or click the button below to seed instant sample records into MongoDB!
          </p>
          <button onClick={onSeed} className="btn btn-secondary btn-sm">
            🌱 Seed 3 Sample Profiles
          </button>
        </div>
      ) : (
        <div className="profile-grid">
          {filtered.map((profile) => (
            <div key={profile._id} className="profile-card">
              <div className="profile-top">
                <img
                  src={profile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name}`}
                  alt={profile.name}
                  className="profile-avatar"
                />
                <div className="profile-identity">
                  <h3>{profile.name}</h3>
                  <span className="profile-role-tag">{profile.role || 'Member'}</span>
                </div>
              </div>

              <div className="profile-meta-list">
                <div className="meta-row" title={profile.email}>
                  <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="meta-text">{profile.email}</span>
                </div>

                <div className="meta-row" title={profile.phone}>
                  <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="meta-text">{profile.phone}</span>
                </div>

                <div className="meta-row" title={profile.address}>
                  <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="meta-text">{profile.address}</span>
                </div>

                <div className="meta-row">
                  <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="meta-badge-pw">
                    {revealedPasswords[profile._id] ? profile.password : '••••••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(profile._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      padding: '0 4px',
                      textDecoration: 'underline'
                    }}
                  >
                    {revealedPasswords[profile._id] ? 'hide' : 'view'}
                  </button>
                </div>

                {profile.bio && (
                  <p style={{
                    marginTop: '0.4rem',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px'
                  }}>
                    "{profile.bio}"
                  </p>
                )}
              </div>

              <div className="profile-actions">
                <button
                  type="button"
                  onClick={() => onEdit(profile)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(profile._id)}
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
