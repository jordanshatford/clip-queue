/**
 * Generate a unique key for an integration assuming that the key value is unique.
 * @param integration - The current integration (assumes all integrations have unique id).
 * @param key - The unique key for the integration.
 * @returns string - unique
 */
export function key(integration: { id: string }, key: string): string {
  return `__cqi_${integration.id}_${key}`
}
