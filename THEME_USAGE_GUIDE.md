# Theme Usage Guide

This guide explains how to use the Envoyou dashboard's semantic theme tokens, component hierarchy tools (Card, ElevatedCard, DepthCard), utilities, and visual patterns to ensure a consistent, accessible, and modern interface.

## 1. Core Principles

1. **Semantic over literal**: Always reference semantic CSS variables / Tailwind tokens (`bg-background`, `text-foreground`, `border-borderBase`, `bg-primary`) rather than hardcoded color values.
2. **Layered hierarchy**: Depth and visual emphasis scale with component importance (surface → Card → ElevatedCard → DepthCard tiers).
3. **Subtle motion & light**: Use hover elevation and radial accents sparingly for interactive elements or primary KPIs.
4. **Contrast + readability first**: Decorative gradients/patterns must never reduce text contrast below AA levels.
5. **Composable utilities**: Patterns, gradients, and overlays are additive wrappers—avoid baking them directly into core components unless part of their identity.

## 2. Semantic Tokens (HSL)
Defined in `globals.css` and mapped in Tailwind:

| Token | Purpose | Example Usage |
|-------|---------|---------------|
| `--background` / `bg-background` | Base page canvas | `<body>` background, full-width wrappers |
| `--surface` / `bg-surface` | Standard component base | Cards, panels, inputs |
| `--surface-strong` | Higher contrast surface | Modals, dropdown menus |
| `--foreground` | Primary text color | Body text |
| `--muted` + `--muted-foreground` (via Tailwind) | Subtle UI chrome & secondary text | Meta labels, separators |
| `--primary` | Brand accent & key CTAs | Buttons, active states |
| `--accent` | Secondary accent | Secondary stats, mild highlights |
| `--destructive` | Destructive actions/errors | Danger buttons, alerts |
| `--border-base` | Neutral border/ring color | Borders, focus rings |
| `--ring` | Focus outline hue | Accessible focus indicators |

Never introduce new raw color literals. Use existing semantic tokens or propose an extension first.

## 3. Component Hierarchy

| Level | Component | Typical Use | Visual Traits |
|-------|-----------|-------------|---------------|
| Base Surface | (no wrapper) or simple `div` | Layout sections, flex/grid containers | No elevation, transparent or `bg-background` |
| Card | `Card` | Standard informational groups | Subtle border, minimal or no shadow |
| ElevatedCard | `ElevatedCard` | Featured panels requiring mild emphasis | Slight elevation + radial soft light |
| DepthCard (sm) | `DepthCard depth="sm"` | Low-priority stat tiles, compact arrays | Light shadow, compact padding option |
| DepthCard (md) | `DepthCard depth="md"` | Standard KPI metric blocks | Medium composite shadow |
| DepthCard (lg)` + accent | High-value primary KPI / hero stat | Stronger depth, optional gradient/radial accent |
| DepthCard (xl/glow) | Reserved (sparingly) | Marketing hero, highlight moment | Deep multi-layer shadow, optional glow |

### When to Choose Which
- Use **Card** for neutral content containers (lists, forms, settings groups).
- Use **ElevatedCard** for sections you want to gently lift (summary overviews, comparative panels) without competing with KPIs.
- Use **DepthCard** for hierarchy-critical or dashboard metric elements, especially when depth communicates importance.
- Avoid more than one `glow` or `xl` DepthCard per view unless a deliberate hero composition is designed.

### Do / Don't
- ✅ Combine `DepthCard` + pattern utility (e.g. `dot-grid-faint`) inside for ambient texture.
- ✅ Use `accent="primary"` only on top-tier metric or hero card.
- ❌ Stack more than two consecutive high-depth (`lg` or above) cards without breathing space.
- ❌ Mix different accent radials in a tight cluster (visual noise risk).

## 4. DepthCard Props
```
<DepthCard
  depth="sm|md|lg|xl|glow"
  accent="none|primary|accent"
  interactive={true|false}
  glow={false|true}
  density="base|compact"
  className="..."
>
  ...content
</DepthCard>
```

| Prop | Guidance |
|------|----------|
| `depth` | Choose smallest that communicates needed emphasis. `lg` only for primary KPI tier. |
| `accent` | `primary` for main stat; `accent` for secondary highlight. Avoid both in same row repetitively. |
| `interactive` | Disable for purely informational aggregates to reduce motion. |
| `glow` | Rare; marketing or celebratory state only (e.g., plan upgrade success). |
| `density` | Use `compact` for 2–4 line stat tiles; `base` for richer content. |

## 5. Utility & Pattern Layer
Utilities defined under `@layer utilities` in `globals.css`:

| Utility | Purpose | Example |
|---------|---------|---------|
| `surface-gradient` | Subtle multi-stop backdrop for grouping KPI cluster | Wrap grid of DepthCards |
| `dot-grid-faint` | Very low-contrast texture overlay | Inside progress bars or large empty metrics |
| `dot-grid-soft` | Slightly stronger variant | Hero metric backgrounds (limit usage) |
| `layered-surface` | Dual-layer subtle inner lighting | Applied automatically when `accent="primary"` on DepthCard |
| `glass-layer` | Adds glassy transparency effect | Use cautiously on overlapping panels |

Composition pattern:
```
<div class="surface-gradient rounded-3xl p-2">
  <div class="grid gap-4 md:grid-cols-4">
    <DepthCard depth="lg" accent="primary" />
    <DepthCard depth="md" />
    <DepthCard depth="md" />
    <DepthCard depth="sm" />
  </div>
</div>
```

## 6. Progress Indicators
Use semantic structure + gradient fill:
```
<div class="relative h-2 w-full rounded-full bg-muted/70 overflow-hidden">
  <div class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 via-primary to-primary/60" style={{ width: pct + '%' }} />
  <div class="absolute inset-0 dot-grid-faint opacity-30 pointer-events-none" />
</div>
```
Avoid harsh solid bars unless conveying alert state.

## 7. Accessibility & Contrast
- Minimum contrast: Body text ≥ 4.5:1, small meta text ≥ 3:1 (verify with tooling if adjusting tokens).
- Radial accents must *not* overlap high-importance text without ensuring contrast (keep overlays <= 0.25 opacity effective).
- Focus rings: rely on `ring` token; never remove focus outline on interactive elements.
- Motion reduction: Respect `prefers-reduced-motion`; keep transitions opacity/transform only and short.

## 8. Extending the System
1. Propose new semantic token with rationale (what semantic gap?).
2. Add CSS variable + Tailwind mapping (no direct hex usage in components).
3. Update guide + color guard allowlist only if structurally justified.
4. Provide before/after use case screenshot in PR description.

## 9. Anti-Patterns
| Anti-Pattern | Fix |
|--------------|-----|
| Hardcoded `#` / `rgb()` / `hsl()` in component | Replace with semantic class (e.g. `text-muted-foreground`) |
| Overusing `glow` variant | Restrict to one hero or stateful celebration |
| Nesting multiple `surface-gradient` wrappers | Collapse to a single outer wrapper |
| Mixed depth levels with no visual spacing | Add `gap-*`, or normalize depths |

## 10. Migration Checklist (For New Views)
- [ ] Use page-level base container with `p-6` (or responsive spacing).
- [ ] Group KPIs inside a single `surface-gradient` frame if emphasis needed.
- [ ] Assign depth tiers intentionally (1 primary, ≤2 secondary, rest low emphasis).
- [ ] Confirm no raw colors in diff (color guard passes).
- [ ] Validate dark mode readability (esp. muted text and progress fills).
- [ ] Test keyboard navigation + focus visibility.

## 11. Example: KPI Cluster Layout
```
<section class="surface-gradient rounded-3xl p-2">
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <DepthCard depth="lg" accent="primary" density="compact">...</DepthCard>
    <DepthCard depth="md" density="compact">...</DepthCard>
    <DepthCard depth="md" density="compact">...</DepthCard>
    <DepthCard depth="sm" density="compact">...</DepthCard>
  </div>
</section>
```

## 12. Review & Governance
During PR review:
- Confirm semantic token usage only.
- Verify depth usage rationale (comment if unclear).
- Check that accent usage is not duplicated redundantly.
- Run local: `pnpm run color-guard` (if script available) + build.

## 13. Future Enhancements (Roadmap Candidates)
- Visual regression snapshots for theme tokens.
- Adaptive token tuning for high-contrast mode.
- Ambient soft animation for primary KPI entrance.
- Theming playground story with live token adjustment.

---
Maintainers: Update this guide when introducing new tokens, utilities, or component tiers. Consistency is leverage—treat the design system as product infrastructure.
