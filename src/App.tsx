import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { SessionFilterProvider } from '@/context/SessionFilterContext'
import { AppShell } from '@/components/layout/AppShell'
import { router } from '@/router'

export function App() {
  return (
    <AuthProvider>
      <SessionFilterProvider>
        <AppShell>
          <RouterProvider router={router} />
        </AppShell>
      </SessionFilterProvider>
    </AuthProvider>
  )
}
