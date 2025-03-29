from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import (
    RegisterUserView, CustomTokenObtainPairView, UserProfileView,
    AdminUserListView, AdminUserUpdateView
)
from api.views import ( 
    PatientListView, DoctorListView, 
    AppointmentListView, ConsultationListView,
    ConsultationListCreateView, ConsultationDetailView,
    ConsultationCreateView, ConsultationUpdateView,
    PendingDoctorListView, ApproveDoctorView,
    SendMessageView, GetMessagesView
)

urlpatterns = [
    path("api/user/register/", RegisterUserView.as_view(), name="register"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/profile/", UserProfileView.as_view(), name="profile"),
    path("api/admin/users/", AdminUserListView.as_view(), name="admin_user_list"),
    path("api/admin/users/<int:pk>/", AdminUserUpdateView.as_view(), name="admin_user_update"),
    path("api/patients/", PatientListView.as_view(), name="patients"),
    path("api/doctors/", DoctorListView.as_view(), name="doctors"),
    path("api/appointments/", AppointmentListView.as_view(), name="appointments"),
    #path("api/consultations/<int:pk>/", ConsultationListView.as_view(), name="list_consultation"),
    path("api/consultations/", ConsultationListCreateView.as_view(), name="list_create_consultations"),
    path("api/consultations/create/", ConsultationCreateView.as_view(), name="create_consultations"),
    path("api/consultations/<int:pk>/", ConsultationUpdateView.as_view(), name="update_consultations"),
    path("api/consultations/<int:pk>/", ConsultationDetailView.as_view(), name="consultation_detail"),
    path("api/admin/pending-doctors/", PendingDoctorListView.as_view(), name="pending_doctors"),
    path("api/admin/approve-doctor/<int:pk>/", ApproveDoctorView.as_view(), name="approve_doctor"),

    # Messaging system
    path("api/consultations/<int:consultation_id>/messages/", GetMessagesView.as_view(), name="get_messages"),
    path("api/consultations/<int:consultation_id>/messages/send/", SendMessageView.as_view(), name="send_message"),
    
]