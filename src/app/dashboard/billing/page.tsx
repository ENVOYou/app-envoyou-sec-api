'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Download, Calendar } from 'lucide-react'

export default function BillingPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information.
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Current Plan</span>
          </CardTitle>
          <CardDescription>
            Your current subscription details and usage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div>
                <h3 className="font-medium">Free Plan</h3>
                <p className="text-sm text-muted-foreground">
                  1,000 API requests per month
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">$0</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Requests Used</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">1,000</div>
                <div className="text-sm text-muted-foreground">Requests Remaining</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">∞</div>
                <div className="text-sm text-muted-foreground">Days Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>
            Get more API requests and advanced features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold">Pro Plan</h3>
                <div className="text-3xl font-bold mt-2">$29</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✓ 50,000 API requests/month</li>
                <li>✓ Priority support</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Custom integrations</li>
              </ul>
              <Button className="w-full mt-4" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="border rounded-lg p-6 border-primary">
              <div className="text-center">
                <h3 className="text-xl font-bold">Enterprise</h3>
                <div className="text-3xl font-bold mt-2">$99</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✓ Unlimited API requests</li>
                <li>✓ 24/7 dedicated support</li>
                <li>✓ Custom reporting</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <Button className="w-full mt-4" disabled>
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Billing History</span>
          </CardTitle>
          <CardDescription>
            Your past invoices and payment history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Billing History</h3>
            <p className="text-muted-foreground mb-4">
              You haven't been charged yet. Your free plan doesn't require payment.
            </p>
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}