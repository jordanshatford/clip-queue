import type { App } from "vue"
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from "@sentry/tracing"
import { env } from "@/assets/config"
import router from "@/router"

function init(app: App) {
  if (env.SENTRY_DSN) {
    Sentry.init({
      app,
      environment: env.MODE,
      dsn: env.SENTRY_DSN,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ["localhost", env.SENTRY_TRACING_ORIGIN, /^\//],
        }),
      ],
      tracesSampleRate: 0.2,
    })
  }
}

export default {
  init,
}
