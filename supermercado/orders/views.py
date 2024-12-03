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
        order.status = "aprobado"
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
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True, context={'request': request})  # Ensure request context is passed
        print(serializer.data)  # Debugging to see the output
        return Response(serializer.data)
    except Exception as e:
        print("Error en my_orders_view:", e)
        return Response({"error": f"Hubo un problema al obtener los pedidos: {str(e)}"}, status=500)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_detail_view(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        serializer = OrderSerializer(order, context={'request': request})  # Incluye el contexto
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({"error": "Pedido no encontrado o no pertenece al usuario."}, status=404)
    except Exception as e:
        return Response({"error": f"Hubo un problema al obtener el pedido: {str(e)}"}, status=500)

@api_view(['GET'])
def order_detail_view_admin(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=404)
    except Exception as e:
        return Response({"error": f"Hubo un problema al obtener el pedido: {str(e)}"}, status=500)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Order
import json

# Definimos las fases posibles del pedido
ORDER_PHASES = ['procesando', 'recogiendo', 'listo', 'entregado']

@api_view(['POST'])
def verificar_codigo(request):
    try:
        # Obtener el código de retiro y la fase actual
        pickup_code = request.data.get('pickup_code')
        phase = request.data.get('phase')  # Recibimos la fase del pedido
        if not pickup_code:
            return Response({"error": "Código de retiro no proporcionado."}, status=400)
        
        if phase not in ORDER_PHASES:
            return Response({"error": "Fase del pedido no válida."}, status=400)

        # Buscar la orden con el código de retiro
        order = Order.objects.get(pickup_code=pickup_code)

        # Verificamos que el pedido no haya sido entregado aún
        if order.status == "entregado":
            return Response({"error": "Este pedido ya ha sido entregado."}, status=400)
        
        # Actualizamos el estado del pedido con la fase proporcionada
        order.status = phase
        order.save()

        return Response({
            "message": f"Pedido actualizado a fase {phase}.",
            "order_id": order.id
        }, status=200)

    except Order.DoesNotExist:
        return Response({"error": "Pedido no encontrado o código incorrecto."}, status=404)

    except Exception as e:
        return Response({"error": f"Hubo un problema al verificar el código: {str(e)}"}, status=500)


from rest_framework.permissions import IsAdminUser
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_list_orders(request):
    """
    Devuelve todos los pedidos para el administrador.
    """
    try:
        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": f"Hubo un problema al obtener los pedidos: {str(e)}"}, status=500)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_update_order_status(request, order_id):
    """
    Actualiza el estado de un pedido.
    """
    try:
        order = Order.objects.get(id=order_id)
        new_status = request.data.get('status')

        if new_status not in ['procesando', 'preparando', 'listo', 'entregado']:
            return Response({"error": "Estado no válido"}, status=400)

        order.status = new_status
        order.save()

        return Response({"message": f"Estado actualizado a {new_status}"}, status=200)
    except Order.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=404)
    except Exception as e:
        return Response({"error": f"Error al actualizar el pedido: {str(e)}"}, status=500)
    


@api_view(['GET'])
def all_orders(request):
    """
    Devuelve todos los pedidos para el administrador.
    """
    try:
        orders = Order.objects.all().order_by('-created_at')
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": f"Hubo un problema al obtener los pedidos: {str(e)}"}, status=500)