export type RegistrationStatus = 
  | 'SUBMITTED' 
  | 'PAYMENT_PENDING' 
  | 'UNDER_REVIEW' 
  | 'PAYMENT_VERIFIED' 
  | 'APPROVED' 
  | 'REJECTED';

export type PaymentStatus = 
  | 'PENDING' 
  | 'VERIFIED' 
  | 'REJECTED';

export type EmailStatus = 
  | 'NOT_SENT' 
  | 'SENT' 
  | 'FAILED';

export type ChampionshipType = 
  | 'ENGINEERING CHAMPIONSHIP' 
  | 'DAYTONA CHAMPIONSHIP'
  | 'PODIUM COMBO (4 Non-Tech Events)'
  | 'TURBO COMBO (3 Non-Tech Events)';

export type EventCategory = 
  // Technical / Engineering (₹80)
  | 'POLE POSITION CHALLENGE (Coding)'
  | 'PIT STRATEGY CHALLENGE (Prompt Engineering)'
  | 'CONSTRUCTORS GARAGE (Hackathon)'
  // Non-Technical / Daytona (₹50)
  | 'RADIO COMMUNICATION (Dumb Charades)'
  | 'LIGHTS OUT! (Guess Movie in 1 Sec)'
  | 'PIT STOP CHALLENGE (Minute to Win It)'
  | 'TYRE CHANGE CHALLENGE (Bottle Challenge)'
  | 'TELEMETRY TEST (Typing Competition)'
  // Combos
  | 'PODIUM COMBO (4 Non-Tech Events)'
  | 'TURBO COMBO (3 Non-Tech Events)';

export interface DriverRegistration {
  id: string; // e.g. "FA26-00042"
  driverNumber?: string; // e.g. "#042" (Only present when APPROVED)
  fullName: string;
  email: string;
  phone: string;
  organization: string; // College or Company
  year?: string;
  department?: string;
  teamName?: string;
  teamSizeCount?: number; // 2 to 4 drivers limit
  teamMembers?: string[]; // Driver 2, Driver 3, Driver 4 names
  championship: ChampionshipType; // "ENGINEERING CHAMPIONSHIP" or "DAYTONA CHAMPIONSHIP"
  category: EventCategory;
  eventName: string; // e.g. "FORMULA-AI 2026 GRAND PRIX"
  utrNumber?: string;
  paymentAmount: number; // ₹80 or ₹50
  paymentStatus: PaymentStatus;
  status: RegistrationStatus;
  emailStatus: EmailStatus;
  rejectionReason?: string;
  submittedAt: string;
  updatedAt: string;
  paymentProofUrl?: string;
}

export type AppView = 
  | 'LANDING' 
  | 'REGISTRATION_FORM' 
  | 'REGISTRATION_RECEIVED' 
  | 'STATUS_PAGE' 
  | 'E_PASS' 
  | 'QR_VERIFICATION' 
  | 'ADMIN_LOGIN'
  | 'ADMIN_DASHBOARD' 
  | 'EMAIL_PREVIEW';
