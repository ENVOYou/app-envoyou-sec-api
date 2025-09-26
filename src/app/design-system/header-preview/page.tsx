import { Header } from '@/components/header'

export const metadata = { title: 'Header Preview' }

export default function HeaderPreviewPage() {
  return (
    <div className="min-h-[200vh] bg-background text-foreground">
      <Header />
      <section className="pt-24 max-w-4xl mx-auto px-6 space-y-8">
        <h2 className="ts-section-title">Scroll Test</h2>
        <p className="ts-body">Scroll down to trigger elevation state. This page exists for visual regression of the application chrome in both light and dark themes.</p>
        <div className="space-y-6">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg bg-surface/70 border border-borderBase/50">
              <p className="text-sm">Content block {i + 1}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
