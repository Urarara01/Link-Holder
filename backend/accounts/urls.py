from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.permissions import AllowAny
from accounts.views import MeView, RegisterView  # Las crearemos ahora

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

class CustomTokenRefreshView(TokenRefreshView):
    permission_classes = [AllowAny]

urlpatterns = [
    # JWT
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("auth/refresh/", CustomTokenRefreshView.as_view(), name="refresh"),

    # Cuenta del usuario autenticado
    path("auth/me/", MeView.as_view(), name="me"),

    # Registro opcional
    path("auth/register/", RegisterView.as_view(), name="register"),
]
