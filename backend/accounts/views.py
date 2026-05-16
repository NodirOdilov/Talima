from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from common.responses import api_success, api_error
from .serializers import LoginSerializer, UserSerializer


class LoginView(APIView):
    """POST /api/v1/auth/login — вход в систему."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            errs = serializer.errors
            msg = "Неверный логин или пароль"
            if "non_field_errors" in errs:
                msg = str(errs["non_field_errors"][0])
            return api_error(msg, 401)
        user = serializer.validated_data["user"]
        user.last_login_at = timezone.now()
        user.save(update_fields=["last_login_at"])
        refresh = RefreshToken.for_user(user)
        return api_success({
            "user": UserSerializer(user).data,
            "accessToken": str(refresh.access_token),
            "refreshToken": str(refresh),
        })


class MeView(APIView):
    """GET /api/v1/auth/me — текущий пользователь."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return api_success(UserSerializer(request.user).data)
