import React from 'react';
import { Phone, Mail, UserCheck, ShieldCheck, Award, MessageSquare, Wrench, Sparkles } from 'lucide-react';

interface CoordinatorsPageProps {
  onStartRegistration: () => void;
}

export interface CoordinatorInfo {
  name: string;
  role: string;
  departmentOrBranch?: string;
  phone: string;
  category: 'TECHNICAL' | 'NON_TECHNICAL';
  email?: string;
}

export const TECHNICAL_COORDINATORS: CoordinatorInfo[] = [
  {
    name: "B Sarath Kumar",
    role: "Technical Coordinator",
    departmentOrBranch: "AIML 2 · 3rd Year",
    phone: "8074244332",
    category: "TECHNICAL",
  },
  {
    name: "S M Zunaid",
    role: "Technical Coordinator",
    departmentOrBranch: "AIML 2 · 3rd Year",
    phone: "88970 02082",
    category: "TECHNICAL",
  }
];

export const NON_TECHNICAL_COORDINATORS: CoordinatorInfo[] = [
  {
    name: "B Poojan Sai",
    role: "Non-Technical Coordinator",
    departmentOrBranch: "AIML 2 · 3rd Year",
    phone: "79893 72489",
    category: "NON_TECHNICAL",
  },
  {
    name: "S Rajkumar",
    role: "Non-Technical Coordinator",
    departmentOrBranch: "AIML 2 · 3rd Year",
    phone: "63003 45719",
    category: "NON_TECHNICAL",
  },
  {
    name: "M Muwaz",
    role: "Non-Technical Coordinator",
    departmentOrBranch: "AIML 2 · 3rd Year",
    phone: "81258 91502",
    category: "NON_TECHNICAL",
  }
];

export const CoordinatorsPage: React.FC<CoordinatorsPageProps> = ({ onStartRegistration }) => {
  return (
    <div className="min-h-screen bg-[#08080A] text-white py-10 px-3 sm:px-6 max-w-7xl mx-auto space-y-12 font-data">
      
      {/* SECTION HEADER */}
      <div className="text-center space-y-3 px-2">
        <div className="inline-flex items-center space-x-2 bg-[#14141a] border-2 border-[#00D2BE] px-4 py-1.5 rounded-full text-xs font-mono text-[#00D2BE] shadow-[0_0_20px_rgba(0,210,190,0.4)]">
          <ShieldCheck className="w-4 h-4 text-[#00D2BE] animate-pulse" />
          <span className="font-bold tracking-widest uppercase">PADDOCK CONTROL · RACE MARSHALS &amp; DIRECTORS</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-wider">
          STUDENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] via-[#F5A623] to-[#00D2BE]">COORDINATORS</span>
        </h1>

        <p className="text-xs sm:text-sm text-[#8A8A93] max-w-2xl mx-auto font-body leading-relaxed">
          Need assistance with event guidelines, UTR payment verification, rules, or grid slot allocation? Reach out directly to our Student Technical &amp; Non-Technical Coordinators.
        </p>
      </div>



      {/* 1. TECHNICAL COORDINATORS */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#22222a] pb-3">
          <div className="p-2.5 bg-[#E10600]/15 border border-[#E10600] text-[#E10600] rounded-xl">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white uppercase">TECHNICAL COORDINATORS</h2>
            <span className="text-[10px] text-[#00D2BE] font-mono font-bold">Engineering Track, Web Racing, Code Sprints &amp; Technical Queries</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TECHNICAL_COORDINATORS.map((coord, idx) => {
            const rawPhone = coord.phone.replace(/[^0-9]/g, '');
            return (
              <div
                key={idx}
                className="bg-[#111115] border-2 border-[#E10600]/60 hover:border-[#E10600] p-6 rounded-3xl space-y-4 transition-all duration-300 shadow-xl group hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-[#E10600] text-white text-[10px] font-mono font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  TECHNICAL LEAD
                </div>

                <div className="flex items-start justify-between pt-1">
                  <div>
                    <h3 className="font-display font-black text-2xl text-white group-hover:text-[#E10600] transition-colors">
                      {coord.name}
                    </h3>
                    <span className="text-xs text-[#00D2BE] font-mono font-bold block mt-0.5">{coord.role}</span>
                    <span className="text-xs text-[#8A8A93] font-mono block mt-1 bg-[#14141a] border border-[#22222a] px-2.5 py-0.5 rounded-md inline-block">
                      🎓 {coord.departmentOrBranch}
                    </span>
                  </div>
                  <span className="p-3 bg-[#E10600]/10 border border-[#E10600]/40 rounded-2xl text-[#E10600]">
                    <UserCheck className="w-6 h-6" />
                  </span>
                </div>

                <div className="pt-4 border-t border-[#22222a] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <a
                    href={`tel:+91${rawPhone}`}
                    className="flex items-center space-x-2 text-white font-bold bg-[#14141a] hover:bg-[#1f1f28] border border-[#22222a] px-3.5 py-2 rounded-xl transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#E10600]" />
                    <span>+91 {coord.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/91${rawPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-[#22C55E]/15 hover:bg-[#22C55E]/30 border border-[#22C55E]/40 text-[#22C55E] font-bold rounded-xl transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WHATSAPP</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. NON-TECHNICAL COORDINATORS */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#22222a] pb-3">
          <div className="p-2.5 bg-[#00D2BE]/15 border border-[#00D2BE] text-[#00D2BE] rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white uppercase">NON-TECHNICAL COORDINATORS</h2>
            <span className="text-[10px] text-[#F5A623] font-mono font-bold">Daytona Track, Dumb Charades, Esports &amp; Combo Packages</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NON_TECHNICAL_COORDINATORS.map((coord, idx) => {
            const rawPhone = coord.phone.replace(/[^0-9]/g, '');
            return (
              <div
                key={idx}
                className="bg-[#111115] border-2 border-[#00D2BE]/50 hover:border-[#00D2BE] p-6 rounded-3xl space-y-4 transition-all duration-300 shadow-xl group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 bg-[#00D2BE] text-[#08080A] text-[10px] font-mono font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  NON-TECH LEAD
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-black text-xl text-white group-hover:text-[#00D2BE] transition-colors">
                        {coord.name}
                      </h3>
                      <span className="text-xs text-[#F5A623] font-mono font-bold block mt-0.5">{coord.role}</span>
                    </div>
                    <span className="p-2 bg-[#00D2BE]/10 border border-[#00D2BE]/30 rounded-xl text-[#00D2BE]">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                  </div>

                  <span className="text-[11px] text-[#8A8A93] font-mono block bg-[#14141a] border border-[#22222a] px-2.5 py-1 rounded-md inline-block">
                    🎓 {coord.departmentOrBranch}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#22222a] flex items-center justify-between gap-2 text-xs font-mono">
                  <a
                    href={`tel:+91${rawPhone}`}
                    className="flex items-center space-x-1.5 text-white font-bold hover:text-[#00D2BE] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#00D2BE]" />
                    <span>+91 {coord.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/91${rawPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2.5 py-1 bg-[#22C55E]/15 hover:bg-[#22C55E]/30 border border-[#22C55E]/40 text-[#22C55E] font-bold rounded-lg transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>CHAT</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REGISTER BOTTOM CTA */}
      <div className="bg-[#14141a] border border-[#22222a] p-6 sm:p-8 rounded-3xl text-center space-y-4 shadow-2xl">
        <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase">READY TO JOIN THE DRIVER GRID?</h3>
        <p className="text-xs text-[#8A8A93] max-w-lg mx-auto">
          Lock your slot in Engineering (₹80), Daytona (₹50), or exclusive Multi-Event Combos (₹120 / ₹150) now.
        </p>

        <button
          onClick={onStartRegistration}
          className="px-8 py-3.5 bg-[#E10600] hover:bg-[#ff1a1a] text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(225,6,0,0.6)] transition-all transform hover:scale-105 cursor-pointer"
        >
          <span>START DRIVER REGISTRATION NOW →</span>
        </button>
      </div>

    </div>
  );
};
