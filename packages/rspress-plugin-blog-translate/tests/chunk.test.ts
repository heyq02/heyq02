import { expect, it } from 'vite-plus/test'

import { chunkText, protectCodeBlocks, restoreCodeBlocks, splitCodePieces } from '../src/chunk.ts'

it('splits fenced code from prose and ignores fences inside code', () => {
  const pieces = splitCodePieces('intro\n\n```js\nconst a = 1\n```\n\noutro')
  expect(pieces.map(piece => piece.kind)).toEqual(['text', 'code', 'text'])
  expect(pieces[1]?.value).toContain('const a = 1')
})

it('keeps an unterminated fence as prose', () => {
  const pieces = splitCodePieces('text\n\n```js\nconst a = 1')
  expect(pieces.every(piece => piece.kind === 'text')).toBe(true)
})

it('protects and restores code blocks in place', () => {
  const source = 'before\n\n```bash\npnpm test\n```\n\nafter'
  const { text, blocks } = protectCodeBlocks(source)
  expect(blocks).toHaveLength(1)
  expect(text).toContain('⟦CODE_0⟧')
  expect(text).not.toContain('pnpm test')
  expect(restoreCodeBlocks(text, blocks)).toBe(source)
})

it('throws when a placeholder is dropped or hallucinated', () => {
  const { text, blocks } = protectCodeBlocks('a\n\n```js\n1\n```\n\nb')
  expect(() => restoreCodeBlocks(text.replace('⟦CODE_0⟧', ''), blocks)).toThrow(/dropped/)
  expect(() => restoreCodeBlocks(`${text}\n⟦CODE_9⟧`, blocks)).toThrow(/unknown/)
})

it('chunks long text under the budget without dropping content', () => {
  const text = Array.from(
    { length: 40 },
    (_, index) => `paragraph ${index} ${'x'.repeat(60)}`
  ).join('\n\n')
  const chunks = chunkText(text, 400)
  expect(chunks.length).toBeGreaterThan(1)
  expect(chunks.every(chunk => chunk.length <= 400)).toBe(true)
  expect(chunks.join('\n\n')).toBe(text)
})

it('splits oversized paragraphs by line', () => {
  const text = Array.from({ length: 20 }, (_, index) => `line ${index} ${'y'.repeat(50)}`).join(
    '\n'
  )
  const chunks = chunkText(text, 200)
  expect(chunks.every(chunk => chunk.length <= 200)).toBe(true)
  expect(chunks.join('\n')).toBe(text)
})

it('returns short text unchanged', () => {
  expect(chunkText('short')).toEqual(['short'])
})

it('treats a backtick line with a heading info string as prose', () => {
  const pieces = splitCodePieces('```# not a fence\nreal text')
  expect(pieces).toHaveLength(1)
  expect(pieces[0]?.kind).toBe('text')
})

it('keeps a tilde fence intact even when backticks appear inside', () => {
  const source = '~~~md\n```js\nconst a = 1\n```\n~~~'
  const { text, blocks } = protectCodeBlocks(source)
  expect(blocks).toEqual([source])
  expect(text).toBe('⟦CODE_0⟧')
})

it('leaves prose untouched when there are no code blocks', () => {
  expect(protectCodeBlocks('plain\n\ntext')).toEqual({ text: 'plain\n\ntext', blocks: [] })
})

it('chunks a single oversized paragraph by lines without merging', () => {
  const text = ['a'.repeat(120), 'b'.repeat(120)].join('\n')
  const chunks = chunkText(text, 130)
  expect(chunks).toEqual(['a'.repeat(120), 'b'.repeat(120)])
})

it('splits prose separated only by single newlines under the budget', () => {
  expect(chunkText('a\nb\nc', 100)).toEqual(['a\nb\nc'])
})

it('restores multiple code blocks in order', () => {
  const source = 'a\n\n```js\n1\n```\n\nb\n\n```js\n2\n```\n'
  const { text, blocks } = protectCodeBlocks(source)
  expect(blocks).toHaveLength(2)
  expect(restoreCodeBlocks(text, blocks)).toBe(source)
})
