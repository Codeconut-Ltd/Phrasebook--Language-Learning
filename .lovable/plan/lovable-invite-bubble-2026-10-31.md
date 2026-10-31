# Lovable invite bubble

## What
A small round floating link (heart icon, "Try Lovable with +10 credits") fixed bottom-right on every page, hidden below `sm`, visible tablet/desktop, always on top and clickable. Nothing else changes.

## Steps
1. Move the uploaded file to `src/components/LovableBubble.tsx` (shared UI component location).
2. Restyle to Phrasebook tokens instead of raw black/white/red:
   - `border-2 border-border-strong bg-background shadow-button` (design system: 2px control border + restrained shadow, adapts to light/dark).
   - Icon `fill-danger` (semantic red, theme-aware).
   - Focus: rely on the global `:focus-visible` accent ring.
   - Hover: subtle `hover:-translate-y-px` / pressed `active:translate-y-px`, 150ms (DESIGN.md motion), respecting reduced motion via existing global rule.
   - Remove conflicting `relative -left-px -bottom-0.5` classes, which override `fixed` and break placement.
   - Keep `fixed bottom-4 right-4 hidden sm:flex pointer-events-auto` and the max z-index.
3. Render once in `src/routes/__root.tsx` `RootComponent`, after `<Outlet />`, so it appears on all pages (incl. `/auth`).
4. Verify with Playwright: visible at 1280px, hidden at 390px, sits above the Settings overlay and review bottom bar, light + dark contrast.

## Technical notes
- External link keeps `target="_blank" rel="noopener noreferrer"` and accessible name.
- If the fixed completion bar on Review overlaps it, bubble stays on top (by request); bottom offset unchanged.
