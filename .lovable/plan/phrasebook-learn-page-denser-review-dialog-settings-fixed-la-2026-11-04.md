# Phrasebook: Learn page, denser review, dialog settings, fixed language list

## Build now

1. **Trim on blur**: every text field (new phrase, translation, review edits, library inline edits, settings) trims leading/trailing spaces on blur, then saves the trimmed value. The server keeps trimming as a safety net.
2. **Fixed language list**: replace the free-typing language field with a real dropdown showing only names: English, German, Thai, Japanese, Chinese, Korean, Indonesian, Greek. The list lives in one config constant (`src/lib/languages.ts`), so you can edit it there. Older phrases in other languages still show and play correctly. The library language filter uses the same list.
3. **Settings as a dialog**: Settings opens as a centered dialog (about 28rem wide) over a dimmed page. It closes with Escape, Close, or a click outside, and focus returns to the gear button. Saving keeps the dialog open and shows "Settings saved."
4. **App background**: a soft green gradient across signed-in pages, built from theme colors in light and dark mode. Note: there is no gradient loading screen in the app today, so this is a new subtle top-to-bottom green tint. `_docs/DESIGN.md` currently says "no gradients"; it will be updated to allow this one background gradient.
5. **New header navigation**: Home, Learn, Library.
   - **Learn (`/learn`)**: the full "What do you want to learn?" entry form moves here unchanged (Enter submits, Shift+Enter makes a new line, remembers the last language).
   - **Home (`/`)**, split layout: left side has **Start round** first (round size + button), then stats (Learned / Learning / Total). Right side has a short "How it works" guide in small text (1 Add phrases in Learn, 2 Start a round and listen, 3 Mark Memorized / Not yet, 4 Manage everything in Library). On mobile the sections stack in that same order. If there are no phrases yet, Home links to Learn.
6. **Denser review cards**: compact rows like the library. Left column: number, language, Play, then the editable text with the translation toggle below it. Right column: **Memorized** / **Not yet** stacked. On phones they move under the text. The colors for each answer state and the fixed "Next round" bar stay as they are.

## Concept only (nothing built yet)

- **Transliteration (Thai → Latin letters)**: options are (a) an AI model generating romanization once per phrase and saving it with the phrase, or (b) a rule-based library, which is weak for Thai because Thai spelling doesn't map cleanly to sound. Recommend (a): generate on demand, cache it like audio, clear it when the text changes, and show it only on review cards for Thai.
- **Phrasebook wordmark in brand green**: the text-only wordmark uses the main green token, with contrast checked in both themes. Small change; can join the build if you want.
- **Hover and focus states**: audit every link, button, row, and tab for hover, visible keyboard focus, pressed, and disabled states in both themes. Recommend doing this together with the build above.
- **ElevenLabs voice tuning**: possible before each request:
  - Speed setting (about 0.7–1.2) for slower learner playback, e.g. a "Slow" play button next to Play.
  - Steadiness and style settings for a calmer or more expressive voice.
  - eleven_v3 tone tags written into the text, like `[questioning]`, `[excited]`, `[whispers]`, `[laughs]`, for emotion and emphasis.
  - Voice choice: one fixed voice today. Could become a small list (e.g. a male and a female voice).
  - Each different version (speed, tone, voice) is generated and charged once, then cached separately. A sensible start is Normal + Slow only.

## Technical notes

- New route `src/routes/_authenticated/learn.tsx` with its own head() metadata, excluded from the sitemap. Add `/learn` to the `NAV` list in AppShell.
- Dialog: add a `Dialog` to `src/design-system/phrasebook` using native `<dialog>` with `showModal()` (built-in focus trap and Escape), plus a semantic backdrop token. SettingsPanel renders inside it, and the header overlay code is removed.
- `LanguageInput` becomes a `Select`. `LANGUAGES` is trimmed to the 8 entries (en-US, de-DE, th-TH, ja-JP, zh-CN, ko-KR, id-ID, el-GR). `languageName` falls back to the code for older values. Server validation stays BCP-47 so existing rows remain valid.
- A small `useTrimOnBlur` helper, or `onBlur` handlers that set the trimmed value. `useAutosave` already saves when the value changes.
- Background: a `--gradient-app` token in styles.css for light and dark, applied in AppShell's root wrapper.
- No database changes. Update AGENTS.md for the Learn route split and the dialog rule.
- Verify with Playwright at 1280 and 390, both themes: dialog focus and Escape, trimming, the dropdown, review layout, and that the Next round bar doesn't cover cards.

## Faster replay of saved audio (plan only)

Why it's slow today: every Play makes a fresh server call (sign-in check, phrase lookup, new download link). Then the browser downloads the whole MP3 (128 kbps) before it starts playing. Nothing is kept between plays.

Fixes, highest gain first:
1. **Keep played audio in the browser** for the session, so replays start almost instantly. The kept copy is cleared when the phrase text or language changes.
2. **Preload the round**: when a review round or library page opens, get the download links for all phrases with saved audio in one request, then quietly preload the first few. Nothing new is generated, so ElevenLabs costs don't go up.
3. **Reuse download links** while they're still valid, instead of asking for a new one on every Play.
4. **Smaller files**: new audio uses a lower-quality setting tuned for speech, about half the size. Existing files keep working.
5. **Start playing sooner**: begin as soon as enough of the file has arrived.

Expected: a saved phrase should start in roughly 0.2–0.4 s on first play instead of 1–2 s, and replays should be near-instant. These are estimates until measured.

Technical: a new `getAudioUrls({ ids })` server function signs links in one batch (`createSignedUrls`), only for rows with `audio_path` and with RLS applied. `AudioPlayerProvider` keeps a Map of id+text+language to `{ url, expires, audio element }` and preloads with `preload="auto"`. Switch `output_format` from `mp3_44100_128` to `mp3_44100_64` (pick by listening test). Set `cacheControl` on upload so the browser caches the files.
