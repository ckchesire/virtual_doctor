from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from api.models import Patient

User = get_user_model()

class PatientListTest(APITestCase):
    def setUp(self):
        # use admin to view patients
        self.admin_user = User.objects.create_user(
            email="admin@example.com",
            password="P@ssw0rd", 
            role="admin")
        self.client.force_authenticate(user=self.admin_user)

        self.user = User.objects.create_user(
            email="testuserpatient@example.com",
            password="p@ssw0rd",
            role="patient")
        self.patient = Patient.objects.create(
            user=self.user,
            first_name="John",
            last_name="Newman",
            date_of_birth="1990-05-15",
            gender="male",
            emergency_contact="1234567890")

    def test_get_patients_list(self):
        response = self.client.get("/api/patients/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["first_name"], "John")