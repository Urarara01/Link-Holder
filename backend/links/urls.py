from django.urls import path
from rest_framework import routers
from .views import LinkViewSet, CategoryViewSet, TagViewSet, CollectionViewSet, NoteViewSet, fetch_page_title

router = routers.DefaultRouter()
router.register(r'links', LinkViewSet, basename='link')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'collections', CollectionViewSet, basename='collection')
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = [
    path('fetch-title/', fetch_page_title, name='fetch-title'),
] + router.urls
