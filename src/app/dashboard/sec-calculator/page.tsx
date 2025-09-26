import { SECCalculator } from '@/components/sec-calculator'

export default function SECCalculatorPage() {
  return (
    <div className="container mx-auto py-8">
      <SECCalculator />
    </div>
  )
}

export const metadata = {
  title: 'SEC Calculator - Envoyou',
  description: 'Calculate Scope 1 & 2 emissions for SEC Climate Disclosure compliance'
}