"""
URL configuration for supermercado project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from productos.views import ProductoViewSet
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.response import Response


from accounts.views import perfil

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('auth/', include('accounts.urls')),  
    path('auth/perfil/', perfil, name='perfil'),
    path('payments/', include('payments.urls')),  # Incluye las URLs de la app `payments`    
    path('products/', include('productos.urls')),  # Incluye las URLs de `productos`
    path('orders/', include('orders.urls')),
    

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)