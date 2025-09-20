import Link from 'next/link'
import { Shield, AlertTriangle, BarChart3, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">FraudGuard</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/api/transactions" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                API
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Advanced Fraud Detection
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Real-time transaction monitoring with AI-powered fraud detection. 
            Protect your business from fraudulent activities with our advanced analytics platform.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Go to Dashboard
            </Link>
            <Link href="#features" className="text-lg font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-24">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg bg-white px-6 pb-8 pt-14 shadow-sm ring-1 ring-gray-900/5">
              <div className="absolute left-6 top-6">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                Real-time Monitoring
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Monitor transactions in real-time with instant fraud scoring and risk assessment.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-white px-6 pb-8 pt-14 shadow-sm ring-1 ring-gray-900/5">
              <div className="absolute left-6 top-6">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                Advanced Analytics
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Comprehensive analytics dashboard with detailed fraud patterns and trends.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-white px-6 pb-8 pt-14 shadow-sm ring-1 ring-gray-900/5">
              <div className="absolute left-6 top-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                Team Collaboration
              </h3>
              <p className="mt-2 text-base leading-7 text-gray-600">
                Collaborative case management with role-based access and team workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-8">
          <h2 className="text-center text-2xl font-bold leading-8 text-gray-900">
            Fraud Detection Performance
          </h2>
          <dl className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-600">Detection Accuracy</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900">99.7%</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-600">Response Time</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900">&lt;100ms</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-600">False Positives</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900">&lt;0.1%</dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-600">Transactions Monitored</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-gray-900">24/7</dd>
            </div>
          </dl>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">FraudGuard</span>
            </div>
            <p className="text-gray-600">
              Advanced fraud detection powered by machine learning and real-time analytics.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
