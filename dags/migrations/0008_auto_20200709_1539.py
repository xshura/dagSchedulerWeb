# Generated by Django 3.0.7 on 2020-07-09 07:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dags', '0007_auto_20200709_1443'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dag',
            old_name='dag',
            new_name='describe',
        ),
        migrations.RemoveField(
            model_name='dag',
            name='task_id',
        ),
    ]
