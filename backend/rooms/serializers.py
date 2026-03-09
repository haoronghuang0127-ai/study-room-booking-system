from rest_framework import serializers
from .models import Building, Room, Equipment

class RoomSerializer(serializers.ModelSerializer):
    building = BuildingSerializer(read_only=True)
    equipment = EquipmentSerializer(read_only=True, many=True)

    class Meta:
        model = Room
        fields = ['id', 'name', 'capacity', 'location', 'is_active', 'building', 'equipment']


class BuildingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Building
        fields = ['id', 'name', 'campus_area', 'opening_hours']


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'status']
