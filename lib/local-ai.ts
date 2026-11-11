import OpenAI from 'openai'
import { createConnection } from 'node:net'
import { readdir, readFile, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

type ChatParams = {
  messages: Array<{ role: 'user' | 'system' | 'assistant'; content: string }>
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

type AiEndpoint = {
  baseUrl: string
  apiKey: string
  model: string
  source: 'env' | 'strata'
}

type StrataInstance = {
  filePath: string
  host: string
  port: number
  apiKey: string
  model: string
  mtimeMs: number
}

let cachedEndpoint: AiEndpoint | null = null
let cachedUntil = 0

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback
}

function booleanEnv(name: string, fallback: boolean): boolean {
  const raw = process.env[name]?.trim().toLowerCase()
  if (!raw) return fallback
  if (['0', 'false', 'no', 'off'].includes(raw)) return false
  return ['1', 'true', 'yes', 'on'].includes(raw)
}

function normalizeHost(host: string): string {
  const value = host.trim().toLowerCase()
  if (!value || value === 'localhost' || value === '::1' || value === '[::1]') return '127.0.0.1'
  return value
}

function isLocalHost(host: string): boolean {
  return ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(host.trim().toLowerCase())
}

function expandHome(value: string): string {
  if (value === '~') return os.homedir()
  if (value.startsWith('~/')) return path.join(os.homedir(), value.slice(2))
  return value
}

function endpointFromEnv(): AiEndpoint {
  return {
    baseUrl: process.env.LOCAL_AI_BASE_URL?.trim() || 'http://127.0.0.1:9000/v1',
    apiKey: process.env.LOCAL_AI_API_KEY?.trim() || 'omlx-key',
    model: process.env.LOCAL_AI_MODEL?.trim() || '',
    source: 'env',
  }
}

function isLocalEndpoint(endpoint: AiEndpoint): boolean {
  try {
    return isLocalHost(new URL(endpoint.baseUrl).hostname)
  } catch {
    return false
  }
}

function portIsOpen(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false
    const finish = (value: boolean) => {
      if (settled) return
      settled = true
      socket.destroy()
      resolve(value)
    }

    const socket = createConnection({ host: normalizeHost(host), port })
    socket.setTimeout(250)
    socket.once('connect', () => finish(true))
    socket.once('error', () => finish(false))
    socket.once('timeout', () => finish(false))
  })
}

function strataInstanceDirectory(): string {
  const configured = process.env.LOCAL_AI_INSTANCE_DIR?.trim()
  if (configured) return expandHome(configured)
  return path.join(os.homedir(), '.strata', 'data', 'native-instances')
}

function endpointFromInstance(instance: StrataInstance): AiEndpoint {
  const host = normalizeHost(instance.host)
  return {
    baseUrl: `http://${host}:${instance.port}/v1`,
    apiKey: instance.apiKey,
    model: instance.model,
    source: 'strata',
  }
}

async function loadStrataInstances(): Promise<StrataInstance[]> {
  if (!booleanEnv('LOCAL_AI_DISCOVER', true)) return []

  const directory = strataInstanceDirectory()
  try {
    const entries = await readdir(directory, { withFileTypes: true })
    const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    const instances = await Promise.all(files.map(async (entry) => {
      const filePath = path.join(directory, entry.name)
      try {
        const parsed = JSON.parse(await readFile(filePath, 'utf8')) as Record<string, unknown>
        const apiKey = typeof parsed.api_key === 'string' ? parsed.api_key.trim() : ''
        const port = Number(parsed.port)
        if (!apiKey || !Number.isInteger(port) || port <= 0) return null

        const host = typeof parsed.host === 'string' && parsed.host.trim() ? parsed.host.trim() : '127.0.0.1'
        const model = typeof parsed.model_name === 'string' ? parsed.model_name.trim() : ''
        const { mtimeMs } = await stat(filePath)
        return { filePath, host, port, apiKey, model, mtimeMs } satisfies StrataInstance
      } catch {
        return null
      }
    }))

    return instances
      .filter((instance): instance is StrataInstance => instance !== null)
      .sort((a, b) => b.mtimeMs - a.mtimeMs)
  } catch {
    return []
  }
}

async function discoverStrataEndpoint(preferred: AiEndpoint): Promise<AiEndpoint> {
  if (!isLocalEndpoint(preferred) || !booleanEnv('LOCAL_AI_DISCOVER', true)) return preferred

  let url: URL
  try {
    url = new URL(preferred.baseUrl)
  } catch {
    return preferred
  }

  const preferredHost = normalizeHost(url.hostname)
  const preferredPort = Number(url.port) || (url.protocol === 'https:' ? 443 : 80)
  const instances = await loadStrataInstances()
  if (!instances.length) return preferred

  const exactInstances = instances.filter(
    (instance) => normalizeHost(instance.host) === preferredHost && instance.port === preferredPort,
  )

  for (const instance of exactInstances) {
    if (await portIsOpen(instance.host, instance.port)) return endpointFromInstance(instance)
  }

  for (const instance of instances) {
    if (await portIsOpen(instance.host, instance.port)) return endpointFromInstance(instance)
  }

  return exactInstances[0] ? endpointFromInstance(exactInstances[0]) : preferred
}

export async function resolveAiEndpoint(options: { force?: boolean } = {}): Promise<AiEndpoint> {
  const now = Date.now()
  if (!options.force && cachedEndpoint && now < cachedUntil) return cachedEndpoint

  const endpoint = await discoverStrataEndpoint(endpointFromEnv())
  cachedEndpoint = endpoint
  cachedUntil = now + positiveInteger(process.env.LOCAL_AI_DISCOVERY_TTL_MS, 5000)
  return endpoint
}

export function invalidateAiEndpoint(): void {
  cachedEndpoint = null
  cachedUntil = 0
}

function makeClient(endpoint: AiEndpoint): OpenAI {
  return new OpenAI({
    baseURL: endpoint.baseUrl,
    apiKey: endpoint.apiKey,
    timeout: positiveInteger(process.env.LOCAL_AI_TIMEOUT_MS, 55000),
    maxRetries: 0,
  })
}

function selectedModel(endpoint: AiEndpoint): string {
  const model = endpoint.model || process.env.LOCAL_AI_MODEL?.trim() || ''
  if (!model) {
    throw new Error('LOCAL_AI_MODEL is not configured. Set it to a model ID served by LOCAL_AI_BASE_URL.')
  }
  return model
}

function errorStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: unknown }).status
    if (typeof status === 'number') return status
  }
  return undefined
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

export function isAuthenticationError(error: unknown): boolean {
  const status = errorStatus(error)
  return status === 401 || status === 403 || /missing or wrong api key|unauthorized|authentication_error|forbidden/i.test(errorMessage(error))
}

function isModelNotFoundError(error: unknown): boolean {
  const status = errorStatus(error)
  const message = errorMessage(error).toLowerCase()
  return status === 404 || (status === 400 && /model.*(not found|not loaded|does not exist|invalid|unsupported)|invalid model/i.test(message))
}

export function getAiErrorDetails(error: unknown, label = 'AI'): { error: string; code: string; retryable: boolean } {
  if (isAuthenticationError(error)) {
    return {
      error: 'AI model server rejected the local API key. The model server may have restarted and rotated its key.',
      code: 'AI_AUTH_FAILED',
      retryable: true,
    }
  }

  const status = errorStatus(error)
  const message = errorMessage(error)
  const unavailable = status === 408 || status === 429 || (status !== undefined && status >= 500) ||
    /connection|network|ECONNREFUSED|ECONNRESET|ETIMEDOUT|timeout|fetch failed|rate limit|not found|model/i.test(message)

  if (unavailable) {
    return {
      error: 'AI service is unavailable or misconfigured. Check the model server and try again.',
      code: 'AI_UNAVAILABLE',
      retryable: true,
    }
  }

  return {
    error: `${label} failed. Please try again.`,
    code: 'AI_PARSE_FAILED',
    retryable: true,
  }
}

async function withAiClient<T>(run: (client: OpenAI, endpoint: AiEndpoint) => Promise<T>): Promise<T> {
  const initial = await resolveAiEndpoint()
  try {
    return await run(makeClient(initial), initial)
  } catch (error) {
    const auth = isAuthenticationError(error)
    const modelError = isModelNotFoundError(error)
    if (!auth && !modelError) throw error

    invalidateAiEndpoint()
    let retry = await resolveAiEndpoint({ force: true })
    const env = endpointFromEnv()

    if (auth && retry.baseUrl === initial.baseUrl && retry.apiKey === initial.apiKey) {
      retry = env
    }

    if (modelError) {
      const alternateModel = env.model && env.model !== retry.model ? env.model : ''
      if (alternateModel) retry = { ...retry, model: alternateModel }
    }

    if (retry.baseUrl === initial.baseUrl && retry.apiKey === initial.apiKey && retry.model === initial.model) {
      throw error
    }

    try {
      const result = await run(makeClient(retry), retry)
      console.warn('[AI] Recovered after refreshing the local AI endpoint', {
        source: retry.source,
        model: retry.model,
        reason: auth ? 'authentication' : 'model',
      })
      return result
    } catch (retryError) {
      if (isAuthenticationError(retryError)) {
        console.error('[AI] Authentication failed after endpoint refresh', {
          baseUrl: retry.baseUrl,
          model: retry.model,
          source: retry.source,
        })
      }
      throw retryError
    }
  }
}

async function callModel(params: ChatParams): Promise<string> {
  return withAiClient(async (client, endpoint) => {
    const model = selectedModel(endpoint)
    console.log(`[AI] Using model: ${model}`)

    const request = {
      ...params,
      model,
      stream: false as const,
      chat_template_kwargs: { enable_thinking: false },
    }
    const completion = await client.chat.completions.create(request)
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
  })
}

export async function chatWithFallback(params: ChatParams): Promise<string> {
  return callModel(params)
}

export async function chatForParsing(params: ChatParams): Promise<string> {
  return callModel(params)
}
