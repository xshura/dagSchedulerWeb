# Generated by Django 3.0.7 on 2020-07-13 07:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dags', '0009_task_dag_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='room_id',
            field=models.IntegerField(null=True),
        ),
    ]
