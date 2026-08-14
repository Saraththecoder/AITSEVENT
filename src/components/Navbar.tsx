import React, { useState } from 'react';
import { AppView } from '../types';
import { Flag, UserCheck, LayoutDashboard, LogOut, ChevronRight, Trophy, Menu, X, Radio } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  isAdminAuthenticated: boolean;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  setCurrentView,
  isAdminAuthenticated,
  onAdminLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToEvents = () => {
    setMobileMenuOpen(false);
    if (currentView !== 'LANDING') {
      setCurrentView('LANDING');
      setTimeout(() => {
        const el = document.getElementById('events');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById('events');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full max-w-full font-data select-none">
      
      {/* Top Multi-Color Racing Stripe */}
      <div className="h-1 bg-gradient-to-r from-[#E10600] via-[#00D2BE] to-[#E10600] w-full shadow-[0_0_15px_#E10600]" />

      <div className="bg-[#08080A]/95 backdrop-blur-xl border-b border-[#22222a] shadow-2xl w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Header & Logo */}
          <div 
            onClick={() => {
              setCurrentView('LANDING');
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group flex-shrink"
          >
            <img 
              src="/logo.png" 
              alt="FORMULA-AI 2026 Logo" 
              className="h-8 sm:h-11 w-auto max-w-[140px] sm:max-w-[200px] object-contain drop-shadow-[0_0_15px_rgba(225,6,0,0.7)] group-hover:scale-105 transition-all flex-shrink-0" 
            />
            <div className="min-w-0">
              <div className="font-display text-xs sm:text-base font-black tracking-wider text-white flex items-center space-x-1 sm:space-x-2">
                <span className="truncate">FORMULA-AI</span>
                <span className="text-[8px] sm:text-[10px] font-mono bg-[#E10600] text-white px-1 sm:px-1.5 py-0.5 font-bold rounded shadow-[0_0_8px_#E10600] flex-shrink-0">
                  2026
                </span>
              </div>
              <div className="text-[7.5px] sm:text-[9px] text-[#00D2BE] font-mono tracking-widest uppercase flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2BE] animate-ping flex-shrink-0" />
                <span className="truncate">MONZA GP</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (Visible >= lg) */}
          <div className="hidden lg:flex items-center space-x-1 bg-[#14141a]/90 p-1.5 border border-[#22222a] rounded-2xl shadow-xl">
            
            <button
              onClick={() => setCurrentView('LANDING')}
              className={`px-4 py-2 flex items-center space-x-2 transition-all duration-300 font-bold rounded-xl text-xs uppercase ${
                currentView === 'LANDING'
                  ? 'bg-[#E10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.6)]'
                  : 'text-[#8A8A93] hover:text-white hover:bg-[#1f1f28]'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>HOME</span>
            </button>

            <button
              onClick={() => setCurrentView('EVENTS')}
              className={`px-4 py-2 flex items-center space-x-2 transition-all duration-300 font-bold rounded-xl text-xs uppercase ${
                currentView === 'EVENTS'
                  ? 'bg-[#E10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.6)]'
                  : 'text-[#8A8A93] hover:text-white hover:bg-[#1f1f28]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#F5A623]" />
              <span>EVENTS &amp; RULES</span>
            </button>

            <button
              onClick={() => setCurrentView('STATUS_PAGE')}
              className={`px-4 py-2 flex items-center space-x-2 transition-all duration-300 font-bold rounded-xl text-xs uppercase ${
                currentView === 'STATUS_PAGE' || currentView === 'E_PASS'
                  ? 'bg-[#E10600] text-white shadow-[0_0_20px_rgba(225,6,0,0.6)]'
                  : 'text-[#8A8A93] hover:text-white hover:bg-[#1f1f28]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#00D2BE]" />
              <span>DRIVER STATUS &amp; E-PASS</span>
            </button>

            {/* Secret Admin Navigation - ONLY visible when authenticated */}
            {isAdminAuthenticated && (
              <div className="flex items-center space-x-1 pl-2 border-l border-[#22222a]">
                <button
                  onClick={() => setCurrentView('ADMIN_DASHBOARD')}
                  className={`px-3 py-2 flex items-center space-x-1.5 transition-all text-xs rounded-xl ${
                    currentView === 'ADMIN_DASHBOARD'
                      ? 'bg-[#E10600] text-white font-bold'
                      : 'text-[#F5A623] hover:text-white hover:bg-[#1f1f28]'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>RACE CONTROL</span>
                </button>

                <button
                  onClick={onAdminLogout}
                  className="p-2 text-[#8A8A93] hover:text-[#E10600] transition-colors rounded-lg"
                  title="Logout Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* Right Primary Action & Mobile Menu Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            <button
              onClick={() => setCurrentView('REGISTRATION_FORM')}
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-[#E10600] via-[#ff261b] to-[#E10600] text-white px-3 sm:px-4 py-2 sm:py-2.5 font-display text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all duration-300 rounded-xl shadow-[0_0_20px_rgba(225,6,0,0.6)] border border-white/60 overflow-hidden transform hover:scale-105 flex-shrink-0"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00D2BE] animate-ping mr-1 sm:mr-1.5" />
              <span className="sm:hidden font-bold">REGISTER</span>
              <span className="hidden sm:inline">REGISTER DRIVER NOW</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5 sm:ml-1 group-hover:translate-x-1 transition-transform text-[#00D2BE]" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-[#14141a] border border-[#22222a] text-white hover:text-[#00D2BE] rounded-xl transition-colors flex-shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c10]/95 backdrop-blur-xl border-b-2 border-[#E10600] p-4 space-y-2.5 font-data text-xs shadow-2xl animate-hero-zoom max-w-full overflow-hidden">
          <button
            onClick={() => {
              setCurrentView('LANDING');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-3 text-left font-bold flex items-center justify-between rounded-xl transition-all ${
              currentView === 'LANDING' ? 'bg-[#E10600] text-white shadow-lg' : 'text-[#8A8A93] bg-[#14141a] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Flag className="w-4 h-4 text-[#E10600]" />
              <span>HOME</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => {
              setCurrentView('EVENTS');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-3 text-left font-bold flex items-center justify-between rounded-xl transition-all ${
              currentView === 'EVENTS' ? 'bg-[#E10600] text-white shadow-lg' : 'text-[#F5A623] bg-[#14141a] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Trophy className="w-4 h-4 text-[#F5A623]" />
              <span>8 COMPETITIONS &amp; RULES</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => {
              setCurrentView('STATUS_PAGE');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-3 text-left font-bold flex items-center justify-between rounded-xl transition-all ${
              currentView === 'STATUS_PAGE' || currentView === 'E_PASS' ? 'bg-[#E10600] text-white shadow-lg' : 'text-[#8A8A93] bg-[#14141a] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <UserCheck className="w-4 h-4 text-[#00D2BE]" />
              <span>DRIVER STATUS &amp; E-PASS</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {isAdminAuthenticated && (
            <button
              onClick={() => {
                setCurrentView('ADMIN_DASHBOARD');
                setMobileMenuOpen(false);
              }}
              className="w-full p-3 text-left font-bold flex items-center justify-between rounded-xl text-[#F5A623] bg-[#14141a] border border-[#F5A623]/40"
            >
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="w-4 h-4 text-[#F5A623]" />
                <span>RACE CONTROL ADMIN</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          )}

          <button
            onClick={() => {
              setCurrentView('REGISTRATION_FORM');
              setMobileMenuOpen(false);
            }}
            className="w-full p-3.5 bg-gradient-to-r from-[#E10600] to-[#ff261b] text-white font-display font-bold uppercase tracking-wider text-center rounded-xl shadow-lg flex items-center justify-center space-x-2 mt-2"
          >
            <span>REGISTER DRIVER NOW (₹80 / ₹50)</span>
            <ChevronRight className="w-4 h-4 text-[#00D2BE]" />
          </button>
        </div>
      )}
    </nav>
  );
};
