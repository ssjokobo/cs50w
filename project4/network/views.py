import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from .models import User, Post, Follow
from . import util


def index(request):
    page_obj = util.load_wall(request, "all")
    wall_type = 'All Posts'

    return render(request, "network/index.html", {
        "page_obj": page_obj,
        "wall_type": wall_type
    })


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })

        # Add follow models
        new_follow = Follow(
            user=user
        )
        new_follow.save()

        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required
def compose(request):
    if request.method == "POST":
        new_post = Post(
            author=request.user,
            content=request.POST["content"]
        )

        new_post.save()
        return HttpResponseRedirect(reverse("index"))


@login_required
def like(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if request.method == "PUT":
        if request.user in post.likes.all():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)

        post.save()
        return HttpResponse(status=204)

    elif request.method == "GET":
        return JsonResponse(post.like_data(request.user))

    else:
        return JsonResponse({"error": "PUT or GET request required."}, status=400)


def profile(request, profile_id):
    page_obj = util.load_wall(request, "profile", profile_id)
    profile_obj = User.objects.get(pk=profile_id)
    follow_obj = Follow.objects.get(pk=profile_id)

    return render(request, "network/index.html", {
        "page_obj": page_obj,
        "profile_obj": profile_obj,
        "follow_obj": follow_obj,
    })


@login_required
def follow(request, profile_id):
    try:
        follow = Follow.objects.get(user=request.user)
    except Follow.DoesNotExist:
        return JsonResponse({"error": "Follow not found."}, status=404)
    
    if request.method == "PUT":
        to_be_followed = User.objects.get(pk=profile_id)

        if to_be_followed in follow.following.all():
            follow.following.remove(to_be_followed)
        else:
            follow.following.add(to_be_followed)

        follow.save()
        return HttpResponse(status=204)

    elif request.method == "GET":
        followed = Follow.objects.get(pk=profile_id)
        return JsonResponse(followed.follow_data(request.user))

    else:
        return JsonResponse({"error": "PUT or GET request required."}, status=400)


@login_required
def following(request):
    page_obj = util.load_wall(request, "following")
    wall_type = 'Following'

    return render(request, "network/index.html", {
        "page_obj": page_obj,
        "wall_type": wall_type
    })


@login_required
def post_edit(request, post_id):
    post = Post.objects.get(pk=post_id)
    if request.user == post.author:
        if request.method == "POST":
            data = json.loads(request.body)
            post.content = data["content"]
            post.save()
            return JsonResponse({"message": "Edited successfully."}, status=201)
        else:
            return JsonResponse({"error": "PUT request required."}, status=400)
    else:
         JsonResponse({"error": "You are not authorized to edit this post."}, status=403)