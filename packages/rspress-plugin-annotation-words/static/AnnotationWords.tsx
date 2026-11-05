import { useLang, useLocation } from '@rspress/core/runtime'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactElement } from 'react'

import './annotation-words.css'
import { DEFAULT_IGNORE_WORDS } from './ignore-list.ts'
import { getTextNodes } from './text-nodes.ts'

export interface AnnotationLinkItem {
  id: string
  title: string
  url: string
}

export interface AnnotationWordDetail {
  aliases?: { key: string }[]
  description: string
  related_meta?: {
    docs?: AnnotationLinkItem[]
    links?: AnnotationLinkItem[]
  }
}

type WordsMap = Record<
  string,
  {
    id: string
    lang: Record<string, AnnotationWordDetail>
  }
>

export interface AnnotationWordsProps {
  wordsMapPath: string
  ignoreWords?: string[]
  /** Serialized RegExp pairs `[source, flags]` from the plugin. */
  ignorePaths?: [string, string][]
}

const HIGHLIGHT_CLASS = 'hey-annotation-highlight'
const CARD_WIDTH = 320
const CARD_HEIGHT = 500
const EMPTY_WORDS: string[] = []
const EMPTY_PATHS: [string, string][] = []

function wordPattern(word: string): RegExp {
  const escaped = word.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
  // ASCII terms use word boundaries; CJK / mixed terms use a plain escape.
  if (/^[\w-]+$/.test(word)) {
    return new RegExp(`\\b${escaped}\\b`)
  }
  return new RegExp(escaped)
}

async function fetchWordsMap(path: string): Promise<WordsMap> {
  try {
    const response = await fetch(`/${path.replace(/^\//, '')}`)
    if (!response.ok) {
      return {}
    }
    return (await response.json()) as WordsMap
  } catch {
    return {}
  }
}

function AnnotationCard({
  name,
  detail
}: {
  name: string
  detail: AnnotationWordDetail
}): ReactElement {
  const aliases = detail.aliases ?? []
  const docs = detail.related_meta?.docs ?? []
  const links = detail.related_meta?.links ?? []

  return (
    <section className='hey-annotation-card'>
      <h3 className='hey-annotation-card__title'>{name}</h3>
      {aliases.length > 0 ? (
        <p className='hey-annotation-card__aliases'>
          {aliases.map((alias, index) => (
            <span key={alias.key}>
              {alias.key}
              {index < aliases.length - 1 ? ' / ' : null}
            </span>
          ))}
        </p>
      ) : null}
      <p className='hey-annotation-card__desc'>{detail.description}</p>
      {docs.length > 0 ? (
        <div className='hey-annotation-card__section'>
          <h4>文档</h4>
          <ul>
            {docs.map(docItem => (
              <li key={docItem.id}>
                <a href={docItem.url}>{docItem.title}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {links.length > 0 ? (
        <div className='hey-annotation-card__section'>
          <h4>相关链接</h4>
          <ul>
            {links.map(link => (
              <li key={link.id}>
                <a href={link.url} target='_blank' rel='noopener noreferrer'>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

/** Client highlighter + popover for glossary terms in the doc body. */
export default function AnnotationWords({
  wordsMapPath,
  ignoreWords = EMPTY_WORDS,
  ignorePaths = EMPTY_PATHS
}: AnnotationWordsProps): ReactElement | null {
  const lang = useLang() || 'zh'
  const { pathname, search } = useLocation()
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  const [keyword, setKeyword] = useState('')
  const [detail, setDetail] = useState<AnnotationWordDetail | null>(null)
  const detailByWordRef = useRef(new Map<string, AnnotationWordDetail>())
  const panelRef = useRef<HTMLDivElement>(null)
  const panelStyle = useMemo(
    (): CSSProperties => ({ left: position.left, top: position.top }),
    [position.left, position.top]
  )

  useEffect(() => {
    let dispose = (): void => {}

    if (typeof document !== 'undefined') {
      const pathRegs = ignorePaths.map(([source, flags]) => new RegExp(source, flags))
      const fullPath = `${pathname}${search}`
      const ignoredPath = pathRegs.some(reg => reg.test(fullPath))
      const docRoot = document.querySelector('.rspress-doc')

      if (!ignoredPath && docRoot instanceof HTMLElement) {
        const root: HTMLElement = docRoot
        const ignored = new Set([...DEFAULT_IGNORE_WORDS, ...ignoreWords])
        let cancelled = false

        const close = (): void => {
          setVisible(false)
        }

        const openFromTarget = (event: Event): void => {
          event.stopPropagation()
          const target = event.currentTarget
          if (!(target instanceof HTMLElement)) {
            return
          }
          const word = target.textContent || ''
          const next = detailByWordRef.current.get(word)
          if (!next) {
            return
          }

          let { left, top } = target.getBoundingClientRect()
          if (left + CARD_WIDTH >= globalThis.innerWidth) {
            left = Math.max(16, globalThis.innerWidth - CARD_WIDTH - 16)
          } else {
            left += 24
          }
          if (top + CARD_HEIGHT >= globalThis.innerHeight) {
            top = Math.max(16, globalThis.innerHeight - CARD_HEIGHT - 16)
          }

          setKeyword(word)
          setDetail(next)
          setPosition({ left, top })
          setVisible(true)
          panelRef.current?.scrollTo(0, 0)
        }

        async function highlight(): Promise<void> {
          const map = await fetchWordsMap(wordsMapPath)
          if (cancelled) {
            return
          }

          const details = new Map<string, AnnotationWordDetail>()
          for (const [word, item] of Object.entries(map)) {
            if (ignored.has(word)) {
              continue
            }
            const entry = Object.hasOwn(item.lang, lang) ? item.lang[lang] : item.lang.zh
            details.set(word, entry)
          }
          detailByWordRef.current = details
          const words = [...details.keys()]

          const used = new Set<string>()
          for (const node of getTextNodes(root)) {
            const text = node.nodeValue
            if (!text) {
              continue
            }

            let html = text
            let changed = false
            for (const word of words) {
              if (used.has(word)) {
                continue
              }
              const matched = wordPattern(word).exec(html)
              if (!matched) {
                continue
              }
              used.add(word)
              changed = true
              const before = html.slice(0, matched.index)
              const after = html.slice(matched.index + matched[0].length)
              html = `${before}<span class="${HIGHLIGHT_CLASS}">${matched[0]}</span>${after}`
            }
            if (!changed) {
              continue
            }

            const wrap = document.createElement('span')
            wrap.innerHTML = html
            const fragment = document.createDocumentFragment()
            for (const child of wrap.childNodes) {
              fragment.append(child.cloneNode(true))
            }
            node.parentNode?.replaceChild(fragment, node)
          }

          for (const el of root.querySelectorAll(`.${HIGHLIGHT_CLASS}`)) {
            el.addEventListener('click', openFromTarget)
          }
          globalThis.addEventListener('scroll', close, { passive: true })
          globalThis.addEventListener('click', close)
        }

        void highlight()

        dispose = (): void => {
          cancelled = true
          setVisible(false)
          setKeyword('')
          setDetail(null)
          for (const el of root.querySelectorAll(`.${HIGHLIGHT_CLASS}`)) {
            el.removeEventListener('click', openFromTarget)
          }
          for (const el of root.querySelectorAll(`.${HIGHLIGHT_CLASS}`)) {
            el.replaceWith(document.createTextNode(el.textContent || ''))
          }
          globalThis.removeEventListener('scroll', close)
          globalThis.removeEventListener('click', close)
        }
      }
    }

    return dispose
  }, [lang, pathname, search, wordsMapPath, ignoreWords, ignorePaths])

  const onPanelClick = useCallback((event: ReactMouseEvent<HTMLDivElement>): void => {
    event.stopPropagation()
    setVisible(true)
  }, [])

  if (!visible || !detail) {
    return null
  }

  return (
    <div ref={panelRef} className='hey-annotation-panel' style={panelStyle} onClick={onPanelClick}>
      <AnnotationCard name={keyword} detail={detail} />
    </div>
  )
}
