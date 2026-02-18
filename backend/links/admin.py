from django.contrib import admin

# Register your models here.
from .models import Link, Category, Tag, Collection, Note

admin.site.register(Link)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Collection)
admin.site.register(Note)
