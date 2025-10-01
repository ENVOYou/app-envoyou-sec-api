'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GlobeIcon } from '@/components/icons'

export default function GlobalDataPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Data Sources & Cross-Validation</h1>
        <p className="text-muted-foreground mt-2">
          This page summarizes the external datasets we rely on for cross-validation, auditing, and SEC export context.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GlobeIcon className="h-5 w-5" />
            <span>Key Endpoints (used for validation)</span>
          </CardTitle>
          <CardDescription>
            These endpoints are integrated into the calculation and audit flows. All production requests require an API key.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Emissions & facility data</h4>
              <p className="text-sm text-muted-foreground mt-1">Primary datasets for cross-checking company calculations against public records.</p>
              <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                <li><code>/v1/global/emissions</code> — EPA emissions (primary) with fallback to EIA where available</li>
                <li><code>/v1/global/campd</code> — CAMD emissions & compliance (US power plants)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Indicators & certifications</h4>
              <p className="text-sm text-muted-foreground mt-1">Contextual signals used in validation heuristics.</p>
              <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                <li><code>/v1/global/eea</code> — EEA environmental indicators</li>
                <li><code>/v1/global/iso</code> — ISO 14001 certification lookups</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Trends & scoring</h4>
              <p className="text-sm text-muted-foreground mt-1">Aggregations used for scoring and export metadata.</p>
              <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                <li><code>/v1/global/edgar</code> — EDGAR series & trend lookups</li>
                <li><code>/v1/global/ghg/{'{company_name}'}</code> — Company GHG score aggregation</li>
              </ul>
            </div>

            <div className="mt-4 text-sm">
              <p className="font-medium">How this supports our goals</p>
              <ul className="list-disc pl-6 mt-2 text-sm space-y-1">
                <li>Cross-validation: calculator outputs are compared to public records to flag deviations.</li>
                <li>Auditability: every validation call and its source is stored in the AuditTrail with factor versions.</li>
                <li>Export readiness: validated inputs and references are included in SEC export packages for traceability.</li>
              </ul>
            </div>

            <div className="mt-6">
              <Button onClick={() => { window.location.href = '/dashboard/analytics' }}>
                Open Usage Analytics
              </Button>
              <Button variant="ghost" className="ml-3" onClick={() => { window.location.href = '/dashboard/notifications' }}>
                View Notifications
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}