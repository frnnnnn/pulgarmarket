from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderProduct
from productos.models import Producto
from .serializers import OrderSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirmar_pedido(request):
    data = request.data
    user = request.user
    items = data.get('items', [])
    total = data.get('total', 0.0)

    # Create the order
    order = Order.objects.create(user=user, total=total)

    # Add products to the order
    for item in items:
        try:
            product = Producto.objects.get(id=item['producto_id'])
            OrderProduct.objects.create(
                order=order,
                product=product,
                quantity=item['cantidad'],
                price=item['precio']
            )
        except Producto.DoesNotExist:
            return Response({"error": f"Product with id {item['producto_id']} does not exist"}, status=404)

    return Response({"message": "Pedido registrado con éxito", "order_id": order.id})



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
