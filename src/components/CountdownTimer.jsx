import React, { useState, useEffect } from 'react';

export const CountdownTimer = ({ targetDate = '2026-11-28T10:30:00' }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-section">
      <h3 className="countdown-title">COUNTDOWN TO THE AUSPICIOUS CEREMONY</h3>
      <div className="timer-grid">
        <div className="timer-box">
          <div className="timer-num">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="timer-label">Days</div>
        </div>
        <div className="timer-box">
          <div className="timer-num">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="timer-label">Hours</div>
        </div>
        <div className="timer-box">
          <div className="timer-num">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="timer-label">Minutes</div>
        </div>
        <div className="timer-box">
          <div className="timer-num">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="timer-label">Seconds</div>
        </div>
      </div>
    </div>
  );
};
