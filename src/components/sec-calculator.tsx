'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'

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
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [validation, setValidation] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleExportPackage = async () => {
    if (!result) return
    
    try {
      const packageData = await apiClient.export.secPackage(formData)
      // Handle download
      console.log('SEC Package:', packageData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">SEC Calculator</h1>
          <p className="text-muted-foreground mt-1">Calculate Scope 1 & 2 emissions for SEC Climate Disclosure</p>
        </div>
        
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

        {/* Scope 1 Emissions */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Scope 1 Emissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="flex gap-4">
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
      </div>
    </div>
  )
}