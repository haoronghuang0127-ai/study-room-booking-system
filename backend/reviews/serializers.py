from datetime import datetime

from django.utils import timezone
from rest_framework import serializers

from bookings.models import Booking
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    # define a serializer for the Review model
    student_username = serializers.CharField(source='student.username', read_only=True)

    # define a serializer for the Booking model
    booking = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.all())

    # define a serializer for the Review model
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Review
        fields = ['id', 'student', 'student_username', 'room', 'booking', 'rating', 'comment', 'created_at']
        read_only_fields = ['student', 'room', 'created_at']

    def validate(self, attrs):
        # get the request and booking from the context
        request = self.context['request']

        # get the booking from the attributes
        booking = attrs.get('booking')

        # if the booking is not provided, raise a validation error
        if not booking:
            raise serializers.ValidationError({'booking': 'This field is required.'})

        # combine the booking date and end time into a datetime object
        booking_end = timezone.make_aware(
            datetime.combine(booking.booking_date, booking.end_time)
        )

        # if the user is not the student of the booking, raise a validation error
        if booking.student_id != request.user.id:
            raise serializers.ValidationError('You can only review your own booking.')

        # if the booking is not approved, raise a validation error
        if booking.status != 'approved':
            raise serializers.ValidationError('Only approved bookings can be reviewed.')

        # if the booking has not ended, raise a validation error
        if timezone.now() < booking_end:
            raise serializers.ValidationError('You can only review a booking after it has ended.')

        # if the booking has already been reviewed, raise a validation error
        if hasattr(booking, 'review'):
            raise serializers.ValidationError('This booking has already been reviewed.')

        return attrs
