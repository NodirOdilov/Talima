import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Map of routes to their corresponding titles
const routeTitles: Record<string, string> = {
  '/': 'Login - Talima',
  '/admin/dashboard': 'Admin Dashboard - Talima',
  '/admin/teachers': 'Manage Teachers - Talima',
  '/admin/students': 'Manage Students - Talima',
  '/admin/payments': 'Payment Management - Talima',
  '/admin/reports': 'Reports & Analytics - Talima',
  '/admin/products': 'Product Management - Talima',
  '/teacher/dashboard': 'Teacher Dashboard - Talima',
  '/teacher/groups': 'My Groups - Talima',
  '/teacher/lessons': 'Lesson Management - Talima',
  '/teacher/attendance': 'Attendance Tracking - Talima',
  '/teacher/statistics': 'Teaching Statistics - Talima',
  '/teacher/calendar': 'Teaching Calendar - Talima',
  '/teacher/quizzes': 'Quiz Management - Talima',
  '/teacher/messages': 'Messages - Talima',
  '/student/dashboard': 'Student Dashboard - Talima',
  '/student/messages': 'Messages - Talima',
  '/student/quizzes': 'My Quizzes - Talima',
  '/student/calendar': 'My Calendar - Talima',
  '/student/shop': 'Student Shop - Talima',
  '/parent/dashboard': 'Parent Dashboard - Talima',
  '/parent/child': 'My Child - Talima',
  '/parent/payments': 'Payment History - Talima'
}

export const usePageTitle = () => {
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname
    const title = routeTitles[pathname] || 'Talima'
    
    document.title = title
  }, [location.pathname])
} 