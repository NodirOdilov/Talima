import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Users, GraduationCap, Target, GitBranch, Megaphone,
  DollarSign, Receipt, TrendingDown, Wallet, BarChart3, UserCog,
  CalendarOff, Briefcase, BookOpen, Award, PieChart, FileText,
  MessageSquare, Bell, Library, Calendar, ShoppingBag, Building2,
  DoorOpen, Shield, Settings, ShoppingCart, CheckCircle, Bot,
  ClipboardList, Gamepad2,
} from 'lucide-react'

export interface NavItem {
  nameKey: string
  href: string
  icon: LucideIcon
  badge?: number
}

export interface NavSection {
  titleKey: string
  items: NavItem[]
}

// Навигация для ролей enterprise-платформы
export function getNavigation(role: string, unreadCount = 0): NavSection[] {
  switch (role) {
    case 'superadmin':
    case 'admin':
      return [
        {
          titleKey: 'nav.sections.main',
          items: [
            { nameKey: 'nav.platform', href: '/admin/platform', icon: LayoutDashboard },
            { nameKey: 'navigation.dashboard', href: '/admin/dashboard', icon: BarChart3 },
          ],
        },
        {
          titleKey: 'nav.sections.crm',
          items: [
            { nameKey: 'nav.crm.leads', href: '/admin/crm/leads', icon: Target },
            { nameKey: 'nav.crm.pipeline', href: '/admin/crm/pipeline', icon: GitBranch },
            { nameKey: 'nav.crm.campaigns', href: '/admin/crm/campaigns', icon: Megaphone },
          ],
        },
        {
          titleKey: 'nav.sections.academics',
          items: [
            { nameKey: 'nav.academics.overview', href: '/admin/academics', icon: GraduationCap },
            { nameKey: 'navigation.teachers', href: '/admin/teachers', icon: Users },
            { nameKey: 'navigation.students', href: '/admin/students', icon: GraduationCap },
            { nameKey: 'common.myGroups', href: '/admin/academics/groups', icon: Users },
            { nameKey: 'navigation.lessons', href: '/admin/academics/lessons', icon: BookOpen },
            { nameKey: 'navigation.attendance', href: '/admin/academics/attendance', icon: CheckCircle },
            { nameKey: 'navigation.quizzes', href: '/admin/academics/quizzes', icon: ClipboardList },
          ],
        },
        {
          titleKey: 'nav.sections.finance',
          items: [
            { nameKey: 'nav.finance.summary', href: '/admin/finance/summary', icon: BarChart3 },
            { nameKey: 'navigation.payments', href: '/admin/payments', icon: DollarSign },
            { nameKey: 'nav.finance.invoices', href: '/admin/finance/invoices', icon: Receipt },
            { nameKey: 'nav.finance.expenses', href: '/admin/finance/expenses', icon: TrendingDown },
            { nameKey: 'nav.finance.payroll', href: '/admin/finance/payroll', icon: Wallet },
          ],
        },
        {
          titleKey: 'nav.sections.hr',
          items: [
            { nameKey: 'nav.hr.employees', href: '/admin/hr/employees', icon: UserCog },
            { nameKey: 'nav.hr.leaves', href: '/admin/hr/leaves', icon: CalendarOff },
            { nameKey: 'nav.hr.vacancies', href: '/admin/hr/vacancies', icon: Briefcase },
          ],
        },
        {
          titleKey: 'nav.sections.lms',
          items: [
            { nameKey: 'nav.lms.courses', href: '/admin/lms/courses', icon: BookOpen },
            { nameKey: 'nav.lms.enrollments', href: '/admin/lms/enrollments', icon: GraduationCap },
            { nameKey: 'nav.lms.certificates', href: '/admin/lms/certificates', icon: Award },
          ],
        },
        {
          titleKey: 'nav.sections.analytics',
          items: [
            { nameKey: 'nav.analytics.dashboard', href: '/admin/analytics', icon: PieChart },
            { nameKey: 'navigation.reports', href: '/admin/reports', icon: FileText },
            { nameKey: 'nav.analytics.reports', href: '/admin/analytics/reports', icon: FileText },
          ],
        },
        {
          titleKey: 'nav.sections.other',
          items: [
            { nameKey: 'nav.comms.messages', href: '/admin/comms/messages', icon: MessageSquare },
            { nameKey: 'nav.comms.notifications', href: '/admin/comms/notifications', icon: Bell },
            { nameKey: 'nav.library.books', href: '/admin/library/books', icon: Library },
            { nameKey: 'nav.events', href: '/admin/events', icon: Calendar },
            { nameKey: 'navigation.products', href: '/admin/products', icon: ShoppingCart },
            { nameKey: 'nav.gamification.purchases', href: '/admin/gamification/purchases', icon: ShoppingBag },
            { nameKey: 'nav.operations.branches', href: '/admin/operations/branches', icon: Building2 },
            { nameKey: 'nav.operations.rooms', href: '/admin/operations/rooms', icon: DoorOpen },
            { nameKey: 'nav.operations.audit', href: '/admin/operations/audit', icon: Shield },
            { nameKey: 'nav.users', href: '/admin/users', icon: Users },
            { nameKey: 'nav.settings', href: '/admin/settings', icon: Settings },
          ],
        },
      ]

    case 'director':
      return [
        { titleKey: 'nav.sections.main', items: [
          { nameKey: 'nav.platform', href: '/admin/platform', icon: LayoutDashboard },
          { nameKey: 'nav.analytics.dashboard', href: '/admin/analytics', icon: PieChart },
          { nameKey: 'nav.crm.leads', href: '/admin/crm/leads', icon: Target },
          { nameKey: 'nav.finance.summary', href: '/admin/finance/summary', icon: DollarSign },
          { nameKey: 'navigation.teachers', href: '/admin/teachers', icon: Users },
          { nameKey: 'navigation.students', href: '/admin/students', icon: GraduationCap },
        ]},
      ]

    case 'accountant':
      return [
        { titleKey: 'nav.sections.finance', items: [
          { nameKey: 'nav.finance.summary', href: '/admin/finance/summary', icon: BarChart3 },
          { nameKey: 'navigation.payments', href: '/admin/payments', icon: DollarSign },
          { nameKey: 'nav.finance.invoices', href: '/admin/finance/invoices', icon: Receipt },
          { nameKey: 'nav.finance.expenses', href: '/admin/finance/expenses', icon: TrendingDown },
          { nameKey: 'nav.finance.payroll', href: '/admin/finance/payroll', icon: Wallet },
        ]},
      ]

    case 'hr_manager':
      return [
        { titleKey: 'nav.sections.hr', items: [
          { nameKey: 'nav.hr.employees', href: '/admin/hr/employees', icon: UserCog },
          { nameKey: 'nav.hr.leaves', href: '/admin/hr/leaves', icon: CalendarOff },
          { nameKey: 'nav.hr.vacancies', href: '/admin/hr/vacancies', icon: Briefcase },
        ]},
      ]

    case 'teacher':
      return [
        { titleKey: 'nav.sections.main', items: [
          { nameKey: 'navigation.dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
          { nameKey: 'common.myGroups', href: '/teacher/groups', icon: Users },
          { nameKey: 'navigation.lessons', href: '/teacher/lessons', icon: BookOpen },
          { nameKey: 'navigation.attendance', href: '/teacher/attendance', icon: CheckCircle },
          { nameKey: 'common.aiTestGenerator', href: '/teacher/ai-test-generator', icon: Bot },
          { nameKey: 'navigation.statistics', href: '/teacher/statistics', icon: BarChart3 },
          { nameKey: 'navigation.calendar', href: '/teacher/calendar', icon: Calendar },
          { nameKey: 'navigation.quizzes', href: '/teacher/quizzes', icon: ClipboardList },
          { nameKey: 'navigation.messages', href: '/teacher/messages', icon: MessageSquare, badge: unreadCount },
        ]},
      ]

    case 'student':
      return [
        { titleKey: 'nav.sections.main', items: [
          { nameKey: 'navigation.dashboard', href: '/student/dashboard', icon: LayoutDashboard },
          { nameKey: 'navigation.homework', href: '/student/homework', icon: BookOpen },
          { nameKey: 'navigation.calendar', href: '/student/calendar', icon: Calendar },
          { nameKey: 'navigation.quizzes', href: '/student/quizzes', icon: ClipboardList },
          { nameKey: 'navigation.games', href: '/student/games', icon: Gamepad2 },
          { nameKey: 'navigation.tests', href: '/student/tests', icon: FileText },
          { nameKey: 'navigation.messages', href: '/student/messages', icon: MessageSquare, badge: unreadCount },
          { nameKey: 'navigation.shop', href: '/student/shop', icon: ShoppingBag },
        ]},
      ]

    case 'parent':
      return [
        { titleKey: 'nav.sections.main', items: [
          { nameKey: 'navigation.dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
          { nameKey: 'common.myChild', href: '/parent/child', icon: GraduationCap },
          { nameKey: 'navigation.payments', href: '/parent/payments', icon: DollarSign },
        ]},
      ]

    default:
      return []
  }
}

// Роли с доступом к админ-панели
export const ADMIN_ROLES = ['superadmin', 'admin', 'director', 'accountant', 'hr_manager']

export function getDashboardPath(role: string): string {
  if (ADMIN_ROLES.includes(role)) {
    if (role === 'accountant') return '/admin/finance/summary'
    if (role === 'hr_manager') return '/admin/hr/employees'
    return '/admin/platform'
  }
  return `/${role}/dashboard`
}
