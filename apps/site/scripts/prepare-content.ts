/**
 * Regenerate committed content snapshots derived from markdown
 * (`content/data/recent-posts.json` + ignored blog `_meta.json`).
 * Local / CI: `vp run @heyq02/site#cprepare-content`.
 */
import { prepareBlogMeta } from '@heyq02/rspress-plugin-blog-meta'

import { siteBlogMetaOptions } from '../lib/blog-meta.ts'

await prepareBlogMeta(siteBlogMetaOptions({ format: false }))
