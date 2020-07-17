from django.contrib import admin
from dags.models import Dag, Task, Resource, Edge, Room


# Register your models here.
class DagsAdmin(admin.ModelAdmin):
    pass


class TaskAdmin(admin.ModelAdmin):
    pass


class ResourceAdmin(admin.ModelAdmin):
    pass


class EdgeAdmin(admin.ModelAdmin):
    pass


class RoomAdmin(admin.ModelAdmin):
    pass


admin.site.register(Dag, DagsAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.register(Resource, ResourceAdmin)
admin.site.register(Edge, EdgeAdmin)
admin.site.register(Room, RoomAdmin)