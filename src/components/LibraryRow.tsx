import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Badge, Button, Input, TableCell, TableRow, Text } from "@/design-system/phrasebook";
import { deletePhrase, updatePhrase, type Phrase } from "@/lib/phrases.functions";
import { useAutosave } from "@/hooks/useAutosave";
import { PlayButton } from "./PlayButton";

export function LibraryRow({ phrase }: { phrase: Phrase }) {
  const qc = useQueryClient();
  const save = useServerFn(updatePhrase);
  const remove = useServerFn(deletePhrase);
  const [text, setText] = useState(phrase.text);
  const [translation, setTranslation] = useState(phrase.translation ?? "");
  const [status, setStatus] = useState(phrase.status);
  const s1 = useAutosave(text, (v) => (v.trim() ? save({ data: { id: phrase.id, text: v } }) : Promise.reject()));
  const s2 = useAutosave(translation, (v) => save({ data: { id: phrase.id, translation: v || null } }));
  const failed = s1 === "error" || s2 === "error";

  async function toggleStatus() {
    const next = status === "learned" ? "learning" : "learned";
    setStatus(next);
    await save({ data: { id: phrase.id, status: next } });
    qc.invalidateQueries({ queryKey: ["stats"] });
  }

  async function onDelete() {
    if (!window.confirm("Delete this phrase?")) return;
    await remove({ data: { id: phrase.id } });
    qc.invalidateQueries({ queryKey: ["library"] });
    qc.invalidateQueries({ queryKey: ["stats"] });
  }

  return (
    <TableRow>
      <TableCell>
        <PlayButton size="sm" phrase={{ id: phrase.id, text, language_code: phrase.language_code }} />
      </TableCell>
      <TableCell>
        <Input aria-label="Phrase text" lang={phrase.language_code} value={text} invalid={!text.trim()} onChange={(e) => setText(e.target.value)} onBlur={() => setText((v) => v.trim())} />
      </TableCell>
      <TableCell>
        <Input aria-label="Translation" value={translation} placeholder="—" onChange={(e) => setTranslation(e.target.value)} onBlur={() => setTranslation((v) => v.trim())} />
      </TableCell>
      <TableCell><Badge variant="outline" className="whitespace-nowrap">{phrase.language_code}</Badge></TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" onClick={toggleStatus} aria-label={`Status ${status}, toggle`}>
          <Badge variant={status === "learned" ? "success" : "warning"}>{status === "learned" ? "Learned" : "Learning"}</Badge>
        </Button>
      </TableCell>
      <TableCell>
        <Text as="span" size="small" tone="muted">{phrase.times_correct}/{phrase.times_reviewed}</Text>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onDelete}>Delete</Button>
          {failed ? <Text as="span" size="small" tone="accent">Save failed</Text> : null}
        </div>
      </TableCell>
    </TableRow>
  );
}
