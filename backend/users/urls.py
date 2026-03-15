from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    AdminUserCreateView,
    AdminUserDeleteView,
    AdminUserListView,
    AdminUserUpdateView,
    ChangePasswordView,
    MeView,
    RegisterView,
)
from config.routes import UsersRoutes

app_name = UsersRoutes.APP_NAME

urlpatterns = [
    # add the url for the register view
    path(UsersRoutes.REGISTER_PATH, RegisterView.as_view(), name=UsersRoutes.REGISTER_NAME),

    # add the url for the login view, using the TokenObtainPairView
    path(UsersRoutes.LOGIN_PATH, TokenObtainPairView.as_view(), name=UsersRoutes.LOGIN_NAME),

    # add the url for the refresh view, using the TokenRefreshView
    path(UsersRoutes.REFRESH_PATH, TokenRefreshView.as_view(), name=UsersRoutes.REFRESH_NAME),

    # add the url for the me view
    path(UsersRoutes.ME_PATH, MeView.as_view(), name=UsersRoutes.ME_NAME),

    path(UsersRoutes.CHANGE_PASSWORD_PATH, ChangePasswordView.as_view(), name=UsersRoutes.CHANGE_PASSWORD_NAME),

    # add the url for admin user management
    path(UsersRoutes.ADMIN_LIST_PATH, AdminUserListView.as_view(), name=UsersRoutes.ADMIN_LIST_NAME),
    path(UsersRoutes.ADMIN_CREATE_PATH, AdminUserCreateView.as_view(), name=UsersRoutes.ADMIN_CREATE_NAME),
    path(UsersRoutes.ADMIN_UPDATE_PATH, AdminUserUpdateView.as_view(), name=UsersRoutes.ADMIN_UPDATE_NAME),
    path(UsersRoutes.ADMIN_DELETE_PATH, AdminUserDeleteView.as_view(), name=UsersRoutes.ADMIN_DELETE_NAME),
]
