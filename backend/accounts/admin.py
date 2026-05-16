from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "name", "email", "role", "organization", "is_active")
    list_filter = ("role", "is_active", "organization")
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Talima", {"fields": ("name", "role", "phone", "organization", "branch", "last_login_at")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Talima", {"fields": ("name", "role", "email")}),
    )
