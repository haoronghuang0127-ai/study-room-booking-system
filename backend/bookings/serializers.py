from rest_framework import serializers
from .models import Booking

# define a serializer for the Booking model, this serializer is used to display the bookings
class BookingSerializer(serializers.ModelSerializer):
    # find the username of the student who made the booking, set read only to true, not save to database
    student_username = serializers.CharField(source='student.username', read_only=True)

    # find the name of the room, set read only to true, not save to database
    room_name = serializers.CharField(source='room.name', read_only=True)

    # the serializer for the Booking model
    class Meta:
        model = Booking

        # the fields to serialize, return to the frontend
        fields = [
            'id',
            'student',
            'student_username',
            'room',
            'room_name',
            'booking_date',
            'start_time',
            'end_time',
            'status',
            'processed_by',
            'created_at',
        ]
        
        # set the fields that are read only
        read_only_fields = ['student', 'status', 'processed_by', 'created_at']


# define a sserializer for creating new bookings
class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        # the fields to serialize
        fields = ['id', 'room', 'booking_date', 'start_time', 'end_time']

    # validate the booking
    def validate(self, attrs):
        # get the room, booking date, start time, and end time from the attributes
        room = attrs['room']
        booking_date = attrs['booking_date']
        start_time = attrs['start_time']
        end_time = attrs['end_time']
        
        # check if the end time is later than the start time
        if start_time >= end_time:
            raise serializers.ValidationError("End time must be later than start time.")

        # check if the room is already booked for the selected time
        conflict = Booking.objects.filter(
            room=room,
            booking_date=booking_date,
            status__in=['pending', 'approved'],

            # check if the start time is before the end time for the existing booking
            # and the end time is after the start time for the exisiting booking
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exists()

        # if the selected time is confilct with an existing booking, return an error
        if conflict:
            raise serializers.ValidationError("This room is already booked for the selected time.")

        return attrs