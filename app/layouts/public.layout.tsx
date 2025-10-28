/**
 * Public Layout
 * For routes that don't require authentication (login, register, etc)
 */

import { Outlet } from 'react-router'

export default function PublicLayout() {
  return <Outlet />
}
