'use client';

import { useState } from 'react';
import { authAPI } from '@/lib/api';

export default function APITestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHealthEndpoint = async () => {
    setLoading(true);
    setResult('Testing health endpoint...');
    console.log('🧪 Testing health endpoint');
    
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      
      console.log('✅ Health endpoint response:', data);
      setResult(`✅ Health endpoint works! Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('❌ Health endpoint failed:', error);
      setResult(`❌ Health endpoint failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegistrationAPI = async () => {
    setLoading(true);
    setResult('Testing registration API...');
    console.log('🧪 Testing registration API with authAPI');

    const testUserData = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User Frontend',
      professionalInfo: {
        title: 'Frontend Developer',
        company: 'Test Company',
        experience: 'mid'
      }
    };

    console.log('📝 Test user data:', testUserData);

    try {
      const response = await authAPI.register(testUserData);
      console.log('✅ Registration API response:', response.data);
      setResult(`✅ Registration API works! Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.error('❌ Registration API failed:', error);
      setResult(`❌ Registration API failed: ${error.message} - ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setResult('Testing direct fetch...');
    console.log('🧪 Testing direct fetch to backend');

    const testUserData = {
      email: `direct-test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Direct Test User',
      professionalInfo: {
        title: 'Direct Developer',
        company: 'Direct Company',
        experience: 'mid'
      }
    };

    console.log('📝 Direct test user data:', testUserData);

    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUserData)
      });

      const data = await response.json();
      
      console.log('✅ Direct fetch response:', data);
      setResult(`✅ Direct fetch works! Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('❌ Direct fetch failed:', error);
      setResult(`❌ Direct fetch failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 API Test Page</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testHealthEndpoint}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 px-6 py-3 rounded-lg font-semibold"
          >
            {loading ? 'Testing...' : 'Test Health Endpoint'}
          </button>

          <button
            onClick={testRegistrationAPI}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-900 px-6 py-3 rounded-lg font-semibold ml-4"
          >
            {loading ? 'Testing...' : 'Test Registration API (via authAPI)'}
          </button>

          <button
            onClick={testDirectFetch}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 px-6 py-3 rounded-lg font-semibold ml-4"
          >
            {loading ? 'Testing...' : 'Test Direct Fetch'}
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-300 overflow-auto max-h-96">
            {result || 'No tests run yet. Check browser console for detailed logs.'}
          </pre>
        </div>

        <div className="mt-8 bg-yellow-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📋 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open browser developer tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Click the test buttons above</li>
            <li>Watch both the console logs and the backend terminal</li>
            <li>Check if requests are reaching the backend</li>
          </ol>
        </div>

        <div className="mt-4 bg-blue-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🔍 What to Look For:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Frontend Console:</strong> Look for 🚀 API Request logs</li>
            <li><strong>Backend Terminal:</strong> Look for 🌐 incoming request logs</li>
            <li><strong>CORS Errors:</strong> Check if requests are blocked by CORS</li>
            <li><strong>Network Tab:</strong> Check if requests are actually being made</li>
          </ul>
        </div>
      </div>
    </div>
  );
}