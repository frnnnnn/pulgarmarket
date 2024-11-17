from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import mercadopago
import json
from orders.models import Order, OrderProduct  # Importa los modelos de pedidos
from productos.models import Producto  # Importa el modelo de productos
from django.contrib.auth.models import User

sdk = mercadopago.SDK("APP_USR-6863379507941508-110923-93416db86f27794fe3c210742e7d487b-2086779169")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request):
    try:
        data = request.data
        user = request.user
        items = data.get('items', [])
        total = sum([item['quantity'] * item['price'] for item in items])
        
        # Crear el pedido preliminar
        order = Order.objects.create(user=user, total=total, status='pendiente')
        
        # Asociar productos al pedido
        for item in items:
            producto = Producto.objects.get(id=item['id'])  # Asegúrate de manejar Producto.DoesNotExist
            OrderProduct.objects.create(
                order=order,
                product=producto,
                quantity=item['quantity'],
                price=item['price']
            )

        preference_data = {
            "items": [
                {
                    "title": item['title'],
                    "quantity": int(item['quantity']),
                    "currency_id": "CLP",
                    "unit_price": float(item['price'])
                } for item in items
            ],
            "back_urls": {
                "success": f"http://localhost:3000/success?order_id={order.id}",  # Pasar el ID del pedido en la URL
                "failure": "http://localhost:3000/failure",
                "pending": "http://localhost:3000/pending"
            },
            "auto_return": "approved"
        }

        preference_response = sdk.preference().create(preference_data)
        init_point = preference_response["response"]["init_point"]
        
        return JsonResponse({"init_point": init_point}, status=200)

    except Producto.DoesNotExist:
        return JsonResponse({"error": "Producto no encontrado"}, status=404)

    except Exception as e:
        return JsonResponse({"error": f"Error al crear la preferencia de pago: {str(e)}"}, status=500)

    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from orders.models import Order, OrderProduct
from productos.models import Producto
import json

@api_view(['GET'])  # Asegúrate de que sea GET
@permission_classes([IsAuthenticated])
def success_view(request):
    user = request.user
    order_id = request.GET.get("order_id")  # Obtén el order_id de la URL

    if not order_id:
        return JsonResponse({"error": "ID del pedido no proporcionado"}, status=400)

    try:
        # Busca el pedido creado previamente
        order = Order.objects.get(id=order_id, user=user)

        # Actualiza el estado del pedido
        order.status = "procesando"
        order.save()

        # Incluye los detalles del pedido en la respuesta
        response_data = {
            "message": "¡Compra exitosa! Pedido actualizado.",
            "order_id": order.id,
            "pickup_code": order.pickup_code,
            "total": order.total,
            "status": order.status,
            "created_at": order.created_at,
            "items": [
                {
                    "product": {
                        "id": item.product.id,
                        "nombre": item.product.nombre,
                        "imagen": request.build_absolute_uri(item.product.imagen.url) if item.product.imagen else None
                    },
                    "quantity": item.quantity,
                    "price": item.price
                }
                for item in order.items.all()
            ]
        }

        return JsonResponse(response_data, status=200)

    except Order.DoesNotExist:
        return JsonResponse({"error": "Pedido no encontrado o no pertenece al usuario."}, status=404)
    
    except Exception as e:
        return JsonResponse({"error": f"Error al confirmar el pedido: {str(e)}"}, status=500)





@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def failure_view(request):
    return JsonResponse({"message": "La compra falló", "details": "Inténtalo de nuevo o verifica tu método de pago"})

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_view(request):
    return JsonResponse({"message": "Compra pendiente", "details": "Tu pago está pendiente de confirmación"})
