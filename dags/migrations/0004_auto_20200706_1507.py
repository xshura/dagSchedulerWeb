# Generated by Django 3.0.7 on 2020-07-06 07:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dags', '0003_edge_resource_task'),
    ]

    operations = [
        migrations.AddField(
            model_name='resource',
            name='name',
            field=models.CharField(default=1, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='resource',
            name='dag_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='heterogeneous',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='resource',
            name='task_id',
            field=models.IntegerField(null=True),
        ),
    ]