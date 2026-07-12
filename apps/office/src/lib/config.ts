export const config = {
  keycloakAuthority:
    import.meta.env.VITE_KEYCLOAK_AUTHORITY ?? 'http://localhost:8180/realms/appraisal',
  keycloakClientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'appraisal-frontend',
  requestApiUrl: import.meta.env.VITE_REQUEST_API_URL ?? 'http://localhost:8080',
  inspectApiUrl: import.meta.env.VITE_INSPECT_API_URL ?? 'http://localhost:8082',
  reviewApiUrl: import.meta.env.VITE_REVIEW_API_URL ?? 'http://localhost:8084',
};
