"use client";

import { useEffect } from "react";
import { clearUser, setUser } from "@/redux/slice/profile";
import { useAppDispatch } from "@/redux/store";
import { createClient } from "@/utils/supabase/client";

type Props = {
  children: React.ReactNode;
};

export default function LocalSessionSync({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(
          setUser({
            id: session.user.id,
            name: session.user.email?.split("@")[0] ?? null,
            email: session.user.email ?? null,
            image: null,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(
          setUser({
            id: session.user.id,
            name: session.user.email?.split("@")[0] ?? null,
            email: session.user.email ?? null,
            image: null,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
