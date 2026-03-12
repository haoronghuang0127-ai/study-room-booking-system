class BookingsRoutes:
    APP_NAME = "bookings"

    CREATE_PATH = ""
    MY_LIST_PATH = "my/"
    CANCEL_PATH = "<int:pk>/cancel/"
    ADMIN_LIST_PATH = "admin/all/"
    APPROVE_PATH = "admin/<int:pk>/approve/"
    REJECT_PATH = "admin/<int:pk>/reject/"

    CREATE_NAME = "booking-create"
    MY_LIST_NAME = "my-bookings"
    CANCEL_NAME = "booking-cancel"
    ADMIN_LIST_NAME = "admin-booking-list"
    APPROVE_NAME = "booking-approve"
    REJECT_NAME = "booking-reject"

    CREATE_FULL_NAME = f"{APP_NAME}:{CREATE_NAME}"
    MY_LIST_FULL_NAME = f"{APP_NAME}:{MY_LIST_NAME}"
    CANCEL_FULL_NAME = f"{APP_NAME}:{CANCEL_NAME}"
    ADMIN_LIST_FULL_NAME = f"{APP_NAME}:{ADMIN_LIST_NAME}"
    APPROVE_FULL_NAME = f"{APP_NAME}:{APPROVE_NAME}"
    REJECT_FULL_NAME = f"{APP_NAME}:{REJECT_NAME}"