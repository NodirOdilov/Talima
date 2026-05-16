from django.db import models
from django.conf import settings
from common.models import TimeStampedModel


class Message(TimeStampedModel):
    """Сообщение чата."""

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages")
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="received_messages"
    )
    group_id = models.CharField(max_length=100, blank=True, db_index=True)
    content = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]


class Notification(TimeStampedModel):
    """Уведомление пользователя."""

    class NotificationType(models.TextChoices):
        INFO = "info", "Информация"
        WARNING = "warning", "Предупреждение"
        SUCCESS = "success", "Успех"
        ERROR = "error", "Ошибка"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    body = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.INFO)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
