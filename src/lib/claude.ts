import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateTutorProfileSummary(tutor: {
  fullName: string
  yearsExperience: number
  subjects: string[]
  curricula: string[]
  bio?: string
  cambridgeMetrics?: {
    totalStudents: number
    passRate: number
    aStarAPercentage: number
  }
}): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `Write a professional 2-3 sentence tutor profile summary for IATN (International Academic Tutors Nigeria).

Tutor details:
- Name: ${tutor.fullName}
- Years of experience: ${tutor.yearsExperience}
- Subjects: ${tutor.subjects.join(', ')}
- Curricula: ${tutor.curricula.join(', ')}
- Bio: ${tutor.bio || 'Not provided'}
${tutor.cambridgeMetrics ? `- Students taught: ${tutor.cambridgeMetrics.totalStudents}, Pass rate: ${tutor.cambridgeMetrics.passRate}%, A*/A rate: ${tutor.cambridgeMetrics.aStarAPercentage}%` : ''}

Write in third person. Focus on expertise, track record, and value to students. Do not fabricate statistics not provided.`,
      },
    ],
  })

  return (message.content[0] as { text: string }).text
}

export async function matchTutors(params: {
  subject: string
  curriculum: string
  studentLevel: string
  budget?: number
  learningGoal?: string
  tutors: Array<{ id: string; name: string; rating: number; rate: number; subjects: string[]; cambridgeMetrics?: object }>
}): Promise<string[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `You are an AI tutor-matching engine for IATN Nigeria. Rank these tutors for the student and return a JSON array of tutor IDs ordered best-to-worst fit.

Student needs:
- Subject: ${params.subject}
- Curriculum: ${params.curriculum}
- Level: ${params.studentLevel}
- Budget (NGN/hr): ${params.budget || 'flexible'}
- Goal: ${params.learningGoal || 'exam preparation'}

Tutors:
${JSON.stringify(params.tutors, null, 2)}

Return ONLY a JSON array of tutor IDs, e.g.: ["id1", "id2", "id3"]`,
      },
    ],
  })

  const text = (message.content[0] as { text: string }).text
  return JSON.parse(text)
}

export async function generateStudyPlan(params: {
  subject: string
  curriculum: string
  examDate: string
  weakTopics: string[]
  availableHoursPerWeek: number
}): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `Create a personalised weekly study plan for a student preparing for ${params.curriculum} ${params.subject}.

Details:
- Exam date: ${params.examDate}
- Weak topics: ${params.weakTopics.join(', ')}
- Available hours/week: ${params.availableHoursPerWeek}

Format as a structured weekly plan with daily tasks, topic priorities, and revision milestones. Be specific and actionable.`,
      },
    ],
  })

  return (message.content[0] as { text: string }).text
}

export async function getAIStudyAssistantResponse(messages: Array<{ role: 'user' | 'assistant'; content: string }>, subject: string, curriculum: string): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: `You are an expert ${curriculum} ${subject} tutor on the IATN platform in Nigeria. Help students understand concepts, work through problems, and prepare for Cambridge/international exams. Be encouraging, clear, and educational. Use Nigerian context where appropriate.`,
    messages,
  })

  return (response.content[0] as { text: string }).text
}
