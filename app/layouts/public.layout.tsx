/**
 * Public Layout
 * For routes that don't require authentication (login, register, etc)
 */

import { Outlet } from 'react-router'
import { Footer } from '../components/footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
