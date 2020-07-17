from django.db import models


# Create your models here.
from django.utils import timezone


class Dag(models.Model):
    """
    DAG 表
    id 主键
    dag 流程描述
    owner 所有人
    add_date 创建时间
    mod_date 最后修改时间
    """
    id = models.AutoField(primary_key=True)
    describe = models.CharField(max_length=20, null=True)
    room_id = models.IntegerField(null=True, blank=True)
    owner = models.CharField(max_length=20, null=True)
    add_date = models.DateTimeField('create_date', default=timezone.now)
    mod_date = models.DateTimeField('last_update_date', auto_now=True)


class Edge(models.Model):
    """
    关系 边  表
    id 主键
    dag_id 流程id
    task_id1 任务节点1
    task_id2 任务节点2
    """
    id = models.AutoField(primary_key=True)
    dag_id = models.IntegerField()
    task_id1 = models.IntegerField()
    task_id2 = models.IntegerField()


class Task(models.Model):
    """
    任务 表
    id 主键
    dag_id 流程id
    task 任务描述
    resource_type 所需资源类型
    occupy_time 任务所需时间
    """
    id = models.AutoField(primary_key=True)
    dag_id = models.IntegerField()
    task = models.CharField(max_length=20)
    resource_type = models.CharField(max_length=20)
    occupy_time = models.FloatField()

    def __str__(self):
        return self.task


class Resource(models.Model):
    """
    资源 表
    id 主键
    name 主键
    resource_type 资源类型
    heterogeneous 异构分类
    room_id 房间id
    dag_id 占用者流程id
    task_id 占用任务节点id
    status 是否空闲      0： 空闲  1： 占用
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    resource_type = models.CharField(max_length=20)
    heterogeneous = models.CharField(max_length=20, null=True)
    room_id = models.IntegerField(null=True)
    dag_id = models.IntegerField(null=True, blank=True)
    task_id = models.IntegerField(null=True, blank=True)
    OCCUPY_CHOICE = (
        ('0', '空闲'),
        ('1', '占用'),
    )
    status = models.CharField(max_length=2, choices=OCCUPY_CHOICE)
    add_date = models.DateTimeField('create_date', default=timezone.now)
    mod_date = models.DateTimeField('last_update_date', auto_now=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    """
    房间表
    """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    describe = models.CharField(max_length=40, null=True)
    OCCUPY_CHOICE = (
        ('0', '空闲'),
        ('1', '绑定'),
    )
    status = models.CharField(max_length=2, choices=OCCUPY_CHOICE)
    add_date = models.DateTimeField('create_date', default=timezone.now)
    mod_date = models.DateTimeField('last_update_date', auto_now=True)

    def __str__(self):
        return self.name


