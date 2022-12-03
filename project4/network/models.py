from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.CharField(max_length=5000)
    likes = models.ManyToManyField(User, blank=True, related_name="liked_posts")
    timestamp = models.DateTimeField(auto_now_add=True)

    def like_count(self):
        return len(self.likes.all())

    def likers(self):
        return self.likes.all()

    def like_data(self, current_user):
        if current_user in self.likers():
            liked = True
        else:
            liked = False

        return {
            "like_count": self.like_count(),
            "liked": liked
        }


class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True, related_name="follows")
    following = models.ManyToManyField(User, blank=True, related_name="followers")

    def following_list(self):
        return self.following.all()

    def following_count(self):
        return len(self.following_list())

    def follower_list(self):
        return self.user.followers.all()

    def follower_count(self):
        return len(self.follower_list())

    def follower_id_list(self):
        follower_id_list = []
        for follower in self.follower_list():
            follower_id_list.append(follower.id)
        return follower_id_list

    def follow_data(self, current_user):
        if current_user.id in self.follower_id_list():
            followed = True
        else:
            followed = False

        return {
            "following_count": self.following_count(),
            "follower_count": self.follower_count(),
            "followed": followed
        }