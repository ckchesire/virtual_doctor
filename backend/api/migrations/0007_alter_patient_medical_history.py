# Generated by Django 5.1.7 on 2025-03-26 17:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_patient_medical_history'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='medical_history',
            field=models.TextField(blank=True, null=True),
        ),
    ]
