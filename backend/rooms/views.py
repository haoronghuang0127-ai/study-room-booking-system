from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Building, Equipment, Room
from .permissions import IsRoleAdmin
from .serializers import BuildingSerializer, EquipmentSerializer, RoomSerializer, RoomCreateUpdateSerializer



# define a view for listing all buildings
class BuildingListView(generics.ListAPIView):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [permissions.AllowAny]

# define a view for listing all rooms
class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]

# define a view for retrieving a single room
class RoomDetailView(generics.RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]


# define a view for listing all equipments
class EquipmentListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        equipments = Equipment.objects.all().order_by('id')

        serializer = EquipmentSerializer(equipments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)



# define a view for creating a new room
class AdminRoomCreateView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [IsRoleAdmin]

# define a view for updating an existing room
class AdminRoomUpdateView(generics.UpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [IsRoleAdmin]

# define a view for deleting a room
class AdminRoomDeleteView(generics.DestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [IsRoleAdmin]




# define a view for creating a new building
class AdminBuildingCreateView(APIView):
    permission_classes = [IsRoleAdmin]

    def post(self, request):
        serializer = BuildingSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
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
        return Response(status=status.HTTP_204_NO_CONTENT)





# define a view for creating a new equipment
class AdminEquipmentCreateView(APIView):
    permission_classes = [IsRoleAdmin]

    def post(self, request):
        serializer = EquipmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
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
        return Response(status=status.HTTP_204_NO_CONTENT)
