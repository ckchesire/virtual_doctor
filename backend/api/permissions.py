from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """Permission for admin users only
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"

class IsDoctorOrAdmin(BasePermission):
    """Allow only doctors and admins to view patient list
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["doctor", "admin"]