type AppLoaderProps = {
  path?: string;
  text?: string;
};

export function AppLoader({ path, text }: AppLoaderProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Brand mark */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="h-16 w-16 rounded-full border border-foreground/20" />
          {/* Inner pulse */}
          <div className="absolute h-10 w-10 rounded-full border border-foreground animate-pulse" />
          {/* Dot under ọ */}
          <div className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-foreground" />
        </div>
        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-semibold tracking-wide text-foreground">
            ọjà
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            marketplace console
          </span>
        </div>
        {/* Contextual loader text */}
        <span className="text-sm text-muted-foreground">
          {path ? `Loading ${path}…` : "Preparing dashboard…"}
        </span>
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    </div>
  );
}
