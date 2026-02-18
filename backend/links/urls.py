from rest_framework import routers
from .views import LinkViewSet, CategoryViewSet, TagViewSet, CollectionViewSet, NoteViewSet

router = routers.DefaultRouter()
router.register(r'links', LinkViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'collections', CollectionViewSet)
router.register(r'notes', NoteViewSet)

urlpatterns = router.urls
