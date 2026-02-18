from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from accounts.views import MeView, RegisterView  # Las crearemos ahora

urlpatterns = [
    # JWT
    path("auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="refresh"),

    # Cuenta del usuario autenticado
    path("auth/me/", MeView.as_view(), name="me"),

    # Registro opcional
    path("auth/register/", RegisterView.as_view(), name="register"),
]
