import { createBrowserRouter } from 'react-router-dom'
import { DashboardPage } from '@/pages/DashboardPage'
import { GroupPage } from '@/pages/GroupPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardPage />,
  },
  {
    path: '/group/:groupId',
    element: <GroupPage />,
  },
])
