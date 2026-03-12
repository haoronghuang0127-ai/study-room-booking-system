from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer

# define a view for creating new bookings
class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    # override the perform_create method to set the student field
    # before saving the booking in the database
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# define a view for getting the user's bookings
class MyBookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    # override the get_queryset method to filter the bookings by student 
    # and order them by booking date and start time
    def get_queryset(self):
        return Booking.objects.filter(student=self.request.user).order_by('-booking_date', '-start_time')


# define a view for cancelling a booking
class CancelBookingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    # override the patch method to cancel the booking
    def patch(self, request, pk):
        try:
            # get the booking from the database using the primary key and student
            booking = Booking.objects.get(pk=pk, student=request.user)
        except Booking.DoesNotExist:
            # if the booking does not exist, return a 404 error
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)

        # cancel the booking setting the status to cancelled
        booking.status = 'cancelled'
        # save the booking
        booking.save()

        # return a success cancellation message
        return Response({"detail": "Booking cancelled successfully."})


# define a view for getting all bookings (admin)
class AdminBookingListView(generics.ListAPIView):
    # order the bookings by creation date
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

# define a view for approving a booking (admin)
class ApproveBookingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # override the patch method to approve the booking
    def patch(self, request, pk):
        try:
            # get the booking from the database using the primary key
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            # if the booking does not exist, return a 404 error
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)

        # set the booking status to approved
        booking.status = 'approved'
        # set the processed_by field to the current user
        booking.processed_by = request.user
        # save the booking
        booking.save()

        # return a success approval message
        return Response({"detail": "Booking approved successfully."})

# define a view for rejecting a booking (admin)
class RejectBookingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            # get the booking from the database using the primary key
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            # if the booking does not exist, return a 404 error
            return Response({"detail": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)

        # set the booking status to rejected
        booking.status = 'rejected'
        # set the processed_by field to the current user
        booking.processed_by = request.user
        # save the booking
        booking.save()

        # return a success rejection message
        return Response({"detail": "Booking rejected successfully."})