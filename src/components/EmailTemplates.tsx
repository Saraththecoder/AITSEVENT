import React, { useState } from 'react';
import { DriverRegistration } from '../types';
import { Mail, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';

interface EmailTemplatesProps {
  registration: DriverRegistration;
}

export const EmailTemplates: React.FC<EmailTemplatesProps> = ({ registration }) => {
  const [activeTab, setActiveTab] = useState<'CONFIRMATION' | 'REJECTION'>('CONFIRMATION');
  const [copied, setCopied] = useState(false);

  const handleCopyHTML = (htmlContent: string) => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header & Template Switcher */}
      <div className="bg-[#151519] border border-[#8A8A93]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#00D2BE] font-data text-xs font-bold uppercase mb-1">
            <Mail className="w-4 h-4" />
            <span>TRANSACTIONAL HTML EMAIL ENGINE</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
            AUTOMATED EMAIL TEMPLATES
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-[#0A0A0C] p-1.5 rounded-xl border border-[#8A8A93]/20">
          <button
            onClick={() => setActiveTab('CONFIRMATION')}
            className={`px-4 py-2 rounded-lg font-display text-xs font-bold transition-all ${
              activeTab === 'CONFIRMATION'
                ? 'bg-[#E10600] text-white shadow-md'
                : 'text-[#8A8A93] hover:text-white'
            }`}
          >
            Confirmation (Grid Confirmed)
          </button>
          <button
            onClick={() => setActiveTab('REJECTION')}
            className={`px-4 py-2 rounded-lg font-display text-xs font-bold transition-all ${
              activeTab === 'REJECTION'
                ? 'bg-[#151519] text-white border border-[#8A8A93]/40 shadow-md'
                : 'text-[#8A8A93] hover:text-white'
            }`}
          >
            Rejection (Race Update)
          </button>
        </div>
      </div>

      {/* Email Container Card */}
      <div className="bg-[#0A0A0C] border border-[#8A8A93]/30 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-4">
        
        {/* Subject Bar */}
        <div className="bg-[#151519] border border-[#8A8A93]/20 p-3 rounded-lg flex items-center justify-between text-xs font-data">
          <div className="text-[#8A8A93]">
            SUBJECT: <strong className="text-white">
              {activeTab === 'CONFIRMATION'
                ? `FORMULA AI 2026 | GRID CONFIRMED — DRIVER ${registration.driverNumber || '#042'}`
                : `FORMULA AI 2026 | REGISTRATION UPDATE — ${registration.id}`}
            </strong>
          </div>
          <button
            onClick={() => handleCopyHTML(activeTab === 'CONFIRMATION' ? 'HTML_CONFIRMATION_SOURCE' : 'HTML_REJECTION_SOURCE')}
            className="text-[11px] font-display text-[#00D2BE] hover:underline flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'COPIED HTML' : 'COPY HTML'}</span>
          </button>
        </div>

        {/* 600px Max Single-Column Email Mockup */}
        <div className="max-w-[600px] mx-auto bg-[#0A0A0C] border border-[#8A8A93]/30 rounded-xl overflow-hidden shadow-2xl font-body text-off-white">
          
          {/* Email 1: Confirmation Header Bar in Racing-Red */}
          {activeTab === 'CONFIRMATION' ? (
            <div className="bg-[#E10600] px-6 py-4 flex items-center justify-between">
              <div className="font-display font-bold text-white text-lg tracking-wider">FORMULA AI 2026</div>
              <div className="font-data text-xs text-white/90 bg-black/20 px-2 py-0.5 rounded">RACE CONTROL</div>
            </div>
          ) : (
            /* Email 2: Rejection Header Bar in Neutral Signal-Grey */
            <div className="bg-[#151519] border-b border-[#8A8A93]/30 px-6 py-4 flex items-center justify-between">
              <div className="font-display font-bold text-[#8A8A93] text-lg tracking-wider">FORMULA AI 2026</div>
              <div className="font-data text-xs text-[#8A8A93] bg-black/40 px-2 py-0.5 rounded">OFFICIAL UPDATE</div>
            </div>
          )}

          {/* Email Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {activeTab === 'CONFIRMATION' ? (
              <>
                <div className="space-y-3">
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-[#00D2BE] uppercase tracking-wider">
                    ✨ THANK YOU FOR REGISTERING! ✨
                  </h3>
                  <p className="text-sm text-[#CCCCCC] leading-relaxed">
                    Dear <strong className="text-white">{registration.fullName}</strong>, we are thrilled to welcome you and your team to the Monza National Circuit Grid! Your entry has officially been confirmed for <strong>FORMULA-AI 2026</strong>.
                  </p>
                </div>

                {/* Data Block (Mono for Values) */}
                <div className="bg-[#151519] border border-[#8A8A93]/20 rounded-xl p-5 space-y-2.5 font-data text-xs">
                  <div className="flex justify-between border-b border-[#8A8A93]/15 pb-1.5">
                    <span className="text-[#8A8A93]">ASSIGNED DRIVER #:</span>
                    <span className="text-[#E10600] font-extrabold text-base">{registration.driverNumber || '#042'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#8A8A93]/15 pb-1.5">
                    <span className="text-[#8A8A93]">REGISTRATION ID:</span>
                    <span className="text-[#00D2BE] font-bold">{registration.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#8A8A93]/15 pb-1.5">
                    <span className="text-[#8A8A93]">CHAMPIONSHIP:</span>
                    <span className="text-white">{registration.championship}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#8A8A93]/15 pb-1.5">
                    <span className="text-[#8A8A93]">EVENT:</span>
                    <span className="text-white">{registration.eventName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#8A8A93]/15 pb-1.5">
                    <span className="text-[#8A8A93]">TEAM:</span>
                    <span className="text-white">{registration.teamName || 'Independent Entry'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8A93]">GRID STATUS:</span>
                    <span className="text-[#00D2BE] font-bold">GRID CONFIRMED</span>
                  </div>
                </div>

                {/* WhatsApp Group Links Box */}
                <div className="bg-[#0b0b0e] border-2 border-[#22C55E] p-4 rounded-xl space-y-2.5 text-center font-mono">
                  <div className="text-[#22C55E] text-xs font-bold uppercase">💬 OFFICIAL WHATSAPP GROUP LINKS</div>
                  
                  {registration.championship === 'ENGINEERING CHAMPIONSHIP' ? (
                    <a
                      href="https://chat.whatsapp.com/GiCGA7Z5EJ6FLjGyQ5PPc2?s=cl&p=a&mlu=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-[#14141a] border border-[#00D2BE] text-[#00D2BE] p-2.5 rounded-lg text-xs font-bold hover:bg-[#00D2BE]/10 transition-colors"
                    >
                      💻 JOIN TECHNICAL EVENTS WHATSAPP GROUP →
                    </a>
                  ) : (
                    <a
                      href="https://chat.whatsapp.com/K7KyJMt6ThZ5mHv0Jly1T7?s=cl&p=a&mlu=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-[#14141a] border border-[#F5A623] text-[#F5A623] p-2.5 rounded-lg text-xs font-bold hover:bg-[#F5A623]/10 transition-colors"
                    >
                      🎨 JOIN NON-TECHNICAL EVENTS WHATSAPP GROUP →
                    </a>
                  )}

                  <a
                    href="https://chat.whatsapp.com/IRR2ETjbcY38Lk4Eucw2b0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#22C55E] text-[#08080A] p-2.5 rounded-lg text-xs font-bold uppercase hover:bg-[#16a34a] transition-colors"
                  >
                    🌐 JOIN OVERALL FORMULA-AI COMMUNITY GROUP →
                  </a>
                </div>

                <div className="bg-[#111115] border border-[#22222a] p-4 rounded-xl space-y-1.5 text-xs font-mono">
                  <div className="text-[#F5A623] font-bold">📞 NEED ASSISTANCE? STUDENT COORDINATORS:</div>
                  <div className="text-[#CCCCCC]">⚙️ <strong>Technical:</strong> B Sarath Kumar (8074244332) · S M Zunaid (88970 02082)</div>
                  <div className="text-[#CCCCCC]">🎨 <strong>Non-Technical:</strong> B Poojan Sai (79893 72489) · S Rajkumar (63003 45719) · M Muwaz (81258 91502)</div>
                </div>

                <div className="bg-[#00D2BE]/10 border border-[#00D2BE]/30 p-3 rounded-lg text-xs text-[#00D2BE] font-data">
                  📎 Your official Driver E-Pass PDF &amp; QR Code is attached to this email. Please keep it accessible for event check-in at Monza Circuit.
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="#status"
                    className="inline-block bg-[#E10600] text-white px-6 py-3 rounded-xl font-display text-xs font-bold uppercase tracking-wider"
                  >
                    VIEW REGISTRATION STATUS
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
                    RACE CONTROL UPDATE.
                  </h3>
                  <p className="text-sm text-[#8A8A93] leading-relaxed">
                    Dear <strong className="text-white">{registration.fullName}</strong>, thank you for your submission to Formula AI 2026. Race Control has completed the review for Registration ID <span className="font-data text-[#00D2BE]">{registration.id}</span> for event <span className="text-white">{registration.eventName}</span>.
                  </p>
                </div>

                {/* Quiet Card with Admin Reason */}
                <div className="bg-[#151519] border border-[#8A8A93]/30 rounded-xl p-5 space-y-2">
                  <div className="text-xs font-display text-[#8A8A93]">RACE CONTROL REVIEW DECISION:</div>
                  <p className="text-xs font-body text-off-white/90 leading-relaxed">
                    {registration.rejectionReason || 'The entry deposit reference UTR provided could not be validated against event ledger records.'}
                  </p>
                </div>

                <p className="text-xs text-[#8A8A93] leading-relaxed">
                  If you believe this is an error or wish to submit updated transaction proof, you may reply to this email to reach Race Control.
                </p>
              </>
            )}

            {/* Email Footer Motif */}
            <div className="pt-6 border-t border-[#8A8A93]/20 text-center font-display text-xs text-[#8A8A93] tracking-widest uppercase">
              RACE BEYOND LIMITS. INNOVATE / COMPETE / LEAD.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
