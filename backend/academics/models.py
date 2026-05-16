from django.db import models
from django.conf import settings
from common.models import TimeStampedModel


class Teacher(TimeStampedModel):
    """Профиль преподавателя."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="teacher_profile")
    subject = models.CharField(max_length=100, blank=True)
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    kpi = models.FloatField(default=0)
    hire_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.user.name


class Group(TimeStampedModel):
    """Учебная группа."""

    branch = models.ForeignKey("organizations.Branch", on_delete=models.SET_NULL, null=True, blank=True, related_name="groups")
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True, related_name="groups")
    name = models.CharField(max_length=255)
    subject = models.CharField(max_length=100, blank=True)
    max_students = models.PositiveIntegerField(default=20)
    lesson_days = models.CharField(max_length=255, blank=True)
    lesson_time = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Student(TimeStampedModel):
    """Профиль ученика."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="student_profile"
    )
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name="students")
    monthly_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    points = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name


class ParentProfile(TimeStampedModel):
    """Профиль родителя."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="parent_profile")
    children = models.ManyToManyField(Student, through="ParentStudent", related_name="parents")

    def __str__(self):
        return self.user.name


class ParentStudent(models.Model):
    parent = models.ForeignKey(ParentProfile, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("parent", "student")


class Lesson(TimeStampedModel):
    """Урок."""

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="lessons")
    topic = models.CharField(max_length=255)
    date = models.DateTimeField()
    homework = models.TextField(blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.group.name} — {self.topic}"


class AttendanceRecord(models.Model):
    """Запись посещаемости."""

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="attendance")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendance_records")
    is_present = models.BooleanField(default=False)
    homework_done = models.BooleanField(default=False)
    points = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("lesson", "student")


class Quiz(TimeStampedModel):
    """Викторина."""

    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name="quizzes")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    time_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Минуты")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class QuizQuestion(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    question = models.TextField()
    options = models.JSONField(default=list)
    correct_option = models.PositiveSmallIntegerField()
    points = models.PositiveIntegerField(default=10)


class QuizSubmission(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="quiz_submissions")
    score = models.FloatField()
    answers = models.JSONField(default=dict)
    submitted_at = models.DateTimeField(auto_now_add=True)
