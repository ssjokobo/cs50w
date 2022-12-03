from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("action/<int:game_id>", views.action, name="action"),
    path("favorites", views.favorites, name="favorites"),
    path("category", views.category, name="category"),
    path("category/<str:category_name>", views.category_indiv, name="category_indiv"),

    # API
    path("favorites/<int:game_id>", views.favorites, name="faving")
]