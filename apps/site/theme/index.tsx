import { useLocation } from '@rspress/core/runtime'
import type { LayoutProps } from '@rspress/core/theme-original'
import { HomeFooter, Layout as BasicLayout } from '@rspress/core/theme-original'
import type { ReactElement } from 'react'

import { MainLandmark } from './MainLandmark.tsx'

import './chrome.css'

// Required by Rspress so blog pages keep the default theme.
// oxlint-disable-next-line import/export
export * from '@rspress/core/theme-original'

/** Site layout — site footer only on the homepage. */
export function Layout(props: LayoutProps): ReactElement {
  const { bottom, beforeNav, ...rest } = props
  const { pathname } = useLocation()
  const isHome = pathname === '/' || pathname === ''

  return (
    <BasicLayout
      {...rest}
      beforeNav={
        <>
          <a href='#hey-main' className='hey-skip-link'>
            跳到主要内容
          </a>
          <MainLandmark />
          {beforeNav}
        </>
      }
      bottom={
        isHome ? (
          <>
            {bottom}
            <HomeFooter />
          </>
        ) : (
          bottom
        )
      }
    />
  )
}
