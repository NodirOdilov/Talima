from rest_framework.response import Response
from rest_framework import status


def api_success(data=None, message=None, status_code=status.HTTP_200_OK, meta=None):
    """Унифицированный успешный ответ API (совместим с фронтендом)."""
    payload = {"success": True}
    if data is not None:
        payload["data"] = data
    if message:
        payload["message"] = message
    if meta:
        payload["meta"] = meta
    return Response(payload, status=status_code)


def api_error(error: str, status_code=status.HTTP_400_BAD_REQUEST):
    """Унифицированный ответ об ошибке."""
    return Response({"success": False, "error": error}, status=status_code)
