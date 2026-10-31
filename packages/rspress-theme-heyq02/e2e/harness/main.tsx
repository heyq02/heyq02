import { createRoot } from 'react-dom/client'

import { FriendsPage } from '../../FriendsPage.tsx'
import { ProfilePlay } from '../../ProfilePlay.tsx'
import { SiteEasterEgg } from '../../SiteEasterEgg.tsx'

// CSS side-effect imports (harness is outside package tsconfig include).
// @ts-expect-error CSS module shim lives in env.d.ts, not applied to this file.
import '../../../../apps/site/tailwind.css'
// @ts-expect-error CSS module shim lives in env.d.ts, not applied to this file.
import './harness.css'

const root = document.querySelector('#root')
if (root) {
  createRoot(root).render(
    <div className='mx-auto max-w-[44rem] p-6'>
      <SiteEasterEgg />
      <ProfilePlay tags={<span>Harness</span>} ssgMd={false} />
      <FriendsPage ssgMd={false} />
    </div>
  )
}
