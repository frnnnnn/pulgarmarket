from django.urls import path
from .views import MyTokenObtainPairView, register, perfil, cambiar_contrasena
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),  # Ruta para registro de usuarios
    path('login/', MyTokenObtainPairView.as_view(), name='login'),  # Usar la vista personalizada
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refrescar token JWT
    path('perfil/', perfil, name='perfil'),  # Endpoint protegido
    path('cambiar-contrasena/', cambiar_contrasena, name='cambiar_contrasena'),

]
