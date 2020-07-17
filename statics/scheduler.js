$(function(){
        $("button.room").click(function() {
            console.log("测试按钮");
            var room_id = $(this).attr('id');
            console.log(room_id);
            $.ajax({
                url: "/scheduler/ajax_query_res/",
                type: "GET",
                dateType:'json',
                data: {"id": room_id},
                success: function (data) {
//                   console.log(data);
                     var res = window.document.getElementById("resource—list");
                     if (!res){
                          res.innerHTML='';
                          return
                          }
                     var str1 = '';
                     for (r in data){
//                          console.log(data[r]);
                          str1 += `
                          <li class="user-tooltip" id=side-res-`+data[r]["id"]+` data-status=`+data[r]["status"]+` data-username=`+data[r]["name"]+` data-position="left" data-filter-item="" data-filter-name=`+data[r]["name"]+`>
                                <div class="user-image">
                                    <img src="../statics/assets/images/avatar/1.jpg" class="avatar" alt=`+data[r]["name"]+`>
                                </div>
                                <span class="user-name">`+data[r]["name"]+`</span>
                                <span class="user-show"></span>
                          </li>`;
                      }
                      res.innerHTML = str1;
    //                $("#edit_id").val(data["id"]);
    //                $("#edit_name").val(data["name"]);
    //                $("#edit_type").val(data["type"]);
    //                $("#edit_heterogeneous").val(data["heterogeneous"]);
    //                $("#edit_room_id").val(data["room_id"]);
    //                $('#myEditModal').modal('show');
                }
            });
            if($("div.chat-sidebar").hasClass('is-active')){
                $("div.chat-sidebar").removeClass("is-active");
            }else{
                $("div.chat-sidebar").addClass("is-active");
            }
        })
    })

var id = document.getElementById("drawflow");
const editor = new Drawflow(id);


$(function(){
        $("#preview").click(function() {
            var dag_id = $("#dag-show").find("option:selected").attr('id');
//            console.log(dag_id);
             $.ajax({
                    url: "/scheduler/ajax_dags_show/",
                    type: "GET",
                    dateType:'json',
                    data: {"id": dag_id},
                    success: function (data) {
    //                   console.log(data);
                       var data = data[0];
                       var draw = {"drawflow":
                                    {"Home":
                                       {"data":{}}
                                    }
                                  };
                       for(i in data["task_list"]){
                             var pos_x = data["task_list"][i]["left"];
                             var pos_y = data["task_list"][i]["top"];
                             var task = data["task_list"][i]
                             var node_temp = `
                                  <div>
                                  <div class="title-box dag-show-`+dag_id+`">
                                     <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                     <circle cx="8" cy="8" r="8"/>
                                     </svg>    <span>Task Node: `+task["id"]+`</span></div>
                                     <div class="box">
                                     <p>Task Describe</p>
                                     <input type="text" df="task" value=`+task["task"]+` disabled="disabled">
                                     </div>
                                     <div class="box">
                                     <p>Resource Type</p>
                                     <input type="text" df="type" value=`+task["resource_type"]+` disabled="disabled">
                                     </div>
                                     <div class="box">
                                     <p>Occupy Time</p>
                                     <input type="text" df="occupy" value=`+task["occupy_time"]+` disabled="disabled">
                                     </div>
                                  </div>
                                  `;
                             var node = {"id":task["id"],
                                         "name":"node-"+task["id"],
                                         "data":{},
                                         "class":"telegram",
                                         "html": node_temp,
                                         "typenode": false,
                                         "inputs":{"input_1": {"connections": []}},
                                         "outputs":{"output_1": {"connections": []}},
                                         "pos_x": pos_x-960,
                                         "pos_y":pos_y};
                             var inputs = [];
                                if(task.input){
                                    for(x in task.input){
                                        inputs.push({"node": task.input[x]["node_id"], "input": "output_1"});
                                    }
                                }
                             var outputs = [];
                                if(task.output){
                                    for(x in task.output){
                                        outputs.push({"node": task.output[x]["node_id"], "output": "input_1"});
                                    }
                                }
                             node["inputs"]["input_1"]["connections"] = inputs
                             node["outputs"]["output_1"]["connections"] = outputs
                             draw["drawflow"]["Home"]["data"][task["id"]] = node;
                       }
                       editor.drawflow = draw
                       editor.start();
                    }
                });
        })
    })


$(function(){
        $("#assign").click(function() {
            var dag_id = $("#dag-show").find("option:selected").attr('id');
            if(!dag_id){
                return
            }
            $.ajax({
                    url: "/scheduler/ajax_binding/",
                    type: "post",
                    dateType:'json',
                    data: {"id": dag_id},
                    success: function (data) {
                       console.log(data);
                       window.location.reload();
                    }
                });

        })
})

function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}


$(function(){
        $("#run").click(function() {
            if(!$("button.room").hasClass('btn-danger')){
                return
            }
            $.ajax({
                    url: "/scheduler/ajax_run/",
                    type: "get",
                    dateType:'json',
                    async : false,
                    data: {"msg": "开始执行"},
                    success: function (data) {
                       var data = data[0];
                       var draw = {"drawflow":
                                    {"Home":
                                       {"data":{}}
                                    }
                                  };
                       for(i in data["node_list"]){
                             var pos_x = data["node_list"][i]["left"];
                             var pos_y = data["node_list"][i]["top"];
                             var task = data["node_list"][i]
                             var node_temp = `
                                  <div>
                                  <div class="title-box">
                                     <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                     <circle cx="8" cy="8" r="8"/>
                                     </svg>    <span> 流程: `+task['dag_id']+`  | Task Node: `+task["id"]+`</span></div>
                                     <div class="box" style="padding-bottom: 0px;">
                                     <p>Task Describe</p>
                                     <input type="text" df="task" value=`+task["task"]+` disabled="disabled">
                                     </div>
                                     <div class="box" style="padding-bottom: 0px;">
                                     <p>Resource Type</p>
                                     <input type="text" df="type" value=`+task["resource_type"]+` disabled="disabled">
                                     </div>
                                     <div class="box" style="padding-bottom: 0px;">
                                     <p>Occupy Time</p>
                                     <input type="text" df="occupy" value=`+task["occupy_time"]+` disabled="disabled">
                                     </div>
                                     <div class="box" style="padding-bottom: 10px;">
                                     <p>Occupy Resource</p>
                                     <span class="ti-layout-grid3-alt" id="res-task-`+task["id"]+`">          等待资源</span>
                                     <div class="progress" style="margin-bottom: 0px;">
                                     <div class="progress-bar bg-danger time-progress" id="progress-`+task["id"]+`" style="width:0%;" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">0%</div>
                                     </div>
                                     </div>
                                  </div>
                                  `;
                             var node = {"id":task["id"],
                                         "name":"node-"+task["id"],
                                         "data":{},
                                         "class":"telegram",
                                         "html": node_temp,
                                         "typenode": false,
                                         "inputs":{"input_1": {"connections": []}},
                                         "outputs":{"output_1": {"connections": []}},
                                         "pos_x": pos_x,
                                         "pos_y":pos_y};
                             var inputs = [];
                                if(task.input){
                                    for(x in task.input){
                                        inputs.push({"node": task.input[x]["node_id"], "input": "output_1"});
                                    }
                                }
                             var outputs = [];
                                if(task.output){
                                    for(x in task.output){
                                        outputs.push({"node": task.output[x]["node_id"], "output": "input_1"});
                                    }
                                }
                             node["inputs"]["input_1"]["connections"] = inputs
                             node["outputs"]["output_1"]["connections"] = outputs
                             draw["drawflow"]["Home"]["data"][task["id"]] = node;
                       }
                       console.log(draw);
                       editor.drawflow = draw;
                       editor.start();

                    // 节点计时
                    node_time = {};
                    for(i in data["node_list"]){
                        var n = {};
                        var task_id = data["node_list"][i]["id"];
//                        console.log(task_id)
                        n["cur_time"] = 0;
                        n["res_time"] = data["node_list"][i]["occupy_time"];
//                        console.log(n)
                        node_time[task_id]=n;
//                        console.log(node_time)
                    }
                    var t = 1
                    var ready = []
                    var finished = []
                    $('body').everyTime('1s',function(){
                        console.log("ready"+ready);
                        console.log("finish"+finished);
                        // 申请资源
                        for(i in data["node_list"]){
                            var task = data["node_list"][i];
                            // 如果输入等于0则可以直接向服务器申请资源
                            console.log("0:"+task["id"])
                            console.log(isInArray(ready,task["id"]))
                            if(!isInArray(ready,task["id"])){
                                console.log("1:"+task["id"])
                                var task_node_id = task["id"]
                                if(task["input"].length == 0){
                                     // 请求资源 否则轮询
                                     console.log("2:"+task["id"])

                                     $.ajax({
                                            url: "/scheduler/ajax_apply/",
                                            type: "post",
                                            dateType:'json',
                                            async : false,
                                            data: {"type": task["resource_type"], "node_id": task_node_id},
                                            success: function (apply_data) {
                                               apply_data = apply_data[0];
//                                               console.log("-------------apply_data")
//                                               console.log(apply_data)
//                                               console.log("3:"+task["id"])
                                               if(apply_data["code"]==1){
                                                    $("#res-task-"+task_node_id).text("     暂无可用资源");
                                               }else{
                                                    console.log(task_node_id)
                                                    ready.push(task_node_id);
                                                    $("#res-task-"+task_node_id).text("     "+apply_data["res_name"]+" ("+apply_data["res_room"]+")");
                                                    $("#res-task-"+task_node_id).attr("res_id",apply_data["res_id"]);
                                                    $("#side-res-"+apply_data["res_id"]).attr("data-status","online");
                                                    $("#side-res-"+apply_data["res_id"]).css("color","red");
                                               }
                                            }
                                        });

                                }else{
                                     var flag = true;
//                                     console.log(task["input"])
                                     for(x in task["input"]){
                                         pre = parseInt(task["input"][x]["node_id"])
                                         if(!isInArray(finished,pre)){
                                            flag = false;
                                            break;
                                         }
                                     }
                                     if(flag){
                                        // 请求资源 否则轮询
                                     console.log(task)
                                     console.log(task_node_id)
                                        $.ajax({
                                            url: "/scheduler/ajax_apply/",
                                            type: "post",
                                            dateType:'json',
                                            async : false,
                                            data: {"type": task["resource_type"], "node_id": task_node_id},
                                            success: function (apply_data) {
                                               apply_data = apply_data[0];
//                                               console.log("-------------apply_data")
//                                               console.log(apply_data)
                                               if(apply_data["code"]==1){
                                                    $("#res-task-"+task_node_id).text("     暂无可用资源");
                                               }else{
                                                    ready.push(task_node_id);
                                                    $("#res-task-"+task_node_id).text("     "+apply_data["res_name"]+" ("+apply_data["res_room"]+")");
                                                    $("#res-task-"+task_node_id).attr("res_id",apply_data["res_id"]);
                                                    $("#side-res-"+apply_data["res_id"]).attr("data-status","online");
                                                    $("#side-res-"+apply_data["res_id"]).css("color","red");
                                               }
                                            }
                                        });
                                     }
                                }
                            }else{
                                console.log(task["id"]+"已经分配了资源")
                            }
                        }
                        // 增加运行时间
                        for(i in ready){
                            node_id = ready[i];
//                            console.log(node_time);
                            if(!isInArray(finished,node_id)){
                                 node_time[node_id]["cur_time"] = node_time[node_id]["cur_time"] + 1;
                                 var width = Math.round(node_time[node_id]["cur_time"]*100/node_time[node_id]["res_time"])
                                 var pro_text = '#progress-'+node_id;
                                 $(pro_text).css("width",width+"%");
                                 $(pro_text).text(width+"%");
                                 if(node_time[node_id]["cur_time"] >= node_time[node_id]["res_time"]){
                                    finished.push(node_id);
                                    var resource_id = $("#res-task-"+node_id).attr("res_id")
                                    $.ajax({
                                            url: "/scheduler/ajax_release/",
                                            type: "post",
                                            dateType:'json',
                                            async : false,
                                            data: {"resource_id": resource_id},
                                            success: function (apply_data) {
                                               apply_data = apply_data[0]
                                               if(apply_data["code"]==0){
                                                    ready.push(node_id);
                                                    $("#res-task-"+node_id).next().children().css("background-color","#ed7f7e");
                                                    $("#side-res-"+resource_id).attr("data-status","offline");
                                                    $("#side-res-"+resource_id).css("color","black");
                                               }
                                            }
                                        });
                                 }
                            }
                        }
                    },45);

                    }
                });
        })
})


$(function(){
        $("#clear").click(function() {
            $.ajax({
                    url: "/scheduler/ajax_clear/",
                    type: "post",
                    dateType:'json',
                    async : false,
                    data: {"id": "666"},
                    success: function (data) {
                       alert("一键空闲成功");
                       window.location.reload();
                    }
                });

        })
})
