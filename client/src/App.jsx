import React, { useState, useEffect } from 'react';
import ProfileForm from './components/ProfileForm';
import ProfileList from './components/ProfileList';

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [healthInfo, setHealthInfo] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch health info
  const checkHealth = async () => {
    try {
      const res = await fetch('/health');
      if (res.ok) {
        const data = await res.json();
        setHealthInfo(data);
      } else {
        setHealthInfo(null);
      }
    } catch {
      setHealthInfo(null);
    }
  };

  // Fetch all profiles
  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/profiles');
      if (!res.ok) throw new Error('Failed to fetch profiles');
      const data = await res.json();
      setProfiles(data.data || []);
    } catch (err) {
      console.error(err);
      showToast('Could not connect to backend server. Make sure it is running on port 5000.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle create or update
  const handleSubmitProfile = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProfile) {
        // Update
        const res = await fetch(`/api/profiles/${editingProfile._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to update profile');
        showToast('Profile updated successfully!');
        setEditingProfile(null);
      } else {
        // Create
        const res = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to create profile');
        showToast('New profile created successfully!');
      }
      fetchProfiles();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDeleteProfile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    try {
      const res = await fetch(`/api/profiles/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to delete profile');
      showToast('Profile deleted successfully!');
      if (editingProfile && editingProfile._id === id) {
        setEditingProfile(null);
      }
      fetchProfiles();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handle seed
  const handleSeedProfiles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/profiles/seed', {
        method: 'POST',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to seed sample profiles');
      showToast('3 sample profiles added to MongoDB!');
      fetchProfiles();
    } catch (err) {
      showToast(err.message, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: notification.type === 'error' ? '#dc2626' : '#059669',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            fontSize: '0.9rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {notification.type === 'error' ? '⚠️' : '✅'} {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="brand-row">
          <div className="brand-logo-title">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="title-wrap">
              <h1>Profile Management System</h1>
              <p>Simple MERN Stack App (Name, Phone, Address, Email, Password)</p>
            </div>
          </div>

          {/* System status pills */}
          <div className="status-pill-group">
            <div className="status-badge">
              <span className={`status-dot ${healthInfo ? 'active' : 'inactive'}`}></span>
              <span>Backend API: {healthInfo ? 'Online (5000)' : 'Offline'}</span>
            </div>
            <div className="status-badge">
              <span
                className={`status-dot ${
                  healthInfo && healthInfo.database && healthInfo.database.connected
                    ? 'active'
                    : 'inactive'
                }`}
              ></span>
              <span>
                MongoDB:{' '}
                {healthInfo && healthInfo.database && healthInfo.database.connected
                  ? 'Connected'
                  : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions bar */}
        <div className="quick-banner">
          <div className="banner-content">
            <span className="banner-badge">Profile Hub</span>
            <span className="banner-text">
              Create, view, update, and delete user profiles with full MongoDB persistence.
            </span>
          </div>
          <div className="banner-buttons">
            <button
              type="button"
              onClick={handleSeedProfiles}
              className="btn btn-secondary btn-sm"
            >
              🌱 Add Sample Data
            </button>
            <button
              type="button"
              onClick={fetchProfiles}
              className="btn btn-secondary btn-sm"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid: Form on Left, List on Right */}
      <main className="main-grid">
        <section>
          <ProfileForm
            onSubmit={handleSubmitProfile}
            editingProfile={editingProfile}
            onCancelEdit={() => setEditingProfile(null)}
            isSubmitting={isSubmitting}
          />
        </section>

        <section>
          <ProfileList
            profiles={profiles}
            isLoading={isLoading}
            onEdit={(profile) => {
              setEditingProfile(profile);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={handleDeleteProfile}
            onSeed={handleSeedProfiles}
          />
        </section>
      </main>
    </div>
  );
}
