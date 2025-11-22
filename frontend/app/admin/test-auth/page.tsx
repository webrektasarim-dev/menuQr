'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

export default function TestAuthPage() {
  const [results, setResults] = useState<any[]>([])
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Get token
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    setToken(storedToken)

    // Test API calls
    const testAPIs = async () => {
      const testResults: any[] = []

      // Test 1: Check token
      testResults.push({
        test: 'Token Check',
        result: storedToken ? `Token found (${storedToken.length} chars)` : 'No token found',
        status: storedToken ? 'success' : 'error'
      })

      // Test 2: Test token endpoint
      try {
        const testRes = await fetch('/api/v1/auth/test-token', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        })
        const testData = await testRes.json()
        testResults.push({
          test: 'Test Token Endpoint',
          result: testData,
          status: testRes.ok ? 'success' : 'error'
        })
      } catch (error: any) {
        testResults.push({
          test: 'Test Token Endpoint',
          result: error.message,
          status: 'error'
        })
      }

      // Test 3: Test menus API
      try {
        const menusRes = await api.get('/menus')
        testResults.push({
          test: 'Menus API',
          result: 'Success',
          status: 'success'
        })
      } catch (error: any) {
        testResults.push({
          test: 'Menus API',
          result: error.response?.data?.message || error.message,
          status: 'error',
          statusCode: error.response?.status
        })
      }

      // Test 4: Test tables API
      try {
        const tablesRes = await api.get('/tables')
        testResults.push({
          test: 'Tables API',
          result: 'Success',
          status: 'success'
        })
      } catch (error: any) {
        testResults.push({
          test: 'Tables API',
          result: error.response?.data?.message || error.message,
          status: 'error',
          statusCode: error.response?.status
        })
      }

      // Test 5: Test orders API
      try {
        const ordersRes = await api.get('/orders')
        testResults.push({
          test: 'Orders API',
          result: 'Success',
          status: 'success'
        })
      } catch (error: any) {
        testResults.push({
          test: 'Orders API',
          result: error.response?.data?.message || error.message,
          status: 'error',
          statusCode: error.response?.status
        })
      }

      setResults(testResults)
    }

    if (storedToken) {
      testAPIs()
    } else {
      setResults([{
        test: 'Token Check',
        result: 'No token found. Please login first.',
        status: 'error'
      }])
    }
  }, [])

  return (
    <div className="min-h-screen bg-primary-light p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Token Info</h2>
          <div className="space-y-2">
            <p><strong>Token:</strong> {token ? `${token.substring(0, 50)}...` : 'Not found'}</p>
            <p><strong>Token Length:</strong> {token?.length || 0}</p>
            <p><strong>localStorage:</strong> {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
            <p><strong>sessionStorage:</strong> {sessionStorage.getItem('token') ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      result.status === 'success'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {result.status === 'success' ? '✅ Success' : '❌ Error'}
                    {result.statusCode && ` (${result.statusCode})`}
                  </span>
                </div>
                <pre className="text-sm overflow-auto bg-gray-100 p-2 rounded">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

