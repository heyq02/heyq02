import { expect, it, vi } from 'vite-plus/test'

import { createDeepSeekTranslator, DEFAULT_BASE_URL, DEFAULT_MODEL } from '../src/deepseek.ts'

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status })
}

function requestAt(fetchFn: { mock: { calls: unknown[][] } }, index = 0) {
  const call = fetchFn.mock.calls[index] as unknown[] | undefined
  return { url: String(call?.[0]), init: call?.[1] as RequestInit }
}

function requestBody(init: RequestInit): { model: string; messages: unknown[] } {
  const raw = init.body
  if (typeof raw !== 'string') {
    throw new TypeError('expected a JSON string body')
  }
  return JSON.parse(raw) as { model: string; messages: unknown[] }
}

it('posts the prompt to DeepSeek and returns the message content', async () => {
  const fetchFn = vi.fn(() =>
    Promise.resolve(jsonResponse({ choices: [{ message: { content: 'Hello' } }] }))
  )
  const translate = createDeepSeekTranslator({ apiKey: 'key', retryDelayMs: 0, fetchFn })

  await expect(translate('你好')).resolves.toBe('Hello')
  const { url, init } = requestAt(fetchFn)
  expect(url).toBe(`${DEFAULT_BASE_URL}/chat/completions`)
  expect((init.headers as Record<string, string>).authorization).toBe('Bearer key')
  const body = requestBody(init)
  expect(body.model).toBe(DEFAULT_MODEL)
  expect(body.messages).toHaveLength(2)
})

it('honours baseUrl and model overrides and trims trailing slashes', async () => {
  const fetchFn = vi.fn(() =>
    Promise.resolve(jsonResponse({ choices: [{ message: { content: 'ok' } }] }))
  )
  const translate = createDeepSeekTranslator({
    apiKey: 'key',
    baseUrl: 'https://proxy.test/v1/',
    model: 'deepseek-reasoner',
    retryDelayMs: 0,
    fetchFn
  })
  await translate('hi')
  const { url, init } = requestAt(fetchFn)
  expect(url).toBe('https://proxy.test/v1/chat/completions')
  expect(requestBody(init).model).toBe('deepseek-reasoner')
})

it('fails fast on client errors', async () => {
  const fetchFn = vi.fn(() => Promise.resolve(new Response('bad key', { status: 401 })))
  const translate = createDeepSeekTranslator({ apiKey: 'key', retryDelayMs: 0, fetchFn })
  await expect(translate('hi')).rejects.toThrow(/DeepSeek 401/)
  expect(fetchFn).toHaveBeenCalledTimes(1)
})

it('retries server errors and empty answers', async () => {
  const fetchFn = vi
    .fn()
    .mockResolvedValueOnce(new Response('boom', { status: 500 }))
    .mockResolvedValueOnce(jsonResponse({ choices: [{ message: { content: '  ' } }] }))
    .mockResolvedValueOnce(jsonResponse({ choices: [{ message: { content: 'done' } }] }))
  const translate = createDeepSeekTranslator({
    apiKey: 'key',
    retryDelayMs: 0,
    fetchFn: fetchFn as never
  })
  await expect(translate('hi')).resolves.toBe('done')
  expect(fetchFn).toHaveBeenCalledTimes(3)
})

it('surfaces the last error when every attempt fails', async () => {
  const fetchFn = vi.fn(() => Promise.reject(new Error('network down')))
  const translate = createDeepSeekTranslator({ apiKey: 'key', retryDelayMs: 0, fetchFn })
  await expect(translate('hi')).rejects.toThrow('network down')
  expect(fetchFn).toHaveBeenCalledTimes(3)
})

it('gives up after three empty answers', async () => {
  const fetchFn = vi.fn(() => Promise.resolve(jsonResponse({ choices: [] })))
  const translate = createDeepSeekTranslator({ apiKey: 'key', retryDelayMs: 0, fetchFn })
  await expect(translate('hi')).rejects.toThrow(/empty translation/)
  expect(fetchFn).toHaveBeenCalledTimes(3)
})

it('waits between retries when a delay is configured', async () => {
  const fetchFn = vi.fn(() => Promise.resolve(new Response('boom', { status: 500 })))
  const translate = createDeepSeekTranslator({ apiKey: 'key', retryDelayMs: 1, fetchFn })
  await expect(translate('hi')).rejects.toThrow(/DeepSeek 500/)
  expect(fetchFn).toHaveBeenCalledTimes(3)
})

it('rethrows a non-Error non-HTTP failure as a generic error', async () => {
  const fetchFn = vi.fn(() => Promise.reject(new Error('plain failure')))
  const translate = createDeepSeekTranslator({ apiKey: 'key', retryDelayMs: 0, fetchFn })
  await expect(translate('hi')).rejects.toThrow('plain failure')
  expect(fetchFn).toHaveBeenCalledTimes(3)
})

it('retries when fetch throws an Error and then succeeds', async () => {
  const fetchFn = vi
    .fn()
    .mockRejectedValueOnce(new Error('socket hang up'))
    .mockResolvedValueOnce(jsonResponse({ choices: [{ message: { content: 'ok' } }] }))
  const translate = createDeepSeekTranslator({ apiKey: 'key', retryDelayMs: 0, fetchFn })
  await expect(translate('hi')).resolves.toBe('ok')
})

it('wraps a non-Error rejection in a generic failure', async () => {
  // oxlint-disable-next-line typescript/prefer-promise-reject-errors
  const fetchFn = vi.fn(() => Promise.reject('plain string'))
  const translate = createDeepSeekTranslator({ apiKey: 'key', retryDelayMs: 0, fetchFn })
  await expect(translate('hi')).rejects.toThrow(/DeepSeek translation failed/)
})
