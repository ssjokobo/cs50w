from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("compose", views.compose, name="compose"),
    path("profile/<int:profile_id>", views.profile, name="profile"),
    path("following", views.following, name="following"),

    # API Routes
    path("like/<int:post_id>", views.like, name="like"),
    path("follow/<int:profile_id>", views.follow, name="follow"),
    path("post/<int:post_id>/edit", views.post_edit, name="post_edit")
]