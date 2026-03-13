from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import RegisterSerializer, UserSerializer


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
