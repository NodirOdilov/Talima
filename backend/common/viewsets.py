"""Базовые ViewSet с унифицированным форматом ответа {success, data}."""
from rest_framework import viewsets, status
from rest_framework.response import Response

from .responses import api_success, api_error


class TalimaViewSet(viewsets.ModelViewSet):
    """ModelViewSet с обёрткой success/data для фронтенда."""

    def _wrap_list(self, data):
        if isinstance(data, dict) and "results" in data:
            return api_success(data["results"], meta={
                "page": data.get("page"),
                "total": data.get("count"),
            })
        return api_success(data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self._wrap_list(self.get_paginated_response(serializer.data).data)
        serializer = self.get_serializer(queryset, many=True)
        return api_success(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        return api_success(self.get_serializer(instance).data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return api_error(self._format_errors(serializer.errors), status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return api_success(serializer.data, status_code=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return api_error(self._format_errors(serializer.errors), status.HTTP_400_BAD_REQUEST)
        self.perform_update(serializer)
        return api_success(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_success({"deleted": True})

    @staticmethod
    def _format_errors(errors) -> str:
        if isinstance(errors, dict):
            for v in errors.values():
                if isinstance(v, list) and v:
                    return str(v[0])
                return str(v)
        return str(errors)
