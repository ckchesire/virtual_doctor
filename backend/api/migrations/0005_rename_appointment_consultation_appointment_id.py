# Generated by Django 5.1.7 on 2025-03-24 13:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_consultation_consultation_notes_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='consultation',
            old_name='appointment',
            new_name='appointment_id',
        ),
    ]
