'use client'

import { useState } from 'react'

export default function VerifyControls({ tutorId, isVerified }: { tutorId: string; isVerified: boolean }) {
  const [verified, setVerified] = useState(isVerified)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch('/api/admin/verify-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutor_id: tutorId, verified: !verified }),
    })
    if (res.ok) setVerified(v => !v)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
        verified
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      }`}
    >
      {loading ? '...' : verified ? 'Revoke' : 'Verify'}
    </button>
  )
}
