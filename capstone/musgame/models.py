from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

class Game(models.Model):
    CATEGORIES = (
        ("CS", "Classical"),
        ("JZ", "Jazz"),
        ("TL", "Tool")
    )
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=2000)
    html_content = models.FileField(upload_to='musgame/templates/musgame/game_html', blank=True)
    js_content = models.FileField(upload_to='musgame/static/musgame/game_js', blank=True)
    css_content = models.FileField(upload_to='musgame/static/musgame/game_css', blank=True)
    photo = models.ImageField(upload_to='musgame/static/musgame/media', blank=True)
    category = models.CharField(max_length=2, choices=CATEGORIES, default="CS")

    def __str__(self):
        return self.title

    def get_photo(self, category=False):
        return self.photo.name[8:]
    
    def get_html(self):
        return self.html_content.name[18:]
    
    def get_js(self):
        return self.js_content.name[7:]

    def get_css(self):
        return self.css_content.name[7:]


class Favorite(models.Model):
    favorer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite")
    favoring = models.ManyToManyField(Game, blank=True, related_name="favoredby")

    def __str__(self):
        return f"{self.favorer}'s favorites"