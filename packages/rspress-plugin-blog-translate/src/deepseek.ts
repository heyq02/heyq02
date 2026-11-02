/**
 * DeepSeek-backed blog translation: Chinese sources under `zh/blog/**` are
 * translated into `en/blog/**` before the site build.
 */

export interface DeepSeekOptions {
  apiKey: string
  baseUrl?: string
  model?: string
  /** Total wall-clock budget per request (ms). */
  timeoutMs?: number
  /** Backoff base for retries (ms); tests set 0. */
  retryDelayMs?: number
  /** Test seam; defaults to global `fetch`. */
  fetchFn?: typeof fetch
}

export type TranslateText = (text: string) => Promise<string>

/** Default endpoint and model; overridable through env vars in CI. */
export const DEFAULT_BASE_URL = 'https://api.deepseek.com'
export const DEFAULT_MODEL = 'deepseek-flash'

const SYSTEM_PROMPT = `You are a precise technical translator for a developer blog.
Translate the user's Chinese Markdown into natural, concise English.

Rules:
- Keep every Markdown construct exactly as-is: heading levels, list markers, table pipes,
  blockquotes, emphasis, HTML tags and attributes, image syntax, and link URLs.
- Never translate or rewrite URLs, file paths, code, commands, identifiers, or API names.
- Placeholders like ⟦CODE_0⟧ stand for code blocks. Reproduce them verbatim, in place,
  on their own line, and never invent new ones.
- Translate the visible prose only. Keep the original paragraph and line structure.
- Output only the translated Markdown, with no preface, notes, or code fences around it.`

interface DeepSeekMessage {
  role: 'system' | 'user'
  content: string
}

interface DeepSeekResponse {
  choices?: { message?: { content?: string } }[]
}

function sleep(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms)
  })
}

/** Build a translate function that calls DeepSeek's chat completions endpoint. */
export function createDeepSeekTranslator(options: DeepSeekOptions): TranslateText {
  const fetchFn = options.fetchFn ?? fetch
  const baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')
  const model = options.model ?? DEFAULT_MODEL
  const timeoutMs = options.timeoutMs ?? 120_000
  const retryDelayMs = options.retryDelayMs ?? 1000

  const backoff = async (attempt: number) => {
    if (retryDelayMs > 0) {
      await sleep(retryDelayMs * 2 ** attempt)
    }
  }

  return async (text: string) => {
    const body = JSON.stringify({
      model,
      temperature: 0,
      stream: false,
      // Translation needs deterministic text, not chain-of-thought.
      // DeepSeek enables thinking by default: slower, costlier, truncation-prone.
      thinking: { type: 'disabled' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: text }
      ] satisfies DeepSeekMessage[]
    })

    let lastError: unknown
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const response = await fetchFn(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${options.apiKey}`
          },
          body,
          signal: AbortSignal.timeout(timeoutMs)
        })
        if (!response.ok) {
          const detail = await response.text()
          const retriable = response.status === 429 || response.status >= 500
          lastError = new Error(`DeepSeek ${response.status}: ${detail.slice(0, 500)}`)
          if (!retriable) {
            throw lastError
          }
          await backoff(attempt)
          continue
        }
        const json = (await response.json()) as DeepSeekResponse
        const content = json.choices?.[0]?.message?.content?.trim()
        if (!content) {
          lastError = new Error('DeepSeek returned an empty translation')
          await backoff(attempt)
          continue
        }
        return content
      } catch (error) {
        lastError = error
        if (error instanceof Error && /^DeepSeek \d{3}:/.test(error.message)) {
          throw error
        }
        await backoff(attempt)
      }
    }
    throw lastError instanceof Error ? lastError : new Error('DeepSeek translation failed')
  }
}
