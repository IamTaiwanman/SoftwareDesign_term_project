is_edit = false;
const FORM_URL = '../ajax_events';              //*************************原本:ajax_groups
const MEMBER_URL = '../ajax_eventmember';       //*************************原本:ajax_groupmember
const RELOCATE_URL = '/list_events';            //*************************原本:list_groups

$(document).ready(function() {
    $('#make_eventform').submit(function(e) {
        $('#loading').show();
        e.preventDefault();
        var event_name = $('#event_name').val();
        if (event_name == '') {
            alert('尚未命名活動名稱');
            $('#loading').hide();
            return;
        } else {
            event_form(e);
        }
    });
});

function event_form(e) {
    var open = $('#open').val();
    var event_name = $('#event_name').val();
    var event_info = $('#event_info').val();
    var event_leader = $('#event_leader').val();
    var event_make = $('#event_make').val();
    var event_start_time = $('#event_start_time').val().replace('T',' ');
    var event_end_time = $('#event_end_time').val().replace('T',' ');

    var data = {
        open: open,
        event_name: event_name,
        event_info: event_info,
        event_leader: event_leader,
        event_make: event_make,
        event_start_time: event_start_time,
        event_end_time: event_end_time,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
    $('#loading').show();
    $.ajax({
        method: "POST",
        url: FORM_URL,
        data: data,
        success: function(data) {
            $('#loading').hide();
            if(data == 'repeat event name'){
                alert("repeat event name");
                return;
            }
            event_member(data.ids);
        },
        error: function(data) {
            alert("error");
            $('#loading').hide();
        },
    });
}

function event_member(ids) {
    var event_id = ids;
    var urls = MEMBER_URL;
    var data = {
        event_id: event_id,
    }
    $('#loading').show();
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            var languages = $('#language').val();
            if(languages == "chinese"){
                alert('活動建立成功');
            }
            else if(languages == "english"){
                alert('Created successfully');
            }
            else if(languages == "japanese"){
                alert('グループは正常に作成されました');
            }
            $('#loading').hide();
            window.location = RELOCATE_URL;
        },
        error: function(data) {
            $('#loading').hide();
        }
    });
}

