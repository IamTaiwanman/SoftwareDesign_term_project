is_edit = false;

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
                    'game_prize_detail' : '沒有設置獎品'
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
                                url: "/ajax_event_chest_setting",
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

function Create(group_id) {
    var room_name = prompt("請輸入場次名稱");
    if( room_name != null && room_name != "" ) {
        $.ajax({
            method: "POST",
            url: "/ajax_game_create",
            data: {
                'group_id': group_id,
                'room_name': room_name
            },
            success: function(data) {
                if( data == "Success" ) {
                    alert("Success");
                    document.location = document.location;
                }
                else if( data == "Error" ) {
                    alert(data)
                    $('#loading').hide();
                }
            },
            error: function(data) {
                alert("Error");
                $('#loading').hide();
            }
        });
    }
}

function Create_room(event_id) {
    var room_name = prompt("請輸入場次名稱");
    if( room_name != null && room_name != "" ) {
        $.ajax({
            method: "POST",
            url: "/ajax_event_room_create",
            data: {
                'event_id': event_id,
                'room_name': room_name
            },
            success: function(data) {
                if( data == "Success" ) {
                    alert("Success");
                    document.location = document.location;
                }
                else if( data == "Error" ) {
                    alert(data)
                    $('#loading').hide();
                }
            },
            error: function(data) {
                alert("Error");
                $('#loading').hide();
            }
        });
    }
}

function Remove(room_id) {
    if( confirm("若刪除會連同過去答題記錄一同刪除，確定要刪除?")) {
        $.ajax({
            method: "POST",
            url: "/ajax_game_remove",
            data: {
                'room_id': room_id,
            },
            success: function(data) {
                if( data == "Success" ) {
                    alert("Success");
                    document.location = document.location;
                }
                else if( data == "Start" ) {
                    alert("走讀已開始，無法刪除。")
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
}

function Remove_room(room_id) {
    if( confirm("若刪除會連同過去答題記錄一同刪除，確定要刪除?")) {
        $.ajax({
            method: "POST",
            url: "/ajax_event_room_remove",
            data: {
                'room_id': room_id,
            },
            success: function(data) {
                if( data == "Success" ) {
                    alert("Success");
                    document.location = document.location;
                }
                else if( data == "Start" ) {
                    alert("走讀已開始，無法刪除。")
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
}