'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, DollarSign, Shield, TrendingUp } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  currency: string
  merchantName: string
  customerEmail: string
  fraudScore: number
  riskLevel: string
  isBlocked: boolean
  createdAt: string
  alerts: Alert[]
  _count: { alerts: number }
}

interface Alert {
  id: string
  type: string
  severity: string
  title: string
  description: string
  status: string
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter !== 'ALL') params.set('riskLevel', filter)
      
      const response = await fetch(`/api/transactions?${params}`)
      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [filter])

  // Stats calculations
  const stats = {
    total: transactions.length,
    highRisk: transactions.filter(t => t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL').length,
    blocked: transactions.filter(t => t.isBlocked).length,
    avgFraudScore: transactions.length > 0 
      ? (transactions.reduce((sum, t) => sum + (t.fraudScore || 0), 0) / transactions.length).toFixed(2)
      : '0.00'
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'text-red-600 bg-red-50'
      case 'HIGH': return 'text-orange-600 bg-orange-50'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-green-600 bg-green-50'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fraud Detection Dashboard
          </h1>
          <p className="text-gray-600">Monitor and manage suspicious transactions in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">High Risk</p>
                <p className="text-2xl font-bold text-gray-900">{stats.highRisk}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Blocked</p>
                <p className="text-2xl font-bold text-gray-900">{stats.blocked}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Fraud Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgFraudScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Transactions</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
                <option value="CRITICAL">Critical Risk</option>
              </select>
              <button
                onClick={fetchTransactions}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh
              </button>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {showCreateForm ? 'Cancel' : 'Simulate Transaction'}
            </button>
          </div>
        </div>

        {/* Create Transaction Form */}
        {showCreateForm && (
          <CreateTransactionForm 
            onSuccess={() => {
              setShowCreateForm(false)
              fetchTransactions()
            }}
          />
        )}

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions found. Try creating a test transaction.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fraud Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alerts
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.merchantName || transaction.id.slice(0, 8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.customerEmail || 'No email'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${transaction.amount.toLocaleString()} {transaction.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(transaction.riskLevel)}`}>
                          {transaction.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {(transaction.fraudScore * 100).toFixed(1)}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              transaction.fraudScore > 0.7 ? 'bg-red-600' :
                              transaction.fraudScore > 0.5 ? 'bg-orange-500' :
                              transaction.fraudScore > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(transaction.fraudScore * 100, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.isBlocked ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
                        }`}>
                          {transaction.isBlocked ? 'Blocked' : 'Approved'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {transaction.alerts.length > 0 ? (
                          <div className="space-y-1">
                            {transaction.alerts.slice(0, 2).map((alert) => (
                              <div key={alert.id} className="text-xs">
                                <span className={`font-medium ${getSeverityColor(alert.severity)}`}>
                                  {alert.title}
                                </span>
                              </div>
                            ))}
                            {transaction.alerts.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{transaction.alerts.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No alerts</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Create Transaction Form Component
function CreateTransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    amount: '',
    merchantId: '',
    merchantName: '',
    customerId: '',
    customerEmail: '',
    location: '',
    ipAddress: '',
    deviceId: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      })

      if (response.ok) {
        onSuccess()
        setFormData({
          amount: '',
          merchantId: '',
          merchantName: '',
          customerId: '',
          customerEmail: '',
          location: '',
          ipAddress: '',
          deviceId: ''
        })
      } else {
        console.error('Failed to create transaction')
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Test Transaction</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Amount (e.g., 1000)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Merchant ID (e.g., merchant_123)"
          value={formData.merchantId}
          onChange={(e) => setFormData({...formData, merchantId: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Merchant Name (e.g., Amazon)"
          value={formData.merchantName}
          onChange={(e) => setFormData({...formData, merchantName: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Customer ID (e.g., customer_456)"
          value={formData.customerId}
          onChange={(e) => setFormData({...formData, customerId: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Customer Email"
          value={formData.customerEmail}
          onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Location (e.g., New York, US)"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Transaction'}
          </button>
        </div>
      </form>
    </div>
  )
}
