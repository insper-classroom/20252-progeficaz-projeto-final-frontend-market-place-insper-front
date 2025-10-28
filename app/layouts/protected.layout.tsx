/**
 * Protected Layout
 * Ensures user is authenticated before rendering child routes
 * Redirects to login if not authenticated
 */

import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useAuth } from '../contexts/auth.context'
import { Header } from '../components/header'

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Carregando...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
