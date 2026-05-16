import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePageTitle } from '@/lib/usePageTitle'
import { getDashboardPath, ADMIN_ROLES } from './navigation.config'

// Страницы авторизации и layout
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'))

// Существующие страницы
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const TeachersPage = lazy(() => import('@/pages/admin/TeachersPage'))
const StudentsPage = lazy(() => import('@/pages/admin/StudentsPage'))
const PaymentsPage = lazy(() => import('@/pages/admin/PaymentsPage'))
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'))
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'))

const TeacherDashboard = lazy(() => import('@/pages/teacher/TeacherDashboard'))
const TeacherGroups = lazy(() => import('@/pages/teacher/TeacherGroups'))
const TeacherLessons = lazy(() => import('@/pages/teacher/TeacherLessons'))
const TeacherAttendance = lazy(() => import('@/pages/teacher/TeacherAttendance'))
const TeacherStatistics = lazy(() => import('@/pages/teacher/TeacherStatistics'))
const TeacherCalendar = lazy(() => import('@/pages/teacher/TeacherCalendar'))
const TeacherQuizzes = lazy(() => import('@/pages/teacher/TeacherQuizzes'))
const TeacherMessages = lazy(() => import('@/pages/teacher/TeacherMessages'))
const TeacherAITestGenerator = lazy(() => import('@/pages/teacher/TeacherAITestGenerator'))

const StudentDashboard = lazy(() => import('@/pages/student/StudentDashboard'))
const StudentShop = lazy(() => import('@/pages/student/StudentShop'))
const StudentCalendar = lazy(() => import('@/pages/student/StudentCalendar'))
const StudentQuizzes = lazy(() => import('@/pages/student/StudentQuizzes'))
const StudentMessages = lazy(() => import('@/pages/student/StudentMessages'))
const StudentHomework = lazy(() => import('@/pages/student/StudentHomework'))
const StudentGames = lazy(() => import('@/pages/student/StudentGames'))
const StudentTests = lazy(() => import('@/pages/student/StudentTests'))

const ParentDashboard = lazy(() => import('@/pages/parent/ParentDashboard'))
const ParentChild = lazy(() => import('@/pages/parent/ParentChild'))
const ParentPayments = lazy(() => import('@/pages/parent/ParentPayments'))

// Enterprise модули (lazy)
const PlatformDashboard = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.PlatformDashboard })))
const UsersManagementPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.UsersManagementPage })))
const SettingsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.SettingsPage })))
const AcademicsOverviewPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.AcademicsOverviewPage })))
const CrmLeadsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.CrmLeadsPage })))
const CrmPipelinePage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.CrmPipelinePage })))
const CrmCampaignsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.CrmCampaignsPage })))
const FinanceSummaryPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.FinanceSummaryPage })))
const FinanceInvoicesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.FinanceInvoicesPage })))
const FinanceExpensesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.FinanceExpensesPage })))
const FinancePayrollPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.FinancePayrollPage })))
const HrEmployeesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.HrEmployeesPage })))
const HrLeavesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.HrLeavesPage })))
const HrVacanciesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.HrVacanciesPage })))
const LmsCoursesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.LmsCoursesPage })))
const LmsEnrollmentsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.LmsEnrollmentsPage })))
const LmsCertificatesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.LmsCertificatesPage })))
const AnalyticsDashboardPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.AnalyticsDashboardPage })))
const CommsMessagesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.CommsMessagesPage })))
const CommsNotificationsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.CommsNotificationsPage })))
const LibraryBooksPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.LibraryBooksPage })))
const LibraryLoansPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.LibraryLoansPage })))
const EventsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.EventsPage })))
const OperationsBranchesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.OperationsBranchesPage })))
const OperationsRoomsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.OperationsRoomsPage })))
const OperationsAuditPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.OperationsAuditPage })))
const AcademicsGroupsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.AcademicsGroupsPage })))
const AcademicsLessonsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.AcademicsLessonsPage })))
const AcademicsAttendancePage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.AcademicsAttendancePage })))
const AcademicsQuizzesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.AcademicsQuizzesPage })))
const GamificationPurchasesPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.GamificationPurchasesPage })))
const AnalyticsReportsPage = lazy(() => import('@/features/admin/modules').then(m => ({ default: m.AnalyticsReportsPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="h-10 w-10 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-blue-600 animate-spin" />
    </div>
  )
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated || !user) return <Navigate to="/" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

interface RouteConfig {
  path: string
  roles: string[]
  element: React.ReactNode
}

// Конфигурация всех маршрутов платформы
function buildRoutes(): RouteConfig[] {
  const adminRoles = ADMIN_ROLES

  return [
    // --- Enterprise Admin модули ---
    { path: '/admin/platform', roles: adminRoles, element: <PlatformDashboard /> },
    { path: '/admin/users', roles: ['superadmin', 'admin'], element: <UsersManagementPage /> },
    { path: '/admin/settings', roles: ['superadmin', 'admin'], element: <SettingsPage /> },
    { path: '/admin/academics', roles: adminRoles, element: <AcademicsOverviewPage /> },
    { path: '/admin/academics/groups', roles: adminRoles, element: <AcademicsGroupsPage /> },
    { path: '/admin/academics/lessons', roles: adminRoles, element: <AcademicsLessonsPage /> },
    { path: '/admin/academics/attendance', roles: adminRoles, element: <AcademicsAttendancePage /> },
    { path: '/admin/academics/quizzes', roles: adminRoles, element: <AcademicsQuizzesPage /> },
    { path: '/admin/crm/leads', roles: ['superadmin', 'admin', 'director'], element: <CrmLeadsPage /> },
    { path: '/admin/crm/pipeline', roles: ['superadmin', 'admin', 'director'], element: <CrmPipelinePage /> },
    { path: '/admin/crm/campaigns', roles: ['superadmin', 'admin', 'director'], element: <CrmCampaignsPage /> },
    { path: '/admin/finance/summary', roles: ['superadmin', 'admin', 'director', 'accountant'], element: <FinanceSummaryPage /> },
    { path: '/admin/finance/invoices', roles: ['superadmin', 'admin', 'director', 'accountant'], element: <FinanceInvoicesPage /> },
    { path: '/admin/finance/expenses', roles: ['superadmin', 'admin', 'director', 'accountant'], element: <FinanceExpensesPage /> },
    { path: '/admin/finance/payroll', roles: ['superadmin', 'admin', 'director', 'accountant'], element: <FinancePayrollPage /> },
    { path: '/admin/hr/employees', roles: ['superadmin', 'admin', 'director', 'hr_manager'], element: <HrEmployeesPage /> },
    { path: '/admin/hr/leaves', roles: ['superadmin', 'admin', 'director', 'hr_manager'], element: <HrLeavesPage /> },
    { path: '/admin/hr/vacancies', roles: ['superadmin', 'admin', 'director', 'hr_manager'], element: <HrVacanciesPage /> },
    { path: '/admin/lms/courses', roles: adminRoles, element: <LmsCoursesPage /> },
    { path: '/admin/lms/enrollments', roles: adminRoles, element: <LmsEnrollmentsPage /> },
    { path: '/admin/lms/certificates', roles: adminRoles, element: <LmsCertificatesPage /> },
    { path: '/admin/analytics', roles: ['superadmin', 'admin', 'director', 'accountant', 'hr_manager'], element: <AnalyticsDashboardPage /> },
    { path: '/admin/analytics/reports', roles: ['superadmin', 'admin', 'director'], element: <AnalyticsReportsPage /> },
    { path: '/admin/gamification/purchases', roles: adminRoles, element: <GamificationPurchasesPage /> },
    { path: '/admin/comms/messages', roles: adminRoles, element: <CommsMessagesPage /> },
    { path: '/admin/comms/notifications', roles: adminRoles, element: <CommsNotificationsPage /> },
    { path: '/admin/library/books', roles: adminRoles, element: <LibraryBooksPage /> },
    { path: '/admin/library/loans', roles: adminRoles, element: <LibraryLoansPage /> },
    { path: '/admin/events', roles: adminRoles, element: <EventsPage /> },
    { path: '/admin/operations/branches', roles: ['superadmin', 'admin', 'director'], element: <OperationsBranchesPage /> },
    { path: '/admin/operations/rooms', roles: ['superadmin', 'admin', 'director'], element: <OperationsRoomsPage /> },
    { path: '/admin/operations/audit', roles: ['superadmin', 'admin'], element: <OperationsAuditPage /> },

    // --- Существующие страницы ---
    { path: '/admin/dashboard', roles: adminRoles, element: <AdminDashboard /> },
    { path: '/admin/teachers', roles: adminRoles, element: <TeachersPage /> },
    { path: '/admin/students', roles: adminRoles, element: <StudentsPage /> },
    { path: '/admin/payments', roles: ['superadmin', 'admin', 'director', 'accountant'], element: <PaymentsPage /> },
    { path: '/admin/reports', roles: ['superadmin', 'admin', 'director'], element: <ReportsPage /> },
    { path: '/admin/products', roles: adminRoles, element: <AdminProducts /> },

    { path: '/teacher/dashboard', roles: ['teacher'], element: <TeacherDashboard /> },
    { path: '/teacher/groups', roles: ['teacher'], element: <TeacherGroups /> },
    { path: '/teacher/lessons', roles: ['teacher'], element: <TeacherLessons /> },
    { path: '/teacher/attendance', roles: ['teacher'], element: <TeacherAttendance /> },
    { path: '/teacher/statistics', roles: ['teacher'], element: <TeacherStatistics /> },
    { path: '/teacher/calendar', roles: ['teacher'], element: <TeacherCalendar /> },
    { path: '/teacher/quizzes', roles: ['teacher'], element: <TeacherQuizzes /> },
    { path: '/teacher/ai-test-generator', roles: ['teacher'], element: <TeacherAITestGenerator /> },
    { path: '/teacher/messages', roles: ['teacher'], element: <TeacherMessages /> },

    { path: '/student/dashboard', roles: ['student'], element: <StudentDashboard /> },
    { path: '/student/messages', roles: ['student'], element: <StudentMessages /> },
    { path: '/student/quizzes', roles: ['student'], element: <StudentQuizzes /> },
    { path: '/student/calendar', roles: ['student'], element: <StudentCalendar /> },
    { path: '/student/shop', roles: ['student'], element: <StudentShop /> },
    { path: '/student/homework', roles: ['student'], element: <StudentHomework /> },
    { path: '/student/games', roles: ['student'], element: <StudentGames /> },
    { path: '/student/tests', roles: ['student'], element: <StudentTests /> },

    { path: '/parent/dashboard', roles: ['parent'], element: <ParentDashboard /> },
    { path: '/parent/child', roles: ['parent'], element: <ParentChild /> },
    { path: '/parent/payments', roles: ['parent'], element: <ParentPayments /> },
  ]
}

export function AppRouter() {
  const { user, isAuthenticated } = useAuthStore()
  usePageTitle()
  const routes = buildRoutes()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={
          isAuthenticated && user
            ? <Navigate to={getDashboardPath(user.role)} replace />
            : <AuthPage />
        } />
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={
            <ProtectedRoute allowedRoles={route.roles}>
              <DashboardLayout>{route.element}</DashboardLayout>
            </ProtectedRoute>
          } />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
