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