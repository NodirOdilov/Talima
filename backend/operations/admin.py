from django.contrib import admin
from .models import Room, AuditLog

admin.site.register(Room)
admin.site.register(AuditLog)
