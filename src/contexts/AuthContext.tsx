import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type UserType = "SUPERADMIN" | "ADMIN" | "USER";
export type RecordStatus = "ACTIVE" | "INACTIVE";

export interface AppUser extends User {
  userId: string;
  username: string;
  user_type: UserType;
  record_status: RecordStatus;
}

interface AuthContextValue {
  currentUser: AppUser | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadAppUser = useCallback(async (authUser: User): Promise<AppUser | null> => {
    const { data, error } = await supabase
      .from("app_user")
      .select("userId, username, user_type, record_status")
      .eq("userId", authUser.id)
      .single();

    if (error || !data) {
      console.error("[AuthContext] app_user fetch failed:", error?.message);
      return null;
    }

    return { ...authUser, ...data } as AppUser;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSession(null);
  }, []);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error("[AuthContext] getSession failed:", error.message);
        setCurrentUser(null);
        setSession(null);
        setLoading(false);
        return;
      }

      setSession(initialSession);
      if (initialSession?.user) {
        loadAppUser(initialSession.user).then((appUser) => {
          if (appUser) setCurrentUser(appUser);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);

        if (event === "SIGNED_IN" && newSession?.user) {
          const appUser = await loadAppUser(newSession.user);

          if (!appUser) {
            await supabase.auth.signOut();
            setAuthError("Your account could not be found. Please contact an HR administrator.");
            setCurrentUser(null);
            setLoading(false);
            return;
          }

          // Login guard — block INACTIVE accounts
          if (appUser.record_status !== "ACTIVE") {
            await supabase.auth.signOut();
            setAuthError("Your account is pending activation by an HR administrator.");
            setCurrentUser(null);
            setLoading(false);
            return;
          }

          setAuthError(null);
          setCurrentUser(appUser);
          setLoading(false);
        }

        if (event === "SIGNED_OUT") {
          setCurrentUser(null);
          setLoading(false);
        }

        if (event === "TOKEN_REFRESHED") {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadAppUser]);

  return (
    <AuthContext.Provider value={{ currentUser, session, loading, authError, clearAuthError, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}