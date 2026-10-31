import { createRoot } from 'react-dom/client'

import { FriendsPage } from '../../FriendsPage.tsx'
import { ProfilePlay } from '../../ProfilePlay.tsx'
import { SiteEasterEgg } from '../../SiteEasterEgg.tsx'

const root = document.querySelector('#root')
if (root) {
  createRoot(root).render(
    <>
      <SiteEasterEgg />
      <ProfilePlay tags={<span>Harness</span>} ssgMd={false} />
      <FriendsPage ssgMd={false} />
    </>
  )
}
