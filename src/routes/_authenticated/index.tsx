import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button, Field, Heading, Input, Text, textLinkVariants } from "@/design-system/phrasebook";
import { AppShell } from "@/components/AppShell";
import { profileQuery, statsQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Home — Phrasebook" },
      { name: "description", content: "Start an audio review round and see your progress." },
      { property: "og:title", content: "Home — Phrasebook" },
      { property: "og:description", content: "Start an audio review round and see your progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(profileQuery), context.queryClient.ensureQueryData(statsQuery)]),
  errorComponent: ({ error }) => <Text>Something went wrong: {error instanceof Error ? error.message : "Unknown error"}</Text>,
  notFoundComponent: () => <Text>Not found</Text>,
  component: Home,
});

const STEPS = [
  "Add phrases in Learn — pick a language, add a translation if you like.",
  "Start a round and listen to each phrase.",
  "Mark Memorized or Not yet. Least-learned phrases come first.",
  "Edit, filter and clean up everything in Library.",
] as const;

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-sans text-h1 font-extrabold text-primary">{value}</span>
      <Text size="small" tone="muted">{label}</Text>
    </div>
  );
}

function Home() {
  const { data: profile } = useSuspenseQuery(profileQuery);
  const { data: stats } = useSuspenseQuery(statsQuery);
  const navigate = useNavigate();
  const [n, setN] = useState(String(profile.round_size));
  const roundN = Math.min(20, Math.max(1, Number(n) || profile.round_size));

  return (
    <AppShell width="content">
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:gap-16">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="round-h" className="flex flex-col gap-4">
            <Text size="small" tone="muted" weight="semibold">YOUR WORKSPACE</Text>
            <Heading level={1} id="round-h">Ready for a round?</Heading>
            {stats.total === 0 ? (
              <Text tone="muted">
                No phrases yet. <Link to="/learn" className={textLinkVariants()}>Add your first phrase</Link>.
              </Text>
            ) : (
              <Text tone="muted">Listen, recall, and mark each phrase yourself.</Text>
            )}
            <form
              className="flex items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/review", search: { n: roundN, seed: Date.now() } });
              }}
            >
              <Field htmlFor="round-n" label="Phrases">
                <Input id="round-n" type="number" min={1} max={20} value={n} onChange={(e) => setN(e.target.value)} className="w-20" />
              </Field>
              <Button type="submit" variant="accent" size="md" disabled={stats.total === 0}>Start round</Button>
            </form>
          </section>
          <section aria-labelledby="stats-h" className="flex flex-col gap-4 border-t border-border pt-6">
            <Heading level={2} id="stats-h" className="text-lead md:text-lead">Progress</Heading>
            <div className="flex gap-10">
              <Stat value={stats.learned} label="Learned" />
              <Stat value={stats.learning} label="Learning" />
              <Stat value={stats.total} label="Total" />
            </div>
          </section>
        </div>
        <aside aria-labelledby="how-h" className="flex flex-col gap-3 border-t border-border pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <Heading level={2} id="how-h" className="text-body md:text-body">How it works</Heading>
          <ol className="flex flex-col gap-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-2">
                <Text as="span" size="small" weight="semibold" className="text-primary">{i + 1}</Text>
                <Text as="span" size="small" tone="muted">{s}</Text>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </AppShell>
  );
}
