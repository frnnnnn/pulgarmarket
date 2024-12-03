from django.urls import path
from .views import order_detail_view_admin, all_orders, confirmar_pedido, my_orders_view, order_detail_view, verificar_codigo, admin_list_orders, admin_update_order_status

urlpatterns = [
    path('confirmar-pedido/', confirmar_pedido, name='confirmar_pedido'),
    path('my-orders/', my_orders_view, name='my_orders'),
    path('order-detail/<int:order_id>/', order_detail_view, name='order_detail'),  
    path('order-detail-admin/<int:order_id>/', order_detail_view_admin, name='order_detail_admin'), 
    path('verificar-codigo/', verificar_codigo, name='verificar_codigo'),
    path('admin-list-orders/', admin_list_orders, name='admin_list_orders'),
    path('admin-update-order-status/<int:order_id>/', admin_update_order_status, name='admin_update_order_status'),
    path('all-orders/', all_orders, name='all_orders'),
]
