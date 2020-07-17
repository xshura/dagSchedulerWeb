import json
import networkx as nx
from django.core.serializers import deserialize
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from dags.models import *


# Create your views here.
@csrf_exempt
def get_res_type(request):
    """
    获取资源列表
    :param request:
    :return:
    """
    data = []
    resource_list = Resource.objects.all()
    for r in resource_list:
        data.append(r.resource_type)
    data = list(set(data))
    return HttpResponse(json.dumps(data), content_type='application/json')


def index(request):
    # 返回HTML页面时,使用render来渲染和打包
    return render(request, 'dag_import.html')


def to_dag(request):
    """
    列表页
    :param request:
    :return:
    """
    dag_list = Dag.objects.all()
    dag_data = []
    for dag in dag_list:
        d = {}
        d["id"] = dag.id
        d["describe"] = dag.describe
        # 查询 节点列表
        task_list = Task.objects.filter(dag_id=dag.id)
        tasks = str([x.id for x in task_list])

        edge_list = Edge.objects.filter(dag_id=dag.id)
        edges = str([(x.task_id1, x.task_id2) for x in edge_list])
        d["tasks"] = tasks
        d["edges"] = edges
        d["owner"] = dag.owner
        d["create_time"] = dag.add_date
        dag_data.append(d)

    return render(request, 'dag.html', {'dag_list': dag_data})


def dag_del(request, dag_id):
    """
    删除dag流程
    :param request:
    :return:
    """
    Dag.objects.filter(id=dag_id).delete()
    Task.objects.filter(dag_id=dag_id).delete()
    Edge.objects.filter(dag_id=dag_id).delete()
    return HttpResponseRedirect("/dag")


def dag_detail(request, dag_id):
    """
    查询dag图详情页
    :param request:
    :param dag_id:
    :return:
    """
    dag = Dag.objects.filter(id=dag_id)[0]
    task_list = Task.objects.filter(dag_id=dag.pk)
    edge_list = Edge.objects.filter(dag_id=dag.pk)
    edges = [(x.task_id1, x.task_id2) for x in edge_list]

    def cal_layer(edge_g):
        g = nx.DiGraph()
        g.add_edges_from(edge_g)

        layers = []
        while g.nodes:
            zero_degree = []
            cur_nodes = list(g.nodes)
            indegree_list = list(g.in_degree)
            for x in cur_nodes:
                for n in indegree_list:
                    if x == n[0] and n[1] == 0:
                        zero_degree.append(x)
                        g.remove_node(x)
                        break
            layers.append(zero_degree)
        return layers

    layers = cal_layer(edges)
    g = nx.DiGraph()
    g.add_edges_from(edges)

    inputs = g.pred._atlas
    outputs = g.succ._atlas

    node_list = []
    for task in task_list:
        node = {}
        node['id'] = task.pk
        node['task'] = task.task
        node['resource_type'] = task.resource_type
        node['occupy_time'] = task.occupy_time
        x, y = 0, 0
        for i, l in enumerate(layers):
            if task.pk in l:
                j = l.index(task.pk)
                x = i
                y = j
        node['top'] = 80 + 400*y
        node['left'] = 320*x
        # node['input'] = {"input_1": {"connections": [{"node": str(x), "input": "output_1"} for x in list(inputs[task.pk].keys())]}}
        node['input'] = [{"node_id": str(x)} for x in list(inputs[task.pk].keys())]
        # node['output'] = {"output_1": {"connections": [{"node": str(x), "output": "input_1"} for x in list(outputs[task.pk].keys())]}}
        node['output'] = [{"node_id": str(x)} for x in list(outputs[task.pk].keys())]
        print(node['input'])
        print(node['output'])
        node_list.append(node)
    return render(request, 'dag_detail.html',  {'task_list': node_list, 'edges': edges})


def resource(request):
    # 返回HTML页面时,使用render来渲染和打包
    return render(request, 'admin.html')


def resource_all(request):
    """
    刷列表
    :param request:
    :return:
    """
    resource_list = Resource.objects.all()
    OCCUPY_CHOICE = {
        '0': '空闲',
        '1': '占用',
    }
    data = []
    for r in resource_list:
        res = {}
        res["id"] = r.pk
        res["name"] = r.name
        res["resource_type"] = r.resource_type
        res["heterogeneous"] = r.heterogeneous
        res["room_id"] = r.room_id
        room = Room.objects.filter(id=r.room_id)[0]
        res["room_name"] = room
        res["task_id"] = r.task_id
        r.status = OCCUPY_CHOICE[r.status]
        if r.task_id == -1:
            res["task_id"] = "无任务"
        data.append(res)
        # r.bpubdate = r.add_date.strftime("%Y/%m/%d")
    return render(request, 'resource.html', {'resource_list': data})

@csrf_exempt
def resource_add(request):
    """
    新增资源
    :param request:
    :return:
    """
    res = Resource()
    res.name = request.POST['name']
    res.resource_type = request.POST['type']
    res.heterogeneous = request.POST['heterogeneous']
    res.room_id = request.POST['room_id']
    res.dag_id = -1
    res.task_id = -1
    res.status = "0"
    res.save()
    return HttpResponseRedirect("/resource")


@csrf_exempt
def resource_del(request, res_id):
    """
    删除资源
    :param request:
    :param param:
    :return:
    """
    Resource.objects.filter(id=res_id).delete()
    return HttpResponseRedirect("/resource")


@csrf_exempt
def resource_query_by_id(request):
    """
    查询资源
    :param request:
    :param param:
    :return:
    """
    res_id = request.GET['id']
    obj = Resource.objects.filter(id=res_id)[0]
    dist = {"id": res_id, "name": obj.name, "type": obj.resource_type, "heterogeneous": obj.heterogeneous, "room_id": obj.room_id}
    return HttpResponse(json.dumps(dist), content_type='application/json')


@csrf_exempt
def resource_edit(request):
    """
    编辑资源
    :param request:
    :param param:
    :return:
    """
    res_id = request.POST['id']
    obj = Resource.objects.filter(id=res_id)[0]
    obj.name = request.POST['name']
    obj.resource_type = request.POST['type']
    obj.heterogeneous = request.POST['heterogeneous']
    obj.room_id = request.POST['room_id']
    obj.save()
    return HttpResponseRedirect("/resource")


@csrf_exempt
def dag_add(request):
    """
    导入流程
    :param request:
    :param param:
    :return:
    nodes = [{"id":"node-2","task":"爱奇艺","occupy":"1","type":"type_0"},{"id":"node-3","task":"萨达","occupy":"1","type":"type_0"},{"id":"node-4","task":"123","occupy":"1","type":"type_0"}]
    edges = ["connection node_in_node-3 node_out_node-2 output_1 input_1","connection node_in_node-4 node_out_node-3 output_1 input_1"]
    """
    bytes_str = request.body.decode('utf-8')
    json_data = json.loads(bytes_str)
    node_list = json_data["node_list"]
    edge_list = json_data["edge_list"]
    node_id_dict = {}      # build dict point to real id
    dag = Dag()
    with transaction.atomic():
        if not json_data['dag_name']:
            return HttpResponse(json.dumps({"code": 1}), content_type='application/json')
        dag.describe = json_data["dag_name"]
        dag.owner = "administrator"
        dag.save()
        dag_id = dag.pk
        for node in node_list:
            task = Task()
            task.task = node['task']
            task.resource_type = node['type']
            task.occupy_time = node['occupy']
            task.dag_id = dag_id
            task.save()
            task_id = task.pk
            node_id_dict[node['id']] = task_id

        for edge in edge_list:
            edges = edge.split(' ')
            n1_name, n2_name = edges[2], edges[1]
            edge_obj = Edge()
            edge_obj.dag_id = dag_id

            edge_obj.task_id1 = node_id_dict[n1_name[9:]]
            edge_obj.task_id2 = node_id_dict[n2_name[8:]]
            edge_obj.save()
    return HttpResponse(json.dumps({"code": 0}), content_type='application/json')


@csrf_exempt
def to_scheduler(request):
    dags = Dag.objects.filter(room_id=None)
    dags_describe = []
    for dag in dags:
        d = {}
        d["id"] = dag.pk
        d["describe"] = dag.describe
        task_list = Task.objects.filter(dag_id=dag.pk)
        edge_list = Edge.objects.filter(dag_id=dag.pk)
        d["tasks"] = str([x.task for x in task_list]).lstrip("[").rstrip("]")
        # d["edges"] = str([(x.task_id1, x.task_id2) for x in edge_list])
        dags_describe.append(d)

    rooms = Room.objects.all()
    room_list = []
    for room in rooms:
        r = {}
        r["id"] = room.pk
        r["name"] = room.name
        r["status"] = "success" if room.status=='0' else "danger"
        if room.status=='1':
            dag = Dag.objects.filter(room_id=room.pk)[0]
            r["ps"] = "流程:"+str(dag.pk)+" "+dag.describe
        else:
            r["ps"] = ""
        room_list.append(r)
    return render(request, 'scheduler.html', {'dag_list': dags_describe, 'room_list': room_list})


@csrf_exempt
def resource_query_by_roomid(request):
    room_id = request.GET['id']
    objs = Resource.objects.filter(room_id=room_id)
    data = []
    for res in objs:
        d = {}
        d["id"] = res.id
        d["name"] = res.name
        d["type"] = res.resource_type
        d["status"] = "offline" if res.status == "0" else "online"
        data.append(d)
    return HttpResponse(json.dumps(data), content_type='application/json')


@csrf_exempt
def query_dag_by_id(request):
    dag_id = request.GET["id"]
    dag = Dag.objects.filter(id=dag_id)[0]
    task_list = Task.objects.filter(dag_id=dag.pk)
    edge_list = Edge.objects.filter(dag_id=dag.pk)
    edges = [(x.task_id1, x.task_id2) for x in edge_list]

    def cal_layer(edge_g):
        g = nx.DiGraph()
        g.add_edges_from(edge_g)

        layers = []
        while g.nodes:
            zero_degree = []
            cur_nodes = list(g.nodes)
            indegree_list = list(g.in_degree)
            for x in cur_nodes:
                for n in indegree_list:
                    if x == n[0] and n[1] == 0:
                        zero_degree.append(x)
                        g.remove_node(x)
                        break
            layers.append(zero_degree)
        return layers

    layers = cal_layer(edges)
    g = nx.DiGraph()
    g.add_edges_from(edges)

    inputs = g.pred._atlas
    outputs = g.succ._atlas
    node_list = []
    for task in task_list:
        node = {}
        node['id'] = task.pk
        node['task'] = task.task
        node['resource_type'] = task.resource_type
        node['occupy_time'] = task.occupy_time
        x, y = 0, 0
        for i, l in enumerate(layers):
            if task.pk in l:
                j = l.index(task.pk)
                x = i
                y = j
        node['top'] = 80 + 400 * y
        node['left'] = 320 * x
        node['input'] = [{"node_id": str(x)} for x in list(inputs[task.pk].keys())]
        node['output'] = [{"node_id": str(x)} for x in list(outputs[task.pk].keys())]
        print(node['input'])
        print(node['output'])
        node_list.append(node)

    data = [{'task_list': node_list, 'edges': edges}]
    return HttpResponse(json.dumps(data), content_type='application/json')


@csrf_exempt
def dag_binding(request):
    """
    为DAG分配合适的房间
    :param request:
    :return:
    """
    dag_id = request.POST["id"]
    dag = Dag.objects.filter(id=dag_id)[0]

    # query require resource list
    task_list = Task.objects.filter(dag_id=dag_id)
    require_list = [task.resource_type for task in task_list]

    # query resource type of rooms
    binding_room_id, satisfy = 0, 0
    room_list = Room.objects.filter(status="0")
    for room in room_list:
        res_list = Resource.objects.filter(room_id=room.pk)
        types = [res.resource_type for res in res_list]
        cur = 0
        for require in require_list:
            if require in types:
                cur += 1

        if cur > satisfy:
            binding_room_id = room.pk
            satisfy = cur
    if binding_room_id == 0:
        binding_room_id = room_list[0].pk

    with transaction.atomic():
        # binding room with dag
        dag.room_id = binding_room_id
        dag.save()

        room = Room.objects.filter(id=binding_room_id)[0]
        room.status = "1"
        room.save()

    data = [{'room_id': binding_room_id}]
    return HttpResponse(json.dumps(data), content_type='application/json')


@csrf_exempt
def dag_release(request, room_id):
    with transaction.atomic():
        room = Room.objects.filter(id=room_id)[0]
        room.status = "0"
        room.save()

        dag = Dag.objects.filter(room_id=room_id)[0]
        dag.room_id = None
        dag.save()
    return HttpResponseRedirect("/show")


@csrf_exempt
def multi_dag_run(request):
    room_list = Room.objects.filter(status="1")
    dag_list = []

    def cal_layer(edge_g):
        g = nx.DiGraph()
        g.add_edges_from(edge_g)
        layers = []
        while g.nodes:
            zero_degree = []
            cur_nodes = list(g.nodes)
            indegree_list = list(g.in_degree)
            for x in cur_nodes:
                for n in indegree_list:
                    if x == n[0] and n[1] == 0:
                        zero_degree.append(x)
                        g.remove_node(x)
                        break
            layers.append(zero_degree)
        return layers

    node_list = []
    row_top = []
    for row, room in enumerate(room_list):
        dag = Dag.objects.filter(room_id=room.pk)[0]
        tasks = Task.objects.filter(dag_id=dag.pk)
        edge_list = Edge.objects.filter(dag_id=dag.pk)
        edges = [(x.task_id1, x.task_id2) for x in edge_list]
        layers = cal_layer(edges)
        g = nx.DiGraph()
        g.add_edges_from(edges)
        inputs = g.pred._atlas
        outputs = g.succ._atlas
        max_y = 0
        for task in tasks:
            node = {}
            node['id'] = task.pk
            node['dag_id'] = task.dag_id
            node['task'] = task.task
            node['resource_type'] = task.resource_type
            node['occupy_time'] = task.occupy_time
            x, y = 0, 0
            for i, l in enumerate(layers):
                if task.pk in l:
                    j = l.index(task.pk)
                    x = i
                    y = j
            node['top'] = 400 * y + sum(row_top, 400 if row > 0 else 0)
            node['left'] = 320 * x + 80
            node['input'] = [{"node_id": str(x)} for x in list(inputs[task.pk].keys())]
            node['output'] = [{"node_id": str(x)} for x in list(outputs[task.pk].keys())]
            max_y = max(node['top'], max_y)
            print(node['input'])
            print(node['output'])
            node_list.append(node)
        row_top.append(max_y)
        print("-------------------------------------------------------------------------------------------------------")

    data = [{'node_list': node_list}]
    return HttpResponse(json.dumps(data), content_type='application/json')


@csrf_exempt
def apply_resource(request):
    type = request.POST["type"]
    task_id = request.POST["node_id"]
    task = Task.objects.filter(id=task_id)[0]
    dag = Dag.objects.filter(id=task.dag_id)[0]
    resource_list = Resource.objects.filter(resource_type=type)

    with transaction.atomic():
        assign = None
        for res in resource_list:
            if res.room_id == dag.room_id and res.status == "0":
                assign = res
                res.status = "1"
                res.dag_id = dag.id
                res.task_id = task_id
                res.save()
                break

        if not assign:
            for res in resource_list:
                if res.status == "0":
                    assign = res
                    res.status = "1"
                    res.dag_id = dag.id
                    res.task_id = task_id
                    res.save()
                    break

    if assign:
        room = Room.objects.filter(id=assign.room_id)[0]
        data = [{'code': 0, 'res_id': assign.id, 'res_name': assign.name, 'res_room': room.name}]
    else:
        data = [{'code': 1}]

    return HttpResponse(json.dumps(data), content_type='application/json')


@csrf_exempt
def release_resource(request):
    with transaction.atomic():
        res_id = request.POST["resource_id"]
        res = Resource.objects.filter(id=res_id)[0]
        res.status = "0"
        res.dag_id = None
        res.task_id = None
        res.save()
    data = [{'code': 0}]
    return HttpResponse(json.dumps(data), content_type='application/json')


@csrf_exempt
def clear(request):
    with transaction.atomic():
        res_list = Resource.objects.filter(status="1")
        for res in res_list:
            res.status = "0"
            res.dag_id = None
            res.task_id = None
            res.save()
    data = [{'code': 0}]
    return HttpResponse(json.dumps(data), content_type='application/json')