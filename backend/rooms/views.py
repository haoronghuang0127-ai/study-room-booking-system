from django.core.cache import cache
from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Building, Equipment, Room
from .permissions import IsRoleAdmin
from .serializers import (
    BuildingSerializer,
    EquipmentSerializer,
    RoomSerializer,
    RoomCreateUpdateSerializer,
)



# define a view for listing all buildings
class BuildingListView(generics.ListAPIView):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [permissions.AllowAny]

    # cache(redis) the BuildingListView response for 15 minutes 
    @method_decorator(cache_page(60 * 30))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

# define a view for listing all rooms
class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]

    # cache(redis) the RoomListView response for 10 minutes
    @method_decorator(cache_page(60 * 10))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)



# define a view for retrieving a single room
class RoomDetailView(generics.RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]

    # cache(redis) the RoomDetailView response for 10 minutes
    @method_decorator(cache_page(60 * 10))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


# define a view for listing all equipments
class EquipmentListView(APIView):
    permission_classes = [permissions.AllowAny]
    
    # cache(redis) the EquipmentListView response for 30 minutes
    @method_decorator(cache_page(60 * 30))
    def get(self, request):
        equipments = Equipment.objects.all().order_by('id')

        serializer = EquipmentSerializer(equipments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)



# define a view for creating a new room
class AdminRoomCreateView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [IsRoleAdmin]

    def perform_create(self, serializer):
        serializer.save()
        # clear the cache when a new room is created
        transaction.on_commit(cache.clear)

# define a view for updating an existing room
class AdminRoomUpdateView(generics.UpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [IsRoleAdmin]

    def perform_create(self, serializer):
        serializer.save()
        # clear the cache when a room is updated
        transaction.on_commit(cache.clear)

# define a view for deleting a room
class AdminRoomDeleteView(generics.DestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [IsRoleAdmin]

    def perform_destroy(self, instance):
        instance.delete()
        # clear the cache when a room is deleted
        transaction.on_commit(cache.clear)




# define a view for creating a new building
class AdminBuildingCreateView(APIView):
    permission_classes = [IsRoleAdmin]

    def post(self, request):
        serializer = BuildingSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            # clear the cache when a new building is created
            transaction.on_commit(cache.clear)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# define a view for updating an existing building
class AdminBuildingUpdateView(APIView):
    permission_classes = [IsRoleAdmin]

    def put(self, request, pk):
        try:
            building = Building.objects.get(pk=pk)
        except Building.DoesNotExist:
            return Response({"detail": "Building not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = BuildingSerializer(building, data=request.data)

        if serializer.is_valid():
            serializer.save()
            
            # clear the cache when a building is updated
            transaction.on_commit(cache.clear)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# define a view for deleting a building
class AdminBuildingDeleteView(APIView):
    permission_classes = [IsRoleAdmin]

    def delete(self, request, pk):
        try:
            building = Building.objects.get(pk=pk)
        except Building.DoesNotExist:
            return Response({"detail": "Building not found."}, status=status.HTTP_404_NOT_FOUND)

        if building.rooms.exists():
            return Response(
                {"detail": "Cannot delete building with rooms."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        building.delete()

        # clear the cache when a building is deleted
        transaction.on_commit(cache.clear)
        return Response(status=status.HTTP_204_NO_CONTENT)





# define a view for creating a new equipment
class AdminEquipmentCreateView(APIView):
    permission_classes = [IsRoleAdmin]

    def post(self, request):
        serializer = EquipmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            # clear the cache when a new equipment is created
            transaction.on_commit(cache.clear)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# define a view for updating an existing equipment
class AdminEquipmentUpdateView(APIView):
    permission_classes = [IsRoleAdmin]

    def put(self, request, pk):
        try:
            equipment = Equipment.objects.get(pk=pk)
        except Equipment.DoesNotExist:
            return Response({"detail": "Equipment not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = EquipmentSerializer(equipment, data=request.data)

        if serializer.is_valid():
            serializer.save()

            
            # clear the cache when a equipment is updated
            transaction.on_commit(cache.clear)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# define a view for deleting an equipment
class AdminEquipmentDeleteView(APIView):
    permission_classes = [IsRoleAdmin]

    def delete(self, request, pk):
        try:
            equipment = Equipment.objects.get(pk=pk)
        except Equipment.DoesNotExist:
            return Response({"detail": "Equipment not found."}, status=status.HTTP_404_NOT_FOUND)

        equipment.delete()

        # clear the cache when a equipment is deleted
        transaction.on_commit(cache.clear)
        return Response(status=status.HTTP_204_NO_CONTENT)
