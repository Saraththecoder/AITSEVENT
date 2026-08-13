import React, { useState, useEffect } from 'react';
import { AsciiFlagCanvas } from './AsciiFlagCanvas';
import { 
  ChevronRight, Calendar, MapPin, Gauge, Shield, Cpu, Activity, Trophy, 
  Sparkles, Layers, Zap, Clock, CheckCircle2, ArrowRight, Code, Brain, Wrench, Radio, Film, Timer, Disc, Keyboard, Award, X, Check,
  UserCheck, Users, Flag, PlayCircle, Star, Search, Flame, RadioTower, ShieldCheck, CornerUpRight
} from 'lucide-react';

import { ChampionshipType, EventCategory } from '../types';

interface LandingHeroProps {
  onStartRegistration: (championship?: ChampionshipType, category?: EventCategory) => void;
}

interface EventDetail {
  id: string;
  name: string;
  subTitle: string;
  championship: ChampionshipType;
  categoryName: EventCategory;
  fee: number;
  teamSize: string;
  duration?: string;
  description: string;
  rules: string[];
  evaluation: string[];
  trophy: string;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartRegistration }) => {
  const [activeModalEvent, setActiveModalEvent] = useState<EventDetail | null>(null);
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0);
  const [startLightsCount, setStartLightsCount] = useState<number>(5);

  // Animated start lights sequence
  useEffect(() => {
    const timer = setInterval(() => {
      setStartLightsCount(prev => (prev < 5 ? prev + 1 : 0));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const flowSteps = [
    {
      step: '01',
      title: 'Driver Registration',
      subtitle: 'STAGE 1 ENTRY',
      icon: UserCheck,
      color: '#E10600',
      location: 'Online Portal',
      bgImage: '/images/flow_stage_1.png',
      description: 'Select Engineering (₹80) or Daytona (₹50) track, enter driver callsign & submit UTR deposit.',
      actionNote: 'Immediate FA26 Driver ID generated. Verification by Race Control.'
    },
    {
      step: '02',
      title: 'Team Formation',
      subtitle: 'DRIVER ROSTER',
      icon: Users,
      color: '#00D2BE',
      location: 'Paddock Hub',
      bgImage: '/images/flow_stage_2.png',
      description: 'Assemble 2 to 4 driver team members or enter as independent solo driver.',
      actionNote: 'Team callsing and roster logged with FIA Officials.'
    },
    {
      step: '03',
      title: 'Garage Allocation',
      subtitle: 'PADDOCK BOX',
      icon: Wrench,
      color: '#F5A623',
      location: 'Pit Building',
      bgImage: '/images/flow_stage_3.png',
      description: 'Receive dedicated pit garage bay assignment and server telemetry keys.',
      actionNote: 'Server credentials & terminal channels issued.'
    },
    {
      step: '04',
      title: 'Opening Ceremony',
      subtitle: 'GRID BRIEFING',
      icon: Sparkles,
      color: '#E10600',
      location: 'Grandstand Auditorium',
      bgImage: '/images/flow_stage_4.png',
      description: 'Official driver briefing on competition rules, scoring guidelines & trophy unveil.',
      actionNote: 'Grid safety protocol and championship declaration.'
    },
    {
      step: '05',
      title: 'Race Starts',
      subtitle: 'LIGHTS OUT',
      icon: Flag,
      color: '#00D2BE',
      location: 'Start Straight',
      bgImage: '/images/flow_stage_5.png',
      description: '5 red lights extinguish! All coding, hackathon & Daytona arenas unlock live.',
      actionNote: 'Live telemetry clocks start timing driver performance.'
    },
    {
      step: '06',
      title: 'Qualification',
      subtitle: 'TIME TRIALS',
      icon: Gauge,
      color: '#F5A623',
      location: 'Telemetry Wall',
      bgImage: '/images/flow_stage_6.png',
      description: 'Real-time evaluation of execution speed, accuracy, and prompt precision.',
      actionNote: 'Live leaderboards updated instantly on pit monitors.'
    },
    {
      step: '07',
      title: 'Podium Ceremony',
      subtitle: 'VICTORY STAND',
      icon: Trophy,
      color: '#E10600',
      location: 'FIA Podium',
      bgImage: '/images/flow_stage_7.png',
      description: 'Top 3 performing drivers step onto the victory podium to receive Gold Trophies & Medals.',
      actionNote: 'Official trophy presentation by faculty dignitaries.'
    },
    {
      step: '08',
      title: 'Champion Celebration',
      subtitle: 'PADDOCK GALA',
      icon: Award,
      color: '#00D2BE',
      location: 'Paddock Club',
      bgImage: '/images/flow_stage_8.png',
      description: 'Grand celebration honoring overall championship winners & high-speed coders.',
      actionNote: 'Networking, photo sessions & championship finale.'
    }
  ];


  const eventDetailsList: EventDetail[] = [
    {
      id: 'pole-position',
      name: 'POLE POSITION CHALLENGE',
      subTitle: 'Coding Competition',
      championship: 'ENGINEERING CHAMPIONSHIP',
      categoryName: 'POLE POSITION CHALLENGE (Coding)',
      fee: 80,
      teamSize: 'Maximum 4 Drivers',
      description: 'Test your coding speed, logical thinking, debugging ability and problem-solving skills through multiple qualifying rounds.',
      rules: [
        'Round 01 Easy Level: 3 Problems · 10 Marks each',
        'Round 02 Medium Level: 2 Problems · 15 Marks each',
        'Round 03 Hard Level: 1 Final Challenge · 40 Marks'
      ],
      evaluation: ['Accuracy', 'Execution Speed', 'Code Optimization', 'Total Score'],
      trophy: '🏆 Pole Position Champion Trophy'
    },
    {
      id: 'pit-strategy',
      name: 'PIT STRATEGY CHALLENGE',
      subTitle: 'Prompt Engineering Competition',
      championship: 'ENGINEERING CHAMPIONSHIP',
      categoryName: 'PIT STRATEGY CHALLENGE (Prompt Engineering)',
      fee: 80,
      teamSize: 'Individual Driver',
      duration: '1 Hour',
      description: 'Get a real-world AI problem statement and craft the most effective prompt to solve it within 1 hour.',
      rules: [
        'Single 1-hour time trial challenge.',
        'Drivers are provided with a complex domain problem statement.',
        'Craft structured prompts to elicit optimal AI model outputs.'
      ],
      evaluation: ['Creativity', 'Prompt Structure', 'AI Understanding', 'Solution Quality'],
      trophy: '🏆 Strategy Master Trophy'
    },
    {
      id: 'constructors-garage',
      name: 'CONSTRUCTORS GARAGE',
      subTitle: 'Hackathon',
      championship: 'ENGINEERING CHAMPIONSHIP',
      categoryName: 'CONSTRUCTORS GARAGE (Hackathon)',
      fee: 80,
      teamSize: 'Maximum 4 Drivers',
      description: 'Build a working prototype for a given problem statement across 3 structured stages.',
      rules: [
        'Stage 1: Blueprint Planning (Problem Analysis, Solution Architecture, Workflow)',
        'Stage 2: Prototype Development (Build the complete working solution)',
        'Stage 3: Race Presentation (Present before F1 Officials & Judges)'
      ],
      evaluation: ['Innovation', 'Creativity', 'Prototype', 'Presentation', 'Teamwork'],
      trophy: '🏆 Constructors Championship Trophy'
    },
    {
      id: 'radio-comm',
      name: 'RADIO COMMUNICATION',
      subTitle: 'Dumb Charades',
      championship: 'DAYTONA CHAMPIONSHIP',
      categoryName: 'RADIO COMMUNICATION (Dumb Charades)',
      fee: 50,
      teamSize: '1–4 Drivers',
      description: 'One driver acts like a Formula One engineer communicating through radio signals. Teammates decode the hidden move.',
      rules: [
        'No speaking allowed during transmission.',
        'Only body language and hand gesture signals permitted.',
        'Fastest correct answer earns highest telemetry points.'
      ],
      evaluation: ['Speed', 'Accuracy', 'Signal Decoding'],
      trophy: '🏆 Daytona Champions Trophy & Medals'
    },
    {
      id: 'lights-out',
      name: 'LIGHTS OUT!',
      subTitle: 'Guess the Movie in One Second',
      championship: 'DAYTONA CHAMPIONSHIP',
      categoryName: 'LIGHTS OUT! (Guess Movie in 1 Sec)',
      fee: 50,
      teamSize: '1–3 Drivers',
      description: 'A one-second movie clip will be displayed. Drivers must identify the movie before other teams.',
      rules: [
        'Movie clip duration is strictly 1.0 second.',
        'Buzzer reaction time shootout.',
        'Instant scoring for fastest accurate identification.'
      ],
      evaluation: ['Speed', 'Accuracy'],
      trophy: '🏆 Daytona Champions Trophy & Medals'
    },
    {
      id: 'pit-stop',
      name: 'PIT STOP CHALLENGE',
      subTitle: 'Minute to Win It',
      championship: 'DAYTONA CHAMPIONSHIP',
      categoryName: 'PIT STOP CHALLENGE (Minute to Win It)',
      fee: 50,
      teamSize: '1–3 Drivers',
      description: 'Complete exciting one-minute tasks inspired by F1 pit stops.',
      rules: [
        'Countdown timer is strictly 60 seconds.',
        'All team members must coordinate under high-pressure timing.',
        'F1 pit stop precision handoffs required.'
      ],
      evaluation: ['Time', 'Coordination', 'Accuracy'],
      trophy: '🏆 Daytona Champions Trophy & Medals'
    },
    {
      id: 'tyre-change',
      name: 'TYRE CHANGE CHALLENGE',
      subTitle: 'Bottle Challenge',
      championship: 'DAYTONA CHAMPIONSHIP',
      categoryName: 'TYRE CHANGE CHALLENGE (Bottle Challenge)',
      fee: 50,
      teamSize: '1–4 Drivers',
      description: 'A teamwork challenge inspired by F1 tyre changes. Complete the task in the shortest time.',
      rules: [
        'Sequential station handoffs.',
        'Precision placement under stopwatch timing.',
        'Penalties added for drops or misalignments.'
      ],
      evaluation: ['Speed', 'Team Coordination', 'Accuracy'],
      trophy: '🏆 Daytona Champions Trophy & Medals'
    },
    {
      id: 'telemetry-test',
      name: 'TELEMETRY TEST',
      subTitle: 'Typing Competition',
      championship: 'DAYTONA CHAMPIONSHIP',
      categoryName: 'TELEMETRY TEST (Typing Competition)',
      fee: 50,
      teamSize: 'Individual / Team',
      description: 'Type the displayed text as accurately and quickly as possible, just like live telemetry data streams.',
      rules: [
        'Real-time live telemetry stream text strings.',
        'Words Per Minute (WPM) calculation.',
        'Accuracy percentage multiplier.'
      ],
      evaluation: ['Words Per Minute (WPM)', 'Accuracy'],
      trophy: '🏆 Daytona Champions Trophy & Medals'
    }
  ];

  const activeStepData = flowSteps[activeFlowStep];
  const StepIcon = activeStepData.icon;

  return (
    <div className="relative bg-[#08080A] text-white selection:bg-[#E10600]">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH USER'S D:\MARRIAGE\CARRR.PNG & FORMULA-AI CONTENT */}
      {/* ========================================================================= */}

      <section className="relative py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#22222a]">
        
        {/* Dark Matte Outer Container with Rounded Corners & Zoom-In Effect */}
        <div className="bg-[#0b0b0e] border-2 border-[#22222a] rounded-[32px] p-6 sm:p-12 relative overflow-hidden shadow-2xl min-h-[85vh] flex flex-col justify-between animate-hero-zoom group hover:scale-[1.01] transition-transform duration-700 ease-out">

          {/* Top Marquee Bar with Ultra-Unique March 19th & 20th Event Date HUD */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between font-data text-xs border-b border-[#1f1f28] pb-4 z-20 gap-3">

            <div className="flex items-center space-x-2 text-[#E10600] font-bold">
              <span>&gt;== FORMULA-AI 2026</span>
              <span className="text-[#8A8A93]">|</span>
              <span className="text-white">NATIONAL CHAMPIONSHIP</span>
            </div>

            {/* Ultra-Unique F1 2-Day Race Date Pill */}
            <div className="flex items-center space-x-3 bg-[#14141a] border-2 border-[#E10600] px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(225,6,0,0.5)]">
              <Calendar className="w-4 h-4 text-[#00D2BE] animate-pulse" />
              <span className="text-[#8A8A93] font-mono text-[10px]">RACE WEEKEND:</span>
              <span className="text-white font-mono font-bold text-xs tracking-wider">
                MARCH <strong className="text-[#E10600]">19TH</strong> &amp; <strong className="text-[#00D2BE]">20TH</strong>, 2026
              </span>
            </div>
          </div>

          {/* CENTER STAGE: FLOATING KINETIC TYPOGRAPHY GRID & ROTATING CARRR.PNG */}
          <div className="relative my-auto py-8 sm:py-16 flex items-center justify-center">
            
            {/* Ambient Background Radial Halos */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] bg-[#E10600]/15 rounded-full blur-[150px] animate-pulse-glow" />
              <div className="w-[400px] h-[400px] bg-[#00D2BE]/10 rounded-full blur-[130px] pointer-events-none" />
            </div>

            {/* Kinetic Typography Grid (FORMULA-AI 2026 GRAND PRIX Content) */}
            <div className="w-full relative text-white font-display font-black tracking-tighter uppercase select-none z-10 leading-none space-y-2 sm:space-y-4">
              
              {/* Row 1: FORMULA ... AI */}
              <div className="flex justify-between items-baseline">
                <span className="text-5xl sm:text-7xl lg:text-9xl text-white opacity-95">FORMULA</span>
                <span className="text-5xl sm:text-7xl lg:text-9xl text-[#E10600] opacity-95">AI</span>
              </div>

              {/* Row 2: 2026 GRAND PRIX */}
              <div className="flex justify-center items-center py-2 sm:py-4">
                <span className="text-6xl sm:text-8xl lg:text-[11rem] text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] via-white to-[#00D2BE] tracking-widest drop-shadow-2xl animate-text-shine">
                  2026
                </span>
              </div>

              {/* Row 3: GRAND ... PRIX */}
              <div className="flex justify-between items-center">
                <span className="text-5xl sm:text-7xl lg:text-9xl text-white">GRAND</span>
                
                {/* Tagline Subtitle & Event Dates on right side */}
                <div className="hidden lg:block max-w-xs text-[10px] font-data text-[#8A8A93] normal-case tracking-normal leading-relaxed text-right border-r-2 border-[#E10600] pr-3">
                  <span className="text-[#00D2BE] font-mono font-bold block uppercase text-xs">🏁 MARCH 19 &amp; 20, 2026</span>
                  <span className="text-white font-bold block">"MORE THAN A FEST. A CHAMPIONSHIP."</span>
                  Compete across 8 technical &amp; non-technical events.
                </div>

                <span className="text-5xl sm:text-7xl lg:text-9xl text-[#00D2BE]">PRIX</span>
              </div>

              {/* Row 4: ENGINEERING CHAMPIONSHIP */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-4xl sm:text-6xl lg:text-8xl text-white">ENGINEERING</span>
                <span className="text-4xl sm:text-6xl lg:text-8xl text-[#F5A623]">DAYTONA</span>
              </div>

            </div>

            {/* CENTER HIGH-OCTANE F1 CAR ASSET WITH AERODYNAMIC SUSPENSION FLOAT & NITRO LASER EFFECTS */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto">
              <div className="w-[280px] sm:w-[440px] lg:w-[600px] h-[280px] sm:h-[440px] lg:h-[600px] relative flex items-center justify-center animate-car-float">
                
                {/* Nitro Laser Afterburner & Speed Trail Floor Halos */}
                <div className="absolute bottom-4 w-4/5 h-8 bg-gradient-to-r from-[#E10600] via-[#00D2BE] to-[#E10600] rounded-full blur-2xl opacity-80 animate-pulse pointer-events-none" />
                <div className="absolute bottom-2 w-2/3 h-4 bg-[#00D2BE] rounded-full blur-lg opacity-60 animate-ping pointer-events-none" />

                {/* High-Resolution F1 Car Image with Turbo Hover Lift & Neon Shadow */}
                <div className="w-full h-full flex items-center justify-center cursor-pointer group">
                  <img 
                    src="/images/carrr.png" 
                    alt="Formula 1 Racing Championship Car" 
                    className="w-full h-auto object-contain max-h-[460px] drop-shadow-[0_25px_45px_rgba(225,6,0,0.7)] group-hover:drop-shadow-[0_35px_65px_rgba(0,210,190,0.9)] transform group-hover:scale-110 group-hover:-rotate-1 group-hover:-translate-y-2 transition-all duration-500 ease-out"
                  />
                </div>

                {/* Aero Telemetry Badge on Hover */}
                <div className="absolute top-2 right-4 bg-[#08080A]/90 border border-[#00D2BE] px-3 py-1 text-[10px] font-data text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
                  <span className="text-[#00D2BE] font-bold block">AERODYNAMIC DOWNFORCE ACTIVE</span>
                  <span className="text-[9px] text-[#8A8A93]">352.4 KM/H · MONZA STRAIGHT</span>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Championship Action Footer */}
          <div className="border-t border-[#1f1f28] pt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 z-20 font-data">
            
            {/* Tagline / Track Badge */}
            <div className="flex items-center space-x-3 text-xs text-[#8A8A93] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00D2BE] animate-ping" />
              <span>FORMULA-AI 2026 OFFICIAL NATIONAL CHAMPIONSHIPS</span>
            </div>

            {/* Main Primary Registration Button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onStartRegistration()}
                className="group relative inline-flex items-center justify-center bg-[#E10600] hover:bg-[#ff1a1a] text-white px-7 py-3.5 font-display text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(225,6,0,0.6)] hover:shadow-[0_0_45px_rgba(0,210,190,0.8)] border border-white/80 overflow-hidden transform hover:-translate-y-0.5"
              >
                {/* Nitro Speed Light Trail */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D2BE]/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                <div className="relative z-10 flex items-center space-x-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00D2BE] animate-ping" />
                  <span>REGISTER DRIVER NOW</span>
                  <ChevronRight className="w-4 h-4 text-[#00D2BE] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <a
                href="#events"
                className="hidden sm:inline-flex items-center justify-center bg-[#14141a] hover:bg-[#1f1f28] text-white border border-[#22222a] hover:border-[#00D2BE] px-5 py-3.5 font-display text-xs font-bold tracking-wider transition-all uppercase rounded-xl"
              >
                EXPLORE 8 EVENTS
              </a>
            </div>

          </div>

        </div>

      </section>



      {/* ========================================================================= */}
      {/* 2. TECHNICAL & NON-TECHNICAL EVENT CATEGORIES */}
      {/* ========================================================================= */}
      <section id="events" className="py-12 sm:py-20 px-3 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-12 overflow-hidden">
        
        <div className="text-center space-y-2 sm:space-y-3 px-2">
          <div className="text-[10px] sm:text-xs font-mono text-[#E10600] uppercase font-bold tracking-widest flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00D2BE] animate-ping" />
            <span>CLICK ANY EVENT TO VIEW FULL DIRECTIVES &amp; RULES</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-6xl font-bold uppercase text-white tracking-wider break-words">
            EXPLORE THE COMPETITIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 font-data">
          
          {/* LEFT: ENGINEERING CHAMPIONSHIP */}
          <div className="bg-[#111115] border-2 border-[#E10600]/60 p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl rounded-2xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#22222a] pb-4">
              <div>
                <span className="text-[10px] text-[#E10600] font-mono font-bold uppercase tracking-wider block">TECHNICAL TRACK</span>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase mt-0.5">ENGINEERING CHAMPIONSHIP</h3>
              </div>
              <div className="self-start sm:self-auto bg-[#08080A] border border-[#E10600] px-3.5 py-1.5 shadow-lg rounded-xl">
                <span className="text-xl sm:text-2xl font-black text-white font-display">₹80</span>
                <span className="text-[9px] sm:text-[10px] text-[#8A8A93] block font-mono">per Driver</span>
              </div>
            </div>

            {/* Event 1 */}
            <div 
              onClick={() => setActiveModalEvent(eventDetailsList[0])}
              className="bg-[#08080A] border border-[#22222a] hover:border-[#E10600] p-4 sm:p-5 space-y-3 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(225,6,0,0.5)] rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-display font-bold text-white text-xs sm:text-base flex items-center space-x-2 group-hover:text-[#E10600] transition-colors">
                  <Code className="w-4 h-4 text-[#E10600] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>1. POLE POSITION CHALLENGE</span>
                </div>
                <span className="self-start sm:self-auto text-[9px] sm:text-[10px] bg-[#E10600]/20 text-[#E10600] px-2.5 py-1 font-bold rounded group-hover:bg-[#E10600] group-hover:text-white transition-all">
                  VIEW RULES →
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8A8A93] leading-relaxed">
                Test your coding speed, logical thinking, debugging ability and problem-solving skills through multiple qualifying rounds.
              </p>
              <div className="text-[9px] sm:text-[10px] text-white flex flex-wrap justify-between gap-1 border-t border-[#22222a] pt-2.5 font-mono">
                <span className="text-[#8A8A93]">TEAM: Max 4 Drivers</span>
                <span className="text-[#E10600] font-bold">🏆 Pole Position Trophy</span>
              </div>
            </div>

            {/* Event 2 */}
            <div 
              onClick={() => setActiveModalEvent(eventDetailsList[1])}
              className="bg-[#08080A] border border-[#22222a] hover:border-[#E10600] p-4 sm:p-5 space-y-3 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(225,6,0,0.5)] rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-display font-bold text-white text-xs sm:text-base flex items-center space-x-2 group-hover:text-[#E10600] transition-colors">
                  <Brain className="w-4 h-4 text-[#E10600] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>2. PIT STRATEGY CHALLENGE</span>
                </div>
                <span className="self-start sm:self-auto text-[9px] sm:text-[10px] bg-[#E10600]/20 text-[#E10600] px-2.5 py-1 font-bold rounded group-hover:bg-[#E10600] group-hover:text-white transition-all">
                  VIEW RULES →
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8A8A93] leading-relaxed">
                Get a real-world AI problem statement and craft the most effective prompt to solve it within 1 hour.
              </p>
              <div className="text-[9px] sm:text-[10px] text-white flex flex-wrap justify-between gap-1 border-t border-[#22222a] pt-2.5 font-mono">
                <span className="text-[#8A8A93]">TEAM: Individual Driver (1 Hour)</span>
                <span className="text-[#E10600] font-bold">🏆 Strategy Master Trophy</span>
              </div>
            </div>

            {/* Event 3 */}
            <div 
              onClick={() => setActiveModalEvent(eventDetailsList[2])}
              className="bg-[#08080A] border border-[#22222a] hover:border-[#E10600] p-4 sm:p-5 space-y-3 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(225,6,0,0.5)] rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-display font-bold text-white text-xs sm:text-base flex items-center space-x-2 group-hover:text-[#E10600] transition-colors">
                  <Wrench className="w-4 h-4 text-[#E10600] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>3. CONSTRUCTORS GARAGE</span>
                </div>
                <span className="self-start sm:self-auto text-[9px] sm:text-[10px] bg-[#E10600]/20 text-[#E10600] px-2.5 py-1 font-bold rounded group-hover:bg-[#E10600] group-hover:text-white transition-all">
                  VIEW RULES →
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8A8A93] leading-relaxed">
                Build a working prototype for a given problem statement across 3 stages: Blueprint, Prototype, and Presentation.
              </p>
              <div className="text-[9px] sm:text-[10px] text-white flex flex-wrap justify-between gap-1 border-t border-[#22222a] pt-2.5 font-mono">
                <span className="text-[#8A8A93]">TEAM: Max 4 Drivers</span>
                <span className="text-[#E10600] font-bold">🏆 Constructors Trophy</span>
              </div>
            </div>

          </div>

          {/* RIGHT: DAYTONA CHAMPIONSHIP */}
          <div className="bg-[#111115] border-2 border-[#00D2BE]/60 p-4 sm:p-8 space-y-4 sm:space-y-6 shadow-2xl rounded-2xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#22222a] pb-4">
              <div>
                <span className="text-[10px] text-[#00D2BE] font-mono font-bold uppercase tracking-wider block">NON-TECHNICAL TRACK</span>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase mt-0.5">DAYTONA CHAMPIONSHIP</h3>
              </div>
              <div className="self-start sm:self-auto bg-[#08080A] border border-[#00D2BE] px-3.5 py-1.5 shadow-lg rounded-xl">
                <span className="text-xl sm:text-2xl font-black text-white font-display">₹50</span>
                <span className="text-[9px] sm:text-[10px] text-[#8A8A93] block font-mono">per Driver</span>
              </div>
            </div>

            {/* Event 4 */}
            <div 
              onClick={() => setActiveModalEvent(eventDetailsList[3])}
              className="bg-[#08080A] border border-[#22222a] hover:border-[#00D2BE] p-4 space-y-2.5 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,210,190,0.5)] rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-display font-bold text-white text-xs sm:text-base flex items-center space-x-2 group-hover:text-[#00D2BE] transition-colors">
                  <Radio className="w-4 h-4 text-[#00D2BE] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>1. RADIO COMMUNICATION</span>
                </div>
                <span className="self-start sm:self-auto text-[9px] sm:text-[10px] bg-[#00D2BE]/20 text-[#00D2BE] px-2.5 py-1 font-bold rounded group-hover:bg-[#00D2BE] group-hover:text-[#08080A] transition-all">
                  VIEW RULES →
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8A8A93] leading-relaxed">
                One driver acts like an F1 engineer communicating radio signals; teammates decode the hidden move.
              </p>
              <div className="text-[9px] sm:text-[10px] text-[#8A8A93] border-t border-[#22222a] pt-2 font-mono flex flex-wrap justify-between gap-1">
                <span>TEAM: 1–4 Drivers</span>
                <span className="text-[#00D2BE] font-bold">🏆 Daytona Medals</span>
              </div>
            </div>

            {/* Event 5 */}
            <div 
              onClick={() => setActiveModalEvent(eventDetailsList[4])}
              className="bg-[#08080A] border border-[#22222a] hover:border-[#00D2BE] p-4 space-y-2.5 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,210,190,0.5)] rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-display font-bold text-white text-xs sm:text-base flex items-center space-x-2 group-hover:text-[#00D2BE] transition-colors">
                  <Film className="w-4 h-4 text-[#00D2BE] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>2. LIGHTS OUT!</span>
                </div>
                <span className="self-start sm:self-auto text-[9px] sm:text-[10px] bg-[#00D2BE]/20 text-[#00D2BE] px-2.5 py-1 font-bold rounded group-hover:bg-[#00D2BE] group-hover:text-[#08080A] transition-all">
                  VIEW RULES →
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8A8A93] leading-relaxed">
                A 1-second movie clip is displayed. Identify the movie before other teams.
              </p>
              <div className="text-[9px] sm:text-[10px] text-[#8A8A93] border-t border-[#22222a] pt-2 font-mono flex flex-wrap justify-between gap-1">
                <span>TEAM: 1–3 Drivers</span>
                <span className="text-[#00D2BE] font-bold">🏆 Daytona Medals</span>
              </div>
            </div>

            {/* Event 6 */}
            <div 
              onClick={() => setActiveModalEvent(eventDetailsList[5])}
              className="bg-[#08080A] border border-[#22222a] hover:border-[#00D2BE] p-4 space-y-2.5 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,210,190,0.5)] rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-display font-bold text-[#00D2BE] text-xs sm:text-base flex items-center space-x-2 group-hover:text-white transition-colors">
                  <Timer className="w-4 h-4 text-[#00D2BE] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>3. PIT STOP CHALLENGE</span>
                </div>
                <span className="self-start sm:self-auto text-[9px] sm:text-[10px] bg-[#00D2BE]/20 text-[#00D2BE] px-2.5 py-1 font-bold rounded group-hover:bg-[#00D2BE] group-hover:text-[#08080A] transition-all">
                  VIEW RULES →
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8A8A93] leading-relaxed">
                Complete exciting 1-minute tasks inspired by F1 pit stops.
              </p>
              <div className="text-[9px] sm:text-[10px] text-[#8A8A93] border-t border-[#22222a] pt-2 font-mono flex flex-wrap justify-between gap-1">
                <span>TEAM: 1–3 Drivers</span>
                <span className="text-[#00D2BE] font-bold">🏆 Daytona Medals</span>
              </div>
            </div>

            {/* Event 7 */}
            <div 
              onClick={() => setActiveModalEvent(eventDetailsList[6])}
              className="bg-[#08080A] border border-[#22222a] hover:border-[#00D2BE] p-4 space-y-2.5 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,210,190,0.5)] rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-display font-bold text-white text-xs sm:text-base flex items-center space-x-2 group-hover:text-[#00D2BE] transition-colors">
                  <Disc className="w-4 h-4 text-[#00D2BE] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>4. TYRE CHANGE CHALLENGE</span>
                </div>
                <span className="self-start sm:self-auto text-[9px] sm:text-[10px] bg-[#00D2BE]/20 text-[#00D2BE] px-2.5 py-1 font-bold rounded group-hover:bg-[#00D2BE] group-hover:text-[#08080A] transition-all">
                  VIEW RULES →
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8A8A93] leading-relaxed">
                Teamwork challenge inspired by F1 tyre changes. Complete the task in shortest time.
              </p>
              <div className="text-[9px] sm:text-[10px] text-[#8A8A93] border-t border-[#22222a] pt-2 font-mono flex flex-wrap justify-between gap-1">
                <span>TEAM: 1–4 Drivers</span>
                <span className="text-[#00D2BE] font-bold">🏆 Daytona Medals</span>
              </div>
            </div>

            {/* Event 8 */}
            <div 
              onClick={() => setActiveModalEvent(eventDetailsList[7])}
              className="bg-[#08080A] border border-[#22222a] hover:border-[#00D2BE] p-4 space-y-2.5 cursor-pointer transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,210,190,0.5)] rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="font-display font-bold text-white text-xs sm:text-base flex items-center space-x-2 group-hover:text-[#00D2BE] transition-colors">
                  <Keyboard className="w-4 h-4 text-[#00D2BE] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span>5. TELEMETRY TEST</span>
                </div>
                <span className="self-start sm:self-auto text-[9px] sm:text-[10px] bg-[#00D2BE]/20 text-[#00D2BE] px-2.5 py-1 font-bold rounded group-hover:bg-[#00D2BE] group-hover:text-[#08080A] transition-all">
                  VIEW RULES →
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8A8A93] leading-relaxed">
                Type displayed text as accurately and quickly as possible, just like live telemetry data streams.
              </p>
              <div className="text-[9px] sm:text-[10px] text-[#8A8A93] border-t border-[#22222a] pt-2 font-mono flex flex-wrap justify-between gap-1">
                <span>TEAM: Solo / Team</span>
                <span className="text-[#00D2BE] font-bold">🏆 Daytona Medals</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE EVENT POP-UP MODAL WITH DYNAMIC BLUISH-GREEN DAYTONA LIGHTS */}
      {/* ========================================================================= */}
      {activeModalEvent && (() => {
        const isDaytona = activeModalEvent.championship === 'DAYTONA CHAMPIONSHIP' || activeModalEvent.fee === 50;
        
        return (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className={`bg-[#111115] border-2 max-w-xl w-full p-5 sm:p-8 space-y-5 sm:space-y-6 relative overflow-hidden font-data text-xs rounded-2xl animate-hero-zoom transition-all duration-300 max-h-[90vh] overflow-y-auto ${
              isDaytona
                ? 'border-[#00D2BE] shadow-[0_0_70px_rgba(0,210,190,0.8)]'
                : 'border-[#E10600] shadow-[0_0_70px_rgba(225,6,0,0.7)]'
            }`}>
              
              {/* Dynamic Top Neon Accent Stripe */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
                isDaytona
                  ? 'from-[#00D2BE] via-[#3B82F6] to-[#00D2BE] shadow-[0_0_20px_#00D2BE]'
                  : 'from-[#E10600] via-[#00D2BE] to-[#E10600]'
              }`} />

              <div className="flex items-start justify-between border-b border-[#22222a] pb-4">
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-2 ${
                    isDaytona ? 'text-[#00D2BE]' : 'text-[#E10600]'
                  }`}>
                    <span className={`w-2.5 h-2.5 rounded-full animate-ping ${isDaytona ? 'bg-[#00D2BE] shadow-[0_0_10px_#00D2BE]' : 'bg-[#E10600]'}`} />
                    <span>{activeModalEvent.championship}</span>
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase mt-1">
                    {activeModalEvent.name}
                  </h3>
                  <div className={`text-xs font-semibold mt-0.5 ${isDaytona ? 'text-[#00D2BE]' : 'text-[#E10600]'}`}>
                    {activeModalEvent.subTitle}
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="p-1.5 text-[#8A8A93] hover:text-white hover:bg-[#22222a] transition-all rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className={`grid grid-cols-2 gap-3 p-4 border rounded-xl ${
                isDaytona
                  ? 'bg-[#08080A] border-[#00D2BE]/60 shadow-[0_0_20px_rgba(0,210,190,0.2)]'
                  : 'bg-[#08080A] border-[#22222a]'
              }`}>
                <div>
                  <span className="text-[#8A8A93] text-[10px] font-mono block">REGISTRATION ENTRY FEE</span>
                  <span className={`text-xl font-bold font-display ${isDaytona ? 'text-[#00D2BE]' : 'text-[#E10600]'}`}>
                    ₹{activeModalEvent.fee} <span className="text-[10px] text-[#8A8A93] font-normal font-data">/ Driver</span>
                  </span>
                </div>
                <div>
                  <span className="text-[#8A8A93] text-[10px] font-mono block">TEAM ROSTER &amp; TIME</span>
                  <span className="text-xs font-bold text-white block">{activeModalEvent.teamSize}</span>
                  {activeModalEvent.duration && <span className="text-[10px] text-[#F5A623] font-mono">{activeModalEvent.duration}</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[#8A8A93] text-[10px] font-mono block font-bold uppercase">OFFICIAL COMPETITION OVERVIEW</span>
                <p className="font-body text-xs sm:text-sm text-white leading-relaxed bg-[#08080A] p-4 border border-[#22222a] rounded-xl">
                  {activeModalEvent.description}
                </p>
              </div>

              <div className={`space-y-2 p-4 border rounded-xl ${
                isDaytona ? 'bg-[#08080A] border-[#00D2BE]/40' : 'bg-[#08080A] border-[#22222a]'
              }`}>
                <span className={`text-[10px] font-mono font-bold uppercase ${isDaytona ? 'text-[#00D2BE]' : 'text-[#E10600]'}`}>
                  RULES &amp; STRUCTURE
                </span>
                <ul className="space-y-2 text-xs text-[#8A8A93]">
                  {activeModalEvent.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className={`font-bold ${isDaytona ? 'text-[#00D2BE]' : 'text-[#E10600]'}`}>›</span>
                      <span className="text-white">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[#8A8A93] text-[10px] font-mono block font-bold uppercase">EVALUATION METRICS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalEvent.evaluation.map((ev, idx) => (
                      <span key={idx} className={`border text-[10px] px-2.5 py-1 rounded font-mono ${
                        isDaytona 
                          ? 'bg-[#08080A] border-[#00D2BE] text-[#00D2BE]' 
                          : 'bg-[#111115] border-[#22222a] text-[#00D2BE]'
                      }`}>
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[#8A8A93] text-[10px] font-mono block font-bold uppercase">CHAMPIONSHIP TROPHY</span>
                  <div className={`text-xs font-bold p-2.5 border rounded-xl ${
                    isDaytona
                      ? 'text-[#00D2BE] bg-[#08080A] border-[#00D2BE] shadow-[0_0_20px_rgba(0,210,190,0.4)]'
                      : 'text-[#E10600] bg-[#08080A] border-[#22222a]'
                  }`}>
                    {activeModalEvent.trophy}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#22222a] flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const champ = activeModalEvent.championship;
                    const cat = activeModalEvent.categoryName;
                    setActiveModalEvent(null);
                    onStartRegistration(champ, cat);
                  }}
                  className={`w-full sm:w-auto flex-1 py-4 font-display text-xs font-bold tracking-wider transition-all uppercase rounded-xl ${
                    isDaytona
                      ? 'bg-[#00D2BE] hover:bg-[#00b5a3] text-[#08080A] shadow-[0_0_30px_rgba(0,210,190,0.8)]'
                      : 'bg-[#E10600] hover:bg-[#ff0700] text-white shadow-[0_0_25px_rgba(225,6,0,0.6)]'
                  }`}
                >
                  REGISTER DRIVER FOR THIS EVENT (₹{activeModalEvent.fee})
                </button>

                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="py-4 px-6 bg-[#14141a] hover:bg-[#1f1f28] text-white font-display text-xs font-bold tracking-wider transition-all uppercase border border-[#22222a] rounded-xl"
                >
                  CLOSE
                </button>
              </div>

            </div>
          </div>
        );
      })()}


      {/* ========================================================================= */}
      {/* 5. FINAL HIGH-VOLTAGE CTA BANNER WITH CYBERNEON EFFECTS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 max-w-6xl mx-auto font-data relative">
        <div className="bg-[#0b0b0e] border-2 border-[#E10600]/80 hover:border-[#00D2BE] transition-all duration-500 p-8 sm:p-14 rounded-[36px] sm:rounded-[48px] shadow-[0_0_80px_rgba(225,6,0,0.5)] relative overflow-hidden text-center space-y-8">
          
          {/* Ambient Background Radial Neon Halos */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D2BE]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E10600]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#E10600_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          {/* Trophy Badge with 5-LED Start Lights */}
          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-[#14141a] border-2 border-[#E10600] flex items-center justify-center text-[#E10600] shadow-[0_0_35px_rgba(225,6,0,0.8)] rounded-2xl">
              <Award className="w-8 h-8 animate-pulse text-[#00D2BE]" />
            </div>

            <div className="flex items-center space-x-1.5 bg-black/60 px-3 py-1 rounded-full border border-white/20">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${
                    i <= startLightsCount 
                      ? 'bg-[#00D2BE] shadow-[0_0_8px_#00D2BE] animate-pulse' 
                      : 'bg-[#444]'
                  }`} 
                />
              ))}
            </div>
          </div>

          {/* Massive Metallic Gradient Headline */}
          <div className="relative z-10 space-y-2">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              LET'S RACE TOWARDS A <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D2BE] to-white drop-shadow-[0_0_35px_rgba(0,210,190,0.6)]">
                SMARTER TOMORROW
              </span>
            </h2>
          </div>

          {/* Track Entry Fees Description Pill */}
          <div className="relative z-10 max-w-2xl mx-auto bg-[#14141a] border border-[#22222a] p-4 sm:p-5 rounded-2xl shadow-xl space-y-2">
            <p className="font-body text-xs sm:text-sm text-[#8A8A93] leading-relaxed">
              Select <strong className="text-[#E10600] font-mono">Engineering Championship (₹80)</strong> or <strong className="text-[#00D2BE] font-mono">Daytona Championship (₹50)</strong> and submit your registration UTR deposit now.
            </p>
          </div>

          {/* High-Octane CTA Button */}
          <div className="relative z-10 pt-2 flex justify-center">
            <button
              onClick={() => onStartRegistration()}
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-[#E10600] via-[#ff261b] to-[#E10600] text-white px-9 py-4 font-display text-xs sm:text-sm font-black tracking-widest uppercase transition-all duration-300 rounded-2xl shadow-[0_0_50px_rgba(225,6,0,0.8)] hover:shadow-[0_0_80px_rgba(0,210,190,0.9)] hover:scale-105 border-2 border-white/80 overflow-hidden"
            >
              {/* Checkered Flag Background Overlay Stripe */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_20px)] opacity-60 pointer-events-none" />

              {/* Nitro Speed Light Trail */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D2BE]/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="relative z-10 flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D2BE] animate-ping" />
                <span className="drop-shadow-md">REGISTER DRIVER NOW</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 group-hover:text-[#00D2BE] transition-transform" />
              </div>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};


