from rest_framework.permissions import BasePermission

# custom permission class to check if the user is an admin
class IsRoleAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
