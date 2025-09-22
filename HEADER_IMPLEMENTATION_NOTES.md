# Header Implementation Notes

This document summarizes the header (app chrome) approach. (Updated: now using solid surface instead of translucent blur.)

## Goals

- Clear separation from body without heavy solid border lines.
- Subtle depth that increases only after the user scrolls.
- Solid, token-driven surface (`--surface-chrome`) for consistency with design hierarchy and visual stability.
- Accessible navigation: skip link & proper aria attributes.

## Key Elements

- Utility class `.app-chrome` defined in `src/app/globals.css`.
- Tokens introduced: `--surface-chrome`, `--header-height`.
- Scroll elevation handled by `useScrollElevation` hook (threshold 8px) and `data-scrolled` attribute.
- Hairline separation uses `:after` gradient instead of `border-b`.

## Layout Offsets

Because the header is `position: fixed`, main content requires a top padding to avoid being overlapped.
Current padding: `pt-20` on `<main id="main-content" />` inside `dashboard/layout.tsx` giving comfortable breathing room beyond the 64px header height.

## Accessibility

- Skip link: `<a class="skip-link" href="#main-content">` added before header.
- User menu button uses `aria-haspopup="menu"` and focus ring utility.
- Buttons have `aria-label` (e.g. Notifications).

## Future Enhancements

- Global loading/progress bar (2px top strip) inside `.app-chrome`.
- (Removed: dynamic alpha interpolation — replaced by purely solid style.)
- Auto-hide behavior (slide up on scroll down, reveal on scroll up) if needed for dense data pages.

## Palette (Current)

Light:

- `--surface-chrome: 210 16% 95.5%` (between surface-alt 96.5% and strong 94.5%)

Dark:

- `--surface-chrome: 222 12% 12.5%` (above background 3.9%, near alt 10%, below main surface 15.9%)

Rationale: Thin delta ensures header doesn’t overweight visual hierarchy while still separating in grayscale.

## Interactive States (Chrome Navigation)

- Base class: `.chrome-nav-item` (muted foreground, subtle tonal hover)
- Hover: background uses foreground low-alpha to avoid competing with primary accents.
- Active: gradient with primary tint + inset dual hairline shadow for tactile feel.
- Works in both header and sidebar if reused.

## Contrast Verification

Approximate relative luminance and contrast (manual quick check):

- Light mode foreground (#0d1114 approx) on chrome (≈#f1f4f6 equivalent) > 8:1 (passes AA/AAA body text).
- Muted foreground on chrome still > 4.5:1 (meets normal text AA); monitor with future design token adjustments.
- Dark mode: foreground near #fafafa vs chrome ~#1d2022 contrast > 7:1; muted vs chrome > 4.5:1.

Recommendation: If future tweaks reduce lightness gap, re-run automated contrast script before merging.

## Elevation & Overlays

- Dropdown/menus over header should use `background: hsl(var(--surface))` or `--surface-strong` plus shadow token to maintain clarity.
- Avoid using `--surface-chrome` for popovers; keep it exclusive to structural chrome.

## Testing Plan

- Add visual snapshots (Playwright) for header (light/dark) route `/dashboard` waiting for hydration to complete.
- Add lint guard (implemented: `lint:chrome-tokens`) to prevent reintroduction of legacy alpha tokens.
- Optional: grayscale screenshot (CI artifact) to verify tonal separation.

## Do / Avoid

Do:

- Use tokens when changing header colors.
- Keep shadow minimal until scroll state.

Avoid:

- Reintroducing `border-b` or heavy multi-layer shadows.
- Hardcoding color values directly in the component.
