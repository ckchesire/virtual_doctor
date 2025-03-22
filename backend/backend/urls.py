from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import (
    RegisterUserView, CustomTokenObtainPairView, UserProfileView,
    AdminUserListView, AdminUserUpdateView
)
urlpatterns = [
    path("api/user/register/", RegisterUserView.as_view(), name="register"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/profile/", UserProfileView.as_view(), name="profile"),
    path("api/admin/users/", AdminUserListView.as_view(), name="admin_user_list"),
    path("api/admin/users/<int:pk>", AdminUserUpdateView.as_view(), name="admin_user_update"),
]