"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slice/profile";
import { toast } from "sonner";
import { setStoredSession, upsertStoredAccount } from "@/utils/local-auth";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultMode?: "sign-in" | "sign-up";
};

export default function AuthDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultMode,
}: AuthDialogProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">(
    defaultMode ?? "sign-in"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!open) return;
    if (!defaultMode) return;
    setMode(defaultMode);
  }, [open, defaultMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const account = upsertStoredAccount(email, password);
      const session = setStoredSession(email);

      if (!account || !session) {
        throw new Error("Failed to start local account session");
      }

      dispatch(
        setUser({
          id: null,
          name: session.name,
          email: session.email,
          image: null,
        })
      );

      toast.success(
        mode === "sign-up" ? "Account created locally!" : "Signed in locally!"
      );
      onOpenChange(false);
      onSuccess();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "sign-in" ? "Sign in" : "Create an account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "sign-in"
              ? "Sign in locally to continue with SketchifyAI."
              : "Create a local account to get started with SketchifyAI."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {mode === "sign-in" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          {mode === "sign-in" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("sign-up")}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
