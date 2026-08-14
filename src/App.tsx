import React, { useState, useEffect } from 'react';
import { AppView, DriverRegistration, ChampionshipType, EventCategory } from './types';
import { INITIAL_MOCK_REGISTRATIONS } from './data/mockData';
import { TelemetryTicker } from './components/TelemetryTicker';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationReceived } from './components/RegistrationReceived';
import { StatusPage } from './components/StatusPage';
import { EPass } from './components/EPass';
import { QRVerification } from './components/QRVerification';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { EmailTemplates } from './components/EmailTemplates';
import { F1AudioPlayer } from './components/F1AudioPlayer';
import { EventsPage } from './components/EventsPage';
import { CoordinatorsPage } from './components/CoordinatorsPage';
import { SplashScreen } from './components/SplashScreen';
import { submitRegistrationToGoogleSheet, fetchRegistrationsFromGoogleSheet } from './services/apiService';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isRefreshingData, setIsRefreshingData] = useState<boolean>(false);
  const [registrations, setRegistrations] = useState<DriverRegistration[]>(() => {
    const saved = localStorage.getItem('formula_ai_registrations_2026');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved registrations', e);
      }
    }
    return INITIAL_MOCK_REGISTRATIONS;
  });

  const [currentView, setCurrentView] = useState<AppView>('LANDING');
  const [activeDriverId, setActiveDriverId] = useState<string>(() => {
    return registrations[0]?.id || '';
  });

  // Admin Security Session Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('formula_ai_admin_auth') === 'true';
  });

  // Sync registrations to local storage
  useEffect(() => {
    localStorage.setItem('formula_ai_registrations_2026', JSON.stringify(registrations));
  }, [registrations]);

  // Sync admin auth to session storage
  useEffect(() => {
    sessionStorage.setItem('formula_ai_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Always scroll to top of page whenever switching views (e.g. going to Registration Form)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentView]);

  // Real-time synchronization with Google Apps Script
  const handleSyncRealtimeData = async () => {
    setIsRefreshingData(true);
    try {
      const remoteData = await fetchRegistrationsFromGoogleSheet();
      if (remoteData && remoteData.length > 0) {
        setRegistrations(prev => {
          const map = new Map<string, DriverRegistration>();
          // Preserve local status updates while adopting new entries from sheet
          prev.forEach(item => map.set(item.id, item));
          remoteData.forEach(item => {
            const existing = map.get(item.id);
            if (!existing) {
              map.set(item.id, item);
            } else {
              // Merge remote status if changed
              map.set(item.id, { ...existing, ...item });
            }
          });
          return Array.from(map.values());
        });
      }
    } catch (e) {
      console.error('Failed real-time sync:', e);
    } finally {
      setIsRefreshingData(false);
    }
  };

  // Automatic real-time polling every 10 seconds when viewing Admin Dashboard
  useEffect(() => {
    if (currentView === 'ADMIN_DASHBOARD') {
      handleSyncRealtimeData();
      const interval = setInterval(() => {
        handleSyncRealtimeData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [currentView]);

  // Secret Route Protection: Admin can ONLY be accessed via URL parameter ?route=admin or ?view=ADMIN_DASHBOARD
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as AppView;
    const routeParam = params.get('route');
    const idParam = params.get('id');

    if (idParam) setActiveDriverId(idParam);

    if (routeParam === 'admin' || viewParam === 'ADMIN_DASHBOARD') {
      if (isAdminAuthenticated) {
        setCurrentView('ADMIN_DASHBOARD');
      } else {
        setCurrentView('ADMIN_LOGIN');
      }
    } else if (viewParam) {
      setCurrentView(viewParam);
    }
  }, [isAdminAuthenticated]);

  const activeRegistration = registrations.find(r => r.id === activeDriverId) || registrations[0];

  const handleCreateRegistration = (newReg: DriverRegistration) => {
    setRegistrations(prev => [newReg, ...prev]);
    setActiveDriverId(newReg.id);
    setCurrentView('REGISTRATION_RECEIVED');

    // Asynchronously send to Google Sheets & Email Service
    submitRegistrationToGoogleSheet(newReg);
  };

  const handleUpdateRegistration = (updated: DriverRegistration) => {
    setRegistrations(prev => prev.map(r => r.id === updated.id ? updated : r));
    // Asynchronously send status update to Google Sheets & Email Service
    submitRegistrationToGoogleSheet(updated);
  };

  const handleAddRegistrationFromAdmin = (newReg: DriverRegistration) => {
    setRegistrations(prev => [newReg, ...prev]);
  };

  const handleSelectForView = (reg: DriverRegistration) => {
    setActiveDriverId(reg.id);
    setCurrentView('E_PASS');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('ADMIN_DASHBOARD');
  };

  const [preSelectedChampionship, setPreSelectedChampionship] = useState<ChampionshipType | undefined>();
  const [preSelectedCategory, setPreSelectedCategory] = useState<EventCategory | undefined>();

  const handleStartRegistration = (championship?: ChampionshipType, category?: EventCategory) => {
    setPreSelectedChampionship(championship);
    setPreSelectedCategory(category);
    setCurrentView('REGISTRATION_FORM');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('LANDING');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleViewChange = (view: AppView) => {
    if (view === 'ADMIN_DASHBOARD' && !isAdminAuthenticated) {
      setCurrentView('ADMIN_LOGIN');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F5F5F7] font-body flex flex-col selection:bg-[#E10600] selection:text-white w-full max-w-full overflow-x-hidden">
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      
      {/* Main Public Navbar (Hides Admin references unless authenticated) */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleViewChange}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={handleAdminLogout}
      />


      {/* Main Content Render */}
      <main className="flex-1">
        {currentView === 'LANDING' && (
          <LandingHero
            onStartRegistration={handleStartRegistration}
          />
        )}

        {currentView === 'EVENTS' && (
          <EventsPage
            onStartRegistration={handleStartRegistration}
          />
        )}

        {currentView === 'COORDINATORS' && (
          <CoordinatorsPage
            onStartRegistration={handleStartRegistration}
          />
        )}

        {currentView === 'REGISTRATION_FORM' && (
          <RegistrationForm
            onSubmitSuccess={handleCreateRegistration}
            onCancel={() => setCurrentView('LANDING')}
            initialChampionship={preSelectedChampionship}
            initialCategory={preSelectedCategory}
          />
        )}

        {currentView === 'REGISTRATION_RECEIVED' && (
          <RegistrationReceived
            registration={activeRegistration}
            onGoToStatus={() => setCurrentView('STATUS_PAGE')}
          />
        )}

        {currentView === 'STATUS_PAGE' && (
          <StatusPage
            registration={activeRegistration}
            allRegistrations={registrations}
            onSelectRegistration={(reg) => setActiveDriverId(reg.id)}
            onUpdateRegistrationState={handleUpdateRegistration}
            onGoToEPass={() => setCurrentView('E_PASS')}
          />
        )}

        {currentView === 'E_PASS' && (
          <EPass
            registration={activeRegistration}
            onGoToVerification={() => setCurrentView('QR_VERIFICATION')}
          />
        )}

        {currentView === 'QR_VERIFICATION' && (
          <QRVerification
            registration={activeRegistration}
          />
        )}

        {currentView === 'ADMIN_LOGIN' && (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onCancel={() => setCurrentView('LANDING')}
          />
        )}

        {currentView === 'ADMIN_DASHBOARD' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              registrations={registrations}
              onUpdateRegistration={handleUpdateRegistration}
              onAddRegistration={handleAddRegistrationFromAdmin}
              onSelectForView={handleSelectForView}
              onRefreshData={handleSyncRealtimeData}
              isRefreshing={isRefreshingData}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={handleAdminLoginSuccess}
              onCancel={() => setCurrentView('LANDING')}
            />
          )
        )}

        {currentView === 'EMAIL_PREVIEW' && (
          <EmailTemplates
            registration={activeRegistration}
          />
        )}
      </main>

      {/* Clean Public Footer (Zero Admin Links Exposed) */}
      <footer className="border-t border-[#22222a] bg-[#111115] py-6 text-xs text-[#8A8A93] font-data">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="led-indicator led-green" />
            <span className="text-white font-display font-bold">FORMULA-AI 2026 PADDOCK ENGINE</span>
            <span>· VERSION 2.6.0-PROD</span>
          </div>

        </div>
      </footer>

      {/* Floating F1 Audio Telemetry Player Bar */}
      <F1AudioPlayer />
    </div>
  );
};

export default App;
