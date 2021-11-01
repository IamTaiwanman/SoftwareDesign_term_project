var is_edit = false;
$(document).ready(function() {
    $('#search_event').keyup((event) => {Searchevent($('#search_event').val(), event)});
    $('#search_member').keyup((event) => {SearchMember($('#search_member').val(), event)});
});

function delete_event(event_id) { //解散活動
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
        event = '/' + event_id + '/event';
        window.location = LIST_URL + event;
    }
}

function leave_event(event_id) { //解散活動
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
        event = '/' + event_id + '/leave';
        window.location = LIST_URL + event;
    }
}

function Searchevent(eventStr, event) {
    var urls = INVITE_URL;
    let keyCode = event.which;
    data = {
        action: 'search_event',
        event_str: eventStr
    };
    if (keyCode < 37 || keyCode > 40){
        $('#event_result').empty();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                for (var i = 0; i < data.all_event.length; i++) {
                    $('#event_result').append("<option value='" + data.all_event[i].Event_name + "' dataId='" + data.all_event[i].Event_id + "'>");
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
    var event_id = $(this).data('id');
    $("#modal_event").val(event_id);
});

function Joinevents() {
    var event_name = $('#search_event').val();
    var event_id = $("#event_result option[value = '" + event_name + "']").attr('dataId');
    var languages = $('#language').val();
    var urls = INVITE_URL;
    data = {
        action: 'join',
        event_name: event_name,
        event_id: parseInt(event_id)
    }
    let check = $('a[eventId="' + event_id + '"]');
    if (event_name != '' && event_id != '' && check.length == 0) {
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
                }else if (data == 'already_in_event') {
                    if(languages == "chinese"){
                        alert('不能申請自己的活動');
                    }
                    else if(languages == "english"){
                        alert('Can not apply for your own event');
                    }
                    else if(languages == "japanese"){
                        alert('自分のグループには申請できません');
                    }
                }else if(data == 'msg_exist'){
                    alert('對方尚未回應活動邀請');
                }
                $('#eventModal').modal('hide');
                $('#loading').hide();
            },
            error: function(data) {
                if(languages == "chinese"){
                    alert('無此活動');
                }
                else if(languages == "english"){
                    alert('No event');
                }
                else if(languages == "japanese"){
                    alert('そのようなグループはありません');
                }
                $('#loading').hide();
            }
        });
    } else {
        if (check.length > 0){
            alert('請勿重複申請活動');
        } else {
            if(languages == "chinese"){
                alert('無此活動');
            }
            else if(languages == "english"){
                alert('No event');
            }
            else if(languages == "japanese"){
                alert('そのようなグループはありません');
            }
        }
        $('#loading').hide();
    }
}

function InviteFriend() {
    var event_id = $('#modal_event').val();
    var member_name = $('#search_member').val();
    var languages = $('#language').val();
    var urls = INVITE_URL;
    data = {
        action: 'invite',
        member_name: member_name,
        event_id: event_id
    }
    if (member_name != '' && event_id != '') {
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
                        alert('此成員已在活動內');
                    }else if(languages == "english"){
                        alert('This member is already in the event');
                    }else if(languages == "japanese"){
                        alert('このメンバーは既にグループに属しています');
                    }
                }else if(data == 'msg_exist'){
                    alert('對方尚未回應活動邀請');
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
            alert('尚未選擇活動朋友');
        }
        else if(languages == "english"){
            alert('No friends have been selected');
        }
        else if(languages == "japanese"){
            alert('友人が選択されていない');
        }

    }
}

function ReplyInvite(reply, event_id, message_id, inviter) {
    var urls = INVITE_URL;
    data = {
        action: 'reply',
        reply: reply,
        event_id: event_id,
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
                    alert('已加入活動');
                }
                else if(languages == "english"){
                    alert('added');
                }
                else if(languages == "japanese"){
                    alert('グループ追加');
                }
            } else if (data == 'reject') {
                alert('已拒絕加入活動');
            }
            window.location = LIST_URL;
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function ReplyApply(reply, event_id, message_id, applicant) {
    var urls = INVITE_URL;
    data = {
        action: 'application',
        reply: reply,
        event_id: event_id,
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
                    alert('已同意加入活動');
                }
                else if(languages == "english"){
                    alert('Has agreed to join the event');
                }
                else if(languages == "japanese"){
                    alert('グループに参加することに同意した');
                }
            } else if (data == 'refuse') {
                var languages = $('#language').val();
                if(languages == "chinese"){
                    alert('已拒絕進入活動');
                }
                else if(languages == "english"){
                    alert('Rejected into event');
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
                event_id: parseInt(arguArray[3]),
                message_id: parseInt(arguArray[4]),
                inviter: parseInt(arguArray[5]),
            }
        } else if (arguArray[1] == 'Apply') {
            data = {
                action: 'application',
                reply: arguArray[2],
                event_id: parseInt(arguArray[3]),
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

function Export( table, filename ) {
    table.table2csv( 'download', {
        filename: filename
    });
}

function Import(room_id) {
    $("<input>").attr('type','file').attr('accept','.csv').click().change(function(){
        $('#loading').show();
        Papa.parse(this.files[0], {
            complete: function(results, file) {

                var data = results.data;

                var g = {
                    'room_name': null,        
                    'auto_start': null,
                    'start_time': null,
                    'play_time': null,
                }

                if(!Array.isArray(data[2])) {
                    alert("走讀設定格式錯誤");
                    $('#loading').hide();
                    return;
                }

                if(data[2][0] != "") {
                    g['room_name'] = data[2][0];
                }
                else {
                    alert("走讀設定場次名稱格式錯誤");
                    $('#loading').hide();
                    return;
                }
                
                if(data[2][1] == "") {
                    g['auto_start'] = false;
                }
                else if( /^\d+-\d+-\d+ \d+:\d+$/.test(data[2][1]) && !isNaN(Date.parse(data[2][1])) ) {
                    g['auto_start'] = true;
                    g['start_time'] = data[2][1];
                }
                else {
                    alert("走讀設定開始時間格式錯誤");
                    $('#loading').hide();
                    return;
                }

                if(/^\d*[1-9]\d*$/.test(data[2][2]) ) {
                    g['play_time'] = data[2][2];
                }
                else {
                    alert("走讀設定答題時間格式錯誤");
                    $('#loading').hide();
                    return;
                }

                var chest_list = [];
                for(i=6;i<data.length;i++) {

                    var c = {
                        'room_id_id': room_id,
                        'id': null,
                        'poi_id_id': null,
                        'lat': null,
                        'lng': null,
                        'num': null,
                        'point': null,
                        'distance': null,
                        'question_type': null,
                        'question': null,
                        'answer': null,
                        'option1': null,
                        'option2': null,
                        'option3': null,
                        'option4': null,
                        'hint1': null,
                        'hint2': null,
                        'hint3': null,
                        'hint4': null,
                        'localId': ""
                    };

                    if(data[i].join('') == "") {
                        continue;
                    }
                    else {
                        while(data[i].length < 16) {
                            data[i].push("");
                        }

                        if(/^(是非題|單選題|問答題|闖關尋奇|闖關尋奇終點)$/.test(data[i][5])) {
                            switch(data[i][5]) {
                                case '是非題': c['question_type'] = '1'; break;
                                case '單選題': c['question_type'] = '2'; break;
                                case '問答題': c['question_type'] = '3'; break;
                                case '闖關尋奇': c['question_type'] = '4'; break;
                                case '闖關尋奇終點': c['question_type'] = '5'; break;
                            }
                        }
                        else {
                            alert("走讀題目設定第"+(i-5)+"題題型格式錯誤");
                            $('#loading').hide();
                            return;
                        }

                        if(/^(|-)\d*(|\.)\d*$/.test(data[i][0])) {
                            c['lat'] = data[i][0];
                        }
                        else {
                            alert("走讀題目設定第"+(i-5)+"題緯度格式錯誤");
                            $('#loading').hide();
                            return;
                        }

                        if(/^(|-)\d*(|\.)\d*$/.test(data[i][1])) {
                            c['lng'] = data[i][1];
                        }
                        else {
                            alert("走讀題目設定第"+(i-5)+"題經度格式錯誤");
                            $('#loading').hide();
                            return;
                        }

                        if(/^(|\d*[1-9]\d*)$/.test(data[i][2])) {
                            if(data[i][2] != "" && c['question_type'] != "4")
                                c['num'] = data[i][2];
                        }
                        else {
                            alert("走讀題目設定第"+(i-5)+"題可答題人數格式錯誤");
                            $('#loading').hide();
                            return;
                        }

                        if(/^(|\d*[1-9]\d*)$/.test(data[i][3])) {
                            if(data[i][3] != "" && c['question_type'] != "4")
                                c['point'] = data[i][3];
                        }
                        else {
                            alert("走讀題目設定第"+(i-5)+"題答題積分格式錯誤");
                            $('#loading').hide();
                            return;
                        }

                        if(/^(|50|\d*[1-9]\d*[05]0)$/.test(data[i][4])) {
                            if(data[i][4] != "")
                                c['distance'] = data[i][4];
                        }
                        else {
                            alert("走讀題目設定第"+(i-5)+"題題目可被發現距離格式錯誤");
                            $('#loading').hide();
                            return;
                        }
                        
                        if(data[i][6] != "") {
                            c['question'] = data[i][6];
                        }
                        else {
                            alert("走讀題目設定第"+(i-5)+"題題目格式錯誤");
                            $('#loading').hide();
                            return;
                        }

                        switch(c['question_type']) {
                        case '1':
                            if(/^[TF]$/.test(data[i][7])) {
                                c['answer'] = data[i][7];
                            }
                            else {
                                alert("走讀題目設定第"+(i-5)+"題答案格式錯誤");
                                $('#loading').hide();
                                return;                                
                            }
                            break;
                        case '2':
                            if(/^[A-D]$/.test(data[i][7])) {
                                c['answer'] = data[i][7];
                            }
                            else {
                                alert("走讀題目設定第"+(i-5)+"題答案格式錯誤");
                                $('#loading').hide();
                                return;                                
                            }
                            if(data[i][8] == '' && data[i][9] + data[i][10] + data[i][11] != '') {
                                alert("走讀題目設定第"+(i-5)+"題請依序填入選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else if(data[i][8] == '') {
                                alert("走讀題目設定第"+(i-5)+"題請至少填入兩項選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['option1'] = data[i][8];
                            }
                            if(data[i][9] == '' && data[i][10] + data[i][11] != '') {
                                alert("走讀題目設定第"+(i-5)+"題請依序填入選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else if(data[i][9] == '') {
                                alert("走讀題目設定第"+(i-5)+"題請至少填入兩項選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['option2'] = data[i][9];
                            }
                            if(data[i][10] == '' && data[i][11] != '') {
                                alert("走讀題目設定第"+(i-5)+"題請依序填入選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else if(c['answer'] =='C' && data[i][10] == '') {
                                alert("走讀題目設定第"+(i-5)+"題設為答案的選項必須有值");
                                $('#loading').hide();
                                return;                                
                            }
                            else if(data[i][10] != "") {
                                c['option3'] = data[i][10];
                            }
                            if(c['answer'] =='D' && data[i][11] == '') {
                                alert("走讀題目設定第"+(i-5)+"題設為答案的選項必須有值");
                                $('#loading').hide();
                                return;                                
                            }
                            else if(data[i][11] != "") {
                                c['option4'] = data[i][11];
                            }                
                            break;
                        case '3':
                            break;
                        case '4':
                            if(window.location.href.includes('extn')) {
                                alert("尚未支援匯入闖關尋奇");
                                $('#loading').hide();
                                return;                                
                            }
                            if(data[i][8] == '' && data[i][9] + data[i][10] + data[i][11] != '') {
                                alert("走讀題目設定第"+(i-5)+"題請依序填入選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else if(data[i][8] == '') {
                                alert("走讀題目設定第"+(i-5)+"題請至少填入一項選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['option1'] = data[i][8];
                            }
                            if(data[i][9] == '' && data[i][10] + data[i][11] != '') {
                                alert("走讀題目設定第"+(i-5)+"題請依序填入選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else if(data[i][9] == '' && data[i][13] != '') {
                                alert("走讀題目設定第"+(i-5)+"題指示B有值則選項B需填寫");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['option2'] = data[i][9];
                            }
                            if(data[i][10] == '' && data[i][11]) {
                                alert("走讀題目設定第"+(i-5)+"題請依序填入選項");
                                $('#loading').hide();
                                return;                                
                            }
                            else if(data[i][10] == '' && data[i][14] != '') {
                                alert("走讀題目設定第"+(i-5)+"題指示C有值則選項C需填寫");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['option3'] = data[i][10];
                            }
                            if(data[i][11] == '' && data[i][15] != '') {
                                alert("走讀題目設定第"+(i-5)+"題指示D有值則選項D需填寫");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['option4'] = data[i][11];
                            }
                            if(data[i][8] != '' && data[i][12] == '') {
                                alert("走讀題目設定第"+(i-5)+"選項A有值則指示A需填寫");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['hint1'] = data[i][12];
                            }
                            if(data[i][9] != '' && data[i][13] == '') {
                                alert("走讀題目設定第"+(i-5)+"選項B有值則指示B需填寫");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['hint2'] = data[i][13];
                            }
                            if(data[i][10] != '' && data[i][14] == '') {
                                alert("走讀題目設定第"+(i-5)+"選項C有值則指示C需填寫");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['hint3'] = data[i][14];
                            }
                            if(data[i][11] != '' && data[i][15] == '') {
                                alert("走讀題目設定第"+(i-5)+"選項D有值則指示D需填寫");
                                $('#loading').hide();
                                return;                                
                            }
                            else {
                                c['hint4'] = data[i][15];
                            }
                            break;
                        case '5':
                            if(window.location.href.includes('extn')) {
                                alert("尚未支援匯入闖關尋奇終點");
                                $('#loading').hide();
                                return;                                
                            }
                            break;
                        }

                        chest_list.push(c);
                    }

                }

                $.ajax({
                    method: "POST",
                    url: "/ajax_game_setting",
                    data: {
                        'room_id': room_id,
                        'game': JSON.stringify(g),
                    },
                    success: function(data) {
                        if( data == "Success" ) {

                            var d = new FormData();
                            d.append('room_id', room_id);
                            d.append('chest[]', JSON.stringify(chest_list));
                            d.append('del_chest[]', JSON.stringify([]));
                            d.append('del_media[]', JSON.stringify([]));
                    
                            $.ajax({
                                method: "POST",
                                url: "/ajax_game_chest_setting",
                                data: d,
                                contentType:false,
                                processData:false,
                                success: function(data) {
                                    if( data == "Success" ) {
                                        alert("Success，共匯入"+chest_list.length+"筆題目。");
                                        document.location = document.location;
                                    }
                                    else if( data == "Start" ) {
                                        alert("走讀已開始，無法進行設定。")
                                    }
                                    else if( data == "Error" ) {
                                        alert("Error");
                                    }
                                    $('#loading').hide();
                                },
                                error: function(data) {
                                    alert("Error");
                                    $('#loading').hide();
                                }
                            });

                        }
                        else if( data == "Start" ) {
                            alert("走讀已開始，無法進行設定。")
                            $('#loading').hide();
                        }
                        else if( data == "Error" ) {
                            alert("Error");
                            $('#loading').hide();
                        }
                    },
                    error: function(data) {
                        alert("Error");
                        $('#loading').hide();
                    }
                });

            }
        });
        
    });
}