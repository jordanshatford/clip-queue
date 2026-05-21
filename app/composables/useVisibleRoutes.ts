import type { NavigationMenuItem, TabsItem } from '@nuxt/ui'
import type { RouteRecordRaw } from 'vue-router'

import { m } from '#paraglide/messages'

const translations: Record<string | symbol, () => string> = {
  queue: m.queue,
  history: m.history,
  settings: m.settings,
  logs: m.logs,
  'settings-logs': m.logs,
  'settings-preferences': m.settings_preferences,
  'settings-application': m.application,
  'settings-other': m.settings_other,
  'settings-integrations': m.integrations,
}

function getRouteLabel(route: RouteRecordRaw): string {
  if (route.name) {
    return translations[route.name]?.() ?? ''
  }
  return ''
}

/**
 * Composable to get the visible routes for the navigation menu and settings tabs.
 * @returns An object containing the visible routes for the main navigation and settings tabs.
 */
export function useVisibleRoutes() {
  const router = useRouter()
  const route = useRoute()
  const user = useUser()
  const queue = useQueue()

  const visible = computed<RouteRecordRaw[]>(() => {
    return processRoutes([...router.options.routes], user.isLoggedIn)
  })

  const all = computed<NavigationMenuItem[]>(() => {
    return visible.value.map((r) => ({
      label: getRouteLabel(r),
      icon: r.meta?.icon,
      to: r.path,
      active: route.path.startsWith(r.path),
      badge: r.name === 'queue' ? queue.upcoming.display : undefined,
      chip:
        r.name === 'queue'
          ? {
              color: queue.settings.open ? 'success' : 'error',
            }
          : undefined,
      children: r.children?.map((c) => ({
        label: getRouteLabel(c),
        icon: c.meta?.icon,
        to: r.path + '/' + c.path,
      })),
    }))
  })

  const settings = computed<TabsItem[]>(() => {
    const settingsRoutes = visible.value.find((r) => r.name === 'settings')?.children ?? []
    return settingsRoutes.map((r) => ({
      label: getRouteLabel(r),
      value: r.path ? `/settings/${r.path}` : '',
      icon: r.meta?.icon ?? '',
    }))
  })

  return {
    visible,
    all,
    settings,
  }
}
