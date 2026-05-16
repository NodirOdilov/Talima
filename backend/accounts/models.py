from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Пользователь платформы Talima с ролевой моделью."""

    class Role(models.TextChoices):
        SUPERADMIN = "superadmin", "Суперадмин"
        ADMIN = "admin", "Администратор"
        DIRECTOR = "director", "Директор"
        ACCOUNTANT = "accountant", "Бухгалтер"
        HR_MANAGER = "hr_manager", "HR менеджер"
        TEACHER = "teacher", "Преподаватель"
        STUDENT = "student", "Ученик"
        PARENT = "parent", "Родитель"

    name = models.CharField(max_length=255, verbose_name="Полное имя")
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    phone = models.CharField(max_length=32, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    organization = models.ForeignKey(
        "organizations.Organization",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    branch = models.ForeignKey(
        "organizations.Branch",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    last_login_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
