from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django import forms
from markdown2 import Markdown
from random import choice


from . import util


class NewEntryForm(forms.Form):
    title = forms.CharField(label="New Title", required=True)
    content = forms.CharField(label="New Content", widget=forms.Textarea, required=True)


class EditEntryForm(forms.Form):
    title = forms.CharField(label="Edit Title", required=True)
    content = forms.CharField(label="Edit Content", widget=forms.Textarea, required=True)


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def entry(request, title):
    content = util.get_entry(title)
    if not content:
        return render(request, "encyclopedia/not_found.html", {
            "title": title
        })
    else:
        markdowner = Markdown()
        return render(request, "encyclopedia/entry.html", {
            "title": title,
            "content": markdowner.convert(content)
        })


def search(request):
    if request.method == "GET":
        query = request.GET.get("q")
        entries = util.list_entries()
        if query in entries:
            return HttpResponseRedirect(reverse("entry", kwargs={"title": query}))
        else:
            similar_entries = []
            for entry in entries:
                if query.lower() in entry.lower():
                    similar_entries.append(entry)
            if len(similar_entries) != 0:
                return render(request, "encyclopedia/search.html", {
                    "entries": similar_entries,
                    "query": query
                })
            else:
                return render(request, "encyclopedia/not_found.html", {
                    "title": query
                })


def create(request):
    if request.method == "GET":
        return render(request, "encyclopedia/create.html", {
            "response": False,
            "form": NewEntryForm()
        })
    elif request.method == "POST":
        form = NewEntryForm(request.POST)
        if form.is_valid():
            title = form.cleaned_data["title"]
            if title not in util.list_entries():
                content = form.cleaned_data["content"]
                util.save_entry(title, content)
                return HttpResponseRedirect(reverse("entry", kwargs={"title": title}))
            else:
                return render(request, "encyclopedia/create.html", {
                    "response": f"Error! '{title}' already exists!",
                    "form": form
                })
        else:
            return render(request, "encyclopedia/create.html", {
                "response": "Invalid input(s)",
                "form": NewEntryForm()
            })


def edit(request, title):
    if request.method == "GET":
        form = EditEntryForm()
        prepopulated = {
            "title": title,
            "content": util.get_entry(title)
        }
        return render(request, "encyclopedia/edit.html", {
            "title": title,
            "form": EditEntryForm(initial=prepopulated)
        })
    elif request.method == "POST":
        form = EditEntryForm(request.POST)
        if form.is_valid():
            edited_title = form.cleaned_data["title"]
            edited_content = form.cleaned_data["content"]
            util.save_entry(edited_title, edited_content)
            return HttpResponseRedirect(reverse("entry", kwargs={"title": edited_title}))
        else:
            return render(request, "encyclopedia/edit.html", {
                "response": "Error! Something is wrong!",
                "form": EditEntryForm(initial=prepopulated)
            })


def random(request):
    randomed = choice(util.list_entries())
    return HttpResponseRedirect(reverse("entry", kwargs={"title": randomed}))