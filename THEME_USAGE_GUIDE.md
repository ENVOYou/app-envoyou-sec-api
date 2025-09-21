# Theme & Hierarchy Usage Guide

Updated to reflect unified layering model (canvas → section → grid → grid-item → card) and deprecation path for `DepthCard`.

## 1. Objectives
- Instantly readable visual hierarchy (modern SaaS parity / exceed).
- Strict semantic tokens (no ad‑hoc HSL in components).
- Single structural border per tier cluster (avoid outline stacking).
- Opaque, confident surfaces (alpha only for effects / accents).
- Deterministic elevation + typography scale.

## 2. Layer Stack
| Order | Layer | Implementation | Notes |
|-------|-------|----------------|-------|
| 0 | Canvas | `<body>` (vignette pseudo) | Ambient depth only, no border |
| 1 | Section | `.surface-section` | Gradient + inset border + top highlight |
| 2 | Grid | Tailwind grid container | Uses spacing tokens `--space-grid-gap*` |
| 3 | Grid Item | `.grid-item` | Shadow isolation wrapper |
| 4 | Card | `<Card variant="base|raised|strong" />` | Variant defines tone + elevation + (only strong has border) |
| 5 | Inline Tile | `.action-tile` | Internal navigational blocks |

Legacy `DepthCard` maps to Card variants (see §9) and will be removed gradually.

## 3. Semantic Tokens
Light ladder (ΔL* ~3–6 per step):
- `--background` (canvas)
- `--surface` (base plain panel)
- `--surface-alt` (mid separation)
- `--surface-strong` (highest neutral tier)
- `--foreground`, `--muted(-foreground)` (text hierarchy)
- Interaction: `--primary`, `--accent`, `--destructive`, `--ring`, `--border-base`

Dark ladder widened: background → surface → surface-alt → (strong via variant). Do NOT introduce unregistered neutrals.

## 4. Card Variants
| Variant | Purpose | Visual Recipe |
|---------|---------|---------------|
| base | Default content module | Surface tone + small shadow (no border) |
| raised | Emphasis above base cluster | Alt tone + mid shadow (no border) |
| strong | High emphasis / anchor / summary | Strong tone + border + composite shadow + top gradient overlay |

Rules:
- Only one or few `strong` cards per viewport.
- Inside a `.surface-section` do not add custom borders to base/raised.
- Use `.hover-lift` selectively (interactive groups, not all cards).

## 5. Borders & Elevation Policy
| Layer | Border | Shadow Style |
|-------|--------|--------------|
| Canvas | None | None (vignette only) |
| Section | Inset 1px (via class) | Soft ambient + broad |
| Card base/raised | None | ElevationSm / ElevationMd |
| Card strong | 1px | Depth composite + overlay |
| Action tile | Hairline (1px) | No external shadow |

Avoid two physical borders adjacent. If an isolated card sits directly on canvas and needs framing, either wrap in section or upgrade to strong variant (not both).

## 6. Utilities
| Utility | Purpose |
|---------|---------|
| `.surface-section` | Intermediate elevated group container |
| `.grid-item` | Shadow isolation / flex column wrapper |
| `.cluster` | Vertical stack of multiple sections with governed spacing |
| `.hover-lift` | Optional interactive elevation (shadow + translate) |
| `.action-tile` | Inline nav/action row tile styling |
| Typography: `.ts-page-title`, `.ts-section-title`, `.ts-card-title`, `.ts-metric`, `.ts-label`, `.ts-body`, `.ts-meta` |

## 7. Spacing Tokens
| Token | Default | Usage |
|-------|---------|-------|
| `--space-section-pad` | 0.75rem | Section inner padding |
| `--space-card-pad` | 1.25rem | Card internal (apply via Tailwind) |
| `--space-grid-gap` | 1.5rem | Standard grid gap |
| `--space-grid-gap-lg` | 2rem | Large grid layouts |
| `--space-cluster-gap` | 2.25rem | Internal section gap in `.cluster` |
| `--space-cluster-stack` | 3.5rem | Gap between clusters |

## 8. Typography Scale
| Utility | Role |
|---------|-----|
| `.ts-page-title` | Page heading |
| `.ts-section-title` | Section header inside section wrapper |
| `.ts-card-title` | Card-level heading |
| `.ts-metric` | Numeric KPIs |
| `.ts-label` | Uppercase label / micro heading |
| `.ts-body` | Standard body text |
| `.ts-meta` | Secondary meta / footnote |

Apply these instead of ad-hoc `text-xl`, etc. for consistency.

## 9. DepthCard Migration
| DepthCard depth | New Mapping |
|-----------------|------------|
| sm | `Card variant="base"` |
| md | `Card variant="raised"` |
| lg / xl | `Card variant="strong"` |
| glow | `Card variant="strong"` + custom glow utility |

Migration steps: replace import, map props, move padding (if density), add accent effect with `.layered-surface` or custom pseudo if needed.

## 10. Active Navigation Style
- Active nav uses subtle horizontal gradient + inset dual ring + brand text color.
- Hover uses neutral accent fill + single inset border.
- Focus visible ring uses `--ring` color (never suppressed).

## 11. Visual Regression Strategy
| Snapshot | Coverage |
|----------|----------|
| design-system | Tokens, components, states |
| analytics | Multi-card, section grouping, tile actions |
| (future) settings/security | Form + strong card mix |

Add new snapshot when a new archetype (layout pattern) introduced; update baseline only on approved token/structure changes.

## 12. Implementation Checklist (New Feature)
- [ ] Determine grouping → wrap in `.surface-section` if multi-card or needs isolation.
- [ ] Use proper card variants (≤1–2 strong per view).
- [ ] Apply typography utilities.
- [ ] Avoid raw color; rely on semantic classes.
- [ ] Confirm no double borders.
- [ ] Test light & dark; run visual snapshots.

## 13. Anti‑Patterns & Fixes
| Anti-Pattern | Replace With |
|--------------|--------------|
| Base card with manual border inside section | Remove border (let section frame) |
| Multiple nested `.surface-section` | Single outer section + grid |
| Random HSL in component file | Add / reuse semantic token |
| Overusing strong variant for all panels | Mix base/raised/strong intentionally |
| DepthCard + Card mixture in same grid | Migrate DepthCard or isolate patterns |

## 14. Future Enhancements
- Auto lint: disallow new raw colors.
- Motion tokenization (durations / easings).
- Panel component abstraction for common header + section shell.
- High contrast mode variant tokens.

## 15. FAQ
**Q: Kapan pakai strong tanpa section?**
A: Hindari. Strong idealnya selalu di dalam section kecuali hero single-card layout (then add generous margin + vignette contrast).

**Q: Boleh gradient baru di card?**
A: Hanya lewat utility / wrapper; jangan embed di Card core.

---
Last updated: current iteration. Update this file on any new token / variant introduction.
