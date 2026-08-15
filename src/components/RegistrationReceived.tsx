import React from 'react';
import { DriverRegistration } from '../types';
import { Clock, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

interface RegistrationReceivedProps {
  registration: DriverRegistration;
  onGoToStatus: () => void;
}

export const RegistrationReceived: React.FC<RegistrationReceivedProps> = ({
  registration,
  onGoToStatus
}) => {
  const champUpper = (registration.championship || '').toUpperCase();
  const catUpper = (registration.category || registration.eventName || '').toUpperCase();

  const isTechEvent = champUpper.indexOf('ENGINEERING') !== -1 ||
                     catUpper.indexOf('CODING') !== -1 ||
                     catUpper.indexOf('PROMPT') !== -1 ||
                     catUpper.indexOf('HACKATHON') !== -1 ||
                     catUpper.indexOf('TYPING') !== -1 ||
                     catUpper.indexOf('TELEMETRY') !== -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 font-data">
      <div className="bg-[#111115] border border-[#22222a] p-6 sm:p-10 shadow-2xl space-y-6 text-center relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#F5A623]" />

        {/* Icon */}
        <div className="w-14 h-14 mx-auto bg-[#08080A] border border-[#F5A623]/40 flex items-center justify-center text-[#F5A623]">
          <Clock className="w-7 h-7 animate-pulse" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="text-[10px] text-[#F5A623] font-bold uppercase tracking-widest">STAGE 1 ENTRY SUBMITTED</div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
            AWAITING RACE CONTROL ADMIN APPROVAL
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#8A8A93] max-w-md mx-auto leading-relaxed">
            Your registration form and deposit UTR reference have been received. Please wait for official Admin review and approval.
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-[#08080A] border border-[#22222a] p-5 space-y-4 max-w-md mx-auto text-left">
          <div className="flex items-center justify-between border-b border-[#22222a] pb-2">
            <span className="text-[10px] text-[#8A8A93]">REGISTRATION REFERENCE ID</span>
            <span className="bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/40 px-2 py-0.5 text-[10px] font-bold">
              PENDING ADMIN APPROVAL
            </span>
          </div>

          <div className="text-2xl font-bold text-[#00D2BE] tracking-wider">
            {registration.id}
          </div>

          <div className="text-xs space-y-1.5 text-[#8A8A93] pt-1">
            <div className="flex justify-between">
              <span>DRIVER NAME:</span>
              <span className="text-white font-medium">{registration.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span>EMAIL:</span>
              <span className="text-white font-medium">{registration.email}</span>
            </div>
            <div className="flex justify-between">
              <span>CATEGORY:</span>
              <span className="text-white font-medium">{registration.category}</span>
            </div>
            <div className="flex justify-between">
              <span>UTR REF:</span>
              <span className="text-white font-medium">{registration.utrNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>TIMESTAMP:</span>
              <span className="text-white font-medium">{registration.submittedAt}</span>
            </div>
          </div>
        </div>

        {/* Automatic Email Notification Notice */}
        <div className="bg-[#08080A] border border-[#22222a] p-4 text-left text-xs font-body space-y-2">
          <div className="font-display font-bold text-white text-xs flex items-center space-x-2">
            <Mail className="w-4 h-4 text-[#00D2BE]" />
            <span>AUTOMATED E-PASS EMAIL DISPATCH</span>
          </div>
          <p className="text-[#8A8A93] text-xs leading-relaxed">
            No pass is issued immediately. Once Race Control Admin verifies your UTR deposit and approves your entry, your official <strong>Driver E-Pass with assigned Driver Number</strong> will be <strong>automatically sent directly to your registered email address ({registration.email})</strong>.
          </p>
        </div>

        {/* OFFICIAL WHATSAPP GROUP JOIN LINKS CARD - DYNAMICALLY FILTERED */}
        <div className="bg-[#08080A] border-2 border-[#25D366] p-4 rounded-xl space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-[#22222a] pb-2">
            <span className="text-[#25D366] font-display text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <span>💬 OFFICIAL WHATSAPP GROUPS</span>
            </span>
            <span className="bg-[#25D366]/20 text-[#25D366] text-[9px] font-mono px-2 py-0.5 rounded font-bold">
              JOIN NOW
            </span>
          </div>

          <div className="space-y-2 font-mono">
            {isTechEvent ? (
              <a
                href="https://chat.whatsapp.com/GiCGA7Z5EJ6FLjGyQ5PPc2?s=cl&p=a&mlu=0"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#14141a] hover:bg-[#1c1c24] border border-[#00D2BE] text-[#00D2BE] rounded-lg text-xs font-bold flex items-center justify-between transition-all"
              >
                <span>💻 JOIN TECHNICAL EVENTS WHATSAPP GROUP</span>
                <span>→</span>
              </a>
            ) : (
              <a
                href="https://chat.whatsapp.com/K7KyJMt6ThZ5mHv0Jly1T7?s=cl&p=a&mlu=0"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-[#14141a] hover:bg-[#1c1c24] border border-[#F5A623] text-[#F5A623] rounded-lg text-xs font-bold flex items-center justify-between transition-all"
              >
                <span>🎨 JOIN NON-TECHNICAL EVENTS WHATSAPP GROUP</span>
                <span>→</span>
              </a>
            )}

            <a
              href="https://chat.whatsapp.com/IRR2ETjbcY38Lk4Eucw2b0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-3 bg-[#25D366] hover:bg-[#20bd5a] text-[#08080A] font-display font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center space-x-1.5 transition-all"
            >
              <span>🌐 JOIN OVERALL FORMULA-AI COMMUNITY GROUP →</span>
            </a>
          </div>
        </div>

        {/* Check Status Button */}
        <div className="pt-2">
          <button
            onClick={onGoToStatus}
            className="w-full sm:w-auto px-6 py-3 bg-[#111115] hover:bg-[#1a1a20] text-white border border-[#22222a] font-display text-xs font-bold tracking-wider transition-all"
          >
            CHECK ENTRY STATUS
          </button>
        </div>

      </div>
    </div>
  );
};
