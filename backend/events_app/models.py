from django.db import models
from common.models import TimeStampedModel


class Event(TimeStampedModel):
    """Мероприятие."""

    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Запланировано"
        CANCELLED = "cancelled", "Отменено"
        COMPLETED = "completed", "Завершено"

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_at = models.DateTimeField()
    end_at = models.DateTimeField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    max_attendees = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)

    def __str__(self):
        return self.title
