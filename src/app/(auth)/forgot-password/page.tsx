'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Loader2, Mail, CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulated API call — Supabase not yet connected
    setTimeout(() => {
      setSent(true)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 nexora-gradient rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-slate-900 text-xl tracking-tight">Nexora</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900">Reset your password</h1>
            <p className="text-slate-500 text-sm mt-1">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          {!sent ? (
            /* Email form */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f3460] focus:border-transparent transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full nexora-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-500">
                Remember your password?{' '}
                <Link href="/login" className="font-semibold text-[#0f3460] hover:underline">
                  Back to login
                </Link>
              </div>
            </div>
          ) : (
            /* Success card */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">Check your email</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-1">
                We&apos;ve sent a password reset link to
              </p>
              <p className="text-sm font-semibold text-[#0f3460] mb-6 break-all">{email}</p>
              <p className="text-xs text-slate-400 mb-8">
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSent(false)}
                  className="text-[#0f3460] hover:underline font-medium"
                >
                  try again
                </button>
                .
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:border-[#0f3460] hover:text-[#0f3460] transition-colors text-sm"
              >
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
