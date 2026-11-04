import { Select } from "@/design-system/phrasebook";
import { LANGUAGES } from "@/lib/languages";

type Props = { id: string; value: string; onChange: (v: string) => void; size?: "sm" | "md" | "lg"; "aria-label"?: string };

/** Language dropdown limited to the configured LANGUAGES list. */
export function LanguageInput({ id, value, onChange, size = "md", ...rest }: Props) {
  return (
    <Select id={id} value={value} size={size} onChange={(e) => onChange(e.target.value)} aria-label={rest["aria-label"]}>
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.name}
        </option>
      ))}
    </Select>
  );
}
