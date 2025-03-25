from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from api.models import Doctor

User = get_user_model()

class DoctorListTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="doctor@example.com",
            password="password",
            role="doctor")

        # simulate admin approval
        self.user.role = "doctor" # Admin changes role
        self.user.save()
        self.client.force_authenticate(user=self.user)

        # create doctor profile
        self.doctor = Doctor.objects.create(
            user=self.user,
            first_name="Dr. Smith",
            last_name="Johnson",
            specialty="Cardiology",
            license_number="XCV12389",
            years_experience=10
        )
    def test_get_doctor_list(self):
        response = self.client.get("/api/doctors/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["first_name"], "Dr. Smith")