# Архитектура платформы Talima 2.0

Документ описывает техническую архитектуру, границы доменов, потоки данных и соглашения разработки. Предназначен для инженеров, архитекторов и специалистов по внедрению.

---

## Содержание

1. [Назначение и границы системы](#1-назначение-и-границы-системы)
2. [Технологический стек](#2-технологический-стек)
3. [Логическая архитектура](#3-логическая-архитектура)
4. [Структура репозитория](#4-структура-репозитория)
5. [Слой приложений Django](#5-слой-приложений-django)
6. [Контракт API v1](#6-контракт-api-v1)
7. [Аутентификация и авторизация](#7-аутентификация-и-авторизация)
8. [Доменная модель](#8-доменная-модель)
9. [Клиентское приложение](#9-клиентское-приложение)
10. [Инфраструктура и масштабирование](#10-инфраструктура-и-масштабирование)
11. [Соглашения и расширение](#11-соглашения-и-расширение)

---

## 1. Назначение и границы системы

**Talima** — мультимодульная платформа класса корпоративного уровня для управления образовательными центрами. Объединяет ERP, CRM, LMS, финансы, HR, аналитику и геймификацию в едином контуре.

| Параметр | Значение |
|----------|----------|
| Версия продукта | **2.0.0** (Talima Enterprise 2.0) |
| Архитектурный стиль | Модульный монолит (backend) + одностраничное приложение (frontend) |
| Источник истины по данным | Django ORM, REST API |
| Пользовательские интерфейсы | SPA (`/app/`), маркетинговый лендинг, Django Admin |
| Интеграции | REST API, OpenAPI 3, JWT |

Система **не** является распределённым микросервисным кластером в текущей версии; горизонтальное масштабирование достигается репликацией монолита и выносом фоновых задач в Celery.

---

## 2. Технологический стек

| Слой | Компоненты | Назначение |
|------|------------|------------|
| Презентация | React 19, TypeScript 5.8, Vite 4, React Router 7 | SPA, маршрутизация, типизация |
| UI | TailwindCSS 3, shadcn/ui (Radix), Lucide, Recharts | Компоненты и визуализация |
| Состояние UI | Zustand | Локальный UI-state; бизнес-данные — с API |
| Локализация | i18next (uz, ru, en) | Интерфейс на трёх языках |
| API | Django 5.x, DRF 3.15+, SimpleJWT | REST, JWT, фильтрация, пагинация |
| Документация API | drf-spectacular | OpenAPI, Swagger UI |
| БД (разработка) | SQLite | Быстрый локальный старт |
| БД (продакшен) | PostgreSQL | Транзакционность, надёжность |
| Кэш | Redis (django-redis) | Опционально в dev, рекомендуется в prod |
| Очереди | Celery + Redis | Фоновые задачи (конфигурация готова) |
| Деплой frontend | Vercel | Статическая сборка, rewrites для SPA |
| Деплой backend | Gunicorn + WSGI | Отдельный процесс от frontend |

---

## 3. Логическая архитектура

```
                    ┌─────────────────────────────────────┐
                    │           Клиент (браузер)           │
                    │  Landing (/)  │  SPA (/app/*)        │
                    └───────────────┬─────────────────────┘
                                    │ HTTPS
                                    ▼
                    ┌─────────────────────────────────────┐
                    │         Django REST API              │
                    │  /api/v1/*  │  /api/docs  │ /admin  │
                    │  JWT │ RolePermission │ ViewSets      │
                    └───────────────┬─────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
   │  PostgreSQL │          │    Redis    │          │   Celery    │
   │  / SQLite   │          │   (кэш)     │          │  (workers)  │
   └─────────────┘          └─────────────┘          └─────────────┘
```

### Поток аутентифицированного запроса

1. Клиент отправляет `POST /api/v1/auth/login` с учётными данными.
2. Сервер возвращает JWT (`accessToken`, `refreshToken`) и профиль пользователя.
3. Клиент сохраняет токен и передаёт заголовок `Authorization: Bearer <token>`.
4. ViewSet проверяет `IsAuthenticated` и `RolePermission` по `allowed_roles`.
5. Ответ оборачивается в единый формат `{ "success": true, "data": ... }`.

### Разделение ответственности

| Зона | Ответственность backend | Ответственность frontend |
|------|-------------------------|--------------------------|
| Бизнес-правила | Модели, сериализаторы, permissions | — |
| Персистентность | ORM, миграции | — |
| Представление | Django Admin | React-компоненты, маршруты |
| Навигация по ролям | Проверка прав на API | `AppRouter`, `navigation.config` |
| CRUD-экраны | ViewSet + serializers | `ResourceCrudPage`, `resourceConfigs` |

---

## 4. Структура репозитория

```
Talima/
├── backend/
│   ├── config/              # settings, urls, wsgi, celery
│   ├── api/v1/              # urls, viewsets, serializers, views
│   ├── common/              # TalimaViewSet, responses, permissions
│   ├── accounts/            # User, JWT, seed_data
│   ├── organizations/       # Organization, Branch
│   ├── crm/                 # Lead, Campaign
│   ├── academics/           # Student, Teacher, Group, Lesson, Quiz
│   ├── finance/             # Payment, Invoice, Expense, Payroll
│   ├── hr/                  # Employee, Leave, Vacancy
│   ├── lms/                 # Course, Enrollment, Certificate
│   ├── communications/      # Message, Notification
│   ├── gamification/        # Product, Purchase, PointTransaction
│   ├── library_app/         # LibraryBook, LibraryLoan
│   ├── events_app/          # Event
│   └── operations/          # Room, AuditLog
├── src/
│   ├── core/                # apiClient, routing, config, hooks
│   ├── features/            # admin modules, ResourceCrudPage
│   ├── pages/               # role-based pages
│   ├── components/          # ui, layout, brand
│   ├── store/               # Zustand
│   └── assets/translate/    # i18n JSON
├── landing/                 # статический маркетинговый сайт
├── public/                  # favicon, PWA manifest
├── docs/                    # документация
└── scripts/                 # post-build (copy-landing)
```

---

## 5. Слой приложений Django

Каждое приложение инкапсулирует домен: модели, admin, при необходимости — тесты. HTTP-слой сосредоточен в `api/v1/`.

| Приложение | Ключевые модели | ViewSet / views |
|------------|-----------------|-----------------|
| `accounts` | User (кастомная модель) | UserViewSet, LoginView, MeView |
| `organizations` | Organization, Branch | OrganizationViewSet, BranchViewSet |
| `crm` | Lead, Campaign | LeadViewSet, CampaignViewSet, PipelineView |
| `academics` | Student, Teacher, Group, Lesson, Attendance, Quiz | Соответствующие ViewSet |
| `finance` | Payment, Invoice, Expense, Payroll | + FinanceSummaryView |
| `hr` | Employee, Leave, Vacancy | ViewSet |
| `lms` | Course, Enrollment, Certificate | ViewSet |
| `communications` | Message, Notification | ViewSet |
| `gamification` | Product, Purchase, PointTransaction | ViewSet |
| `library_app` | LibraryBook, LibraryLoan | ViewSet |
| `events_app` | Event | EventViewSet |
| `operations` | Room, AuditLog | ViewSet, list-only audit |

Базовый класс **`TalimaViewSet`** (`common/viewsets.py`) унифицирует ответы для фронтенда и обрабатывает ошибки валидации.

---

## 6. Контракт API v1

**Базовый префикс:** `/api/v1/`

### Формат успешного ответа

```json
{
  "success": true,
  "data": { }
}
```

### Формат ошибки

```json
{
  "success": false,
  "error": "Текст ошибки"
}
```

### Соглашение по именованию полей

- Входящие JSON от frontend: поддержка **camelCase** через `to_internal_value` в сериализаторах.
- Исходящие данные: **camelCase** в `to_representation` (`fullName`, `groupId`, `teacherId`).

### Пагинация

DRF `PageNumberPagination`, размер страницы по умолчанию: 50. При пагинации meta может содержать `page`, `total`.

### Служебные эндпоинты

| Путь | Метод | Назначение |
|------|-------|------------|
| `/api/health` | GET | Проверка доступности |
| `/api/docs/` | GET | Swagger UI |
| `/api/schema/` | GET | OpenAPI schema |

---

## 7. Аутентификация и авторизация

### JWT (SimpleJWT)

| Параметр | По умолчанию (dev) |
|----------|-------------------|
| Access token | 10080 минут (7 дней) |
| Refresh token | 30 дней |
| Заголовок | `Authorization: Bearer` |

### Роли

`superadmin`, `admin`, `director`, `accountant`, `hr_manager`, `teacher`, `student`, `parent`

### Механизм проверки

- **`RolePermission`** — проверка `allowed_roles` на ViewSet или APIView.
- **`ADMIN_ROLES`** — расширенный доступ к админ-разделам платформы.
- Профиль **`/auth/me`** возвращает `teacherId` и `studentId` при наличии связанных записей.

---

## 8. Доменная модель

### Карта доменов

```
Organization ──< Branch
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
  CRM           Academics        Finance
 Lead          Student            Payment
Campaign       Teacher           Invoice
               Group              Expense
               Lesson             Payroll
```

### Связи академического контура

- `Teacher` — OneToOne с `User`.
- `Student` — опционально OneToOne с `User`, ForeignKey на `Group`.
- `Lesson`, `AttendanceRecord`, `Quiz` — привязаны к группам и ученикам.
- `ParentProfile` — связь с `Student` через промежуточную модель.

### Геймификация

- `Product` — товар за баллы.
- `Purchase` — списание баллов с `Student.points` при создании (логика в сериализаторе).
- `PointTransaction` — журнал начислений и списаний.

---

## 9. Клиентское приложение

### Маршрутизация

- Базовый путь сборки: `/app/` (`vite.config.ts`, `base`).
- Защита маршрутов: `ProtectedRoute` + `allowedRoles` в `AppRouter`.
- Стартовая страница после входа зависит от роли (`getDashboardPath`).

### Универсальный CRUD

| Компонент | Файл | Назначение |
|-----------|------|------------|
| `ResourceCrudPage` | `features/platform/components/` | Таблица, поиск, диалог создания/редактирования |
| `resourceConfigs.ts` | `features/admin/modules/` | Поля, endpoint, иконка модуля |
| `specialPages.tsx` | `features/admin/modules/` | Dashboard, pipeline, отчёты |

### HTTP-клиент

`src/core/api/client.ts` — обёртка над `fetch`, хранение JWT в `localStorage` (`talima-token`), единая обработка `{ success, data, error }`.

### Локальное состояние (Zustand)

Используется для UI-фич, не дублирующих API: чат, календарь, квизы, помодоро. Постепенная миграция на backend — по модулям.

---

## 10. Инфраструктура и масштабирование

### Разработка

```bash
npm run dev:api    # Django :8001
npm run dev        # Vite :5173, proxy /api → backend
```

### Продакшен (рекомендации)

| Компонент | Рекомендация |
|-----------|--------------|
| Backend | Gunicorn, несколько workers, за reverse proxy (Nginx) |
| БД | PostgreSQL, резервное копирование |
| Секреты | `SECRET_KEY`, `DATABASE_URL` через переменные окружения |
| CORS | Явный список origins SPA |
| Статика frontend | Vercel или CDN; `vercel.json` в репозитории |
| Redis | Кэш и брокер Celery |
| Мониторинг | Healthcheck `/api/health`, логирование WSGI |

### Сборка frontend

```bash
npm run build
```

Результат: `dist/app/` (SPA), корень `dist/` (landing + brand assets через `scripts/copy-landing.mjs`).

---

## 11. Соглашения и расширение

### Добавление нового домена

1. Создать Django-приложение с моделями и миграциями.
2. Добавить сериализатор и ViewSet в `api/v1/`.
3. Зарегистировать маршруты в `api/v1/urls.py` через хелпер `crud()`.
4. Добавить `ResourceConfig` и страницу в `features/admin/modules/`.
5. Обновить `navigation.config.ts` и `AppRouter.tsx`.
6. Дополнить seed в `seed_data` при необходимости.

### Стиль кода

- Backend: PEP 8, комментарии на русском, `black` / `ruff`.
- Frontend: TypeScript strict, ESLint, без `any` без обоснования.

### Версионирование API

**Версия продукта:** **2.0.0** (Talima Enterprise 2.0). Источник истины — поле `version` в корневом `package.json`; бэкенд читает его через `backend/config/version.py`, фронтенд — через `VITE_APP_VERSION` в сборке Vite.

**Версия REST API:** префикс **`/api/v1/`** (контракт маршрутов). Обратно несовместимые изменения API — только через новый префикс (`/api/v2/`) с периодом поддержки v1.

---

## Связанные документы

| Документ | Содержание |
|----------|------------|
| [README.md](../README.md) | Обзор, быстрый старт, демо-аккаунты |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Процесс разработки и PR |
| [SECURITY.md](../SECURITY.md) | Политика безопасности |

**Демо-пароль для локальной среды:** `talima2026`
