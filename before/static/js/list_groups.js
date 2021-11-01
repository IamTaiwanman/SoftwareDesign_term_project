var is_edit = false;
$(document).ready(function() {
    $('#search_group').keyup((event) => {SearchGroup($('#search_group').val(), event)});
    $('#search_member').keyup((event) => {SearchMember($('#search_member').val(), event)});
});

function delete_group(group_id) { //解散群組
    var languages = $('#language').val() || $('#coilanguage').val();    
    if(languages == "chinese" || languages == "中文"){
        var del = confirm("確定刪除?");
    }
    else if(languages == "english" || languages == "英文"){
        var del = confirm("Delete?");
    }
    else if(languages == "japanese" || languages == "日文"){
        var del = confirm("削除済み?");
    }
    if (del == true) {
        $('#loading').show();
        group = '/' + group_id + '/group';
        window.location = LIST_URL + group;
    }
}

function leave_group(group_id) { //解散群組
    var languages = $('#language').val() || $('#coilanguage').val();
    if(languages == "chinese" || languages == "中文"){
        var leave = confirm("確定退出?");
    }
    else if(languages == "english" || languages == "英文"){
        var leave = confirm("Exit?");
    }
    else if(languages == "japanese" || languages == "日文"){
        var leave = confirm("終了して終了します?");
    }
    if (leave == true) {
        $('#loading').show();
        group = '/' + group_id + '/leave';
        window.location = LIST_URL + group;
    }
}

function SearchGroup(groupStr, event) {
    var urls = INVITE_URL;
    let keyCode = event.which;
    data = {
        action: 'search_group',
        group_str: groupStr
    };
    if (keyCode < 37 || keyCode > 40){
        $('#group_result').empty();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                for (var i = 0; i < data.all_group.length; i++) {
                    $('#group_result').append("<option value='" + data.all_group[i].group_name + "' dataId='" + data.all_group[i].group_id + "'>");
                }
            },
            error: function(data) {
                console.log(data)
            }
        });
    }
}

function SearchMember(memberStr, event) {
    if (memberStr.length > 2) {
        var urls = INVITE_URL;
        let keyCode = event.which;
        data = {
            action: 'search_member',
            invite_str: memberStr
        };
        if (keyCode < 37 || keyCode > 40){
            $('#member_result').empty();
            $.ajax({
                method: "POST",
                data: data,
                url: urls,
                success: function(data) {
                    for (var i = 0; i < data.all_member.length; i++) {
                        $('#member_result').append("<option value='" + data.all_member[i].user_name + "' dataId='" + data.all_member[i].user_id + "'>");
                    }
                },
                error: function(data) {
                    console.log(data)
                }
            });
        }
    }
}

$(document).on("click", ".invite_modal", function() { //assign value to modal
    var group_id = $(this).data('id');
    $("#modal_group").val(group_id);
});

function JoinGroups() {
    var group_name = $('#search_group').val();
    var group_id = $("#group_result option[value = '" + group_name + "']").attr('dataId');
    var languages = $('#language').val();
    var urls = INVITE_URL;
    data = {
        action: 'join',
        group_name: group_name,
        group_id: parseInt(group_id)
    }
    let check = $('a[groupId="' + group_id + '"]');
    if (group_name != '' && group_id != '' && check.length == 0) {
        $('#loading').show();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                if (data == 'success') {
                    if(languages == "chinese"){
                        alert('已寄出申請');
                    }
                    else if(languages == "english"){
                         alert('The application has been sent');
                    }
                    else if(languages == "japanese"){
                         alert('申請書を送った');
                    }
                }else if (data == 'already_in_group') {
                    if(languages == "chinese"){
                        alert('不能申請自己的群組');
                    }
                    else if(languages == "english"){
                        alert('Can not apply for your own group');
                    }
                    else if(languages == "japanese"){
                        alert('自分のグループには申請できません');
                    }
                }else if(data == 'msg_exist'){
                    alert('對方尚未回應群組邀請');
                }
                $('#GroupModal').modal('hide');
                $('#loading').hide();
            },
            error: function(data) {
                if(languages == "chinese"){
                    alert('無此群組');
                }
                else if(languages == "english"){
                    alert('No group');
                }
                else if(languages == "japanese"){
                    alert('そのようなグループはありません');
                }
                $('#loading').hide();
            }
        });
    } else {
        if (check.length > 0){
            alert('請勿重複申請群組');
        } else {
            if(languages == "chinese"){
                alert('無此群組');
            }
            else if(languages == "english"){
                alert('No group');
            }
            else if(languages == "japanese"){
                alert('そのようなグループはありません');
            }
        }
        $('#loading').hide();
    }
}

function InviteFriend() {
    var group_id = $('#modal_group').val();
    var member_name = $('#search_member').val();
    var languages = $('#language').val();
    var urls = INVITE_URL;
    data = {
        action: 'invite',
        member_name: member_name,
        group_id: group_id
    }
    if (member_name != '' && group_id != '') {
        $('#loading').show();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                if (data == 'success') {
                    if(languages == "chinese"){
                        alert('已寄出邀請');
                    }else if(languages == "english"){
                        alert('Invitation has sent');
                    }else if(languages == "japanese"){
                        alert('招待状が送信されました');
                    }
                } else if (data == 'sameid') {
                    if(languages == "chinese"){
                        alert('不能寄送邀請給自己');
                    }else if(languages == "english"){
                        alert('Can not send an invitation to yourself');
                    }else if(languages == "japanese"){
                        alert('あなた自身に招待状を送ることはできません');
                    }
                } else if (data == 'mamber_exist') {
                    if(languages == "chinese"){
                        alert('此成員已在群組內');
                    }else if(languages == "english"){
                        alert('This member is already in the group');
                    }else if(languages == "japanese"){
                        alert('このメンバーは既にグループに属しています');
                    }
                }else if(data == 'msg_exist'){
                    alert('對方尚未回應群組邀請');
                }
                $('#inviteModal').modal('hide');
                $('#loading').hide();
            },
            error: function(data) {
                if(languages == "chinese"){
                    alert('無此用戶');
                }
                else if(languages == "english"){
                    alert('No user found');
                }
                else if(languages == "japanese"){
                    alert('ユーザーが見つかりません');
                }

                $('#loading').hide();
            }
        });
    } else {
        var languages = $('#language').val();
        if(languages == "chinese"){
            alert('尚未選擇群組朋友');
        }
        else if(languages == "english"){
            alert('No friends have been selected');
        }
        else if(languages == "japanese"){
            alert('友人が選択されていない');
        }

    }
}

function ReplyInvite(reply, group_id, message_id, inviter) {
    var urls = INVITE_URL;
    data = {
        action: 'reply',
        reply: reply,
        group_id: group_id,
        message_id: message_id,
        inviter: inviter,
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            if (data == 'success') {
                var languages = $('#language').val();
                if(languages == "chinese"){
                    alert('已加入群組');
                }
                else if(languages == "english"){
                    alert('added');
                }
                else if(languages == "japanese"){
                    alert('グループ追加');
                }
            } else if (data == 'reject') {
                alert('已拒絕加入群組');
            }
            window.location = LIST_URL;
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function ReplyApply(reply, group_id, message_id, applicant) {
    var urls = INVITE_URL;
    data = {
        action: 'application',
        reply: reply,
        group_id: group_id,
        message_id: message_id,
        applicant: applicant,
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            if (data == 'success') {
                var languages = $('#language').val();
                if(languages == "chinese"){
                    alert('已同意加入群組');
                }
                else if(languages == "english"){
                    alert('Has agreed to join the group');
                }
                else if(languages == "japanese"){
                    alert('グループに参加することに同意した');
                }
            } else if (data == 'refuse') {
                var languages = $('#language').val();
                if(languages == "chinese"){
                    alert('已拒絕進入群組');
                }
                else if(languages == "english"){
                    alert('Rejected into group');
                }
                else if(languages == "japanese"){
                    alert('グループに拒否されました');
                }
            }
            window.location = LIST_URL;
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function AllAgree() {
    let getchk = $('.dropdown-menu > li > div > .chk_msg');
    if (getchk.is(":checked")) {
        let agreeList = getchk.next();
        $('#loading').show();
        RecursivePromise(agreeList, 0);
    }
}

function AllRefuse() {
    let refuseList = $('.dropdown-menu > li > div > .btn-danger');
    $('#loading').show();
    RecursivePromise(refuseList, 0);
}

function RecursivePromise(objList, i) {
    PromiseClick(objList[i]).then(() => {
        if ((i + 1) < objList.length) {
            RecursivePromise(objList, i + 1);
        } else {
            window.location = LIST_URL;
        }
    })
}

function PromiseClick(obj) {
    return new Promise((resolve, reject) => {
        let regx = /Reply(\w+)\('(\w+)',(\d+),(\d+),(\d+)\)/;
        let arguArray = regx.exec(obj.attributes.onclick.value);
        let data;
        let urls = INVITE_URL;

        if (arguArray[1] == 'Invite') {
            data = {
                action: 'reply',
                reply: arguArray[2],
                group_id: parseInt(arguArray[3]),
                message_id: parseInt(arguArray[4]),
                inviter: parseInt(arguArray[5]),
            }
        } else if (arguArray[1] == 'Apply') {
            data = {
                action: 'application',
                reply: arguArray[2],
                group_id: parseInt(arguArray[3]),
                message_id: parseInt(arguArray[4]),
                applicant: parseInt(arguArray[5]),
            }
        }

        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                resolve('success');
            },
            error: function(data) {
                reject('fail');
            }
        });
    })
}