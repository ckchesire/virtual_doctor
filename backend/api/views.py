from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer
from .permissions import IsAdmin

User = get_user_model()

# Create your views here.
class RegisterUserView(generics.CreateAPIView):
    """API for user registration
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT login view
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(email=request.data["email"])
            response.data["role"] = user.role # Add role to response
        return response

class UserProfileView(generics.RetrieveUpdateAPIView):
    """Authenticated users can view and update their profile
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user # Users can only update their own profile

class AdminUserListView(generics.ListAPIView):
    """Admin can view all users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class AdminUserUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """Admin can update/delete users
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]