from django.db import models
from babel.numbers import format_currency
# Create your models here.
class Producto(models.Model):
  nombre = models.CharField(max_length=255, unique=True)
  slug = models.SlugField(max_length=255, unique=True)
  descripcion = models.TextField(blank=True)
  precio = models.IntegerField()
  imagen = models.ImageField(upload_to='', blank=True)
  stock = models.IntegerField()
  disponible = models.BooleanField(default=True)
  creado = models.DateTimeField(auto_now_add=True)
  actualizado = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.nombre

  def get_precio_chileno(self):
      return format_currency(self.precio, 'CLP', locale='es_CL')


