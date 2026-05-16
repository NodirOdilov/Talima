<div align="center">

# Talima

*Комплексная ERP/CRM/LMS-платформа корпоративного уровня для образовательных центров: учебный процесс, финансы, кадры, аналитика, геймификация и управление организацией.*

<br/>

![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/Django_REST-3.15+-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-ready-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Celery-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Version](https://img.shields.io/badge/version-2.0.0-6366f1?style=for-the-badge)

</div>

---

## Автор

**Nodir Odilov** — [GitHub](https://github.com/NodirOdilov)

---

## Содержание

1. [О проекте](#1-о-проекте)
2. [Ключевые возможности](#2-ключевые-возможности)
3. [Технологический стек](#3-технологический-стек)
4. [Структура репозитория](#4-структура-репозитория)
5. [Архитектура и принцип работы](#5-архитектура-и-принцип-работы)
6. [Доменная модель](#6-доменная-модель)
7. [Модули API v1](#7-модули-api-v1)
8. [Роли и разграничение доступа](#8-роли-и-разграничение-доступа)
9. [Быстрый старт](#9-быстрый-старт)
10. [Команды npm и Django](#10-команды-npm-и-django)
11. [Ручной запуск компонентов](#11-ручной-запуск-компонентов)
12. [Конфигурация окружения](#12-конфигурация-окружения)
13. [Аутентификация и формат API](#13-аутентификация-и-формат-api)
14. [Клиентское приложение](#14-клиентское-приложение)
15. [Демонстрационные учётные записи](#15-демонстрационные-учётные-записи)
16. [Сборка и развёртывание](#16-сборка-и-развёртывание)
17. [Дорожная карта](#17-дорожная-карта)
18. [Лицензия и документация](#18-лицензия-и-документация)

---

## 1. О проекте

**Talima** — продуктовая платформа для сетей и отдельных образовательных центров. Система объединяет операционное управление, продажи (CRM), академический контур, финансы, кадровый учёт, онлайн-обучение (LMS), внутренние коммуникации и мотивацию учеников через балльный магазин.

| Аспект | Описание |
|--------|----------|
| **Продукт** | B2B-решение: облачная подписка или развёртывание на инфраструктуре заказчика |
| **Пользователи** | Администрация, дирекция, бухгалтерия, HR, преподаватели, ученики, родители |
| **Интерфейсы** | Веб-приложение (`/app/`), маркетинговый лендинг, REST API для интеграций |
| **Архитектура** | Модульный монолит (Django) и одностраничное приложение (React); готовность к Redis, Celery и PostgreSQL |
| **Версия продукта** | **2.0.0** (релиз Talima Enterprise 2.0) |

Документация ориентирована на разработчиков, специалистов по внедрению и DevOps-инженеров, которым требуется единый стек с прозрачной доменной структурой и полным CRUD по бизнес-сущностям.

---

## 2. Ключевые возможности

### Управление и ядро платформы

- Мультиролевая аутентификация на JWT; профили `teacherId` и `studentId` в ответе `/auth/me`
- Управление организацией, филиалами, пользователями, журналом аудита
- Аналитические панели: KPI, воронка CRM, финансовая сводка

### CRM и маркетинг

- Учёт лидов, этапы воронки продаж, маркетинговые кампании
- Визуализация воронки на клиенте

### Академический контур

- Ученики, преподаватели, группы, уроки, посещаемость, тесты
- Универсальный CRUD-интерфейс (`ResourceCrudPage`) для сущностей API

### Финансы и кадры

- Платежи, счета, расходы, зарплатная ведомость
- Сотрудники, отпуска, вакансии

### LMS и вовлечённость

- Курсы, зачисления, сертификаты
- Магазин наград за баллы, история покупок, транзакции баллов

### Дополнительные модули

- Библиотека, мероприятия, сообщения и уведомления
- Локализация интерфейса: узбекский, русский, английский
- Документация API: OpenAPI 3, Swagger UI

---

## 3. Технологический стек

| Слой | Технологии |
|------|------------|
| **Сервер** | Python 3.12+, Django 5.x, Django REST Framework, SimpleJWT |
| **База данных** | SQLite (разработка), PostgreSQL (продакшен через `DATABASE_URL`) |
| **Кэш и очереди** | Redis, Celery (конфигурация в `settings.py`) |
| **Документация API** | drf-spectacular (OpenAPI 3, Swagger UI) |
| **Клиент** | React 19, TypeScript 5.8, Vite 4, React Router 7 |
| **Интерфейс** | TailwindCSS 3, shadcn/ui (Radix), Lucide, Recharts |
| **Состояние UI** | Zustand; бизнес-данные — источник истины на сервере |
| **Локализация** | i18next, react-i18next |
| **Качество кода** | ESLint, строгая сборка TypeScript, pytest, black, ruff |
| **Развёртывание клиента** | Vercel (`vercel.json`), статическая сборка и лендинг |

---

## 4. Структура репозитория

```
Talima/
├── backend/                         # Серверная часть (Django API)
│   ├── config/                      # Настройки, маршруты, WSGI, Celery
│   ├── api/v1/                      # ViewSet, сериализаторы, представления
│   ├── accounts/                    # Пользователи, JWT, демо-данные
│   ├── organizations/               # Организация, филиалы
│   ├── crm/                         # Лиды, кампании
│   ├── academics/                   # Учебный процесс
│   ├── finance/                     # Финансы
│   ├── hr/                          # Кадры
│   ├── lms/                         # Онлайн-курсы
│   ├── communications/              # Сообщения, уведомления
│   ├── gamification/                # Балльный магазин
│   ├── library_app/                 # Библиотека
│   ├── events_app/                  # Мероприятия
│   ├── operations/                  # Кабинеты, аудит
│   └── common/                      # Общие ViewSet, ответы, права
├── src/                             # Клиентское приложение (React)
│   ├── core/                        # HTTP-клиент, маршрутизация, конфигурация
│   ├── features/                    # Модули платформы, CRUD
│   ├── pages/                       # Страницы по ролям
│   ├── components/                  # UI, макеты, бренд
│   ├── store/                       # Локальное UI-состояние (Zustand)
│   ├── assets/translate/            # Файлы локализации
│   └── lib/                         # Утилиты, инициализация i18n
├── landing/                         # Маркетинговый сайт
├── public/                          # Иконки, manifest
├── docs/                            # Архитектурная документация
├── scripts/                         # Скрипты сборки
├── .env.example                     # Переменные Vite
└── vercel.json                      # Правила маршрутизации SPA
```

Подробная архитектура: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 5. Архитектура и принцип работы

```
┌─────────────────┐     HTTPS / JSON      ┌──────────────────────────────┐
│  React SPA      │ ◄───────────────────► │  Django REST API             │
│  localhost:5173 │   Bearer JWT          │  localhost:8001              │
│  /app/*         │   { success, data }   │  13 доменных приложений      │
└─────────────────┘                       └──────────────┬───────────────┘
                                                         │
                       ┌─────────────────────────────────┼─────────────────┐
                       ▼                                 ▼                 ▼
                 SQLite / PostgreSQL                 Redis (кэш)      Celery (фон)
```

### Жизненный цикл запроса

1. Пользователь открывает SPA, проходит аутентификацию: `POST /api/v1/auth/login`.
2. JWT сохраняется в `localStorage` (`talima-token`); далее запросы через `apiClient`.
3. Маршрутизатор (`AppRouter`) отображает страницы по роли; модули админки — `ResourceCrudPage` и ViewSet на сервере.
4. Ответ унифицирован: `{ "success": true, "data": ... }` или `{ "success": false, "error": "..." }`.

**Разделение ответственности:** бизнес-логика и хранение данных — Django; представление и навигация — React. Локальные Zustand-store используются для UI-функций (календарь, чат), которые поэтапно переносятся на API.

---

## 6. Доменная модель

| Домен | Основные сущности | Назначение |
|-------|-------------------|------------|
| **Организации** | Organization, Branch | Мультфилиальность, тарифный план |
| **Учётные записи** | User (по ролям) | Единая аутентификация |
| **CRM** | Lead, Campaign | Привлечение и конверсия |
| **Академия** | Student, Teacher, Group, Lesson, Attendance, Quiz | Учебный процесс |
| **Финансы** | Payment, Invoice, Expense, Payroll | Денежные потоки |
| **Кадры** | Employee, Leave, Vacancy | HR-контур |
| **LMS** | Course, Module, Lesson, Enrollment, Certificate | Онлайн-обучение |
| **Коммуникации** | Message, Notification | Внутренний обмен |
| **Геймификация** | Product, Purchase, PointTransaction | Мотивация учеников |
| **Библиотека** | LibraryBook, LibraryLoan | Книжный фонд |
| **События** | Event | Мероприятия центра |
| **Операции** | Room, AuditLog | Инфраструктура и безопасность |

---

## 7. Модули API v1

Базовый URL: `http://localhost:8001/api/v1/`

| Префикс | Операции | Описание |
|---------|----------|----------|
| `auth/login`, `auth/me` | POST, GET | Вход и текущий пользователь |
| `core/users`, `core/branches` | CRUD | Пользователи и филиалы |
| `organizations` | CRUD | Настройки организации |
| `crm/leads`, `crm/campaigns`, `crm/pipeline` | CRUD, GET | CRM |
| `academics/*` | CRUD | Ученики, преподаватели, группы, уроки, посещаемость, тесты |
| `finance/*` | CRUD, сводка | Платежи, счета, расходы, зарплаты |
| `hr/*` | CRUD | Сотрудники, отпуска, вакансии |
| `lms/*` | CRUD | Курсы, зачисления, сертификаты |
| `analytics/dashboard`, `analytics/reports` | GET | KPI и отчёты |
| `comms/messages`, `comms/notifications` | CRUD | Сообщения |
| `gamification/products`, `purchases`, `transactions` | CRUD | Магазин баллов |
| `library/books`, `library/loans` | CRUD | Библиотека |
| `events` | CRUD | События |
| `operations/rooms`, `operations/audit`, `operations/branches` | CRUD / список | Операции |

| Сервис | URL |
|--------|-----|
| Документация Swagger | http://localhost:8001/api/docs/ |
| Проверка доступности | `GET /api/health` |

---

## 8. Роли и разграничение доступа

| Роль | Код | Основные разделы |
|------|-----|------------------|
| Суперадминистратор | `superadmin` | Вся платформа, пользователи, аудит |
| Администратор | `admin` | CRM, академия, финансы, HR, LMS |
| Директор | `director` | Аналитика, CRM, финансы, персонал |
| Бухгалтер | `accountant` | Финансовый контур |
| HR-менеджер | `hr_manager` | Кадры |
| Преподаватель | `teacher` | Группы, уроки, посещаемость, сообщения |
| Ученик | `student` | Панель ученика, магазин, задания |
| Родитель | `parent` | Данные ребёнка, платежи |

Права на уровне API: `RolePermission` и `allowed_roles` в ViewSet.

---

## 9. Быстрый старт

### Требования

- Node.js 18 и выше
- Python 3.12 и выше
- npm 9 и выше
- Redis — опционально (кэш и Celery)

### Установка

```bash
git clone https://github.com/NodirOdilov/Talima.git
cd Talima

npm install
cd backend && pip install -r requirements.txt && cd ..

cp .env.example .env
cp backend/.env.example backend/.env

npm run db:setup
```

### Запуск (два терминала)

```bash
# Терминал 1 — API
npm run dev:api

# Терминал 2 — клиент
npm run dev
```

| Сервис | Адрес |
|--------|-------|
| Приложение | http://localhost:5173/app/ |
| API | http://localhost:8001/api/v1/ |
| Swagger | http://localhost:8001/api/docs/ |
| Django Admin | http://localhost:8001/admin/ |
| Лендинг | `npm run dev:landing` → http://localhost:4173 |

---

## 10. Команды npm и Django

### npm (корень репозитория)

| Команда | Назначение |
|---------|------------|
| `npm run dev` | Сервер разработки Vite |
| `npm run dev:api` | Django на порту 8001 |
| `npm run dev:all` | API и клиент одновременно |
| `npm run dev:landing` | Лендинг (порт 4173) |
| `npm run db:setup` | Миграции и демо-данные |
| `npm run build` | Production-сборка |
| `npm run preview` | Просмотр сборки |
| `npm run lint` | Проверка ESLint |

### Django (каталог `backend/`)

| Команда | Назначение |
|---------|------------|
| `python manage.py migrate` | Применить миграции |
| `python manage.py seed_data` | Заполнить демо-данными |
| `python manage.py createsuperuser` | Суперпользователь админки |
| `python manage.py runserver 8001` | Сервер разработки |
| `pytest` | Запуск тестов |

---

## 11. Ручной запуск компонентов

### Серверная часть

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate   # Linux / macOS
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8001
```

### Клиентская часть

```bash
npm install
echo VITE_API_URL=http://localhost:8001/api/v1 > .env
npm run dev
```

Прокси Vite направляет `/api` на `http://localhost:8001` — см. `vite.config.ts`.

---

## 12. Конфигурация окружения

### Корень проекта (`.env`)

```env
VITE_API_URL=http://localhost:8001/api/v1
```

### Сервер (`backend/.env`)

```env
DEBUG=True
SECRET_KEY=change-me-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

DATABASE_URL=sqlite:///db.sqlite3
# DATABASE_URL=postgres://user:pass@localhost:5432/talima

REDIS_URL=redis://127.0.0.1:6379/0
CELERY_BROKER_URL=redis://127.0.0.1:6379/1

JWT_ACCESS_MINUTES=10080
JWT_REFRESH_DAYS=30
```

| Переменная | Назначение |
|------------|----------|
| `SECRET_KEY` | Секретный ключ Django |
| `DATABASE_URL` | SQLite или PostgreSQL |
| `CORS_ALLOWED_ORIGINS` | Разрешённые origins клиента |
| `REDIS_URL` | Кэш |
| `CELERY_BROKER_URL` | Брокер фоновых задач |
| `JWT_*` | Срок жизни токенов |

---

## 13. Аутентификация и формат API

### Вход в систему

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "talima2026"
}
```

### Пример успешного ответа

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "username": "admin",
      "name": "Администратор",
      "role": "admin",
      "teacherId": null,
      "studentId": null
    },
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>"
  }
}
```

### Авторизованные запросы

```http
Authorization: Bearer <accessToken>
```

### Пример CRUD

```http
GET    /api/v1/academics/students
POST   /api/v1/academics/students
GET    /api/v1/academics/students/{id}
PUT    /api/v1/academics/students/{id}
PATCH  /api/v1/academics/students/{id}
DELETE /api/v1/academics/students/{id}
```

Сериализаторы возвращают поля в формате **camelCase** (`fullName`, `groupId`, `monthlyFee`).

---

## 14. Клиентское приложение

### Базовый путь

Все рабочие маршруты SPA — под префиксом `/app/` (например `/app/admin/platform`).

### Примеры маршрутов админки

| Маршрут | Модуль |
|---------|--------|
| `/admin/platform` | Панель платформы |
| `/admin/crm/leads` | CRM — лиды |
| `/admin/academics/groups` | Группы |
| `/admin/finance/summary` | Финансовая сводка |
| `/admin/lms/courses` | Курсы LMS |
| `/admin/users` | Пользователи |

### Ключевые компоненты

| Компонент | Расположение | Назначение |
|-----------|--------------|------------|
| `ResourceCrudPage` | `features/platform/components/` | Универсальный CRUD |
| `resourceConfigs.ts` | `features/admin/modules/` | Конфигурация полей |
| `AppRouter` | `core/routing/` | Защищённые маршруты |
| `navigation.config.ts` | `core/routing/` | Меню по ролям |
| `apiClient` | `core/api/client.ts` | HTTP и JWT |

---

## 15. Демонстрационные учётные записи

После `npm run db:setup` доступны пользователи с паролем **`talima2026`**:

| Логин | Роль | Назначение |
|-------|------|------------|
| `superadmin` | Суперадминистратор | Полный доступ |
| `admin` | Администратор | Управление центром |
| `director` | Директор | Аналитика и стратегия |
| `accountant` | Бухгалтер | Финансы |
| `hr_manager` | HR-менеджер | Кадры |
| `teacher1` | Преподаватель | Группа «Математика A» |
| `student1` | Ученик | Профиль и баллы |
| `parent1` | Родитель | Данные ребёнка |

---

## 16. Сборка и развёртывание

### Сборка клиента

```bash
npm run build
```

Результат: `dist/app/` (SPA), корень `dist/` (лендинг и бренд-ресурсы).

### Vercel

В репозитории настроен `vercel.json`: сборка, fallback для SPA, кэширование статики.

### Серверная часть

```bash
cd backend
gunicorn config.wsgi:application --bind 0.0.0.0:8001
```

В продакшене: `DEBUG=False`, надёжный `SECRET_KEY`, PostgreSQL, актуальный `CORS_ALLOWED_ORIGINS`.

---

## 17. Дорожная карта

| Фаза | Статус | Содержание |
|------|--------|------------|
| **1. Ядро** | Выполнено | Django API, 13 приложений, JWT, навигация |
| **2. CRUD** | Выполнено | ViewSet и ResourceCrudPage для доменов |
| **3. Real-time** | План | WebSocket-чат, push-уведомления |
| **4. Продакшен** | План | Celery, email/SMS, отказоустойчивый PostgreSQL |
| **5. Масштаб** | План | Мультитенантность, мобильное приложение, ИИ-ассистент |

---

## 18. Лицензия и документация

Проект распространяется под лицензией [MIT](LICENSE).

| Документ | Описание |
|----------|----------|
| [LICENSE](LICENSE) | Лицензия MIT |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Участие в разработке |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Кодекс поведения |
| [SECURITY.md](SECURITY.md) | Политика безопасности |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Архитектура |

**Вопросы и предложения:**

- [GitHub Issues](https://github.com/NodirOdilov/Talima/issues)
- [Nodir Odilov](https://github.com/NodirOdilov)

---

<div align="center">

**Talima** — управление образовательным центром корпоративного уровня.

*Django · React · TypeScript · OpenAPI*

</div>
