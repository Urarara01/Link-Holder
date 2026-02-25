from django.contrib import admin
from django import forms

# Register your models here.
from .models import Link, Category, Tag, Collection, Note


class LinkAdminForm(forms.ModelForm):
    class Meta:
        model = Link
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and self.instance.user:
            user = self.instance.user
            self.fields['tags'].queryset = Tag.objects.filter(user=user)
            self.fields['category'].queryset = Category.objects.filter(user=user)


class LinkAdmin(admin.ModelAdmin):
    form = LinkAdminForm
    list_display = ('name', 'user', 'url', 'created_at')
    list_filter = ('user', 'is_nsfw', 'category')
    search_fields = ('name', 'url', 'description')


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'is_nsfw')
    list_filter = ('user', 'is_nsfw')


class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    list_filter = ('user',)


class CollectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    list_filter = ('user',)


class NoteAdmin(admin.ModelAdmin):
    list_display = ('link', 'user', 'created_at')
    list_filter = ('user',)


admin.site.register(Link, LinkAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Collection, CollectionAdmin)
admin.site.register(Note, NoteAdmin)
