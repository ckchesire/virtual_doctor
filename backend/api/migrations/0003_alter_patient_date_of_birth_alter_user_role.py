# Generated by Django 5.1.7 on 2025-03-23 21:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_appointment_doctor_patient_remove_user_first_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('patient', 'Patient'), ('doctor', 'Doctor'), ('pending_doctor', 'Pending Doctor'), ('admin', 'Admin')], default='patient', max_length=15),
        ),
    ]
