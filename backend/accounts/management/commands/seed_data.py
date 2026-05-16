"""
Команда заполнения БД демо-данными: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from organizations.models import Organization, Branch
from crm.models import Lead, Campaign
from academics.models import Teacher, Student, Group, Lesson
from finance.models import Payment, Expense
from hr.models import Employee, Vacancy
from lms.models import Course, CourseModule, CourseLesson
from gamification.models import Product
from events_app.models import Event
from operations.models import Room

User = get_user_model()
PASSWORD = "talima2026"


class Command(BaseCommand):
    help = "Заполнение базы данных демо-данными Talima"

    def handle(self, *args, **options):
        self.stdout.write("[Seed] Начало заполнения...")

        org, _ = Organization.objects.get_or_create(
            slug="talima-demo",
            defaults={"name": "Talima Education Center", "plan": "enterprise"},
        )
        branch, _ = Branch.objects.get_or_create(
            organization=org,
            name="Главный филиал",
            defaults={
                "address": "г. Ташкент, ул. Навои 1",
                "phone": "+998 71 000 00 00",
                "email": "info@talima.uz",
            },
        )

        users_data = [
            ("superadmin", "super@talima.uz", "Супер Админ", "superadmin"),
            ("admin", "admin@talima.uz", "Администратор", "admin"),
            ("director", "director@talima.uz", "Директор", "director"),
            ("accountant", "accountant@talima.uz", "Бухгалтер", "accountant"),
            ("hr_manager", "hr@talima.uz", "HR Менеджер", "hr_manager"),
            ("teacher1", "teacher1@talima.uz", "Иван Преподаватель", "teacher"),
            ("student1", "student1@talima.uz", "Алиса Ученик", "student"),
            ("parent1", "parent1@talima.uz", "Сара Родитель", "parent"),
        ]

        for username, email, name, role in users_data:
            if not User.objects.filter(username=username).exists():
                User.objects.create_user(
                    username=username,
                    email=email,
                    password=PASSWORD,
                    name=name,
                    role=role,
                    organization=org,
                    branch=branch,
                )
            else:
                u = User.objects.get(username=username)
                u.set_password(PASSWORD)
                u.organization = org
                u.branch = branch
                u.save()

        teacher_user = User.objects.get(username="teacher1")
        teacher, _ = Teacher.objects.get_or_create(user=teacher_user, defaults={"subject": "Математика", "salary": 5000000, "kpi": 85})

        group, _ = Group.objects.get_or_create(
            branch=branch,
            name="Математика A",
            defaults={"subject": "Математика", "teacher": teacher, "lesson_days": "Пн,Ср,Пт", "lesson_time": "09:00-10:30"},
        )

        student_user = User.objects.get(username="student1")
        student_profile, _ = Student.objects.get_or_create(
            user=student_user,
            defaults={
                "full_name": student_user.name,
                "email": student_user.email,
                "group": group,
                "monthly_fee": 500000,
                "points": 250,
            },
        )
        if student_profile.points < 100:
            student_profile.points = 250
            student_profile.save(update_fields=["points"])

        if Student.objects.count() < 3:
            for fname in ["Боб Уилсон", "Кэрол Дэвис"]:
                if not Student.objects.filter(full_name=fname).exists():
                    Student.objects.create(full_name=fname, group=group, monthly_fee=500000, points=100)

        if not Lesson.objects.exists():
            Lesson.objects.create(
                group=group,
                topic="Введение в алгебру",
                date=timezone.now(),
                homework="Упражнения 1-10",
                description="Базовые понятия",
            )

        if not Payment.objects.exists():
            Payment.objects.create(
                student=student_profile,
                amount=500000,
                month=timezone.now().strftime("%Y-%m"),
                status="paid",
            )

        if Lead.objects.count() < 3:
            Lead.objects.create(full_name="Новый Лид 1", phone="+998901234567", source="instagram", status="new", branch=branch)
            Lead.objects.create(full_name="Новый Лид 2", phone="+998901234568", source="website", status="contacted", branch=branch)

        if not Course.objects.exists():
            c = Course.objects.create(title="Основы математики", description="Базовый курс", level="beginner", is_published=True)
            m = CourseModule.objects.create(course=c, title="Модуль 1: Алгебра", order=1)
            CourseLesson.objects.create(module=m, title="Введение в алгебру", order=1)

        if not Product.objects.exists():
            Product.objects.create(name="Премиум блокнот", description="Качественный блокнот", price=50, category="Канцелярия", stock=20)

        if not Employee.objects.exists():
            Employee.objects.create(full_name="Анна Иванова", position="Менеджер", department="Администрация", salary=4000000)

        if not Event.objects.exists():
            Event.objects.create(
                title="День открытых дверей",
                description="Экскурсия по центру",
                start_at=timezone.now() + timedelta(days=7),
                location="Главный филиал",
                max_attendees=50,
            )

        if not Room.objects.exists():
            Room.objects.create(branch=branch, name="Кабинет 101", capacity=20, floor=1)

        self.stdout.write(self.style.SUCCESS(f"[Seed] Готово. Пароль: {PASSWORD}"))
