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

export const NIGERIAN_STATE_CITIES: Record<string, string[]> = {
  'Abia': ['Aba', 'Umuahia', 'Ohafia', 'Arochukwu', 'Bende'],
  'Adamawa': ['Yola', 'Mubi', 'Numan', 'Jimeta', 'Ganye'],
  'Akwa Ibom': ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Abak'],
  'Anambra': ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia', 'Aguata'],
  'Bauchi': ['Bauchi', 'Azare', 'Misau', 'Katagum', 'Ningi'],
  'Bayelsa': ['Yenagoa', 'Ogbia', 'Brass', 'Sagbama', 'Ekeremor'],
  'Benue': ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala', 'Vandekya'],
  'Borno': ['Maiduguri', 'Biu', 'Gwoza', 'Askira', 'Damboa'],
  'Cross River': ['Calabar', 'Ogoja', 'Ikom', 'Obudu', 'Ugep'],
  'Delta': ['Asaba', 'Warri', 'Sapele', 'Ughelli', 'Agbor'],
  'Ebonyi': ['Abakaliki', 'Afikpo', 'Onueke', 'Ezza', 'Ishielu'],
  'Edo': ['Benin City', 'Ekpoma', 'Auchi', 'Uromi', 'Igarra'],
  'Ekiti': ['Ado-Ekiti', 'Ikere-Ekiti', 'Ijero-Ekiti', 'Efon-Alaaye', 'Omuo-Ekiti'],
  'Enugu': ['Enugu', 'Nsukka', 'Agbani', 'Oji River', 'Awgu'],
  'FCT - Abuja': ['Abuja', 'Gwagwalada', 'Kuje', 'Bwari', 'Kubwa'],
  'Gombe': ['Gombe', 'Dukku', 'Kaltungo', 'Billiri', 'Nafada'],
  'Imo': ['Owerri', 'Orlu', 'Okigwe', 'Mbaise', 'Oguta'],
  'Jigawa': ['Dutse', 'Hadejia', 'Gumel', 'Kazaure', 'Ringim'],
  'Kaduna': ['Kaduna', 'Zaria', 'Kafanchan', 'Kagoro', 'Soba'],
  'Kano': ['Kano', 'Wudil', 'Gwarzo', 'Rano', 'Bichi'],
  'Katsina': ['Katsina', 'Daura', 'Funtua', 'Malumfashi', 'Mani'],
  'Kebbi': ['Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru', 'Kamba'],
  'Kogi': ['Lokoja', 'Okene', 'Kabba', 'Idah', 'Ankpa'],
  'Kwara': ['Ilorin', 'Offa', 'Omu-Aran', 'Patigi', 'Lafiagi'],
  'Lagos': ['Lagos Island', 'Ikeja', 'Victoria Island', 'Lekki', 'Surulere', 'Yaba', 'Ajah', 'Ikorodu', 'Epe', 'Badagry', 'Apapa', 'Gbagada', 'Magodo', 'Maryland', 'Ojodu', 'Festac'],
  'Nasarawa': ['Lafia', 'Keffi', 'Akwanga', 'Nassarawa', 'Doma'],
  'Niger': ['Minna', 'Bida', 'Suleja', 'Kontagora', 'Lapai'],
  'Ogun': ['Abeokuta', 'Sagamu', 'Ijebu-Ode', 'Ota', 'Ilaro'],
  'Ondo': ['Akure', 'Ondo', 'Owo', 'Ikare', 'Okitipupa'],
  'Osun': ['Osogbo', 'Ile-Ife', 'Ilesa', 'Ede', 'Iwo'],
  'Oyo': ['Ibadan', 'Ogbomosho', 'Oyo', 'Iseyin', 'Saki', 'Eruwa', 'Lanlate'],
  'Plateau': ['Jos', 'Bukuru', 'Shendam', 'Pankshin', 'Barkin Ladi'],
  'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Bonny', 'Ahoada'],
  'Sokoto': ['Sokoto', 'Tambuwal', 'Wurno', 'Illela', 'Gwadabawa'],
  'Taraba': ['Jalingo', 'Wukari', 'Bali', 'Takum', 'Gembu'],
  'Yobe': ['Damaturu', 'Potiskum', 'Gashua', 'Nguru', 'Geidam'],
  'Zamfara': ['Gusau', 'Kaura Namoda', 'Talata Mafara', 'Anka', 'Maru'],
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
  { value: 'waec', label: 'WAEC / WASSCE' },
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
