# En orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderProduct

class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProduct
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderProductSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'total', 'status', 'created_at', 'items']
