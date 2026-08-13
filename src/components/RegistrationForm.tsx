import React, { useState } from 'react';
import { DriverRegistration, ChampionshipType, EventCategory } from '../types';
import { User, Mail, Phone, Building, Flag, CheckCircle2, CreditCard, RadioTower, Shield, Gauge, Sparkles, Check, ChevronRight, Users, UserPlus, UserCheck, Crown, Zap, Award } from 'lucide-react';
import { sanitizeInput, validateEmail, validatePhone, validateUtr, validateFullName } from '../utils/validation';

interface RegistrationFormProps {
  onSubmitSuccess: (newRegistration: DriverRegistration) => void;
  onCancel: () => void;
  initialChampionship?: ChampionshipType;
  initialCategory?: EventCategory;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmitSuccess,
  onCancel,
  initialChampionship,
  initialCategory
}) => {
  const [teamSizeCount, setTeamSizeCount] = useState<number>(2); // Default to 2 Drivers Team (2 to 4 limit)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    year: '4th Year',
    department: 'Computer Science & AI',
    teamName: '',
    driver2Name: '',
    driver2Phone: '',
    driver3Name: '',
    driver3Phone: '',
    driver4Name: '',
    driver4Phone: '',
    championship: (initialChampionship || 'ENGINEERING CHAMPIONSHIP') as ChampionshipType,
    category: (initialCategory || 'POLE POSITION CHALLENGE (Coding)') as EventCategory,
    utrNumber: '',
    agreedTerms: false
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isNameValid = validateFullName(formData.fullName);
  const isEmailValid = validateEmail(formData.email);
  const isPhoneValid = validatePhone(formData.phone);
  const isOrgValid = validateFullName(formData.organization);
  const isUtrValid = validateUtr(formData.utrNumber);

  // Additional Drivers Validation based on Team Size (2 to 4 Limit)
  const isDriver2Valid = teamSizeCount < 2 || validateFullName(formData.driver2Name);
  const isDriver3Valid = teamSizeCount < 3 || validateFullName(formData.driver3Name);
  const isDriver4Valid = teamSizeCount < 4 || validateFullName(formData.driver4Name);

  const validFieldsCount = [
    isNameValid,
    isEmailValid,
    isPhoneValid,
    isOrgValid,
    isDriver2Valid,
    isUtrValid,
    formData.agreedTerms
  ].filter(Boolean).length;

  const progressPercent = Math.round((validFieldsCount / 7) * 100);

  // Live Tachometer RPM and Speed calculations
  const rpmValue = Math.min(15000, Math.round((validFieldsCount / 7) * 15000));
  const currentSpeed = Math.round((validFieldsCount / 7) * 352.4);
  const baseFeePerDriver = formData.championship === 'ENGINEERING CHAMPIONSHIP' ? 80 : 50;
  const totalAmountPayable = baseFeePerDriver * teamSizeCount;

  const isFormComplete = isNameValid && isEmailValid && isPhoneValid && isOrgValid && isDriver2Valid && isDriver3Valid && isDriver4Valid && isUtrValid && formData.agreedTerms;

  const handleChampionshipChange = (champ: ChampionshipType) => {
    if (champ === 'ENGINEERING CHAMPIONSHIP') {
      setFormData(prev => ({
        ...prev,
        championship: champ,
        category: 'POLE POSITION CHALLENGE (Coding)'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        championship: champ,
        category: 'RADIO COMMUNICATION (Dumb Charades)'
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    // SANITIZE ALL INPUT FIELDS TO PREVENT XSS AND HTML INJECTION
    const cleanFullName = sanitizeInput(formData.fullName);
    const cleanEmail = sanitizeInput(formData.email).toLowerCase();
    const cleanPhone = sanitizeInput(formData.phone);
    const cleanOrg = sanitizeInput(formData.organization);
    const cleanTeamName = sanitizeInput(formData.teamName) || `${cleanFullName}'s Squad`;
    const cleanUtr = sanitizeInput(formData.utrNumber).toUpperCase();

    const randomIdNumber = Math.floor(10000 + Math.random() * 90000);
    const newId = `FA26-${randomIdNumber}`;

    const teamMembersList: string[] = [cleanFullName];
    if (teamSizeCount >= 2 && formData.driver2Name.trim()) teamMembersList.push(sanitizeInput(formData.driver2Name));
    if (teamSizeCount >= 3 && formData.driver3Name.trim()) teamMembersList.push(sanitizeInput(formData.driver3Name));
    if (teamSizeCount >= 4 && formData.driver4Name.trim()) teamMembersList.push(sanitizeInput(formData.driver4Name));

    const newRegistration: DriverRegistration = {
      id: newId,
      fullName: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      organization: cleanOrg,
      year: formData.year,
      department: formData.department,
      teamName: cleanTeamName,
      teamSizeCount: teamSizeCount,
      teamMembers: teamMembersList,
      championship: formData.championship,
      category: formData.category,
      eventName: 'FORMULA-AI 2026 GRAND PRIX',
      utrNumber: cleanUtr,
      paymentAmount: totalAmountPayable,
      paymentStatus: 'PENDING',
      status: 'SUBMITTED',
      emailStatus: 'NOT_SENT',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    onSubmitSuccess(newRegistration);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-data">
      
      {/* 1. MONZA COCKPIT TACHOMETER & SPEED DIAL HEADER */}
      <div className="bg-[#0b0b0e] border-2 border-[#E10600] p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#22222a] pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[#E10600] text-xs font-bold uppercase mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E10600] animate-ping" />
              <span>MONZA PADDOCK COCKPIT HUD</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white uppercase tracking-wider">
              FORMULA-AI 2026 DRIVER REGISTRATION
            </h2>
          </div>

          <button
            onClick={onCancel}
            className="text-xs font-mono text-[#8A8A93] hover:text-white px-4 py-2 border border-[#22222a] hover:border-white transition-all rounded-xl self-start md:self-auto"
          >
            [ ESC / EXIT CONSOLE ]
          </button>
        </div>

        {/* Tachometer RPM LED Shift Lights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#14141a] p-5 rounded-2xl border border-[#22222a]">
          
          {/* LED Shift Lights */}
          <div className="md:col-span-7 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-[#8A8A93]">TACHOMETER RPM SHIFT LIGHTS</span>
              <span className="text-[#00D2BE] font-bold">{rpmValue} RPM</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#08080A] p-2 rounded-xl border border-[#22222a]">
              {[...Array(12)].map((_, i) => {
                const isLit = (i + 1) / 12 <= validFieldsCount / 7;
                const isRed = i >= 8;
                const isYellow = i >= 4 && i < 8;

                return (
                  <div
                    key={i}
                    className={`flex-1 h-3 rounded-sm transition-all duration-300 ${
                      isLit
                        ? isRed
                          ? 'bg-[#E10600] shadow-[0_0_10px_#E10600]'
                          : isYellow
                          ? 'bg-[#F5A623] shadow-[0_0_10px_#F5A623]'
                          : 'bg-[#22C55E] shadow-[0_0_10px_#22C55E]'
                        : 'bg-[#22222a]'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Speed Dial & Progress Status */}
          <div className="md:col-span-5 flex items-center justify-between border-t md:border-t-0 md:border-l border-[#22222a] pt-3 md:pt-0 md:pl-6 text-xs">
            <div>
              <span className="text-[#8A8A93] block text-[10px] font-mono">LIVE SPEED</span>
              <span className="text-2xl font-black font-display text-white">{currentSpeed} <span className="text-xs text-[#8A8A93]">KM/H</span></span>
            </div>

            <div>
              <span className="text-[#8A8A93] block text-[10px] font-mono">ROSTER TEAM SIZE</span>
              <span className="text-2xl font-black font-display text-[#00D2BE]">{teamSizeCount} DRIVERS</span>
            </div>
          </div>

        </div>

      </div>

      {/* 2. SPLIT LAYOUT: LEFT F1 GARAGE SHOWCASE & LIVE E-PASS CARD vs RIGHT INPUT CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: F1 CAR GARAGE SHOWCASE & LIVE DRIVER E-PASS TICKET PREVIEW (COL-SPAN-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* F1 Car Garage Showcase */}
          <div className="bg-[#0b0b0e] border-2 border-[#E10600] p-6 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-4">
            
            <div className="flex items-center space-x-2 text-xs font-mono text-[#00D2BE] self-start border-b border-[#22222a] w-full pb-3">
              <RadioTower className="w-4 h-4 text-[#00D2BE] animate-pulse" />
              <span>GARAGE BAY 01 · ACTIVE TELEMETRY</span>
            </div>

            {/* F1 Car Image with Floating Aero Suspension & Nitro Flame Glow */}
            <div className="relative py-4 animate-car-float cursor-pointer group w-full flex justify-center">
              
              {/* Nitro Speed Afterburner Flame Halos */}
              <div className="absolute bottom-4 inset-x-4 h-8 bg-gradient-to-r from-[#E10600] via-[#00D2BE] to-[#E10600] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse" />

              <img 
                src={
                  teamSizeCount === 2 ? "/images/two.png" :
                  teamSizeCount === 3 ? "/images/three.png" :
                  teamSizeCount === 4 ? "/images/four.png" : "/images/two.png"
                } 
                alt={`${teamSizeCount} Drivers Formula 1 Squad`} 
                className="w-full h-auto max-h-[220px] object-contain drop-shadow-[0_25px_40px_rgba(225,6,0,0.8)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500 relative z-10"
              />

              {/* Exhaust Spark Indicator */}
              <div className="absolute bottom-2 right-12 bg-[#00D2BE] text-[#08080A] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_#00D2BE] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                🔥 NITRO BOOST READY
              </div>
            </div>

            {/* DYNAMIC F1 DRIVER HELMET AVATAR ROSTER HUD (2 TO 4 DRIVERS) */}
            <div className="w-full space-y-2 pt-2 border-t border-[#22222a]">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#00D2BE]">
                <span className="font-bold uppercase tracking-wider flex items-center space-x-1">
                  <UserPlus className="w-3.5 h-3.5 text-[#00D2BE]" />
                  <span>ACTIVE PADDOCK ROSTER ({teamSizeCount} DRIVERS)</span>
                </span>
                <span className="text-[#8A8A93]">LIVE TELEMETRY</span>
              </div>

              {/* Dynamic Avatars Grid (Renders 2, 3, or 4 Sleek Vector Lucide Driver Avatar Badges) */}
              <div className={`grid gap-2 transition-all duration-500 ${
                teamSizeCount === 2 ? 'grid-cols-2' : teamSizeCount === 3 ? 'grid-cols-3' : 'grid-cols-4'
              }`}>
                {/* Driver 1 (Captain) */}
                <div className="bg-[#14141a] border-2 border-[#E10600] p-2.5 rounded-xl shadow-[0_0_15px_rgba(225,6,0,0.4)] flex flex-col items-center text-center space-y-1 relative group">
                  <span className="text-[8px] bg-[#E10600] text-white px-1.5 py-0.5 rounded font-mono font-bold">#01 CAPTAIN</span>
                  <div className="w-10 h-10 rounded-full bg-[#08080A] border-2 border-[#E10600] flex items-center justify-center text-[#E10600] shadow-[0_0_10px_#E10600]">
                    <Crown className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-bold text-white truncate max-w-full font-mono">
                    {formData.fullName.trim() || 'Captain'}
                  </span>
                </div>

                {/* Driver 2 */}
                {teamSizeCount >= 2 && (
                  <div className="bg-[#14141a] border-2 border-[#00D2BE] p-2.5 rounded-xl shadow-[0_0_15px_rgba(0,210,190,0.3)] flex flex-col items-center text-center space-y-1 relative group">
                    <span className="text-[8px] bg-[#00D2BE] text-[#08080A] px-1.5 py-0.5 rounded font-mono font-bold">#02 DRIVER</span>
                    <div className="w-10 h-10 rounded-full bg-[#08080A] border-2 border-[#00D2BE] flex items-center justify-center text-[#00D2BE] shadow-[0_0_10px_#00D2BE]">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white truncate max-w-full font-mono">
                      {formData.driver2Name.trim() || 'Driver 2'}
                    </span>
                  </div>
                )}

                {/* Driver 3 */}
                {teamSizeCount >= 3 && (
                  <div className="bg-[#14141a] border-2 border-[#00D2BE] p-2.5 rounded-xl shadow-[0_0_15px_rgba(0,210,190,0.3)] flex flex-col items-center text-center space-y-1 relative group">
                    <span className="text-[8px] bg-[#00D2BE] text-[#08080A] px-1.5 py-0.5 rounded font-mono font-bold">#03 DRIVER</span>
                    <div className="w-10 h-10 rounded-full bg-[#08080A] border-2 border-[#00D2BE] flex items-center justify-center text-[#00D2BE] shadow-[0_0_10px_#00D2BE]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white truncate max-w-full font-mono">
                      {formData.driver3Name.trim() || 'Driver 3'}
                    </span>
                  </div>
                )}

                {/* Driver 4 */}
                {teamSizeCount >= 4 && (
                  <div className="bg-[#14141a] border-2 border-[#00D2BE] p-2.5 rounded-xl shadow-[0_0_15px_rgba(0,210,190,0.3)] flex flex-col items-center text-center space-y-1 relative group">
                    <span className="text-[8px] bg-[#00D2BE] text-[#08080A] px-1.5 py-0.5 rounded font-mono font-bold">#04 DRIVER</span>
                    <div className="w-10 h-10 rounded-full bg-[#08080A] border-2 border-[#00D2BE] flex items-center justify-center text-[#00D2BE] shadow-[0_0_10px_#00D2BE]">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white truncate max-w-full font-mono">
                      {formData.driver4Name.trim() || 'Driver 4'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#14141a] px-4 py-2 border border-[#22222a] rounded-xl text-xs text-[#8A8A93] font-mono w-full flex justify-between">
              <span>TEAM SQUAD LIMIT</span>
              <span className="text-[#00D2BE] font-bold">{teamSizeCount} DRIVERS SQUAD</span>
            </div>

          </div>

          {/* REAL-TIME DRIVER E-PASS CARD PREVIEW */}
          <div className="bg-[#0e0e13] border-2 border-[#00D2BE] p-6 rounded-3xl shadow-[0_0_40px_rgba(0,210,190,0.3)] space-y-4 relative overflow-hidden font-data">
            
            <div className="flex items-center justify-between border-b border-[#22222a] pb-3">
              <span className="text-xs font-mono font-bold text-[#00D2BE] flex items-center space-x-1.5">
                <Shield className="w-4 h-4 text-[#00D2BE]" />
                <span>LIVE TEAM E-PASS LICENSE</span>
              </span>
              <span className="text-[10px] bg-[#00D2BE]/20 text-[#00D2BE] px-2 py-0.5 font-bold rounded">
                LIVE PREVIEW
              </span>
            </div>

            <div className="space-y-3 bg-[#14141a] p-4 rounded-2xl border border-[#22222a]">
              <div>
                <span className="text-[10px] text-[#8A8A93] font-mono block">TEAM CALLSIGN</span>
                <span className="text-base font-bold text-white font-display uppercase">
                  {formData.teamName.trim() || `${formData.fullName.trim() || 'TEAM'} RACING`}
                </span>
              </div>

              <div className="space-y-1 border-t border-[#22222a] pt-2">
                <span className="text-[10px] text-[#00D2BE] font-mono font-bold block">REGISTERED TEAM DRIVERS ({teamSizeCount}):</span>
                <div className="text-xs text-white space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>1. {formData.fullName.trim() || 'Driver 1 (Captain)'}</span>
                    <span className="text-[10px] text-[#E10600] font-bold">CAPTAIN</span>
                  </div>
                  {teamSizeCount >= 2 && (
                    <div className="flex justify-between text-[#8A8A93]">
                      <span>2. {formData.driver2Name.trim() || 'Driver 2'}</span>
                      <span className="text-[10px] text-[#00D2BE]">DRIVER 2</span>
                    </div>
                  )}
                  {teamSizeCount >= 3 && (
                    <div className="flex justify-between text-[#8A8A93]">
                      <span>3. {formData.driver3Name.trim() || 'Driver 3'}</span>
                      <span className="text-[10px] text-[#00D2BE]">DRIVER 3</span>
                    </div>
                  )}
                  {teamSizeCount >= 4 && (
                    <div className="flex justify-between text-[#8A8A93]">
                      <span>4. {formData.driver4Name.trim() || 'Driver 4'}</span>
                      <span className="text-[10px] text-[#00D2BE]">DRIVER 4</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#22222a] pt-2.5 font-mono text-xs">
                <span className="text-[#8A8A93]">TOTAL FEE ({teamSizeCount} D):</span>
                <span className="text-[#00D2BE] font-bold">₹{baseFeePerDriver} × {teamSizeCount} = ₹{totalAmountPayable}</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: PADDOCK TELEMETRY INPUT FORM CONSOLE (COL-SPAN-7) */}
        <div className="lg:col-span-7 bg-[#0b0b0e] border-2 border-[#E10600] p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-5 font-data text-xs">
            
            {/* TEAM SIZE SELECTOR (2 TO 4 DRIVERS LIMIT) */}
            <div className="space-y-3 bg-[#14141a] p-5 border-2 border-[#00D2BE] rounded-2xl shadow-[0_0_20px_rgba(0,210,190,0.2)]">
              <div className="flex items-center justify-between">
                <label className="font-display text-xs text-[#00D2BE] font-bold tracking-wider flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#00D2BE]" />
                  <span>SELECT TEAM DRIVERS COUNT (2 TO 4 LIMIT) *</span>
                </label>
                <span className="text-[10px] font-mono bg-[#00D2BE]/20 text-[#00D2BE] px-2 py-0.5 rounded font-bold">
                  2–4 DRIVERS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { count: 2, label: '2 DRIVERS TEAM', sub: 'Driver 1 & Driver 2' },
                  { count: 3, label: '3 DRIVERS TEAM', sub: 'Driver 1, 2 & 3' },
                  { count: 4, label: '4 DRIVERS SQUAD', sub: 'Full 4-Driver Roster' }
                ].map((t) => (
                  <button
                    key={t.count}
                    type="button"
                    onClick={() => setTeamSizeCount(t.count)}
                    className={`py-3 px-2 border-2 text-center rounded-xl transition-all ${
                      teamSizeCount === t.count
                        ? 'bg-[#08080A] border-[#00D2BE] text-white shadow-[0_0_15px_rgba(0,210,190,0.4)] scale-105 font-bold'
                        : 'bg-[#08080A]/60 border-[#22222a] text-[#8A8A93] hover:border-white'
                    }`}
                  >
                    <span className="block text-xs font-display">{t.label}</span>
                    <span className="block text-[9px] font-mono text-[#00D2BE] mt-0.5">{t.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TEAM NAME */}
            <div className="space-y-2">
              <label className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                <Flag className="w-4 h-4 text-[#00D2BE]" />
                <span>TEAM / SQUAD NAME *</span>
              </label>
              <input
                type="text"
                value={formData.teamName}
                onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="e.g. Apex Racing Tech / Scuderia Monza"
                className="w-full bg-[#14141a] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3.5 outline-none rounded-xl transition-all"
              />
            </div>

            {/* DRIVER 1 (CAPTAIN) */}
            <div className="space-y-3 bg-[#14141a] p-4 border border-[#22222a] rounded-2xl">
              <div className="flex justify-between items-center text-[#E10600] font-mono font-bold text-[11px]">
                <span className="flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-[#E10600]" />
                  <span>DRIVER 1 (TEAM CAPTAIN) *</span>
                </span>
                <span className="bg-[#E10600]/20 text-[#E10600] px-2 py-0.5 rounded text-[9px]">CAPTAIN</span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Driver 1 Full Name *"
                  className={`w-full bg-[#08080A] border-2 text-white font-body text-xs px-4 py-3 outline-none rounded-xl transition-all ${
                    touched.fullName && !isNameValid ? 'border-[#E10600]' : 'border-[#22222a] focus:border-[#00D2BE]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => handleBlur('email')}
                  placeholder="Captain Email *"
                  className={`w-full bg-[#08080A] border-2 text-white font-body text-xs px-4 py-3 outline-none rounded-xl transition-all ${
                    touched.email && !isEmailValid ? 'border-[#E10600]' : 'border-[#22222a] focus:border-[#00D2BE]'
                  }`}
                />

                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  onBlur={() => handleBlur('phone')}
                  placeholder="Captain Phone / WhatsApp *"
                  className={`w-full bg-[#08080A] border-2 text-white font-body text-xs px-4 py-3 outline-none rounded-xl transition-all ${
                    touched.phone && !isPhoneValid ? 'border-[#E10600]' : 'border-[#22222a] focus:border-[#00D2BE]'
                  }`}
                />
              </div>
            </div>

            {/* DRIVER 2 (SECONDARY DRIVER) */}
            {teamSizeCount >= 2 && (
              <div className="space-y-3 bg-[#14141a] p-4 border border-[#00D2BE]/40 rounded-2xl">
                <div className="flex justify-between items-center text-[#00D2BE] font-mono font-bold text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <UserPlus className="w-4 h-4 text-[#00D2BE]" />
                    <span>DRIVER 2 DETAILS *</span>
                  </span>
                  <span className="bg-[#00D2BE]/20 text-[#00D2BE] px-2 py-0.5 rounded text-[9px]">DRIVER 2</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={formData.driver2Name}
                    onChange={e => setFormData({ ...formData, driver2Name: e.target.value })}
                    placeholder="Driver 2 Full Name *"
                    className="w-full bg-[#08080A] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3 outline-none rounded-xl"
                  />

                  <input
                    type="tel"
                    value={formData.driver2Phone}
                    onChange={e => setFormData({ ...formData, driver2Phone: e.target.value })}
                    placeholder="Driver 2 Phone / WhatsApp"
                    className="w-full bg-[#08080A] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3 outline-none rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* DRIVER 3 (TERTIARY DRIVER) */}
            {teamSizeCount >= 3 && (
              <div className="space-y-3 bg-[#14141a] p-4 border border-[#00D2BE]/40 rounded-2xl">
                <div className="flex justify-between items-center text-[#00D2BE] font-mono font-bold text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <UserPlus className="w-4 h-4 text-[#00D2BE]" />
                    <span>DRIVER 3 DETAILS *</span>
                  </span>
                  <span className="bg-[#00D2BE]/20 text-[#00D2BE] px-2 py-0.5 rounded text-[9px]">DRIVER 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={formData.driver3Name}
                    onChange={e => setFormData({ ...formData, driver3Name: e.target.value })}
                    placeholder="Driver 3 Full Name *"
                    className="w-full bg-[#08080A] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3 outline-none rounded-xl"
                  />

                  <input
                    type="tel"
                    value={formData.driver3Phone}
                    onChange={e => setFormData({ ...formData, driver3Phone: e.target.value })}
                    placeholder="Driver 3 Phone / WhatsApp"
                    className="w-full bg-[#08080A] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3 outline-none rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* DRIVER 4 (QUARTERLY DRIVER) */}
            {teamSizeCount >= 4 && (
              <div className="space-y-3 bg-[#14141a] p-4 border border-[#00D2BE]/40 rounded-2xl">
                <div className="flex justify-between items-center text-[#00D2BE] font-mono font-bold text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <UserPlus className="w-4 h-4 text-[#00D2BE]" />
                    <span>DRIVER 4 DETAILS *</span>
                  </span>
                  <span className="bg-[#00D2BE]/20 text-[#00D2BE] px-2 py-0.5 rounded text-[9px]">DRIVER 4 (MAX)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={formData.driver4Name}
                    onChange={e => setFormData({ ...formData, driver4Name: e.target.value })}
                    placeholder="Driver 4 Full Name *"
                    className="w-full bg-[#08080A] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3 outline-none rounded-xl"
                  />

                  <input
                    type="tel"
                    value={formData.driver4Phone}
                    onChange={e => setFormData({ ...formData, driver4Phone: e.target.value })}
                    placeholder="Driver 4 Phone / WhatsApp"
                    className="w-full bg-[#08080A] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3 outline-none rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* College Name & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                  <Building className="w-4 h-4 text-[#00D2BE]" />
                  <span>COLLEGE / INSTITUTION *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={e => setFormData({ ...formData, organization: e.target.value })}
                  onBlur={() => handleBlur('organization')}
                  placeholder="e.g. Stanford Institute of Technology"
                  className={`w-full bg-[#14141a] border-2 text-white font-body text-xs px-4 py-3.5 outline-none rounded-xl transition-all ${
                    touched.organization && !isOrgValid
                      ? 'border-[#E10600]'
                      : 'border-[#22222a] focus:border-[#00D2BE]'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                  <span>YEAR</span>
                </label>
                <select
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-[#14141a] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3.5 outline-none rounded-xl"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>

            {/* Track Category */}
            <div className="space-y-4">
              <label className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                <Flag className="w-4 h-4 text-[#E10600]" />
                <span>SELECT CHAMPIONSHIP TRACK *</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChampionshipChange('ENGINEERING CHAMPIONSHIP')}
                  className={`p-4 border-2 text-left transition-all rounded-xl ${
                    formData.championship === 'ENGINEERING CHAMPIONSHIP'
                      ? 'bg-[#14141a] border-[#E10600] text-white shadow-xl'
                      : 'bg-[#14141a]/50 border-[#22222a] text-[#8A8A93] hover:border-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-bold text-xs">TECHNICAL TRACK</span>
                    <span className="bg-[#E10600] text-white text-[9px] font-bold px-2 py-0.5 rounded">₹80</span>
                  </div>
                  <div className="text-white font-bold text-sm">ENGINEERING</div>
                  <div className="text-[10px] text-[#8A8A93] mt-1">Coding · Prompts · Hackathon</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleChampionshipChange('DAYTONA CHAMPIONSHIP')}
                  className={`p-4 border-2 text-left transition-all rounded-xl ${
                    formData.championship === 'DAYTONA CHAMPIONSHIP'
                      ? 'bg-[#14141a] border-[#00D2BE] text-white shadow-xl'
                      : 'bg-[#14141a]/50 border-[#22222a] text-[#8A8A93] hover:border-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-bold text-xs">DAYTONA TRACK</span>
                    <span className="bg-[#00D2BE] text-[#08080A] text-[9px] font-bold px-2 py-0.5 rounded">₹50</span>
                  </div>
                  <div className="text-white font-bold text-sm">DAYTONA</div>
                  <div className="text-[10px] text-[#8A8A93] mt-1">Charades · Movies · Telemetry</div>
                </button>
              </div>

              {/* SPECIFIC SUB-EVENT CATEGORY SELECTOR */}
              <div className="space-y-2 pt-2">
                <label className="font-display text-xs text-[#00D2BE] font-bold tracking-wider flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#00D2BE]" />
                    <span>SELECT SPECIFIC COMPETITION EVENT *</span>
                  </span>
                  <span className="text-[10px] text-[#8A8A93] font-mono">SUB-EVENT</span>
                </label>

                {formData.championship === 'ENGINEERING CHAMPIONSHIP' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'POLE POSITION CHALLENGE (Coding)', short: '1. Coding Challenge', icon: '💻' },
                      { name: 'PIT STRATEGY CHALLENGE (Prompt Engineering)', short: '2. Prompt Engineering', icon: '🧠' },
                      { name: 'CONSTRUCTORS GARAGE (Hackathon)', short: '3. Hackathon Prototype', icon: '🛠️' }
                    ].map(ev => (
                      <button
                        key={ev.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: ev.name as EventCategory })}
                        className={`p-3 border-2 rounded-xl text-left font-mono transition-all text-xs flex flex-col justify-between space-y-1 ${
                          formData.category === ev.name
                            ? 'bg-[#14141a] border-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)] font-bold'
                            : 'bg-[#08080A] border-[#22222a] text-[#8A8A93] hover:border-white hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{ev.icon}</span>
                          {formData.category === ev.name && <Check className="w-3.5 h-3.5 text-[#E10600]" />}
                        </div>
                        <span className="text-[11px] leading-tight block">{ev.short}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'RADIO COMMUNICATION (Dumb Charades)', short: '1. Dumb Charades', icon: '📻' },
                      { name: 'LIGHTS OUT! (Guess Movie in 1 Sec)', short: '2. Lights Out Movie', icon: '🎬' },
                      { name: 'PIT STOP CHALLENGE (Minute to Win It)', short: '3. Pit Stop Task', icon: '⏱️' },
                      { name: 'TYRE CHANGE CHALLENGE (Bottle Challenge)', short: '4. Tyre Bottle Task', icon: '🍾' },
                      { name: 'TELEMETRY TEST (Typing Competition)', short: '5. Telemetry Typing', icon: '⌨️' }
                    ].map(ev => (
                      <button
                        key={ev.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: ev.name as EventCategory })}
                        className={`p-3 border-2 rounded-xl text-left font-mono transition-all text-xs flex flex-col justify-between space-y-1 ${
                          formData.category === ev.name
                            ? 'bg-[#14141a] border-[#00D2BE] text-white shadow-[0_0_15px_rgba(0,210,190,0.5)] font-bold'
                            : 'bg-[#08080A] border-[#22222a] text-[#8A8A93] hover:border-white hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{ev.icon}</span>
                          {formData.category === ev.name && <Check className="w-3.5 h-3.5 text-[#00D2BE]" />}
                        </div>
                        <span className="text-[11px] leading-tight block">{ev.short}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PROMINENT TOTAL ENTRY FEE PAYABLE SUMMARY BOX */}
            <div className="bg-[#08080A] border-2 border-[#00D2BE] p-4 sm:p-5 rounded-2xl shadow-[0_0_30px_rgba(0,210,190,0.4)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#00D2BE] font-mono font-bold uppercase tracking-widest flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00D2BE] animate-ping" />
                  <span>TOTAL AMOUNT PAYABLE</span>
                </span>
                <div className="font-display text-xs text-white font-bold uppercase mt-1">
                  {formData.championship} · <span className="text-[#00D2BE]">{teamSizeCount} DRIVERS SQUAD</span>
                </div>
                <div className="text-[10px] text-[#8A8A93] font-mono mt-0.5">
                  CALCULATION: ₹{baseFeePerDriver} PER DRIVER × {teamSizeCount} DRIVERS
                </div>
              </div>

              <div className="bg-[#14141a] border border-[#00D2BE] px-4 py-2 rounded-xl text-right flex flex-col items-end self-end sm:self-auto">
                <span className="text-[9px] text-[#8A8A93] font-mono">TOTAL DEPOSIT:</span>
                <span className="font-display text-3xl font-black text-[#00D2BE] drop-shadow-[0_0_12px_#00D2BE]">
                  ₹{totalAmountPayable}
                </span>
              </div>
            </div>

            {/* UTR Deposit */}
            <div className="space-y-3 bg-[#14141a] p-5 border border-[#22222a] rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#22222a] pb-3 gap-2">
                <span className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-[#00D2BE]" />
                  <span>ENTER 12-DIGIT UTR DEPOSIT NUMBER *</span>
                </span>
                <span className="text-xs text-[#00D2BE] font-mono font-bold">
                  UPI: {import.meta.env.VITE_UPI_ID || 'formula-ai@upi'}
                </span>
              </div>

              <div>
                <label className="block text-[10px] text-[#8A8A93] font-mono mb-1">DEPOSIT UTR / TRANSACTION REF NO. *</label>
                <input
                  type="text"
                  required
                  value={formData.utrNumber}
                  onChange={e => setFormData({ ...formData, utrNumber: e.target.value })}
                  onBlur={() => handleBlur('utrNumber')}
                  placeholder="e.g. 423910582914"
                  className={`w-full bg-[#08080A] border-2 text-white font-mono text-xs px-4 py-3.5 outline-none rounded-xl transition-all ${
                    touched.utrNumber && !isUtrValid
                      ? 'border-[#E10600]'
                      : 'border-[#22222a] focus:border-[#00D2BE]'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreedTerms}
                  onChange={e => setFormData({ ...formData, agreedTerms: e.target.checked })}
                  className="w-4 h-4 accent-[#E10600]"
                />
                <label htmlFor="terms" className="text-[11px] text-[#8A8A93] cursor-pointer">
                  I confirm that all entered team driver telemetry details and UTR deposit are authentic.
                </label>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormComplete}
                className={`w-full py-4 font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition-all rounded-xl shadow-2xl ${
                  isFormComplete
                    ? 'bg-[#E10600] hover:bg-[#ff0700] text-white shadow-[0_0_30px_rgba(225,6,0,0.7)] border-l-4 border-white'
                    : 'bg-[#22222a] text-[#8A8A93] cursor-not-allowed'
                }`}
              >
                {isFormComplete ? `🏁 SUBMIT ${teamSizeCount}-DRIVER TEAM REGISTRATION & CROSS FINISH LINE 🏁` : `FILL ALL FIELDS TO UNLOCK SUBMISSION (${validFieldsCount}/7)`}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};



