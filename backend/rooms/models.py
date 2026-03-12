from django.db import models



# Building Model
class Building(models.Model):
    name = models.CharField(max_length=100)

    # set the campus_are and the opening_hours as optional
    campus_area = models.CharField(max_length=100, blank=True)
    opening_hours = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name

# Equipment Model
class Equipment(models.Model):
    name = models.CharField(max_length=100)

    # set the status as available by default
    status = models.CharField(max_length=50, default='available')

    def __str__(self):
        return self.name

# Room Model
class Room(models.Model):
    name = models.CharField(max_length=100)
    
    # set the capacity as positive integer
    capacity = models.PositiveIntegerField()
    
    location = models.CharField(max_length=200)

    # set the is_active as true by default
    is_active = models.BooleanField(default=True)

    #many to one relationship
    # a building can have many rooms, a room can only have one building
    # the foreign key is the id of the building
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='rooms')

    # many to many relationship
    # a room can have many equipments, an equipment can have many rooms
    # the foreign key is the id of the equipment
    # the equipment can be empty
    equipment = models.ManyToManyField(Equipment, blank=True, related_name='rooms')

    def __str__(self):
        return self.name