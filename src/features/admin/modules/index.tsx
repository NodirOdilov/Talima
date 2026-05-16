// Экспорт всех модулей админ-панели — полный CRUD через Django API
import { ResourceCrudPage } from '@/features/platform/components/ResourceCrudPage'
import * as cfg from './resourceConfigs'
import {
  PlatformDashboard,
  CrmPipelinePage,
  FinanceSummaryPage,
  AnalyticsDashboardPage,
  AnalyticsReportsPage,
} from './specialPages'

export { PlatformDashboard, CrmPipelinePage, FinanceSummaryPage, AnalyticsDashboardPage, AnalyticsReportsPage }

export const CrmLeadsPage = () => <ResourceCrudPage config={cfg.crmLeadsConfig} />
export const CrmCampaignsPage = () => <ResourceCrudPage config={cfg.crmCampaignsConfig} />

export const AcademicsOverviewPage = () => <ResourceCrudPage config={cfg.studentsConfig} />
export const AcademicsTeachersPage = () => <ResourceCrudPage config={cfg.teachersConfig} />
export const AcademicsGroupsPage = () => <ResourceCrudPage config={cfg.groupsConfig} />
export const AcademicsLessonsPage = () => <ResourceCrudPage config={cfg.lessonsConfig} />
export const AcademicsAttendancePage = () => <ResourceCrudPage config={cfg.attendanceConfig} />
export const AcademicsQuizzesPage = () => <ResourceCrudPage config={cfg.quizzesConfig} />

export const FinancePaymentsPage = () => <ResourceCrudPage config={cfg.paymentsConfig} />
export const FinanceInvoicesPage = () => <ResourceCrudPage config={cfg.invoicesConfig} />
export const FinanceExpensesPage = () => <ResourceCrudPage config={cfg.expensesConfig} />
export const FinancePayrollPage = () => <ResourceCrudPage config={cfg.payrollConfig} />

export const HrEmployeesPage = () => <ResourceCrudPage config={cfg.employeesConfig} />
export const HrLeavesPage = () => <ResourceCrudPage config={cfg.leavesConfig} />
export const HrVacanciesPage = () => <ResourceCrudPage config={cfg.vacanciesConfig} />

export const LmsCoursesPage = () => <ResourceCrudPage config={cfg.coursesConfig} />
export const LmsEnrollmentsPage = () => <ResourceCrudPage config={cfg.enrollmentsConfig} />
export const LmsCertificatesPage = () => <ResourceCrudPage config={cfg.certificatesConfig} />

export const CommsMessagesPage = () => <ResourceCrudPage config={cfg.messagesConfig} />
export const CommsNotificationsPage = () => <ResourceCrudPage config={cfg.notificationsConfig} />

export const GamificationShopPage = () => <ResourceCrudPage config={cfg.productsConfig} />
export const GamificationPurchasesPage = () => <ResourceCrudPage config={cfg.purchasesConfig} />

export const LibraryBooksPage = () => <ResourceCrudPage config={cfg.booksConfig} />
export const LibraryLoansPage = () => <ResourceCrudPage config={cfg.loansConfig} />

export const EventsPage = () => <ResourceCrudPage config={cfg.eventsConfig} />

export const OperationsBranchesPage = () => <ResourceCrudPage config={cfg.branchesConfig} />
export const OperationsRoomsPage = () => <ResourceCrudPage config={cfg.roomsConfig} />
export const OperationsAuditPage = () => <ResourceCrudPage config={cfg.auditConfig} />

export const UsersManagementPage = () => <ResourceCrudPage config={cfg.usersConfig} />
export const SettingsPage = () => <ResourceCrudPage config={cfg.settingsOrgConfig} />
