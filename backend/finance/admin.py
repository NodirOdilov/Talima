from django.contrib import admin
from .models import Payment, Invoice, Expense, Payroll

admin.site.register(Payment)
admin.site.register(Invoice)
admin.site.register(Expense)
admin.site.register(Payroll)
