

function Kickout(event_id, member_id) { //event_id 可拿掉
    var urls = '../ajax_invite';
    data = {
        action: 'kickout',
        event_id: event_id,
        member_id: member_id,
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            if (data == 'success') {
                var languages = $('#language').val();
                if (languages == "chinese") {
                    alert('已將用戶移出活動');
                }
                else if (languages == "english") {
                    alert('User removed');
                }
                else if (languages == "japanese") {
                    alert('ユーザーが削除されました');
                }
                $('#member' + member_id).fadeOut();
            } else {
                alert('Error');
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
}



function modify_event() {
    var urls = '../ajax_events';
    var event_name = $('#edit_title').val();
    var opens = $("#event-open").val();
    var event_info = $('#event_info').val();
    var event_start_time = $('#event_start_time').val().replace('T',' ');
    var event_end_time = $('#event_end_time').val().replace('T',' ');

    data = {
        event_id: event_id,
        event_make: 'edit_event',
        event_name: event_name,
        event_info: event_info,
        open: opens, //Check open value in cloud server
        event_start_time: event_start_time,
        event_end_time: event_end_time,
    }
    // console.log(data);
    // alert(data);
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            if (data == 'success') {
                $('#event_info').delay(1000).fadeOut('slow');
                $('#event_modal').modal('hide');
                location.reload();
            }else if(data == "repeat"){
                alert("repeat event name");
                $('#event_info').delay(1000).fadeOut('slow');
                $('#event_modal').modal('hide');
            }else{
                alert("repeat event name!!!!");
                alert(data)
                $('#event_info').delay(1000).fadeOut('slow');
                $('#event_modal').modal('hide');
            }
        },
        error: function (data) {
            alert("error!!");
            console.log(data);
        }
    });
}
function selectedGroupSubmit(event_id){
    var obj=document.getElementsByName("selectedGroup");
    var len = obj.length;
    var selectedGroupID=[];
    var count=0;

    for(var i = 0; i < len; i++)
    {
        if (obj[i].checked == true)
        {
            selectedGroupID[count]=obj[i].value;
            count++;
        }
    }
    // for(var i = 0; i < count; i++)
    // {
    //     alert(selectedGroupID[i]);
    // }

    /*刪掉[EventsGroup]中原本event_id==這邊的event_id的資料*/
    /*新增這次所選擇的Group到[EventsGroup]中*/
    data = {
        event_id: event_id,
        selectedGroupID: JSON.stringify(selectedGroupID),
    }
    $.ajax({
        method: "POST",
        data: data,
        url: '../event_authority',
        success: function (data) {
            if (data == 'success') {
                alert("成功修改授權群組");
            }
        },
        error: function (data) {
            alert("error!!");
            console.log(data);
        }
    });
}

$('#event-open').change(function() {
    var open = $(this).val();
    var btn = document.getElementById("privateSetting");
    if(open == 1)
    {
        btn.disabled = true;
    }
    else
    {
        btn.disabled = false;
    }
});