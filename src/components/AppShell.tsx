import { Suspense, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Container, Dialog, Text, textLinkVariants } from "@/design-system/phrasebook";
import { supabase } from "@/integrations/supabase/client";
import { GearIcon, MoonIcon, SunIcon } from "./Icons";
import { SettingsPanel } from "./SettingsPanel";

export function resolveTheme(choice: string): "light" | "dark" {
  if (choice === "light" || choice === "dark") return choice;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Learn" },
  { to: "/library", label: "Library" },
] as const;

type AppShellProps = {
  children: ReactNode;
  width?: "narrow" | "content" | "wide";
};

export function AppShell({ children, width = "narrow" }: AppShellProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("phrasebook-theme") ?? window.localStorage.getItem("codeconut-theme");
    return stored === "light" || stored === "dark" ? stored : resolveTheme("system");
  });
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("phrasebook-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-app text-foreground">
      <header className="relative z-40 border-b border-border">
        <Container className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-2 sm:flex">
          <Link to="/" aria-label="Phrasebook home" className="flex min-w-0 items-center gap-2 rounded-md text-primary transition-colors hover:text-primary-hover">
            <Text as="span" size="lead" weight="semibold" className="truncate text-current">Phrasebook</Text>
          </Link>
          <nav aria-label="Main" className="order-3 col-span-2 flex items-center gap-5 sm:order-none sm:col-span-1 sm:ml-6">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`${textLinkVariants({ variant: "quiet" })} hover:underline hover:decoration-2 hover:underline-offset-8`}
                activeProps={{ className: `${textLinkVariants({ variant: "standalone" })} underline decoration-2 underline-offset-8`, "aria-current": "page" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1 sm:ml-auto">
            <Button variant="ghost" size="sm" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleTheme}>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </Button>
            <Button variant="ghost" size="sm" aria-label="Settings" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
              <GearIcon />
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
          </div>
        </Container>
      </header>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="settings-h">
        <Suspense fallback={<Text tone="muted">Loading settings…</Text>}>
          <SettingsPanel onClose={() => setOpen(false)} />
        </Suspense>
      </Dialog>
      <main>
        <Container width={width} className="py-8 md:py-12">{children}</Container>
      </main>
    </div>
  );
}
