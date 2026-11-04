import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button, Field, Heading, Input, Text, Textarea } from "@/design-system/phrasebook";
import { AppShell } from "@/components/AppShell";
import { LanguageInput } from "@/components/LanguageInput";
import { addPhrase } from "@/lib/phrases.functions";
import { DEFAULT_LANGUAGE, isSelectableLanguage } from "@/lib/languages";

const LAST_LANG_KEY = "phrasebook:last-language";

export const Route = createFileRoute("/_authenticated/learn")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Learn — Phrasebook" },
      { name: "description", content: "Add new phrases to your private phrasebook." },
      { property: "og:title", content: "Learn — Phrasebook" },
      { property: "og:description", content: "Add new phrases to your private phrasebook." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Learn,
});

function Learn() {
  const qc = useQueryClient();
  const add = useServerFn(addPhrase);
  const [text, setText] = useState("");
  const [lang, setLang] = useState(DEFAULT_LANGUAGE);
  const [translation, setTranslation] = useState("");
  useEffect(() => {
    const saved = window.localStorage.getItem(LAST_LANG_KEY);
    if (saved && isSelectableLanguage(saved)) setLang(saved);
  }, []);

  const mutation = useMutation({
    mutationFn: () => add({ data: { text: text.trim(), language_code: lang, translation: translation.trim() || null } }),
    onSuccess: () => {
      window.localStorage.setItem(LAST_LANG_KEY, lang);
      setText("");
      setTranslation("");
      qc.invalidateQueries({ queryKey: ["stats"] });
      qc.invalidateQueries({ queryKey: ["library"] });
    },
  });
  const canAdd = text.trim().length > 0 && !mutation.isPending;

  return (
    <AppShell width="content">
      <section aria-labelledby="add-h" className="flex flex-col gap-4">
        <Text size="small" tone="muted" weight="semibold">NEW PHRASE</Text>
        <Heading level={1} id="add-h">What do you want to learn?</Heading>
        <Text tone="muted">Add a phrase, then practise it by listening and recalling.</Text>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canAdd) mutation.mutate();
          }}
          className="flex flex-col gap-4"
        >
          <Textarea
            aria-label="New phrase"
            placeholder="Type a phrase…"
            rows={3}
            lang={lang}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setText((v) => v.trim())}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canAdd) mutation.mutate();
              }
            }}
            className="text-h3"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field htmlFor="new-lang" label="Language">
              <LanguageInput id="new-lang" value={lang} onChange={setLang} />
            </Field>
            <Field htmlFor="new-tr" label="Translation (optional)" className="sm:col-span-2">
              <Input id="new-tr" value={translation} onChange={(e) => setTranslation(e.target.value)} onBlur={() => setTranslation((v) => v.trim())} />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!canAdd} loading={mutation.isPending}>Add phrase</Button>
            {mutation.isError ? <Text size="small" tone="accent">Could not add phrase.</Text> : null}
            {mutation.isSuccess && !text ? <Text size="small" tone="muted" aria-live="polite">Added.</Text> : null}
          </div>
        </form>
      </section>
    </AppShell>
  );
}
