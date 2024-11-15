from rest_framework import serializers
from .models import Producto
from rest_framework import serializers
from django.contrib.auth.models import User



class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'



class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']  # Agrega otros campos si los necesitas
