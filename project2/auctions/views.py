from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.contrib.auth.decorators import login_required
from auctions.models import User, Listing, Bid, Comment, Category

from .models import User


class CreateListingForm(forms.Form):
    item_name = forms.CharField(label="Item Name", max_length=64, required=True)
    starting_price = forms.IntegerField(label="Price", required=True, min_value=1)
    description = forms.CharField(label="Description", widget=forms.Textarea, max_length=1800, required=True)
    img_src = forms.CharField(label="Image URL", max_length=800, required=False)
    category = forms.CharField(label="Category", max_length=64, required=False)


class CommentForm(forms.Form):
    comment = forms.CharField(label="New Comment", widget=forms.Textarea, max_length=2500, required=True)


def index(request):
    return render(request, "auctions/index.html", {
        "listings": Listing.objects.filter(active=True)
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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


@login_required
def create(request):
    if request.method == "POST":
        form = CreateListingForm(request.POST)
        if form.is_valid():

            # handle form
            new_listing = Listing(
                item_name=form.cleaned_data["item_name"], 
                starting_price=form.cleaned_data["starting_price"],
                current_price=form.cleaned_data["starting_price"],
                description=form.cleaned_data["description"],
                seller_id=request.user
            )

            # check for image
            if form.cleaned_data["img_src"] is not None:
                new_listing.img_src = form.cleaned_data["img_src"]

            # save
            new_listing.save()

            # check for category
            input_category = form.cleaned_data["category"]
            if input_category.isalpha():
                input_category = input_category.title()
                new_listing.category_type = input_category
                new_listing.save()
                try:
                    new_category = Category(category_name=input_category)
                    new_category.save()
                    new_category.listings.add(new_listing)
                except IntegrityError:
                    db_category = Category.objects.get(category_name=input_category)
                    db_category.listings.add(new_listing)

            return render(request, "auctions/create.html", {
                "message": "✅ Saved!",
                "form": CreateListingForm()
            })

        else:
            return render(request, "auctions/create.html", {
                "message": "Error! Something went wront!",
                "form": form
            })
    else:
        return render(request, "auctions/create.html", {
            "form": CreateListingForm()
        })


def listing(request, item_id):

    listing = Listing.objects.get(id=item_id)

    if request.method == "POST":
        if request.POST["action"] == "toggle_watchlist":
            toggle_watchlist(request, listing)
        elif request.POST["action"] == "toggle_active":
            toggle_active(request, listing)
        elif request.POST["action"] == "bid":
            bid(request, listing, int(request.POST["new_bid"]))
        elif request.POST["action"] == "comment":
            form = CommentForm(request.POST)
            if form.is_valid():
                comment(request, listing, form.cleaned_data["comment"])
    
    if request.user in listing.watchers.all():
        is_watched = True
    else:
        is_watched = False

    try:
        category = listing.category.first().category_name
    except AttributeError:
        category = "N/A"

    return render(request, "auctions/listing.html", {
        "listing": listing,
        "comments": listing.comments.all(),
        "comment_form": CommentForm(),
        "is_watched": is_watched,
        "bid_times": listing.bids.count(),
        "min_bid": listing.current_price + 1,
        "last_bidder": listing.bids.last(),
        "category": category
    })


@login_required
def watchlist(request):
    listings = Listing.objects.all()
    watchlist = []
    for listing in listings:
        if request.user in listing.watchers.all():
            watchlist.append(listing)

    return render(request, "auctions/watchlist.html", {
        "watchlist": watchlist
    })


def category(request):
    return render(request, "auctions/category.html", {
        "categories": Category.objects.all()
    })


def category_indiv(request, category_name):
    category = Category.objects.get(category_name=category_name.title())
    return render(request, "auctions/category_indiv.html", {
        "category": category,
        "category_listings": category.listings.filter(active=True)
    })


# Helpers Functions
@login_required
def toggle_watchlist(request, listing):
    if request.user in listing.watchers.all():
        listing.watchers.remove(request.user)
    else:
        listing.watchers.add(request.user)


@login_required
def toggle_active(request, listing):
    if request.user == listing.seller_id:
        listing.active = not listing.active
        listing.save()


@login_required
def bid(request, listing, new_price):
    try:
        last_price = listing.bids.last().price
    except AttributeError:
        last_price = listing.starting_price
    if new_price > last_price:
        new_bid = Bid(user_id=request.user, price=new_price)
        new_bid.save()
        listing.bids.add(new_bid)
        listing.current_price = new_price
        listing.save()


@login_required
def comment(request, listing, text):
    comment = Comment(user_id=request.user, comment=text)
    comment.save()
    listing.comments.add(comment)