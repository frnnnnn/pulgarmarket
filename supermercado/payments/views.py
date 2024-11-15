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
        items = data.get('items', [])
        
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
                "success": "http://localhost:3000/success",
                "failure": "http://localhost:3000/failure",
                "pending": "http://localhost:3000/pending"
            },
            "auto_return": "approved"
        }

        preference_response = sdk.preference().create(preference_data)
        init_point = preference_response["response"]["init_point"]
        
        return JsonResponse({"init_point": init_point}, status=200)
    
    except Exception as e:
        return JsonResponse({"error": "Error al crear la preferencia de pago"}, status=500)
    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from orders.models import Order, OrderProduct
from productos.models import Producto
import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def success_view(request):
    user = request.user

    # Obtener el total y los items de la solicitud
    total = request.data.get("total")
    items = request.data.get("items", [])

    if not items:
        return JsonResponse({"error": "No se encontraron artículos en el pedido"}, status=400)

    try:
        # Crear el pedido
        order = Order.objects.create(user=user, total=total, status="procesando")

        # Crear cada artículo del pedido
        for item in items:
            producto_id = item.get("producto_id")
            cantidad = item.get("cantidad")
            precio = item.get("precio")

            # Buscar el producto
            producto = Producto.objects.get(id=producto_id)

            # Crear el OrderProduct
            OrderProduct.objects.create(order=order, product=producto, quantity=cantidad, price=precio)

        return JsonResponse({"message": "¡Compra exitosa! Pedido guardado."}, status=200)
    
    except Producto.DoesNotExist:
        return JsonResponse({"error": "Producto no encontrado"}, status=404)
    
    except Exception as e:
        return JsonResponse({"error": f"Error al guardar el pedido: {str(e)}"}, status=500)



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
