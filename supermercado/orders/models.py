from django.db import models
from django.contrib.auth.models import User
from productos.models import Producto

import random

class Order(models.Model):
    ORDER_STATUS = [
        ('procesando', 'En proceso'),
        ('preparando', 'Recogiendo productos'),
        ('listo', 'Listo para retirar'),
        ('entregado', 'Entregado'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='procesando')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    pickup_code = models.CharField(max_length=4, unique=True, blank=True, null=True)  # Código único de 4 dígitos

    def save(self, *args, **kwargs):
        if not self.pickup_code:
            self.pickup_code = f"{random.randint(1000, 9999)}"  # Genera un código de 4 dígitos
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"


class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Producto, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
