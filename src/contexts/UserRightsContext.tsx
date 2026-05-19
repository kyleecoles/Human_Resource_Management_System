// feat/rights-context — Sprint 2
// Loads all 17 UserModule_Rights rows for currentUser on login
// and exposes them as a flat rights map via useRights()

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

// ─── 17 right keys ────────────────────────────────────────────────────────────
export type RightKey =
  | "EMP_VIEW"  | "EMP_ADD"  | "EMP_EDIT"  | "EMP_DEL"
  | "JH_VIEW"   | "JH_ADD"   | "JH_EDIT"   | "JH_DEL"
  | "JOB_VIEW"  | "JOB_ADD"  | "JOB_EDIT"  | "JOB_DEL"
  | "DEPT_VIEW" | "DEPT_ADD" | "DEPT_EDIT" | "DEPT_DEL"
  | "ADM_USER";

export type RightsMap = Record<RightKey, boolean>;

const DEFAULT_RIGHTS: RightsMap = {
  EMP_VIEW:  false, EMP_ADD:  false, EMP_EDIT:  false, EMP_DEL:  false,
  JH_VIEW:   false, JH_ADD:   false, JH_EDIT:   false, JH_DEL:   false,
  JOB_VIEW:  false, JOB_ADD:  false, JOB_EDIT:  false, JOB_DEL:  false,
  DEPT_VIEW: false, DEPT_ADD: false, DEPT_EDIT: false, DEPT_DEL: false,
  ADM_USER:  false,
};

// ─── Context shape ─────────────────────────────────────────────────────────────
interface UserRightsContextValue {
  rights: RightsMap;
  rightsLoading: boolean;
}

const UserRightsContext = createContext<UserRightsContextValue | undefined>(
  undefined
);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function UserRightsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [rights, setRights] = useState<RightsMap>(DEFAULT_RIGHTS);
  const [rightsLoading, setRightsLoading] = useState(true);

  const loadRights = useCallback(async (userId: string) => {
    setRightsLoading(true);

    const { data, error } = await supabase
      .from("UserModule_Rights")
      .select("right_id, right_value")
      .eq("userId", userId);

    if (error || !data) {
      console.error("[UserRightsContext] Failed to load rights:", error?.message);
      setRights(DEFAULT_RIGHTS);
      setRightsLoading(false);
      return;
    }

    // Build flat map: { EMP_VIEW: true, EMP_ADD: false, … }
    const map: RightsMap = { ...DEFAULT_RIGHTS };
    for (const row of data) {
      if (row.right_id in map) {
        (map as Record<string, boolean>)[row.right_id] = row.right_value === 1;
      }
    }

    setRights(map);
    setRightsLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadRights(currentUser.userId);
    } else {
      // User logged out — reset to defaults
      setRights(DEFAULT_RIGHTS);
      setRightsLoading(false);
    }
  }, [currentUser, loadRights]);

  return (
    <UserRightsContext.Provider value={{ rights, rightsLoading }}>
      {children}
    </UserRightsContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useRights(): UserRightsContextValue {
  const ctx = useContext(UserRightsContext);
  if (!ctx) {
    throw new Error("useRights must be used inside <UserRightsProvider>");
  }
  return ctx;
}