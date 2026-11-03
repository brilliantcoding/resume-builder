import OpenAI from 'openai'

/**
 * Single model configuration - DeepSeek-Coder-V2-Lite-Instruct via omlx
 */
const DEEPSEEK_MODEL = 'DeepSeek-Coder-V2-Lite-Instruct'

/**
 * Direct connection to omlx server - only provider
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
 * Get model name - either pinned from env or use default DeepSeek
 */
function getModel(): string {
  if (process.env.LOCAL_AI_MODEL) return process.env.LOCAL_AI_MODEL
  return DEEPSEEK_MODEL
}

/**
 * Make AI request - no fallbacks, direct to DeepSeek
 */
async function callModel(params: ChatParams): Promise<string> {
  const model = getModel()
  console.log(`[AI] Using model: ${model}`)

  const completion = await aiClient.chat.completions.create({
    ...params,
    model,
    stream: false,
  })

  return completion.choices[0]?.message?.content?.trim() ?? ''
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
