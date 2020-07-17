import networkx as nx
from django.core.serializers import json
from django.core.serializers import serialize,deserialize
from django.test import TestCase
from dags.models import *

# Create your tests here.
nodes = [{"id":"node-2","task":"爱奇艺","occupy":"1","type":"type_0"},{"id":"node-3","task":"萨达","occupy":"1","type":"type_0"},{"id":"node-4","task":"123","occupy":"1","type":"type_0"}]
edges = ["connection node_in_node-3 node_out_node-2 output_1 input_1","connection node_in_node-4 node_out_node-3 output_1 input_1"]


def dag_add(node_list, edge_list):
    node_dist = deserialize("json", '[' + str(node_list) +']')
    edge_dist = deserialize("json", '[' + str(node_list) +']')
    return "无奈"


def test_node_graph(edge_list):
    g = nx.DiGraph()
    g.add_edges_from(edge_list)

    inputs = g.pred._atlas
    outputs = g.succ._atlas
    print(list(inputs[4].keys()))

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


# test_node_graph([(1,2),(1,3),(2,4),(3,4)])


def dag_binding():
    """
    为DAG分配合适的房间
    :param request:
    :return:
    """
    dag_id = 5
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

    # binding room with dag
    dag.room_id = binding_room_id
    dag.save()
    room = Room.objects.filter(room_id=binding_room_id)
    room.status = "1"
    room.save()
    data = [{'room_id': binding_room_id}]

dag_binding()
