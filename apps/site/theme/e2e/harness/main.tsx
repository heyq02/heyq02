import { createRoot } from 'react-dom/client'

import { FriendsPage } from '../../FriendsPage.tsx'
import { ProfilePlay } from '../../ProfilePlay.tsx'
import { SiteEasterEgg } from '../../SiteEasterEgg.tsx'

// CSS side-effect imports for the harness bundle.
import '../../../tailwind.css'
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
