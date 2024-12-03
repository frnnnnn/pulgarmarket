from django.contrib import admin
from productos.models import  Categoria

# Register your models here.

class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'descripcion']
    search_fields = ['nombre']


admin.site.register(Categoria, CategoriaAdmin)
