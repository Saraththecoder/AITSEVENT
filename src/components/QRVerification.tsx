import React from 'react';
import { DriverRegistration } from '../types';
import { CheckCircle2, ShieldCheck, Flag, ExternalLink } from 'lucide-react';

interface QRVerificationProps {
  registration: DriverRegistration;
}

export const QRVerification: React.FC<QRVerificationProps> = ({ registration }) => {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-[#151519] border-2 border-[#00D2BE]/50 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center carbon-texture relative overflow-hidden">
        
        {/* Verification Icon Header */}
        <div className="w-16 h-16 mx-auto rounded-full bg-[#00D2BE]/15 border-2 border-[#00D2BE] flex items-center justify-center shadow-[0_0_25px_rgba(0,210,190,0.4)]">
          <CheckCircle2 className="w-9 h-9 text-[#00D2BE]" />
        </div>

        {/* Verification Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-[#00D2BE]/20 text-[#00D2BE] border border-[#00D2BE]/40 px-3 py-0.5 rounded-full font-data text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OFFICIAL RACE CONTROL VERIFIED</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wider pt-2">
            VALID DRIVER PASS
          </h2>
          <p className="text-xs text-[#8A8A93] font-data">Authenticated against Formula AI 2026 Master Grid Ledger</p>
        </div>

        {/* Safe Public Fields Card Only */}
        <div className="bg-[#0A0A0C] border border-[#8A8A93]/30 rounded-xl p-5 text-left space-y-3 font-data text-xs">
          <div className="flex justify-between border-b border-[#8A8A93]/15 pb-2">
            <span className="text-[#8A8A93] font-body text-[10px]">DRIVER NAME</span>
            <span className="text-white font-bold text-sm">{registration.fullName}</span>
          </div>

          <div className="flex justify-between border-b border-[#8A8A93]/15 pb-2">
            <span className="text-[#8A8A93] font-body text-[10px]">DRIVER NUMBER</span>
            <span className="text-[#E10600] font-bold text-xl">{registration.driverNumber || '#042'}</span>
          </div>

          <div className="flex justify-between border-b border-[#8A8A93]/15 pb-2">
            <span className="text-[#8A8A93] font-body text-[10px]">CHAMPIONSHIP</span>
            <span className="text-white text-right max-w-[180px]">{registration.championship}</span>
          </div>

          <div className="flex justify-between border-b border-[#8A8A93]/15 pb-2">
            <span className="text-[#8A8A93] font-body text-[10px]">EVENT</span>
            <span className="text-white">{registration.eventName}</span>
          </div>

          <div className="flex justify-between border-b border-[#8A8A93]/15 pb-2">
            <span className="text-[#8A8A93] font-body text-[10px]">REGISTRATION ID</span>
            <span className="text-[#00D2BE] font-bold">{registration.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8A8A93] font-body text-[10px]">GRID STATUS</span>
            <span className="text-[#00D2BE] font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{registration.status}</span>
            </span>
          </div>
        </div>

        {/* Public Privacy Note */}
        <div className="text-[11px] font-data text-[#8A8A93] bg-[#0A0A0C]/50 p-2.5 rounded border border-[#8A8A93]/15 text-left">
          🔒 Public Privacy Shield Active: Sensitive PII (Phone, Email, Payment Hash) is omitted in public verification scans.
        </div>

        {/* Footer Motif */}
        <div className="pt-2 border-t border-[#8A8A93]/20 font-display text-xs text-[#8A8A93] tracking-widest uppercase">
          FORMULA AI 2026 — RACE BEYOND LIMITS
        </div>

      </div>
    </div>
  );
};
