from django.urls import path
from .views import confirmar_pedido, my_orders_view  # Use the function name instead

urlpatterns = [
    path('confirmar-pedido/', confirmar_pedido, name='confirmar_pedido'),
    path('my-orders/', my_orders_view, name='my_orders'),  # Updated to use my_orders_view
]
