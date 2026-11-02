/** Chunking helpers that keep fenced code blocks intact while translating prose. */

const FENCE = /^(?<indent>[ \t]*)(?<fence>`{3,}|~{3,})(?<info>.*)$/

interface Piece {
  kind: 'code' | 'text'
  value: string
}

interface FenceState {
  marker: string
  char: string
}

function isOpeningFence(line: string): FenceState | undefined {
  const match = FENCE.exec(line)
  const groups = match?.groups
  if (!groups) {
    return undefined
  }
  // `#` info strings are headings written with backticks in prose, not fences.
  if (groups.info.trim().startsWith('#')) {
    return undefined
  }
  return { marker: groups.fence, char: groups.fence.slice(0, 1) }
}

function closesFence(line: string, fence: FenceState): boolean {
  const groups = FENCE.exec(line)?.groups
  if (!groups) {
    return false
  }
  return groups.fence.slice(0, 1) === fence.char && groups.fence.length >= fence.marker.length
}

/** Split Markdown into alternating prose and fenced-code pieces. */
export function splitCodePieces(markdown: string): Piece[] {
  const pieces: Piece[] = []
  const buffer: string[] = []
  let fence: FenceState | undefined

  const flush = () => {
    if (buffer.length > 0) {
      pieces.push({ kind: 'text', value: buffer.join('\n') })
      buffer.length = 0
    }
  }

  for (const line of markdown.split('\n')) {
    if (!fence) {
      const opened = isOpeningFence(line)
      if (opened) {
        flush()
        fence = opened
      }
      buffer.push(line)
      continue
    }

    buffer.push(line)
    if (closesFence(line, fence)) {
      pieces.push({ kind: 'code', value: buffer.join('\n') })
      buffer.length = 0
      fence = undefined
    }
  }

  // An unterminated fence stays with the surrounding prose so nothing is dropped.
  flush()
  return pieces
}

/** Replace code blocks with `⟦CODE_n⟧` placeholders; prose is left for translation. */
export function protectCodeBlocks(markdown: string): { text: string; blocks: string[] } {
  const blocks: string[] = []
  const text = splitCodePieces(markdown)
    .map(piece => {
      if (piece.kind === 'text') {
        return piece.value
      }
      blocks.push(piece.value)
      return `⟦CODE_${blocks.length - 1}⟧`
    })
    .join('\n')
  return { text, blocks }
}

const PLACEHOLDER = /⟦CODE_(\d+)⟧/g

/** Put code blocks back, failing loudly when a placeholder went missing. */
export function restoreCodeBlocks(text: string, blocks: string[]): string {
  const seen = new Set<number>()
  const restored = text.replaceAll(PLACEHOLDER, (_match, index: string) => {
    const block = blocks.at(Number(index))
    if (block === undefined) {
      throw new Error(`Translated text referenced an unknown code block: ${index}`)
    }
    seen.add(Number(index))
    return block
  })
  const missing = blocks.map((_, index) => index).filter(index => !seen.has(index))
  if (missing.length > 0) {
    throw new Error(`Translated text dropped code block(s): ${missing.join(', ')}`)
  }
  return restored
}

/** Split protected text into chunks that never exceed `budget` characters. */
export function chunkText(text: string, budget = 4000): string[] {
  if (text.length <= budget) {
    return [text]
  }

  const chunks: string[] = []
  let current = ''

  for (const paragraph of text.split(/\n{2,}/)) {
    if (paragraph.length > budget) {
      if (current) {
        chunks.push(current)
        current = ''
      }
      // Oversized paragraph: fall back to line chunks.
      let lineBuffer = ''
      for (const line of paragraph.split('\n')) {
        if (lineBuffer.length + line.length + 1 > budget && lineBuffer) {
          chunks.push(lineBuffer)
          lineBuffer = ''
        }
        lineBuffer = lineBuffer ? `${lineBuffer}\n${line}` : line
      }
      if (lineBuffer) {
        chunks.push(lineBuffer)
      }
      continue
    }

    const candidate = current ? `${current}\n\n${paragraph}` : paragraph
    if (candidate.length > budget && current) {
      chunks.push(current)
      current = paragraph
      continue
    }
    current = candidate
  }

  if (current) {
    chunks.push(current)
  }
  return chunks
}
