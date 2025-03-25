from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from api.models import Patient, Doctor, Appointment

User = get_user_model()

class AppointmentCreateTest(APITestCase):
    def setUp(self):
        self.patient_user = User.objects.create_user(
            email="patient@example.com",
            password="password",
            role="patient"
        )
        self.patient = Patient.objects.create(
            user=self.patient_user,
            first_name="Jane",
            last_name="Leacky"
        )

        self.doctor_user = User.objects.create(
            email="doctor@example.com",
            password="password",
            role="doctor"
        )
        # simulate admin approval
        self.doctor_user.role = "doctor" # Admin changes role
        self.doctor_user.save()

        self.doctor = Doctor.objects.create(
            user=self.doctor_user,
            first_name="Dr. Smith",
            last_name="Williams",
            specialty="General Practioner",
            license_number="GFT3478",
            years_experience=25
        )

        self.client.force_authenticate(user=self.patient_user)
    
    def test_create_appointment(self):
        data = {
            "patient": self.patient.user.id,
            "doctor": self.doctor.user.id,
            "appointment_datetime": "2024-03-25T14:00:00Z",
            "status": "scheduled",
            "appointment_type": "General Checkup",
            "reason": "Annual health checkup"
        }
        response = self.client.post("/api/appointments/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appointment.objects.count(), 1)

class AppointmentListTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="patient@example.com",
            password="P(ssw)rd",
            role="patient"
            )
        self.client.force_authenticate(user=self.user)
    
    def test_get_appointments_list(self):
        response = self.client.get("/api/appointments/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)