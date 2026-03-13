from django.db import models
from users.models import User
from rooms.models import Room
# Create your models here.


class Booking(models.Model):
    # Define choices for the status field
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]

    # Many to one relationship
    # Many booking to one student, one student to many booking
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_bookings')


    # Many to one relationship
    # Many booking to one room, one room to many booking
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')

    # Define the booking_date field
    booking_date = models.DateField()
    # Define the start_time and end_time fields
    start_time = models.TimeField()
    end_time = models.TimeField()

    # Define the status field
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Define the processed_by field (processed by user (admin))
    processed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL, # Set to null if user is deleted
        null=True,
        blank=True,
        related_name='processed_bookings'
    )

    # Define the created_at field
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.room.name} - {self.booking_date}"