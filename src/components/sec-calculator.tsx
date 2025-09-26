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
  const [result, setResult] = useState<any>(null)
  const [validation, setValidation] = useState<any>(null)
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
      setResult(calcResult)

      // Validate with EPA
      const validationResult = await apiClient.validation.epa(formData)
      setValidation(validationResult)
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">SEC Climate Disclosure Calculator</h2>
        
        {/* Company Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Company Name</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter company name"
          />
        </div>

        {/* Scope 1 Emissions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Scope 1 Emissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fuel Type</label>
              <select
                value={formData.scope1?.fuel_type || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  scope1: { ...formData.scope1!, fuel_type: e.target.value }
                })}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
          <h3 className="text-lg font-semibold mb-3">Scope 2 Emissions</h3>
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
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Calculate Emissions'}
          </button>
          
          {result && (
            <button
              onClick={handleExportPackage}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Export SEC Package
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Calculation Results</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* EPA Validation */}
      {validation && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">EPA Validation</h3>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto">
            {JSON.stringify(validation, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}