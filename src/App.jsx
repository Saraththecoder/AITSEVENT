import React, { useState, useEffect } from 'react';
import { GarlandHeader } from './components/GarlandHeader';
import { MandalaCorners } from './components/MandalaCorners';
import { RSVPModal } from './components/RSVPModal';
import { MusicControl } from './components/MusicControl';
import { launchConfetti } from './utils/confetti';
import { ambientSynth } from './utils/sound';
import { ArrowLeft, Sparkles } from './components/Icons';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Scroll tracking strictly for the first two parallax sections (clamped max 600px)
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
      setScrollY(currentScroll);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Real-time Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-11-28T10:30:00');
    const updateTimer = () => {
      const diff = target - new Date();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    const playing = ambientSynth.toggle();
    setIsPlayingMusic(playing);
    launchConfetti();
  };

  const handleToggleMusic = () => {
    const playing = ambientSynth.toggle();
    setIsPlayingMusic(playing);
  };

  const handleClose = () => {
    setIsOpen(false);
    ambientSynth.stop();
    setIsPlayingMusic(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eventsData = [
    {
      title: 'Pellikuthuru',
      date: 'Thursday, 26 Nov 2026',
      time: '09:00 AM onwards',
      venue: 'Bridal Residence, Jubilee Hills, Hyderabad',
      mapUrl: 'https://maps.google.com/?q=Hyderabad'
    },
    {
      title: 'Pellikoduku',
      date: 'Thursday, 26 Nov 2026',
      time: '11:00 AM onwards',
      venue: 'Groom Residence, Banjara Hills, Hyderabad',
      mapUrl: 'https://maps.google.com/?q=Hyderabad'
    },
    {
      title: 'Sangeeth Night',
      date: 'Friday, 27 Nov 2026',
      time: '07:00 PM onwards',
      venue: 'N Convention, Madhapur, Hyderabad',
      mapUrl: 'https://maps.google.com/?q=N+Convention+Hyderabad'
    },
    {
      title: 'Haldi & Mehendi',
      date: 'Friday, 27 Nov 2026',
      time: '10:00 AM onwards',
      venue: 'The Palm Lawns, Jubilee Hills, Hyderabad',
      mapUrl: 'https://maps.google.com/?q=Jubilee+Hills'
    },
    {
      title: 'Muhurtham (Wedding)',
      date: 'Saturday, 28 Nov 2026',
      time: '10:30 AM Muhurtham',
      venue: 'Hitex Exhibition Center, Hall 1, Hyderabad',
      mapUrl: 'https://maps.google.com/?q=Hitex+Hyderabad'
    },
    {
      title: 'Reception Gala',
      date: 'Sunday, 29 Nov 2026',
      time: '07:00 PM onwards',
      venue: 'JRC Conventions, Jubilee Hills, Hyderabad',
      mapUrl: 'https://maps.google.com/?q=JRC+Conventions'
    }
  ];

  // Scoped parallax offset for section 1 & 2 only (max 550px)
  const parallaxOffset = Math.min(scrollY, 550);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      {/* Top Marigold & Mango Leaf Garland */}
      <GarlandHeader isVisible={!isOpen || scrollY < 650} />

      {/* 4 Corner Mandalas */}
      <MandalaCorners />

      {/* COVER SCREEN */}
      {!isOpen ? (
        <div className="cover-screen">
          <button onClick={handleOpenInvitation} className="open-invitation-btn">
            OPEN INVITATION
          </button>
        </div>
      ) : (
        /* INNER WEDDING INVITATION PAGE */
        <div className={`main-invitation-wrapper ${isOpen ? 'visible' : ''}`}>
          {/* Floating Controls */}
          <MusicControl isPlaying={isPlayingMusic} onToggle={handleToggleMusic} />
          
          <button onClick={handleClose} className="close-invitation-floating-btn">
            <ArrowLeft size={14} /> Back to Cover
          </button>

          <main className="wedding-page-container">
            {/* ========================================================
                PARALLAX SECTION 1: HERO TEMPLE GOPURAM BANNER
               ======================================================== */}
            <section className="hero-temple-parallax-container">
              {/* Background Layer Parallax (Strictly Section 1) */}
              <div
                className="hero-temple-bg-layer"
                style={{
                  backgroundImage: `url('/assets/temple_hero.png')`,
                  transform: `translate3d(0, ${parallaxOffset * 0.45}px, 0)`
                }}
              />

              {/* Gradient Overlay */}
              <div className="hero-temple-overlay" />

              {/* Hero Title Layer Parallax (Strictly Section 1) */}
              <div
                className="hero-title-container"
                style={{
                  transform: `translate3d(0, ${parallaxOffset * 0.18}px, 0)`,
                  opacity: Math.max(0, 1 - parallaxOffset / 450)
                }}
              >
                <h1 className="couple-hero-name">Vamshi</h1>
                <div className="weds-hero-tag">weds</div>
                <h1 className="couple-hero-name">Mounika</h1>
              </div>
            </section>

            {/* ========================================================
                PARALLAX SECTION 2: SHLOKA & MEET THE COUPLE WREATHS
               ======================================================== */}
            <section
              className="shloka-parallax-container"
              style={{
                transform: `translate3d(0, ${parallaxOffset * 0.1}px, 0)`
              }}
            >
              {/* Om/Ganesha Emblem & Shloka */}
              <div className="shloka-container">
                <img
                  src="/assets/ganesha.png"
                  alt="Om Emblem"
                  className="mantra-icon"
                />
                <p className="shloka-quote-text">
                  "|| श्री गणेशाय नमः || Om श्री लक्ष्मीनारायणाभ्यां नमः ||"
                </p>
                <h2 className="section-title-script">Meet the Couple</h2>
                <div className="section-divider-line">
                  <span>✦</span>
                </div>
              </div>

              {/* Bride & Groom Wreaths Parallax */}
              <div className="couple-wreaths-grid">
                <div
                  className="wreath-card groom-wreath-parallax"
                  style={{
                    transform: `translate3d(0, ${parallaxOffset * 0.06}px, 0)`
                  }}
                >
                  <div className="wreath-img-wrapper">
                    <img src="/assets/wreath_groom.png" alt="Vamshi Krishna Groom" />
                  </div>
                  <h3 className="person-name">Vamshi Krishna</h3>
                  <p className="person-parents">S/o Mr. & Mrs. Venkateswara Rao</p>
                </div>

                <div className="weds-center-symbol">
                  &
                </div>

                <div
                  className="wreath-card bride-wreath-parallax"
                  style={{
                    transform: `translate3d(0, ${parallaxOffset * 0.06}px, 0)`
                  }}
                >
                  <div className="wreath-img-wrapper">
                    <img src="/assets/wreath_bride.png" alt="Mounika Sunkavalli Bride" />
                  </div>
                  <h3 className="person-name">Mounika Sunkavalli</h3>
                  <p className="person-parents">D/o Mr. & Mrs. Rama Rao</p>
                </div>
              </div>
            </section>

            {/* ========================================================
                SECTION 3 ONWARDS: STANDARD STATIC SECTIONS (NO PARALLAX)
               ======================================================== */}

            {/* SECTION 3: ROYAL ELEPHANT BANNER */}
            <section className="elephant-banner-section">
              <img src="/assets/elephants.png" alt="Royal Elephants Motif" className="elephants-img" />
              <p className="invitation-body-text">
                Together with their families, Vamshi & Mounika cordially invite you to grace the auspicious occasion of their wedding union with your presence and blessings.
              </p>
            </section>

            {/* SECTION 4: WEDDING EVENTS 2-COLUMN GRID */}
            <section className="events-section">
              <h2 className="section-title-serif">Wedding Events</h2>
              <div className="section-divider-line">
                <span>❖</span>
              </div>
              
              <div className="events-grid-2col">
                {eventsData.map((ev, index) => (
                  <div key={index} className="mini-event-card">
                    <h3 className="mini-event-name">{ev.title}</h3>
                    <div className="mini-event-date">{ev.date}</div>
                    <p className="mini-event-time">{ev.time}</p>
                    <p className="mini-event-venue">{ev.venue}</p>
                    <a
                      href={ev.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="directions-link"
                    >
                      Get Directions &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 5: COUNTDOWN TIMER */}
            <section className="countdown-section">
              <h2 className="section-title-script">Counting down to the big day</h2>
              <div className="timer-row">
                <div className="timer-pill">
                  <div className="timer-val">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="timer-tag">Days</div>
                </div>
                <div className="timer-pill">
                  <div className="timer-val">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="timer-tag">Hours</div>
                </div>
                <div className="timer-pill">
                  <div className="timer-val">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="timer-tag">Mins</div>
                </div>
                <div className="timer-pill">
                  <div className="timer-val">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="timer-tag">Secs</div>
                </div>
              </div>
            </section>

            {/* SECTION 6: PHOTO GALLERY MASONRY */}
            <section className="gallery-section">
              <h2 className="section-title-serif">Memorable Moments</h2>
              <div className="section-divider-line">
                <span>✦</span>
              </div>

              <div className="gallery-masonry-grid">
                <div className="gallery-item large-item">
                  <img src="/assets/gallery1.png" alt="Couple Prewedding 1" />
                </div>
                <div className="gallery-item">
                  <img src="/assets/gallery2.png" alt="Couple Prewedding 2" />
                </div>
                <div className="gallery-item">
                  <img src="/assets/couple.png" alt="Couple Portrait" />
                </div>
                <div className="gallery-item">
                  <img src="/assets/wreath_groom.png" alt="Groom Portrait" />
                </div>
                <div className="gallery-item">
                  <img src="/assets/wreath_bride.png" alt="Bride Portrait" />
                </div>
              </div>
            </section>

            {/* SECTION 7: VIDEO TEASER SECTION */}
            <section className="video-section">
              <h2 className="section-title-script">Our Love Story</h2>
              <div className="section-divider-line">
                <span>❖</span>
              </div>

              <div
                className="video-card-container"
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              >
                {!isVideoPlaying ? (
                  <>
                    <img src="/assets/gallery1.png" alt="Save The Date Video Teaser" />
                    <div className="video-play-overlay">
                      <div className="play-btn-circle">▶</div>
                      <h3 style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.12em', fontSize: '1.2rem' }}>
                        SAVE THE DATE VIDEO
                      </h3>
                      <p style={{ fontSize: '0.95rem', opacity: 0.85, marginTop: '0.4rem' }}>
                        Click to Play Cinematic Teaser
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ background: '#000', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                    <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                      <Sparkles size={44} color="#D4AF37" style={{ margin: '0 auto 1rem auto' }} />
                      <h3 style={{ fontFamily: 'Cinzel, serif', color: '#D4AF37', fontSize: '1.3rem' }}>
                        Vamshi & Mounika - Save The Date
                      </h3>
                      <p style={{ color: '#CCC', marginTop: '0.6rem', fontSize: '1rem' }}>
                        [Cinematic Pre-Wedding Teaser Trailer]
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsVideoPlaying(false); }}
                        className="pill-action-btn"
                        style={{ marginTop: '1.5rem', padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}
                      >
                        CLOSE VIDEO PREVIEW
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* SECTION 8: EVENT VENUE SECTION */}
            <section className="action-box-section">
              <h2 className="section-title-serif">Event Venue</h2>
              <p style={{ fontSize: '1.2rem', color: '#2B1B17', fontWeight: 600, marginTop: '0.6rem' }}>
                Hitex Exhibition Center & JRC Conventions
              </p>
              <p style={{ color: '#7A6455', marginTop: '0.3rem', fontSize: '1.05rem' }}>
                Jubilee Hills & Madhapur, Hyderabad, Telangana
              </p>
              <a
                href="https://maps.google.com/?q=Hitex+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="pill-action-btn"
                style={{ marginTop: '1.5rem' }}
              >
                VIEW VENUE LOCATION
              </a>
            </section>

            {/* SECTION 9: RSVP SECTION */}
            <section className="action-box-section" style={{ background: 'rgba(244, 232, 193, 0.4)' }}>
              <h2 className="section-title-script">RSVP</h2>
              <p style={{ color: '#7A6455', maxWidth: '520px', margin: '0.6rem auto 1.5rem auto', fontSize: '1.15rem' }}>
                We request the honor of your presence. Please confirm your attendance by submitting your RSVP.
              </p>
              <button onClick={() => setIsRsvpOpen(true)} className="pill-action-btn">
                SEND RSVP
              </button>
            </section>

            {/* SECTION 10: BLESSINGS & BOTTOM GOPURAM FOOTER */}
            <footer className="bottom-temple-footer">
              <h2 className="section-title-serif">Blessings & Wishes</h2>
              <p style={{ fontStyle: 'italic', color: '#7A6455', maxWidth: '600px', margin: '0.8rem auto 1.8rem auto', fontSize: '1.15rem' }}>
                "Your prayers, blessings, and warm presence are our most cherished gifts as we begin our new journey together."
              </p>
              <button onClick={() => setIsRsvpOpen(true)} className="pill-action-btn">
                SEND BEST WISHES
              </button>

              {/* Bottom South Indian Temple Gopuram Silhouette Banner with Mango Leaves */}
              <div className="footer-gopuram-banner" />
            </footer>
          </main>

          {/* RSVP Modal Popup */}
          <RSVPModal
            isOpen={isRsvpOpen}
            onClose={() => setIsRsvpOpen(false)}
            onAddWish={(wish) => console.log('Wish added:', wish)}
          />
        </div>
      )}
    </div>
  );
}
