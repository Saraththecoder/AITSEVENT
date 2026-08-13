import React, { useState } from 'react';
import { launchConfetti } from '../utils/confetti';
import { CheckCircle2 } from './Icons';

export const RSVPModal = ({ isOpen, onClose, onAddWish }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '1',
    attending: 'yes',
    wish: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    launchConfetti();

    if (formData.wish.trim() && onAddWish) {
      onAddWish({
        name: formData.name,
        message: formData.wish
      });
    }

    setSubmitted(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(5px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#FFFDF7',
        borderRadius: '20px',
        maxWidth: '500px',
        width: '100%',
        padding: '2rem',
        border: '2px solid #D4AF37',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '1.8rem',
            cursor: 'pointer',
            color: '#801B1B'
          }}
        >
          &times;
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 size={48} color="#801B1B" style={{ margin: '0 auto 1rem auto', display: 'block' }} />
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#801B1B', textAlign: 'center' }}>
              RESPONSE RECEIVED!
            </h3>
            <p style={{ textAlign: 'center', color: '#7A6455', marginTop: '0.5rem' }}>
              Thank you for sharing your blessings. We look forward to seeing you at the wedding!
            </p>
            <button
              onClick={onClose}
              className="pill-action-btn"
              style={{ display: 'block', margin: '1.5rem auto 0 auto' }}
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.3rem', color: '#801B1B', textAlign: 'center', marginBottom: '1.2rem' }}>
              CONFIRM RSVP
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', color: '#801B1B', display: 'block', marginBottom: '0.3rem' }}>
                FULL NAME *
              </label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #D4AF37', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', color: '#801B1B', display: 'block', marginBottom: '0.3rem' }}>
                NUMBER OF GUESTS
              </label>
              <select
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #D4AF37', outline: 'none' }}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4+">4+ Family</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontFamily: 'Cinzel, serif', fontSize: '0.8rem', color: '#801B1B', display: 'block', marginBottom: '0.3rem' }}>
                BLESSINGS / WISHES
              </label>
              <textarea
                rows="3"
                placeholder="Write your wishes for Vamshi & Mounika..."
                value={formData.wish}
                onChange={(e) => setFormData({ ...formData, wish: e.target.value })}
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #D4AF37', outline: 'none' }}
              />
            </div>

            <button type="submit" className="pill-action-btn" style={{ width: '100%' }}>
              SUBMIT RSVP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
