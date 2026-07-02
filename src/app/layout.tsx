import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexora Academic — Connecting Knowledge, Unlocking Futures',
  description: "Nigeria's most trusted platform to find verified IGCSE, A-Level, IB, and SAT tutors, schools, and educational resources.",
  keywords: ['IGCSE tutor Nigeria', 'A-Level tutor Nigeria', 'Cambridge tutor Lagos', 'IB tutor Nigeria', 'SAT tutor Nigeria'],
  openGraph: {
    title: 'Nexora Academic — Connecting Knowledge, Unlocking Futures',
    description: "Find verified IGCSE, A-Level, IB, and SAT tutors across Nigeria.",
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
