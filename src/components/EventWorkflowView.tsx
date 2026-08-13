import React, { useState } from 'react';
import { AsciiFlagCanvas } from './AsciiFlagCanvas';
import { 
  ChevronRight, ChevronLeft, Shield, Flag, Radio, Cpu, Activity, Timer, 
  CheckCircle2, Award, Zap, Sparkles, MapPin, Calendar, Users, HelpCircle, FileText, ArrowUpRight
} from 'lucide-react';
import { EventCategory, ChampionshipType } from '../types';

interface EventWorkflowViewProps {
  onStartRegistration: (championship?: ChampionshipType, category?: EventCategory) => void;
}

export const EventWorkflowView: React.FC<EventWorkflowViewProps> = ({ onStartRegistration }) => {
  const [activeFlowStep, setActiveFlowStep] = useState(0);

  const flowSteps = [
    {
      step: 1,
      title: "DRIVER REGISTRATION & UTR DEPOSIT",
      subtitle: "QUALIFYING ENTRY OPEN",
      location: "ONLINE PADDOCK PORTAL",
      championship: "ENGINEERING CHAMPIONSHIP" as ChampionshipType,
      category: "POLE POSITION CHALLENGE (Coding)" as EventCategory,
      description: "Select Engineering Championship (₹80) or Daytona Championship (₹50), fill team telemetry, and submit your 12-digit UTR deposit.",
      actionNote: "Race Control verifies UTR within 2-4 hours and issues your Official FIA Paddock Pass.",
      bgImage: "/images/flow_stage_1.png"
    },
    {
      step: 2,
      title: "FIA TELEMETRY VERIFICATION",
      subtitle: "RACE CONTROL AUDIT",
      location: "MONZA DATA CENTER",
      championship: "ENGINEERING CHAMPIONSHIP" as ChampionshipType,
      category: "PIT STRATEGY (Prompting)" as EventCategory,
      description: "Automated engine checks verify UTR transaction status, driver squad rules, and payment hash integrity.",
      actionNote: "Check your Status Page using Entry ID to see live PENDING -> VERIFIED state.",
      bgImage: "/images/flow_stage_2.png"
    },
    {
      step: 3,
      title: "DRIVER NUMBER & E-PASS ISSUANCE",
      subtitle: "PADDOCK LICENSE ACTIVATION",
      location: "PIT LANE ACCREDITATION",
      championship: "ENGINEERING CHAMPIONSHIP" as ChampionshipType,
      category: "CONSTRUCTORS GARAGE (Hackathon)" as EventCategory,
      description: "Upon approval, Race Control assigns your Official Driver Number (e.g. #042) and generates your 3D Metallic Holo E-Pass with QR code.",
      actionNote: "Download your PDF E-Pass or screenshot your QR Code for venue entry authentication.",
      bgImage: "/images/flow_stage_3.png"
    },
    {
      step: 4,
      title: "DAY 1: MARCH 19 TECHNICAL QUALIFYING",
      subtitle: "POLE POSITION & PROMPTS",
      location: "MONZA CIRCUIT MAIN STAGE",
      championship: "ENGINEERING CHAMPIONSHIP" as ChampionshipType,
      category: "POLE POSITION CHALLENGE (Coding)" as EventCategory,
      description: "March 19, 2026: Engineering Championship drivers battle in Pole Position Challenge (Coding), Pit Strategy (Prompting), & Constructors Garage.",
      actionNote: "Report to Pit Bay 01 at 09:00 AM sharp with your FIA E-Pass QR code scanned at turnstiles.",
      bgImage: "/images/flow_stage_4.png"
    },
    {
      step: 5,
      title: "DAY 2: MARCH 20 DAYTONA CHAMPIONSHIP",
      subtitle: "PADDOCK SPEED & CHARADES",
      location: "DAYTONA HIGH-SPEED ARENA",
      championship: "DAYTONA CHAMPIONSHIP" as ChampionshipType,
      category: "RADIO COMMUNICATION (Dumb Charades)" as EventCategory,
      description: "March 20, 2026: Daytona Championship teams compete in Radio Communication, Lights Out 1-sec movie guess, Pit Stop & Telemetry Typing tests.",
      actionNote: "All teams receive pit strategy updates 15 minutes prior to session green flag.",
      bgImage: "/images/flow_stage_5.png"
    },
    {
      step: 6,
      title: "CHAMPIONSHIP FINALS & HACKATHON DEMO",
      subtitle: "CONSTRUCTORS FINAL SHOWDOWN",
      location: "MAIN GRANDSTAND AUDITORIUM",
      championship: "ENGINEERING CHAMPIONSHIP" as ChampionshipType,
      category: "CONSTRUCTORS GARAGE (Hackathon)" as EventCategory,
      description: "Top qualifying teams present live working prototypes to senior F1 AI judges and tech industry constructors.",
      actionNote: "Judges evaluate telemetry speed, AI prompt accuracy, construct quality, and presentation.",
      bgImage: "/images/flow_stage_6.png"
    },
    {
      step: 7,
      title: "MONZA PODIUM CEREMONY & TROPHIES",
      subtitle: "VICTORY LAP & CASH PRIZES",
      location: "PODIUM TOWER MONZA",
      championship: "DAYTONA CHAMPIONSHIP" as ChampionshipType,
      category: "LIGHTS OUT (1-Sec Movie Guess)" as EventCategory,
      description: "Champions take the podium to receive Official FIA Trophies, cash prize allocations, certificates, and glory.",
      actionNote: "All registered participants receive official digital FIA telemetry certificates.",
      bgImage: "/images/flow_stage_7.png"
    },
    {
      step: 8,
      title: "POST-RACE GALA & NETWORKING",
      subtitle: "CHAMPIONSHIP AFTER-PARTY",
      location: "PADDOCK CLUB LOUNGE",
      championship: "DAYTONA CHAMPIONSHIP" as ChampionshipType,
      category: "TELEMETRY TYPING (Speed Test)" as EventCategory,
      description: "Celebrate with drivers, sponsors, tech leaders, and organizers at the official Formula-AI Gala Dinner & DJ Session.",
      actionNote: "Exclusive access badge required (Included in all valid registration passes).",
      bgImage: "/images/flow_stage_8.png"
    }
  ];

  const activeStepData = flowSteps[activeFlowStep];

  const handleNextStep = () => {
    setActiveFlowStep(prev => (prev < flowSteps.length - 1 ? prev + 1 : 0));
  };

  const handlePrevStep = () => {
    setActiveFlowStep(prev => (prev > 0 ? prev - 1 : flowSteps.length - 1));
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-white font-data relative select-none pb-24 overflow-hidden">
      
      {/* Background Ambient Radial Halos & Grid Radar */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="w-full h-full bg-[radial-gradient(#00D2BE_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      {/* Ambient Radial Glowing Neon Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[#00D2BE]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-[#E10600]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO HEADER WITH OVERLAPPING F1 TYPOGRAPHY & TIMELINE BAR */}
      {/* ========================================================================= */}
      <section className="pt-12 sm:pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-center space-y-6">
        
        {/* Broadcast Status Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#00D2BE]/50 px-4 py-1.5 rounded-full text-xs font-mono text-[#00D2BE] shadow-[0_0_20px_rgba(0,210,190,0.3)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D2BE] animate-ping" />
            <span>MONZA CIRCUIT · 8 SECTORS LIVE</span>
          </div>
          <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#E10600]/50 px-4 py-1.5 rounded-full text-xs font-mono text-[#E10600] shadow-[0_0_20px_rgba(225,6,0,0.3)]">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#E10600]" />
            <span>RACE CONTROL MASTER EVENT FLOW</span>
          </div>
        </div>

        {/* MASSIVE F1 HERO DISPLAY HEADLINE */}
        <div className="space-y-1 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 -top-8 select-none">
            <span className="font-display text-8xl sm:text-[180px] font-black uppercase text-white tracking-widest">
              FORMULA-AI
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-9xl font-black uppercase tracking-tight leading-[0.9] text-white drop-shadow-2xl">
            GRAND PRIX <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D2BE] to-white">
              EVENT WORKFLOW
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#8A8A93] max-w-2xl mx-auto leading-relaxed pt-3">
            Explore the complete 8-sector race schedule, qualifying stage directives, pit lane accreditation rules, and live track telemetry.
          </p>
        </div>

        {/* Interactive 8-Stage F1 Race Track Node Stepper Timeline */}
        <div className="pt-4 max-w-5xl mx-auto overflow-x-auto pb-4">
          <div className="flex items-center justify-between min-w-[720px] relative px-6">
            
            {/* Connecting Track Line */}
            <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-[#1f1f28] z-0" />
            <div 
              className="absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#00D2BE] via-[#22C55E] to-[#00D2BE] transition-all duration-500 z-0 shadow-[0_0_15px_#00D2BE]"
              style={{ width: `${(activeFlowStep / (flowSteps.length - 1)) * 88}%` }}
            />

            {flowSteps.map((step, idx) => {
              const isActive = activeFlowStep === idx;
              const isPassed = activeFlowStep > idx;

              return (
                <button
                  key={step.step}
                  onClick={() => setActiveFlowStep(idx)}
                  className={`relative z-10 flex flex-col items-center group transition-all duration-300 ${
                    isActive ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-black text-xs border-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#00D2BE] border-[#00D2BE] text-[#08080A] shadow-[0_0_30px_rgba(0,210,190,0.9)] scale-110'
                      : isPassed
                      ? 'bg-[#14141a] border-[#22C55E] text-[#22C55E]'
                      : 'bg-[#08080A] border-[#22222a] text-[#8A8A93] group-hover:border-white group-hover:text-white'
                  }`}>
                    0{step.step}
                  </div>

                  <span className={`text-[9px] font-mono font-bold mt-2 uppercase transition-colors max-w-[75px] truncate text-center ${
                    isActive ? 'text-[#00D2BE]' : 'text-[#8A8A93]'
                  }`}>
                    STAGE 0{step.step}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: HIGH-OCTANE SPLIT COCKPIT HUD SHOWCASE */}
      {/* ========================================================================= */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0b0b0e] border-2 border-[#22222a] p-6 sm:p-12 rounded-[36px] shadow-2xl relative overflow-hidden font-data">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D2BE]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E10600]/10 rounded-full blur-3xl pointer-events-none" />

          {/* LEFT COLUMN: ACTIVE STAGE DIRECTIVES */}
          <div className="lg:col-span-7 space-y-6 relative z-10">
            
            <div className="flex items-center justify-between border-b border-[#22222a] pb-3 text-xs font-mono">
              <span className="text-[#00D2BE] font-bold flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D2BE] animate-ping" />
                <span>SECTOR 0{activeStepData.step} OF 08 · {activeStepData.subtitle}</span>
              </span>
              <span className="text-[#F5A623] font-bold">{activeStepData.location}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-[#8A8A93] uppercase tracking-widest block">
                ACTIVE CHAMPIONSHIP SECTOR
              </span>
              
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight">
                STAGE 0{activeStepData.step}: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D2BE] to-white">
                  {activeStepData.title}
                </span>
              </h2>
            </div>

            <p className="font-body text-xs sm:text-sm text-[#8A8A93] leading-relaxed">
              {activeStepData.description}
            </p>

            <div className="bg-[#14141a] border-2 border-[#00D2BE]/40 p-4 rounded-2xl text-xs space-y-1.5 shadow-xl">
              <div className="flex items-center space-x-2 text-[#00D2BE] font-mono font-bold text-[11px] uppercase">
                <Shield className="w-4 h-4 text-[#00D2BE]" />
                <span>RACE CONTROL MANDATORY DIRECTIVE:</span>
              </div>
              <p className="text-white text-xs leading-relaxed">{activeStepData.actionNote}</p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevStep}
                  className="p-3 bg-[#14141a] hover:bg-[#1f1f28] text-white border border-[#22222a] hover:border-[#00D2BE] rounded-xl transition-all"
                  title="Previous Stage"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-5 py-3 bg-[#14141a] hover:bg-[#1f1f28] text-white border border-[#22222a] hover:border-[#00D2BE] font-mono text-xs font-bold rounded-xl transition-all flex items-center space-x-2"
                >
                  <span>NEXT STAGE</span>
                  <ChevronRight className="w-4 h-4 text-[#00D2BE]" />
                </button>
              </div>

              <button
                onClick={() => onStartRegistration(activeStepData.championship, activeStepData.category)}
                className="px-8 py-3.5 bg-gradient-to-r from-[#22C55E] via-[#16a34a] to-[#22C55E] text-[#08080A] font-display text-xs font-black uppercase tracking-wider transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.8)] hover:scale-105 border border-white/60"
              >
                REGISTER DRIVER FOR THIS STAGE →
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: MONZA LIVE STAGE MONITOR */}
          <div className="lg:col-span-5 relative z-10 flex items-center justify-center">
            <div className="w-full h-full min-h-[440px] border-2 border-[#22C55E] rounded-3xl bg-[#08080A] p-4 shadow-[0_0_50px_rgba(34,197,94,0.4)] relative overflow-hidden flex flex-col justify-between">
              
              <div className="flex items-center justify-between z-20 border-b border-[#22222a] pb-2.5">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-[#22C55E]">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                  <span>MONZA CAM 0{activeStepData.step} · LIVE FEED</span>
                </div>
                <span className="text-[10px] font-mono text-[#F5A623] font-bold">{activeStepData.location}</span>
              </div>

              <div className="absolute inset-0 z-0 opacity-40">
                <AsciiFlagCanvas stageIndex={activeFlowStep} />
              </div>

              <div className="relative z-10 my-auto border-2 border-[#22C55E] rounded-2xl overflow-hidden shadow-2xl group bg-[#0b0b0e]">
                <img 
                  src={activeStepData.bgImage} 
                  alt={`Stage ${activeStepData.step} Monza Telemetry`} 
                  className="w-full h-[230px] sm:h-[270px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-[#08080A]/95 border border-[#22C55E] px-4 py-2 text-xs font-mono text-white rounded-xl shadow-2xl backdrop-blur-md">
                  <span className="text-[#22C55E] font-bold truncate">STAGE 0{activeStepData.step}: {activeStepData.title}</span>
                  <span className="text-[10px] text-[#F5A623] font-bold">LIVE MONZA</span>
                </div>
              </div>

              <div className="relative z-20 text-[10px] font-mono text-[#8A8A93] text-center pt-2.5 border-t border-[#22222a] flex justify-between items-center">
                <span>RACE CONTROL MONITOR</span>
                <span className="text-[#22C55E] font-bold">● SIGNAL OK</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: COMPLETE 8-SECTOR GRAND PRIX GRID MATRIX CARDS */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 space-y-8">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#00D2BE]/40 px-3.5 py-1 rounded-full text-xs font-mono text-[#00D2BE]">
            <Zap className="w-3.5 h-3.5 text-[#00D2BE]" />
            <span>ALL 8 STAGES MASTER CATALOGUE</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-wider">
            CHAMPIONSHIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D2BE] to-white">SECTOR MATRIX</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8A93] max-w-xl mx-auto">
            Click any sector card below to inspect telemetry details or register your driver squad for that specific qualifying stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flowSteps.map((s, idx) => {
            const isCurrent = activeFlowStep === idx;
            return (
              <div
                key={s.step}
                onClick={() => setActiveFlowStep(idx)}
                className={`bg-[#0b0b0e] border-2 rounded-2xl p-5 space-y-4 cursor-pointer transition-all duration-300 relative group overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#00D2BE] shadow-[0_0_30px_rgba(0,210,190,0.4)] scale-105 bg-[#111118]'
                    : 'border-[#22222a] hover:border-white/50 hover:bg-[#111115]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={`px-2.5 py-0.5 rounded-md font-black ${
                      isCurrent ? 'bg-[#00D2BE] text-[#08080A]' : 'bg-[#14141a] text-[#8A8A93]'
                    }`}>
                      SECTOR 0{s.step}
                    </span>
                    <span className="text-[#F5A623] text-[10px] font-bold">{s.location}</span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white uppercase group-hover:text-[#00D2BE] transition-colors leading-snug">
                    {s.title}
                  </h3>

                  <p className="text-[11px] text-[#8A8A93] leading-relaxed line-clamp-3">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#22222a] flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-[#00D2BE] font-bold uppercase">{s.subtitle}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartRegistration(s.championship, s.category);
                    }}
                    className="p-1.5 bg-[#00D2BE]/20 text-[#00D2BE] hover:bg-[#00D2BE] hover:text-[#08080A] rounded-lg transition-colors"
                    title="Register for this Stage"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: MONZA CIRCUIT GRAND PRIX SCHEDULE & TIMELINE */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 bg-[#0b0b0e] border-2 border-[#22222a] rounded-[36px] p-6 sm:p-12 space-y-8 shadow-2xl">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#22222a] pb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#F5A623]">
              <Calendar className="w-4 h-4 text-[#F5A623]" />
              <span>OFFICIAL MONZA EVENT SCHEDULE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white uppercase tracking-wider mt-1">
              GRAND PRIX RACE CALENDAR
            </h2>
          </div>
          <span className="bg-[#F5A623]/20 text-[#F5A623] px-3.5 py-1 font-mono font-bold rounded-lg text-xs border border-[#F5A623]/40">
            MARCH 19 – 20, 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Day 1 Timeline Card */}
          <div className="bg-[#14141a] border border-[#22222a] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#22222a] pb-3">
              <span className="bg-[#E10600] text-white font-mono font-bold text-xs px-3 py-1 rounded-full uppercase">
                DAY 1: MARCH 19, 2026
              </span>
              <span className="text-xs font-mono text-[#00D2BE]">ENGINEERING CHAMPIONSHIP</span>
            </div>

            <ul className="space-y-3 font-mono text-xs text-[#8A8A93]">
              <li className="flex items-start space-x-2">
                <span className="text-[#00D2BE] font-bold flex-shrink-0">09:00 AM —</span>
                <span>Paddock Turnstile Registration &amp; E-Pass Scanning Gate 01</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#00D2BE] font-bold flex-shrink-0">10:30 AM —</span>
                <span>Pole Position Challenge (Coding &amp; Algorithms Test)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#00D2BE] font-bold flex-shrink-0">02:00 PM —</span>
                <span>Pit Strategy Challenge (Prompt Engineering &amp; AI Directives)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#00D2BE] font-bold flex-shrink-0">04:30 PM —</span>
                <span>Constructors Garage Hackathon Prototype Presentation</span>
              </li>
            </ul>
          </div>

          {/* Day 2 Timeline Card */}
          <div className="bg-[#14141a] border border-[#22222a] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#22222a] pb-3">
              <span className="bg-[#00D2BE] text-[#08080A] font-mono font-bold text-xs px-3 py-1 rounded-full uppercase">
                DAY 2: MARCH 20, 2026
              </span>
              <span className="text-xs font-mono text-[#F5A623]">DAYTONA CHAMPIONSHIP</span>
            </div>

            <ul className="space-y-3 font-mono text-xs text-[#8A8A93]">
              <li className="flex items-start space-x-2">
                <span className="text-[#F5A623] font-bold flex-shrink-0">09:30 AM —</span>
                <span>Radio Communication (Dumb Charades &amp; Gestures)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#F5A623] font-bold flex-shrink-0">11:30 AM —</span>
                <span>Lights Out (1-Second Movie Scene Speed Guess)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#F5A623] font-bold flex-shrink-0">02:30 PM —</span>
                <span>Pit Stop Task (Tyre &amp; Bottle Relay Speed Challenge)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#F5A623] font-bold flex-shrink-0">05:00 PM —</span>
                <span>Podium Victory Ceremony &amp; Trophy Allocations</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

    </div>
  );
};


