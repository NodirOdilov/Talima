from rest_framework.views import exception_handler
from rest_framework.response import Response


def custom_exception_handler(exc, context):
    """Обработчик исключений DRF в формате {success: false, error: ...}."""
    response = exception_handler(exc, context)
    if response is not None:
        error_msg = "Ошибка запроса"
        if isinstance(response.data, dict):
            if "detail" in response.data:
                error_msg = str(response.data["detail"])
            else:
                error_msg = str(next(iter(response.data.values())))
        elif isinstance(response.data, list):
            error_msg = str(response.data[0])
        return Response({"success": False, "error": error_msg}, status=response.status_code)
    return response
