import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNgn(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const SUBJECTS = [
  'Mathematics',
  'Further Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Business Studies',
  'Computer Science',
  'English Language',
  'English Literature',
  'Geography',
  'History',
  'Accounting',
  'Psychology',
  'Sociology',
  'Art & Design',
  'Music',
  'French',
  'Other',
]

export const CURRICULA = [
  { value: 'igcse', label: 'Cambridge IGCSE' },
  { value: 'a_level', label: 'Cambridge AS & A Level' },
  { value: 'edexcel', label: 'Pearson Edexcel' },
  { value: 'oxfordaqa', label: 'OxfordAQA' },
  { value: 'sat', label: 'SAT (College Board)' },
  { value: 'act', label: 'ACT' },
  { value: 'ib', label: 'IB Diploma' },
  { value: 'jamb', label: 'JAMB / UTME' },
  { value: 'neco', label: 'NECO' },
  { value: 'jupeb', label: 'JUPEB' },
]

export const QUALIFICATION_TYPES = [
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'phd', label: 'PhD / Doctorate' },
  { value: 'pgde', label: 'PGDE (Postgraduate Diploma in Education)' },
  { value: 'qts', label: 'QTS (Qualified Teacher Status)' },
  { value: 'trcn', label: 'TRCN (Teachers Registration Council of Nigeria)' },
  { value: 'other', label: 'Other Certification' },
]

export const TEACHING_TOOLS = [
  'Zoom', 'Google Classroom', 'Microsoft Teams', 'Moodle',
  'Digital Whiteboard', 'Interactive Assessments', 'AI-Assisted Teaching',
  'Kahoot', 'Nearpod', 'Google Meet',
]

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
