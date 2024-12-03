# serializers.py
from rest_framework import serializers
from .models import Producto, Categoria

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']

# En ProductoSerializer
class ProductoSerializer(serializers.ModelSerializer):
    categoria = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), required=False)  # No obligatorio

    class Meta:
        model = Producto
        fields = '__all__'

