from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    pass


class Bid(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bidding")
    price = models.PositiveIntegerField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Bidding by {self.user_id} on {self.bidding.first()}"

class Comment(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commenting")
    comment = models.CharField(max_length=2500)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.user_id} on {self.commenting.first()}"

class Listing(models.Model):
    item_name = models.CharField(max_length=64)
    seller_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="selling")
    starting_price = models.PositiveIntegerField()
    current_price = models.PositiveIntegerField()
    description = models.CharField(max_length=1800)
    img_src = models.CharField(max_length=800, blank=True)
    active = models.BooleanField(default=True)
    watchers = models.ManyToManyField(User, blank=True, related_name="watching")
    bids = models.ManyToManyField(Bid, blank=True, related_name="bidding")
    comments = models.ManyToManyField(Comment, blank=True, related_name="commenting")
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.item_name} by {self.seller_id} at {str(self.timestamp)[:19]} "

class Category(models.Model):
    category_name = models.CharField(max_length=64, unique=True)
    listings = models.ManyToManyField(Listing, blank=True, related_name="category")

    def __str__(self):
        return f"{self.category_name}"