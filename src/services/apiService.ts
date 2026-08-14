import { DriverRegistration } from '../types';

// Read Google Apps Script Web App URL from Environment Variables
export const GOOGLE_APPS_SCRIPT_WEB_APP_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

export const submitRegistrationToGoogleSheet = async (registration: DriverRegistration): Promise<boolean> => {
  try {
    if (!GOOGLE_APPS_SCRIPT_WEB_APP_URL || GOOGLE_APPS_SCRIPT_WEB_APP_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
      console.log("Local mode active. Set VITE_GOOGLE_APPS_SCRIPT_URL in .env");
      return true;
    }

    // Google Apps Script requires text/plain body format to avoid CORS pre-flight block
    await fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(registration)
    });

    console.log("Successfully dispatched registration to Google Sheets & Email Service!");
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
