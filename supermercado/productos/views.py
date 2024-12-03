from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from .models import Producto, Categoria
from .serializers import ProductoSerializer, CategoriaSerializer
from django.views.decorators.cache import never_cache
from rest_framework.exceptions import NotFound


# Vista para listar productos
class ProductoViewSet(viewsets.ViewSet):
    def list(self, request):
        """
        Lista todos los productos disponibles, filtrando por categoría si se proporciona.
        """
        categoria_id = request.query_params.get('categoria', None)
        if categoria_id:
            # Verificar si la categoría existe
            categoria = get_object_or_404(Categoria, id=categoria_id)
            productos = Producto.objects.filter(categoria=categoria).order_by('-creado')
        else:
            productos = Producto.objects.all().order_by('-creado')
        serializer = ProductoSerializer(productos, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, slug=None):
        """
        Obtiene un producto específico por slug.
        """
        producto = get_object_or_404(Producto, slug=slug)  # Consulta directamente
        serializer = ProductoSerializer(producto, context={'request': request})
        return Response(serializer.data)


class CategoriaViewSet(viewsets.ViewSet):
    def list(self, request):
        """
        Lista todas las categorías disponibles.
        """
        try:
            categorias = Categoria.objects.all()  # Consulta todas las categorías
            if not categorias:
                raise NotFound(detail="No hay categorías disponibles.")
            
            serializer = CategoriaSerializer(categorias, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": f"Hubo un problema al obtener las categorías: {str(e)}"}, status=500)
    def retrieve(self, request, pk=None):
        """
        Obtiene una categoría específica por ID.
        """
        categoria = get_object_or_404(Categoria, pk=pk)
        serializer = CategoriaSerializer(categoria)
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
        print("Producto eliminado exitosamente")
        return Response({"message": "Producto eliminado exitosamente"}, status=200)
    except Exception as e:
        print("Error al eliminar el producto:", e)
        return Response({"error": f"Hubo un problema al eliminar el producto: {str(e)}"}, status=500)
