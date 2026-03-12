"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from config.routes import ApiPrefix

urlpatterns = [
    # add the url for the admin, using the admin.site from django
    path('admin/', admin.site.urls),

    # using the api/auth/ prefix path for the users urls
    path(ApiPrefix.AUTH, include('users.urls')),

    # using the api/rooms/ prefix path for the rooms urls
    path(ApiPrefix.ROOMS, include('rooms.urls')),

    # using the api/bookings/ prefix path for the bookings urls
    path(ApiPrefix.BOOKINGS, include('bookings.urls')),

    # using the api/reviews/ prefix path for the reviews urls
    path(ApiPrefix.REVIEWS, include('reviews.urls')),
]
