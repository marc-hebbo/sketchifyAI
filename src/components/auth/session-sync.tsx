"use client";

import { useEffect } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { clearProjects } from "@/redux/slice/projects";
import { clearUser, setAuthResolved, setUser } from "@/redux/slice/profile";
import { useAppDispatch } from "@/redux/store";
import { createClient } from "@/utils/supabase/client";

type Props = {
  children: React.ReactNode;
};

const getDisplayName = (user: SupabaseUser) =>
  user.user_metadata?.full_name ||
  user.user_metadata?.name ||
  user.email?.split("@")[0] ||
  "user";

const getAvatar = (user: SupabaseUser) =>
  user.user_metadata?.avatar_url ||
  user.user_metadata?.picture ||
  null;

export default function AuthSessionSync({ children }: Props) {
  const dispatch = useAppDispatch();
  const ensureUser = useMutation(api.user.ensureUser);

  useEffect(() => {
    const supabase = createClient();
    let isActive = true;

    const syncUser = async (authUser: SupabaseUser | null) => {
      if (!authUser) {
        if (!isActive) return;
        dispatch(clearUser());
        dispatch(clearProjects());
        return;
      }

      try {
        const convexUserId = await ensureUser({
          authUserId: authUser.id,
          email: authUser.email ?? undefined,
          image: getAvatar(authUser) ?? undefined,
          name: getDisplayName(authUser),
        });

        if (!isActive) return;

        dispatch(
          setUser({
            id: convexUserId,
            name: getDisplayName(authUser),
            email: authUser.email ?? null,
            image: getAvatar(authUser),
          })
        );
      } catch (error) {
        console.error("Failed to sync auth session:", error);
        if (!isActive) return;
        dispatch(clearUser());
      }
    };

    const bootstrap = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await syncUser(session?.user ?? null);
      } catch (error) {
        console.error("Failed to restore auth session:", error);
        if (!isActive) return;
        dispatch(clearUser());
      } finally {
        if (isActive) {
          dispatch(setAuthResolved(true));
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        await syncUser(session?.user ?? null);
        if (isActive) {
          dispatch(setAuthResolved(true));
        }
      })();
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [dispatch, ensureUser]);

  return <>{children}</>;
}
