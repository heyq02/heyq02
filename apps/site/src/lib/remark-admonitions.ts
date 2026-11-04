import type { Root } from 'mdast'
import type { ContainerDirective } from 'mdast-util-directive'
import { visit } from 'unist-util-visit'

const kinds = new Set(['tip', 'info', 'warning', 'danger', 'note', 'details', 'caution'])

/** Map VitePress/Rspress `::: tip` containers to `<aside class="admonition">`. */
export function remarkAdmonitions() {
  return (tree: Root) => {
    visit(tree, (node, _index, parent) => {
      if (node.type !== 'containerDirective') {
        return
      }
      const directive = node as ContainerDirective
      if (!kinds.has(directive.name)) {
        return
      }

      const title =
        typeof directive.attributes?.title === 'string'
          ? directive.attributes.title
          : directive.name.toUpperCase()

      directive.data ??= {}
      directive.data.hName = 'aside'
      directive.data.hProperties = {
        className: [`admonition`, `admonition-${directive.name}`]
      }

      if (parent && title) {
        directive.children.unshift({
          type: 'paragraph',
          data: {
            hName: 'p',
            hProperties: { className: ['admonition-title'] }
          },
          children: [{ type: 'text', value: title }]
        })
      }
    })
  }
}
