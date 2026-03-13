from django.urls import path
from .views import (
    BuildingListView,
    EquipmentListView,
    RoomListView,
    RoomDetailView,
    AdminBuildingCreateView,
    AdminBuildingUpdateView,
    AdminBuildingDeleteView,
    AdminEquipmentCreateView,
    AdminEquipmentUpdateView,
    AdminEquipmentDeleteView,
    AdminRoomCreateView,
    AdminRoomUpdateView,
    AdminRoomDeleteView,
)

from config.routes import RoomsRoutes

app_name = RoomsRoutes.APP_NAME

urlpatterns = [
    # add the url for the building list
    path(RoomsRoutes.BUILDING_LIST_PATH, BuildingListView.as_view(), name=RoomsRoutes.BUILDING_LIST_NAME),
    # add the url for the equipment list
    path(RoomsRoutes.EQUIPMENT_LIST_PATH, EquipmentListView.as_view(), name=RoomsRoutes.EQUIPMENT_LIST_NAME),
    # add the url for the room list
    path(RoomsRoutes.ROOM_LIST_PATH, RoomListView.as_view(), name=RoomsRoutes.ROOM_LIST_NAME),
    # add the url for the room detail
    path(RoomsRoutes.ROOM_DETAIL_PATH, RoomDetailView.as_view(), name=RoomsRoutes.ROOM_DETAIL_NAME),

    # add the url for the admin
    # add the url for building create 
    path(RoomsRoutes.ADMIN_BUILDING_CREATE_PATH, AdminBuildingCreateView.as_view(), name=RoomsRoutes.ADMIN_BUILDING_CREATE_NAME),
    # add the url for building update
    path(RoomsRoutes.ADMIN_BUILDING_UPDATE_PATH, AdminBuildingUpdateView.as_view(), name=RoomsRoutes.ADMIN_BUILDING_UPDATE_NAME),
    # add the url for building delete
    path(RoomsRoutes.ADMIN_BUILDING_DELETE_PATH, AdminBuildingDeleteView.as_view(), name=RoomsRoutes.ADMIN_BUILDING_DELETE_NAME),

    # add the url for equipment create
    path(RoomsRoutes.ADMIN_EQUIPMENT_CREATE_PATH, AdminEquipmentCreateView.as_view(), name=RoomsRoutes.ADMIN_EQUIPMENT_CREATE_NAME),
    # add the url for equipment update
    path(RoomsRoutes.ADMIN_EQUIPMENT_UPDATE_PATH, AdminEquipmentUpdateView.as_view(), name=RoomsRoutes.ADMIN_EQUIPMENT_UPDATE_NAME),
    # add the url for equipment delete
    path(RoomsRoutes.ADMIN_EQUIPMENT_DELETE_PATH, AdminEquipmentDeleteView.as_view(), name=RoomsRoutes.ADMIN_EQUIPMENT_DELETE_NAME),

    # add the url for room create
    path(RoomsRoutes.ADMIN_CREATE_PATH, AdminRoomCreateView.as_view(), name=RoomsRoutes.ADMIN_CREATE_NAME),
    # add the url for room update
    path(RoomsRoutes.ADMIN_UPDATE_PATH, AdminRoomUpdateView.as_view(), name=RoomsRoutes.ADMIN_UPDATE_NAME),
    # add the url for room delete
    path(RoomsRoutes.ADMIN_DELETE_PATH, AdminRoomDeleteView.as_view(), name=RoomsRoutes.ADMIN_DELETE_NAME),
]