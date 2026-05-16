"""Маршруты API v1 — полный CRUD + аналитика."""
from django.urls import path
from accounts.views import LoginView, MeView
from . import views
from . import viewsets as vs

# Хелпер: list/create + detail CRUD на одном ресурсе
def crud(prefix, viewset):
    return [
        path(prefix, viewset.as_view({"get": "list", "post": "create"}), name=f"{prefix}-list"),
        path(f"{prefix}/<int:pk>", viewset.as_view({
            "get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy",
        }), name=f"{prefix}-detail"),
    ]


urlpatterns = [
    # Auth
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/me", MeView.as_view(), name="auth-me"),

    # Core
    path("core/stats", views.CoreStatsView.as_view()),
    path("core/organization", views.OrganizationView.as_view()),
    *crud("core/branches", vs.BranchViewSet),
    *crud("core/users", vs.UserViewSet),

    # CRM
    *crud("crm/leads", vs.LeadViewSet),
    *crud("crm/campaigns", vs.CampaignViewSet),
    path("crm/pipeline", views.PipelineView.as_view()),

    # Academics
    *crud("academics/students", vs.StudentViewSet),
    *crud("academics/teachers", vs.TeacherViewSet),
    *crud("academics/groups", vs.GroupViewSet),
    *crud("academics/lessons", vs.LessonViewSet),
    *crud("academics/attendance", vs.AttendanceRecordViewSet),
    *crud("academics/quizzes", vs.QuizViewSet),
    *crud("academics/rooms", vs.RoomViewSet),

    # Finance
    *crud("finance/payments", vs.PaymentViewSet),
    *crud("finance/invoices", vs.InvoiceViewSet),
    *crud("finance/expenses", vs.ExpenseViewSet),
    *crud("finance/payroll", vs.PayrollViewSet),
    path("finance/summary", views.FinanceSummaryView.as_view()),

    # HR
    *crud("hr/employees", vs.EmployeeViewSet),
    *crud("hr/leaves", vs.LeaveViewSet),
    *crud("hr/vacancies", vs.VacancyViewSet),

    # LMS
    *crud("lms/courses", vs.CourseViewSet),
    *crud("lms/enrollments", vs.EnrollmentViewSet),
    *crud("lms/certificates", vs.CertificateViewSet),

    # Analytics
    path("analytics/dashboard", views.AnalyticsDashboardView.as_view()),
    path("analytics/reports", views.AnalyticsReportsView.as_view()),

    # Communications
    *crud("comms/messages", vs.MessageViewSet),
    *crud("comms/notifications", vs.NotificationViewSet),

    # Marketing
    path("marketing/campaigns", vs.CampaignViewSet.as_view({"get": "list"})),

    # Gamification
    *crud("gamification/products", vs.ProductViewSet),
    *crud("gamification/purchases", vs.PurchaseViewSet),
    *crud("gamification/transactions", vs.PointTransactionViewSet),

    # Library
    *crud("library/books", vs.LibraryBookViewSet),
    *crud("library/loans", vs.LibraryLoanViewSet),

    # Events
    *crud("events", vs.EventViewSet),

    # Operations
    *crud("operations/rooms", vs.RoomViewSet),
    path("operations/audit", vs.AuditLogViewSet.as_view({"get": "list"})),
    *crud("operations/branches", vs.BranchViewSet),

    # Organizations
    *crud("organizations", vs.OrganizationViewSet),
]
