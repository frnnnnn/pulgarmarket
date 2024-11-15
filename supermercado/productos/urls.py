from django.urls import path
from . import views
from rest_framework.response import Response


urlpatterns = [
    path('', views.ProductoViewSet.as_view({'get': 'list'}), name='product-list'),  # Listado de productos
    path('<slug:slug>/', views.ProductoViewSet.as_view({'get': 'retrieve'}), name='product-detail'),  # Detalle de producto por slug
]
