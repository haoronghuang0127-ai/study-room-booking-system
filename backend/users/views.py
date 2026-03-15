from django.db.models import Count
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from rooms.permissions import IsRoleAdmin
from .models import User
from .serializers import (
    AdminUserCreateUpdateSerializer,
    AdminUserListSerializer,
    RegisterSerializer,
    UserSerializer,
)


# define a view for registering new users
# using the generics.CreateAPIView class from rest_framework, automatically handles the POST request
class RegisterView(generics.CreateAPIView):
    # get all users
    queryset = User.objects.all()

    # using the RegisterSerializer to serialize the data
    serializer_class = RegisterSerializer

    # allow any user to register
    permission_classes = [permissions.AllowAny]

# define a view for getting the current user
class MeView(APIView):
    # allow authenticated users to access this view
    permission_classes = [permissions.IsAuthenticated]

    # handle GET requests
    def get(self, request):
        # serialize the current user using the UserSerializer
        # using the token from the request to get the current user information in the database,
        # automatically handles by the django rest framework and save the user in the request.user
        serializer = UserSerializer(request.user)
        
        # return the serialized data
        return Response(serializer.data)
    

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not current_password or not new_password or not confirm_password:
            return Response(
                {"detail": "Please fill in all password fields."},
                status = status.HTTP_400_BAD_REQUEST,
            )
        

        if not request.user.check_password(current_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )


        if len(new_password) < 8:
            return Response(
                {"detail": "New password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current_password == new_password:
            return Response(
                {"detail": "New password must be different from the current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm_password:
            return Response(
                {"detail": "New password and confirm password do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        

        request.user.set_password(new_password)
        request.user.save()

        return Response(
            {"detail": "Password changed successfully. Please log in again."},
            status=status.HTTP_200_OK,
        )


# define a view for admin to get all users
class AdminUserListView(generics.ListAPIView):
    serializer_class = AdminUserListSerializer
    permission_classes = [IsRoleAdmin]

    def get_queryset(self):
        # annotate relation counts so the admin page can show user usage information
        return User.objects.annotate(
            booking_count=Count('student_bookings', distinct=True),
            review_count=Count('reviews', distinct=True),
            processed_booking_count=Count('processed_bookings', distinct=True),
        ).order_by('id')


# define a view for admin to create a new user
class AdminUserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserCreateUpdateSerializer
    permission_classes = [IsRoleAdmin]


# define a view for admin to update an existing user
class AdminUserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserCreateUpdateSerializer
    permission_classes = [IsRoleAdmin]


# define a view for admin to delete an existing user
class AdminUserDeleteView(APIView):
    permission_classes = [IsRoleAdmin]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # do not allow the current admin to delete the account being used right now
        if user == request.user:
            return Response(
                {"detail": "You cannot delete the current logged-in admin user."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # keep booking history and review history safe instead of deleting related records by cascade
        if user.student_bookings.exists():
            return Response(
                {"detail": "Cannot delete user with booking records."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.reviews.exists():
            return Response(
                {"detail": "Cannot delete user with review records."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
