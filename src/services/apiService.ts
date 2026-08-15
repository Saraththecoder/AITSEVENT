import { DriverRegistration } from '../types';

// Read Google Apps Script Web App URL from Environment Variables
export const GOOGLE_APPS_SCRIPT_WEB_APP_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

export const submitRegistrationToGoogleSheet = async (registration: DriverRegistration): Promise<boolean> => {
  try {
    if (!GOOGLE_APPS_SCRIPT_WEB_APP_URL || GOOGLE_APPS_SCRIPT_WEB_APP_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
      console.log("Local mode active. Set VITE_GOOGLE_APPS_SCRIPT_URL in .env");
      return true;
    }

    const jsonPayload = JSON.stringify(registration);

    // 1. Primary: Use navigator.sendBeacon for instant non-blocking background dispatch
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      try {
        const blob = new Blob([jsonPayload], { type: 'text/plain;charset=utf-8' });
        navigator.sendBeacon(GOOGLE_APPS_SCRIPT_WEB_APP_URL, blob);
        console.log("Dispatched via navigator.sendBeacon!");
      } catch (beaconErr) {
        console.warn("sendBeacon fallback to fetch:", beaconErr);
      }
    }

    // 2. Secondary: Fire fetch in background to guarantee delivery
    fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: jsonPayload
    }).catch(err => console.error("Fetch background dispatch error:", err));

    return true;
  } catch (err) {
    console.error("Failed to submit to Google Apps Script:", err);
    return false;
  }
};

export const fetchRegistrationsFromGoogleSheet = async (): Promise<DriverRegistration[] | null> => {
  try {
    if (!GOOGLE_APPS_SCRIPT_WEB_APP_URL || GOOGLE_APPS_SCRIPT_WEB_APP_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
      return null;
    }

    const res = await fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
      method: 'GET',
      cache: 'no-cache',
      redirect: 'follow'
    });

    if (!res.ok) {
      console.warn("Google Apps Script HTTP Error:", res.status);
      return null;
    }

    const text = await res.text();
    if (text.trim().startsWith('<')) {
      console.error("⚠️ Google Apps Script returned HTML instead of JSON. IMPORTANT: In Apps Script editor, click Deploy -> New Deployment -> Web App -> Anyone access!");
      return null;
    }

    const json = JSON.parse(text);
    if (json.result === 'success' && Array.isArray(json.data)) {
      return json.data as DriverRegistration[];
    }
    return null;
  } catch (err) {
    console.error("Failed to fetch from Google Apps Script:", err);
    return null;
  }
};
