# Generated by Django 5.1.7 on 2025-03-29 07:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_rename_appointment_id_consultation_appointment_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='consultation',
            old_name='appointment',
            new_name='appointment_id',
        ),
    ]
