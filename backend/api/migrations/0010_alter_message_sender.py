# Generated by Django 5.1.7 on 2025-03-29 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_appointment_consultation_appointment_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='sender',
            field=models.CharField(choices=[('doctor', 'Doctor'), ('patient', 'Patient')], max_length=200),
        ),
    ]
