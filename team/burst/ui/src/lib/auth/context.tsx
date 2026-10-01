import { useCallback, useEffect, useState, type ReactNode } from "react";
import { apiFetch, setAccessToken } from "../api/client";
import type { TokenResponse, User } from "../api/types";
import { queryClient } from "../query-client";
import { wsClient } from "../ws/client";
import { AuthContext } from "./auth-context";
import { withStatus, type StatusChangedEvent } from "../status";
import { withDnd, type DndChangedEvent } from "../dnd";

export { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // SymNexus Team: the session is an httpOnly cookie set by the sign-in page
  // (team/web), so there is always a session to try to restore.
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const me = await apiFetch<User>("/users/me");
    setUser(me);
  }, []);

  // On mount: restore the session from the cookie by fetching the current user.
  // A 401 leaves user null, and the router sends the visitor to sign in.
  useEffect(() => {
    let stopHeartbeat: (() => void) | null = null;
    let cancelled = false;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- setState is in async callbacks, not synchronous
    fetchMe()
      .then(() => {
        if (!cancelled) {
          wsClient.connect();
          stopHeartbeat = wsClient.startHeartbeat();
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
      stopHeartbeat?.();
    };
  }, [fetchMe]);

  // Keeps the signed-in user's own status current when it is changed elsewhere.
  useEffect(
    () =>
      wsClient.on("user.status_changed", (e) => {
        const event = e as StatusChangedEvent;
        setUser((u) => (u && u.id === event.userId ? withStatus(u, event) : u));
      }),
    [],
  );

  // Keeps the signed-in user's own do-not-disturb current when it is changed elsewhere.
  useEffect(
    () =>
      wsClient.on("user.dnd_changed", (e) => {
        const event = e as DndChangedEvent;
        setUser((u) => (u && u.id === event.userId ? withDnd(u, event) : u));
      }),
    [],
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const params = new URLSearchParams({
        grant_type: "password",
        username,
        password,
        client_id: "burst",
        scope: "openid",
      });

      const res = await fetch("/oauth/burst/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      if (!res.ok) {
        // The sign-in gateway explains the failure (wrong credentials, rate limit).
        const body = (await res.json().catch(() => null)) as { error_description?: string } | null;
        throw new Error(body?.error_description ?? "Authentication failed");
      }

      const data: TokenResponse = await res.json();
      setAccessToken(data.access_token);
      wsClient.connect();
      await fetchMe();
    },
    [fetchMe],
  );

  const loginWithToken = useCallback(
    async (token: string) => {
      setAccessToken(token);
      wsClient.connect();
      await fetchMe();
    },
    [fetchMe],
  );

  const logout = useCallback(() => {
    wsClient.disconnect();
    wsClient.reset();
    queryClient.clear();
    setAccessToken(null);
    setUser(null);
    // Clear the session cookie on the server, then show the sign-in page.
    void fetch("/auth/logout", { method: "POST", keepalive: true })
      .catch(() => {})
      .finally(() => window.location.assign("/login"));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, loginWithToken, logout, updateUser: setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
