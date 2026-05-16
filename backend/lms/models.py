from django.db import models
from common.models import TimeStampedModel


class Course(TimeStampedModel):
    """Онлайн-курс LMS."""

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=50, blank=True)
    is_published = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class CourseModule(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class CourseLesson(models.Model):
    module = models.ForeignKey(CourseModule, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]


class Enrollment(TimeStampedModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    student = models.ForeignKey("academics.Student", on_delete=models.CASCADE, related_name="enrollments")
    progress = models.FloatField(default=0)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("course", "student")


class Certificate(TimeStampedModel):
    student = models.ForeignKey("academics.Student", on_delete=models.CASCADE, related_name="certificates")
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255)
    issued_at = models.DateTimeField(auto_now_add=True)
