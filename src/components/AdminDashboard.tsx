import React, { useState, useRef, useEffect } from 'react';
import { DriverRegistration, RegistrationStatus } from '../types';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, RefreshCw, 
  Search, Eye, Check, X, Mail, Plus, Activity, CreditCard, Users, Clock, Send, Camera, CameraOff, Video, QrCode
} from 'lucide-react';
import { submitRegistrationToGoogleSheet } from '../services/apiService';

interface AdminDashboardProps {
  registrations: DriverRegistration[];
  onUpdateRegistration: (updated: DriverRegistration) => void;
  onAddRegistration: (newReg: DriverRegistration) => void;
  onSelectForView: (reg: DriverRegistration) => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  registrations,
  onUpdateRegistration,
  onAddRegistration,
  onSelectForView,
  onRefreshData,
  isRefreshing
}) => {
  const [activeSection, setActiveSection] = useState<'OVERVIEW' | 'UTR_QUEUE' | 'APPROVAL_QUEUE' | 'MASTER_LEDGER' | 'EMAIL_QUEUE' | 'SCANNER'>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // QR Scanner State & Camera Stream Ref
  const [qrScanInput, setQrScanInput] = useState('');
  const [scannedRegistration, setScannedRegistration] = useState<DriverRegistration | null>(null);
  const [hasScanned, setHasScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Modals state
  const [selectedForApproval, setSelectedForApproval] = useState<DriverRegistration | null>(null);
  const [selectedForRejection, setSelectedForRejection] = useState<DriverRegistration | null>(null);
  const [selectedForPaymentVerify, setSelectedForPaymentVerify] = useState<DriverRegistration | null>(null);
  const [selectedForResendEmail, setSelectedForResendEmail] = useState<DriverRegistration | null>(null);
  const [selectedForDetail, setSelectedForDetail] = useState<DriverRegistration | null>(null);

  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);

  // Section Counts
  const pendingUtrList = registrations.filter(r => r.paymentStatus === 'PENDING' && r.status !== 'REJECTED');
  const readyForApprovalList = registrations.filter(r => r.paymentStatus === 'VERIFIED' && r.status !== 'APPROVED' && r.status !== 'REJECTED');
  const approvedList = registrations.filter(r => r.status === 'APPROVED');
  const rejectedList = registrations.filter(r => r.status === 'REJECTED');
  const emailFailedList = registrations.filter(r => r.emailStatus === 'FAILED');

  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.utrNumber && r.utrNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'EMAIL_FAILED') return matchesSearch && r.emailStatus === 'FAILED';
    return matchesSearch && r.status === statusFilter;
  });

  const handleConfirmVerifyPayment = (reg: DriverRegistration) => {
    const updated: DriverRegistration = {
      ...reg,
      paymentStatus: 'VERIFIED',
      status: 'PAYMENT_VERIFIED',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    onUpdateRegistration(updated);
    setSelectedForPaymentVerify(null);
  };

  const handleConfirmApproval = (reg: DriverRegistration) => {
    setIsProcessingApproval(true);

    setTimeout(() => {
      const existingApprovedCount = registrations.filter(r => r.status === 'APPROVED').length;
      const nextNum = (existingApprovedCount + 42).toString().padStart(3, '0');
      const driverNum = `#${nextNum}`;

      const updated: DriverRegistration = {
        ...reg,
        driverNumber: reg.driverNumber || driverNum,
        status: 'APPROVED',
        paymentStatus: 'VERIFIED',
        emailStatus: 'SENT',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      onUpdateRegistration(updated);
      setIsProcessingApproval(false);
      setSelectedForApproval(null);
    }, 800);
  };

  const handleConfirmRejection = (reg: DriverRegistration) => {
    if (!rejectionReasonText.trim()) return;

    const updated: DriverRegistration = {
      ...reg,
      status: 'REJECTED',
      paymentStatus: 'REJECTED',
      emailStatus: 'SENT',
      rejectionReason: rejectionReasonText,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    onUpdateRegistration(updated);
    setSelectedForRejection(null);
    setRejectionReasonText('');
  };

  const handleRetryResendEmail = (reg: DriverRegistration) => {
    const updated: DriverRegistration = {
      ...reg,
      emailStatus: 'SENT',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    onUpdateRegistration(updated);
    setSelectedForResendEmail(null);
  };

  const handleQuickAddEntry = () => {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const newId = `FA26-${randomId}`;
    const newReg: DriverRegistration = {
      id: newId,
      fullName: 'Carlos Sainz Jr',
      email: 'carlos.sainz@ferrari-ai.it',
      phone: '+39 0536 949111',
      organization: 'Scuderia Ferrari Telemetry',
      year: 'Masters',
      department: 'Aero Dynamics',
      teamName: 'Prancing Horse AI',
      category: 'POLE POSITION CHALLENGE (Coding)',
      championship: 'ENGINEERING CHAMPIONSHIP',
      eventName: 'FORMULA-AI 2026 GRAND PRIX',
      utrNumber: `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      paymentAmount: 80,
      paymentStatus: 'PENDING',
      status: 'PAYMENT_PENDING',
      emailStatus: 'NOT_SENT',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    onAddRegistration(newReg);
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      let stream: MediaStream | null = null;
      try {
        // Prefer rear camera on mobile devices
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
      } catch (e1) {
        // Fallback for basic video camera constraints
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access blocked. Please allow camera permissions in your mobile browser settings or use manual entry below.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleQrScan = (e: React.FormEvent) => {
    e.preventDefault();
    setHasScanned(true);
    if (!qrScanInput.trim()) {
      setScannedRegistration(null);
      return;
    }

    const cleaned = qrScanInput.trim().toLowerCase();
    // Search by Entry ID, Email, or UTR Number
    const found = registrations.find(
      r => r.id.toLowerCase() === cleaned ||
           cleaned.includes(r.id.toLowerCase()) ||
           r.email.toLowerCase() === cleaned ||
           (r.utrNumber && r.utrNumber.toLowerCase() === cleaned)
    );

    setScannedRegistration(found || null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-data text-xs">
      
      {/* Top Console Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111115] p-5 border border-[#22222a] shadow-xl rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#E10600] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
            <span>FIA RACE CONTROL OPERATIONAL CONSOLE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
            RACE CONTROL DASHBOARD
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {onRefreshData && (
            <button
              onClick={onRefreshData}
              disabled={isRefreshing}
              className="px-3.5 py-2.5 bg-[#14141a] hover:bg-[#1f1f28] border border-[#00D2BE]/50 text-[#00D2BE] font-mono text-xs font-bold flex items-center space-x-2 transition-all rounded-xl shadow-lg cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-[#00D2BE] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'SYNCING REAL-TIME...' : 'REFRESH LIVE DATA'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveSection('SCANNER')}
            className="px-4 py-2.5 bg-[#00D2BE] hover:bg-[#00b5a3] text-[#08080A] font-display text-xs font-bold flex items-center space-x-2 shadow-lg transition-all rounded-xl"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>🔍 SCAN DRIVER QR PASS</span>
          </button>
        </div>
      </div>

      {/* Main Administrative Section Navigation Bar */}
      <div className="flex items-center flex-wrap gap-1 bg-[#111115] p-1 border border-[#22222a] text-xs">
        <button
          onClick={() => setActiveSection('OVERVIEW')}
          className={`px-4 py-2 font-display font-bold flex items-center space-x-1.5 transition-all ${
            activeSection === 'OVERVIEW'
              ? 'bg-[#E10600] text-white'
              : 'text-[#8A8A93] hover:text-white hover:bg-[#08080A]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>SECTION 01: OVERVIEW &amp; METRICS</span>
        </button>

        <button
          onClick={() => setActiveSection('SCANNER')}
          className={`px-4 py-2 font-display font-bold flex items-center space-x-1.5 transition-all ${
            activeSection === 'SCANNER'
              ? 'bg-[#00D2BE] text-[#08080A]'
              : 'text-[#00D2BE] hover:text-white hover:bg-[#08080A]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>SECTION 05: SCAN E-PASS QR &amp; VERIFY ENTRY</span>
        </button>

        <button
          onClick={() => setActiveSection('UTR_QUEUE')}
          className={`px-4 py-2 font-display font-bold flex items-center space-x-1.5 transition-all ${
            activeSection === 'UTR_QUEUE'
              ? 'bg-[#E10600] text-white'
              : 'text-[#F5A623] hover:text-white hover:bg-[#08080A]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>SECTION 02: UTR VERIFICATION QUEUE [{pendingUtrList.length}]</span>
        </button>

        <button
          onClick={() => setActiveSection('APPROVAL_QUEUE')}
          className={`px-4 py-2 font-display font-bold flex items-center space-x-1.5 transition-all ${
            activeSection === 'APPROVAL_QUEUE'
              ? 'bg-[#E10600] text-white'
              : 'text-[#00D2BE] hover:text-white hover:bg-[#08080A]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>SECTION 03: DRIVER APPROVAL QUEUE [{readyForApprovalList.length}]</span>
        </button>

        <button
          onClick={() => setActiveSection('MASTER_LEDGER')}
          className={`px-4 py-2 font-display font-bold flex items-center space-x-1.5 transition-all ${
            activeSection === 'MASTER_LEDGER'
              ? 'bg-[#E10600] text-white'
              : 'text-[#8A8A93] hover:text-white hover:bg-[#08080A]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>SECTION 04: MASTER LEDGER [{registrations.length}]</span>
        </button>

        {emailFailedList.length > 0 && (
          <button
            onClick={() => setActiveSection('EMAIL_QUEUE')}
            className={`px-4 py-2 font-display font-bold flex items-center space-x-1.5 transition-all ${
              activeSection === 'EMAIL_QUEUE'
                ? 'bg-[#E10600] text-white'
                : 'text-[#E10600] hover:bg-[#E10600]/10'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>SECTION 05: FAILED EMAIL RETRY [{emailFailedList.length}]</span>
          </button>
        )}
      </div>

      {/* SECTION 1: OVERVIEW METRICS BOARD */}
      {activeSection === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#111115] border border-[#22222a] p-4 space-y-2">
              <div className="text-[10px] text-[#8A8A93] uppercase font-display">TOTAL REGISTRATION ENTRIES</div>
              <div className="text-3xl font-extrabold text-white">{registrations.length}</div>
              <div className="text-[10px] text-[#00D2BE]">STAGE 1 MONZA QUALIFIERS</div>
            </div>

            <div className="bg-[#111115] border border-[#F5A623]/40 p-4 space-y-2">
              <div className="text-[10px] text-[#F5A623] uppercase font-display flex items-center justify-between">
                <span>PENDING UTR VERIFICATION</span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-3xl font-extrabold text-[#F5A623]">{pendingUtrList.length}</div>
              <div className="text-[10px] text-[#8A8A93]">Awaiting bank ledger match</div>
            </div>

            <div className="bg-[#111115] border border-[#00D2BE]/40 p-4 space-y-2">
              <div className="text-[10px] text-[#00D2BE] uppercase font-display flex items-center justify-between">
                <span>READY FOR DRIVER APPROVAL</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-3xl font-extrabold text-[#00D2BE]">{readyForApprovalList.length}</div>
              <div className="text-[10px] text-[#8A8A93]">Payment deposit verified</div>
            </div>

            <div className="bg-[#111115] border border-[#E10600]/40 p-4 space-y-2">
              <div className="text-[10px] text-[#E10600] uppercase font-display flex items-center justify-between">
                <span>CONFIRMED GRID DRIVERS</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-3xl font-extrabold text-[#E10600]">{approvedList.length}</div>
              <div className="text-[10px] text-[#8A8A93]">Driver # &amp; E-Passes issued</div>
            </div>

          </div>

          {/* Action Callout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-[#111115] border border-[#22222a] p-5 space-y-3">
              <h3 className="font-display text-sm font-bold text-white uppercase flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-[#F5A623]" />
                <span>PENDING UTR DEPOSIT WORKFLOW</span>
              </h3>
              <p className="text-xs text-[#8A8A93]">
                {pendingUtrList.length} participant registrations require bank deposit UTR cross-verification before final approval can be granted.
              </p>
              <button
                onClick={() => setActiveSection('UTR_QUEUE')}
                className="px-4 py-2 bg-[#F5A623] text-black font-display font-bold text-xs"
              >
                GO TO UTR QUEUE ({pendingUtrList.length})
              </button>
            </div>

            <div className="bg-[#111115] border border-[#22222a] p-5 space-y-3">
              <h3 className="font-display text-sm font-bold text-white uppercase flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#00D2BE]" />
                <span>DRIVER E-PASS APPROVAL WORKFLOW</span>
              </h3>
              <p className="text-xs text-[#8A8A93]">
                {readyForApprovalList.length} entries have verified payments and are awaiting official Driver Number assignment &amp; E-Pass generation.
              </p>
              <button
                onClick={() => setActiveSection('APPROVAL_QUEUE')}
                className="px-4 py-2 bg-[#E10600] text-white font-display font-bold text-xs"
              >
                GO TO APPROVAL QUEUE ({readyForApprovalList.length})
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 5: VENUE TURNSTILE QR SCANNER & ENTRY VERIFIER */}
      {activeSection === 'SCANNER' && (
        <div className="bg-[#0b0b0e] border-2 border-[#00D2BE] p-6 sm:p-10 rounded-3xl space-y-6 shadow-[0_0_50px_rgba(0,210,190,0.3)] relative overflow-hidden font-data">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#22222a] pb-4 gap-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#00D2BE]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D2BE] animate-ping" />
                <span>MONZA VENUE TURNSTILE GATE 01 · RACE CONTROL AUTH</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wider mt-1">
                DRIVER QR PASS TURNSTILE SCANNER
              </h3>
            </div>
            <span className="bg-[#00D2BE]/20 text-[#00D2BE] px-3 py-1 font-mono font-bold rounded-lg text-xs border border-[#00D2BE]/40">
              LIVE GATE TELEMETRY
            </span>
          </div>

          {/* LIVE WEBCAM SCANNER CARD & MANUAL ENTRY CONSOLE */}
          <div className="max-w-2xl mx-auto space-y-4">
            
            {/* Camera Control Bar */}
            <div className="flex items-center justify-between bg-[#14141a] p-3 border border-[#22222a] rounded-xl text-xs">
              <span className="font-mono text-[#00D2BE] font-bold flex items-center space-x-2">
                <Camera className="w-4 h-4 text-[#00D2BE]" />
                <span>LIVE OPTICAL SCANNER STREAM</span>
              </span>

              {isCameraActive ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-3.5 py-1.5 bg-[#E10600] text-white font-mono font-bold text-[11px] rounded-lg flex items-center space-x-1.5 hover:bg-[#ff0700] transition-colors"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>CLOSE CAMERA</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-1.5 bg-[#00D2BE] text-[#08080A] font-mono font-bold text-[11px] rounded-lg flex items-center space-x-1.5 hover:bg-[#00b5a3] transition-colors shadow-[0_0_15px_rgba(0,210,190,0.5)]"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>START LIVE WEBCAM SCANNER</span>
                </button>
              )}
            </div>

            {/* Camera Permission Alert Error */}
            {cameraError && (
              <div className="bg-[#E10600]/15 border border-[#E10600] p-3 rounded-xl text-xs text-[#E10600] font-mono flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Live Camera Viewfinder Video Screen */}
            {isCameraActive && (
              <div className="relative border-2 border-[#00D2BE] rounded-2xl overflow-hidden bg-black shadow-2xl h-[260px] flex items-center justify-center group">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Laser Target Overlay Grid & Laser Line */}
                <div className="absolute inset-0 border-2 border-dashed border-[#00D2BE]/40 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-[#00D2BE] rounded-xl relative shadow-[0_0_30px_#00D2BE]">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#00D2BE]" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#00D2BE]" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#00D2BE]" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#00D2BE]" />
                    <div className="w-full h-0.5 bg-[#00D2BE] absolute top-1/2 -translate-y-1/2 shadow-[0_0_15px_#00D2BE] animate-pulse" />
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-[#08080A]/90 border border-[#00D2BE] px-3 py-1 text-[10px] font-mono text-[#00D2BE] rounded-lg">
                  ● CAMERA FEED LIVE
                </div>
              </div>
            )}

            {/* QR Scan Input Console Form */}
            <form onSubmit={handleQrScan} className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#00D2BE] uppercase block">
                SCAN OR ENTER ENTRY ID / BARCODE STRING *
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={qrScanInput}
                  onChange={e => {
                    setQrScanInput(e.target.value);
                    setHasScanned(false);
                  }}
                  placeholder="Paste or Scan QR Code (e.g. FA26-00042 or https://...?id=FA26-00042)..."
                  className="flex-1 bg-[#08080A] border-2 border-[#22222a] focus:border-[#00D2BE] text-white font-mono text-xs px-4 py-3.5 outline-none rounded-xl"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#00D2BE] hover:bg-[#00b5a3] text-[#08080A] font-display text-xs font-black uppercase tracking-wider transition-all rounded-xl shadow-[0_0_25px_rgba(0,210,190,0.6)]"
                >
                  VERIFY PASS →
                </button>
              </div>
            </form>

          </div>

          {/* VERIFICATION SCAN RESULT BANNER */}
          {hasScanned && (
            <div className="max-w-2xl mx-auto pt-4">
              {scannedRegistration ? (
                scannedRegistration.status === 'APPROVED' || scannedRegistration.status === 'PAYMENT_VERIFIED' ? (
                  /* ✅ ACCESS ALLOWED — LEGIT DRIVER PASS */
                  <div className="bg-[#08080A] border-2 border-[#22C55E] p-6 sm:p-8 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.5)] space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E] flex items-center justify-center shadow-[0_0_30px_#22C55E]">
                      <CheckCircle2 className="w-10 h-10 text-[#22C55E]" />
                    </div>

                    <div className="space-y-1">
                      <span className="bg-[#22C55E] text-[#08080A] font-mono font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                        ✅ ACCESS ALLOWED · LEGIT DRIVER PASS
                      </span>
                      <h4 className="font-display text-3xl font-extrabold text-white uppercase tracking-wider pt-2">
                        PADDOCK ENTRY APPROVED
                      </h4>
                      <p className="text-xs text-[#8A8A93] font-mono">Authenticated against Monza Circuit Master Grid Ledger</p>
                    </div>

                    {/* Driver Card Details */}
                    <div className="bg-[#14141a] border border-[#22222a] p-4 rounded-xl text-left space-y-2 font-mono text-xs">
                      <div className="flex justify-between border-b border-[#22222a] pb-1.5">
                        <span className="text-[#8A8A93]">DRIVER NAME:</span>
                        <span className="text-white font-bold">{scannedRegistration.fullName}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#22222a] pb-1.5">
                        <span className="text-[#8A8A93]">DRIVER NUMBER:</span>
                        <span className="text-[#E10600] font-extrabold text-sm">{scannedRegistration.driverNumber || '#042'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#22222a] pb-1.5">
                        <span className="text-[#8A8A93]">TEAM CALLSIGN:</span>
                        <span className="text-white">{scannedRegistration.teamName || 'Independent'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#22222a] pb-1.5">
                        <span className="text-[#8A8A93]">CHAMPIONSHIP TRACK:</span>
                        <span className="text-[#00D2BE] font-bold">{scannedRegistration.championship}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#22222a] pb-1.5">
                        <span className="text-[#8A8A93]">COMPETITION CATEGORY:</span>
                        <span className="text-white">{scannedRegistration.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8A8A93]">ENTRY ID:</span>
                        <span className="text-[#00D2BE] font-bold">{scannedRegistration.id}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ⚠️ PENDING APPROVAL */
                  <div className="bg-[#08080A] border-2 border-[#F5A623] p-6 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#F5A623]/20 border border-[#F5A623] flex items-center justify-center text-[#F5A623]">
                      <Clock className="w-6 h-6 animate-spin" />
                    </div>
                    <span className="bg-[#F5A623] text-black font-mono font-bold text-xs px-3 py-1 rounded-full uppercase">
                      ⚠️ ENTRY PENDING APPROVAL
                    </span>
                    <p className="text-xs text-white">This pass exists in records, but is currently in queue awaiting admin approval.</p>
                  </div>
                )
              ) : (
                /* ❌ ACCESS DENIED — INVALID OR FORGED PASS */
                <div className="bg-[#08080A] border-2 border-[#E10600] p-6 sm:p-8 rounded-2xl shadow-[0_0_40px_rgba(225,6,0,0.6)] space-y-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#E10600]/20 border-2 border-[#E10600] flex items-center justify-center shadow-[0_0_30px_#E10600]">
                    <XCircle className="w-10 h-10 text-[#E10600]" />
                  </div>

                  <div className="space-y-1">
                    <span className="bg-[#E10600] text-white font-mono font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                      ❌ ACCESS DENIED · INVALID / UNREGISTERED PASS
                    </span>
                    <h4 className="font-display text-2xl font-bold text-white uppercase tracking-wider pt-2">
                      UNAUTHENTICATED ENTRY ID
                    </h4>
                    <p className="text-xs text-[#E10600] font-mono">
                      No matching registered record was found for "{qrScanInput}". Turnstile entry is blocked by Race Control.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* SECTION 2: UTR VERIFICATION QUEUE */}
      {activeSection === 'UTR_QUEUE' && (
        <div className="space-y-4">
          <div className="bg-[#111115] border border-[#F5A623]/40 p-4 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-display font-bold text-white text-sm">BANK UTR DEPOSIT VERIFICATION QUEUE</h3>
              <p className="text-[#8A8A93]">Inspect and mark payment deposit reference numbers as VERIFIED.</p>
            </div>
            <span className="bg-[#F5A623] text-black font-bold px-2 py-1">{pendingUtrList.length} PENDING</span>
          </div>

          <div className="bg-[#111115] border border-[#22222a] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#08080A] text-[#8A8A93] uppercase font-display border-b border-[#22222a] text-[10px]">
                  <th className="py-3 px-4">ENTRY ID</th>
                  <th className="py-3 px-4">DRIVER &amp; EMAIL</th>
                  <th className="py-3 px-4">UTR REFERENCE</th>
                  <th className="py-3 px-4">AMOUNT</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22222a]">
                {pendingUtrList.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-[#8A8A93]">No pending UTR verifications in queue.</td></tr>
                ) : (
                  pendingUtrList.map(reg => (
                    <tr key={reg.id} className="hover:bg-[#08080A]">
                      <td className="py-3.5 px-4 text-[#00D2BE] font-bold">{reg.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-white font-bold">{reg.fullName}</div>
                        <div className="text-[#8A8A93] text-[10px]">{reg.email}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#F5A623]">{reg.utrNumber || 'N/A'}</td>
                      <td className="py-3.5 px-4 text-white">₹{reg.paymentAmount}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedForPaymentVerify(reg)}
                          className="px-3 py-1 bg-[#00D2BE] text-[#08080A] font-bold"
                        >
                          VERIFY UTR
                        </button>
                        <button
                          onClick={() => setSelectedForRejection(reg)}
                          className="px-2 py-1 border border-[#E10600] text-[#E10600]"
                        >
                          REJECT
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: DRIVER APPROVAL QUEUE */}
      {activeSection === 'APPROVAL_QUEUE' && (
        <div className="space-y-4">
          <div className="bg-[#111115] border border-[#00D2BE]/40 p-4 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-display font-bold text-white text-sm">FINAL DRIVER APPROVAL &amp; E-PASS ISSUANCE QUEUE</h3>
              <p className="text-[#8A8A93]">Entries with verified payment ready for Driver Number assignment.</p>
            </div>
            <span className="bg-[#00D2BE] text-black font-bold px-2 py-1">{readyForApprovalList.length} READY</span>
          </div>

          <div className="bg-[#111115] border border-[#22222a] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#08080A] text-[#8A8A93] uppercase font-display border-b border-[#22222a] text-[10px]">
                  <th className="py-3 px-4">ENTRY ID</th>
                  <th className="py-3 px-4">DRIVER &amp; ORG</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">PAYMENT STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22222a]">
                {readyForApprovalList.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-[#8A8A93]">No registrations currently awaiting final approval.</td></tr>
                ) : (
                  readyForApprovalList.map(reg => (
                    <tr key={reg.id} className="hover:bg-[#08080A]">
                      <td className="py-3.5 px-4 text-[#00D2BE] font-bold">{reg.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-white font-bold">{reg.fullName}</div>
                        <div className="text-[#8A8A93] text-[10px]">{reg.organization}</div>
                      </td>
                      <td className="py-3.5 px-4 text-white">{reg.category}</td>
                      <td className="py-3.5 px-4 text-[#00D2BE] font-bold">VERIFIED (₹{reg.paymentAmount})</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedForApproval(reg)}
                          className="px-4 py-1.5 bg-[#E10600] text-white font-display font-bold shadow-md"
                        >
                          APPROVE &amp; ISSUE E-PASS
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: MASTER LEDGER */}
      {activeSection === 'MASTER_LEDGER' && (
        <div className="space-y-4">
          <div className="bg-[#111115] border border-[#22222a] p-3 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#8A8A93] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Driver Name, Email, UTR..."
                className="w-full bg-[#08080A] border border-[#22222a] text-white text-xs pl-9 pr-4 py-2 outline-none focus:border-[#00D2BE]"
              />
            </div>

            <div className="flex items-center flex-wrap gap-1 w-full md:w-auto text-[11px]">
              {['ALL', 'PAYMENT_PENDING', 'PAYMENT_VERIFIED', 'APPROVED', 'REJECTED'].map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 border ${
                    statusFilter === f ? 'bg-[#E10600] text-white font-bold border-[#E10600]' : 'bg-[#08080A] text-[#8A8A93] border-[#22222a]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111115] border border-[#22222a] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#08080A] text-[#8A8A93] uppercase font-display border-b border-[#22222a] text-[10px]">
                  <th className="py-3 px-4">ENTRY ID</th>
                  <th className="py-3 px-4">DRIVER &amp; INSTITUTION</th>
                  <th className="py-3 px-4">CATEGORY &amp; UTR</th>
                  <th className="py-3 px-4">PAYMENT UTR</th>
                  <th className="py-3 px-4">GRID STATUS</th>
                  <th className="py-3 px-4 text-right">RACE CONTROL DIRECTIVES</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#22222a]">
                {filteredRegistrations.map(reg => {
                  const isPaymentVerified = reg.paymentStatus === 'VERIFIED';
                  const isApproved = reg.status === 'APPROVED';
                  const isRejected = reg.status === 'REJECTED';

                  return (
                    <tr key={reg.id} className="hover:bg-[#08080A]">
                      <td className="py-3.5 px-4 font-bold text-[#00D2BE]">
                        {reg.id}
                        {reg.driverNumber && <div className="text-xs text-[#E10600] font-extrabold">{reg.driverNumber}</div>}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-body font-bold text-white text-xs">{reg.fullName}</div>
                        <div className="text-[#8A8A93] text-[10px]">{reg.organization}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-white text-[11px]">{reg.category}</div>
                        <div className="text-[#8A8A93] text-[10px]">UTR: {reg.utrNumber || 'N/A'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isPaymentVerified ? (
                          <span className="text-[#00D2BE] font-bold">VERIFIED (₹{reg.paymentAmount})</span>
                        ) : isRejected ? (
                          <span className="text-[#E10600] font-bold">REJECTED</span>
                        ) : (
                          <span className="text-[#F5A623]">PENDING UTR</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isApproved ? (
                          <span className="bg-[#00D2BE] text-[#08080A] font-extrabold px-2 py-0.5 text-[10px]">GRID CONFIRMED</span>
                        ) : isRejected ? (
                          <span className="bg-[#E10600] text-white font-bold px-2 py-0.5 text-[10px]">REJECTED</span>
                        ) : (
                          <span className="border border-[#F5A623] text-[#F5A623] px-2 py-0.5 text-[10px]">{reg.status}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button onClick={() => setSelectedForDetail(reg)} className="p-1.5 bg-[#08080A] border border-[#22222a] text-[#8A8A93]"><Eye className="w-3.5 h-3.5" /></button>
                        {isApproved && <button onClick={() => onSelectForView(reg)} className="px-2.5 py-1 bg-[#08080A] text-[#00D2BE] border border-[#00D2BE]/30">VIEW PASS</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: EMAIL RETRY QUEUE */}
      {activeSection === 'EMAIL_QUEUE' && (
        <div className="space-y-4">
          <div className="bg-[#111115] border border-[#E10600]/40 p-4 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-display font-bold text-white text-sm">FAILED EMAIL DELIVERY RETRY QUEUE</h3>
              <p className="text-[#8A8A93]">Resend E-Pass attachments for driver registrations where initial email delivery failed.</p>
            </div>
            <span className="bg-[#E10600] text-white font-bold px-2 py-1">{emailFailedList.length} FAILED</span>
          </div>

          <div className="bg-[#111115] border border-[#22222a] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#08080A] text-[#8A8A93] uppercase font-display border-b border-[#22222a] text-[10px]">
                  <th className="py-3 px-4">ENTRY ID</th>
                  <th className="py-3 px-4">DRIVER &amp; EMAIL</th>
                  <th className="py-3 px-4">DRIVER #</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22222a]">
                {emailFailedList.map(reg => (
                  <tr key={reg.id} className="hover:bg-[#08080A]">
                    <td className="py-3.5 px-4 text-[#00D2BE] font-bold">{reg.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-bold">{reg.fullName}</div>
                      <div className="text-[#8A8A93] text-[10px]">{reg.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#E10600] font-bold">{reg.driverNumber}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRetryResendEmail(reg)}
                        className="px-3 py-1 bg-[#F5A623] text-black font-bold"
                      >
                        RETRY EMAIL DELIVERY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPROVAL CONFIRMATION MODAL */}
      {selectedForApproval && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#111115] border-2 border-[#E10600] p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider">
              CONFIRM GRID APPROVAL DIRECTIVE
            </h3>

            <div className="bg-[#08080A] border border-[#22222a] p-4 space-y-1.5 text-xs text-[#8A8A93]">
              <div>DRIVER: <strong className="text-white">{selectedForApproval.fullName}</strong></div>
              <div>ENTRY ID: <strong className="text-[#00D2BE]">{selectedForApproval.id}</strong></div>
              <div>DEPOSIT: <strong className="text-[#00D2BE]">₹{selectedForApproval.paymentAmount} (VERIFIED)</strong></div>
            </div>

            <div className="bg-[#F5A623]/10 border border-[#F5A623] p-3 text-xs text-[#F5A623]">
              Approving this entry generates the official Driver E-Pass with an assigned Driver Number and immediately triggers automated confirmation email delivery.
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleConfirmApproval(selectedForApproval)}
                disabled={isProcessingApproval}
                className="w-full py-3 bg-[#E10600] hover:bg-[#ff0700] text-white font-display font-bold text-xs tracking-wider"
              >
                {isProcessingApproval ? 'PROCESSING E-PASS GENERATION...' : 'APPROVE & ISSUE E-PASS'}
              </button>

              <button
                onClick={() => setSelectedForApproval(null)}
                className="w-full py-2 border border-[#22222a] text-[#8A8A93] hover:text-white text-xs font-data"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION MODAL */}
      {selectedForRejection && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#111115] border border-[#22222a] p-6 max-w-lg w-full space-y-5">
            <h3 className="font-display text-xl font-bold text-white uppercase">REJECT DRIVER ENTRY</h3>

            <textarea
              required
              rows={4}
              value={rejectionReasonText}
              onChange={e => setRejectionReasonText(e.target.value)}
              placeholder="State official Race Control rejection reason..."
              className="w-full bg-[#08080A] border border-[#22222a] text-white text-xs p-3 outline-none focus:border-[#E10600]"
            />

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedForRejection(null)}
                className="w-1/2 py-2.5 border border-[#22222a] text-[#8A8A93] text-xs"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleConfirmRejection(selectedForRejection)}
                disabled={!rejectionReasonText.trim()}
                className="w-1/2 py-2.5 border border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white font-bold text-xs"
              >
                REJECT ENTRY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT VERIFY MODAL */}
      {selectedForPaymentVerify && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#111115] border border-[#00D2BE] p-6 max-w-md w-full space-y-4">
            <h3 className="font-display text-lg font-bold text-white uppercase">VERIFY PAYMENT UTR</h3>

            <div className="bg-[#08080A] p-4 border border-[#22222a] space-y-1 text-xs">
              <div>DRIVER: <strong className="text-white">{selectedForPaymentVerify.fullName}</strong></div>
              <div>UTR NUMBER: <strong className="text-[#00D2BE]">{selectedForPaymentVerify.utrNumber}</strong></div>
            </div>

            <div className="flex items-center space-x-2">
              <button onClick={() => setSelectedForPaymentVerify(null)} className="w-1/2 py-2 border border-[#22222a] text-[#8A8A93]">CANCEL</button>
              <button onClick={() => handleConfirmVerifyPayment(selectedForPaymentVerify)} className="w-1/2 py-2 bg-[#00D2BE] text-[#08080A] font-bold">MARK VERIFIED</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedForDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#111115] border border-[#22222a] p-6 max-w-lg w-full space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#22222a]">
              <h3 className="font-display text-base font-bold text-white">DRIVER ENTRY DATA RECORD</h3>
              <button onClick={() => setSelectedForDetail(null)} className="text-[#8A8A93] hover:text-white">✕</button>
            </div>

            <div className="bg-[#08080A] p-4 space-y-1.5 text-[#8A8A93]">
              <div>ENTRY ID: <strong className="text-[#00D2BE]">{selectedForDetail.id}</strong></div>
              <div>DRIVER: <strong className="text-white">{selectedForDetail.fullName}</strong></div>
              <div>EMAIL: <strong className="text-white">{selectedForDetail.email}</strong></div>
              <div>PHONE: <strong className="text-white">{selectedForDetail.phone}</strong></div>
              <div>ORGANIZATION: <strong className="text-white">{selectedForDetail.organization}</strong></div>
              <div>CATEGORY: <strong className="text-[#00D2BE]">{selectedForDetail.category}</strong></div>
              <div>UTR: <strong className="text-white">{selectedForDetail.utrNumber}</strong></div>
            </div>

            <button onClick={() => setSelectedForDetail(null)} className="w-full py-2 bg-[#08080A] border border-[#22222a] text-white">CLOSE</button>
          </div>
        </div>
      )}

    </div>
  );
};
