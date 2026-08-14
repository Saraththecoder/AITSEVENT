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

  return (
    <nav className="sticky top-0 z-50 w-full font-data">
      
      {/* Top Red & Teal Multi-Color F1 Racing Telemetry Stripe */}
      <div className="h-1 bg-gradient-to-r from-[#E10600] via-[#00D2BE] to-[#E10600] w-full shadow-[0_0_15px_#E10600]" />

      <div className="bg-[#08080A]/90 backdrop-blur-xl border-b border-[#22222a] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Brand Header & Logo */}
          <div 
            onClick={() => {
              setCurrentView('LANDING');
              setMobileMenuOpen(false);
            }}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#14141a] border-2 border-[#E10600] group-hover:border-[#00D2BE] flex items-center justify-center font-display font-black text-sm sm:text-lg text-[#E10600] group-hover:text-[#00D2BE] transition-all shadow-[0_0_20px_rgba(225,6,0,0.5)] rounded-xl flex-shrink-0">
              F1
            </div>
            <div>
              <div className="font-display text-sm sm:text-lg font-black tracking-wider text-white flex items-center space-x-1.5 sm:space-x-2">
                <span>FORMULA-AI</span>
                <span className="text-[9px] sm:text-[10px] font-mono bg-[#E10600] text-white px-1.5 py-0.5 font-bold rounded shadow-[0_0_8px_#E10600]">
                  2026
                </span>
              </div>
              <div className="text-[8px] sm:text-[9px] text-[#00D2BE] font-mono tracking-widest uppercase flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2BE] animate-ping" />
                <span className="truncate max-w-[130px] sm:max-w-none">MONZA GRAND PRIX</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
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

            <a
              href="#events"
              onClick={() => {
                if (currentView !== 'LANDING') setCurrentView('LANDING');
              }}
              className="px-4 py-2 text-[#8A8A93] hover:text-white hover:bg-[#1f1f28] transition-all flex items-center space-x-1.5 font-bold rounded-xl text-xs uppercase"
            >
              <Trophy className="w-3.5 h-3.5 text-[#F5A623]" />
              <span>8 COMPETITIONS</span>
            </a>

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
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <button
              onClick={() => setCurrentView('REGISTRATION_FORM')}
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-[#E10600] via-[#ff261b] to-[#E10600] text-white px-3 sm:px-5 py-2 sm:py-2.5 font-display text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all duration-300 rounded-xl shadow-[0_0_25px_rgba(225,6,0,0.7)] hover:shadow-[0_0_40px_rgba(0,210,190,0.8)] border border-white/80 overflow-hidden transform hover:scale-105 flex-shrink-0"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00D2BE] animate-ping mr-1.5" />
              <span>REGISTER DRIVER NOW</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform text-[#00D2BE]" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 bg-[#14141a] border border-[#22222a] text-white hover:text-[#00D2BE] rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c10] border-b border-[#22222a] p-4 space-y-2 font-data text-xs shadow-2xl animate-hero-zoom">
          <button
            onClick={() => {
              setCurrentView('LANDING');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-3 text-left font-bold flex items-center space-x-3 rounded-xl ${
              currentView === 'LANDING' ? 'bg-[#E10600] text-white' : 'text-[#8A8A93] bg-[#14141a]'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>HOME</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('STATUS_PAGE');
              setMobileMenuOpen(false);
            }}
            className={`w-full p-3 text-left font-bold flex items-center space-x-3 rounded-xl ${
              currentView === 'STATUS_PAGE' || currentView === 'E_PASS' ? 'bg-[#E10600] text-white' : 'text-[#8A8A93] bg-[#14141a]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#00D2BE]" />
            <span>DRIVER STATUS &amp; E-PASS</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('REGISTRATION_FORM');
              setMobileMenuOpen(false);
            }}
            className="w-full p-3.5 bg-[#E10600] text-white font-display font-bold uppercase tracking-wider text-center rounded-xl shadow-lg flex items-center justify-center space-x-2"
          >
            <span>REGISTER DRIVER (₹80 / ₹50)</span>
            <ChevronRight className="w-4 h-4 text-[#00D2BE]" />
          </button>
        </div>
      )}
    </nav>
  );
};
