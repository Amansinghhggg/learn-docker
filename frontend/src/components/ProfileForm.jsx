import React, { useState, useEffect } from 'react';

const AVATAR_OPTIONS = [
  'Developer',
  'Alex',
  'Samira',
  'Jordan',
  'Nova',
  'TechLead',
];

export default function ProfileForm({ onSubmit, editingProfile, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    role: 'Fullstack Explorer',
    bio: '',
    avatarSeed: 'Developer',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingProfile) {
      setFormData({
        name: editingProfile.name || '',
        email: editingProfile.email || '',
        phone: editingProfile.phone || '',
        address: editingProfile.address || '',
        password: editingProfile.password || '',
        role: editingProfile.role || 'Fullstack Explorer',
        bio: editingProfile.bio || '',
        avatarSeed: editingProfile.name || 'Developer',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        role: 'Fullstack Explorer',
        bio: '',
        avatarSeed: 'DockerLearner',
      });
    }
  }, [editingProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
      setErrorMsg('Please fill in all required fields (Name, Email, Phone, Address, Password).');
      return;
    }

    const payload = {
      ...formData,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
        formData.avatarSeed || formData.name
      )}`,
    };

    onSubmit(payload);
  };

  return (
    <div className="card">
      <div className="card-title-row">
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          {editingProfile ? 'Edit Profile' : 'Create New Profile'}
        </h2>
        {editingProfile && (
          <button type="button" onClick={onCancelEdit} className="btn btn-secondary btn-sm">
            Cancel Edit
          </button>
        )}
      </div>

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#fca5a5',
          padding: '0.65rem 0.85rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.825rem',
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="e.g. Aman Sharma"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="e.g. aman@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Physical Address *</label>
          <input
            type="text"
            name="address"
            className="form-input"
            placeholder="e.g. 42 Park Avenue, New York, NY"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password *</label>
          <div className="password-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-input"
              placeholder="Enter secure password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Role / Headline</label>
          <input
            type="text"
            name="role"
            className="form-input"
            placeholder="e.g. Software Engineer / Student"
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bio (Optional)</label>
          <textarea
            name="bio"
            className="form-textarea"
            placeholder="Tell us a little bit about yourself..."
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Avatar Bot Style</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {AVATAR_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, avatarSeed: opt }))}
                style={{
                  background: formData.avatarSeed === opt ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: formData.avatarSeed === opt ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  color: '#e2e8f0',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Processing...</span>
          ) : editingProfile ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              Update Profile
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
}
