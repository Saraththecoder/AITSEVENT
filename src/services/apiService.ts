import { DriverRegistration } from '../types';

// Replace this URL with your Google Apps Script Web App URL after deploying!
export const GOOGLE_APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwhP3AZZCjL9iskYV7AZ8hju7QIn7NtaXvnFWuLEj23PJtIhF-gkIRCr9A6_46DVfXQrg/exec";

export const submitRegistrationToGoogleSheet = async (registration: DriverRegistration): Promise<boolean> => {
  try {
    if (!GOOGLE_APPS_SCRIPT_WEB_APP_URL || GOOGLE_APPS_SCRIPT_WEB_APP_URL.includes("YOUR_GOOGLE_APPS_SCRIPT")) {
      console.log("Local mode active. To send to Google Sheets, replace GOOGLE_APPS_SCRIPT_WEB_APP_URL in src/services/apiService.ts");
      return true;
    }

    // Google Apps Script requires text/plain body format to avoid CORS pre-flight block
    await fetch(GOOGLE_APPS_SCRIPT_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', // no-cors mode works seamlessly with Google Apps Script
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
