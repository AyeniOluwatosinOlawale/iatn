import Link from 'next/link'
import { Calendar, Clock, Video, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { formatNgn } from '@/lib/utils'

// Hardcoded sample tutor data for id '1'
const TUTOR_DATA = {
  id: '1',
  name: 'Dr. Adaeze Obi',
  initials: 'DA',
  location: 'Victoria Island, Lagos',
  rating: 4.9,
  hourly_rate_ngn: 25000,
  is_verified: true,
  subjects: [
    { label: 'Mathematics A-Level', value: 'maths_a_level' },
    { label: 'Further Maths IGCSE', value: 'further_maths_igcse' },
  ],
}

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
]

const DURATIONS: { label: string; hours: number }[] = [
  { label: '1 hour', hours: 1 },
  { label: '1.5 hours', hours: 1.5 },
  { label: '2 hours', hours: 2 },
]

export default function BookingPage() {
  const tutor = TUTOR_DATA

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Purple/blue gradient header */}
      <div className="iatn-gradient text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to tutors
          </Link>
          <h1 className="text-3xl font-black">Book a Lesson</h1>
          <p className="text-white/70 mt-1 text-sm">
            Complete the form below to request a lesson with {tutor.name}
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT — Tutor summary + pricing */}
          <div className="lg:col-span-2 space-y-4">

            {/* Tutor card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-xl iatn-gradient flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  {tutor.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-black text-slate-900 text-lg leading-tight">{tutor.name}</h2>
                    {tutor.is_verified && (
                      <span className="badge-verified">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>{tutor.location}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-amber-400 text-sm">★</span>
                    <span className="text-sm font-semibold text-slate-900">{tutor.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">/ 5.0</span>
                  </div>
                </div>
              </div>

              {/* Hourly rate */}
              <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4">
                <div className="text-xs text-slate-500 mb-0.5">Hourly rate</div>
                <div className="text-2xl font-black text-slate-900">
                  {formatNgn(tutor.hourly_rate_ngn)}
                  <span className="text-sm font-normal text-slate-500"> / hr</span>
                </div>
              </div>

              {/* Subjects */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Subjects taught
                </h3>
                <div className="flex flex-col gap-1.5">
                  {tutor.subjects.map((s) => (
                    <div
                      key={s.value}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing breakdown card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Pricing breakdown</h3>
              <div className="space-y-2 text-sm">
                {DURATIONS.map((d) => (
                  <div key={d.hours} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600">
                      {formatNgn(tutor.hourly_rate_ngn)} &times; {d.label}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatNgn(tutor.hourly_rate_ngn * d.hours)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Final total depends on your selected duration below.
              </p>
            </div>
          </div>

          {/* RIGHT — Booking form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-black text-slate-900 text-lg mb-5">Lesson details</h2>

              {/* Pure HTML form — no backend action yet */}
              <form className="space-y-5">

                {/* Lesson type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <Video className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                    Lesson type
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent bg-white transition">
                    <option value="one_on_one">One-on-One</option>
                    <option value="group">Group</option>
                    <option value="trial">Trial Lesson</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent bg-white transition">
                    <option value="maths_a_level">Maths A-Level</option>
                    <option value="further_maths_igcse">Further Maths IGCSE</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                    Preferred date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent transition"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <Clock className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
                    Preferred time
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent bg-white transition">
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Duration
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent bg-white transition">
                    {DURATIONS.map((d) => (
                      <option key={d.hours} value={d.hours}>{d.label}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Additional notes{' '}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. specific topics to cover, current exam board, upcoming exam date..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent transition resize-none"
                  />
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Link
                    href={`/tutors/${tutor.id}`}
                    className="block w-full iatn-gradient text-white text-center font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Proceed to Payment
                  </Link>
                  <p className="text-xs text-center text-slate-400 mt-2">
                    Payment integration coming soon
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
