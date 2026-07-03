'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  BookOpen, Send, Sparkles, ChevronDown, Copy, Check, RotateCcw,
  PenLine, FileText, Lightbulb, GraduationCap, Menu,
  Zap, Target, BarChart3, ChevronRight, Mic, MicOff, Paperclip, X, File, FlaskConical,
  Lock, Loader2, Eye, EyeOff, AlertCircle,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant'
type Mode = 'concept' | 'mark' | 'practice' | 'feedback' | 'essay' | 'solve'

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }

interface Message {
  id: string
  role: Role
  content: string | ContentPart[]
  mode?: Mode
  attachmentName?: string
}

interface Attachment {
  name: string
  type: 'pdf' | 'image' | 'text'
  content: string        // base64 data URL (single image) or plain text
  pages?: string[]       // PDF: one base64 JPEG per page (rendered via canvas)
  pageCount?: number
  previewUrl?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MODES: { key: Mode; label: string; icon: React.ElementType; desc: string; color: string }[] = [
  { key: 'solve',    label: 'Solve Past Paper',   icon: FlaskConical, desc: 'Full step-by-step worked solutions',         color: 'text-orange-600 bg-orange-50' },
  { key: 'concept',  label: 'Concept Tutor',     icon: Lightbulb,   desc: 'Explain any topic with exam depth',          color: 'text-amber-600 bg-amber-50' },
  { key: 'mark',     label: 'Mark My Answer',     icon: PenLine,     desc: 'Submit an answer — get marks + feedback',    color: 'text-green-600 bg-green-50' },
  { key: 'practice', label: 'Exam Practice',      icon: Target,      desc: 'Generate exam-style questions + schemes',    color: 'text-blue-600 bg-blue-50' },
  { key: 'feedback', label: 'Examiner Feedback',  icon: FileText,    desc: 'Chief examiner-style report on your work',   color: 'text-purple-600 bg-purple-50' },
  { key: 'essay',    label: 'Essay Review',       icon: BarChart3,   desc: 'Detailed critique of your extended writing', color: 'text-red-600 bg-red-50' },
]

const CURRICULA = [
  'Cambridge IGCSE', 'Cambridge A-Level', 'Edexcel IGCSE', 'Edexcel A-Level',
  'IB Diploma', 'OxfordAQA', 'SAT', 'ACT', 'WAEC / WASSCE', 'NECO / SSCE', 'JAMB / UTME',
]

const SUBJECTS: Record<string, string[]> = {
  'Cambridge IGCSE':   ['Mathematics', 'Additional Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Computer Science', 'English Language', 'English Literature', 'Geography', 'History', 'Accounting'],
  'Cambridge A-Level': ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business', 'Computer Science', 'English Language', 'English Literature', 'Geography', 'History', 'Accounting', 'Psychology'],
  'Edexcel IGCSE':     ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business', 'English Language', 'English Literature'],
  'Edexcel A-Level':   ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business', 'English Language', 'English Literature', 'Psychology'],
  'IB Diploma':        ['Mathematics AA', 'Mathematics AI', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Management', 'Computer Science', 'English A', 'History', 'Geography', 'Psychology'],
  'OxfordAQA':         ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business'],
  'SAT':               ['SAT Math', 'SAT Reading & Writing'],
  'ACT':               ['ACT Math', 'ACT English', 'ACT Reading', 'ACT Science'],
  'WAEC / WASSCE':     ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting', 'Government', 'Literature in English', 'Geography', 'Agricultural Science', 'Further Mathematics'],
  'NECO / SSCE':       ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting', 'Government', 'Literature in English'],
  'JAMB / UTME':       ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting', 'Government', 'Literature in English', 'Use of English'],
}

const STARTERS: Record<Mode, string[]> = {
  solve:    ['Solve this IGCSE Physics question step by step: [paste question]', 'Work through this A-Level Mathematics past paper question with full working: [paste question]', 'I have attached a past paper PDF — please solve all the questions', 'Explain how to solve this Economics 25-mark question: [paste question]'],
  concept:  ['Explain the difference between osmosis and diffusion for IGCSE Biology', 'What is the mark scheme for a 6-mark "evaluate" question in A-Level Economics?', 'Walk me through how to solve quadratic inequalities step by step', 'Explain the significance of the 1905 Revolution for A-Level History'],
  mark:     ['Here is my answer to a 4-mark question — please mark it: [paste your answer]', 'I answered a 6-mark Economics question. Give me an honest mark out of 6.', 'Mark this Chemistry equation question: [paste your working]', 'Please evaluate my response to this past paper question: [paste answer]'],
  practice: ['Give me a 6-mark A-Level Biology question on cell division with a mark scheme', 'Generate three IGCSE Physics data-based questions on electricity', 'Create a 20-mark Economics essay question with mark bands', 'Give me 5 multiple-choice questions on organic chemistry with answers'],
  feedback: ['Here is my essay response — give me examiner-style feedback: [paste essay]', 'What do examiners look for in a top-mark A-Level Economics evaluation?', 'Give me an examiner\'s report on this Geography case study answer', 'What are the most common mistakes students make on IGCSE Chemistry calculations?'],
  essay:    ['Please review this 25-mark A-Level History essay: [paste essay]', 'Critique this Economics evaluation paragraph — be harsh: [paste paragraph]', 'Review my IB extended essay introduction for structure and argument', 'Analyse this English Literature essay for AO coverage: [paste essay]'],
}

// ─── PDF → Page Images (preserves diagrams, graphs, figures) ─────────────────
async function renderPdfPages(file: File, maxPages = 20): Promise<{ pages: string[]; total: number }> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const total = pdf.numPages
  const limit = Math.min(total, maxPages)
  const pages: string[] = []

  for (let i = 1; i <= limit; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale: 1.5 })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!
    await page.render({ canvasContext: ctx, viewport }).promise
    pages.push(canvas.toDataURL('image/jpeg', 0.80))
  }

  return { pages, total }
}

// ─── Message Formatter ────────────────────────────────────────────────────────
function FormattedMessage({ content }: { content: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('## ')) return <h3 key={i} className="font-black text-gray-900 text-base mt-3 first:mt-0">{line.slice(3)}</h3>
        if (line.startsWith('# '))  return <h2 key={i} className="font-black text-gray-900 text-lg mt-4 first:mt-0">{line.slice(2)}</h2>
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-900">{line.slice(2,-2)}</p>
        if (line.startsWith('- ') || line.startsWith('• ')) return <div key={i} className="flex gap-2"><span className="text-[#0f3460] mt-0.5 shrink-0">•</span><span>{inlineFmt(line.slice(2))}</span></div>
        if (/^\d+\./.test(line)) { const num = line.match(/^(\d+)\./)?.[1]; return <div key={i} className="flex gap-2"><span className="font-bold text-[#0f3460] shrink-0 w-5">{num}.</span><span>{inlineFmt(line.replace(/^\d+\.\s*/,''))}</span></div> }
        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-[#0f3460] pl-4 py-1 bg-blue-50 rounded-r-lg text-gray-700 italic">{line.slice(2)}</blockquote>
        if (line === '') return <div key={i} className="h-1" />
        return <p key={i}>{inlineFmt(line)}</p>
      })}
    </div>
  )
}

function inlineFmt(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} className="font-bold text-gray-900">{p.slice(2,-2)}</strong>
    if (p.startsWith('`')  && p.endsWith('`'))  return <code key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-[#0f3460]">{p.slice(1,-1)}</code>
    return p
  })
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────
function AITutorGate({ onSuccess }: { onSuccess: () => void }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Verify credentials AND role against the database via server API
      const res = await fetch('/api/auth/check-ai-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Access denied.')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-14 h-14 nexora-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Sign in to use AI Tutor</h2>
          <p className="text-slate-500 text-sm mt-1">Available to registered students, tutors, parents and schools.</p>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f3460]"
                placeholder="Your password"
              />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full nexora-gradient text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In & Open AI Tutor'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          No account?{' '}
          <Link href="/register" className="font-semibold text-[#0f3460] hover:underline">Create one free</Link>
        </p>
        <p className="text-center text-sm text-slate-500 mt-1">
          <Link href="/login?redirectTo=/ai-tutor" className="text-slate-400 hover:text-slate-600 text-xs">Forgot password?</Link>
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AITutorPage() {
  const [authChecked,  setAuthChecked]  = useState(false)
  const [authed,       setAuthed]       = useState(false)
  const [messages,     setMessages]     = useState<Message[]>([])
  const [input,        setInput]        = useState('')
  const [mode,         setMode]         = useState<Mode>('concept')
  const [curriculum,   setCurriculum]   = useState('Cambridge A-Level')
  const [subject,      setSubject]      = useState('Mathematics')
  const [isStreaming,  setIsStreaming]  = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [copiedId,     setCopiedId]     = useState<string | null>(null)
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [attachment,   setAttachment]   = useState<Attachment | null>(null)
  const [attachLoading,setAttachLoading]= useState(false)
  const [isRecording,  setIsRecording]  = useState(false)
  const [voiceError,   setVoiceError]   = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef    = useRef<HTMLTextAreaElement>(null)
  const fileInputRef   = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const currentMode  = MODES.find(m => m.key === mode)!
  const subjectList  = SUBJECTS[curriculum] || SUBJECTS['Cambridge A-Level']

  useEffect(() => {
    // Always require explicit login for AI Tutor — no session bypass
    setAuthChecked(true)
  }, [])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (!subjectList.includes(subject)) setSubject(subjectList[0]) }, [curriculum, subjectList, subject])

  // ── Voice Recording ──────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceError('Voice recognition not supported in this browser. Try Chrome.')
      setTimeout(() => setVoiceError(''), 3000)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-GB'
    recognition.continuous = true
    recognition.interimResults = true

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('')
      setInput(transcript)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
      }
    }
    recognition.onerror = () => { setIsRecording(false) }
    recognition.onend   = () => { setIsRecording(false) }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
    setVoiceError('')
  }, [isRecording])

  // ── File Attachment ──────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    setAttachLoading(true)
    try {
      if (file.type === 'application/pdf') {
        const { pages, total } = await renderPdfPages(file, 20)
        if (pages.length === 0) {
          setVoiceError('Could not render this PDF. Please try a different file.')
          setTimeout(() => setVoiceError(''), 4000)
          return
        }
        setAttachment({ name: file.name, type: 'pdf', content: '', pages, pageCount: total })
        setMode('solve')
      } else {
        setVoiceError('Only PDF past papers are accepted. Please upload a PDF file.')
        setTimeout(() => setVoiceError(''), 3000)
        return
      }
    } catch (err) {
      console.error('PDF load error:', err)
      setVoiceError('Failed to render PDF. Please try again or use a different file.')
      setTimeout(() => setVoiceError(''), 5000)
    } finally {
      setAttachLoading(false)
    }
  }, [])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  // ── Send Message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text?: string) => {
    const messageText = (text || input).trim()
    if (!messageText && !attachment) return
    if (isStreaming) return

    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false) }

    // Build content — text + optional image
    let userContent: string | ContentPart[]

    if (attachment?.type === 'pdf' && attachment.pages && attachment.pages.length > 0) {
      // PDF rendered as images — the AI sees every page including all figures and diagrams
      const defaultText = mode === 'solve'
        ? `This is a Cambridge A-Level past paper (${attachment.name}). It has ${attachment.pageCount} pages. I am sending you every page as an image so you can see ALL questions, figures, graphs, circuit diagrams, and data tables. Please solve EVERY question in order, showing full step-by-step working, mark scheme points hit, and examiner tips for each.`
        : mode === 'mark'
        ? 'These are pages from my submitted answer. Please mark each question against mark scheme criteria and give detailed feedback.'
        : `Please analyse all pages of this document (${attachment.name}) thoroughly.`
      userContent = [
        { type: 'text', text: messageText || defaultText },
        ...attachment.pages.map(p => ({ type: 'image_url' as const, image_url: { url: p } })),
      ] as ContentPart[]
    } else if (attachment?.type === 'image') {
      const defaultImageText = mode === 'solve'
        ? 'This is a past paper image. Please read every question, figure, graph and diagram carefully and solve them all step by step with full working, mark scheme points, and examiner tips.'
        : mode === 'mark'
        ? 'Please mark this answer against the mark scheme criteria and give honest feedback.'
        : 'Please analyse this image and answer any questions shown.'
      userContent = [
        { type: 'text', text: messageText || defaultImageText },
        { type: 'image_url', image_url: { url: attachment.content } },
      ] as ContentPart[]
    } else {
      userContent = messageText
    }

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user',
      content: userContent, mode,
      attachmentName: attachment?.name,
    }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', mode }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInput('')
    setAttachment(null)
    setIsStreaming(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      // Serialise history for API — convert content arrays to text for non-vision messages
      const history = [...messages, userMsg].map(m => {
        if (Array.isArray(m.content)) {
          return { role: m.role, content: m.content }
        }
        return { role: m.role, content: m.content }
      })

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, mode, curriculum, subject }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(err.error || 'API error')
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const { text: chunk, error } = JSON.parse(data)
            if (error) throw new Error(error)
            if (chunk) setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: (m.content as string) + chunk } : m))
          } catch { /* skip */ }
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setMessages(prev => prev.map(m =>
        m.id === assistantId ? { ...m, content: `Sorry, something went wrong: ${msg}. Please try again.` } : m
      ))
    } finally {
      setIsStreaming(false)
    }
  }, [input, attachment, isStreaming, isRecording, messages, mode, curriculum, subject])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  const handleCopy = (id: string, content: string | ContentPart[]) => {
    const text = typeof content === 'string' ? content : content.map(p => p.type === 'text' ? p.text : '').join('')
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getDisplayText = (content: string | ContentPart[]): string => {
    if (typeof content === 'string') {
      // Truncate long PDF content in display
      if (content.startsWith('[ATTACHED DOCUMENT:')) {
        const endIdx = content.indexOf('[END DOCUMENT]')
        const afterDoc = content.slice(endIdx + '[END DOCUMENT]'.length).trim()
        const docName = content.match(/\[ATTACHED DOCUMENT: ([^\]]+)\]/)?.[1]
        return afterDoc || `Analyse ${docName}`
      }
      return content
    }
    return content.find(p => p.type === 'text')?.text || ''
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#0f3460] animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return <AITutorGate onSuccess={() => setAuthed(true)} />
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-gray-200 flex items-center gap-3 px-4 h-14 shrink-0 z-20">
        <Link href="/" className="flex items-center gap-2 mr-2">
          <div className="w-7 h-7 bg-[#0f3460] rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-gray-900 hidden sm:block">Nexora Academic</span>
        </Link>
        <div className="h-5 w-px bg-gray-200" />
        <button onClick={() => setSidebarOpen(o => !o)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <Menu className="w-4 h-4" />
        </button>

        {/* Mode pill */}
        <div className="relative">
          <button onClick={() => setShowModeMenu(o => !o)} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${currentMode.color}`}>
            <currentMode.icon className="w-3.5 h-3.5" />
            {currentMode.label}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showModeMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-64 py-1">
              {MODES.map(m => (
                <button key={m.key} onClick={() => { setMode(m.key); setShowModeMenu(false) }}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left ${mode === m.key ? 'bg-blue-50' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${m.color}`}><m.icon className="w-3.5 h-3.5" /></div>
                  <div><div className="font-semibold text-gray-900 text-xs">{m.label}</div><div className="text-gray-500 text-xs">{m.desc}</div></div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {messages.length > 0 && (
            <button onClick={() => { setMessages([]); setInput(''); setAttachment(null) }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded-lg hover:bg-gray-100">
              <RotateCcw className="w-3.5 h-3.5" /> New Chat
            </button>
          )}
          <Link href="/register?role=student" className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-[#0f3460] text-white px-3 py-1.5 rounded-lg hover:bg-[#16213e]">
            <Sparkles className="w-3.5 h-3.5" /> Save Progress
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Curriculum</label>
                <select value={curriculum} onChange={e => setCurriculum(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
                  {CURRICULA.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white">
                  {subjectList.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Mode</label>
                <div className="space-y-1">
                  {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${mode === m.key ? 'bg-[#0f3460] text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                      <m.icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Quick Actions</label>
                <div className="space-y-1.5">
                  {[
                    { label: 'Find a Tutor',  href: '/tutors',    icon: GraduationCap },
                    { label: 'Practice Exams',href: '/exams',     icon: Target },
                    { label: 'Resources',     href: '/resources', icon: FileText },
                  ].map(item => (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg">
                      <item.icon className="w-3.5 h-3.5" />{item.label}<ChevronRight className="w-3 h-3 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 leading-relaxed">
                AI responses are for learning support only. Always verify with official syllabus documents and your teacher.
              </div>
            </div>
          </aside>
        )}

        {/* ── Main Chat ── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

            {messages.length === 0 && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 nexora-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-black text-gray-900 mb-2">Nexora AI Tutor</h1>
                  <p className="text-gray-500 text-sm">
                    Exam-specific AI for <span className="font-semibold text-[#0f3460]">{curriculum}</span> · <span className="font-semibold text-[#0f3460]">{subject}</span>
                  </p>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mt-2 ${currentMode.color}`}>
                    <currentMode.icon className="w-3.5 h-3.5" />{currentMode.label} mode
                  </div>
                  <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-3">
                    <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> Voice input supported</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" /> Past paper PDF upload</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all hover:shadow-md ${mode === m.key ? 'border-[#0f3460] bg-[#0f3460]/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${m.color}`}><m.icon className="w-4 h-4" /></div>
                      <div className="font-bold text-gray-900 text-xs">{m.label}</div>
                      <div className="text-gray-500 text-xs mt-0.5 leading-tight">{m.desc}</div>
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Try asking...</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {STARTERS[mode].map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)}
                      className="text-left text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#0f3460] rounded-xl px-4 py-3 transition-all hover:shadow-sm">
                      <Zap className="w-3.5 h-3.5 text-amber-500 inline mr-1.5 mb-0.5" />{s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, msgIdx) => (
              <div key={msg.id} className={`max-w-3xl mx-auto w-full ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-lg">
                    {/* Image preview in message */}
                    {Array.isArray(msg.content) && msg.content.find(p => p.type === 'image_url') && (
                      <div className="mb-2 flex justify-end">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={(msg.content.find(p => p.type === 'image_url') as { type: 'image_url'; image_url: { url: string } })?.image_url?.url}
                          alt="attachment"
                          className="max-h-48 rounded-xl border border-gray-200 object-contain"
                        />
                      </div>
                    )}
                    {/* Attachment pill */}
                    {msg.attachmentName && (
                      <div className="flex justify-end mb-1">
                        <span className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                          <File className="w-3 h-3" />{msg.attachmentName}
                        </span>
                      </div>
                    )}
                    <div className="bg-[#0f3460] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm">
                      {getDisplayText(msg.content)}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 nexora-gradient rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {msg.mode && (
                        <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${MODES.find(m => m.key === msg.mode)?.color}`}>
                          {(() => { const M = MODES.find(m => m.key === msg.mode); return M ? <M.icon className="w-3 h-3" /> : null })()}
                          {MODES.find(m => m.key === msg.mode)?.label}
                        </div>
                      )}
                      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                        {msg.content === '' && isStreaming ? (
                          <div className="flex items-center gap-1.5 py-1">
                            <div className="w-2 h-2 bg-[#0f3460] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-[#0f3460] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-[#0f3460] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          <FormattedMessage content={typeof msg.content === 'string' ? msg.content : ''} />
                        )}
                      </div>
                      {msg.content && (
                        <div className="flex items-center gap-3 mt-1.5">
                          <button onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 px-1">
                            {copiedId === msg.id ? <><Check className="w-3 h-3 text-green-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                          </button>
                          {/* Continue button — shown on last assistant message when not streaming */}
                          {!isStreaming && msgIdx === messages.length - 1 && msg.role === 'assistant' && (
                            <button
                              onClick={() => sendMessage('Continue from exactly where you stopped. Do not repeat anything already written.')}
                              className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-full transition-colors"
                            >
                              <ChevronRight className="w-3 h-3" /> Continue
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Area ── */}
          <div className="border-t border-gray-200 bg-white px-4 py-4">
            <div className="max-w-3xl mx-auto">
              {/* Mode pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {MODES.map(m => (
                  <button key={m.key} onClick={() => setMode(m.key)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${mode === m.key ? 'bg-[#0f3460] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <m.icon className="w-3 h-3" />{m.label}
                  </button>
                ))}
              </div>

              {/* Attachment preview */}
              {(attachment || attachLoading) && (
                <div className="mb-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
                  {attachLoading ? (
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      Rendering PDF pages — this may take a moment…
                    </div>
                  ) : attachment && (
                    <>
                      <File className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-sm text-blue-800 font-medium truncate">{attachment.name}</span>
                      {attachment.pages && (
                        <span className="text-xs text-blue-500 ml-1 shrink-0">
                          {attachment.pages.length} page{attachment.pages.length !== 1 ? 's' : ''} rendered
                          {attachment.pageCount && attachment.pageCount > attachment.pages.length
                            ? ` (of ${attachment.pageCount})`
                            : ''}
                          {' '}· AI can see all figures &amp; diagrams
                        </span>
                      )}
                      <button onClick={() => setAttachment(null)} className="ml-auto text-blue-400 hover:text-blue-700 shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Voice error */}
              {voiceError && (
                <div className="mb-2 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{voiceError}</div>
              )}

              {/* Textarea row */}
              <div className="flex gap-2 items-end">
                {/* Attach button */}
                <button onClick={() => fileInputRef.current?.click()}
                  disabled={attachLoading}
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#0f3460] transition-colors shrink-0"
                  title="Attach past paper PDF">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={onFileChange} />

                {/* Textarea */}
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#0f3460] focus-within:ring-2 focus-within:ring-[#0f3460]/20 transition-all">
                  <textarea ref={textareaRef} value={input} onChange={handleTextareaInput} onKeyDown={handleKeyDown}
                    placeholder={
                      isRecording ? '🎤 Listening...' :
                      attachment ? `Ask a question about ${attachment.name}...` :
                      mode === 'mark' ? 'Paste your exam answer here for marking...' :
                      mode === 'essay' ? 'Paste your essay here...' :
                      `Ask anything about ${subject} — ${curriculum}...`
                    }
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none min-h-[24px] max-h-[200px]"
                    rows={1} disabled={isStreaming} />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{curriculum} · {subject} · {currentMode.label}</span>
                    <span className="text-xs text-gray-400 hidden sm:block">Enter to send · Shift+Enter for new line</span>
                  </div>
                </div>

                {/* Mic button */}
                <button onClick={toggleVoice}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#0f3460]'}`}
                  title={isRecording ? 'Stop recording' : 'Voice input'}>
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send button */}
                <button onClick={() => sendMessage()} disabled={(!input.trim() && !attachment) || isStreaming}
                  className="w-10 h-10 bg-[#0f3460] hover:bg-[#16213e] disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
