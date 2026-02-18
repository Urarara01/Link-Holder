import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'link_holder_backend.settings')
django.setup()

from accounts.models import CustomUser
from links.models import Link, Category, Tag, Collection, Note
from django.utils import timezone

def create_sample_data():
    # Crear un usuario automáticamente
    user, created = CustomUser.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'testuser@example.com',
            'first_name': 'Test',
            'last_name': 'User',
        }
    )
    if created:
        user.set_password('password123')  # Establecer una contraseña
        user.save()
        print("Usuario creado:", user.username)
    else:
        print("Usuario ya existe:", user.username)

    # Crear una categoría
    category, created = Category.objects.get_or_create(
        user=user,
        name='Tecnología',
        defaults={
            'description': 'Categoría para enlaces tecnológicos',
            'icon': 'https://example.com/icon.png',
            'is_nsfw': False,
            'color': '#3498db',
        }
    )
    if created:
        print("Categoría creada:", category.name)
    else:
        print("Categoría ya existe:", category.name)

    # Crear un tag
    tag, created = Tag.objects.get_or_create(
        user=user,
        name='Python',
        defaults={
            'description': 'Tag para enlaces relacionados con Python',
        }
    )
    if created:
        print("Tag creado:", tag.name)
    else:
        print("Tag ya existe:", tag.name)

    # Crear una colección
    collection, created = Collection.objects.get_or_create(
        user=user,
        name='Mis Favoritos',
        defaults={
            'description': 'Colección de enlaces favoritos',
        }
    )
    if created:
        print("Colección creada:", collection.name)
    else:
        print("Colección ya existe:", collection.name)

    # Crear un enlace con todas las propiedades
    link, created = Link.objects.get_or_create(
        user=user,
        url='https://www.djangoproject.com/',
        defaults={
            'name': 'Django Official Site',
            'description': 'Sitio oficial del framework Django para Python',
            'title': 'Django: The web framework for perfectionists with deadlines',
            'domain': 'djangoproject.com',
            'favicon': 'https://www.djangoproject.com/favicon.ico',
            'is_nsfw': False,
            'category': category,
            'last_opened': timezone.now(),
            'click_count': 5,
            'snapshot': 'https://example.com/snapshot.png',
        }
    )
    if created:
        link.tags.add(tag)  # Agregar el tag al enlace
        print("Enlace creado:", link.name)
    else:
        print("Enlace ya existe:", link.name)

    # Agregar el enlace a la colección
    collection.links.add(link)
    print("Enlace agregado a la colección:", collection.name)

    # Crear una nota para el enlace
    note, created = Note.objects.get_or_create(
        user=user,
        link=link,
        content='Esta es una nota de ejemplo para el enlace de Django. Me recuerda que debo revisar la documentación.',
        defaults={
            'created_at': timezone.now(),
        }
    )
    if created:
        print("Nota creada para el enlace:", link.name)
    else:
        print("Nota ya existe para el enlace:", link.name)

if __name__ == '__main__':
    create_sample_data()
    print("Datos de muestra creados exitosamente.")