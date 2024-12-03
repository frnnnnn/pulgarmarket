from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from .models import Producto
from .serializers import ProductoSerializer
from django.views.decorators.cache import never_cache


class ProductoViewSet(viewsets.ViewSet):
    def list(self, request):
        """
        Lista todos los productos disponibles.
        """
        productos = Producto.objects.all()  # Realiza la consulta cada vez
        serializer = ProductoSerializer(productos, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, slug=None):
        """
        Obtiene un producto específico por slug.
        """
        producto = get_object_or_404(Producto, slug=slug)  # Consulta directamente
        serializer = ProductoSerializer(producto, context={'request': request})
        return Response(serializer.data)


# Crear un nuevo producto
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_create_product(request):
    """
    Crea un nuevo producto.
    """
    try:
        serializer = ProductoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": f"Hubo un problema al crear el producto: {str(e)}"}, status=500)


# Actualizar un producto existente
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_update_product(request, slug):
    """
    Actualiza un producto existente por slug.
    """
    try:
        producto = get_object_or_404(Producto, slug=slug)
        serializer = ProductoSerializer(producto, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    except Exception as e:
        return Response({"error": f"Hubo un problema al actualizar el producto: {str(e)}"}, status=500)


# Eliminar un producto
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_product(request, slug):
    """
    Elimina un producto existente por slug.
    """
    try:
        producto = get_object_or_404(Producto, slug=slug)
        producto.delete()
        print("Producto eliminado exitosamenteAAAAAAAAAAAAAAAAAAAA")
        return Response({"message": "Producto eliminado exitosamente"}, status=200)
    except Exception as e:
        print("Error al eliminar el producto:", e)
        return Response({"error": f"Hubo un problema al eliminar el producto: {str(e)}"}, status=500)
 