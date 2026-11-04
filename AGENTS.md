# Architecture rules

- All data access goes through `createServerFn` in `src/lib/phrases.functions.ts` with `requireSupabaseAuth` — RLS scopes every row to the signed-in user.
- Signed-in pages live under `src/routes/_authenticated/`; `/auth` is the only public page — the app has no public surface.
- Round selection runs in the `pick_round` SQL function (least-learned first, random) — keeps ordering logic in one place, no SRS.
- Speech is synthesized server-side via the ElevenLabs connector (ELEVENLABS_API_KEY, eleven_v3 with per-phrase language_code, one fixed server-side voice, direct api.elevenlabs.io call — no gateway) and cached per phrase+text+language+voice+model in the private `phrase-audio` bucket — each phrase is billed once; editing text clears the cache.
- One shared `AudioPlayerProvider` controls playback so only one phrase plays at a time; browser speechSynthesis is the fallback.
- UI uses only the Phrasebook design system in `src/design-system/phrasebook` and its semantic tokens — keeps every screen aligned with `_docs/DESIGN.md`.
- Theme choice is local-first via the header toggle only; Settings holds round size only, and profile data never overwrites the saved browser choice.
- Page navigation uses TanStack Router's native View Transition integration for fast, progressively enhanced transitions.
- `AppShell` owns route-level content width selection — workspace pages can expand without weakening narrow review and settings flows.
- Cached audio is deleted from storage when a phrase's text/language changes or the phrase is deleted; new audio is generated only on Play.
- Vite dev serving explicitly allows `/persist/node_modules` — TanStack Start's generated client entry resolves there in the hosted preview.
- Phrase entry lives on `/learn`; Home is round start + stats + guide — keeps Home focused on practice.
- Modals use the design-system `Dialog` (native <dialog>) — free focus trap, Escape and top-layer stacking.
- Selectable languages come only from `LANGUAGES` in `src/lib/languages.ts`; server still accepts any BCP-47 so old rows stay valid.
