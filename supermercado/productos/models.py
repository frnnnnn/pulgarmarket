from django.db import models
from babel.numbers import format_currency

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)    
    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    descripcion = models.TextField(blank=True)
    precio = models.IntegerField()
    imagen = models.ImageField(upload_to='', blank=True)
    stock = models.IntegerField()
    disponible = models.BooleanField(default=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos', null=True, blank=True)  # Relación de categoría
    creado = models.DateTimeField(auto_now_add=True)
    actualizado = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

    def get_precio_chileno(self):
        return format_currency(self.precio, 'CLP', locale='es_CL')
