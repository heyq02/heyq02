import type { LayoutProps } from '@rspress/core/theme-original'
import { HomeFooter, Layout as BasicLayout } from '@rspress/core/theme-original'
import type { ReactElement } from 'react'

import { SiteEasterEgg } from './SiteEasterEgg.tsx'

import './index.css'

// Required by Rspress so blog pages keep the default theme.
// oxlint-disable-next-line import/export
export * from '@rspress/core/theme-original'

/** Site-wide footer and console greeting. */
export function Layout(props: LayoutProps): ReactElement {
  const { bottom, ...rest } = props
  return (
    <>
      <SiteEasterEgg />
      <BasicLayout
        {...rest}
        bottom={
          <>
            {bottom}
            <HomeFooter />
          </>
        }
      />
    </>
  )
}
