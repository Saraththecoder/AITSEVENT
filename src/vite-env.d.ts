/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_APPS_SCRIPT_URL: string;
  readonly VITE_ADMIN_CALLSIGN: string;
  readonly VITE_ADMIN_PASSCODE: string;
  readonly VITE_ADMIN_PIN: string;
  readonly VITE_UPI_ID: string;
  readonly VITE_UPI_NAME: string;
  readonly VITE_ENGINEERING_FEE: string;
  readonly VITE_DAYTONA_FEE: string;
  readonly VITE_EVENT_NAME: string;
  readonly VITE_CIRCUIT_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
