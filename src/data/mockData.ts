import { DriverRegistration } from '../types';

export const INITIAL_MOCK_REGISTRATIONS: DriverRegistration[] = [
  {
    id: 'FA26-94821',
    fullName: 'Sarath Chandra',
    email: 'sarathchandra@gmail.com',
    phone: '9505198204',
    organization: 'Apex Racing Academy',
    year: '4th Year',
    department: 'Computer Science & AI',
    teamName: 'Apex Monza Racing',
    teamSizeCount: 2,
    teamMembers: ['Sarath Chandra', 'Rahul Varma'],
    championship: 'ENGINEERING CHAMPIONSHIP',
    category: 'POLE POSITION CHALLENGE (Coding)',
    eventName: 'FORMULA-AI 2026 GRAND PRIX',
    utrNumber: '950519820401',
    paymentAmount: 160,
    paymentStatus: 'VERIFIED',
    status: 'APPROVED',
    emailStatus: 'SENT',
    submittedAt: '2026-08-14 23:29:17',
    updatedAt: '2026-08-14 23:29:17'
  },
  {
    id: 'FA26-38291',
    fullName: 'Vikram Racing',
    email: 'vikram@formula-ai.in',
    phone: '9876543210',
    organization: 'Monza Speed Club',
    year: '3rd Year',
    department: 'AI & Data Science',
    teamName: 'Scuderia Turbo',
    teamSizeCount: 1,
    teamMembers: ['Vikram Racing'],
    championship: 'PODIUM COMBO (4 Non-Tech Events)',
    category: 'PODIUM COMBO (4 Non-Tech Events)',
    eventName: 'FORMULA-AI 2026 GRAND PRIX',
    utrNumber: '847291038472',
    paymentAmount: 150,
    paymentStatus: 'VERIFIED',
    status: 'APPROVED',
    emailStatus: 'SENT',
    submittedAt: '2026-08-14 23:29:17',
    updatedAt: '2026-08-14 23:29:17'
  }
];
