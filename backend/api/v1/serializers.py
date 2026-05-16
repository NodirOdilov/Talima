"""Сериализаторы REST API v1."""
from rest_framework import serializers
from organizations.models import Organization, Branch
from crm.models import Lead, Campaign
from django.contrib.auth import get_user_model
from academics.models import Student, Teacher, Group, Lesson, AttendanceRecord, Quiz
from finance.models import Payment, Invoice, Expense, Payroll
from hr.models import Employee, Leave, Vacancy
from lms.models import Course, Enrollment, Certificate
from communications.models import Message, Notification
from gamification.models import Product, Purchase, PointTransaction
from library_app.models import LibraryBook, LibraryLoan
from events_app.models import Event
from operations.models import Room, AuditLog


def _id_str(value):
    return str(value) if value is not None else None


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ("id", "name", "slug", "plan")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        return d


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ("id", "name", "address", "phone", "email", "is_active", "organization_id")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        d["organizationId"] = _id_str(d.pop("organization_id", None))
        d["isActive"] = d.pop("is_active")
        return d


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ("id", "full_name", "phone", "email", "source", "status", "notes", "branch", "created_at")
        extra_kwargs = {"branch": {"required": False}}

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = dict(data)
            if "fullName" in data:
                data["full_name"] = data.pop("fullName")
            if "branchId" in data:
                data["branch"] = data.pop("branchId")
        return super().to_internal_value(data)

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        d["fullName"] = d.pop("full_name")
        d["branchId"] = _id_str(d.pop("branch_id", None))
        d["createdAt"] = d.pop("created_at")
        return d


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("id", "full_name", "phone", "email", "group", "monthly_fee", "points", "is_active")
        extra_kwargs = {"group": {"required": False}}

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = dict(data)
            for a, b in [("fullName", "full_name"), ("groupId", "group"), ("monthlyFee", "monthly_fee"), ("isActive", "is_active")]:
                if a in data:
                    data[b] = data.pop(a)
        return super().to_internal_value(data)

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        d["fullName"] = d.pop("full_name")
        d["groupId"] = _id_str(d.pop("group_id", None))
        d["monthlyFee"] = float(d.pop("monthly_fee", 0))
        d["isActive"] = d.pop("is_active")
        if instance.group:
            d["group"] = {"id": _id_str(instance.group_id), "name": instance.group.name}
        return d


class TeacherSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Teacher
        fields = ("id", "subject", "salary", "kpi", "name", "email", "user_id")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        d["userId"] = _id_str(d.pop("user_id", None))
        return d


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name", "subject", "max_students", "lesson_days", "lesson_time", "is_active", "teacher_id")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        d["teacherId"] = _id_str(d.pop("teacher_id", None))
        d["isActive"] = d.pop("is_active")
        return d


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ("id", "topic", "date", "homework", "description", "group_id")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        d["groupId"] = _id_str(d.pop("group_id", None))
        if instance.group:
            d["group"] = {"name": instance.group.name}
        return d


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id", "amount", "month", "status", "payment_date", "student_id")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        d["studentId"] = _id_str(d.pop("student_id", None))
        d["amount"] = float(d["amount"])
        if instance.student:
            d["student"] = {"fullName": instance.student.full_name}
        return d


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"


class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = "__all__"


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ("id", "full_name", "position", "department", "salary", "hire_date", "is_active")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["fullName"] = d.pop("full_name")
        d["hireDate"] = d.pop("hire_date")
        d["isActive"] = d.pop("is_active")
        return d


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = "__all__"


class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    modules_count = serializers.IntegerField(read_only=True, required=False)
    enrollments_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Course
        fields = ("id", "title", "description", "level", "is_published", "modules_count", "enrollments_count")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["isPublished"] = d.pop("is_published", False)
        return d


class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = "__all__"


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    senderName = serializers.CharField(source="sender.name", read_only=True)
    senderRole = serializers.CharField(source="sender.role", read_only=True)

    class Meta:
        model = Message
        fields = ("id", "content", "is_read", "group_id", "recipient_id", "created_at", "senderName", "senderRole")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["senderId"] = _id_str(instance.sender_id)
        d["recipientId"] = _id_str(d.pop("recipient_id", None))
        d["groupId"] = d.pop("group_id", None)
        d["isRead"] = d.pop("is_read")
        d["timestamp"] = d.pop("created_at")
        return d


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "title", "body", "notification_type", "is_read", "created_at")


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ("id", "student", "product", "price", "created_at")

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = dict(data)
            if "studentId" in data:
                data["student"] = data.pop("studentId")
            if "productId" in data:
                data["product"] = data.pop("productId")
        return super().to_internal_value(data)

    def create(self, validated_data):
        student = validated_data["student"]
        price = validated_data.get("price") or validated_data["product"].price
        if student.points < price:
            raise serializers.ValidationError("Недостаточно баллов")
        student.points -= price
        student.save(update_fields=["points"])
        validated_data["price"] = price
        return super().create(validated_data)


class LibraryBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryBook
        fields = "__all__"


class LibraryLoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = LibraryLoan
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = "__all__"


class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = ("id", "lesson", "student", "is_present", "homework_done", "points", "notes", "date")

    def to_representation(self, instance):
        d = super().to_representation(instance)
        d["id"] = _id_str(d["id"])
        d["lessonId"] = _id_str(d.pop("lesson"))
        d["studentId"] = _id_str(d.pop("student"))
        d["isPresent"] = d.pop("is_present")
        d["homeworkDone"] = d.pop("homework_done")
        return d


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ("id", "group", "title", "description", "time_limit", "is_active", "created_at")


class PointTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointTransaction
        fields = ("id", "student", "transaction_type", "amount", "reason", "created_at")


User = get_user_model()


class UserWriteSerializer(serializers.ModelSerializer):
    """Создание/редактирование пользователя."""

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ("id", "username", "email", "name", "role", "phone", "password", "organization", "branch", "is_active")

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_password("talima2026")
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
