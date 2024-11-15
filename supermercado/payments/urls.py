from django.urls import path
from . import views

urlpatterns = [
    path('create_payment/', views.create_payment, name='create_payment'),
    path('success/', views.success_view, name='success'),
    path('failure/', views.failure_view, name='failure'),
    path('pending/', views.pending_view, name='pending'),
]
