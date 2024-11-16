# En orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderProduct
from productos.models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = ['id', 'name', 'image']  # Asegúrate de que estos campos existan en el modelo Producto

class OrderProductSerializer(serializers.ModelSerializer):
    product = ProductoSerializer()  # Nested serializer para incluir detalles del producto

    class Meta:
        model = OrderProduct
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderProductSerializer(many=True, source='orderproduct_set')  # Relación inversa definida en el modelo

    class Meta:
        model = Order
        fields = ['id', 'total', 'status', 'created_at', 'items']
