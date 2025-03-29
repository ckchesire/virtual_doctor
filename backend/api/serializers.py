from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Patient, Doctor, DoctorAvailability, Appointment, Consultation, Message

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):  
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "password", "role",
         "phone_number", "created_at", "last_login"]
        extra_kwargs = {"password": {"write_only": True}}
        
    def create(self, validated_data):
        """ Automatically set doctors to 'pending_doctor'"""
        password = validated_data.pop("password")

        role = validated_data.get("role", "patient")

        if role == "doctor":
            validated_data["role"] = "pending_doctor" # Doctors are not approved immediately
        
        user = User.objects.create_user(**validated_data)

        if user.role == "patient":
            Patient.objects.create(user=user, first_name="", last_name="", date_of_birth=None, gender="", emergency_contact="")

        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        """Allow users to update their profile
        """
        instance.phone_number = validated_data.get("phone_number", instance.phone_number)
        instance.save()
        return instance

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["first_name", "last_name", "date_of_birth", "gender", "emergency_contact", "medical_history"]

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ["user_id", "first_name", "last_name", "specialty", "license_number", "bio", "years_experience"]

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_first_name = serializers.CharField(source="doctor.first_name", read_only=True)
    doctor_last_name = serializers.CharField(source="doctor.last_name", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "appointment_id",
            "patient",
            "doctor",
            "doctor_first_name",
            "doctor_last_name",
            "appointment_datetime",
            "status",
            "appointment_type",
            "reason",
            "created_at",
        ]

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
