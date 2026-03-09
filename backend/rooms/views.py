from rest_framework import generics, permissions
from .models import Building, Room
from .serializers import BuildingSerializer, RoomSerializer, RoomCreateUpdateSerializer


class BuildingListView(generics.ListAPIView):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    permission_classes = [permissions.AllowAny]


class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]