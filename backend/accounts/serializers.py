from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор пользователя (camelCase для фронтенда)."""

    branchId = serializers.SerializerMethodField()
    organizationId = serializers.SerializerMethodField()
    teacherId = serializers.SerializerMethodField()
    studentId = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id", "username", "email", "name", "role",
            "branchId", "organizationId", "teacherId", "studentId",
            "phone", "avatar",
        )

    def get_branchId(self, obj):
        return str(obj.branch_id) if obj.branch_id else None

    def get_organizationId(self, obj):
        return str(obj.organization_id) if obj.organization_id else None

    def get_teacherId(self, obj):
        profile = getattr(obj, "teacher_profile", None)
        return str(profile.id) if profile else None

    def get_studentId(self, obj):
        profile = getattr(obj, "student_profile", None)
        return str(profile.id) if profile else None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(data["id"])
        return data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["username"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Неверный логин или пароль")
        if not user.is_active:
            raise serializers.ValidationError("Учётная запись заблокирована")
        attrs["user"] = user
        return attrs
