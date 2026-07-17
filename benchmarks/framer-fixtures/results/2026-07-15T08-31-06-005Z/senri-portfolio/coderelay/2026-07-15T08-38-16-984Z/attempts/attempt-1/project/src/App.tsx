import {
  Component,
  lazy,
  Suspense,
  startTransition,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const Home = lazy(() =>
  import('../pages/Home').then((module) => ({
    default: module.Home,
  })),
)

const pages = [
  {
    path: '/',
    title: 'Home',
    routeKind: 'page',
    templateId: '/',
    templatePath: '/',
    template: null,
    templateKind: 'static',
    destination: null,
    destinationKind: null,
    redirectTo: null,
    redirectStatus: null,
    Component: Home,
  },
]

const pagePreloaders: Record<string, () => Promise<unknown>> = {
  '/': () =>
    import('../pages/Home').then((module) => ({
      default: module.Home,
    })),
}

function normalizePath(path: string) {
  if (!path) return '/'
  if (path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}

function getInitialPath() {
  if (typeof window === 'undefined') return pages[0]?.path ?? '/'
  const browserPath = normalizePath(window.location.pathname)
  if (pages.some((page) => normalizePath(page.path) === browserPath)) {
    return browserPath
  }
  const hashPath = normalizePath(window.location.hash.replace(/^#/, ''))
  if (pages.some((page) => normalizePath(page.path) === hashPath)) {
    return hashPath
  }
  return normalizePath(pages[0]?.path ?? '/')
}

function preloadRoute(path: string) {
  const preload = pagePreloaders[normalizePath(path)]
  if (!preload) return
  void preload()
}

function navigateTo(path: string, options: { replace?: boolean } = {}) {
  if (typeof window === 'undefined') return
  const nextPath = normalizePath(path)
  const method = options.replace ? 'replaceState' : 'pushState'
  window.history[method](null, '', nextPath)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function isExternalUrl(path: string) {
  return /^https?:\/\//.test(path)
}

function isModifiedEvent(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function findInternalAnchor(target: EventTarget | null) {
  if (!(target instanceof Element)) return null
  const anchor = target.closest('a[href]')
  if (!(anchor instanceof HTMLAnchorElement)) return null
  if (!anchor.href) return null
  const url = new URL(anchor.href, window.location.href)
  if (url.origin !== window.location.origin) return null
  return {
    anchor,
    path: normalizePath(url.pathname),
  }
}

class RouteErrorBoundary extends Component<
  { path: string; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { path: string; children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('CodeRelay route render failed', {
      path: this.props.path,
      error,
    })
  }

  componentDidUpdate(prevProps: { path: string }) {
    if (prevProps.path !== this.props.path && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="routeStateCard" role="alert">
          <div className="routeStateEyebrow">Route error</div>
          <h2>We could not render this exported page.</h2>
          <p>
            Try another route or regenerate this export with fresh source
            evidence.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => getInitialPath())

  useEffect(() => {
    const updatePath = () => {
      startTransition(() => {
        setCurrentPath(getInitialPath())
      })
    }

    const handleMouseOver = (event: MouseEvent) => {
      const match = findInternalAnchor(event.target)
      if (!match) return
      preloadRoute(match.path)
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        isModifiedEvent(event)
      ) {
        return
      }
      const match = findInternalAnchor(event.target)
      if (!match) return
      if (!pages.some((page) => normalizePath(page.path) === match.path)) return
      event.preventDefault()
      preloadRoute(match.path)
      navigateTo(match.path)
    }

    updatePath()
    preloadRoute(currentPath)
    window.addEventListener('popstate', updatePath)
    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('popstate', updatePath)
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [currentPath])

  const currentPage =
    pages.find(
      (page) => normalizePath(page.path) === normalizePath(currentPath),
    ) ?? pages[0]

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.title = currentPage?.title || 'ExportedSection'
  }, [currentPage])

  useEffect(() => {
    const currentIndex = pages.findIndex(
      (page) =>
        normalizePath(page.path) === normalizePath(currentPage?.path ?? ''),
    )
    if (currentIndex < 0) return
    preloadRoute(pages[currentIndex - 1]?.path ?? '')
    preloadRoute(pages[currentIndex + 1]?.path ?? '')
  }, [currentPage])

  useEffect(() => {
    if (!currentPage?.redirectTo || typeof window === 'undefined') return
    if (isExternalUrl(currentPage.redirectTo)) {
      window.location.replace(currentPage.redirectTo)
      return
    }
    navigateTo(currentPage.redirectTo, { replace: true })
  }, [currentPage])

  if (!currentPage) {
    return (
      <main data-coderelay-runtime-kept="true">
        <div className="routeStateCard" role="alert">
          <div className="routeStateEyebrow">No route</div>
          <h2>This export has no routable pages.</h2>
        </div>
      </main>
    )
  }

  const Page = currentPage.Component

  return (
    <>
      {currentPage.redirectTo ? (
        <div className="routeStateCard" role="status">
          <div className="routeStateEyebrow">Redirect</div>
          <h2>Redirecting…</h2>
          <p>
            <code>{currentPage.path}</code> →{' '}
            <code>{currentPage.redirectTo}</code>
          </p>
        </div>
      ) : null}
      <RouteErrorBoundary path={currentPage.path}>
        <Suspense
          fallback={
            <div className="routeStateCard" aria-live="polite">
              <div className="routeStateEyebrow">Loading route</div>
              <h2>{currentPage.title}</h2>
              <p>Preparing the generated page module and its styles.</p>
            </div>
          }
        >
          {currentPage.redirectTo ? null : <Page />}
        </Suspense>
      </RouteErrorBoundary>
    </>
  )
}
