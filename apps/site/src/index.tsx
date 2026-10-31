import './App.css'
import { LocaleProvider } from './i18n/LocaleContext.tsx'
import { mount } from './mount.tsx'
import { Home } from './pages/Home.tsx'

mount(
  <LocaleProvider>
    <Home />
  </LocaleProvider>
)
