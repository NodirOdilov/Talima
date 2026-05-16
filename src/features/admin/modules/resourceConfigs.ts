import type { ResourceConfig } from '@/features/platform/components/ResourceCrudPage'
import {
  Target, Megaphone, GraduationCap, Users, DollarSign, Receipt,
  TrendingDown, Wallet, UserCog, CalendarOff, Briefcase, BookOpen, Award,
  MessageSquare, Bell, Library, Calendar, ShoppingBag, Building2, DoorOpen,
  Shield, Settings,
} from 'lucide-react'

const LEAD_STATUS = [
  { value: 'new', label: 'Новый' },
  { value: 'contacted', label: 'Контакт' },
  { value: 'qualified', label: 'Квалифицирован' },
  { value: 'converted', label: 'Конвертирован' },
  { value: 'lost', label: 'Потерян' },
]

const PAYMENT_STATUS = [
  { value: 'pending', label: 'Ожидает' },
  { value: 'paid', label: 'Оплачен' },
  { value: 'overdue', label: 'Просрочен' },
]

export const crmLeadsConfig: ResourceConfig = {
  title: 'CRM — Лиды',
  description: 'Управление потенциальными клиентами',
  moduleCode: 'crm',
  icon: Target,
  endpoint: '/crm/leads',
  fields: [
    { key: 'full_name', label: 'ФИО', required: true },
    { key: 'phone', label: 'Телефон', required: true },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'source', label: 'Источник' },
    { key: 'status', label: 'Статус', type: 'select', options: LEAD_STATUS },
    { key: 'notes', label: 'Заметки', type: 'textarea', col: false },
  ],
}

export const crmCampaignsConfig: ResourceConfig = {
  title: 'CRM — Кампании',
  description: 'Маркетинговые кампании',
  moduleCode: 'crm',
  icon: Megaphone,
  endpoint: '/crm/campaigns',
  fields: [
    { key: 'name', label: 'Название', required: true },
    { key: 'description', label: 'Описание', type: 'textarea', col: false },
    { key: 'start_date', label: 'Начало', type: 'date', required: true },
    { key: 'end_date', label: 'Конец', type: 'date' },
    { key: 'budget', label: 'Бюджет', type: 'number' },
    { key: 'status', label: 'Статус', type: 'select', options: [
      { value: 'draft', label: 'Черновик' },
      { value: 'active', label: 'Активна' },
      { value: 'completed', label: 'Завершена' },
    ]},
  ],
}

export const studentsConfig: ResourceConfig = {
  title: 'Ученики',
  description: 'База учеников образовательного центра',
  moduleCode: 'academics',
  icon: GraduationCap,
  endpoint: '/academics/students',
  fields: [
    { key: 'full_name', label: 'ФИО', required: true },
    { key: 'phone', label: 'Телефон' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'group', label: 'ID группы', type: 'number' },
    { key: 'monthly_fee', label: 'Оплата/мес', type: 'number' },
    { key: 'points', label: 'Баллы', type: 'number' },
    { key: 'is_active', label: 'Активен', type: 'select', options: [
      { value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' },
    ]},
  ],
}

export const teachersConfig: ResourceConfig = {
  title: 'Преподаватели',
  description: 'Профили преподавателей',
  moduleCode: 'academics',
  icon: Users,
  endpoint: '/academics/teachers',
  fields: [
    { key: 'name', label: 'ФИО', readOnly: true },
    { key: 'email', label: 'Email', readOnly: true },
    { key: 'subject', label: 'Предмет', required: true },
    { key: 'salary', label: 'Зарплата', type: 'number' },
    { key: 'kpi', label: 'KPI', type: 'number' },
  ],
}

export const groupsConfig: ResourceConfig = {
  title: 'Группы',
  description: 'Учебные группы',
  moduleCode: 'academics',
  icon: GraduationCap,
  endpoint: '/academics/groups',
  fields: [
    { key: 'name', label: 'Название', required: true },
    { key: 'subject', label: 'Предмет' },
    { key: 'teacher', label: 'ID преподавателя', type: 'number' },
    { key: 'max_students', label: 'Макс. учеников', type: 'number' },
    { key: 'lesson_days', label: 'Дни' },
    { key: 'lesson_time', label: 'Время' },
    { key: 'is_active', label: 'Активна', type: 'select', options: [
      { value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' },
    ]},
  ],
}

export const lessonsConfig: ResourceConfig = {
  title: 'Уроки',
  description: 'Расписание и темы уроков',
  moduleCode: 'academics',
  icon: BookOpen,
  endpoint: '/academics/lessons',
  fields: [
    { key: 'group', label: 'ID группы', type: 'number', required: true },
    { key: 'topic', label: 'Тема', required: true },
    { key: 'date', label: 'Дата', type: 'date', required: true },
    { key: 'homework', label: 'ДЗ', type: 'textarea', col: false },
    { key: 'description', label: 'Описание', type: 'textarea', col: false },
  ],
}

export const paymentsConfig: ResourceConfig = {
  title: 'Платежи',
  description: 'Оплаты учеников',
  moduleCode: 'finance',
  icon: DollarSign,
  endpoint: '/finance/payments',
  fields: [
    { key: 'student', label: 'ID ученика', type: 'number', required: true },
    { key: 'amount', label: 'Сумма', type: 'number', required: true },
    { key: 'month', label: 'Месяц (YYYY-MM)', required: true },
    { key: 'status', label: 'Статус', type: 'select', options: PAYMENT_STATUS },
  ],
}

export const invoicesConfig: ResourceConfig = {
  title: 'Счета',
  description: 'Выставленные счета',
  moduleCode: 'finance',
  icon: Receipt,
  endpoint: '/finance/invoices',
  fields: [
    { key: 'number', label: 'Номер', required: true },
    { key: 'amount', label: 'Сумма', type: 'number', required: true },
    { key: 'due_date', label: 'Срок', type: 'date', required: true },
    { key: 'status', label: 'Статус', type: 'select', options: [
      { value: 'draft', label: 'Черновик' },
      { value: 'sent', label: 'Отправлен' },
      { value: 'paid', label: 'Оплачен' },
    ]},
  ],
}

export const expensesConfig: ResourceConfig = {
  title: 'Расходы',
  description: 'Операционные расходы',
  moduleCode: 'finance',
  icon: TrendingDown,
  endpoint: '/finance/expenses',
  fields: [
    { key: 'category', label: 'Категория', required: true },
    { key: 'amount', label: 'Сумма', type: 'number', required: true },
    { key: 'description', label: 'Описание', type: 'textarea', col: false },
  ],
}

export const payrollConfig: ResourceConfig = {
  title: 'Зарплаты',
  description: 'Выплаты преподавателям',
  moduleCode: 'finance',
  icon: Wallet,
  endpoint: '/finance/payroll',
  fields: [
    { key: 'teacher', label: 'ID преподавателя', type: 'number' },
    { key: 'amount', label: 'Сумма', type: 'number', required: true },
    { key: 'month', label: 'Месяц', required: true },
    { key: 'status', label: 'Статус', type: 'select', options: PAYMENT_STATUS },
  ],
}

export const employeesConfig: ResourceConfig = {
  title: 'Сотрудники',
  description: 'Кадровый учёт',
  moduleCode: 'hr',
  icon: UserCog,
  endpoint: '/hr/employees',
  fields: [
    { key: 'full_name', label: 'ФИО', required: true },
    { key: 'position', label: 'Должность', required: true },
    { key: 'department', label: 'Отдел' },
    { key: 'salary', label: 'Зарплата', type: 'number' },
  ],
}

export const leavesConfig: ResourceConfig = {
  title: 'Отпуска',
  description: 'Заявки на отпуск',
  moduleCode: 'hr',
  icon: CalendarOff,
  endpoint: '/hr/leaves',
  fields: [
    { key: 'employee', label: 'ID сотрудника', type: 'number', required: true },
    { key: 'leave_type', label: 'Тип' },
    { key: 'start_date', label: 'Начало', type: 'date', required: true },
    { key: 'end_date', label: 'Конец', type: 'date', required: true },
    { key: 'status', label: 'Статус', type: 'select', options: [
      { value: 'pending', label: 'Ожидает' },
      { value: 'approved', label: 'Одобрен' },
      { value: 'rejected', label: 'Отклонён' },
    ]},
  ],
}

export const vacanciesConfig: ResourceConfig = {
  title: 'Вакансии',
  description: 'Открытые позиции',
  moduleCode: 'hr',
  icon: Briefcase,
  endpoint: '/hr/vacancies',
  fields: [
    { key: 'title', label: 'Название', required: true },
    { key: 'department', label: 'Отдел' },
    { key: 'description', label: 'Описание', type: 'textarea', col: false },
    { key: 'status', label: 'Статус', type: 'select', options: [
      { value: 'open', label: 'Открыта' },
      { value: 'closed', label: 'Закрыта' },
    ]},
  ],
}

export const coursesConfig: ResourceConfig = {
  title: 'Курсы LMS',
  description: 'Онлайн-курсы',
  moduleCode: 'lms',
  icon: BookOpen,
  endpoint: '/lms/courses',
  fields: [
    { key: 'title', label: 'Название', required: true },
    { key: 'description', label: 'Описание', type: 'textarea', col: false },
    { key: 'level', label: 'Уровень' },
    { key: 'is_published', label: 'Опубликован', type: 'select', options: [
      { value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' },
    ]},
  ],
}

export const enrollmentsConfig: ResourceConfig = {
  title: 'Зачисления',
  description: 'Зачисления на курсы',
  moduleCode: 'lms',
  icon: GraduationCap,
  endpoint: '/lms/enrollments',
  fields: [
    { key: 'course', label: 'ID курса', type: 'number', required: true },
    { key: 'student', label: 'ID ученика', type: 'number', required: true },
    { key: 'progress', label: 'Прогресс %', type: 'number' },
  ],
}

export const certificatesConfig: ResourceConfig = {
  title: 'Сертификаты',
  description: 'Выданные сертификаты',
  moduleCode: 'lms',
  icon: Award,
  endpoint: '/lms/certificates',
  fields: [
    { key: 'student', label: 'ID ученика', type: 'number', required: true },
    { key: 'course', label: 'ID курса', type: 'number' },
    { key: 'title', label: 'Название', required: true },
  ],
}

export const messagesConfig: ResourceConfig = {
  title: 'Сообщения',
  description: 'Внутренний чат',
  moduleCode: 'comms',
  icon: MessageSquare,
  endpoint: '/comms/messages',
  fields: [
    { key: 'content', label: 'Текст', type: 'textarea', required: true, col: false },
    { key: 'recipient', label: 'ID получателя', type: 'number', col: false },
    { key: 'group_id', label: 'ID группы чата', col: false },
  ],
}

export const notificationsConfig: ResourceConfig = {
  title: 'Уведомления',
  description: 'Центр уведомлений',
  moduleCode: 'comms',
  icon: Bell,
  endpoint: '/comms/notifications',
  readOnly: true,
  fields: [
    { key: 'title', label: 'Заголовок' },
    { key: 'body', label: 'Текст' },
    { key: 'notification_type', label: 'Тип' },
    { key: 'is_read', label: 'Прочитано' },
  ],
}

export const productsConfig: ResourceConfig = {
  title: 'Магазин наград',
  description: 'Товары за баллы',
  moduleCode: 'gamification',
  icon: ShoppingBag,
  endpoint: '/gamification/products',
  fields: [
    { key: 'name', label: 'Название', required: true },
    { key: 'description', label: 'Описание', type: 'textarea', col: false },
    { key: 'price', label: 'Цена (баллы)', type: 'number', required: true },
    { key: 'category', label: 'Категория' },
    { key: 'stock', label: 'Остаток', type: 'number' },
  ],
}

export const purchasesConfig: ResourceConfig = {
  title: 'Покупки',
  description: 'История покупок',
  moduleCode: 'gamification',
  icon: ShoppingBag,
  endpoint: '/gamification/purchases',
  fields: [
    { key: 'student', label: 'ID ученика', type: 'number', required: true },
    { key: 'product', label: 'ID товара', type: 'number', required: true },
    { key: 'price', label: 'Цена', type: 'number' },
  ],
}

export const booksConfig: ResourceConfig = {
  title: 'Библиотека',
  description: 'Каталог книг',
  moduleCode: 'library',
  icon: Library,
  endpoint: '/library/books',
  fields: [
    { key: 'title', label: 'Название', required: true },
    { key: 'author', label: 'Автор' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'copies', label: 'Экземпляров', type: 'number' },
  ],
}

export const loansConfig: ResourceConfig = {
  title: 'Выдача книг',
  description: 'Журнал выдачи',
  moduleCode: 'library',
  icon: Library,
  endpoint: '/library/loans',
  fields: [
    { key: 'book', label: 'ID книги', type: 'number', required: true },
    { key: 'student', label: 'ID ученика', type: 'number', required: true },
    { key: 'status', label: 'Статус', type: 'select', options: [
      { value: 'active', label: 'Активна' },
      { value: 'returned', label: 'Возвращена' },
    ]},
  ],
}

export const eventsConfig: ResourceConfig = {
  title: 'События',
  description: 'Мероприятия центра',
  moduleCode: 'events',
  icon: Calendar,
  endpoint: '/events',
  fields: [
    { key: 'title', label: 'Название', required: true },
    { key: 'description', label: 'Описание', type: 'textarea', col: false },
    { key: 'start_at', label: 'Начало', required: true },
    { key: 'end_at', label: 'Конец' },
    { key: 'location', label: 'Место' },
    { key: 'max_attendees', label: 'Макс. участников', type: 'number' },
  ],
}

export const branchesConfig: ResourceConfig = {
  title: 'Филиалы',
  description: 'Филиалы организации',
  moduleCode: 'operations',
  icon: Building2,
  endpoint: '/core/branches',
  fields: [
    { key: 'name', label: 'Название', required: true },
    { key: 'address', label: 'Адрес', type: 'textarea', col: false },
    { key: 'phone', label: 'Телефон' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'organization', label: 'ID организации', type: 'number' },
  ],
}

export const roomsConfig: ResourceConfig = {
  title: 'Кабинеты',
  description: 'Учебные кабинеты',
  moduleCode: 'operations',
  icon: DoorOpen,
  endpoint: '/operations/rooms',
  fields: [
    { key: 'branch', label: 'ID филиала', type: 'number', required: true },
    { key: 'name', label: 'Название', required: true },
    { key: 'capacity', label: 'Вместимость', type: 'number' },
    { key: 'floor', label: 'Этаж', type: 'number' },
  ],
}

export const usersConfig: ResourceConfig = {
  title: 'Пользователи',
  description: 'Учётные записи системы',
  moduleCode: 'core',
  icon: Users,
  endpoint: '/core/users',
  fields: [
    { key: 'username', label: 'Логин', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'name', label: 'Имя', required: true },
    { key: 'role', label: 'Роль', type: 'select', options: [
      { value: 'superadmin', label: 'Superadmin' },
      { value: 'admin', label: 'Admin' },
      { value: 'director', label: 'Директор' },
      { value: 'accountant', label: 'Бухгалтер' },
      { value: 'hr_manager', label: 'HR' },
      { value: 'teacher', label: 'Преподаватель' },
      { value: 'student', label: 'Ученик' },
      { value: 'parent', label: 'Родитель' },
    ]},
    { key: 'password', label: 'Пароль', col: false },
    { key: 'phone', label: 'Телефон', col: false },
  ],
}

export const settingsOrgConfig: ResourceConfig = {
  title: 'Организация',
  description: 'Настройки организации',
  moduleCode: 'core',
  icon: Settings,
  endpoint: '/organizations',
  fields: [
    { key: 'name', label: 'Название', required: true },
    { key: 'slug', label: 'Slug', required: true },
    { key: 'plan', label: 'Тариф', type: 'select', options: [
      { value: 'starter', label: 'Starter' },
      { value: 'professional', label: 'Professional' },
      { value: 'enterprise', label: 'Enterprise' },
    ]},
  ],
}

export const attendanceConfig: ResourceConfig = {
  title: 'Посещаемость',
  description: 'Журнал посещаемости',
  moduleCode: 'academics',
  icon: GraduationCap,
  endpoint: '/academics/attendance',
  fields: [
    { key: 'student', label: 'ID ученика', type: 'number', required: true },
    { key: 'lesson', label: 'ID урока', type: 'number', required: true },
    { key: 'status', label: 'Статус', type: 'select', options: [
      { value: 'present', label: 'Присутствовал' },
      { value: 'absent', label: 'Отсутствовал' },
      { value: 'late', label: 'Опоздал' },
    ]},
    { key: 'note', label: 'Заметка', type: 'textarea', col: false },
  ],
}

export const quizzesConfig: ResourceConfig = {
  title: 'Тесты / Квизы',
  description: 'Тесты для учеников',
  moduleCode: 'academics',
  icon: BookOpen,
  endpoint: '/academics/quizzes',
  fields: [
    { key: 'title', label: 'Название', required: true },
    { key: 'group', label: 'ID группы', type: 'number' },
    { key: 'questions_count', label: 'Вопросов', type: 'number' },
    { key: 'is_active', label: 'Активен', type: 'select', options: [
      { value: 'true', label: 'Да' }, { value: 'false', label: 'Нет' },
    ]},
  ],
}

export const auditConfig: ResourceConfig = {
  title: 'Аудит',
  description: 'Журнал действий (только чтение)',
  moduleCode: 'operations',
  icon: Shield,
  endpoint: '/operations/audit',
  readOnly: true,
  fields: [
    { key: 'action', label: 'Действие' },
    { key: 'entity', label: 'Сущность' },
    { key: 'entity_id', label: 'ID' },
    { key: 'created_at', label: 'Время' },
  ],
}
