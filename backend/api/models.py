from django.db import models
from django.contrib.auth.models import AbstractUser

class Location(models.Model):
    """Represents the user's favourite location"""
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class MyUser(AbstractUser):
    """Custom user model"""
    favourite_locations = models.ManyToManyField(Location, blank=True)

    def __str__(self):
        return self.username
    
    def to_dict(self):
        return {
            'username' : self.username,
            'favourite_locations': [{'name': location.name} for location in self.favourite_locations.all()]
        }
