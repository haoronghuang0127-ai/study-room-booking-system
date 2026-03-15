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


# define a serializer for admin to list users with relation statistics
class AdminUserListSerializer(serializers.ModelSerializer):
    booking_count = serializers.IntegerField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    processed_booking_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'is_active',
            'booking_count',
            'review_count',
            'processed_booking_count',
        ]


# define a serializer for admin create and update users
class AdminUserCreateUpdateSerializer(serializers.ModelSerializer):
    # set the password to write_only, so it is not returned in the response
    password = serializers.CharField(write_only=True, required=False, allow_blank=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'is_active']

    # validate the username field to make sure it stays unique
    def validate_username(self, value):
        queryset = User.objects.filter(username=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("A user with that username already exists.")

        return value

    # validate the password field for admin create and update
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")

        return value

    # validate the payload for create and update scenarios
    def validate(self, attrs):
        password = attrs.get('password')

        # require password when admin creates a new user
        if self.instance is None and not password:
            raise serializers.ValidationError({"password": ["Password is required when creating a user."]})

        return attrs

    # override the create method to hash the password before saving
    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user

    # override the update method so password can stay optional
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance
