from django.db import models

from users.models import User
from rooms.models import Room

# Create your models here.


class Review(models.Model):
    # The foreign key to the User model
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')

    # The foreign key to the Room model
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='reviews')

    # The rating of the review (1-5) using a positive integer
    rating = models.PositiveIntegerField()

    # The comment associated with the review
    comment = models.TextField(blank=True)

    # The date and time the review was created
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.student.username} for {self.room.name}"