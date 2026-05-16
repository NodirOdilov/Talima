"""Версия продукта Talima (источник: package.json в корне репозитория)."""
from __future__ import annotations

import json
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[2]
_PKG_PATH = _ROOT / "package.json"

_DEFAULT = "2.0.0"


def _read_package_version() -> str:
    try:
        data = json.loads(_PKG_PATH.read_text(encoding="utf-8"))
        return str(data.get("version", _DEFAULT))
    except (OSError, json.JSONDecodeError, TypeError):
        return _DEFAULT


APP_VERSION = _read_package_version()
APP_VERSION_SHORT = ".".join(APP_VERSION.split(".")[:2]) or APP_VERSION
