from unicodedata import category
from django.core.paginator import Paginator

from .models import Game, Favorite


def game_list(request, pick=""):

    # Choose wall
    if pick == "favorite":
        favorite = Favorite.objects.get(favorer=request.user)
        favoring = favorite.favoring.all()
        games = Game.objects.filter(id__in=favoring)
    elif pick:
        games = Game.objects.filter(category=pick)
    else:
        games = Game.objects.all()
    
    # Ordering
    games = games.order_by("pk").all()

    # Paginator
    pages = Paginator(games, 9)
    page_number = request.GET.get("page")
    page_obj = pages.get_page(page_number)

    return page_obj