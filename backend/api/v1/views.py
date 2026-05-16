"""
Модульные API-представления Talima v1.
Совместимы с маршрутами фронтенда (Node.js API).
"""
from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from config.version import APP_VERSION
from common.responses import api_success, api_error
from common.permissions import RolePermission, ADMIN_ROLES

from organizations.models import Organization, Branch
from crm.models import Lead, Campaign
from academics.models import Student, Teacher, Group, Lesson, AttendanceRecord
from finance.models import Payment, Invoice, Expense, Payroll
from hr.models import Employee, Leave, Vacancy
from lms.models import Course, Enrollment, Certificate
from communications.models import Message, Notification
from gamification.models import Product, Purchase, PointTransaction
from library_app.models import LibraryBook, LibraryLoan
from events_app.models import Event
from operations.models import Room, AuditLog

from .serializers import (
    LeadSerializer, BranchSerializer, StudentSerializer, TeacherSerializer,
    GroupSerializer, LessonSerializer, PaymentSerializer, InvoiceSerializer,
    ExpenseSerializer, PayrollSerializer, EmployeeSerializer, LeaveSerializer,
    VacancySerializer, CourseSerializer, EnrollmentSerializer, CertificateSerializer,
    MessageSerializer, NotificationSerializer, ProductSerializer, PurchaseSerializer,
    LibraryBookSerializer, LibraryLoanSerializer, EventSerializer, RoomSerializer,
    AuditLogSerializer, CampaignSerializer, OrganizationSerializer,
)


class HealthView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        return api_success({"message": "Talima API работает", "version": APP_VERSION, "stack": "Django"})


# --- Core ---
class CoreStatsView(APIView):
    allowed_roles = ADMIN_ROLES
    permission_classes = [IsAuthenticated, RolePermission]

    def get(self, request):
        return api_success({
            "students": Student.objects.filter(is_active=True).count(),
            "teachers": Teacher.objects.count(),
            "groups": Group.objects.filter(is_active=True).count(),
            "payments": Payment.objects.filter(status="paid").count(),
            "leads": Lead.objects.count(),
        })


class BranchListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        branches = Branch.objects.filter(is_active=True)
        return api_success(BranchSerializer(branches, many=True).data)


class OrganizationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        org = Organization.objects.first()
        if not org:
            return api_success(None)
        return api_success(OrganizationSerializer(org).data)


# --- CRM ---
class LeadListCreateView(ListCreateAPIView):
    queryset = Lead.objects.all().order_by("-created_at")
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director"}

    def list(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())
        return api_success(self.get_serializer(qs, many=True).data)

    def create(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return api_success(ser.data, status_code=201)


class CampaignListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director"}

    def get(self, request):
        return api_success(CampaignSerializer(Campaign.objects.all().order_by("-start_date"), many=True).data)


class PipelineView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director"}

    def get(self, request):
        statuses = ["new", "contacted", "qualified", "converted", "lost"]
        pipeline = [{"status": s, "count": Lead.objects.filter(status=s).count()} for s in statuses]
        return api_success(pipeline)


# --- Academics ---
class StudentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(StudentSerializer(Student.objects.select_related("group").all(), many=True).data)


class TeacherListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(TeacherSerializer(Teacher.objects.select_related("user").all(), many=True).data)


class GroupListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(GroupSerializer(Group.objects.select_related("teacher__user").all(), many=True).data)


class LessonListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lessons = Lesson.objects.select_related("group").order_by("-date")[:50]
        return api_success(LessonSerializer(lessons, many=True).data)


class AttendanceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = AttendanceRecord.objects.select_related("lesson__group", "student").order_by("-date")[:100]
        data = [
            {
                "id": str(r.id),
                "lessonId": str(r.lesson_id),
                "studentId": str(r.student_id),
                "isPresent": r.is_present,
                "homeworkDone": r.homework_done,
                "points": r.points,
                "date": r.date.isoformat(),
            }
            for r in records
        ]
        return api_success(data)


class RoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(RoomSerializer(Room.objects.filter(is_active=True), many=True).data)


# --- Finance ---
class PaymentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(PaymentSerializer(Payment.objects.select_related("student").order_by("-created_at"), many=True).data)


class InvoiceListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "accountant"}

    def get(self, request):
        return api_success(InvoiceSerializer(Invoice.objects.order_by("-created_at"), many=True).data)


class ExpenseListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "accountant"}

    def get(self, request):
        return api_success(ExpenseSerializer(Expense.objects.order_by("-date"), many=True).data)


class PayrollListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "accountant"}

    def get(self, request):
        return api_success(PayrollSerializer(Payroll.objects.order_by("-created_at"), many=True).data)


class FinanceSummaryView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "accountant"}

    def get(self, request):
        paid = Payment.objects.filter(status="paid").aggregate(t=Sum("amount"))["t"] or 0
        pending = Payment.objects.filter(status="pending").aggregate(t=Sum("amount"))["t"] or 0
        expenses = Expense.objects.aggregate(t=Sum("amount"))["t"] or 0
        return api_success({
            "totalPaid": float(paid),
            "totalPending": float(pending),
            "totalExpenses": float(expenses),
        })


# --- HR ---
class EmployeeListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "hr_manager"}

    def get(self, request):
        return api_success(EmployeeSerializer(Employee.objects.filter(is_active=True), many=True).data)


class LeaveListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "hr_manager"}

    def get(self, request):
        return api_success(LeaveSerializer(Leave.objects.select_related("employee").order_by("-start_date"), many=True).data)


class VacancyListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director", "hr_manager"}

    def get(self, request):
        return api_success(VacancySerializer(Vacancy.objects.order_by("-created_at"), many=True).data)


# --- LMS ---
class CourseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        courses = Course.objects.annotate(modules_count=Count("modules"), enrollments_count=Count("enrollments"))
        return api_success(CourseSerializer(courses, many=True).data)


class EnrollmentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(EnrollmentSerializer(Enrollment.objects.select_related("course"), many=True).data)


class CertificateListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(CertificateSerializer(Certificate.objects.order_by("-issued_at"), many=True).data)


# --- Analytics ---
class AnalyticsDashboardView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = ADMIN_ROLES

    def get(self, request):
        revenue = Payment.objects.filter(status="paid").aggregate(t=Sum("amount"))["t"] or 0
        return api_success({
            "studentsCount": Student.objects.filter(is_active=True).count(),
            "teachersCount": Teacher.objects.count(),
            "groupsCount": Group.objects.filter(is_active=True).count(),
            "revenue": float(revenue),
            "leadsCount": Lead.objects.count(),
            "activeCourses": Course.objects.filter(is_published=True).count(),
        })


class AnalyticsReportsView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director"}

    def get(self, request):
        monthly = (
            Payment.objects.values("month")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("month")
        )
        return api_success({"monthlyPayments": list(monthly)})


# --- Communications ---
class MessageListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        msgs = Message.objects.filter(sender=user) | Message.objects.filter(recipient=user)
        msgs = msgs.select_related("sender").order_by("-created_at")[:100]
        return api_success(MessageSerializer(msgs, many=True).data)

    def post(self, request):
        ser = MessageSerializer(data={**request.data, "sender": request.user.id})
        if ser.is_valid():
            ser.save(sender=request.user)
            return api_success(ser.data, status_code=201)
        return api_error(str(ser.errors))


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(user=request.user).order_by("-created_at")[:50]
        return api_success(NotificationSerializer(notifs, many=True).data)


class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        Notification.objects.filter(pk=pk, user=request.user).update(is_read=True)
        return api_success()


# --- Gamification ---
class ProductListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(ProductSerializer(Product.objects.filter(is_active=True), many=True).data)


class PurchaseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(PurchaseSerializer(Purchase.objects.select_related("product").order_by("-created_at"), many=True).data)


class PointsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        txs = PointTransaction.objects.filter(student_id=student_id).order_by("-created_at")
        return api_success([{"id": str(t.id), "type": t.transaction_type, "amount": t.amount, "reason": t.reason} for t in txs])


# --- Library ---
class LibraryBookListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(LibraryBookSerializer(LibraryBook.objects.all(), many=True).data)


class LibraryLoanListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(LibraryLoanSerializer(LibraryLoan.objects.select_related("book"), many=True).data)


# --- Events ---
class EventListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(EventSerializer(Event.objects.order_by("start_at"), many=True).data)

    def post(self, request):
        ser = EventSerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return api_success(ser.data, status_code=201)
        return api_error(str(ser.errors))


# --- Operations ---
class OperationsRoomListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin", "director"}

    def get(self, request):
        return api_success(RoomSerializer(Room.objects.select_related("branch"), many=True).data)


class AuditLogListView(APIView):
    permission_classes = [IsAuthenticated, RolePermission]
    allowed_roles = {"superadmin", "admin"}

    def get(self, request):
        logs = AuditLog.objects.order_by("-created_at")[:100]
        return api_success(AuditLogSerializer(logs, many=True).data)
