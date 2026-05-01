/**
 * Enumeration representing the status of an integration.
 */
export enum IntegrationStatus {
  /**
   * The integration is working as expected.
   */
  HEALTHY = 'Healthy',
  /**
   * There has been some error with the integration.
   */
  ERROR = 'Error',
  /**
   * The integration is not configured to be used.
   */
  DISABLED = 'Disabled',
  /**
   * The integration is not configured properly.
   */
  MISCONFIGURED = 'Misconfigured',
  /**
   * The integration is in an unknown or unexpected state.
   */
  UNKNOWN = 'Unknown',
}
