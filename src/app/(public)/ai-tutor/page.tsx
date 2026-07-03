'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  BookOpen, Send, Sparkles, ChevronDown, Copy, Check, RotateCcw,
  PenLine, FileText, Lightbulb, MessageSquare, GraduationCap, Menu, X,
  Zap, Target, BarChart3, ChevronRight
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant'
type Mode = 'concept' | 'mark' | 'practice' | 'feedback' | 'essay'

interface Message {
  id: string
  role: Role
  content: string
  mode?: Mode
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MODES: { key: Mode; label: string; icon: React.ElementType; desc: string; color: string }[] = [
  { key: 'concept', label: 'Concept Tutor', icon: Lightbulb, desc: 'Explain any topic with exam-focused depth', color: 'text-amber-600 bg-amber-50' },
  { key: 'mark', label: 'Mark My Answer', icon: PenLine, desc: 'Submit an answer — get marks + feedback', color: 'text-green-600 bg-green-50' },
  { key: 'practice', label: 'Exam Practice', icon: Target, desc: 'Generate exam-style questions with mark schemes', color: 'text-blue-600 bg-blue-50' },
  { key: 'feedback', label: 'Examiner Feedback', icon: FileText, desc: 'Chief examiner-style report on your work', color: 'text-purple-600 bg-purple-50' },
  { key: 'essay', label: 'Essay Review', icon: BarChart3, desc: 'Detailed critique of your extended writing', color: 'text-red-600 bg-red-50' },
]

const CURRICULA = [
  'Cambridge IGCSE', 'Cambridge A-Level', 'Edexcel IGCSE', 'Edexcel A-Level',
  'IB Diploma', 'OxfordAQA', 'SAT', 'ACT', 'WAEC / WASSCE', 'NECO / SSCE', 'JAMB / UTME'
]

const SUBJECTS: Record<string, string[]> = {
  'Cambridge IGCSE': ['Mathematics', 'Additional Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies', 'Computer Science', 'English Language', 'English Literature', 'Geography', 'History', 'Accounting'],
  'Cambridge A-Level': ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business', 'Computer Science', 'English Language', 'English Literature', 'Geography', 'History', 'Accounting', 'Psychology'],
  'Edexcel IGCSE': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business', 'English Language', 'English Literature'],
  'Edexcel A-Level': ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business', 'English Language', 'English Literature', 'Psychology'],
  'IB Diploma': ['Mathematics AA', 'Mathematics AI', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Management', 'Computer Science', 'English A', 'History', 'Geography', 'Psychology'],
  'OxfordAQA': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business'],
  'SAT': ['SAT Math', 'SAT Reading & Writing'],
  'ACT': ['ACT Math', 'ACT English', 'ACT Reading', 'ACT Science'],
  'WAEC / WASSCE': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting', 'Government', 'Literature in English', 'Geography', 'Agricultural Science', 'Further Mathematics'],
  'NECO / SSCE': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting', 'Government', 'Literature in English'],
  'JAMB / UTME': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Accounting', 'Government', 'Literature in English', 'Use of English'],
}

const STARTERS: Record<Mode, string[]> = {
  concept: [
    'Explain the difference between osmosis and diffusion for IGCSE Biology',
    'What is the mark scheme for a 6-mark "evaluate" question in A-Level Economics?',
    'Walk me through how to solve quadratic inequalities step by step',
    'Explain the significance of the 1905 Revolution for A-Level History',
  ],
  mark: [
    'Here is my answer to a 4-mark question — please mark it: [paste your answer]',
    'I answered a 6-mark Economics question. Give me an honest mark out of 6.',
    'Mark this Chemistry equation question: [paste your working]',
    'Please evaluate my response to this past paper question: [paste answer]',
  ],
  practice: [
    'Give me a 6-mark A-Level Biology question on cell division with a mark scheme',
    'Generate three IGCSE Physics data-based questions on electricity',
    'Create a 20-mark Economics essay question with mark bands',
    'Give me 5 multiple-choice questions on organic chemistry with answers',
  ],
  feedback: [
    'Here is my essay response — give me examiner-style feedback: [paste essay]',
    'What do examiners look for in a top-mark A-Level Economics evaluation?',
    'Give me an examiner\'s report on this Geography case study answer',
    'What are the most common mistakes students make on IGCSE Chemistry calculations?',
  ],
  essay: [
    'Please review this 25-mark A-Level History essay: [paste essay]',
    'Critique this Economics evaluation paragraph — be harsh: [paste paragraph]',
    'Review my IB extended essay introduction for structure and argument',
    'Analyse this English Literature essay for AO coverage: [paste essay]',
  ],
}

// ─── Message Formatter ───────────────────────────────────────────────────────
function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h3 key={i} className="font-black text-gray-900 text-base mt-3">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-black text-gray-900 text-lg mt-4">{line.slice(2)}</h2>
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-gray-900">{line.slice(2, -2)}</p>
        if (line.startsWith('- ') || line.startsWith('• ')) return (
          <div key={i} className="flex gap-2">
            <span className="text-[#0f3460] mt-0.5 shrink-0">•</span>
            <span>{formatInline(line.slice(2))}</span>
          </div>
        )
        if (/^\d+\./.test(line)) {
          const num = line.match(/^(\d+)\./)?.[1]
          return (
            <div key={i} className="flex gap-2">
              <span className="font-bold text-[#0f3460] shrink-0 w-5">{num}.</span>
              <span>{formatInline(line.replace(/^\d+\.\s*/, ''))}</span>
            </div>
          )
        }
        if (line.startsWith('> ')) return (
          <blockquote key={i} className="border-l-4 border-[#0f3460] pl-4 py-1 bg-blue-50 rounded-r-lg text-gray-700 italic">
            {line.slice(2)}
          </blockquote>
        )
        if (line === '') return <div key={i} className="h-1" />
        return <p key={i}>{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-[#0f3460]">{part.slice(1, -1)}</code>
    return part
  })
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('concept')
  const [curriculum, setCurriculum] = useState('Cambridge A-Level')
  const [subject, setSubject] = useState('Mathematics')
  const [isStreaming, setIsStreaming] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showModeMenu, setShowModeMenu] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentMode = MODES.find(m => m.key === mode)!
  const subjectList = SUBJECTS[curriculum] || SUBJECTS['Cambridge A-Level']

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!subjectList.includes(subject)) setSubject(subjectList[0])
  }, [curriculum, subjectList, subject])

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const sendMessage = useCallback(async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isStreaming) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: messageText, mode }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', mode }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsStreaming(true)

    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, mode, curriculum, subject }),
      })

      if (!res.ok) throw new Error('API error')

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
            const { text } = JSON.parse(data)
            if (text) {
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, content: m.content + text } : m
              ))
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: 'Sorry, I encountered an error. Please check your API key is set and try again.' }
          : m
      ))
    } finally {
      setIsStreaming(false)
    }
  }, [input, isStreaming, messages, mode, curriculum, subject])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  const clearChat = () => { setMessages([]); setInput('') }

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

        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Mode pill */}
        <div className="relative">
          <button
            onClick={() => setShowModeMenu(o => !o)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${currentMode.color}`}
          >
            <currentMode.icon className="w-3.5 h-3.5" />
            {currentMode.label}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showModeMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-64 py-1">
              {MODES.map(m => (
                <button
                  key={m.key}
                  onClick={() => { setMode(m.key); setShowModeMenu(false) }}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left ${mode === m.key ? 'bg-blue-50' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${m.color}`}>
                    <m.icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-xs">{m.label}</div>
                    <div className="text-gray-500 text-xs">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {messages.length > 0 && (
            <button onClick={clearChat} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1.5 rounded-lg hover:bg-gray-100">
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

              {/* Curriculum */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Curriculum</label>
                <select
                  value={curriculum}
                  onChange={e => setCurriculum(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white"
                >
                  {CURRICULA.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3460] bg-white"
                >
                  {subjectList.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Modes */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Mode</label>
                <div className="space-y-1">
                  {MODES.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                        mode === m.key ? 'bg-[#0f3460] text-white' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <m.icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 pt-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Quick Actions</label>
                <div className="space-y-1.5">
                  {[
                    { label: 'Find a Tutor', href: '/tutors', icon: GraduationCap },
                    { label: 'Practice Exams', href: '/exams', icon: Target },
                    { label: 'Resources', href: '/resources', icon: FileText },
                  ].map(item => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg">
                      <item.icon className="w-3.5 h-3.5" />
                      {item.label}
                      <ChevronRight className="w-3 h-3 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 leading-relaxed">
                AI responses are for learning support only. Always verify with official syllabus documents and your teacher.
              </div>
            </div>
          </aside>
        )}

        {/* ── Main Chat ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">

            {messages.length === 0 && (
              <div className="max-w-2xl mx-auto">
                {/* Welcome */}
                <div className="text-center mb-10">
                  <div className="w-16 h-16 nexora-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-black text-gray-900 mb-2">Nexora AI Tutor</h1>
                  <p className="text-gray-500 text-sm">
                    Exam-specific AI for <span className="font-semibold text-[#0f3460]">{curriculum}</span> · <span className="font-semibold text-[#0f3460]">{subject}</span>
                  </p>
                  <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mt-2 ${currentMode.color}`}>
                    <currentMode.icon className="w-3.5 h-3.5" />
                    {currentMode.label} mode
                  </div>
                </div>

                {/* Mode cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {MODES.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={`p-3 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                        mode === m.key ? 'border-[#0f3460] bg-[#0f3460]/5' : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${m.color}`}>
                        <m.icon className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-gray-900 text-xs">{m.label}</div>
                      <div className="text-gray-500 text-xs mt-0.5 leading-tight">{m.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Starter prompts */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Try asking...</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {STARTERS[mode].map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        className="text-left text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#0f3460] rounded-xl px-4 py-3 transition-all hover:shadow-sm"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500 inline mr-1.5 mb-0.5" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`max-w-3xl mx-auto w-full ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                {msg.role === 'user' ? (
                  <div className="bg-[#0f3460] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-lg text-sm">
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 nexora-gradient rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {/* Mode label */}
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
                          <FormattedMessage content={msg.content} />
                        )}
                      </div>
                      {msg.content && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-1.5 px-1"
                        >
                          {copiedId === msg.id ? <><Check className="w-3 h-3 text-green-500" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                        </button>
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
              {/* Quick mode buttons */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {MODES.map(m => (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0 ${
                      mode === m.key ? 'bg-[#0f3460] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <m.icon className="w-3 h-3" />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#0f3460] focus-within:ring-2 focus-within:ring-[#0f3460]/20 transition-all">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaInput}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      mode === 'mark' ? 'Paste your exam answer here for marking...' :
                      mode === 'practice' ? 'Ask for a practice question or paste your answer to a generated question...' :
                      mode === 'feedback' ? 'Paste your work for examiner-style feedback...' :
                      mode === 'essay' ? 'Paste your essay or extended response here...' :
                      `Ask anything about ${subject} — ${curriculum}...`
                    }
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none min-h-[24px] max-h-[200px]"
                    rows={1}
                    disabled={isStreaming}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{curriculum} · {subject} · {currentMode.label}</span>
                    <span className="text-xs text-gray-400">Enter to send · Shift+Enter for new line</span>
                  </div>
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isStreaming}
                  className="w-11 h-11 bg-[#0f3460] hover:bg-[#16213e] disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-3">
                Nexora AI can make mistakes. Always verify with your syllabus and teacher. ·{' '}
                <Link href="/about" className="hover:text-gray-600">About</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
