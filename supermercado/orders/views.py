from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderProduct
from productos.models import Producto
from .serializers import OrderSerializer
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirmar_pedido(request):
    try:
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({"error": "ID del pedido no proporcionado"}, status=400)

        # Buscar el pedido y actualizar su estado
        order = Order.objects.get(id=order_id, user=request.user)
        order.status = "procesando"
        order.save()

        return Response({"message": "Pedido confirmado", "order_id": order.id}, status=200)

    except Order.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=404)

    except Exception as e:
        return Response({"error": f"Error al confirmar el pedido: {str(e)}"}, status=500)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders_view(request):
    try:
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        # Depuración: imprime el error exacto
        print("Error en my_orders_view:", e)
        return Response({"error": f"Hubo un problema al obtener los pedidos: {str(e)}"}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail_view(request, order_id):
    try:
        # Obtener el pedido por ID y verificar que pertenece al usuario autenticado
        order = Order.objects.get(id=order_id, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({"error": "Pedido no encontrado o no pertenece al usuario."}, status=404)
    except Exception as e:
        return Response({"error": f"Hubo un problema al obtener el pedido: {str(e)}"}, status=500)
