"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import AuthDialog from "@/components/auth/auth-dialog";
import AccountMenu from "@/components/auth/account-menu";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/store";

type LandingAuthCtaProps = {
  redirectTo?: string;
  className?: string;
};

export default function LandingAuthCta({
  redirectTo = "/dashboard",
  className,
}: LandingAuthCtaProps) {
  const router = useRouter();
  const profileState = useAppSelector((state) => state.profile);
  const isLoggedIn = Boolean(profileState.user?.id);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-up");

  const onSuccess = useCallback(() => {
    router.push(redirectTo);
  }, [router, redirectTo]);

  if (isLoggedIn) {
    return <AccountMenu />;
  }

  return (
    <>
      <div
        className={[
          "flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 p-1.5 shadow-sm backdrop-blur",
          className ?? "",
        ].join(" ")}
      >
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-full border-border/60 bg-background/40 px-4 hover:bg-accent"
          onClick={() => {
            setMode("sign-in");
            setOpen(true);
          }}
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>

        <Button
          type="button"
          className="h-9 rounded-full px-4 shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/20"
          onClick={() => {
            setMode("sign-up");
            setOpen(true);
          }}
        >
          <UserPlus className="h-4 w-4" />
          Sign Up
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <AuthDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccess}
        defaultMode={mode}
      />
    </>
  );
}
