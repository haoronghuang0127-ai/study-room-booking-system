from rest_framework import generics, permissions
from .models import Building, Room
from .serializers import BuildingSerializer, RoomSerializer, RoomCreateUpdateSerializer


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

# define a view for creating a new room
class AdminRoomCreateView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

# define a view for updating an existing room
class AdminRoomUpdateView(generics.UpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

# define a view for deleting a room
class AdminRoomDeleteView(generics.DestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]