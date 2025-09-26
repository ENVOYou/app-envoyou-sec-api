'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GlobeIcon, BarChartIcon } from '@/components/icons'
import { EmissionData, EmissionStats } from '@/types'

export default function GlobalDataPage() {
  const [emissionsData, setEmissionsData] = useState<EmissionData[]>([])
  const [emissionsStats, setEmissionsStats] = useState<EmissionStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    state: '',
    year: '',
    pollutant: '',
    page: 1,
    limit: 20
  })

  useEffect(() => {
    fetchEmissionsStats()
  }, [])

  const fetchEmissionsStats = async () => {
    try {
      const stats = await apiClient.global.getEmissionsStats() as EmissionStats
      setEmissionsStats(stats)
    } catch (error) {
      console.error('Error fetching emissions stats:', error)
    }
  }

  const fetchEmissionsData = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {
        page: filters.page.toString(),
        limit: filters.limit.toString()
      }
      
      if (filters.state) params.state = filters.state
      if (filters.year) params.year = filters.year
      if (filters.pollutant) params.pollutant = filters.pollutant

      const data = await apiClient.global.getEmissions(params) as EmissionData[]
      setEmissionsData(data)
    } catch (error) {
      console.error('Error fetching emissions data:', error)
      alert('Error fetching data. Please check your API key permissions.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : prev.page // Reset to page 1 when changing filters
    }))
  }

  const resetFilters = () => {
    setFilters({
      state: '',
      year: '',
      pollutant: '',
      page: 1,
      limit: 20
    })
    setEmissionsData([])
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Environmental Data</h1>
        <p className="text-muted-foreground mt-2">
          Access comprehensive environmental datasets including emissions, EEA indicators, and ISO certifications.
        </p>
      </div>

      {/* Stats Overview */}
      {emissionsStats && (
        <div className="surface-section"><div className="grid gap-4 md:grid-cols-4">
          <div className="grid-item"><Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {emissionsStats.total_records?.toLocaleString()}
              </div>
            </CardContent>
          </Card></div>
          <div className="grid-item"><Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">States Covered</CardTitle>
              <GlobeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {emissionsStats.states_covered}
              </div>
            </CardContent>
          </Card></div>
          <div className="grid-item"><Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Year Range</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {emissionsStats.years_range?.min} - {emissionsStats.years_range?.max}
              </div>
            </CardContent>
          </Card></div>
          <div className="grid-item"><Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pollutants</CardTitle>
              <GlobeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {emissionsStats.pollutants?.length}
              </div>
            </CardContent>
          </Card></div>
        </div></div>
      )}

      {/* Data Explorer */}
  <div className="surface-section"><div className="grid-item"><Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GlobeIcon className="h-5 w-5" />
            <span>Emissions Data Explorer</span>
          </CardTitle>
          <CardDescription>
            Search and filter EPA/EIA emissions data by state, year, and pollutant type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="">All States</option>
                <option value="CA">California</option>
                <option value="TX">Texas</option>
                <option value="NY">New York</option>
                <option value="FL">Florida</option>
                <option value="PA">Pennsylvania</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <Input
                type="number"
                placeholder="e.g., 2023"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                min="2000"
                max="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pollutant</label>
              <select
                value={filters.pollutant}
                onChange={(e) => handleFilterChange('pollutant', e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="">All Pollutants</option>
                <option value="CO2">Carbon Dioxide</option>
                <option value="NOx">Nitrogen Oxides</option>
                <option value="SO2">Sulfur Dioxide</option>
                <option value="PM2.5">PM2.5</option>
                <option value="PM10">PM10</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <Button onClick={fetchEmissionsData} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>

          {/* Results */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading emissions data...</p>
            </div>
          )}

          {emissionsData.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Results ({emissionsData.length})
                </h3>
                <div className="flex space-x-2 text-sm text-muted-foreground">
                  <span>Page {filters.page}</span>
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">State</th>
                        <th className="text-left p-3 font-medium">Year</th>
                        <th className="text-left p-3 font-medium">Pollutant</th>
                        <th className="text-left p-3 font-medium">Value</th>
                        <th className="text-left p-3 font-medium">Unit</th>
                        <th className="text-left p-3 font-medium">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emissionsData.map((item, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="p-3">{item.state || 'N/A'}</td>
                          <td className="p-3">{item.year || 'N/A'}</td>
                          <td className="p-3">{item.pollutant || 'N/A'}</td>
                          <td className="p-3 font-mono">{item.value?.toLocaleString()}</td>
                          <td className="p-3">{item.unit}</td>
                          <td className="p-3 text-xs text-muted-foreground">{item.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  disabled={filters.page <= 1}
                  onClick={() => {
                    handleFilterChange('page', (filters.page - 1).toString())
                    fetchEmissionsData()
                  }}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {filters.page}
                </span>
                <Button
                  variant="outline"
                  disabled={emissionsData.length < filters.limit}
                  onClick={() => {
                    handleFilterChange('page', (filters.page + 1).toString())
                    fetchEmissionsData()
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {emissionsData.length === 0 && !loading && (
            <div className="text-center py-8">
              <GlobeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Data Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria.
              </p>
              <p className="text-xs text-muted-foreground">
                Note: This endpoint requires an API key. Make sure you have created and are using a valid API key.
              </p>
            </div>
          )}
        </CardContent>
  </Card></div></div>

      {/* Available Datasets */}
  <div className="surface-section"><div className="grid-item"><Card>
        <CardHeader>
          <CardTitle>Available Datasets</CardTitle>
          <CardDescription>
            Explore different environmental data sources and endpoints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">EPA/EIA Emissions</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive emissions data from EPA and EIA sources
              </p>
              <div className="text-xs text-muted-foreground">
                Endpoint: <code>/v1/global/emissions</code>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">EEA Indicators</h4>
              <p className="text-sm text-muted-foreground">
                European Environment Agency environmental indicators
              </p>
              <div className="text-xs text-muted-foreground">
                Endpoint: <code>/v1/global/eea</code>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">ISO 14001 Certifications</h4>
              <p className="text-sm text-muted-foreground">
                ISO 14001 environmental management certifications
              </p>
              <div className="text-xs text-muted-foreground">
                Endpoint: <code>/v1/global/iso</code>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">EDGAR Data</h4>
              <p className="text-sm text-muted-foreground">
                Emissions Database for Global Atmospheric Research
              </p>
              <div className="text-xs text-muted-foreground">
                Endpoint: <code>/v1/global/edgar</code>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">CEVS Scores</h4>
              <p className="text-sm text-muted-foreground">
                Corporate Environmental and Vegetation Scores
              </p>
              <div className="text-xs text-muted-foreground">
                Endpoint: <code>/v1/global/cevs/{'{company_name}'}</code>
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <h4 className="font-medium">CAMD Data</h4>
              <p className="text-sm text-muted-foreground">
                Clean Air Markets Division emissions and compliance data
              </p>
              <div className="text-xs text-muted-foreground">
                Endpoint: <code>/v1/global/campd</code>
              </div>
            </div>
          </div>
        </CardContent>
  </Card></div></div>
    </div>
  )
}