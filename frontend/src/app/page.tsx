'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Home() {
  const [message, setMessage] = useState('Loading...')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/hello')
        setMessage(response.data.message)
      } catch (err) {
        setError('Failed to fetch data from backend')
        setMessage('')
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Luna AI</h1>
        
        {message && (
          <div className="p-4 bg-green-100 rounded-lg mb-4">
            <p className="text-green-800">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100 rounded-lg mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        <p className="mt-4">
          This is a Next.js app with a Node.js backend.
        </p>
      </div>
    </main>
  )
}