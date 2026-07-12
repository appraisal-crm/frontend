import { UserManager, WebStorageStateStore, type User } from 'oidc-client-ts';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface AuthConfig {
  /** Keycloak realm URL, e.g. http://localhost:8180/realms/appraisal */
  authority: string;
  clientId: string;
  /** OAuth redirect target; defaults to <origin>/callback */
  redirectUri?: string;
  scope?: string;
}

export interface LoginOptions {
  /** UI locale forwarded to the Keycloak login page (ui_locales). */
  locale?: string;
  /** App theme forwarded to the Keycloak login page (custom `theme` param). */
  theme?: 'light' | 'dark';
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  /** Realm roles from the access token (realm_access.roles). */
  roles: string[];
  login: (options?: LoginOptions) => Promise<void>;
  logout: () => Promise<void>;
  /** Fresh access token for API calls (undefined when logged out). */
  getToken: () => string | undefined;
  hasRole: (role: string) => boolean;
}

function decodeRealmRoles(accessToken: string | undefined): string[] {
  if (!accessToken) return [];
  const payload = accessToken.split('.')[1];
  if (!payload) return [];
  try {
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const claims = JSON.parse(json) as { realm_access?: { roles?: string[] } };
    return claims.realm_access?.roles ?? [];
  } catch {
    return [];
  }
}

function createUserManager(config: AuthConfig): UserManager {
  return new UserManager({
    authority: config.authority,
    client_id: config.clientId,
    redirect_uri: config.redirectUri ?? `${window.location.origin}/callback`,
    post_logout_redirect_uri: window.location.origin,
    response_type: 'code',
    scope: config.scope ?? 'openid profile',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    automaticSilentRenew: true,
    popupWindowFeatures: { width: 440, height: 640, menubar: false, toolbar: false },
  });
}

// Single-flight the redirect callback: React StrictMode mounts the provider
// twice in dev, and the OAuth code is single-use — a second exchange 400s and
// can leave the app stuck. Sharing one promise makes the exchange happen once.
let callbackInFlight: Promise<User | null> | null = null;

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ config, children }: { config: AuthConfig; children: ReactNode }) {
  const managerRef = useRef<UserManager>(undefined);
  managerRef.current ??= createUserManager(config);
  const manager = managerRef.current;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const params = new URLSearchParams(window.location.search);
      if (params.has('code') && params.has('state')) {
        // signinCallback handles both flows: for a popup it posts the response
        // to the opener (and resolves undefined), for a redirect it returns the user.
        callbackInFlight ??= manager.signinCallback().then(
          (u) => u ?? null,
          (err: unknown) => {
            console.error('OIDC signin callback failed', err);
            return null;
          },
        );
        const completed = await callbackInFlight;
        window.history.replaceState({}, document.title, window.location.pathname);
        if (active) {
          setUser(completed && !completed.expired ? completed : null);
          setLoading(false);
        }
        return;
      }
      const current = await manager.getUser();
      if (active) {
        setUser(current && !current.expired ? current : null);
        setLoading(false);
      }
    }

    void bootstrap();
    const onLoaded = (u: User) => setUser(u);
    const onUnloaded = () => setUser(null);
    manager.events.addUserLoaded(onLoaded);
    manager.events.addUserUnloaded(onUnloaded);
    return () => {
      active = false;
      manager.events.removeUserLoaded(onLoaded);
      manager.events.removeUserUnloaded(onUnloaded);
    };
  }, [manager]);

  const login = useCallback(
    async (options?: LoginOptions) => {
      const extraQueryParams = {
        ...(options?.locale ? { ui_locales: options.locale } : {}),
        ...(options?.theme ? { theme: options.theme } : {}),
      };
      try {
        await manager.signinPopup({ extraQueryParams });
      } catch (err) {
        // User dismissed the popup — not an error, stay on the page.
        if (err instanceof Error && /closed by user/i.test(err.message)) return;
        // Popup blocked or failed to open — fall back to a full redirect.
        await manager.signinRedirect({ extraQueryParams });
      }
    },
    [manager],
  );
  const logout = useCallback(() => manager.signoutRedirect(), [manager]);

  const roles = useMemo(() => decodeRealmRoles(user?.access_token), [user]);

  const value = useMemo<AuthState>(
    () => ({
      isLoading,
      isAuthenticated: !!user && !user.expired,
      user,
      roles,
      login,
      logout,
      getToken: () => (user && !user.expired ? user.access_token : undefined),
      hasRole: (role: string) => roles.includes(role),
    }),
    [isLoading, user, roles, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

/** Renders children only when the user holds at least one of the given roles. */
export function RequireRole({
  anyOf,
  fallback = null,
  children,
}: {
  anyOf: string[];
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { roles } = useAuth();
  const allowed = anyOf.some((r) => roles.includes(r));
  return <>{allowed ? children : fallback}</>;
}
