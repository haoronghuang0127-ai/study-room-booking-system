from django.db import models

# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    location = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='rooms')
    equipment = models.ManyToManyField(Equipment, blank=True, related_name='rooms')

    def __str__(self):
        return self.name
    
class Building(models.Model):
    name = models.CharField(max_length=100)
    campus_area = models.CharField(max_length=100, blank=True)
    opening_hours = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name
    

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='available')

    def __str__(self):
        return self.name
