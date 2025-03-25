from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer
from .permissions import IsAdmin, IsDoctorOrAdmin
from django.shortcuts import get_object_or_404
from .models import Patient, Doctor, Appointment, Consultation
from .serializers import PatientSerializer, DoctorSerializer, AppointmentSerializer, ConsultationSerializer

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
            user = User.objects.get (email=request.data["email"])
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

    def retrieve(self, request, *args, **kwargs):
        """Customize response to include patient details if applicable
        """
        user = self.get_object()
        data = UserSerializer(user).data # serialize user data

        # If the user is a patient, add patient profile details
        if user.role == "patient":
            try:
                patient = Patient.objects.get(user=user)
                patient_data = PatientSerializer(patient).data
                data["patient_profile"] = patient_data # include patient details
            except Patient.DoesNotExist:
                data["patient_profile"] = None
        
        # Include doctor profile if the user is a doctor
        elif user.role == "doctor":
            try:
                doctor = Doctor.objects.get(user=user)
                doctor_data = DoctorSerializer(doctor).data
                data["doctor_profile"] = doctor_data
            except Doctor.DoesNotExist:
                data["doctor_profile"] = None
        
        return Response(data, status=status.HTTP_200_OK)
    
    def partial_update(self, request, *args, **kwargs):
        """Allow patients to update their personal details
        """
        user = self.get_object()

        # Update User details
        user.phone_number = request.data.get("phone_number", user.phone_number)
        user.save()

        # Update Patient details
        if user.role == "patient":
            patient, created = Patient.objects.get_or_create(user=user)
            patient.first_name = request.data.get("first_name", patient.first_name)
            patient.last_name = request.data.get("last_name", patient.last_name)
            patient.date_of_birth = request.data.get("date_of_birth", patient.date_of_birth)
            patient.gender = request.data.get("gender", patient.gender)
            patient.emergency_contact = request.data.get("emergency_contact", patient.emergency_contact)
            patient.save()
        
        # Update doctor details
        elif user.role == "doctor":
            doctor, created = Doctor.objects.get_or_create(user=user)
            doctor.first_name = request.data.get("first_name", doctor.first_name)
            doctor.last_name = request.data.get("last_name", doctor.last_name)
            doctor.specialty = request.data.get("specialty", doctor.specialty)
            doctor.license_number = request.data.get("license_number", doctor.license_number)
            doctor.bio = request.data.get("bio", doctor.bio)
            doctor.years_experience = request.data.get("years_experience", doctor.years_experience)
            doctor.save()
        
        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

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

class PatientListView(generics.ListAPIView):
    serializer_class = PatientSerializer
    permission_classes =  [IsDoctorOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Patient.objects.all()
        elif user.role == "doctor":
            return Patient.objects.filter(appointment__doctor=user.doctor).distinct()
        return Patient.objects.none() # other roles see nothing

class DoctorListView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

class AppointmentListView(generics.ListCreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

class ConsultationListView(generics.ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

class ConsultationCreateView(generics.CreateAPIView):
    """Allow doctors to start a consultation
    """
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Ensure only doctors can start a consultation
        """
        user = self.request.user
        if user.role != "doctor":
            return Response({"error": "Only doctors can start a consultation"}, status=status.HTTP_403_FORBIDDEN)
        
        appointment_id = self.request.data.get("appointment")
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
            
        if Consultation.objects.filter(appointment=appointment).exists():
            return Response({"error": "Consultation already exists for this appointment"}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(appointment=appointment)
class ConsultationUpdateView(generics.UpdateAPIView):
    """Allow doctors to update and complete a consultation
    """
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        """Ensure only doctors can complete a consultation
        """
        user = self.request.user
        if user.role != "doctor":
            return Response({"error": "Only doctors can complete consultations"}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        try:
            consultation = self.get_object()
        except Consultation.DoesNotExist:
            return Response({"error": "Consultation not found"}, 
                           status=status.HTTP_404_NOT_FOUND)

        # Ensure consultation is ongoing before updating
        if consultation.status != "ongoing":
            return Response({"error": "Consultation is not ongoing"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        consultation.end_time = request.data.get("end_time", consultation.end_time)
        consultation.status = "completed"
        consultation.consultation_notes = request.data.get("consultation_notes", 
                                                         consultation.consultation_notes)
        consultation.save()

        return Response(ConsultationSerializer(consultation).data, 
                       status=status.HTTP_200_OK)
                       
class PendingDoctorListView(generics.ListAPIView):
    """List all users who registered as doctors but are not approved yet
    """
    queryset = User.objects.filter(role="pending_doctor")
    serializer_class = UserSerializer
    permission_classes = [IsAdmin] # only admins can approve

class ApproveDoctorView(generics.UpdateAPIView):
    """Admin can approve a doctor by changing their role and
        adding profile details
    """
    queryset = User.objects.filter(role="pending_doctor")
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def update(self, request, *args, **kwargs):
        user = self.get_object()

        # Extract doctor details directly from the request
        required_fields = ["first_name", "last_name", "specialty", "license_number", "bio", "years_experience"]
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            return Response({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user role
        user.role = "doctor"
        user.save(update_fields=["role"])

        # Ensure there is no existing doctor profile for user before creating a new one
        if Doctor.objects.filter(user=user).exists():
            return Response({"error": "Doctor profile already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Now create doctor profile
        doctor = Doctor.objects.create(
            user=user, 
            first_name=request.data["first_name"], 
            last_name=request.data["last_name"],
            specialty=request.data["specialty"],
            license_number=request.data["license_number"],
            bio=request.data["bio"],
            years_experience=request.data["years_experience"]
        )

        return Response(
            {"message": "Doctor approved and profile created successfully", "doctor_id": doctor.pk},
            status=status.HTTP_200_OK
        )