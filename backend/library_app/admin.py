from django.contrib import admin
from .models import LibraryBook, LibraryLoan

admin.site.register(LibraryBook)
admin.site.register(LibraryLoan)
