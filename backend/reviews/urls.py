from django.urls import path
from .views import ReviewListCreateView

from config.routes import ReviewsRoutes

app_name = ReviewsRoutes.APP_NAME

urlpatterns = [
    # add the url for the review list
    path(ReviewsRoutes.LIST_CREATE_PATH, ReviewListCreateView.as_view(), name=ReviewsRoutes.LIST_CREATE_NAME),
]