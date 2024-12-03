from django.urls import path
from . import views

urlpatterns = [
    path('admin-create-product/', views.admin_create_product, name='admin_create_product'),
    path('categorias/', views.CategoriaViewSet.as_view({'get': 'list'}), name='categoria-list'),  # Ruta específica
    path('categorias/<int:pk>/', views.CategoriaViewSet.as_view({'get': 'retrieve'}), name='categoria-detail'),
    path('<slug:slug>/update/', views.admin_update_product, name='admin_update_product'),
    path('<slug:slug>/delete/', views.admin_delete_product, name='admin_delete_product'),
    path('<slug:slug>/', views.ProductoViewSet.as_view({'get': 'retrieve'}), name='product-detail'),
    path('', views.ProductoViewSet.as_view({'get': 'list'}), name='product-list'),
]
