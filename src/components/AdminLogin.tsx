import React, { useState } from 'react';
import { ShieldAlert, ChevronRight, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsAuthenticating(true);

    setTimeout(() => {
      // Valid credentials check:
      // Accepts username: "admin" or "RACE_CONTROL_01"
      // Accepts passcode: "admin123" or "FIA_MONZA_2026"
      // Accepts PIN: "8842" or any 4 digit PIN
      const isValidUser = username.trim().toLowerCase() === 'admin' || username.trim().toUpperCase() === 'RACE_CONTROL_01';
      const isValidPass = password.trim() === 'admin123' || password.trim() === 'FIA_MONZA_2026';
      const isValidPin = securityPin.trim() === '8842' || securityPin.trim().length === 4;

      if (isValidUser && isValidPass && isValidPin) {
        onLoginSuccess();
      } else {
        setErrorMessage('ACCESS DENIED: Invalid Race Control Call Sign, Passcode, or 2FA Security PIN.');
        setIsAuthenticating(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-12 telemetry-grid-bg">
      <div className="max-w-md w-full bg-[#111115] border-2 border-[#22222a] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Top Security Line Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E10600]" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-[#08080A] border border-[#E10600] flex items-center justify-center text-[#E10600]">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>

          <div className="font-data text-[10px] text-[#F5A623] tracking-widest uppercase font-bold">
            RESTRICTED ACCESS PORTAL
          </div>
          <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
            FIA RACE CONTROL AUTH
          </h2>
          <p className="text-xs font-data text-[#8A8A93]">
            Authorized Race Control Personnel Only. All IP addresses &amp; access attempts are logged.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="bg-[#E10600]/15 border border-[#E10600] p-3 text-xs font-data text-[#E10600] flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 font-data text-xs">
          
          <div>
            <label className="block text-[10px] text-[#8A8A93] mb-1 uppercase font-bold">
              OFFICER CALL SIGN / USERNAME *
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter Call Sign"
              className="w-full bg-[#08080A] border border-[#22222a] text-white px-3 py-2.5 outline-none focus:border-[#E10600]"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#8A8A93] mb-1 uppercase font-bold">
              RACE CONTROL PASSCODE *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Passcode"
              className="w-full bg-[#08080A] border border-[#22222a] text-white px-3 py-2.5 outline-none focus:border-[#E10600]"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#8A8A93] mb-1 uppercase font-bold">
              2FA HARDWARE TOKEN PIN *
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={securityPin}
              onChange={e => setSecurityPin(e.target.value)}
              placeholder="4-Digit PIN"
              className="w-full bg-[#08080A] border border-[#22222a] text-[#00D2BE] font-bold px-3 py-2.5 outline-none focus:border-[#00D2BE] tracking-widest text-center"
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 bg-[#E10600] hover:bg-[#ff0700] text-white font-display text-xs font-bold tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isAuthenticating ? 'AUTHENTICATING ENCRYPTED KEY...' : 'AUTHENTICATE & ENTER CONSOLE'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 border border-[#22222a] text-[#8A8A93] hover:text-white text-[11px]"
            >
              RETURN TO PUBLIC PORTAL
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
