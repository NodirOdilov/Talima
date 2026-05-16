from rest_framework.permissions import BasePermission


ADMIN_ROLES = {"superadmin", "admin", "director", "accountant", "hr_manager"}


class IsAuthenticatedRole(BasePermission):
    """Проверка аутентификации."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class RolePermission(BasePermission):
    """Доступ только для указанных ролей (атрибут view.allowed_roles)."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        allowed = getattr(view, "allowed_roles", None)
        if not allowed:
            return True
        return request.user.role in allowed
