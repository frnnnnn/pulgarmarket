# En orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderProduct
from productos.models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'imagen_url']

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        print(f"Producto ID: {obj.id}, Imagen: {obj.imagen}, Request: {request}")  # Debugging

        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None



class OrderProductSerializer(serializers.ModelSerializer):
    product = ProductoSerializer()  # Nested serializer para incluir detalles del producto

    class Meta:
        model = OrderProduct
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderProductSerializer(many=True)  # Relación inversa definida en el modelo

    class Meta:
        model = Order
        fields = ['id', 'total' , 'status', 'created_at', 'items', 'pickup_code']
