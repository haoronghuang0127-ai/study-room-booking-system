from django.db import models

# Using AbstractUser from Django to create a custom user model
from django.contrib.auth.models import AbstractUser

# User model 
class User(AbstractUser):

    # Role choices 
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('admin', 'Admin'),
    ]

    # Role field
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    
    def __str__(self):
        return self.username
    