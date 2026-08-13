import React from 'react';
import { Heart } from './Icons';

export const Guestbook = ({ wishes }) => {
  return (
    <div style={{ margin: '3rem 0' }}>
      <h3 className="section-heading">WALL OF BLESSINGS</h3>
      <div className="guestbook-grid">
        {wishes.map((item, index) => (
          <div key={index} className="wish-card">
            <p className="wish-text">"{item.message}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Heart size={14} color="#801B1B" fill="#801B1B" />
              <span className="wish-author">{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
