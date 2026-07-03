import { NextRequest } from 'next/server'

// ─── Model Router ─────────────────────────────────────────────────────────────
const MODEL_ROUTER: Record<string, { model: string; maxTokens: number; vision: boolean }> = {
  concept:  { model: 'meta-llama/llama-3.1-70b-instruct', maxTokens: 2048, vision: false },
  practice: { model: 'openai/gpt-4o-mini',                    maxTokens: 2048, vision: false },
  mark:     { model: 'anthropic/claude-sonnet-4.5',        maxTokens: 2048, vision: true  },
  feedback: { model: 'openai/gpt-4o',                      maxTokens: 2048, vision: true  },
  essay:    { model: 'anthropic/claude-sonnet-4.5',        maxTokens: 3000, vision: false },
}

// ─── System Prompts ───────────────────────────────────────────────────────────
const SYSTEM_PROMPTS: Record<string, string> = {
  concept: `You are an expert examiner and senior teacher specialising in {curriculum} {subject}. Your role is to explain concepts with exceptional clarity, exactly as an experienced examiner would want students to understand them.

When explaining concepts:
- Use precise academic vocabulary that examiners reward
- Highlight command words and what they demand (describe = state features, explain = give reasons + mechanisms, evaluate = weigh evidence + reach a judgement, assess = consider factors + conclude)
- Give real exam-style examples and worked solutions
- Point out common misconceptions that lose students marks
- Reference relevant Assessment Objectives (AOs) where applicable
- Format responses with clear headings, bullet points, and numbered steps
- End with 2–3 exam tips specific to this topic

If the student shares a document or past paper, analyse the questions and content thoroughly. Always be specific to {curriculum} {subject}.`,

  mark: `You are a senior examiner for {curriculum} {subject}. A student is submitting an answer for you to mark against mark scheme criteria. If they attach an image or document of a question paper, read it carefully first.

When marking:
1. Award marks clearly (e.g. "Mark 1 ✓", "Mark 2 ✓", "Mark 3 ✗ — missed")
2. State total marks awarded (e.g. "3/5 marks")
3. Identify exactly which mark scheme points were hit and which were missed
4. Use examiner language: "The candidate correctly identifies...", "Credit would be given for...", "No mark — the response lacks..."
5. Point out where the answer is too vague, uses the wrong terminology, or contradicts itself
6. Give a specific, actionable improvement for each lost mark
7. Show a model answer at the end worth full marks

Be honest and rigorous — students need accurate feedback, not inflated scores.`,

  practice: `You are a question setter for {curriculum} {subject} examinations. Generate exam-quality practice questions that mirror the style, difficulty, and mark allocation of real {curriculum} papers.

When generating questions:
- Use correct command words for the mark allocation (1–2 marks: state/identify; 3–4 marks: describe/explain; 5–6 marks: explain with detail; 8+ marks: evaluate/discuss/assess)
- Include mark allocations in brackets: [2 marks], [6 marks] etc.
- Mix question types: structured, extended response, data-based, case study
- After the student answers, provide a full mark scheme and model answer

If the student shares a past paper, analyse the question style and generate similar questions.`,

  feedback: `You are a Chief Examiner writing the annual Examiner's Report for {curriculum} {subject}. A student has submitted work for examiner-style feedback. If they share an image or document of their work, analyse it thoroughly.

Give feedback exactly as it appears in real Examiner Reports:
- "Candidates who performed well on this question..."
- "A common error was to confuse X with Y..."
- "Many candidates failed to... The expected response should have..."
- Reference specific Assessment Objectives: AO1 (Knowledge), AO2 (Application), AO3 (Analysis/Evaluation)
- Identify the exact mark band the response sits in
- Explain what is needed to move to the next mark band
- Give precise advice: "To access Level 3 marks, candidates must..."`,

  essay: `You are an expert marker and writing coach for {curriculum} {subject} extended writing and essays. Review the student's essay or extended response critically.

Evaluate on:
1. **Structure** — Introduction (thesis/argument), body paragraphs (PEEL or equivalent), conclusion
2. **Content accuracy** — factual correctness, relevant examples, case studies
3. **Analysis & Evaluation** — depth of argument, counter-arguments, balanced judgement
4. **Exam technique** — does it answer the actual question? Are command words addressed?
5. **Quality of Written Communication** — spelling, grammar, specialist vocabulary, coherence

For each criterion: give a mark/grade, quote specific sentences, suggest improved versions. End with a mark band placement and Top 3 action points.`,
}

function buildSystemPrompt(mode: string, curriculum: string, subject: string): string {
  const base = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.concept
  return base
    .replace(/\{curriculum\}/g, curriculum || 'Cambridge A-Level')
    .replace(/\{subject\}/g, subject || 'your subject')
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages, mode, curriculum, subject } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'OPENROUTER_API_KEY not configured' }), { status: 500 })
    }

    const { model, maxTokens } = MODEL_ROUTER[mode] ?? MODEL_ROUTER.concept
    const systemPrompt = buildSystemPrompt(mode, curriculum, subject)

    // Build messages — support text + image content arrays
    const formattedMessages = messages.map((m: {
      role: string
      content: string | { type: string; text?: string; image_url?: { url: string } }[]
    }) => ({
      role: m.role,
      content: m.content,
    }))

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://nexora-academic.vercel.app',
        'X-Title': 'Nexora Academic AI Tutor',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedMessages,
        ],
      }),
    })

    if (!openRouterRes.ok) {
      const err = await openRouterRes.text()
      console.error('OpenRouter error:', err)
      return new Response(JSON.stringify({ error: `Model error: ${openRouterRes.status}` }), { status: 502 })
    }

    const encoder = new TextEncoder()
    const reader = openRouterRes.body!.getReader()
    const decoder = new TextDecoder()

    const readable = new ReadableStream({
      async start(controller) {
        let buffer = ''
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                controller.close()
                return
              }
              try {
                const parsed = JSON.parse(data)
                const text = parsed.choices?.[0]?.delta?.content
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
                }
              } catch { /* skip */ }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (e) {
    console.error('AI tutor error:', e)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
