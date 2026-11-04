import OpenAI from 'openai'

/**
 * Direct connection to the configured OpenAI-compatible endpoint.
 */
const aiClient = new OpenAI({
  baseURL: process.env.LOCAL_AI_BASE_URL || 'http://127.0.0.1:9000/v1',
  apiKey: process.env.LOCAL_AI_API_KEY || 'omlx-key',
})

type ChatParams = {
  messages: Array<{ role: 'user' | 'system' | 'assistant'; content: string }>
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

/**
 * Get the model name configured for the OpenAI-compatible endpoint.
 */
function getModel(): string {
  const model = process.env.LOCAL_AI_MODEL?.trim()
  if (!model) {
    throw new Error('LOCAL_AI_MODEL is not configured. Set it to a model ID served by LOCAL_AI_BASE_URL.')
  }
  return model
}

/**
 * Make a direct AI request
 */
async function callModel(params: ChatParams): Promise<string> {
  const model = getModel()
  console.log(`[AI] Using model: ${model}`)

  const request = {
    ...params,
    model,
    stream: false as const,
    chat_template_kwargs: { enable_thinking: false },
  }
  const completion = await aiClient.chat.completions.create(request)
  const choice = completion.choices[0]
  const content = choice?.message?.content

  if (typeof content !== 'string' || !content.trim()) {
    console.error('[AI] Model returned no text content', {
      model,
      finishReason: choice?.finish_reason ?? 'no_choice',
      completionTokens: completion.usage?.completion_tokens ?? 0,
    })
    return ''
  }

  if (choice?.finish_reason === 'length') {
    console.warn('[AI] Model output reached its token limit', {
      model,
      completionTokens: completion.usage?.completion_tokens ?? 0,
    })
  }

  return content.trim()
}

/**
 * General purpose AI calls
 */
export async function chatWithFallback(params: ChatParams): Promise<string> {
  return callModel(params)
}

/**
 * Parsing and heavy AI calls - same model
 */
export async function chatForParsing(params: ChatParams): Promise<string> {
  return callModel(params)
}
