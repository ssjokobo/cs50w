from re import U
from django.shortcuts import render
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import User, Game, Favorite
from . import util


# Create your views here.
def index(request):
    page_obj = util.game_list(request)
    return render(request, "musgame/index.html", {
        "page_obj": page_obj
    })


def category(request):
    categories = []
    for category in Game.CATEGORIES:
        categories.append(category[1])
    return render(request, "musgame/category.html", {
        "categories": categories,
    })


def category_indiv(request, category_name):
    for category in Game.CATEGORIES:
        if category[1] == category_name:
            page_obj = util.game_list(request, category[0])
    return render(request, "musgame/category_indiv.html", {
        "page_obj": page_obj,
        "category_name": category_name
    })


@login_required
def favorites(request, game_id=None):
    if request.method == "GET":
        page_obj = util.game_list(request, "favorite")
        return render(request, "musgame/index.html", {
            "page_obj": page_obj,
            "category_name": "Favorites"
        })
    elif request.method == "PUT":
        fav_obj = Favorite.objects.get(favorer=request.user)
        if fav_obj.favoring.filter(id=game_id):
            fav_obj.favoring.remove(game_id)
        else:
            fav_obj.favoring.add(game_id)
        fav_obj.save()

    return HttpResponse(status=204)


def action(request, game_id):
    game = Game.objects.get(pk=game_id)
    game_html = game.get_html
    game_js = game.get_js
    game_css = game.get_css
    if request.user.is_authenticated:
        fav_obj = Favorite.objects.get(favorer=request.user)
        if game in fav_obj.favoring.all():
            favorite = True
        else:
            favorite = False
    else:
        favorite = None
    return render(request, "musgame/action.html", {
        "game": game,
        "game_html": game_html,
        "game_js": game_js,
        "game_css": game_css,
        "favorite": favorite
    })


def register(request):
    if request.method == "POST":

        # Check password and confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "musgame/register.html", {
                "message": "Password confirmation is not matched."
            })

        username = request.POST["username"]
        email = None

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "musgame/register.html", {
                "message": "Username has already been taken."
            })

        # Add favorite model
        favorite = Favorite(
            favorer=user
        )
        favorite.save()

        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "musgame/register.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "musgame/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "musgame/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))