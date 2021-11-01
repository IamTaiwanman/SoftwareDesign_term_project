is_edit = false;
const FORM_URL = '../ajax_groups';
const MEMBER_URL = '../ajax_groupmember';
const RELOCATE_URL = '/list_groups';

$(document).ready(function() {
    $('#make_groupform').submit(function(e) {
        $('#loading').show();
        e.preventDefault();
        var group_name = $('#group_name').val();
        if (group_name == '') {
            alert('尚未命名群組名稱');
        } else {
            group_form(e);
        }
    });
});

function group_form(e) {
    var open = $('#open').val();
    var group_name = $('#group_name').val();
    var group_info = $('#group_info').val();
    var group_leader = $('#group_leader').val();
    var group_make = $('#group_make').val();
    var urls = FORM_URL;
    var data = {
        open: open,
        group_name: group_name,
        group_info: group_info,
        group_leader: group_leader,
        group_make: group_make,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
    $('#loading').show();
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        success: function(data) {
            $('#loading').hide();
            if(data == 'repeat group name'){
                alert("repeat group name");
                return;
            }
            group_member(data.ids);
        },
        error: function(data) {
            alert("error");
            $('#loading').hide();
        },
    });
}

function group_member(ids) {
    var group_id = ids;
    var urls = MEMBER_URL;
    var data = {
        group_id: group_id,
    }
    $('#loading').show();
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            var languages = $('#language').val();
            if(languages == "chinese"){
                alert('群組建立成功');
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

