'use client'

import { useState, useEffect } from 'react'
import { apiClient, type CalculationResponse, type CalculationListResponse } from '@/lib/api'
import { useToast } from '@/components/ui/toast'

interface EmissionData {
  company: string
  scope1?: {
    fuel_type: string
    amount: number
    unit: string
  }
  scope2?: {
    kwh: number
    grid_region: string
  }
}

export function SECCalculator() {
  const [formData, setFormData] = useState<EmissionData>({
    company: '',
    scope1: { fuel_type: 'natural_gas', amount: 0, unit: 'mmbtu' },
    scope2: { kwh: 0, grid_region: 'RFC' }
  })
  const [factors, setFactors] = useState<Record<string, unknown> | null>(null)
  const [units, setUnits] = useState<Record<string, unknown> | null>(null)
  type HistoryItem = {
    id?: string
    input?: EmissionData
    result?: Record<string, unknown>
    ts?: string
    name?: string
    company?: string
  }

  const [history, setHistory] = useState<HistoryItem[] | null>(null)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [validation, setValidation] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [calcName, setCalcName] = useState<string>('')
  const [exportType, setExportType] = useState<'package' | 'cevs'>('package')
  const { push: pushToast } = useToast()
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)

  const SAMPLE_EMISSION: EmissionData = {
    company: 'Example Co',
    scope1: { fuel_type: 'natural_gas', amount: 120, unit: 'mmbtu' },
    scope2: { kwh: 5000, grid_region: 'RFC' }
  }

  const handleCalculate = async () => {
    if (!formData.company) {
      setError('Company name is required')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Calculate emissions
      const calcResult = await apiClient.emissions.calculate(formData)
      setResult(calcResult as Record<string, unknown>)

      // Validate with EPA
      const validationResult = await apiClient.validation.epa(formData)
      setValidation(validationResult as Record<string, unknown>)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  // Load factors, units and user calculation history on mount
  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const [f, u] = await Promise.all([
          apiClient.emissions.getFactors().catch(() => null),
          apiClient.emissions.getUnits().catch(() => null)
        ])
        if (!mounted) return
        setFactors(f as Record<string, unknown> | null)
        setUnits(u as Record<string, unknown> | null)
        // Try to load history from server, fall back to localStorage
        try {
          const server = await apiClient.user.getCalculations().catch(() => null) as CalculationListResponse | null
          if (server && Array.isArray(server.calculations)) {
            const list = server.calculations as CalculationResponse[]
            setHistory(list.map(c => ({ id: c.id, input: c.calculation_data as unknown as EmissionData, result: c.result, ts: c.created_at, name: c.name || undefined })))
            return
          }
        } catch {
          // ignore server errors
        }
        try {
          const key = 'sec_calc_history'
          const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
          setHistory(raw ? JSON.parse(raw) : null)
        } catch {
          setHistory(null)
        }
        try {
          const shown = typeof window !== 'undefined' ? window.localStorage.getItem('sec_calc_onboard_shown') : null
          if (!shown && mounted) setShowOnboarding(true)
        } catch { /* ignore */ }
      } catch (err) {
        // ignore load errors for now
        console.debug('SEC calc: load metadata failed', err)
      }
    })()

    return () => { mounted = false }
  }, [])

  const handleExportPackage = async () => {
    if (!result) return
    try {
      if (exportType === 'package') {
        const packageData = await apiClient.export.secPackage(formData)
        console.log('SEC Package:', packageData)
        pushToast({ variant: 'success', title: 'Export started', message: 'SEC package generation started' })
      } else {
        const company = formData.company
        if (!company) throw new Error('Company required for CEVS export')
        const cevs = await apiClient.export.secCevs(company)
        console.log('CEVS export:', cevs)
        pushToast({ variant: 'success', title: 'Export ready', message: 'CEVS data retrieved' })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Export failed'
      setError(msg)
      pushToast({ variant: 'error', title: 'Export failed', message: msg })
    }
  }

  const handleSaveCalculation = async () => {
    if (!result) return
    setLoading(true)
    setError(null)
      try {
        // Try server save first; fall back to localStorage
        const payload = { name: calcName || undefined, company: formData.company, calculation_data: formData, result, version: 'v0.1.0' }
        try {
          // `saveCalculation` accepts an object with company, calculation_data, result, version.
          // Passing a variable with an extra `name` property is structurally compatible.
          await apiClient.user.saveCalculation(payload as unknown as Parameters<typeof apiClient.user.saveCalculation>[0])
          // Refresh server-side list
          const server = await apiClient.user.getCalculations().catch(() => null) as CalculationListResponse | null
          if (server && Array.isArray(server.calculations)) {
            const list = server.calculations as CalculationResponse[]
            setHistory(list.map(c => ({ id: c.id, input: c.calculation_data as unknown as EmissionData, result: c.result, ts: c.created_at, name: c.name || undefined })))
            pushToast({ variant: 'success', title: 'Saved', message: 'Calculation saved to your account' })
            setLoading(false)
            return
          }
        } catch {
          // fallback to local
        }

  const key = 'sec_calc_history'
  const curRaw = JSON.parse(localStorage.getItem(key) || '[]') as HistoryItem[]
  const cur = Array.isArray(curRaw) ? curRaw : []
  const entry: HistoryItem = { input: formData, result: result || undefined, ts: new Date().toISOString(), name: calcName || undefined }
  cur.unshift(entry)
  localStorage.setItem(key, JSON.stringify(cur.slice(0, 50)))
  setHistory(cur)
      pushToast({ variant: 'warning', title: 'Saved locally', message: 'Offline — saved to local storage. Use "Retry Sync" to sync later.' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      pushToast({ variant: 'error', title: 'Save failed', message: error || 'Save failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteHistory = async (item: HistoryItem) => {
    try {
      if (item?.id) {
        await apiClient.user.deleteCalculation(item.id)
        pushToast({ variant: 'success', message: 'Deleted from server' })
        const server = await apiClient.user.getCalculations().catch(() => null)
        if (server) {
          // apiClient.user.getCalculations() should return CalculationListResponse
          const typed = server as unknown as import('@/lib/api').CalculationListResponse
          if (typed && Array.isArray(typed.calculations)) {
            const list = typed.calculations as import('@/lib/api').CalculationResponse[]
            setHistory(list.map(c => ({ id: c.id, input: c.calculation_data as unknown as EmissionData, result: c.result, ts: c.created_at, name: c.name })))
            return
          }
        }
      } else {
        // local-only entry: remove from localStorage
        const key = 'sec_calc_history'
        const cur = JSON.parse(localStorage.getItem(key) || '[]') as HistoryItem[]
        const filtered = (Array.isArray(cur) ? cur : []).filter(h => h.ts !== item.ts)
        localStorage.setItem(key, JSON.stringify(filtered))
        setHistory(filtered)
        pushToast({ variant: 'success', message: 'Removed local entry' })
      }
    } catch (err) {
      pushToast({ variant: 'error', message: err instanceof Error ? err.message : 'Delete failed' })
    }
  }

  const retrySyncLocal = async () => {
    try {
      const key = 'sec_calc_history'
      const cur = JSON.parse(localStorage.getItem(key) || '[]') as HistoryItem[]
      const pending = (Array.isArray(cur) ? cur : []).filter(c => !c.id)
      if (!pending.length) {
        pushToast({ variant: 'default', message: 'No local items to sync' })
        return
      }
      for (const p of pending) {
        try {
            if (p.input) {
            await apiClient.user.saveCalculation({ company: p.input.company, calculation_data: p.input as unknown as Record<string, unknown>, result: p.result, version: 'v0.1.0' })
          }
        } catch (e) {
          console.debug('sync failed for item', p, e)
        }
      }
      // refresh server list
      const server = await apiClient.user.getCalculations().catch(() => null) as CalculationListResponse | null
      if (server && Array.isArray(server.calculations)) {
        const list = server.calculations as CalculationResponse[]
          setHistory(list.map(c => ({ id: c.id, input: c.calculation_data as unknown as EmissionData, result: c.result, ts: c.created_at, name: c.name || undefined })))
        // clear local-only entries
        const rem = (Array.isArray(cur) ? cur : []).filter(c => c.id)
        localStorage.setItem(key, JSON.stringify(rem))
        pushToast({ variant: 'success', message: 'Sync complete' })
      } else {
        pushToast({ variant: 'warning', message: 'Sync attempted but server did not return data' })
      }
    } catch (err) {
      pushToast({ variant: 'error', message: err instanceof Error ? err.message : 'Sync failed' })
    }
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-xl lg:text-2xl font-semibold">SEC Calculator</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">Calculate Scope 1 & 2 emissions for SEC Climate Disclosure</p>
        </div>
        {/* Factors/Units quick info */}
        {(factors || units) && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {factors && (
              <div className="p-3 border border-border rounded-md bg-background text-sm">
                <strong>Emission Factors</strong>
                <div className="mt-2 text-xs text-muted-foreground">{Object.keys(factors).slice(0, 8).join(', ')}{Object.keys(factors).length > 8 ? '…' : ''}</div>
              </div>
            )}
            {units && (
              <div className="p-3 border border-border rounded-md bg-background text-sm">
                <strong>Supported Units</strong>
                <div className="mt-2 text-xs text-muted-foreground">{Object.keys(units).slice(0, 8).join(', ')}{Object.keys(units).length > 8 ? '…' : ''}</div>
              </div>
            )}
          </div>
        )}
        
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
        
        {/* Company Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Company Name</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter company name"
            />
          </div>

          {/* Calculation name and export type */}
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Calculation Name (optional)</label>
              <input
                type="text"
                value={calcName}
                onChange={(e) => setCalcName(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="My Q3 SEC Calculation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Export Type</label>
              <select value={exportType} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExportType(e.target.value as 'package' | 'cevs')} className="w-full p-3 border border-border rounded-lg bg-background">
                <option value="package">SEC Package</option>
                <option value="cevs">CEVS (raw)</option>
              </select>
            </div>
          </div>

        {/* Scope 1 Emissions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Scope 1 Emissions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fuel Type</label>
                <select
                  value={formData.scope1?.fuel_type || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    scope1: { ...formData.scope1!, fuel_type: e.target.value }
                  })}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring [&>option]:bg-background [&>option]:text-foreground"
                >
                  <option value="natural_gas">Natural Gas</option>
                  <option value="diesel">Diesel</option>
                  <option value="gasoline">Gasoline</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.scope1?.amount || 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    scope1: { ...formData.scope1!, amount: Number(e.target.value) }
                  })}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit</label>
                <select
                  value={formData.scope1?.unit || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    scope1: { ...formData.scope1!, unit: e.target.value }
                  })}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring [&>option]:bg-background [&>option]:text-foreground"
                >
                  <option value="mmbtu">MMBtu</option>
                  <option value="gallons">Gallons</option>
                  <option value="liters">Liters</option>
                </select>
              </div>
            </div>
          </div>

        {/* Scope 2 Emissions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Scope 2 Emissions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Electricity (kWh)</label>
                <input
                  type="number"
                  value={formData.scope2?.kwh || 0}
                  onChange={(e) => setFormData({
                    ...formData,
                    scope2: { ...formData.scope2!, kwh: Number(e.target.value) }
                  })}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Grid Region</label>
                <select
                  value={formData.scope2?.grid_region || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    scope2: { ...formData.scope2!, grid_region: e.target.value }
                  })}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring [&>option]:bg-background [&>option]:text-foreground"
                >
                  <option value="RFC">RFC</option>
                  <option value="WECC">WECC</option>
                  <option value="TRE">TRE</option>
                </select>
              </div>
            </div>
          </div>

        {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Calculating...' : 'Calculate Emissions'}
            </button>
            
            {result && (
              <button
                onClick={handleExportPackage}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Export SEC Package
              </button>
            )}
            {result && (
              <button
                onClick={handleSaveCalculation}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
              >
                Save Calculation
              </button>
            )}
            <div className="ml-auto">
              <button onClick={retrySyncLocal} className="px-4 py-2 border rounded-lg">Retry Sync</button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Calculation Results</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* EPA Validation */}
        {validation && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">EPA Validation</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(validation, null, 2)}
            </pre>
          </div>
        )}

        {/* User Calculation History */}
        {!history || (Array.isArray(history) && history.length === 0) ? (
          <div className="bg-card border border-border rounded-lg p-6 mt-6 text-center text-sm text-muted-foreground">
            {showOnboarding ? (
              <div>
                <h4 className="text-base font-medium mb-2">Get started with the SEC Calculator</h4>
                <p className="mb-4">Try a sample calculation to see how results and exports work. You can edit the values after loading.</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => { setFormData(SAMPLE_EMISSION); setShowOnboarding(false); try { window.localStorage.setItem('sec_calc_onboard_shown', '1') } catch {} }} className="btn btn-primary">Get started</button>
                  <button onClick={() => { setShowOnboarding(false); try { window.localStorage.setItem('sec_calc_onboard_shown', '1') } catch {} }} className="btn">Dismiss</button>
                </div>
              </div>
            ) : (
              <div>
                No saved calculations yet — calculate and click &quot;Save Calculation&quot;. Your saves are kept in your account when signed in or locally when offline.
                <div className="mt-3">
                  <button onClick={() => setShowOnboarding(true)} className="text-sm underline">Show quick start</button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {history && Array.isArray(history) && history.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium mb-4">Recent Calculations</h3>
            <ul className="space-y-3 text-sm">
              {history.slice(0, 5).map((h, idx) => (
                <li key={idx} className="p-3 bg-muted rounded-md">
                  <div className="flex items-start justify-between">
                          <div className="cursor-pointer" onClick={() => {
                            try {
                              if (h && h.input) {
                                setFormData(h.input)
                                setResult(h.result ?? null)
                              }
                            } catch { /* ignore */ }
                          }}>
                            <div className="text-xs text-muted-foreground">{h.ts ?? ''}</div>
                            <div className="mt-1">{h.name ?? h.input?.company ?? h.company ?? 'Saved calculation'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteHistory(h)} className="text-sm text-destructive">Delete</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}