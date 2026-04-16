"use client";

import { useEffect } from "react";
import { clearUser, setUser } from "@/redux/slice/profile";
import { useAppDispatch } from "@/redux/store";
import { getStoredSession } from "@/utils/local-auth";

type Props = {
  children: React.ReactNode;
};

export default function LocalSessionSync({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const session = getStoredSession();

    if (!session) {
      dispatch(clearUser());
      return;
    }

    dispatch(
      setUser({
        id: null,
        name: session.name,
        email: session.email,
        image: null,
      })
    );
  }, [dispatch]);

  return <>{children}</>;
}
