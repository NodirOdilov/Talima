from django.db import models
from common.models import TimeStampedModel


class Payment(TimeStampedModel):
    """Платёж ученика."""

    class Status(models.TextChoices):
        PENDING = "pending", "Ожидает"
        PAID = "paid", "Оплачен"
        OVERDUE = "overdue", "Просрочен"

    student = models.ForeignKey("academics.Student", on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.CharField(max_length=7, help_text="YYYY-MM")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    payment_date = models.DateTimeField(null=True, blank=True)


class Invoice(TimeStampedModel):
    """Счёт на оплату."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Черновик"
        SENT = "sent", "Отправлен"
        PAID = "paid", "Оплачен"
        CANCELLED = "cancelled", "Отменён"

    number = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    due_date = models.DateField()
    paid_at = models.DateTimeField(null=True, blank=True)


class Expense(TimeStampedModel):
    """Операционный расход."""

    category = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)


class Payroll(TimeStampedModel):
    """Зарплата преподавателя."""

    class Status(models.TextChoices):
        PENDING = "pending", "Ожидает"
        PAID = "paid", "Выплачено"

    teacher = models.ForeignKey(
        "academics.Teacher", on_delete=models.SET_NULL, null=True, blank=True, related_name="payrolls"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    month = models.CharField(max_length=7)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    paid_at = models.DateTimeField(null=True, blank=True)
