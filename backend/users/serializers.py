from rest_framework import serializers
from .models import User


# define a serializer for registering new users
class RegisterSerializer(serializers.ModelSerializer):

    # set the password to write_only, so it is not returned in the response
    password = serializers.CharField(write_only=True)

    # the Meta class is used to configure the serializer, the serializer will use the User model
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    # override the create method to create a new user
    def create(self, validated_data):
        # get the role from the validated data, if it is not provided, set it to 'student'
        role = validated_data.get('role', 'student')

        # if the role is not 'student' or 'admin', set it to 'student' by manual
        if role not in ['student', 'admin']:
            role = 'student'

        # create the user
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=role
        )

        # set the password using the set_password method (Django will automatically hash the password)
        user.set_password(validated_data['password'])

        # save the user to the database
        user.save()
        return user

# define a serializer for the User model
# return the user without the password
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']