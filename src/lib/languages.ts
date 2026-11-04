/**
 * Selectable phrase languages. Edit this list to change the dropdown options.
 * Codes are BCP-47; older phrases with other codes still display and play.
 */
export const LANGUAGES: ReadonlyArray<{ readonly code: string; readonly name: string }> = [
  { code: "en-US", name: "English" },
  { code: "de-DE", name: "German" },
  { code: "th-TH", name: "Thai" },
  { code: "ja-JP", name: "Japanese" },
  { code: "zh-CN", name: "Chinese" },
  { code: "ko-KR", name: "Korean" },
  { code: "id-ID", name: "Indonesian" },
  { code: "el-GR", name: "Greek" },
];

export const DEFAULT_LANGUAGE = "en-US";

/** BCP-47 -> ISO 639 primary subtag, as ElevenLabs expects (th-TH -> th). */
export function ttsLanguage(code: string): string {
  return code.split("-")[0]!.toLowerCase();
}

export const LANGUAGE_CODE_PATTERN = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

export function isSelectableLanguage(code: string): boolean {
  return LANGUAGES.some((l) => l.code === code);
}

export function languageName(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}
