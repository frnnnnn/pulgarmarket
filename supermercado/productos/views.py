from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    lookup_field = 'slug'  # Esto permite que el ViewSet use el campo `slug` para buscar los productos

    def retrieve(self, request, *args, **kwargs):
        slug = kwargs.get('slug')
        producto = get_object_or_404(Producto, slug=slug)
        serializer = self.get_serializer(producto)
        return Response(serializer.data)
