import React, { useState, useEffect } from 'react';
import { DriverRegistration } from '../types';
import { Clock, ShieldCheck, CheckCircle2, XCircle, Search, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StatusPageProps {
  registration: DriverRegistration;
  allRegistrations: DriverRegistration[];
  onSelectRegistration: (reg: DriverRegistration) => void;
  onUpdateRegistrationState?: (updated: DriverRegistration) => void;
  onGoToEPass: () => void;
}

export const StatusPage: React.FC<StatusPageProps> = ({
  registration,
  allRegistrations,
  onSelectRegistration
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [lookupError, setLookupError] = useState('');

  // Celebratory sweep animation when APPROVED
  useEffect(() => {
    if (registration && registration.status === 'APPROVED') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00D2BE', '#22C55E', '#FFFFFF', '#E10600']
      });
    }
  }, [registration?.status]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    if (!searchInput.trim()) return;

    const query = searchInput.trim().toLowerCase();
    const found = allRegistrations.find(
      r => r.id.toLowerCase() === query ||
           r.email.toLowerCase() === query ||
           (r.utrNumber && r.utrNumber.toLowerCase() === query)
    );

    if (found) {
      onSelectRegistration(found);
      setSearchInput('');
    } else {
      setLookupError(`No registration record found matching "${searchInput}". Please verify your Registration ID (e.g. FA26-00042) or email.`);
    }
  };

  const isApproved = registration?.status === 'APPROVED';
  const isRejected = registration?.status === 'REJECTED';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 font-data text-xs select-none">
      
      {/* Page Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#00D2BE]/40 px-3.5 py-1 rounded-full text-xs font-mono text-[#00D2BE]">
          <span className="w-2 h-2 rounded-full bg-[#00D2BE] animate-ping" />
          <span>RACE CONTROL LIVE LOOKUP</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-wider">
          DRIVER <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D2BE] to-white">ENTRY STATUS</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#8A8A93]">
          Enter your 12-digit UTR deposit, Registration ID, or email to check your live paddock approval status.
        </p>
      </div>

      {/* Driver Registration Lookup Search Console */}
      <div className="bg-[#0b0b0e] border-2 border-[#00D2BE] p-6 sm:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,210,190,0.3)] space-y-4">
        
        <form onSubmit={handleLookup} className="space-y-2">
          <label className="text-xs font-mono font-bold text-[#00D2BE] uppercase block flex items-center space-x-2">
            <Search className="w-4 h-4 text-[#00D2BE]" />
            <span>ENTER REGISTRATION ID OR EMAIL *</span>
          </label>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              value={searchInput}
              onChange={e => {
                setSearchInput(e.target.value);
                setLookupError('');
              }}
              placeholder="e.g. FA26-00042 or driver@gmail.com..."
              className="flex-1 bg-[#08080A] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-mono text-xs px-4 py-3.5 outline-none rounded-xl"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#E10600] hover:bg-[#ff0700] text-white font-display text-xs font-black uppercase tracking-wider transition-all rounded-xl shadow-[0_0_25px_rgba(225,6,0,0.6)]"
            >
              LOOKUP STATUS →
            </button>
          </div>
        </form>

        {lookupError && (
          <div className="bg-[#E10600]/15 border border-[#E10600]/40 p-3 text-xs text-[#E10600] flex items-center space-x-2 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{lookupError}</span>
          </div>
        )}
      </div>

      {/* STATUS RESULT CARD DISPLAY */}
      {registration && (
        <div className="bg-[#0b0b0e] border-2 border-[#22222a] p-6 sm:p-10 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden font-data">
          
          {/* Header Info */}
          <div className="flex justify-between items-center border-b border-[#22222a] pb-3 text-xs font-mono">
            <span className="text-[#8A8A93]">REGISTRATION ID: <strong className="text-[#00D2BE]">{registration.id}</strong></span>
            <span className="text-[#F5A623]">{registration.submittedAt}</span>
          </div>

          {/* 1. APPROVED STATE */}
          {isApproved && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E] flex items-center justify-center shadow-[0_0_30px_#22C55E]">
                <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
              </div>

              <div className="space-y-1">
                <span className="bg-[#22C55E] text-[#08080A] font-mono font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  ✅ APPROVED BY RACE CONTROL
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wider pt-2">
                  YOU'RE ON THE GRID!
                </h2>
                <p className="text-xs text-[#8A8A93] font-mono">
                  Your entry deposit has been verified and your driver paddock accreditation is active.
                </p>
              </div>

              {/* Driver Specs Box */}
              <div className="bg-[#14141a] border-2 border-[#00D2BE] p-6 rounded-2xl max-w-md mx-auto space-y-3 shadow-xl">
                <div className="text-[10px] font-mono text-[#8A8A93] uppercase">ASSIGNED DRIVER NUMBER</div>
                <div className="font-mono text-5xl font-black text-[#E10600]">
                  {registration.driverNumber || '#042'}
                </div>
                
                <div className="pt-3 border-t border-[#22222a] text-xs font-mono space-y-1.5 text-left">
                  <div className="flex justify-between"><span className="text-[#8A8A93]">CAPTAIN:</span><strong className="text-white">{registration.fullName}</strong></div>
                  <div className="flex justify-between"><span className="text-[#8A8A93]">TEAM:</span><strong className="text-white">{registration.teamName || 'Independent'}</strong></div>
                  <div className="flex justify-between"><span className="text-[#8A8A93]">TRACK:</span><strong className="text-[#00D2BE]">{registration.championship}</strong></div>
                  <div className="flex justify-between"><span className="text-[#8A8A93]">CATEGORY:</span><strong className="text-white truncate max-w-[200px]">{registration.category}</strong></div>
                  <div className="flex justify-between"><span className="text-[#8A8A93]">UTR REF:</span><strong className="text-[#F5A623]">{registration.utrNumber}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PENDING / IN REVIEW STATE */}
          {!isApproved && !isRejected && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F5A623]/20 border-2 border-[#F5A623] flex items-center justify-center shadow-[0_0_30px_#F5A623]">
                <Clock className="w-9 h-9 text-[#F5A623] animate-spin" />
              </div>

              <div className="space-y-1">
                <span className="bg-[#F5A623] text-[#08080A] font-mono font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  ⏳ AWAITING RACE CONTROL APPROVAL
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider pt-2">
                  REGISTRATION IN QUEUE
                </h2>
                <p className="text-xs text-[#8A8A93] font-mono max-w-md mx-auto">
                  Your 12-digit UTR deposit (<strong className="text-white">{registration.utrNumber || 'PENDING'}</strong>) is being verified by Race Control.
                </p>
              </div>

              <div className="bg-[#14141a] border border-[#22222a] p-4 rounded-xl max-w-md mx-auto text-left space-y-2 font-mono text-xs">
                <div className="flex justify-between"><span className="text-[#8A8A93]">CAPTAIN NAME:</span><span className="text-white font-bold">{registration.fullName}</span></div>
                <div className="flex justify-between"><span className="text-[#8A8A93]">TRACK:</span><span className="text-[#00D2BE]">{registration.championship}</span></div>
                <div className="flex justify-between"><span className="text-[#8A8A93]">CATEGORY:</span><span className="text-white">{registration.category}</span></div>
                <div className="flex justify-between"><span className="text-[#8A8A93]">STATUS:</span><span className="text-[#F5A623] font-bold">VERIFYING UTR DEPOSIT</span></div>
              </div>
            </div>
          )}

          {/* 3. REJECTED STATE */}
          {isRejected && (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E10600]/20 border-2 border-[#E10600] flex items-center justify-center shadow-[0_0_25px_#E10600]">
                <XCircle className="w-8 h-8 text-[#E10600]" />
              </div>

              <div className="space-y-1">
                <span className="bg-[#E10600] text-white font-mono font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  ❌ ENTRY NOT APPROVED
                </span>
                <h2 className="font-display text-2xl font-bold text-white uppercase pt-1">
                  REGISTRATION STOPPED
                </h2>
                <p className="text-xs text-[#E10600] font-mono max-w-md mx-auto">
                  {registration.rejectionReason || 'Deposit UTR could not be verified by Race Control.'}
                </p>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

