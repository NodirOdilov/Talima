from django.db import models
from common.models import TimeStampedModel


class LibraryBook(TimeStampedModel):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True)
    isbn = models.CharField(max_length=20, blank=True)
    copies = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.title


class LibraryLoan(TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Активна"
        RETURNED = "returned", "Возвращена"

    book = models.ForeignKey(LibraryBook, on_delete=models.CASCADE, related_name="loans")
    student = models.ForeignKey("academics.Student", on_delete=models.CASCADE, related_name="library_loans")
    loan_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
