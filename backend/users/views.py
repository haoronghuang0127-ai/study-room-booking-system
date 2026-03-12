from rest_framework import generics, permissions
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