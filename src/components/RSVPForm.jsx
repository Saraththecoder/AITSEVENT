import React, { useState } from 'react';
import { launchConfetti } from '../utils/confetti';
import { CheckCircle2, Heart } from './Icons';

export const RSVPForm = ({ onAddWish }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    attending: 'yes',
    guestCount: '1',
    dietary: 'Vegetarian',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    // Trigger confetti burst
    launchConfetti();

    if (formData.message.trim() && onAddWish) {
      onAddWish({
        name: formData.fullName,
        message: formData.message
      });
    }

    setSubmitted(true);
  };

  return (
    <div className="rsvp-section" id="rsvp">
      <h3 className="section-heading">KINDLY RESPOND (RSVP)</h3>
      
      {submitted ? (
        <div className="rsvp-success-box">
          <CheckCircle2 size={48} color="#801B1B" style={{ margin: '0 auto 1rem auto' }} />
          <h4 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#801B1B', marginBottom: '0.5rem' }}>
            Thank You for Gracing Us!
          </h4>
          <p style={{ fontSize: '1.1rem', color: '#6E5D53' }}>
            Your response has been recorded. We eagerly look forward to celebrating with you!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="action-btn btn-outline-gold"
            style={{ marginTop: '1.5rem', margin: '1.5rem auto 0 auto', display: 'block' }}
          >
            Edit Response
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">FULL NAME *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              className="form-input"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="ramesh@example.com"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">WILL YOU ATTEND?</label>
            <div className="attending-toggle">
              <div
                className={`toggle-option ${formData.attending === 'yes' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, attending: 'yes' })}
              >
                Joyfully Accepts
              </div>
              <div
                className={`toggle-option ${formData.attending === 'no' ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, attending: 'no' })}
              >
                Regretfully Declines
              </div>
            </div>
          </div>

          {formData.attending === 'yes' && (
            <>
              <div className="form-group">
                <label className="form-label">NUMBER OF GUESTS</label>
                <select
                  className="form-select"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3 Persons</option>
                  <option value="4+">4+ Family</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">DIETARY PREFERENCE</label>
                <select
                  className="form-select"
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                >
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Jain">Jain Pure Veg</option>
                  <option value="Standard">Standard Multi-Cuisine</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">BLESSINGS & WISHES FOR COUPLE</label>
            <textarea
              rows="3"
              placeholder="Share your warm wishes and blessings..."
              className="form-textarea"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button type="submit" className="submit-rsvp-btn">
            CONFIRM RSVP
          </button>
        </form>
      )}
    </div>
  );
};
