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

  // Live F1 Race Weekend Countdown State (Target: August 19, 2026 at 09:00 AM IST)
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isTick, setIsTick] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      // August is 0-indexed in JS (7 = August)
      const targetTime = new Date(2026, 7, 19, 9, 0, 0).getTime();
      const diff = targetTime - now.getTime();

      setIsTick(prev => !prev);

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        const nextYearTime = new Date(2027, 7, 19, 9, 0, 0).getTime();
        const diffNext = nextYearTime - now.getTime();
        setTimeLeft({
          days: Math.floor(diffNext / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diffNext / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diffNext / (1000 * 60)) % 60),
          seconds: Math.floor((diffNext / 1000) % 60)
        });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

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
      teamSize: '2 to 4 Drivers',
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
      teamSize: '1 Driver (Solo Entry)',
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
      teamSize: '2 to 4 Drivers',
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
      teamSize: '2 to 4 Drivers',
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
      teamSize: '2 to 4 Drivers',
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
      teamSize: '2 to 4 Drivers',
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
      teamSize: '2 to 4 Drivers',
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
      teamSize: '1 Driver (Solo Entry)',
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
                AUGUST <strong className="text-[#E10600]">19TH</strong> &amp; <strong className="text-[#00D2BE]">20TH</strong>, 2026
              </span>
            </div>
          </div>

          {/* CENTER STAGE: FLOATING KINETIC TYPOGRAPHY GRID & ROTATING CARRR.PNG */}
          <div className="relative my-auto py-8 sm:py-16 flex items-center justify-center">
            
            {/* Ambient Background Radial Halos */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div className="w-full max-w-[300px] sm:max-w-[500px] h-[300px] sm:h-[500px] bg-[#E10600]/15 rounded-full blur-[120px] sm:blur-[150px] animate-pulse-glow" />
              <div className="w-full max-w-[260px] sm:max-w-[400px] h-[260px] sm:h-[400px] bg-[#00D2BE]/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none" />
            </div>

            {/* Kinetic Typography Grid (FORMULA-AI 2026 GRAND PRIX Content) */}
            <div className="w-full relative text-white font-display font-black tracking-tighter uppercase select-none z-10 leading-none space-y-1 sm:space-y-4 max-w-full overflow-hidden">
              
              {/* Row 1: FORMULA ... AI */}
              <div className="flex justify-between items-baseline">
                <span className="text-3xl sm:text-7xl lg:text-9xl text-white opacity-95">FORMULA</span>
                <span className="text-3xl sm:text-7xl lg:text-9xl text-[#E10600] opacity-95">AI</span>
              </div>

              {/* Row 2: 2026 GRAND PRIX */}
              <div className="flex justify-center items-center py-1 sm:py-4">
                <span className="text-4xl sm:text-8xl lg:text-[11rem] text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] via-white to-[#00D2BE] tracking-widest drop-shadow-2xl animate-text-shine">
                  2026
                </span>
              </div>

              {/* Row 3: GRAND ... PRIX */}
              <div className="flex justify-between items-center">
                <span className="text-3xl sm:text-7xl lg:text-9xl text-white">GRAND</span>
                
                {/* Tagline Subtitle & Event Dates on right side */}
                <div className="hidden lg:block max-w-xs text-[10px] font-data text-[#8A8A93] normal-case tracking-normal leading-relaxed text-right border-r-2 border-[#E10600] pr-3">
                  <span className="text-[#00D2BE] font-mono font-bold block uppercase text-xs">🏁 AUGUST 19 &amp; 20, 2026</span>
                  <span className="text-white font-bold block">"MORE THAN A FEST. A CHAMPIONSHIP."</span>
                  Compete across 8 technical &amp; non-technical events.
                </div>

                <span className="text-3xl sm:text-7xl lg:text-9xl text-[#00D2BE]">PRIX</span>
              </div>

              {/* Row 4: ENGINEERING CHAMPIONSHIP */}
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-2xl sm:text-6xl lg:text-8xl text-white">ENGINEERING</span>
                <span className="text-2xl sm:text-6xl lg:text-8xl text-[#F5A623]">DAYTONA</span>
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
      {/* 2. EXCLUSIVE MULTI-EVENT COMBO OFFERS SECTION */}
      {/* ========================================================================= */}
      <section id="combos" className="py-10 px-3 sm:px-6 max-w-7xl mx-auto space-y-6 overflow-hidden">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#F5A623] px-3.5 py-1 rounded-full text-xs font-mono text-[#F5A623] shadow-[0_0_15px_rgba(245,166,35,0.4)]">
            <Flame className="w-4 h-4 text-[#F5A623] animate-pulse" />
            <span className="font-bold tracking-widest uppercase">🏁 COMBO OFFERS · RACE MORE. SAVE MORE.</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-wider">
            EXCLUSIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] via-[#F5A623] to-[#00D2BE]">MULTI-EVENT</span> COMBOS
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8A93] font-body max-w-2xl mx-auto">
            Choose your race package and experience multiple non-tech events at an exclusive combo price.
          </p>
        </div>

        {/* 2 Combo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-data">
          
          {/* PODIUM COMBO */}
          <div className="bg-[#0b0b0e] border-2 border-[#E10600] p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden space-y-6 flex flex-col justify-between group hover:border-[#00D2BE] transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-4 right-4 bg-[#E10600] text-white text-xs font-mono font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              25% OFF · SAVE ₹50
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#E10600]/15 border border-[#E10600] text-[#E10600] rounded-2xl">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#00D2BE] font-bold uppercase tracking-wider block">4 NON-TECH EVENTS</span>
                  <h3 className="font-display font-black text-2xl text-white uppercase">🏎️ PODIUM COMBO</h3>
                </div>
              </div>

              <div className="flex items-baseline space-x-3 bg-[#14141a] p-4 rounded-2xl border border-[#22222a]">
                <span className="font-display text-4xl font-black text-white">₹150</span>
                <span className="text-base text-[#8A8A93] line-through font-mono">/₹200/</span>
                <span className="text-xs font-mono text-[#22C55E] font-bold">SAVE ₹50 (25% OFF)</span>
              </div>

              <ul className="space-y-2 text-xs text-[#8A8A93] font-mono">
                <li className="flex items-center space-x-2">
                  <span className="text-[#00D2BE]">✓</span>
                  <span>Choose any 4 non-tech events of your choice</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#00D2BE]">✓</span>
                  <span>Telemetry (Typing Test) excluded as per rules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#00D2BE]">✓</span>
                  <span>One single combo registration pass</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#00D2BE]">✓</span>
                  <span>Maximum value for multi-event racers</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onStartRegistration('PODIUM COMBO (4 Non-Tech Events)', 'PODIUM COMBO (4 Non-Tech Events)')}
              className="w-full py-4 bg-[#E10600] hover:bg-[#ff1a1a] text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(225,6,0,0.6)] flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
            >
              <span>GRAB THIS COMBO →</span>
            </button>
          </div>

          {/* TURBO COMBO */}
          <div className="bg-[#0b0b0e] border-2 border-[#00D2BE] p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden space-y-6 flex flex-col justify-between group hover:border-[#E10600] transition-all duration-500 hover:-translate-y-1">
            <div className="absolute top-4 right-4 bg-[#00D2BE] text-[#08080A] text-xs font-mono font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              20% OFF · SAVE ₹30
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#00D2BE]/15 border border-[#00D2BE] text-[#00D2BE] rounded-2xl">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#F5A623] font-bold uppercase tracking-wider block">ANY 3 NON-TECH EVENTS</span>
                  <h3 className="font-display font-black text-2xl text-white uppercase">⚡ TURBO COMBO</h3>
                </div>
              </div>

              <div className="flex items-baseline space-x-3 bg-[#14141a] p-4 rounded-2xl border border-[#22222a]">
                <span className="font-display text-4xl font-black text-white">₹120</span>
                <span className="text-base text-[#8A8A93] line-through font-mono">/₹150/</span>
                <span className="text-xs font-mono text-[#22C55E] font-bold">SAVE ₹30 (20% OFF)</span>
              </div>

              <ul className="space-y-2 text-xs text-[#8A8A93] font-mono">
                <li className="flex items-center space-x-2">
                  <span className="text-[#00D2BE]">✓</span>
                  <span>Choose any 3 non-tech events in form</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#00D2BE]">✓</span>
                  <span>Telemetry (Typing Test) excluded as per rules</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#00D2BE]">✓</span>
                  <span>One single combo registration pass</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-[#00D2BE]">✓</span>
                  <span>Perfect for a quick triple-event run</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onStartRegistration('TURBO COMBO (3 Non-Tech Events)', 'TURBO COMBO (3 Non-Tech Events)')}
              className="w-full py-4 bg-[#14141a] hover:bg-[#1f1f28] border-2 border-[#00D2BE] text-[#00D2BE] font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
            >
              <span>CHOOSE YOUR EVENTS →</span>
            </button>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. TECHNICAL & NON-TECHNICAL EVENT CATEGORIES */}
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
                <span className="text-[#8A8A93]">TEAM: 2–4 Drivers</span>
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
                <span className="text-[#8A8A93]">TEAM: 1 Driver (Solo Entry)</span>
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
                <span className="text-[#8A8A93]">TEAM: 2–4 Drivers</span>
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
                <span>TEAM: 2–4 Drivers</span>
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
                <span>TEAM: 2–4 Drivers</span>
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
                <span>TEAM: 2–4 Drivers</span>
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
                <span>TEAM: 2–4 Drivers</span>
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
                <span>TEAM: 1 Driver (Solo Entry)</span>
                <span className="text-[#00D2BE] font-bold">🏆 Daytona Medals</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STANDALONE LIVE F1 RACE WEEKEND COUNTDOWN CLOCK SECTION */}
      {/* ========================================================================= */}
      <section id="countdown" className="py-12 sm:py-16 px-3 sm:px-6 max-w-7xl mx-auto font-data overflow-hidden">
        
        <div className="bg-[#0b0b0e] border-2 border-[#E10600] p-6 sm:p-10 rounded-[32px] shadow-[0_0_60px_rgba(225,6,0,0.4)] relative overflow-hidden space-y-8 group hover:border-[#00D2BE] transition-all duration-700">
          
          {/* Ambient Background Radial Halos */}
          <div className="absolute top-0 left-1/3 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#E10600]/15 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/3 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#00D2BE]/15 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#00D2BE_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#22222a] pb-6 gap-4 text-center md:text-left relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#E10600] px-3.5 py-1 rounded-full text-xs font-mono text-[#E10600] shadow-[0_0_15px_rgba(225,6,0,0.4)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-ping" />
                <span className="font-bold tracking-widest uppercase">⏱️ GREEN FLAG TELEMETRY COUNTDOWN</span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-wider">
                MONZA CIRCUIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D2BE] to-white">RACE WEEKEND</span> CLOCK
              </h3>
            </div>

            <div className="bg-[#14141a] border border-[#00D2BE]/50 px-4 py-2 rounded-2xl shadow-xl text-center self-center md:self-auto flex items-center space-x-3">
              <Clock className="w-5 h-5 text-[#00D2BE] animate-spin" />
              <div className="text-left">
                <span className="text-[10px] text-[#8A8A93] font-mono block">GREEN FLAG START DATE</span>
                <span className="font-display text-xs sm:text-sm font-black text-[#00D2BE] tracking-wider uppercase">
                  AUGUST 19, 2026 · 09:00 AM IST
                </span>
              </div>
            </div>
          </div>

          {/* 4 LED Digital Countdown Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 relative z-10 text-center">
            
            {/* DAYS */}
            <div className="bg-[#14141a] border-2 border-[#22222a] hover:border-[#00D2BE] p-4 sm:p-7 rounded-2xl transition-all duration-300 group/card transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="pt-2 mt-2 border-t border-[#22222a] flex items-center justify-between text-xs font-mono">
                <span className="text-[#00D2BE] font-bold tracking-widest">DAYS</span>
                <span className="text-[#8A8A93] text-[10px]">UNTIL RACE</span>
              </div>
            </div>

            {/* HOURS */}
            <div className="bg-[#14141a] border-2 border-[#22222a] hover:border-[#00D2BE] p-4 sm:p-7 rounded-2xl transition-all duration-300 group/card transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-[#00D2BE] tracking-tight drop-shadow-[0_0_20px_rgba(0,210,190,0.6)]">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="pt-2 mt-2 border-t border-[#22222a] flex items-center justify-between text-xs font-mono">
                <span className="text-[#00D2BE] font-bold tracking-widest">HOURS</span>
                <span className="text-[#8A8A93] text-[10px]">REMAINING</span>
              </div>
            </div>

            {/* MINUTES */}
            <div className="bg-[#14141a] border-2 border-[#22222a] hover:border-[#F5A623] p-4 sm:p-7 rounded-2xl transition-all duration-300 group/card transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-[#F5A623] tracking-tight drop-shadow-[0_0_20px_rgba(245,166,35,0.6)]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="pt-2 mt-2 border-t border-[#22222a] flex items-center justify-between text-xs font-mono">
                <span className="text-[#F5A623] font-bold tracking-widest">MINUTES</span>
                <span className="text-[#8A8A93] text-[10px]">REMAINING</span>
              </div>
            </div>

            {/* SECONDS */}
            <div className={`bg-[#14141a] border-2 p-4 sm:p-7 rounded-2xl transition-all duration-300 group/card transform shadow-[0_0_25px_rgba(225,6,0,0.5)] ${
              isTick ? 'border-[#E10600] scale-[1.03]' : 'border-[#E10600]/60 scale-100'
            }`}>
              <div className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-[#E10600] tracking-tight drop-shadow-[0_0_25px_rgba(225,6,0,0.9)]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="pt-2 mt-2 border-t border-[#22222a] flex items-center justify-between text-xs font-mono">
                <span className="text-[#E10600] font-bold tracking-widest">SECONDS</span>
                <span className={`text-[10px] font-bold transition-colors duration-200 ${isTick ? 'text-[#E10600]' : 'text-[#00D2BE]'}`}>
                  ● LIVE TICK
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Telemetry Status Pill & Registration Button */}
          <div className="pt-4 border-t border-[#22222a] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs font-mono">
            <div className="text-[#8A8A93] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00D2BE] animate-ping" />
              <span>MONZA TELEMETRY STATUS: PADDOCK TURNSTILES OPEN ON AUGUST 19TH</span>
            </div>

            <button
              onClick={() => onStartRegistration()}
              className="w-full sm:w-auto px-7 py-3 bg-[#E10600] hover:bg-[#ff1a1a] text-white font-display text-xs font-bold uppercase tracking-wider transition-all rounded-xl shadow-[0_0_20px_rgba(225,6,0,0.6)] flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <span>LOCK YOUR DRIVER GRID SLOT NOW</span>
              <ChevronRight className="w-4 h-4 text-[#00D2BE]" />
            </button>
          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3.5 EXCLUSIVE COMBO OFFERS SECTION: PODIUM & TURBO COMBOS */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-12 overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-3 px-2">
          <div className="inline-flex items-center space-x-2 bg-[#14141a] border-2 border-[#00D2BE] px-4 py-1.5 rounded-full text-xs font-mono text-[#00D2BE] shadow-[0_0_20px_rgba(0,210,190,0.4)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D2BE] animate-ping" />
            <span className="font-bold uppercase tracking-wider">🏁 COMBO OFFERS · RACE MORE. SAVE MORE.</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black uppercase text-white tracking-wider">
            EXCLUSIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D2BE] to-white">RACE PACKAGES</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#8A8A93] max-w-2xl mx-auto font-data leading-relaxed">
            Choose your race package and experience multiple non-tech events at an exclusive combo price.
          </p>
        </div>

        {/* 2 COMBO CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto font-data">
          
          {/* 🏎️ PODIUM COMBO CARD */}
          <div className="bg-[#0b0b0e] border-2 border-[#22C55E] p-6 sm:p-8 rounded-[32px] shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1">
            
            {/* Top Badge Overlay */}
            <div className="absolute top-0 right-0 bg-[#22C55E] text-[#08080A] font-display font-black text-xs px-5 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>25% OFF</span>
            </div>

            <div className="space-y-6">
              
              {/* Title & Subtitle */}
              <div>
                <div className="flex items-center space-x-2 text-[#22C55E] text-xs font-mono font-bold uppercase mb-1">
                  <span>🏎️ MULTI-EVENT PASS</span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-wider">
                  PODIUM COMBO
                </h3>
                <span className="text-xs font-mono text-[#00D2BE] font-bold bg-[#00D2BE]/10 border border-[#00D2BE]/30 px-3 py-1 rounded-full inline-block mt-2">
                  4 NON-TECH EVENTS
                </span>
              </div>

              {/* Pricing Display */}
              <div className="bg-[#14141a] border border-[#22C55E]/40 p-4 sm:p-5 rounded-2xl flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline space-x-3">
                    <span className="font-display text-4xl sm:text-5xl font-black text-[#22C55E] drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
                      ₹150
                    </span>
                    <span className="line-through text-lg font-mono text-[#8A8A93]">
                      ₹200
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8A8A93] font-mono block mt-1">SINGLE REGISTRATION FOR ALL 4 EVENTS</span>
                </div>

                <span className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E] text-xs font-mono font-bold px-3 py-1 rounded-xl">
                  SAVE ₹50
                </span>
              </div>

              {/* Feature Bullets */}
              <ul className="space-y-3 text-xs sm:text-sm text-white font-mono border-t border-[#22222a] pt-4">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  <span>Choose any 4 non-tech events</span>
                </li>
                <li className="flex items-center space-x-2.5 text-[#8A8A93]">
                  <span className="text-[#E10600] font-bold flex-shrink-0">🚫</span>
                  <span className="line-through">Telemetry (Typing Test) excluded</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                  <span>One combo registration</span>
                </li>
                <li className="flex items-center space-x-2.5 text-[#00D2BE] font-bold">
                  <Sparkles className="w-4 h-4 text-[#00D2BE] flex-shrink-0" />
                  <span>Maximum value for multi-event racers</span>
                </li>
              </ul>

            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => onStartRegistration('PODIUM COMBO (4 Non-Tech Events)', 'RADIO COMMUNICATION (Dumb Charades)')}
                className="w-full py-4 bg-gradient-to-r from-[#22C55E] via-[#16a34a] to-[#22C55E] hover:from-[#16a34a] hover:to-[#22C55E] text-[#08080A] font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all rounded-2xl shadow-[0_0_25px_rgba(34,197,94,0.7)] flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
              >
                <span>GRAB THIS COMBO →</span>
              </button>
            </div>

          </div>

          {/* ⚡ TURBO COMBO CARD */}
          <div className="bg-[#0b0b0e] border-2 border-[#00D2BE] p-6 sm:p-8 rounded-[32px] shadow-[0_0_40px_rgba(0,210,190,0.3)] hover:shadow-[0_0_60px_rgba(0,210,190,0.5)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between group transform hover:-translate-y-1">
            
            {/* Top Badge Overlay */}
            <div className="absolute top-0 right-0 bg-[#00D2BE] text-[#08080A] font-display font-black text-xs px-5 py-2 rounded-bl-2xl uppercase tracking-widest shadow-lg flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5" />
              <span>20% OFF</span>
            </div>

            <div className="space-y-6">
              
              {/* Title & Subtitle */}
              <div>
                <div className="flex items-center space-x-2 text-[#00D2BE] text-xs font-mono font-bold uppercase mb-1">
                  <span>⚡ TRIPLE TRIPLE PASS</span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-black text-white uppercase tracking-wider">
                  TURBO COMBO
                </h3>
                <span className="text-xs font-mono text-[#F5A623] font-bold bg-[#F5A623]/10 border border-[#F5A623]/30 px-3 py-1 rounded-full inline-block mt-2">
                  ANY 3 NON-TECH EVENTS
                </span>
              </div>

              {/* Pricing Display */}
              <div className="bg-[#14141a] border border-[#00D2BE]/40 p-4 sm:p-5 rounded-2xl flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline space-x-3">
                    <span className="font-display text-4xl sm:text-5xl font-black text-[#00D2BE] drop-shadow-[0_0_15px_rgba(0,210,190,0.6)]">
                      ₹120
                    </span>
                    <span className="line-through text-lg font-mono text-[#8A8A93]">
                      ₹150
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8A8A93] font-mono block mt-1">SINGLE REGISTRATION FOR ANY 3 EVENTS</span>
                </div>

                <span className="bg-[#00D2BE]/20 text-[#00D2BE] border border-[#00D2BE] text-xs font-mono font-bold px-3 py-1 rounded-xl">
                  SAVE ₹30
                </span>
              </div>

              {/* Feature Bullets */}
              <ul className="space-y-3 text-xs sm:text-sm text-white font-mono border-t border-[#22222a] pt-4">
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2BE] flex-shrink-0" />
                  <span>Choose any 3 non-tech events</span>
                </li>
                <li className="flex items-center space-x-2.5 text-[#8A8A93]">
                  <span className="text-[#E10600] font-bold flex-shrink-0">🚫</span>
                  <span className="line-through">Telemetry (Typing Test) excluded</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00D2BE] flex-shrink-0" />
                  <span>One combo registration</span>
                </li>
                <li className="flex items-center space-x-2.5 text-[#F5A623] font-bold">
                  <Zap className="w-4 h-4 text-[#F5A623] flex-shrink-0" />
                  <span>Perfect for a quick triple-event run</span>
                </li>
              </ul>

            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => onStartRegistration('TURBO COMBO (3 Non-Tech Events)', 'RADIO COMMUNICATION (Dumb Charades)')}
                className="w-full py-4 bg-gradient-to-r from-[#00D2BE] via-[#00a394] to-[#00D2BE] hover:from-[#00a394] hover:to-[#00D2BE] text-[#08080A] font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all rounded-2xl shadow-[0_0_25px_rgba(0,210,190,0.7)] flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
              >
                <span>CHOOSE YOUR EVENTS →</span>
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* REDESIGNED: YOUR RACE. YOUR EVENTS. YOUR CHOICE. RACE PROTOCOL ROADMAP */}
        {/* ========================================================================= */}
        <div className="max-w-6xl mx-auto pt-6 font-data relative">
          
          <div className="bg-[#0b0b0e] border-2 border-[#E10600] p-6 sm:p-12 rounded-[36px] shadow-[0_0_60px_rgba(225,6,0,0.4)] relative overflow-hidden space-y-8 group hover:border-[#00D2BE] transition-all duration-700">
            
            {/* Ambient Background Radial Glowing Laser Trails */}
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#E10600]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#00D2BE]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#00D2BE_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

            {/* Top Race Control Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#22222a] pb-6 gap-4 text-center sm:text-left relative z-10">
              
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#E10600] px-3.5 py-1 rounded-full text-xs font-mono text-[#E10600] shadow-[0_0_15px_rgba(225,6,0,0.4)]">
                  <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
                  <span className="font-bold tracking-widest uppercase">🏁 CHAMPIONSHIP PROTOCOL DIRECTIVE</span>
                </div>
                
                <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-wider">
                  YOUR RACE. <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D2BE] to-white">YOUR EVENTS.</span> YOUR CHOICE.
                </h3>
              </div>

              {/* Formula-AI Motto Chip */}
              <div className="bg-[#14141a] border border-[#00D2BE]/50 px-4 py-2 rounded-2xl shadow-xl text-center self-center sm:self-auto">
                <span className="text-[10px] text-[#8A8A93] font-mono block">OFFICIAL MOTTO</span>
                <span className="font-display text-xs font-black text-[#00D2BE] tracking-widest uppercase">
                  FORMULA-AI · THINK BEYOND LIMITS
                </span>
              </div>

            </div>

            {/* 4-STAGE INTERACTIVE PROTOCOL CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              
              {/* STEP 01 */}
              <div className="bg-[#14141a] border border-[#22222a] hover:border-[#E10600] p-5 rounded-2xl space-y-3 transition-all duration-300 group/card transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(225,6,0,0.4)] relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-[#E10600]/20 text-[#E10600] px-2.5 py-0.5 rounded border border-[#E10600]/30">
                      STEP 01
                    </span>
                    <Trophy className="w-4 h-4 text-[#E10600] group-hover/card:scale-125 transition-transform" />
                  </div>

                  <div>
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider group-hover/card:text-[#E10600] transition-colors">
                      PICK YOUR EVENTS
                    </h4>
                    <p className="text-[11px] text-[#8A8A93] mt-1 leading-relaxed">
                      Choose Engineering track, Daytona track, or Podium &amp; Turbo Combo packages.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#22222a] text-[10px] font-mono text-[#00D2BE] font-bold flex items-center justify-between">
                  <span>SELECT TRACK</span>
                  <span>→</span>
                </div>
              </div>

              {/* STEP 02 */}
              <div className="bg-[#14141a] border border-[#22222a] hover:border-[#00D2BE] p-5 rounded-2xl space-y-3 transition-all duration-300 group/card transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,210,190,0.4)] relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-[#00D2BE]/20 text-[#00D2BE] px-2.5 py-0.5 rounded border border-[#00D2BE]/30">
                      STEP 02
                    </span>
                    <Shield className="w-4 h-4 text-[#00D2BE] group-hover/card:scale-125 transition-transform" />
                  </div>

                  <div>
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider group-hover/card:text-[#00D2BE] transition-colors">
                      REGISTER DRIVER
                    </h4>
                    <p className="text-[11px] text-[#8A8A93] mt-1 leading-relaxed">
                      Enter team squad details and submit your 12-digit transaction ID.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#22222a] text-[10px] font-mono text-[#00D2BE] font-bold flex items-center justify-between">
                  <span>INPUT TELEMETRY</span>
                  <span>→</span>
                </div>
              </div>

              {/* STEP 03 */}
              <div className="bg-[#14141a] border border-[#22222a] hover:border-[#22C55E] p-5 rounded-2xl space-y-3 transition-all duration-300 group/card transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-[#22C55E]/20 text-[#22C55E] px-2.5 py-0.5 rounded border border-[#22C55E]/30">
                      STEP 03
                    </span>
                    <Gauge className="w-4 h-4 text-[#22C55E] group-hover/card:scale-125 transition-transform" />
                  </div>

                  <div>
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider group-hover/card:text-[#22C55E] transition-colors">
                      HIT THE TRACK
                    </h4>
                    <p className="text-[11px] text-[#8A8A93] mt-1 leading-relaxed">
                      Get your FIA Driver E-Pass and scan QR code at turnstile entry gates.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#22222a] text-[10px] font-mono text-[#22C55E] font-bold flex items-center justify-between">
                  <span>SCAN E-PASS</span>
                  <span>→</span>
                </div>
              </div>

              {/* STEP 04 */}
              <div className="bg-[#14141a] border border-[#22222a] hover:border-[#F5A623] p-5 rounded-2xl space-y-3 transition-all duration-300 group/card transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-[#F5A623]/20 text-[#F5A623] px-2.5 py-0.5 rounded border border-[#F5A623]/30">
                      STEP 04
                    </span>
                    <Zap className="w-4 h-4 text-[#F5A623] group-hover/card:scale-125 transition-transform" />
                  </div>

                  <div>
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider group-hover/card:text-[#F5A623] transition-colors">
                      RACE BEYOND LIMITS
                    </h4>
                    <p className="text-[11px] text-[#8A8A93] mt-1 leading-relaxed">
                      Outpace competition, claim official FIA trophies, medals &amp; glory.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#22222a] text-[10px] font-mono text-[#F5A623] font-bold flex items-center justify-between">
                  <span>PODIUM VICTORY</span>
                  <span>🏆</span>
                </div>
              </div>

            </div>

            {/* Bottom Quick Action Callout */}
            <div className="pt-4 border-t border-[#22222a] flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="text-xs text-[#8A8A93] font-mono flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00D2BE] animate-ping" />
                <span>READY TO RACE AT MONZA NATIONAL CIRCUIT?</span>
              </div>

              <button
                onClick={() => onStartRegistration()}
                className="w-full sm:w-auto px-7 py-3 bg-[#E10600] hover:bg-[#ff1a1a] text-white font-display text-xs font-bold uppercase tracking-wider transition-all rounded-xl shadow-[0_0_20px_rgba(225,6,0,0.6)] flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <span>REGISTER FOR YOUR RACE NOW</span>
                <ChevronRight className="w-4 h-4 text-[#00D2BE]" />
              </button>
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


