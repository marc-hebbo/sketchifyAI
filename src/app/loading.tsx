import { LogoIcon } from "@/components/logo";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative rounded-full border border-border bg-card p-3">
            <LogoIcon className="size-8 text-primary" />
          </div>
        </div>
        <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
          Loading
        </p>
        <p className="animate-in fade-in duration-700 text-sm font-medium tracking-[0.18em] text-foreground uppercase">
          Sketchify
        </p>
      </div>
    </div>
  );
};

export default Loading;
