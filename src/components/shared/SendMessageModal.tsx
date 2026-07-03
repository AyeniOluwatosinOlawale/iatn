'use client'

import { useState } from 'react'
import { X, MessageSquare, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface Props {
  tutorName: string
  tutorEmail: string
  senderName?: string
  senderEmail?: string
}

export default function SendMessageModal({ tutorName, tutorEmail, senderName = '', senderEmail = '' }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(senderName)
  const [email, setEmail] = useState(senderEmail)
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutor_email: tutorEmail,
          tutor_name: tutorName,
          sender_name: name,
          sender_email: email,
          sender_phone: phone,
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to send')
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setOpen(false)
    setTimeout(() => { setDone(false); setError(''); setMessage('') }, 300)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:border-[#0f3460] hover:text-[#0f3460] transition-colors text-sm"
      >
        <MessageSquare className="w-4 h-4" />
        Send Message
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-slate-900 text-lg">Message {tutorName.split(' ')[0]}</h2>
              <button onClick={close} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Message sent!</h3>
                <p className="text-slate-500 text-sm mb-4">
                  {tutorName.split(' ')[0]} will receive your message and typically replies within 24 hours. We also sent a copy to your email.
                </p>
                <button onClick={close} className="nexora-gradient text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:opacity-90">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Your name</label>
                  <input value={name} onChange={e => setName(e.target.value)} required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                    placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Your email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                    placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Phone <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                    placeholder="+234 800 000 0000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460] resize-none"
                    placeholder={`Hi ${tutorName.split(' ')[0]}, I found your profile on Nexora and I'd like to enquire about lessons...`} />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={close}
                    className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 nexora-gradient text-white font-semibold py-2.5 rounded-xl hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
