import React, { useState } from 'react';
import { ChampionshipType, EventCategory } from '../types';
import { 
  Trophy, 
  Code, 
  Brain, 
  Wrench, 
  Radio, 
  Film, 
  Timer, 
  Wine, 
  Keyboard, 
  Zap, 
  ChevronRight, 
  Search, 
  Filter, 
  Award, 
  CheckCircle2, 
  X, 
  Clock, 
  ShieldCheck, 
  Users, 
  User, 
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react';

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
  isSolo?: boolean;
}

interface EventsPageProps {
  onStartRegistration: (championship?: ChampionshipType, category?: EventCategory) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onStartRegistration }) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'TECHNICAL' | 'DAYTONA' | 'COMBOS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalEvent, setSelectedModalEvent] = useState<EventDetail | null>(null);

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
      teamSize: 'Solo Driver Only (1 Driver Entry)',
      isSolo: true,
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
      subTitle: 'Hackathon Prototype',
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
      subTitle: 'Charades',
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
      subTitle: 'Movie Guess in 1 Sec',
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
      subTitle: 'Typing Test',
      championship: 'DAYTONA CHAMPIONSHIP',
      categoryName: 'TELEMETRY TEST (Typing Competition)',
      fee: 50,
      teamSize: 'Solo Driver Only (1 Driver Entry)',
      isSolo: true,
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

  const filteredEvents = eventDetailsList.filter(ev => {
    const matchesSearch = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.subTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategoryFilter === 'TECHNICAL') return ev.championship === 'ENGINEERING CHAMPIONSHIP';
    if (activeCategoryFilter === 'DAYTONA') return ev.championship === 'DAYTONA CHAMPIONSHIP';
    return true;
  });

  const getEventIcon = (id: string) => {
    switch (id) {
      case 'pole-position': return Code;
      case 'pit-strategy': return Brain;
      case 'constructors-garage': return Wrench;
      case 'radio-comm': return Radio;
      case 'lights-out': return Film;
      case 'pit-stop': return Timer;
      case 'tyre-change': return Wine;
      case 'telemetry-test': return Keyboard;
      default: return Trophy;
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-white selection:bg-[#E10600] font-data py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header Banner */}
        <div className="bg-[#0b0b0e] border-2 border-[#E10600] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E10600]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-[#14141a] border border-[#E10600] px-3.5 py-1 rounded-full text-xs font-mono text-[#E10600]">
                <Sparkles className="w-4 h-4 text-[#00D2BE] animate-spin" />
                <span className="font-bold uppercase tracking-wider">FORMULA-AI 2026 OFFICIAL EVENT DIRECTORY</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-wider leading-none">
                RACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] via-white to-[#00D2BE]">COMPETITIONS</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#8A8A93] leading-relaxed font-body">
                Explore all 8 Technical &amp; Non-Technical competitions. Select any event to review complete directives, rules, team sizes, and lock your driver grid slot.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 self-start md:self-auto">
              <button
                onClick={() => onStartRegistration('PODIUM COMBO (4 Non-Tech Events)', 'PODIUM COMBO (4 Non-Tech Events)')}
                className="px-5 py-3 bg-[#E10600] hover:bg-[#ff1a1a] text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(225,6,0,0.6)] flex items-center space-x-2 transition-all transform hover:scale-105"
              >
                <Flame className="w-4 h-4 text-[#00D2BE]" />
                <span>GRAB PODIUM COMBO (₹150)</span>
              </button>

              <button
                onClick={() => onStartRegistration('TURBO COMBO (3 Non-Tech Events)', 'TURBO COMBO (3 Non-Tech Events)')}
                className="px-5 py-3 bg-[#14141a] hover:bg-[#1f1f28] border-2 border-[#00D2BE] text-[#00D2BE] font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center space-x-2 transition-all transform hover:scale-105"
              >
                <Zap className="w-4 h-4 text-[#00D2BE]" />
                <span>TURBO COMBO (₹120)</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 border-t border-[#22222a] relative z-10">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A8A93]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search event name, rule, or category..."
                className="w-full bg-[#14141a] border border-[#22222a] focus:border-[#00D2BE] text-white text-xs pl-10 pr-4 py-3 outline-none rounded-xl transition-all font-mono"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-[#8A8A93] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="md:col-span-7 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCategoryFilter('ALL')}
                className={`px-4 py-2.5 rounded-xl font-display text-xs font-bold transition-all uppercase ${
                  activeCategoryFilter === 'ALL'
                    ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                    : 'bg-[#14141a] text-[#8A8A93] hover:text-white border border-[#22222a]'
                }`}
              >
                ALL 8 EVENTS
              </button>

              <button
                onClick={() => setActiveCategoryFilter('TECHNICAL')}
                className={`px-4 py-2.5 rounded-xl font-display text-xs font-bold transition-all uppercase flex items-center space-x-1.5 ${
                  activeCategoryFilter === 'TECHNICAL'
                    ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                    : 'bg-[#14141a] text-[#8A8A93] hover:text-white border border-[#22222a]'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-[#E10600]" />
                <span>TECHNICAL TRACK (₹80)</span>
              </button>

              <button
                onClick={() => setActiveCategoryFilter('DAYTONA')}
                className={`px-4 py-2.5 rounded-xl font-display text-xs font-bold transition-all uppercase flex items-center space-x-1.5 ${
                  activeCategoryFilter === 'DAYTONA'
                    ? 'bg-[#00D2BE] text-[#08080A] shadow-[0_0_15px_rgba(0,210,190,0.5)]'
                    : 'bg-[#14141a] text-[#8A8A93] hover:text-white border border-[#22222a]'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-[#00D2BE]" />
                <span>DAYTONA TRACK (₹50)</span>
              </button>

              <button
                onClick={() => setActiveCategoryFilter('COMBOS')}
                className={`px-4 py-2.5 rounded-xl font-display text-xs font-bold transition-all uppercase flex items-center space-x-1.5 ${
                  activeCategoryFilter === 'COMBOS'
                    ? 'bg-[#F5A623] text-[#08080A] shadow-[0_0_15px_rgba(245,166,35,0.5)]'
                    : 'bg-[#14141a] text-[#8A8A93] hover:text-white border border-[#22222a]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>COMBO OFFERS</span>
              </button>
            </div>

          </div>
        </div>

        {/* COMBO OFFERS BANNER SECTION (Shown when ALL or COMBOS filter is active) */}
        {(activeCategoryFilter === 'ALL' || activeCategoryFilter === 'COMBOS') && !searchQuery && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#F5A623] font-mono text-xs font-bold uppercase tracking-widest">
              <Zap className="w-4 h-4 text-[#F5A623]" />
              <span>FEATURED MULTI-EVENT COMBO PACKAGES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* PODIUM COMBO */}
              <div className="bg-[#111115] border-2 border-[#E10600] p-6 rounded-3xl shadow-2xl relative overflow-hidden space-y-4 flex flex-col justify-between group hover:border-[#00D2BE] transition-all">
                <div className="absolute top-3 right-3 bg-[#E10600] text-white text-[10px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  25% OFF · SAVE ₹50
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#E10600]">
                    <Trophy className="w-5 h-5" />
                    <span className="font-display font-black text-xl uppercase text-white">🏎️ PODIUM COMBO</span>
                  </div>
                  <div className="text-2xl font-black font-display text-white">
                    ₹150 <span className="text-xs text-[#8A8A93] line-through font-mono">₹200</span>
                  </div>
                  <p className="text-xs text-[#8A8A93]">
                    Includes <strong>ANY 4 NON-TECH EVENTS</strong> of your choice (Telemetry Typing Test excluded).
                  </p>
                </div>

                <button
                  onClick={() => onStartRegistration('PODIUM COMBO (4 Non-Tech Events)', 'PODIUM COMBO (4 Non-Tech Events)')}
                  className="w-full py-3 bg-[#E10600] hover:bg-[#ff1a1a] text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <span>REGISTER PODIUM COMBO NOW</span>
                  <ArrowRight className="w-4 h-4 text-[#00D2BE]" />
                </button>
              </div>

              {/* TURBO COMBO */}
              <div className="bg-[#111115] border-2 border-[#00D2BE] p-6 rounded-3xl shadow-2xl relative overflow-hidden space-y-4 flex flex-col justify-between group hover:border-[#E10600] transition-all">
                <div className="absolute top-3 right-3 bg-[#00D2BE] text-[#08080A] text-[10px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  20% OFF · SAVE ₹30
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#00D2BE]">
                    <Zap className="w-5 h-5" />
                    <span className="font-display font-black text-xl uppercase text-white">⚡ TURBO COMBO</span>
                  </div>
                  <div className="text-2xl font-black font-display text-white">
                    ₹120 <span className="text-xs text-[#8A8A93] line-through font-mono">₹150</span>
                  </div>
                  <p className="text-xs text-[#8A8A93]">
                    Choose <strong>ANY 3 NON-TECH EVENTS</strong> of your choice in the registration form.
                  </p>
                </div>

                <button
                  onClick={() => onStartRegistration('TURBO COMBO (3 Non-Tech Events)', 'TURBO COMBO (3 Non-Tech Events)')}
                  className="w-full py-3 bg-[#14141a] hover:bg-[#1f1f28] border-2 border-[#00D2BE] text-[#00D2BE] font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <span>SELECT TURBO COMBO EVENTS</span>
                  <ArrowRight className="w-4 h-4 text-[#00D2BE]" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* EVENTS GRID */}
        {activeCategoryFilter !== 'COMBOS' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-wider flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-[#E10600]" />
                <span>{activeCategoryFilter === 'ALL' ? 'ALL 8 CHAMPIONSHIP COMPETITIONS' : activeCategoryFilter === 'TECHNICAL' ? 'TECHNICAL CHAMPIONSHIP TRACK (₹80)' : 'DAYTONA CHAMPIONSHIP TRACK (₹50)'}</span>
              </h2>
              <span className="text-xs font-mono text-[#8A8A93]">
                SHOWING {filteredEvents.length} EVENTS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => {
                const IconComponent = getEventIcon(event.id);
                const isTech = event.championship === 'ENGINEERING CHAMPIONSHIP';

                return (
                  <div
                    key={event.id}
                    className={`bg-[#0b0b0e] border-2 p-6 rounded-3xl space-y-4 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl relative overflow-hidden ${
                      isTech 
                        ? 'border-[#22222a] hover:border-[#E10600] hover:shadow-[0_0_30px_rgba(225,6,0,0.3)]' 
                        : 'border-[#22222a] hover:border-[#00D2BE] hover:shadow-[0_0_30px_rgba(0,210,190,0.3)]'
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Event Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2.5 rounded-xl border ${
                            isTech ? 'bg-[#E10600]/15 border-[#E10600] text-[#E10600]' : 'bg-[#00D2BE]/15 border-[#00D2BE] text-[#00D2BE]'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block ${
                              isTech ? 'text-[#E10600]' : 'text-[#00D2BE]'
                            }`}>
                              {event.championship === 'ENGINEERING CHAMPIONSHIP' ? 'TECHNICAL TRACK' : 'DAYTONA TRACK'}
                            </span>
                            <h3 className="font-display font-bold text-base text-white uppercase group-hover:text-white transition-colors">
                              {event.name}
                            </h3>
                          </div>
                        </div>

                        <span className="font-display text-xl font-black text-white bg-[#14141a] px-3 py-1 rounded-xl border border-[#22222a]">
                          ₹{event.fee}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-[#00D2BE] font-bold">
                        {event.subTitle}
                      </div>

                      <p className="text-xs text-[#8A8A93] leading-relaxed line-clamp-3">
                        {event.description}
                      </p>

                    </div>

                    <div className="space-y-3 pt-4 border-t border-[#22222a]">
                      
                      {/* Driver Team Size Badge */}
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#8A8A93] flex items-center space-x-1">
                          {event.isSolo ? <User className="w-3.5 h-3.5 text-[#00D2BE]" /> : <Users className="w-3.5 h-3.5 text-[#E10600]" />}
                          <span>{event.teamSize}</span>
                        </span>

                        <span className="text-[#F5A623] font-bold">
                          {event.trophy.split(' ')[0]} {event.trophy.split(' ').slice(1, 3).join(' ')}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedModalEvent(event)}
                          className="py-2.5 px-3 bg-[#14141a] hover:bg-[#1f1f28] text-[#8A8A93] hover:text-white border border-[#22222a] rounded-xl text-[11px] font-mono font-bold transition-all"
                        >
                          VIEW RULES
                        </button>

                        <button
                          onClick={() => onStartRegistration(event.championship, event.categoryName)}
                          className={`py-2.5 px-3 font-display text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center space-x-1 ${
                            isTech
                              ? 'bg-[#E10600] hover:bg-[#ff1a1a] text-white'
                              : 'bg-[#00D2BE] hover:bg-[#00ebd4] text-[#08080A]'
                          }`}
                        >
                          <span>REGISTER</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* EVENT DIRECTIVES & RULES POPUP MODAL */}
      {selectedModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-hero-zoom font-data">
          <div className="bg-[#111115] border-2 border-[#E10600] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#22222a] pb-4">
              <div className="space-y-1">
                <span className="text-[10px] text-[#00D2BE] font-mono font-bold uppercase tracking-wider">
                  {selectedModalEvent.championship} · ENTRY DEPOSIT ₹{selectedModalEvent.fee}
                </span>
                <h2 className="font-display text-2xl font-black text-white uppercase">
                  {selectedModalEvent.name}
                </h2>
                <div className="text-xs text-[#E10600] font-mono font-bold">
                  {selectedModalEvent.subTitle}
                </div>
              </div>

              <button
                onClick={() => setSelectedModalEvent(null)}
                className="p-2 text-[#8A8A93] hover:text-white bg-[#14141a] rounded-xl border border-[#22222a]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Event Description */}
            <div className="space-y-2 text-xs text-[#8A8A93] leading-relaxed">
              <span className="text-white font-bold block uppercase text-[10px] tracking-wider">EVENT DIRECTIVE:</span>
              <p>{selectedModalEvent.description}</p>
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <span className="text-[#00D2BE] font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00D2BE]" />
                <span>OFFICIAL COMPETITION RULES:</span>
              </span>
              <ul className="space-y-1.5 bg-[#08080A] p-3.5 border border-[#22222a] rounded-xl text-xs text-white font-mono">
                {selectedModalEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-[#E10600] font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Evaluation Metrics */}
            <div className="space-y-2">
              <span className="text-[#F5A623] font-mono font-bold text-xs uppercase tracking-wider">
                EVALUATION METRICS &amp; SCORING:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedModalEvent.evaluation.map((ev, idx) => (
                  <span key={idx} className="bg-[#14141a] border border-[#22222a] text-white text-[10px] font-mono px-2.5 py-1 rounded-lg">
                    ✓ {ev}
                  </span>
                ))}
              </div>
            </div>

            {/* Trophy */}
            <div className="bg-[#14141a] p-3.5 border border-[#F5A623]/40 rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-[#8A8A93]">CHAMPION REWARD:</span>
              <span className="text-[#F5A623] font-bold">{selectedModalEvent.trophy}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const event = selectedModalEvent;
                  setSelectedModalEvent(null);
                  onStartRegistration(event.championship, event.categoryName);
                }}
                className="w-full py-3.5 bg-[#E10600] hover:bg-[#ff1a1a] text-white font-display text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(225,6,0,0.6)] flex items-center justify-center space-x-2"
              >
                <span>REGISTER FOR THIS EVENT NOW</span>
                <ChevronRight className="w-4 h-4 text-[#00D2BE]" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
