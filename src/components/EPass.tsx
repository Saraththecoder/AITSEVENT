import React, { useRef, useState } from 'react';
import { DriverRegistration } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Download, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface EPassProps {
  registration: DriverRegistration;
  onGoToVerification: () => void;
}

export const EPass: React.FC<EPassProps> = ({ registration, onGoToVerification }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const verificationUrl = `${window.location.origin}?view=QR_VERIFICATION&id=${registration.id}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(registration.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#08080A'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 100, 150);
      pdf.save(`FORMULA-AI-2026-PASS-${registration.driverNumber || registration.id}.pdf`);
    } catch (err) {
      console.error('PDF Generation failed', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111115] p-4 border border-[#22222a] rounded-2xl shadow-xl">
        <div>
          <h3 className="font-display font-bold text-white text-sm tracking-wider">FIA PADDOCK CREDENTIAL PASS</h3>
          <p className="text-[11px] text-[#8A8A93] font-data">Monza Circuit Garage &amp; Pit Lane Access Pass</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyId}
            className="px-3 py-2 bg-[#08080A] hover:bg-[#14141a] text-xs font-data text-[#00D2BE] border border-[#00D2BE]/40 flex items-center space-x-1.5 transition-colors rounded-xl"
          >
            {copied ? <Check className="w-4 h-4 text-[#22C55E]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'ID COPIED!' : 'COPY FIA ID'}</span>
          </button>

          <button
            onClick={onGoToVerification}
            className="px-3 py-2 bg-[#08080A] hover:bg-[#111115] text-xs font-data text-white border border-[#22222a] flex items-center space-x-1.5 transition-colors rounded-xl"
          >
            <ShieldCheck className="w-4 h-4 text-[#00D2BE]" />
            <span>SCAN QR</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-4 py-2 bg-[#E10600] hover:bg-[#ff0700] text-white text-xs font-display font-bold flex items-center space-x-1.5 transition-all shadow-lg rounded-xl"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'EXPORTING...' : 'DOWNLOAD PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official FIA Paddock Pass Credential (100mm x 150mm Ratio with 3D Holo Foil Effects) */}
      <div className="flex justify-center w-full px-2">
        <div
          ref={cardRef}
          className="w-full max-w-[380px] min-h-[550px] bg-[#08080A] border-2 border-[#00D2BE] p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(0,210,190,0.4)] select-none rounded-3xl group transform hover:scale-[1.02] transition-transform duration-500"
        >
          {/* Metallic Holographic Foil Scanline Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-30" />

          {/* Lanyard Hole Cut-Out Motif at Top Center */}
          <div className="w-20 h-3 bg-[#111115] border border-[#22222a] mx-auto rounded-full flex items-center justify-center relative z-20">
            <div className="w-10 h-1 bg-[#08080A] rounded-full" />
          </div>

          {/* Left Red Race Control Edge Bar */}
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-[#E10600] z-20" />

          {/* Top Brand & Holographic Security Foil Badge */}
          <div className="pl-3 border-b border-[#22222a] pb-3 flex items-center justify-between relative z-20">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Formula AI Logo" className="h-9 w-auto max-w-[140px] object-contain drop-shadow-[0_0_10px_rgba(225,6,0,0.6)]" />
              <div>
                <div className="font-display text-base font-extrabold tracking-wider text-white">FORMULA AI 2026</div>
                <div className="text-[9px] font-data text-[#8A8A93] tracking-widest uppercase">OFFICIAL DRIVER PADDOCK PASS</div>
              </div>
            </div>

            {/* Metallic Holographic Foil Seal */}
            <div className="w-9 h-9 rounded-full holographic-seal p-0.5 shadow-md flex items-center justify-center animate-pulse">
              <div className="w-full h-full rounded-full bg-[#08080A] flex items-center justify-center font-display text-[9px] font-bold text-white">
                FIA
              </div>
            </div>
          </div>

          {/* Large Focal Assigned Driver Number */}
          <div className="pl-3 text-center my-auto space-y-1 relative z-20">
            <div className="text-[10px] font-display text-[#8A8A93] uppercase tracking-widest">ASSIGNED DRIVER NUMBER</div>
            <div className="font-data text-7xl font-extrabold text-[#E10600] tracking-tight drop-shadow-[0_0_15px_rgba(225,6,0,0.6)]">
              {registration.driverNumber || '#042'}
            </div>
            <div className="font-display text-lg font-bold text-white uppercase tracking-wider">
              {registration.fullName}
            </div>
          </div>

          {/* Tabular Data Specs */}
          <div className="pl-3 bg-[#111115] border border-[#22222a] p-3 space-y-1.5 font-data text-xs rounded-2xl relative z-20">
            <div className="flex justify-between border-b border-[#22222a] pb-1">
              <span className="text-[#8A8A93] text-[10px]">ORGANIZATION</span>
              <span className="text-white font-medium truncate max-w-[180px]">{registration.organization}</span>
            </div>
            <div className="flex justify-between border-b border-[#22222a] pb-1">
              <span className="text-[#8A8A93] text-[10px]">CATEGORY</span>
              <span className="text-[#00D2BE] font-bold">{registration.category}</span>
            </div>
            <div className="flex justify-between border-b border-[#22222a] pb-1">
              <span className="text-[#8A8A93] text-[10px]">TEAM</span>
              <span className="text-white">{registration.teamName || 'Independent'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8A93] text-[10px]">ENTRY ID</span>
              <span className="text-[#00D2BE] font-bold">{registration.id}</span>
            </div>
          </div>

          {/* Pass Footer: Status Chip + Authenticated QR Code */}
          <div className="pl-3 pt-3 border-t border-[#22222a] flex items-center justify-between relative z-20">
            <div className="inline-flex items-center space-x-1 bg-[#00D2BE] text-[#08080A] font-data text-xs font-bold px-2.5 py-1 rounded-lg shadow-[0_0_10px_#00D2BE]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>GRID CONFIRMED</span>
            </div>

            <div className="p-1 bg-white rounded-lg shadow-md">
              <QRCodeSVG value={verificationUrl} size={48} level="M" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
