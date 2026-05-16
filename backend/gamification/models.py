from django.db import models
from common.models import TimeStampedModel


class Product(TimeStampedModel):
    """Товар в магазине наград."""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField(help_text="Цена в баллах")
    image = models.URLField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Purchase(TimeStampedModel):
    student = models.ForeignKey("academics.Student", on_delete=models.CASCADE, related_name="purchases")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="purchases")
    price = models.PositiveIntegerField()


class PointTransaction(TimeStampedModel):
    class TransactionType(models.TextChoices):
        EARNED = "earned", "Начислено"
        SPENT = "spent", "Списано"

    student = models.ForeignKey("academics.Student", on_delete=models.CASCADE, related_name="point_transactions")
    transaction_type = models.CharField(max_length=10, choices=TransactionType.choices)
    amount = models.PositiveIntegerField()
    reason = models.CharField(max_length=255)
