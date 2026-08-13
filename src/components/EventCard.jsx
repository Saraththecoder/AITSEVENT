import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles } from './Icons';

export const EventCard = ({ title, date, time, venue, address, dressCode, tag, mapUrl, calUrl }) => {
  return (
    <div className="event-card">
      {tag && <span className="tag-badge">{tag}</span>}
      <div className="event-card-top">
        <div className="event-icon-badge">
          <Sparkles size={20} />
        </div>
        <h4 className="event-title">{title}</h4>
      </div>
      
      <ul className="event-details-list">
        <li className="event-detail-item">
          <Calendar size={18} />
          <span><strong>Date:</strong> {date}</span>
        </li>
        <li className="event-detail-item">
          <Clock size={18} />
          <span><strong>Time:</strong> {time}</span>
        </li>
        <li className="event-detail-item">
          <MapPin size={18} />
          <span><strong>Venue:</strong> {venue}, {address}</span>
        </li>
        {dressCode && (
          <li className="event-detail-item">
            <Sparkles size={18} />
            <span><strong>Dress Code:</strong> {dressCode}</span>
          </li>
        )}
      </ul>

      <div className="event-actions">
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn btn-outline-gold"
        >
          <Calendar size={14} /> Add Calendar
        </a>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="action-btn btn-outline-gold"
        >
          <ExternalLink size={14} /> View Map
        </a>
      </div>
    </div>
  );
};
