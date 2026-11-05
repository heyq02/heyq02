import type { LayoutProps } from '@rspress/core/theme-original'
import { HomeFooter, Layout as BasicLayout } from '@rspress/core/theme-original'
import type { ReactElement } from 'react'

import { MainLandmark } from './MainLandmark.tsx'

import './chrome.css'

// Required by Rspress so blog pages keep the default theme.
// oxlint-disable-next-line import/export
export * from '@rspress/core/theme-original'

/** Site-wide layout with footer on every page. */
export function Layout(props: LayoutProps): ReactElement {
  const { bottom, beforeNav, ...rest } = props
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
        <>
          {bottom}
          <HomeFooter />
        </>
      }
    />
  )
}
