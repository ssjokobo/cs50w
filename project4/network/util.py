from django.http import HttpResponseRedirect
from django.core.paginator import Paginator
from django.urls import reverse

from .models import Post, Follow


def load_wall(request, wall, profile_id=None):

    # Choose wall
    if wall == "all":
        posts = Post.objects.all()
    elif wall == "profile":
        posts = Post.objects.filter(author=profile_id)
    elif wall == "following":
        follow = Follow.objects.get(user=request.user)
        following = follow.following_list()
        posts = Post.objects.filter(author__in=following)
    else:
        return HttpResponseRedirect(reverse("index"))
    
    # Ordering
    posts = posts.order_by("-timestamp").all()

    # Paginator
    pages = Paginator(posts, 10)
    page_number = request.GET.get("page")
    page_obj = pages.get_page(page_number)

    return page_obj