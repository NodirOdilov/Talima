from django.db import models
from common.models import TimeStampedModel


class Lead(TimeStampedModel):
    """Лид CRM — потенциальный клиент."""

    class Status(models.TextChoices):
        NEW = "new", "Новый"
        CONTACTED = "contacted", "Контакт"
        QUALIFIED = "qualified", "Квалифицирован"
        CONVERTED = "converted", "Конвертирован"
        LOST = "lost", "Потерян"

    branch = models.ForeignKey(
        "organizations.Branch", on_delete=models.SET_NULL, null=True, blank=True, related_name="leads"
    )
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32)
    email = models.EmailField(blank=True)
    source = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.full_name


class Campaign(TimeStampedModel):
    """Маркетинговая кампания."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Черновик"
        ACTIVE = "active", "Активна"
        COMPLETED = "completed", "Завершена"

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)

    def __str__(self):
        return self.name
