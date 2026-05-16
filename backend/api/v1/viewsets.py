"""
Полные CRUD ViewSet для всех модулей Talima.
"""
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from common.viewsets import TalimaViewSet
from common.permissions import RolePermission, ADMIN_ROLES

from organizations.models import Organization, Branch
from crm.models import Lead, Campaign
from academics.models import (
    Teacher, Student, Group, Lesson, AttendanceRecord, Quiz, QuizQuestion, QuizSubmission,
)
from finance.models import Payment, Invoice, Expense, Payroll
from hr.models import Employee, Leave, Vacancy
from lms.models import Course, CourseModule, CourseLesson, Enrollment, Certificate
from communications.models import Message, Notification
from gamification.models import Product, Purchase, PointTransaction
from library_app.models import LibraryBook, LibraryLoan
from events_app.models import Event
from operations.models import Room, AuditLog

from accounts.serializers import UserSerializer
from . import serializers as s

# UserWriteSerializer определён в serializers.py

User = get_user_model()


class OrganizationViewSet(TalimaViewSet):
    queryset = Organization.objects.all()
    serializer_class = s.OrganizationSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin"}


class BranchViewSet(TalimaViewSet):
    queryset = Branch.objects.select_related("organization")
    serializer_class = s.BranchSerializer
    permission_classes = [IsAuthenticated]


class UserViewSet(TalimaViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin"}

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return s.UserWriteSerializer
        return UserSerializer

class LeadViewSet(TalimaViewSet):
    queryset = Lead.objects.select_related("branch").order_by("-created_at")
    serializer_class = s.LeadSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director"}
    filterset_fields = ["status", "source", "branch"]
    search_fields = ["full_name", "phone", "email"]


class CampaignViewSet(TalimaViewSet):
    queryset = Campaign.objects.order_by("-start_date")
    serializer_class = s.CampaignSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director"}


class TeacherViewSet(TalimaViewSet):
    queryset = Teacher.objects.select_related("user")
    serializer_class = s.TeacherSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["user__name", "subject"]


class StudentViewSet(TalimaViewSet):
    queryset = Student.objects.select_related("group").order_by("-created_at")
    serializer_class = s.StudentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["group", "is_active"]
    search_fields = ["full_name", "email", "phone"]


class GroupViewSet(TalimaViewSet):
    queryset = Group.objects.select_related("teacher__user", "branch")
    serializer_class = s.GroupSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["is_active", "teacher", "branch"]


class LessonViewSet(TalimaViewSet):
    queryset = Lesson.objects.select_related("group").order_by("-date")
    serializer_class = s.LessonSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["group"]


class AttendanceRecordViewSet(TalimaViewSet):
    queryset = AttendanceRecord.objects.select_related("lesson", "student")
    serializer_class = s.AttendanceRecordSerializer
    permission_classes = [IsAuthenticated]


class QuizViewSet(TalimaViewSet):
    queryset = Quiz.objects.prefetch_related("questions")
    serializer_class = s.QuizSerializer
    permission_classes = [IsAuthenticated]


class PaymentViewSet(TalimaViewSet):
    queryset = Payment.objects.select_related("student").order_by("-created_at")
    serializer_class = s.PaymentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["status", "month", "student"]


class InvoiceViewSet(TalimaViewSet):
    queryset = Invoice.objects.order_by("-created_at")
    serializer_class = s.InvoiceSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "accountant"}


class ExpenseViewSet(TalimaViewSet):
    queryset = Expense.objects.order_by("-date")
    serializer_class = s.ExpenseSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "accountant"}


class PayrollViewSet(TalimaViewSet):
    queryset = Payroll.objects.order_by("-created_at")
    serializer_class = s.PayrollSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "accountant"}


class EmployeeViewSet(TalimaViewSet):
    queryset = Employee.objects.filter(is_active=True)
    serializer_class = s.EmployeeSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "hr_manager"}


class LeaveViewSet(TalimaViewSet):
    queryset = Leave.objects.select_related("employee")
    serializer_class = s.LeaveSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "hr_manager"}


class VacancyViewSet(TalimaViewSet):
    queryset = Vacancy.objects.order_by("-created_at")
    serializer_class = s.VacancySerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "hr_manager"}


class CourseViewSet(TalimaViewSet):
    queryset = Course.objects.prefetch_related("modules__lessons")
    serializer_class = s.CourseSerializer
    permission_classes = [IsAuthenticated]


class EnrollmentViewSet(TalimaViewSet):
    queryset = Enrollment.objects.select_related("course", "student")
    serializer_class = s.EnrollmentSerializer
    permission_classes = [IsAuthenticated]


class CertificateViewSet(TalimaViewSet):
    queryset = Certificate.objects.order_by("-issued_at")
    serializer_class = s.CertificateSerializer
    permission_classes = [IsAuthenticated]


class MessageViewSet(TalimaViewSet):
    queryset = Message.objects.select_related("sender", "recipient")
    serializer_class = s.MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class NotificationViewSet(TalimaViewSet):
    queryset = Notification.objects.order_by("-created_at")
    serializer_class = s.NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class ProductViewSet(TalimaViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = s.ProductSerializer
    permission_classes = [IsAuthenticated]


class PurchaseViewSet(TalimaViewSet):
    queryset = Purchase.objects.select_related("product", "student")
    serializer_class = s.PurchaseSerializer
    permission_classes = [IsAuthenticated]


class PointTransactionViewSet(TalimaViewSet):
    queryset = PointTransaction.objects.order_by("-created_at")
    serializer_class = s.PointTransactionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["student", "transaction_type"]


class LibraryBookViewSet(TalimaViewSet):
    queryset = LibraryBook.objects.all()
    serializer_class = s.LibraryBookSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["title", "author", "isbn"]


class LibraryLoanViewSet(TalimaViewSet):
    queryset = LibraryLoan.objects.select_related("book", "student")
    serializer_class = s.LibraryLoanSerializer
    permission_classes = [IsAuthenticated]


class EventViewSet(TalimaViewSet):
    queryset = Event.objects.order_by("start_at")
    serializer_class = s.EventSerializer
    permission_classes = [IsAuthenticated]


class RoomViewSet(TalimaViewSet):
    queryset = Room.objects.select_related("branch")
    serializer_class = s.RoomSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director"}


class AuditLogViewSet(TalimaViewSet):
    queryset = AuditLog.objects.order_by("-created_at")[:500]
    serializer_class = s.AuditLogSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin"}
    http_method_names = ["get", "head", "options"]
