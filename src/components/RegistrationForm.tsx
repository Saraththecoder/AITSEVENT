import React, { useState, useEffect } from 'react';
import { DriverRegistration, ChampionshipType, EventCategory } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { User, Mail, Phone, Building, Flag, CheckCircle2, CreditCard, RadioTower, Shield, Gauge, Sparkles, Check, ChevronRight, Users, UserPlus, UserCheck, Crown, Zap, Award, Copy, ExternalLink, QrCode, Smartphone, ArrowUpRight } from 'lucide-react';
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
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [turboEvents, setTurboEvents] = useState<string[]>([
    'RADIO COMMUNICATION (Dumb Charades)',
    'LIGHTS OUT! (Guess Movie in 1 Sec)',
    'PIT STOP CHALLENGE (Minute to Win It)'
  ]);

  const toggleTurboEvent = (eventName: string) => {
    if (turboEvents.includes(eventName)) {
      if (turboEvents.length > 1) {
        setTurboEvents(prev => prev.filter(e => e !== eventName));
      }
    } else {
      if (turboEvents.length < 3) {
        setTurboEvents(prev => [...prev, eventName]);
      } else {
        // Swap oldest selection to maintain exactly 3 selected events
        setTurboEvents(prev => [...prev.slice(1), eventName]);
      }
    }
  };
  
  const upiId = import.meta.env.VITE_UPI_ID || '9505198204-2@ybl';
  const upiName = import.meta.env.VITE_UPI_NAME || 'FORMULA-AI 2026 RACE CONTROL';
  
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
    category: (initialCategory || (initialChampionship === 'TURBO COMBO (3 Non-Tech Events)' ? 'TURBO COMBO (3 Non-Tech Events)' : initialChampionship === 'PODIUM COMBO (4 Non-Tech Events)' ? 'PODIUM COMBO (4 Non-Tech Events)' : 'POLE POSITION CHALLENGE (Coding)')) as EventCategory,
    utrNumber: '',
    agreedTerms: false
  });

  const isSoloEvent = formData.category === 'PIT STRATEGY CHALLENGE (Prompt Engineering)' || formData.category === 'TELEMETRY TEST (Typing Competition)';

  useEffect(() => {
    if (isSoloEvent) {
      if (teamSizeCount !== 1) setTeamSizeCount(1);
    } else {
      if (teamSizeCount === 1) setTeamSizeCount(2);
    }
  }, [formData.category, isSoloEvent]);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isNameValid = validateFullName(formData.fullName);
  const isEmailValid = validateEmail(formData.email);
  const isPhoneValid = validatePhone(formData.phone);
  const isUtrValid = validateUtr(formData.utrNumber);

  // Additional Drivers Validation based on Team Size (2 to 4 Limit)
  const isDriver2Valid = teamSizeCount < 2 || validateFullName(formData.driver2Name);
  const isDriver3Valid = teamSizeCount < 3 || validateFullName(formData.driver3Name);
  const isDriver4Valid = teamSizeCount < 4 || validateFullName(formData.driver4Name);

  const requiredFields = [
    isNameValid,
    isEmailValid,
    isPhoneValid,
    ...(teamSizeCount >= 2 ? [isDriver2Valid] : []),
    ...(teamSizeCount >= 3 ? [isDriver3Valid] : []),
    ...(teamSizeCount >= 4 ? [isDriver4Valid] : []),
    isUtrValid,
    formData.agreedTerms
  ];

  const validFieldsCount = requiredFields.filter(Boolean).length;
  const totalRequiredFields = requiredFields.length;

  const isFormComplete = validFieldsCount === totalRequiredFields;
  const progressPercent = Math.round((validFieldsCount / totalRequiredFields) * 100);

  // Live Tachometer RPM and Speed calculations
  const rpmValue = Math.min(15000, Math.round((validFieldsCount / totalRequiredFields) * 15000));
  const currentSpeed = Math.round((validFieldsCount / totalRequiredFields) * 352.4);
  const baseFeePerDriver = 
    formData.championship === 'ENGINEERING CHAMPIONSHIP' ? 80 :
    formData.championship === 'PODIUM COMBO (4 Non-Tech Events)' ? 150 :
    formData.championship === 'TURBO COMBO (3 Non-Tech Events)' ? 120 : 50;

  const totalAmountPayable = baseFeePerDriver * teamSizeCount;

  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${totalAmountPayable}&cu=INR&tn=${encodeURIComponent(`FORMULA-AI ${formData.championship}`)}`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const [formError, setFormError] = useState<string>('');

  const handleChampionshipChange = (champ: ChampionshipType) => {
    if (champ === 'ENGINEERING CHAMPIONSHIP') {
      setFormData(prev => ({
        ...prev,
        championship: champ,
        category: 'POLE POSITION CHALLENGE (Coding)'
      }));
    } else if (champ === 'PODIUM COMBO (4 Non-Tech Events)') {
      setFormData(prev => ({
        ...prev,
        championship: champ,
        category: 'PODIUM COMBO (4 Non-Tech Events)'
      }));
    } else if (champ === 'TURBO COMBO (3 Non-Tech Events)') {
      setFormData(prev => ({
        ...prev,
        championship: champ,
        category: 'TURBO COMBO (3 Non-Tech Events)'
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
    setFormError('');

    // Touch all fields to reveal validation feedback
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      driver2Name: true,
      driver3Name: true,
      driver4Name: true,
      utrNumber: true,
      agreedTerms: true
    });

    if (!isNameValid) {
      setFormError('⚠️ Please enter Captain / Driver 1 Full Name (at least 2 characters).');
      return;
    }
    if (!isEmailValid) {
      setFormError('⚠️ Please enter a valid Email Address (e.g. driver@example.com).');
      return;
    }
    if (!isPhoneValid) {
      setFormError('⚠️ Please enter a valid 10-digit Mobile / WhatsApp Number.');
      return;
    }
    if (teamSizeCount >= 2 && !isDriver2Valid) {
      setFormError('⚠️ Please enter Driver 2 Full Name.');
      return;
    }
    if (teamSizeCount >= 3 && !isDriver3Valid) {
      setFormError('⚠️ Please enter Driver 3 Full Name.');
      return;
    }
    if (teamSizeCount >= 4 && !isDriver4Valid) {
      setFormError('⚠️ Please enter Driver 4 Full Name.');
      return;
    }

    // Auto-generate transaction reference if left blank for seamless testing
    let utr = formData.utrNumber.trim();
    if (!utr) {
      utr = `PAY-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    }

    // SANITIZE ALL INPUT FIELDS TO PREVENT XSS AND HTML INJECTION
    const cleanFullName = sanitizeInput(formData.fullName);
    const cleanEmail = sanitizeInput(formData.email).toLowerCase();
    const cleanPhone = sanitizeInput(formData.phone);
    const cleanOrg = sanitizeInput(formData.organization) || 'Formula-AI Paddock';
    const cleanTeamName = sanitizeInput(formData.teamName) || `${cleanFullName}'s Squad`;
    const cleanUtr = sanitizeInput(utr).toUpperCase();

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
                teamSizeCount === 2 ? 'grid-cols-2' : teamSizeCount === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
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
            
            {/* TEAM SIZE ROSTER SELECTOR */}
            <div className="space-y-3 bg-[#14141a] p-4 sm:p-5 border-2 border-[#00D2BE] rounded-2xl shadow-[0_0_20px_rgba(0,210,190,0.2)]">
              <div className="flex items-center justify-between">
                <label className="font-display text-xs text-[#00D2BE] font-bold tracking-wider flex items-center space-x-2">
                  <Users className="w-4 h-4 text-[#00D2BE]" />
                  <span>{isSoloEvent ? 'INDIVIDUAL DRIVER ROSTER *' : 'SELECT TEAM DRIVERS COUNT (2 TO 4 LIMIT) *'}</span>
                </label>
                <span className="text-[10px] font-mono bg-[#00D2BE]/20 text-[#00D2BE] px-2 py-0.5 rounded font-bold">
                  {isSoloEvent ? '1 SOLO DRIVER' : '2–4 DRIVERS'}
                </span>
              </div>

              {isSoloEvent ? (
                <div className="bg-[#08080A] p-3.5 border-2 border-[#00D2BE] rounded-xl flex items-center justify-between font-mono text-xs text-white">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#00D2BE]" />
                    <span>INDIVIDUAL DRIVER ENTRY (1 Driver Solo)</span>
                  </div>
                  <span className="text-[10px] bg-[#00D2BE] text-[#08080A] font-bold px-2.5 py-1 rounded">
                    SOLO ENTRY ONLY
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
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
              )}
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

            {/* Year & Branch Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                  <span>YEAR / ACADEMIC LEVEL</span>
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
                  <option value="Other">Other / Alum</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                  <span>BRANCH / DEPARTMENT</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science & AI / Mechanical"
                  className="w-full bg-[#14141a] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-body text-xs px-4 py-3.5 outline-none rounded-xl"
                />
              </div>
            </div>

            {/* Track Category & Combo Packages */}
            <div className="space-y-4">
              <label className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                <Flag className="w-4 h-4 text-[#E10600]" />
                <span>SELECT CHAMPIONSHIP TRACK OR COMBO PACKAGE *</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. ENGINEERING CHAMPIONSHIP */}
                <button
                  type="button"
                  onClick={() => handleChampionshipChange('ENGINEERING CHAMPIONSHIP')}
                  className={`p-4 border-2 text-left transition-all rounded-xl ${
                    formData.championship === 'ENGINEERING CHAMPIONSHIP'
                      ? 'bg-[#14141a] border-[#E10600] text-white shadow-xl scale-[1.01]'
                      : 'bg-[#14141a]/50 border-[#22222a] text-[#8A8A93] hover:border-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-bold text-xs">TECHNICAL TRACK</span>
                    <span className="bg-[#E10600] text-white text-[9px] font-bold px-2 py-0.5 rounded">₹80 / DRIVER</span>
                  </div>
                  <div className="text-white font-bold text-sm">ENGINEERING</div>
                  <div className="text-[10px] text-[#8A8A93] mt-1">Coding · Prompts · Hackathon</div>
                </button>

                {/* 2. DAYTONA CHAMPIONSHIP */}
                <button
                  type="button"
                  onClick={() => handleChampionshipChange('DAYTONA CHAMPIONSHIP')}
                  className={`p-4 border-2 text-left transition-all rounded-xl ${
                    formData.championship === 'DAYTONA CHAMPIONSHIP'
                      ? 'bg-[#14141a] border-[#00D2BE] text-white shadow-xl scale-[1.01]'
                      : 'bg-[#14141a]/50 border-[#22222a] text-[#8A8A93] hover:border-white'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-bold text-xs">DAYTONA SINGLE</span>
                    <span className="bg-[#00D2BE] text-[#08080A] text-[9px] font-bold px-2 py-0.5 rounded">₹50 / DRIVER</span>
                  </div>
                  <div className="text-white font-bold text-sm">DAYTONA TRACK</div>
                  <div className="text-[10px] text-[#8A8A93] mt-1">1 Non-Tech Event Entry</div>
                </button>

                {/* 3. PODIUM COMBO (4 NON-TECH EVENTS) */}
                <button
                  type="button"
                  onClick={() => handleChampionshipChange('PODIUM COMBO (4 Non-Tech Events)')}
                  className={`p-4 border-2 text-left transition-all rounded-xl relative ${
                    formData.championship === 'PODIUM COMBO (4 Non-Tech Events)'
                      ? 'bg-[#14141a] border-[#22C55E] text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[1.01]'
                      : 'bg-[#14141a]/50 border-[#22222a] text-[#8A8A93] hover:border-[#22C55E]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-bold text-xs text-[#22C55E] flex items-center space-x-1">
                      <span>🏎️ PODIUM COMBO</span>
                      <span className="bg-[#22C55E]/20 text-[#22C55E] text-[8px] px-1.5 py-0.5 rounded">25% OFF</span>
                    </span>
                    <div className="text-right">
                      <span className="bg-[#22C55E] text-[#08080A] text-[9px] font-bold px-2 py-0.5 rounded">₹150 / DRIVER</span>
                    </div>
                  </div>
                  <div className="text-white font-bold text-sm">4 NON-TECH EVENTS</div>
                  <div className="text-[10px] text-[#22C55E] mt-1">₹150 per driver · 4 Events Pass</div>
                </button>

                {/* 4. TURBO COMBO (3 NON-TECH EVENTS) */}
                <button
                  type="button"
                  onClick={() => handleChampionshipChange('TURBO COMBO (3 Non-Tech Events)')}
                  className={`p-4 border-2 text-left transition-all rounded-xl relative ${
                    formData.championship === 'TURBO COMBO (3 Non-Tech Events)'
                      ? 'bg-[#14141a] border-[#00D2BE] text-white shadow-[0_0_20px_rgba(0,210,190,0.4)] scale-[1.01]'
                      : 'bg-[#14141a]/50 border-[#22222a] text-[#8A8A93] hover:border-[#00D2BE]'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-bold text-xs text-[#00D2BE] flex items-center space-x-1">
                      <span>⚡ TURBO COMBO</span>
                      <span className="bg-[#00D2BE]/20 text-[#00D2BE] text-[8px] px-1.5 py-0.5 rounded">20% OFF</span>
                    </span>
                    <div className="text-right">
                      <span className="bg-[#00D2BE] text-[#08080A] text-[9px] font-bold px-2 py-0.5 rounded">₹120 / DRIVER</span>
                    </div>
                  </div>
                  <div className="text-white font-bold text-sm">3 NON-TECH EVENTS</div>
                  <div className="text-[10px] text-[#00D2BE] mt-1">₹120 per driver · Pick 3 Events</div>
                </button>
              </div>

              {/* SPECIFIC SUB-EVENT CATEGORY SELECTOR */}
              <div className="space-y-2 pt-2">
                <label className="font-display text-xs text-[#00D2BE] font-bold tracking-wider flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#00D2BE]" />
                    <span>SELECT SPECIFIC COMPETITION EVENT OR COMBO PACKAGE *</span>
                  </span>
                  <span className="text-[10px] text-[#8A8A93] font-mono">SELECTION</span>
                </label>

                {formData.championship === 'PODIUM COMBO (4 Non-Tech Events)' ? (
                  <div className="space-y-3 bg-[#08080A] p-4 border border-[#22C55E]/40 rounded-xl font-data">
                    <div className="flex items-center space-x-2 text-[#22C55E] text-xs font-mono font-bold">
                      <Sparkles className="w-4 h-4 text-[#22C55E]" />
                      <span>🏎️ PODIUM COMBO UNLOCKED (₹150 · SAVE ₹50 | 25% OFF)</span>
                    </div>
                    <p className="text-[11px] text-[#8A8A93] font-mono">
                      Includes <strong>all 4 Non-Tech Events</strong> below! One single combo registration unlocks your quad-race paddock pass.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-white">
                      <div className="bg-[#14141a] p-2.5 rounded-lg border border-[#22C55E]/40 flex items-center justify-between">
                        <span>📻 1. Radio Communication (Charades)</span>
                        <Check className="w-4 h-4 text-[#22C55E]" />
                      </div>
                      <div className="bg-[#14141a] p-2.5 rounded-lg border border-[#22C55E]/40 flex items-center justify-between">
                        <span>🎬 2. Lights Out! (Movie Guess)</span>
                        <Check className="w-4 h-4 text-[#22C55E]" />
                      </div>
                      <div className="bg-[#14141a] p-2.5 rounded-lg border border-[#22C55E]/40 flex items-center justify-between">
                        <span>⏱️ 3. Pit Stop Challenge (Minute to Win)</span>
                        <Check className="w-4 h-4 text-[#22C55E]" />
                      </div>
                      <div className="bg-[#14141a] p-2.5 rounded-lg border border-[#22C55E]/40 flex items-center justify-between">
                        <span>🍾 4. Tyre Change (Bottle Challenge)</span>
                        <Check className="w-4 h-4 text-[#22C55E]" />
                      </div>
                    </div>
                    <div className="text-[10px] text-[#E10600] font-mono bg-[#E10600]/10 p-2 rounded-lg border border-[#E10600]/30 flex items-center space-x-1">
                      <span>🚫 Note: Telemetry (Typing Test) is excluded from combo deals as per rules.</span>
                    </div>
                  </div>
                ) : formData.championship === 'TURBO COMBO (3 Non-Tech Events)' ? (
                  <div className="space-y-3 bg-[#08080A] p-4 border border-[#00D2BE]/40 rounded-xl font-data">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22222a] pb-2.5">
                      <div className="flex items-center space-x-2 text-[#00D2BE] text-xs font-mono font-bold">
                        <Zap className="w-4 h-4 text-[#00D2BE]" />
                        <span>⚡ TURBO COMBO UNLOCKED (₹120 · SAVE ₹30 | 20% OFF)</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 self-start sm:self-auto ${
                        turboEvents.length === 3
                          ? 'bg-[#00D2BE] text-[#08080A] shadow-[0_0_10px_#00D2BE]'
                          : 'bg-[#F5A623] text-[#08080A]'
                      }`}>
                        <span>{turboEvents.length}/3 EVENTS SELECTED</span>
                        {turboEvents.length === 3 && <span>✓</span>}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8A8A93] font-mono">
                      Tap below to pick <strong>ANY 3 NON-TECH EVENTS</strong> for your Turbo Combo package:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono text-white">
                      {[
                        { name: 'RADIO COMMUNICATION (Dumb Charades)', short: '📻 1. Radio Communication (Charades)' },
                        { name: 'LIGHTS OUT! (Guess Movie in 1 Sec)', short: '🎬 2. Lights Out (Movie Guess)' },
                        { name: 'PIT STOP CHALLENGE (Minute to Win It)', short: '⏱️ 3. Pit Stop Challenge' },
                        { name: 'TYRE CHANGE CHALLENGE (Bottle Challenge)', short: '🍾 4. Tyre Change Challenge' }
                      ].map(ev => {
                        const isSelected = turboEvents.includes(ev.name);
                        return (
                          <button
                            key={ev.name}
                            type="button"
                            onClick={() => toggleTurboEvent(ev.name)}
                            className={`p-3 rounded-xl text-left font-mono transition-all text-xs flex items-center justify-between border-2 ${
                              isSelected
                                ? 'bg-[#14141a] border-[#00D2BE] text-white font-bold shadow-[0_0_15px_rgba(0,210,190,0.3)] scale-[1.01]'
                                : 'bg-[#14141a]/40 border-[#22222a] text-[#8A8A93] hover:text-white hover:border-[#00D2BE]/50'
                            }`}
                          >
                            <span className="truncate max-w-[200px] sm:max-w-none">{ev.short}</span>
                            {isSelected ? (
                              <span className="w-5 h-5 rounded-full bg-[#00D2BE] text-[#08080A] flex items-center justify-center font-bold text-[10px] flex-shrink-0 ml-2">
                                ✓
                              </span>
                            ) : (
                              <span className="w-5 h-5 rounded-full border border-[#22222a] text-[10px] flex items-center justify-center text-[#8A8A93] flex-shrink-0 ml-2">
                                +
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-[10px] text-[#E10600] font-mono bg-[#E10600]/10 p-2 rounded-lg border border-[#E10600]/30 flex items-center space-x-1">
                      <span>🚫 Note: Telemetry (Typing Test) is excluded from combo deals as per rules.</span>
                    </div>
                  </div>
                ) : formData.championship === 'ENGINEERING CHAMPIONSHIP' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'POLE POSITION CHALLENGE (Coding)', short: '1. POLE POSITION CHALLENGE (Coding Competition)', icon: '💻' },
                      { name: 'PIT STRATEGY CHALLENGE (Prompt Engineering)', short: '2. PIT STRATEGY CHALLENGE (Prompt Engineering)', icon: '🧠' },
                      { name: 'CONSTRUCTORS GARAGE (Hackathon)', short: '3. CONSTRUCTORS GARAGE (Hackathon Prototype)', icon: '🛠️' }
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
                      { name: 'RADIO COMMUNICATION (Dumb Charades)', short: '1. Radio Communication (Charades)', icon: '📻' },
                      { name: 'LIGHTS OUT! (Guess Movie in 1 Sec)', short: '2. Lights Out! (Movie Guess)', icon: '🎬' },
                      { name: 'PIT STOP CHALLENGE (Minute to Win It)', short: '3. Pit Stop Challenge (Minute to Win)', icon: '⏱️' },
                      { name: 'TYRE CHANGE CHALLENGE (Bottle Challenge)', short: '4. Tyre Change (Bottle Challenge)', icon: '🍾' },
                      { name: 'TELEMETRY TEST (Typing Competition)', short: '5. Telemetry Test (Typing Test)', icon: '⌨️' }
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
                  CALCULATION: ₹{baseFeePerDriver} PER DRIVER × {teamSizeCount} {teamSizeCount > 1 ? 'DRIVERS' : 'DRIVER'}
                </div>
              </div>

              <div className="bg-[#14141a] border border-[#00D2BE] px-4 py-2 rounded-xl text-right flex flex-col items-end self-end sm:self-auto">
                <span className="text-[9px] text-[#8A8A93] font-mono">TOTAL DEPOSIT:</span>
                <span className="font-display text-3xl font-black text-[#00D2BE] drop-shadow-[0_0_12px_#00D2BE]">
                  ₹{totalAmountPayable}
                </span>
              </div>
            </div>

            {/* 4. UPI PAYMENT REDIRECT & DEPOSIT CONSOLE */}
            <div className="space-y-4 bg-[#14141a] p-5 border-2 border-[#00D2BE]/60 rounded-2xl shadow-[0_0_30px_rgba(0,210,190,0.15)]">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#22222a] pb-3 gap-2">
                <span className="font-display text-xs text-white font-bold tracking-wider flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-[#00D2BE]" />
                  <span>PAYMENT TELEMETRY & UPI REDIRECT</span>
                </span>
                <span className="text-[10px] bg-[#00D2BE]/20 text-[#00D2BE] px-2.5 py-0.5 font-mono font-bold rounded flex items-center space-x-1">
                  <Smartphone className="w-3 h-3" />
                  <span>INSTANT UPI REDIRECT</span>
                </span>
              </div>

              {/* UPI ID Banner + Quick Copy Widget */}
              <div className="bg-[#08080A] border border-[#22222a] p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-[#8A8A93] font-mono block">OFFICIAL EVENT UPI ID</span>
                  <div className="font-mono text-sm sm:text-base font-bold text-[#00D2BE] tracking-wider flex items-center space-x-2">
                    <span>{upiId}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyUpiId}
                  className={`px-4 py-2 text-xs font-mono font-bold border transition-all rounded-xl flex items-center space-x-1.5 self-start sm:self-auto ${
                    copiedUpi
                      ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]'
                      : 'bg-[#14141a] hover:bg-[#1f1f28] text-white border-[#00D2BE]/40 hover:border-[#00D2BE]'
                  }`}
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5 text-[#00D2BE]" />}
                  <span>{copiedUpi ? 'UPI ID COPIED!' : 'COPY UPI ID'}</span>
                </button>
              </div>

              {/* Instant UPI Redirect & QR Code Display */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#08080A]/60 p-4 border border-[#22222a] rounded-xl">
                
                {/* Left Side: Mobile UPI App Redirect Buttons */}
                <div className="md:col-span-7 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-white font-display block">INSTANT UPI REDIRECT OPTIONS:</span>
                    <span className="text-[10px] text-[#8A8A93] font-mono">Tap below to redirect directly to installed payment app:</span>
                  </div>

                  {/* Primary Direct UPI Redirect CTA */}
                  <a
                    href={upiPayUrl}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#00D2BE] to-[#00a394] hover:from-[#00e6d0] hover:to-[#00b8a7] text-[#08080A] font-display font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,210,190,0.4)] flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01]"
                  >
                    <Smartphone className="w-4 h-4 text-[#08080A]" />
                    <span>PAY VIA UPI APP (AUTO-REDIRECT ₹{totalAmountPayable})</span>
                    <ArrowUpRight className="w-4 h-4 text-[#08080A]" />
                  </a>

                  {/* Quick App Redirect Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <a
                      href={upiPayUrl}
                      className="p-2 bg-[#14141a] hover:bg-[#1c1c24] border border-[#22222a] hover:border-[#00D2BE] text-center rounded-lg text-[10px] font-mono font-bold text-white flex flex-col items-center justify-center space-y-0.5 transition-all"
                    >
                      <span className="text-[#34A853] font-black text-xs">GPay</span>
                      <span className="text-[9px] text-[#8A8A93]">Google Pay</span>
                    </a>

                    <a
                      href={upiPayUrl}
                      className="p-2 bg-[#14141a] hover:bg-[#1c1c24] border border-[#22222a] hover:border-[#00D2BE] text-center rounded-lg text-[10px] font-mono font-bold text-white flex flex-col items-center justify-center space-y-0.5 transition-all"
                    >
                      <span className="text-[#5f259f] font-black text-xs">PhonePe</span>
                      <span className="text-[9px] text-[#8A8A93]">PhonePe</span>
                    </a>

                    <a
                      href={upiPayUrl}
                      className="p-2 bg-[#14141a] hover:bg-[#1c1c24] border border-[#22222a] hover:border-[#00D2BE] text-center rounded-lg text-[10px] font-mono font-bold text-white flex flex-col items-center justify-center space-y-0.5 transition-all"
                    >
                      <span className="text-[#00baf2] font-black text-xs">Paytm</span>
                      <span className="text-[9px] text-[#8A8A93]">Paytm UPI</span>
                    </a>

                    <a
                      href={upiPayUrl}
                      className="p-2 bg-[#14141a] hover:bg-[#1c1c24] border border-[#22222a] hover:border-[#00D2BE] text-center rounded-lg text-[10px] font-mono font-bold text-white flex flex-col items-center justify-center space-y-0.5 transition-all"
                    >
                      <span className="text-[#00D2BE] font-black text-xs">BHIM</span>
                      <span className="text-[9px] text-[#8A8A93]">Any UPI App</span>
                    </a>
                  </div>
                </div>

                {/* Right Side: QR Code Scanner for Desktop Users */}
                <div className="md:col-span-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-[#22222a] pt-3 md:pt-0 md:pl-4 space-y-2">
                  <span className="text-[10px] font-mono text-[#8A8A93] flex items-center space-x-1">
                    <QrCode className="w-3.5 h-3.5 text-[#00D2BE]" />
                    <span>OR SCAN QR CODE TO PAY</span>
                  </span>

                  <a href={upiPayUrl} title="Click to pay via UPI" className="p-2 bg-white rounded-xl shadow-lg hover:scale-105 transition-transform cursor-pointer">
                    <QRCodeSVG value={upiPayUrl} size={110} level="H" />
                  </a>

                  <span className="text-[9px] text-[#8A8A93] font-mono text-center">
                    Scan with any UPI Scanner app
                  </span>
                </div>

              </div>

              {/* 12-Digit Transaction ID Input Field */}
              <div className="space-y-2 pt-2 border-t border-[#22222a]">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] text-white font-mono font-bold">
                    ENTER 12-DIGIT TRANSACTION ID (12 NUMBERS) *
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${
                    formData.utrNumber.length === 12 ? 'text-[#22C55E]' : 'text-[#8A8A93]'
                  }`}>
                    {formData.utrNumber.length}/12 NUMBERS {formData.utrNumber.length === 12 && '✓'}
                  </span>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.utrNumber}
                  onChange={e => setFormData({ ...formData, utrNumber: e.target.value.trim() })}
                  onBlur={() => handleBlur('utrNumber')}
                  placeholder="e.g. 950519820401 (12-digit UTR or Transaction Ref ID)"
                  className={`w-full bg-[#08080A] border-2 text-white font-mono text-xs sm:text-sm px-4 py-3.5 outline-none rounded-xl transition-all ${
                    touched.utrNumber && !isUtrValid
                      ? 'border-[#E10600] shadow-[0_0_10px_rgba(225,6,0,0.5)]'
                      : isUtrValid
                      ? 'border-[#22C55E] focus:border-[#22C55E]'
                      : 'border-[#22222a] focus:border-[#00D2BE]'
                  }`}
                />

                {touched.utrNumber && !isUtrValid && (
                  <p className="text-[10px] text-[#E10600] font-mono">
                    ⚠ Please enter your payment transaction reference ID (e.g. 12-digit UTR).
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreedTerms}
                  onChange={e => setFormData({ ...formData, agreedTerms: e.target.checked })}
                  className="w-4 h-4 accent-[#E10600] rounded cursor-pointer"
                />
                <label htmlFor="terms" className="text-[11px] text-[#8A8A93] cursor-pointer">
                  I confirm that all entered driver details, payment deposit of ₹{totalAmountPayable}, and transaction reference ID are authentic.
                </label>
              </div>

            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="bg-[#E10600]/15 border-2 border-[#E10600] p-4 rounded-xl text-xs font-mono text-[#E10600] font-bold animate-pulse">
                {formError}
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition-all rounded-xl shadow-2xl bg-[#E10600] hover:bg-[#ff0700] text-white shadow-[0_0_30px_rgba(225,6,0,0.7)] border-l-4 border-white cursor-pointer transform hover:scale-[1.01]"
              >
                🏁 SUBMIT {teamSizeCount > 1 ? `${teamSizeCount}-DRIVER TEAM` : 'SOLO DRIVER'} REGISTRATION &amp; GO TO E-PASS 🏁
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};



