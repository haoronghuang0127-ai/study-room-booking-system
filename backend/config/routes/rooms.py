class RoomsRoutes:
    APP_NAME = "rooms"

    BUILDING_LIST_PATH = "buildings/"
    ROOM_LIST_PATH = ""
    ROOM_DETAIL_PATH = "<int:pk>/"
    ADMIN_CREATE_PATH = "admin/create/"
    ADMIN_UPDATE_PATH = "admin/<int:pk>/update/"
    ADMIN_DELETE_PATH = "admin/<int:pk>/delete/"

    BUILDING_LIST_NAME = "building-list"
    ROOM_LIST_NAME = "room-list"
    ROOM_DETAIL_NAME = "room-detail"
    ADMIN_CREATE_NAME = "admin-room-create"
    ADMIN_UPDATE_NAME = "admin-room-update"
    ADMIN_DELETE_NAME = "admin-room-delete"

    BUILDING_LIST_FULL_NAME = f"{APP_NAME}:{BUILDING_LIST_NAME}"
    ROOM_LIST_FULL_NAME = f"{APP_NAME}:{ROOM_LIST_NAME}"
    ROOM_DETAIL_FULL_NAME = f"{APP_NAME}:{ROOM_DETAIL_NAME}"
    ADMIN_CREATE_FULL_NAME = f"{APP_NAME}:{ADMIN_CREATE_NAME}"
    ADMIN_UPDATE_FULL_NAME = f"{APP_NAME}:{ADMIN_UPDATE_NAME}"
    ADMIN_DELETE_FULL_NAME = f"{APP_NAME}:{ADMIN_DELETE_NAME}"