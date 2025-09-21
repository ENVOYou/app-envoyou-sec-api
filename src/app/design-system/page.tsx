import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DepthCard } from '@/components/ui/depth-card'

export const metadata = {
  title: 'Design System — Envoyou',
  description: 'Theme tokens, components, and depth hierarchy showcase.'
}

type DepthLevel = 'sm' | 'md' | 'lg' | 'xl' | 'glow'
type AccentLevel = 'primary' | 'accent' | 'none'
interface Metric {
  label: string
  value: string
  sub: string
  depth: DepthLevel
  accent: AccentLevel
}

const sampleMetrics: Metric[] = [
  { label: 'Primary KPI', value: '12.4k', sub: 'Requests', depth: 'lg', accent: 'primary' },
  { label: 'Secondary', value: '318', sub: 'Active Keys', depth: 'md', accent: 'none' },
  { label: 'Support', value: '92%', sub: 'Uptime', depth: 'md', accent: 'accent' },
  { label: 'Minor', value: '3', sub: 'Sessions', depth: 'sm', accent: 'none' }
]

export default function DesignSystemPage() {
  return (
    <main data-testid="design-system-root" className="p-8 space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          This page demonstrates the semantic theme tokens, component depth hierarchy, and composable utilities available in the Envoyou dashboard.
          Use it as a living reference when building new UI.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Color Tokens</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            { name: 'background' },
            { name: 'surface' },
            { name: 'surface-strong' },
            { name: 'foreground' },
            { name: 'muted' },
            { name: 'primary' },
            { name: 'accent' },
            { name: 'destructive' },
            { name: 'border-base' },
            { name: 'ring' }
          ].map(t => (
            <div key={t.name} className="flex flex-col rounded-xl overflow-hidden border border-borderBase/50">
              <div className={`h-20 w-full bg-${t.name.replace(/-/g, '')} relative flex items-center justify-center text-xs`}> 
                <span className="backdrop-blur-sm bg-background/40 px-2 py-1 rounded-md border text-foreground/80">
                  {t.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">All colors reference CSS variables defined in <code>globals.css</code>. Do not hardcode literals.</p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Component Hierarchy</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
              <CardDescription>Baseline container for neutral content.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Use for generic groupings (forms, lists). Low emphasis.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ElevatedCard</CardTitle>
              <CardDescription>Mild elevation to feature a section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Great for summary overviews that should not overpower KPIs.</p>
              <p className="text-xs text-muted-foreground">(Example usage shown elsewhere in app.)</p>
            </CardContent>
          </Card>

          <DepthCard depth="md" density="base" accent="none" className="">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">DepthCard (md)</h3>
              <p className="text-sm text-muted-foreground">Escalated emphasis for metrics or focus panels.</p>
            </div>
          </DepthCard>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Depth Metrics Example</h2>
        <div className="surface-gradient rounded-3xl p-3">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sampleMetrics.map(m => (
              <DepthCard key={m.label} depth={m.depth} accent={m.accent} density="compact" className="group">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground">{m.label}</span>
                </div>
                <div className="text-2xl font-semibold leading-tight">{m.value}</div>
                <p className="text-[11px] mt-1 text-muted-foreground">{m.sub}</p>
              </DepthCard>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Progress Pattern</h2>
        <div className="space-y-4">
          <div className="w-full max-w-md">
            <div className="relative h-2 w-full rounded-full bg-muted/70 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 via-primary to-primary/60" style={{ width: '62%' }} />
              <div className="absolute inset-0 dot-grid-faint opacity-30 pointer-events-none" />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              <span>0</span><span>1000</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground max-w-md">Use gradient + faint dot grid for a refined bar. Avoid harsh solid blocks unless alerting state.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Utilities & Patterns</h2>
        <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
          <li><code>surface-gradient</code> – Wrap KPI clusters for subtle framing.</li>
          <li><code>dot-grid-faint</code>/<code>dot-grid-soft</code> – Low-noise texture; keep opacity conservative.</li>
          <li><code>layered-surface</code> – Automatically applied by certain accented DepthCards.</li>
          <li><code>glass-layer</code> – Use sparingly for overlapping translucent panels.</li>
        </ul>
      </section>

      <section className="pb-12">
        <h2 className="text-xl font-semibold">Governance</h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Proposing new tokens or elevation tiers requires justification in a PR (what semantic gap, contrast verification, usage scenario). Keep the system lean.
        </p>
      </section>
    </main>
  )
}
