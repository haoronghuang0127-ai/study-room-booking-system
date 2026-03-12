from django.urls import path
from .views import (
    BookingCreateView,
    MyBookingListView,
    CancelBookingView,
    AdminBookingListView,
    ApproveBookingView,
    RejectBookingView,
)

from config.routes import BookingsRoutes

app_name = BookingsRoutes.APP_NAME

urlpatterns = [
    # add the url for the booking create
    path(BookingsRoutes.CREATE_PATH, BookingCreateView.as_view(), name=BookingsRoutes.CREATE_NAME),

    # add the url for the my bookings
    path(BookingsRoutes.MY_LIST_PATH, MyBookingListView.as_view(), name=BookingsRoutes.MY_LIST_NAME),

    # add the url for the cancel booking, passing the booking ID in the URLs
    path(BookingsRoutes.CANCEL_PATH, CancelBookingView.as_view(), name=BookingsRoutes.CANCEL_NAME),

    # add the url for the admin booking list
    path(BookingsRoutes.ADMIN_LIST_PATH, AdminBookingListView.as_view(), name=BookingsRoutes.ADMIN_LIST_NAME),

    # add the url for the admin booking approve, passing the booking ID in the URLs
    path(BookingsRoutes.APPROVE_PATH, ApproveBookingView.as_view(), name=BookingsRoutes.APPROVE_NAME),

    # add the url for the admin booking reject, passing the booking ID in the URLs
    path(BookingsRoutes.REJECT_PATH, RejectBookingView.as_view(), name=BookingsRoutes.REJECT_NAME),
]