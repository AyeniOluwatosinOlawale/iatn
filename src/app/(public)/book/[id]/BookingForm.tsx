'use client'

import { useState } from 'react'
import { Calendar, Clock, Video, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

const TIME_SLOTS = [
  '8:00 AM','9:00 AM','10:00 AM','11:00 AM',
  '12:00 PM','1:00 PM','2:00 PM','3:00 PM',
  '4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM',
]

const DURATIONS = [
  { label: '1 hour', hours: 1 },
  { label: '1.5 hours', hours: 1.5 },
  { label: '2 hours', hours: 2 },
]

interface Props {
  tutorId: string
  tutorName: string
  subjects: { subject: string; curriculum: string }[]
  offersTrialLesson: boolean
  teachingMode: string
  hourlyRateNgn: number
  userId: string
}

function timeToDate(dateStr: string, timeSlot: string): Date {
  const [time, meridiem] = timeSlot.split(' ')
  let [hours] = time.split(':').map(Number)
  const [, minuteStr] = time.split(':')
  const minutes = parseInt(minuteStr ?? '0')
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  const d = new Date(dateStr)
  d.setHours(hours, minutes ?? 0, 0, 0)
  return d
}

export default function BookingForm({
  tutorId, tutorName, subjects, offersTrialLesson,
  teachingMode, hourlyRateNgn, userId,
}: Props) {
  const [lessonType, setLessonType] = useState('one_on_one')
  const [subject, setSubject] = useState(subjects[0] ? `${subjects[0].subject}|${subjects[0].curriculum}` : '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('9:00 AM')
  const [duration, setDuration] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const totalCost = hourlyRateNgn * duration

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) { setError('Please select a preferred date.'); return }
    setLoading(true)
    setError('')

    try {
      const startTime = timeToDate(date, time)
      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000)
      const [subjectName, curriculum] = subject.split('|')

      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutor_id: tutorId,
          student_user_id: userId,
          subject: subjectName,
          curriculum,
          lesson_type: lessonType,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          notes,
          amount_ngn: totalCost,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Booking failed')
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Booking Request Sent!</h2>
        <p className="text-slate-600 text-sm mb-1">Your lesson request has been sent to <strong>{tutorName}</strong>.</p>
        <p className="text-slate-500 text-sm mb-6">They will confirm your booking within 24 hours. You will receive an email notification.</p>
        <a href="/student-dashboard/bookings" className="inline-block nexora-gradient text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
          View My Bookings
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 className="font-black text-slate-900 text-lg mb-5">Lesson details</h2>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Lesson type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            <Video className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
            Lesson type
          </label>
          <select value={lessonType} onChange={e => setLessonType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
            <option value="one_on_one">One-on-One</option>
            {teachingMode !== 'online' && <option value="group">Group</option>}
            {offersTrialLesson && <option value="trial">Trial Lesson (Free)</option>}
          </select>
        </div>

        {/* Subject */}
        {subjects.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
              {subjects.map(s => (
                <option key={`${s.subject}|${s.curriculum}`} value={`${s.subject}|${s.curriculum}`}>
                  {s.subject} — {s.curriculum?.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            <Calendar className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
            Preferred date
          </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460]" />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            <Clock className="w-3.5 h-3.5 inline mr-1.5 text-slate-400" />
            Preferred time
          </label>
          <select value={time} onChange={e => setTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
            {TIME_SLOTS.map(slot => <option key={slot}>{slot}</option>)}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
          <select value={duration} onChange={e => setDuration(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
            {DURATIONS.map(d => <option key={d.hours} value={d.hours}>{d.label}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Additional notes <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="e.g. specific topics to cover, upcoming exam date, current level..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f3460] resize-none" />
        </div>

        {/* Cost summary */}
        {hourlyRateNgn > 0 && lessonType !== 'trial' && (
          <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm text-slate-600">Estimated cost ({duration}h)</span>
            <span className="font-black text-[#0f3460] text-lg">₦{totalCost.toLocaleString()}</span>
          </div>
        )}
        {lessonType === 'trial' && (
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <span className="text-sm font-semibold text-emerald-700">🎉 Trial lesson is free!</span>
          </div>
        )}

        <div className="pt-2">
          <button type="submit" disabled={loading}
            className="w-full nexora-gradient text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Sending request...' : 'Request Booking'}
          </button>
          <p className="text-xs text-center text-slate-400 mt-2">
            Payment is collected after the tutor confirms your booking.
          </p>
        </div>
      </form>
    </div>
  )
}
