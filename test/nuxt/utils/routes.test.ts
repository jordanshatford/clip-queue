import type { RouteRecordRaw } from 'vue-router'

import { describe, it, expect } from 'vitest'

function createRoute(
  name: string | null,
  order?: number,
  opts?: Partial<RouteRecordRaw>,
): RouteRecordRaw {
  return {
    name,
    path: `/${name}`,
    meta: {
      order,
      ...opts?.meta,
    },
    children: opts?.children,
  } as RouteRecordRaw
}

describe('processRoutes', () => {
  it('filters out hidden routes', () => {
    const routes = [createRoute('home', 1), createRoute('secret', 2, { meta: { hidden: true } })]
    const result = processRoutes(routes, true)
    expect(result.map((r) => r.name)).toEqual(['home'])
  })

  it('filters out routes without a name', () => {
    const routes = [createRoute(null, 1), createRoute('home', 2)]
    const result = processRoutes(routes, true)
    expect(result.map((r) => r.name)).toEqual(['home'])
  })

  it('filters auth-required routes when not logged in', () => {
    const routes = [
      createRoute('public', 1),
      createRoute('private', 2, { meta: { requiresAuth: true } }),
    ]
    const result = processRoutes(routes, false)
    expect(result.map((r) => r.name)).toEqual(['public'])
  })

  it('allows auth routes when logged in', () => {
    const routes = [
      createRoute('public', 1),
      createRoute('private', 2, { meta: { requiresAuth: true } }),
    ]
    const result = processRoutes(routes, true)
    expect(result.map((r) => r.name)).toEqual(['public', 'private'])
  })

  it('sorts routes by meta.order ascending', () => {
    const routes = [createRoute('last', 50), createRoute('first', 1), createRoute('middle', 10)]
    const result = processRoutes(routes, true)
    expect(result.map((r) => r.name)).toEqual(['first', 'middle', 'last'])
  })

  it('pushes routes without order to the end', () => {
    const routes = [createRoute('no-order'), createRoute('with-order', 1)]
    const result = processRoutes(routes, true)
    expect(result.map((r) => r.name)).toEqual(['with-order', 'no-order'])
  })

  it('recursively processes children routes', () => {
    const routes = [
      createRoute('parent', 1, {
        children: [
          createRoute('child-hidden', 1, { meta: { hidden: true } }),
          createRoute('child-visible', 2),
        ],
      }),
    ]
    const result = processRoutes(routes, true)
    expect(result[0]?.children?.map((r) => r.name)).toEqual(['child-visible'])
  })

  it('handles nested auth rules in children', () => {
    const routes = [
      createRoute('parent', 1, {
        children: [createRoute('child-private', 1, { meta: { requiresAuth: true } })],
      }),
    ]
    const loggedOut = processRoutes(routes, false)
    expect(loggedOut[0]?.children).toEqual([])
    const loggedIn = processRoutes(routes, true)
    expect(loggedIn[0]?.children?.map((r) => r.name)).toEqual(['child-private'])
  })

  it('does not mutate original routes', () => {
    const routes = [
      createRoute('home', 1, {
        children: [createRoute('child', 1)],
      }),
    ]
    const clone = structuredClone(routes)
    processRoutes(routes, true)
    expect(routes).toEqual(clone)
  })
})
