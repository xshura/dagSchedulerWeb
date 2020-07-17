"""dag_scheduler URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from dags import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('scheduler/ajax_query_res/', views.resource_query_by_roomid),
    path('scheduler/ajax_dags_show/', views.query_dag_by_id),
    path('scheduler/ajax_binding/', views.dag_binding),
    path('scheduler/release/<int:room_id>', views.dag_release),
    path('scheduler/ajax_run/', views.multi_dag_run),
    path('scheduler/ajax_apply/', views.apply_resource),
    path('scheduler/ajax_release/', views.release_resource),
    path('scheduler/ajax_clear/', views.clear),
    path('dag_add/', views.index),
    path('index/', views.index),
    path('dag/', views.to_dag),
    path('show/', views.to_scheduler),
    path('dag/detail/<int:dag_id>', views.dag_detail),
    path('dag/delete/<int:dag_id>', views.dag_del),
    path('resource/add_res/', views.resource_add),
    path('resource/ajax_edit_get/', views.resource_query_by_id),
    path('resource/edit/', views.resource_edit),
    path('resource/delete/<int:res_id>', views.resource_del),
    path('resource/', views.resource_all),
    path('dag/query_type/', views.get_res_type),
    path('dag/add/', views.dag_add),
    path('', views.index),
]
