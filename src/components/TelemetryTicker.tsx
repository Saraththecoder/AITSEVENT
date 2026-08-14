import React, { useState, useEffect } from 'react';
import { AppView, DriverRegistration } from '../types';
import { Radio, Cpu, Activity, Gauge, CloudSun, Timer } from 'lucide-react';

interface TelemetryTickerProps {
  currentView: AppView;
  selectedRegistration?: DriverRegistration | null;
  registrations: DriverRegistration[];
}

export const TelemetryTicker: React.FC<TelemetryTickerProps> = ({
  currentView,
  selectedRegistration,
  registrations
}) => {
  const [ms, setMs] = useState(482);
  const [sector1, setSector1] = useState('26.418');
  
  // Live Countdown Calculation to March 19, 2026
  const [timeLeft, setTimeLeft] = useState({ days: 33, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const updateTickerTimer = () => {
      setMs(Math.floor(100 + Math.random() * 899));
      
      const now = new Date();
      // August 19, 2026 09:00:00 IST (7 = August)
      const raceDate = new Date(2026, 7, 19, 9, 0, 0).getTime();
      const difference = raceDate - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        const nextRaceDate = new Date(2027, 7, 19, 9, 0, 0).getTime();
        const diffNext = nextRaceDate - now.getTime();
        setTimeLeft({
          days: Math.floor(diffNext / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffNext % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diffNext % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diffNext % (1000 * 60)) / 1000)
        });
      }
    };

    updateTickerTimer();
    const timer = setInterval(updateTickerTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const pendingCount = registrations.filter(r => r.status === 'PAYMENT_PENDING' || r.status === 'UNDER_REVIEW' || r.status === 'SUBMITTED').length;
  const verifiedCount = registrations.filter(r => r.status === 'PAYMENT_VERIFIED').length;
  const approvedCount = registrations.filter(r => r.status === 'APPROVED').length;

  return (
    <div className="sticky top-0 z-50 w-full max-w-full overflow-hidden bg-[#08080A] border-b border-[#22222a] select-none text-[11px] font-data">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
        
        {/* Left Side: Broadcast Telemetry Feed */}
        <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="flex items-center space-x-1.5 bg-[#111115] px-2 py-0.5 border border-[#00D2BE]/40 text-[#00D2BE] rounded">
            <span className="led-indicator led-green animate-ping" />
            <span className="font-display text-[10px] font-bold tracking-widest uppercase">AWS TELEMETRY LIVE</span>
          </div>

          {/* LIVE RACE DAY AUGUST 19 COUNTDOWN */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#14141a] px-2.5 py-0.5 border border-[#E10600]/60 text-white rounded font-mono text-[10px]">
            <Timer className="w-3 h-3 text-[#E10600] animate-pulse" />
            <span>AUGUST 19 RACE: <strong className="text-[#E10600] font-bold">{timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S</strong></span>
          </div>

          <span className="text-[#8A8A93] hidden md:inline">|</span>

          {currentView === 'ADMIN_DASHBOARD' ? (
            <div className="flex items-center space-x-4 font-mono">
              <span className="text-[#8A8A93]">RACE CONTROL:</span>
              <span className="text-[#F5A623]">PENDING [<strong className="text-white">{pendingCount}</strong>]</span>
              <span className="text-[#00D2BE]">VERIFIED [<strong className="text-white">{verifiedCount}</strong>]</span>
              <span className="text-[#E10600]">GRID [<strong className="text-white">{approvedCount}</strong>]</span>
            </div>
          ) : selectedRegistration && (currentView === 'STATUS_PAGE' || currentView === 'E_PASS' || currentView === 'QR_VERIFICATION') ? (
            <div className="flex items-center space-x-3">
              <span className="text-[#8A8A93]">ENTRY: <span className="text-[#00D2BE] font-bold">{selectedRegistration.id}</span></span>
              <span className="text-[#8A8A93]">·</span>
              <span className="text-[#F5A623]">STATE: {selectedRegistration.status}</span>
              <span className="text-[#8A8A93] hidden sm:inline">·</span>
              <span className="text-[#8A8A93] hidden sm:inline">UTR: {selectedRegistration.utrNumber || 'PENDING'}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-4 text-[#8A8A93]">
              <span className="text-white flex items-center space-x-1">
                <Gauge className="w-3 h-3 text-[#00D2BE]" />
                <span>MONZA LAP RECORD: <strong className="text-[#00D2BE]">1:18.841</strong></span>
              </span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">SPEED TRAP: <strong className="text-white">352.4 KM/H</strong></span>
            </div>
          )}
        </div>

        {/* Right Side: Monza Weather Telemetry & Sector Color Blocks */}
        <div className="flex items-center space-x-3 flex-shrink-0 font-mono">
          
          {/* Monza Weather Telemetry */}
          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-[#00D2BE]">
            <CloudSun className="w-3.5 h-3.5 text-[#00D2BE]" />
            <span>MONZA: <strong className="text-white">21°C · DRY TRACK</strong></span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 text-[#8A8A93]">
            <Activity className="w-3 h-3 text-[#E10600]" />
            <span className="text-[10px]">SYNC: <strong className="text-white">:{ms}MS</strong></span>
          </div>

          {/* Miniature F1 sector color blocks */}
          <div className="flex space-x-0.5">
            <span className="w-2.5 h-3 bg-[#00D2BE]" title="Sector 1: Purple/Personal Best" />
            <span className="w-2.5 h-3 bg-[#00D2BE]" title="Sector 2: Purple" />
            <span className="w-2.5 h-3 bg-[#F5A623]" title="Sector 3: Yellow" />
          </div>
        </div>

      </div>
    </div>
  );
};

