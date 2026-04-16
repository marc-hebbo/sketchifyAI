"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, LogOut, User, UserPlus } from "lucide-react";
import AuthDialog from "@/components/auth/auth-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/redux/store";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function AccountMenu() {
  const router = useRouter();
  const profileState = useAppSelector((state) => state.profile);
  const user = profileState.user;
  const authResolved = profileState.authResolved;
  const isLoggedIn = Boolean(user?.id);

  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const openAuthDialog = useCallback((mode: "sign-in" | "sign-up") => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    setIsSigningOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Signed out");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign out";
      toast.error(message);
    } finally {
      setIsSigningOut(false);
    }
  }, [router]);

  const title = !authResolved
    ? "Checking account"
    : isLoggedIn
      ? user?.name || "Account"
      : "Guest";

  const subtitle = !authResolved
    ? "Restoring session"
    : isLoggedIn
      ? user?.email || "Signed in"
      : "Sign in to save your projects";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.08] px-2.5 py-2 text-left saturate-150 backdrop-blur-xl transition-colors hover:bg-white/[0.12]"
          >
            <div className="relative">
              <Avatar className="size-10">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>
                  {authResolved && isLoggedIn ? (
                    <span className="text-sm font-medium text-black">
                      {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="size-4 text-black" />
                  )}
                </AvatarFallback>
              </Avatar>
              {authResolved && isLoggedIn && (
                <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-black bg-emerald-400" />
              )}
            </div>

            <div className="hidden min-w-0 sm:flex sm:flex-col">
              <span className="truncate text-sm font-medium text-white">
                {title}
              </span>
              <span className="truncate text-xs text-white/55">
                {subtitle}
              </span>
            </div>

            {!authResolved && <Loader2 className="size-4 animate-spin text-white/60" />}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 border-white/[0.12] bg-zinc-950 text-white"
        >
          <DropdownMenuLabel className="space-y-1">
            <div className="text-sm font-medium">
              {isLoggedIn ? user?.name || "Account" : "Not signed in"}
            </div>
            <div className="text-xs font-normal text-white/55">
              {isLoggedIn
                ? user?.email || "Signed in"
                : "Sign in or create an account to sync your projects."}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />

          {isLoggedIn ? (
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                void handleSignOut();
              }}
              disabled={isSigningOut}
              className="focus:bg-white/10 focus:text-white"
            >
              {isSigningOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              Sign out
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  openAuthDialog("sign-in");
                }}
                className="focus:bg-white/10 focus:text-white"
              >
                <LogIn className="size-4" />
                Sign in
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  openAuthDialog("sign-up");
                }}
                className="focus:bg-white/10 focus:text-white"
              >
                <UserPlus className="size-4" />
                Create account
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSuccess={handleAuthSuccess}
        defaultMode={authMode}
      />
    </>
  );
}
