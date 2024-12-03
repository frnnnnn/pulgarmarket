from django.urls import path
from . import views

urlpatterns = [
    path('admin-create-product/', views.admin_create_product, name='admin_create_product'),  # Crear producto
    path('<slug:slug>/', views.ProductoViewSet.as_view({'get': 'retrieve'}), name='product-detail'),  # Detalle de producto por slug
    path('', views.ProductoViewSet.as_view({'get': 'list'}), name='product-list'),  # Listado de productos
    path('<slug:slug>/update/', views.admin_update_product, name='admin_update_product'),  # Actualizar producto
    path('<slug:slug>/delete/', views.admin_delete_product, name='admin_delete_product'),  # Eliminar producto
]
