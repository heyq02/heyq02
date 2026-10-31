import type { LayoutProps } from '@rspress/core/theme-original'
import { HomeFooter, Layout as BasicLayout } from '@rspress/core/theme-original'
import type { ReactElement } from 'react'

import './index.css'

// Required by Rspress so blog pages keep the default theme.
// oxlint-disable-next-line import/export
export * from '@rspress/core/theme-original'

/** Site-wide footer: Rspress HomeFooter only mounts on pageType home; our pages are docs. */
export function Layout(props: LayoutProps): ReactElement {
  const { bottom, ...rest } = props
  return (
    <BasicLayout
      {...rest}
      bottom={
        <>
          {bottom}
          <HomeFooter />
        </>
      }
    />
  )
}
