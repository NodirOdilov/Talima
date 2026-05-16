from django.contrib import admin
from .models import Employee, Leave, Vacancy

admin.site.register(Employee)
admin.site.register(Leave)
admin.site.register(Vacancy)
