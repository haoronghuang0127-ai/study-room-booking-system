from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    # filter reviews by room
    def get_queryset(self):
        # get room id from query params if it exists
        room_id = self.request.query_params.get('room')

        # if room id exists, return reviews for that room
        if room_id:
            return Review.objects.filter(room_id=room_id).order_by('-created_at')
        
        # if room id does not exist, return all reviews
        return Review.objects.all().order_by('-created_at')

    # only allow authenticated users to create reviews
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        
        # allow any user to view reviews
        return [permissions.AllowAny()]

    # set the student field to the current user
    def perform_create(self, serializer):
        # get the booking from the validated data
        booking = serializer.validated_data['booking']

        # set the student field to the current user
        serializer.save(student=self.request.user, room=booking.room)