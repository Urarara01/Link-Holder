from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    theme = models.CharField(max_length=20, default='light') # Campo para almacenar el tema preferido del usuario (light/dark)
    allow_nsfw = models.BooleanField(default=False) # Campo para indicar si el usuario permite contenido NSFW

    def __str__(self):
        return self.username
    
