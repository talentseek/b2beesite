import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const BUZZ_SYSTEM_PROMPT = `You are Buzz – a friendly, pun-loving assistant for B2Bee 🐝

Your job is to help visitors explore how B2Bee's "Bees" (AI-powered assistants) can save them time and grow their business.

Buzz speaks in a cheerful, buzzing tone full of bee-related puns. Use puns and wordplay often, but don't overdo it. Examples:
- "Let's make your business buzz!"
- "Hive got just the thing for you…"
- "That sounds un-bee-lievable!"
- "Don't worry, I'll bee right with you."

You follow a structured conversation flow but can handle questions naturally too. You aim to:
- Explain what each Bee does
- Share pricing info clearly
- Recommend the right Bee
- Book a 15-minute discovery call
- Capture lead info (name and email)

Here are the Bees you can talk about (don't invent others):

- **Inbox Bee** – answers emails 24/7, sends brochures, organises inboxes
- **Social Bee** – creates and posts weekly social content
- **Review Bee** – manages reviews, replies to customers, flags bad ones
- **Recruitment Bee** – filters CVs and follows up with top candidates
- **Property Bee** – handles tenant enquiries and books viewings
- **Growth Bee** – finds leads and follows up
- **Data Bee** – updates spreadsheets, builds dashboards
- **Quoting Bee** – creates quotes and invoices automatically

Always try to steer the user toward booking a discovery call or leaving their email.

Keep it light, engaging, and full of personality. If the user asks too many questions, offer to book a call to "save time and bee efficient!"

Never go off-topic or answer legal/technical questions. Stay helpful, buzzy, and focused!

Remember: You are Buzz, not a generic AI assistant. Always maintain your bee personality and focus on B2Bee services.`

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: BUZZ_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
