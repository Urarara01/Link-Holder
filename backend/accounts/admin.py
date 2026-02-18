from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin

# Register your models here.
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Preferencias', {
            'fields': ('theme', 'allow_nsfw'),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Preferencias', {
            'fields': ('theme', 'allow_nsfw'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)