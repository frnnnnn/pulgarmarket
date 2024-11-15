from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import make_password
from .serializers import UserProfileSerializer

# Registro de usuarios
@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'El usuario ya existe.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

# Endpoint para obtener o actualizar el perfil del usuario autenticado
@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def perfil(request):
    user = request.user
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        serializer = UserProfileSerializer(user, data=request.data, partial=True)  # Partial permite actualización parcial
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_contrasena(request):
    user = request.user
    data = request.data

    # Verificar que la contraseña actual sea correcta
    contrasena_actual = data.get("contrasena_actual")
    nueva_contrasena = data.get("nueva_contrasena")
    confirmar_contrasena = data.get("confirmar_contrasena")

    # Verifica que la contraseña actual sea correcta
    if not user.check_password(contrasena_actual):
        return Response({"error": "La contraseña actual es incorrecta."}, status=status.HTTP_400_BAD_REQUEST)

    # Verifica que la nueva contraseña coincida con la confirmación
    if nueva_contrasena != confirmar_contrasena:
        return Response({"error": "La nueva contraseña y la confirmación no coinciden."}, status=status.HTTP_400_BAD_REQUEST)

    # Cambiar la contraseña del usuario
    user.password = make_password(nueva_contrasena)
    user.save()
    return Response({"success": "La contraseña ha sido actualizada correctamente."}, status=status.HTTP_200_OK)
