from django.contrib import admin
from .models import Teacher, Group, Student, Lesson, AttendanceRecord, Quiz, ParentProfile

admin.site.register(Teacher)
admin.site.register(Group)
admin.site.register(Student)
admin.site.register(Lesson)
admin.site.register(AttendanceRecord)
admin.site.register(Quiz)
admin.site.register(ParentProfile)
