import type { App } from "vue"
import * as Sentry from "@sentry/vue"
import { BrowserTracing } from "@sentry/tracing"
import { env } from "@/assets/config"
import router from "@/router"

function init(app: App) {
  if (env.sentryDSN) {
    Sentry.init({
      app,
      environment: env.mode,
      dsn: env.sentryDSN,
      integrations: [
        new BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ["localhost", "clipqueue.vercel.app", /^\//],
        }),
      ],
      tracesSampleRate: 0.2,
    })
  }
}

export default {
  init,
}
