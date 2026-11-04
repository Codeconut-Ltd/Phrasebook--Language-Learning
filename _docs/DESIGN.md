# Phrasebook Design System

## Direction
Phrasebook is a friendly audio-learning workspace: calm enough for repeated study, playful enough to make progress feel rewarding. Use tactile controls, crisp borders, open space, and direct language. Never copy another learning brand’s logo, mascot, proprietary typeface, illustrations, or exact visual identity.

## Principles
- **Learning first:** phrase entry, listening, and manual recall decisions dominate each screen.
- **Friendly, not childish:** rounded geometry and confident color; no mascots, confetti, streaks, XP, or gamification.
- **Flat and tactile:** clear 2px control borders and subtle pressed states. Avoid gradients (except the one subtle green app-background wash), glass, glows, and floating decoration.
- **Quiet canvas:** neutral surfaces let phrase content and progress actions lead.
- **Private workspace:** screens feel focused and trustworthy, not like a marketing site.

## Semantic colors
Implement colors only through the semantic tokens in `src/styles.css`.

| Role | Light | Dark | Use |
|---|---|---|---|
| Background | near-white | deep neutral | Page canvas |
| Surface | cool quiet neutral | lifted neutral | Grouped controls, table heads |
| Foreground | charcoal | soft white | Primary copy |
| Muted | medium gray | light gray | Supporting copy |
| Primary | deep leaf green | bright leaf green | Main actions, learned state |
| Secondary | pale leaf | dark green | Calm alternatives |
| Accent | strong sky blue | light sky blue | Playback, links, focus |
| Warning | ochre | warm gold | Learning / Not yet |
| Danger | red | light red | Errors and destructive actions |

Color never communicates status alone. Pair it with text or an icon. All body text must meet 4.5:1; large text 3:1; focus and control boundaries 3:1.

## Typography
- Family: Nunito Sans with system and language-specific fallbacks.
- Headings: same family at 800 weight. No serif and no proprietary display face.
- Body: 400–600 weight; labels and buttons 700–800.
- Letter spacing stays normal.
- Phrase text may be large, but must preserve the user’s script and language metadata.
- Type steps: small 13px, body 16px, lead 19px, h3 24px, h2 30px, h1 38px desktop / 32px compact.

## Shape, spacing, and elevation
- Base spacing: 4px; common gaps: 8, 12, 16, 24, 32, 48.
- Controls and badges: 10–12px radius.
- Cards: 16px radius. Cards only for bounded objects such as a phrase, sign-in form, or empty state.
- Borders: 2px for interactive controls; 1px for structural separators.
- Shadows: restrained, neutral, and paired with borders. Buttons may move down 1px when pressed.
- Content widths: narrow 768px, content 1152px, wide 1280px.

## Components
### Buttons
- Primary: green fill, contrasting text, visible darker bottom edge.
- Accent: blue fill for playback and forward review actions.
- Secondary: quiet tinted fill with dark/light semantic text.
- Outline: canvas fill, strong border.
- Ghost: no permanent container; visible tinted background on hover.
- Minimum height 40px; icon-only controls remain square with an accessible name.
- Disabled state stays legible and visibly inactive; never hide text with opacity.

### Fields
- Labels always visible. Required, hint, and error text remain adjacent.
- Inputs use 2px boundaries and a clear accent focus ring.
- Text areas can grow vertically but never resize surrounding fixed controls unexpectedly.
- Native selects stay native and keyboard accessible.

### Phrase cards
- Phrase text and Play are the strongest elements.
- Language and save state remain compact.
- Memorized uses green plus explicit text; Not yet uses warning plus explicit text.
- Answer controls remain stable before and after selection.

### Tables
- Use for the library only. Keep density practical and rows readable.
- Sticky behavior is optional; horizontal scrolling is required on narrow screens.
- Language and status badges never wrap.
- Editable controls maintain a useful minimum width.

### Navigation and settings
- Phrasebook wordmark is text only.
- Active navigation uses color and a visible underline or filled state.
- Theme, settings, and sign-out remain compact but discoverable.
- Settings is an unframed section separated from page content.

### Authentication
- Social providers appear before email/password, each as a full-width action.
- Do not imitate provider branding beyond provider name; preserve clear hierarchy and focus states.
- Keep the panel compact, trustworthy, and centered.

## Motion
Use 120–180ms transitions for color, border, and small position changes. Native view transitions handle page navigation. Respect `prefers-reduced-motion`; no essential meaning depends on animation.

## Responsive rules
- Mobile-first. Stack fields and actions in reading order.
- Keep primary actions near their inputs.
- Fixed completion controls must leave content clearance and never cover the last phrase.
- Long translations, language codes, and multilingual phrase text must not overlap controls.
- Library remains horizontally scrollable rather than crushing columns.

## Light and dark themes
Both themes are first-class. Preserve the user’s saved choice across routes and reloads. Dark mode uses lifted neutral surfaces, brighter semantic accents, and the same hierarchy—not inverted light-mode values by guesswork.

## Prohibited
No gradients beyond the app-background wash, decorative blobs, mascot art, borrowed brand green/blue values, serif headings, arbitrary palette classes, raw colors in route components, nested cards, excessive pills, low-contrast disabled states, or logo imagery.

## Review checklist
1. Use Phrasebook components and semantic tokens only.
2. Check light and dark themes.
3. Check keyboard, focus, labels, headings, and live regions.
4. Check contrast for normal, hover, disabled, selected, success, warning, and danger states.
5. Check 390px mobile and 1280px desktop layouts.
6. Check long multilingual text and non-wrapping compact labels.
7. Preserve product behavior: no SRS, gamification, auto-translation, public sharing, or automatic audio generation.
