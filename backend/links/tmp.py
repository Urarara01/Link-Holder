import os
import sys
import django
from pprint import pprint

# Agregar la ruta base del proyecto al PYTHONPATH
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "link_holder_backend.settings")
django.setup()

from links.models import Link
link = Link.objects.all()
# pprint(link)
# Tipo de objeto de la variable link
pprint(f"Tipo de objeto de la variable link: {type(link)}")

# Mostrar todos los objetos de la variable link
for l in link:
    pprint(l)