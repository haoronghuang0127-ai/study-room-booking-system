from django.contrib import admin
from .models import Building, Equipment, Room

# Register your models here.

admin.site.register(Building)
admin.site.register(Equipment)
admin.site.register(Room)