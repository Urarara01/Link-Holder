from django.db import models

# Create your models here.
class Link(models.Model):
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='links') # Relación ForeignKey con el modelo CustomUser
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    title = models.CharField(max_length=255)
    url = models.URLField()
    domain = models.CharField(max_length=255)
    favicon = models.URLField(blank=True, null=True)

    is_nsfw = models.BooleanField(default=False)
    tags = models.ManyToManyField('Tag', blank=True) # Relación ManyToMany con el modelo Tag
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, blank=True, null=True) # Relación ForeignKey con el modelo Category

    created_at = models.DateTimeField(auto_now_add=True)
    last_opened = models.DateTimeField(blank=True, null=True)
    click_count = models.IntegerField(default=0)

    snapshot = models.URLField(blank=True, null=True) # URL de la imagen de vista previa del enlace
    def __str__(self):
        return self.name
    
class Category(models.Model):
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='categories') # Relación ForeignKey con el modelo CustomUser
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    icon = models.URLField(blank=True, null=True) # URL del icono de la categoría
    is_nsfw = models.BooleanField(default=False)
    color = models.CharField(max_length=7, blank=True, null=True) # Color en formato hexadecimal (ejemplo: #FF5733)

    def __str__(self):
        return self.name

class Tag(models.Model):
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='tags') # Relación ForeignKey con el modelo CustomUser
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Collection(models.Model):
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='collections') # Relación ForeignKey con el modelo CustomUser
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    links = models.ManyToManyField(Link, blank=True) # Relación ManyToMany con el modelo Link

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Note(models.Model):
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='notes') # Relación ForeignKey con el modelo CustomUser
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    link = models.ForeignKey(Link, on_delete=models.CASCADE, related_name='notes') # Relación ForeignKey con el modelo Link

    def __str__(self):
        return f"Note for {self.link.name} at {self.created_at}"
    
