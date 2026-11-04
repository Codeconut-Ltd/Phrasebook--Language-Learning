import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Badge, Button, Card, Text, Textarea } from "@/design-system/phrasebook";
import { updatePhrase, type Phrase } from "@/lib/phrases.functions";
import { languageName } from "@/lib/languages";
import { useAutosave, type SaveState } from "@/hooks/useAutosave";
import { PlayButton } from "./PlayButton";

const SAVE_LABEL: Record<SaveState, string> = { idle: "", saving: "Saving…", saved: "Saved", error: "Save failed" };

type Props = {
  phrase: Phrase;
  index: number;
  result: boolean | undefined;
  onResult: (memorized: boolean) => void;
};

export function ReviewCard({ phrase, index, result, onResult }: Props) {
  const save = useServerFn(updatePhrase);
  const [text, setText] = useState(phrase.text);
  const [translation, setTranslation] = useState(phrase.translation ?? "");
  const [showTr, setShowTr] = useState(false);
  const textState = useAutosave(text, (v) => (v.trim() ? save({ data: { id: phrase.id, text: v } }) : Promise.reject()));
  const trState = useAutosave(translation, (v) => save({ data: { id: phrase.id, translation: v || null } }));
  const state = textState === "idle" ? trState : textState;
  const cardVariant = result === true ? "filled" : result === false ? "warning" : "outlined";

  return (
    <Card variant={cardVariant} padding="sm" className="grid gap-3 transition-[background-color,border-color] duration-150 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-5">
      <div className="flex min-w-0 gap-3">
        <PlayButton size="sm" phrase={{ id: phrase.id, text, language_code: phrase.language_code }} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Text as="span" size="small" tone="muted">{index + 1}</Text>
            <Badge variant="outline">{languageName(phrase.language_code)}</Badge>
            {result === true ? <Badge variant="success">Memorized</Badge> : null}
            {result === false ? <Badge variant="warning">Not yet</Badge> : null}
            <Text as="span" size="small" tone="muted" aria-live="polite" className="ml-auto">{SAVE_LABEL[state]}</Text>
          </div>
          <Textarea
            aria-label="Phrase text"
            lang={phrase.language_code}
            rows={1}
            value={text}
            invalid={!text.trim()}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setText((v) => v.trim())}
            className="py-2 text-lead"
          />
          {showTr ? (
            <Textarea
              aria-label="Translation"
              rows={1}
              placeholder="Add a translation (optional)"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              onBlur={() => setTranslation((v) => v.trim())}
              className="py-2 text-small"
            />
          ) : (
            <Button variant="ghost" size="sm" className="self-start" onClick={() => setShowTr(true)}>
              {translation ? "Show translation" : "Add translation"}
            </Button>
          )}
        </div>
      </div>
      <div className="flex gap-2 sm:flex-col sm:justify-center">
        <Button size="sm" className="flex-1" variant={result === true ? "primary" : "outline"} onClick={() => onResult(true)}>Memorized</Button>
        <Button size="sm" className="flex-1" variant={result === false ? "warning" : "outline"} onClick={() => onResult(false)}>Not yet</Button>
      </div>
    </Card>
  );
}
