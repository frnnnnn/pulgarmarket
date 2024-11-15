from django.db import models

# Create your models here.
class Producto(models.Model):
  nombre = models.CharField(max_length=255, unique=True)
  slug = models.SlugField(max_length=255, unique=True)
  descripcion = models.TextField(blank=True)
  precio = models.DecimalField(max_digits=10, decimal_places=2)
  imagen = models.ImageField(upload_to='productos/', blank=True)
  stock = models.IntegerField()
  disponible = models.BooleanField(default=True)
  creado = models.DateTimeField(auto_now_add=True)
  actualizado = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.nombre
