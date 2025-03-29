from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    """The custom manager for our custom user model
    """
    def create_user(self, email, password=None, **extra_fields):
        """Method used to create a user
        """
        if not email:
            raise ValueError(_("The Email field must be set"))
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password) # We hash user passwords
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        """Method used to create a superuser
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model with email authentication
    """

    class Role(models.TextChoices):
        PATIENT = "patient", _("Patient")
        DOCTOR = "doctor", _("Doctor")
        PENDING_DOCTOR = "pending_doctor", _("Pending Doctor") # New status
        ADMIN = "admin", _("Admin")
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=15, choices=Role.choices, default=Role.PATIENT)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)

    # Fields required by Django Admin
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"  

class Patient(models.Model):
    """Model extends the User model for patient-specific information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    date_of_birth = models.DateField(null=True, blank=True) # allow null values
    gender = models.CharField(max_length=10, choices=[("male", "Male"), ("female", "Female")])
    emergency_contact = models.CharField(max_length=15)
    medical_history = models.TextField(null=True, blank=True) # allow null values


    def __str__(self):
        return f"{self.first_name} {self.last_name} (Patient)"

class Doctor(models.Model):
    """Model extends Users for doctor-specific information
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    license_number = models.CharField(max_length=50, unique=True)
    bio = models.TextField()
    years_experience = models.IntegerField()

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name} - {self.specialty}"

class DoctorAvailability(models.Model):
    """Stores doctor availability slots
    """
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    day_of_week = models.CharField(max_length=10, choices= [
        ("Monday","Monday"), ("Tuesday", "Tuesday"), ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"), ("Friday", "Friday"), ("Saturday", "Saturday"),
        ("Sunday", "Sunday")
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.doctor} - {self.day_of_week}: {self.start_time} to {self.end_time}"

class Appointment(models.Model):
    """Manages doctor-patient appointments
    """
    STATUS_CHOICES = [
        ("scheduled", "Scheduled"),
        ("completed", "Completed"),
        ("canceled", "Canceled")
    ]

    appointment_id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    appointment_datetime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    appointment_type = models.CharField(max_length=255)
    reason = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Appointment: {self.patient} with {self.doctor} ({self.doctor.first_name}  {self.doctor.last_name}) on {self.appointment_datetime}"
from django.db import models
from django.utils import timezone

class Consultation(models.Model):
    """Track telemedicine consultations"""
    consultation_id = models.AutoField(primary_key=True)
    appointment_id = models.OneToOneField("Appointment", on_delete=models.CASCADE)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=50,
        choices=[("ongoing", "Ongoing"), ("completed", "Completed"), ("canceled", "Canceled")],
        default="ongoing"
    )
    consultation_notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Consultation {self.consultation_id} - {self.status}"

class Message(models.Model):
    """Stores messages exchanged in a consultation"""
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)  # Now references User model
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.email} at {self.timestamp}: {self.content[:30]}"
