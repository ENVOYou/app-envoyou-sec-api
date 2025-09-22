# Header Implementation Notes

This document summarizes the new header (app chrome) approach.

## Goals

- Clear separation from body without heavy solid border lines.
- Subtle depth that increases only after the user scrolls.
- Translucent, token-driven surface for consistency with design hierarchy.
- Accessible navigation: skip link & proper aria attributes.

## Key Elements

- Utility class `.app-chrome` defined in `src/app/globals.css`.
- Tokens introduced: `--surface-chrome`, `--surface-chrome-alpha`, `--surface-chrome-alpha-dark`, `--header-height`.
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
- Conditionally tighten background alpha when user scrolls more (dynamic alpha interpolation).
- Auto-hide behavior (slide up on scroll down, reveal on scroll up) if needed for dense data pages.

## Do / Avoid

Do:

- Use tokens when changing header colors.
- Keep shadow minimal until scroll state.

Avoid:

- Reintroducing `border-b` or heavy multi-layer shadows.
- Hardcoding color values directly in the component.
