import OpenAI from 'openai'

export const nvidia = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY!,
})

/**
 * Best free models for high-accuracy tasks (parsing, tailoring).
 * Most capable first — falls back down the list on rate limits.
 */
export const NVIDIA_PARSE_MODELS = [
  'meta/llama-3.3-70b-instruct',               // Fast + reliable — primary for parsing
  'nvidia/llama-3.3-nemotron-super-49b-v1.5',  // NVIDIA fine-tuned 49B
  'meta/llama-4-maverick-17b-128e-instruct',    // Llama 4 MoE (128 experts)
  'google/gemma-4-31b-it',                      // Google Gemma 4 31B
  'nvidia/llama-3.1-nemotron-70b-instruct',    // NVIDIA fine-tuned 70B
  'mistralai/mistral-large-2-instruct',        // Mistral Large 2
  'nvidia/llama-3.1-nemotron-ultra-253b-v1',   // 253B — slow, last resort
  'meta/llama-3.1-405b-instruct',               // 405B — slowest, last resort
]

/**
 * General-purpose models for fast tasks (summaries, bullet improvements, skills).
 * Balanced speed + quality, falls back to lighter models.
 */
export const NVIDIA_MODELS = [
  'meta/llama-3.3-70b-instruct',               // Latest Llama 3.3 70B — primary
  'google/gemma-4-31b-it',                      // Google Gemma 4 31B
  'nvidia/llama-3.1-nemotron-70b-instruct',    // NVIDIA fine-tuned fallback
  'mistralai/mistral-large-2-instruct',        // Mistral Large 2
  'meta/llama-3.1-70b-instruct',               // Llama 3.1 70B
  'mistralai/mixtral-8x7b-instruct-v0.1',     // Mixtral MoE
  'meta/llama-3.1-8b-instruct',               // Fast lightweight fallback
]

type ChatParams = Omit<Parameters<typeof nvidia.chat.completions.create>[0], 'model'>

async function tryModels(models: string[], params: ChatParams): Promise<string> {
  let lastError: unknown

  for (const model of models) {
    try {
      const completion = await nvidia.chat.completions.create({ ...params, model, stream: false })
      const content = completion.choices[0]?.message?.content?.trim() ?? ''
      if (content) {
        if (model !== models[0]) {
          console.log(`[AI] Used fallback model: ${model}`)
        } else {
          console.log(`[AI] Model: ${model}`)
        }
        return content
      }
    } catch (err: unknown) {
      lastError = err
      const status = (err as { status?: number })?.status
      const message = (err as { message?: string })?.message ?? ''

      const isRetryable =
        status === 429 ||
        status === 402 ||
        status === 503 ||
        status === 529 ||
        message.toLowerCase().includes('rate limit') ||
        message.toLowerCase().includes('quota') ||
        message.toLowerCase().includes('overloaded')

      if (isRetryable) {
        console.warn(`[AI] ${model} hit limit (${status ?? message}), trying next…`)
        continue
      }

      throw err
    }
  }

  console.error('[AI] All models exhausted. Last error:', lastError)
  throw new Error('All AI models are currently unavailable. Please try again shortly.')
}

/** For summaries, bullet improvements, skill suggestions — fast & good */
export async function chatWithFallback(params: ChatParams): Promise<string> {
  return tryModels(NVIDIA_MODELS, params)
}

/** For resume parsing & tailoring — uses the most capable models first */
export async function chatForParsing(params: ChatParams): Promise<string> {
  return tryModels(NVIDIA_PARSE_MODELS, params)
}
