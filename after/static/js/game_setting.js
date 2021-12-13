is_edit = false;
numChest = 0;
member_count = 10;
del_chest = [];
del_media = [];
modify_image = {};
$(document).ready(function() {
    $('.chest').not('#chest0').each( function () {
        InitChest($(this));
    }); 

    if( $('#is_playing').text() != "0" && $('#is_playing').text() != "" ) {
        alert("走讀已開始，無法進行設定。")
        window.location = "../../game_room/"+$('#group_id').text();
    }

    $('#manual').change(function () {
        $('#start_time').attr('required',false);
        $('#start_time').attr('readonly',true);
    });

    $('#auto').change(function () {
        $('#start_time').attr('required',true);
        $('#start_time').attr('readonly',false);
    });
    numChest = $('.chest').length - 1;

    if ($('input[type=radio][name=givePrize]:checked').val() == 'yes'){
        $('#addPrize').show();
        $('#increasePrize').show();
        $('#delPrize').show();
    }
    else {
        try{
            document.getElementById('prize_name').removeAttribute("required");
            document.getElementById('input_prize_num').removeAttribute("required");
        }
        catch(exception)
        {
            console.log(`${exception.name}: ${exception.message}`)
        }
        $('#addPrize').hide();
        $('#increasePrize').hide();
        $('#delPrize').hide();
    }
    
    $('input[type=radio][name=givePrize]').change(function () {
        
        if (this.value == 'yes') {
            $('#addPrize').show();
            $('#increasePrize').show();
            $('#delPrize').show();
        }
        else if (this.value == 'no') {
            $('#addPrize').hide();
            $('#increasePrize').hide();
            $('#delPrize').hide();
        }
    });
    $('#game_setting').submit(function(e) {
        $('#loading').show();
        e.preventDefault();
        // var Prize_count1 = $('#prize_count1').val();
        // var Prize_count2 = $('#prize_count2').val();
        // var Prize_count3 = $('#prize_count3').val();
        //alert($('#game_prize_name').val());
        // var award_name = $('#prize1 input:first').val();
        if ($('input[type=radio][name=givePrize]:checked').val() == 'yes'){
            var prizenum_in_game = $('#addPrize div').length;
            var prize_index = '#prize';
            var prize_detail = '';
            for( i = 1; i <= prizenum_in_game; i++){
                var tmp = prize_index.concat(i);
                var award_name = $(tmp).children().eq(1).val();
                console.log(award_name);
                var prize_id = $(tmp).children().eq(3).val();
                console.log(prize_id);
                var prize_num = $(tmp).children().eq(5).val();
                console.log(prize_num);
                prize_detail = prize_detail.concat(award_name + "," + prize_id + "," + prize_num + ",");            
            }
            console.log(prize_detail);
        }
        else{
            prize_detail = "沒有設置獎品"
        }
        
        // var award_name = $('#prize1').children().eq(1).val();
        // console.log(award_name);
        // var prize_id = $('#prize1').children().eq(3).val();
        // console.log(prize_id);
        // var prize_num = $('#prize1').children().eq(5).val();
        // console.log(prize_num);

        var g = {
            'event_id_id': $('#event_id').text(),
            'room_name': $('#room_name').val(),
            'auto_start': null,
            'start_time': null,
            'play_time': $('#play_time').val(),
            'game_prize_detail' : prize_detail
        }
        switch($('input[name="auto_start"]:checked').val()) {
        case "manual":
            g['auto_start'] = false;
            break;
        case "auto":
            g['auto_start'] = true;
            g['start_time'] = $('#start_time').val().replace('T',' ');
            break;
        }

        $.ajax({
            method: "POST",
            url: "/ajax_game_setting",
            data: {
                'room_id': $('#room_id').text(),
                'game': JSON.stringify(g),
                'csrfmiddlewaretoken': $('input[name=csrfmiddlewaretoken]').val()
            },
            success: function(data) {
                if( data == "Success" ) {
                    $('#game_setting').hide();
                    $('#game_chest_setting').show();
                    //alert("Success");
                    // $('.chest').not('#chest0').each( function () {
                    //     InitChest($(this));
                    // });                
                }
                else if( data == "Start" ) {
                    alert("走讀已開始，無法進行設定。")
                    window.location = "../../game_room/"+$('#group_id').text();    
                } 
                else if( data != "Error"){
                    alert(data);
                    //window.location = "../../game_setting/"+$('#group_id').text()+"/"+$('#room_id').text();
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
    });

    $('#game_chest_setting input:submit').click(function() {
        var invalid = $('#game_chest_setting input:invalid,textarea:invalid');
        if(invalid.length > 0) {
            invalid = $(invalid[0]).closest('.chest');
            invalid.find('.panel-body').show();
            invalid.find('.toggle').text("隱藏");
        }
    });
    $('#game_chest_setting').submit(function(e) {
        $('#loading').show();
        e.preventDefault();
        $('#game_setting').submit();
        var chest_list = [];
        var data = new FormData();
        data.append('room_id', $('#room_id').text());
        data.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
        $('.chest:visible').each( function () {
            var c = {
                'room_id_id': $('#room_id').text(),
                'id': null,
                'poi_id_id': null,
                'lat': $(this).find('.chest_lat').val(),
                'lng': $(this).find('.chest_lng').val(),
                'num': null,
                'point': null,
                'distance': null,
                'question_type': $(this).find('.chest_question_type').val(),
                'question': $(this).find('.chest_question').val(),
                'answer': null,
                'option1': null,
                'option2': null,
                'option3': null,
                'option4': null,
                'hint1': null,
                'hint2': null,
                'hint3': null,
                'hint4': null,
                'localId': $(this).attr('id')
            };

            if( $(this).find('.chest_num').val() != "" && c['question_type'] != "4") {
                c['num'] = $(this).find('.chest_num').val();
            }

            if( $(this).find('.chest_point').val() != "" && c['question_type'] != "4") {
                c['point'] = $(this).find('.chest_point').val();
            }

            if( $(this).find('.chest_distance').val() != "" ) {
                c['distance'] = $(this).find('.chest_distance').val();
            }

            if( $('.poi_id').length != 0 && $(this).find('.chest_poi').val() != "" ) {
                c['poi_id_id'] = $('#poi_'+$(this).find('.chest_poi').val()+' .poi_id').val();
            }

            switch(c['question_type']) {
            case "1":
                c['answer'] = $(this).find('.chest_TF :radio:checked').val();    
                break;          
            case "2":
                if($(this).find('.chest_option1').val()!= "")
                    c['option1'] = $(this).find('.chest_option1').val();
                if($(this).find('.chest_option2').val()!= "")
                    c['option2'] = $(this).find('.chest_option2').val();
                if($(this).find('.chest_option3').val()!= "")
                    c['option3'] = $(this).find('.chest_option3').val();
                if($(this).find('.chest_option4').val()!= "")
                    c['option4'] = $(this).find('.chest_option4').val();
                c['answer'] = $(this).find('.chest_option :radio:checked').val();
                break;
            case "4":
                if($(this).find('.chest_level1').val()!= "")
                    c['option1'] = $(this).find('.chest_level1').val();
                if($(this).find('.chest_level2').val()!= "")
                    c['option2'] = $(this).find('.chest_level2').val();
                if($(this).find('.chest_level3').val()!= "")
                    c['option3'] = $(this).find('.chest_level3').val();
                if($(this).find('.chest_level4').val()!= "")
                    c['option4'] = $(this).find('.chest_level4').val();
                if($(this).find('.chest_level1').val()!= "")
                    c['hint1'] = $(this).find('.chest_hint1').val();
                if($(this).find('.chest_hint2').val()!= "")
                    c['hint2'] = $(this).find('.chest_hint2').val();
                if($(this).find('.chest_hint3').val()!= "")
                    c['hint3'] = $(this).find('.chest_hint3').val();
                if($(this).find('.chest_hint4').val()!= "")
                    c['hint4'] = $(this).find('.chest_hint4').val();
                break;
            }

            if( $(this).find('.chest_id').text() != "") {
                c['id'] = $(this).find('.chest_id').text();           
            }

            chest_list.push(c);

            if($(this).find(".expound")[0].files.length != 0) {
                var file = $(this).find(".expound")[0].files[0];
                data.append(c['localId'], new File([file], 'expound' + '.' + file.name.split('.').pop()));
            }
            
            $(this).find(".attachment").each(function(){
                if($(this)[0].files.length != 0) {
                    var file = $(this)[0].files[0];
                    if(modify_image.hasOwnProperty(file.name)) {
                        file = modify_image[file.name];
                    }    
                    data.append(c['localId'], new File([file], file.type.split('/')[0] + '.' + file.name.split('.').pop()));
                }
            });
        });
        data.append('del_chest[]', JSON.stringify(del_chest));
        data.append('del_media[]', JSON.stringify(del_media));
        data.append('chest[]', JSON.stringify(chest_list));

        $.ajax({
            method: "POST",
            url: "/ajax_event_chest_setting",
            data: data,
            contentType:false,
            processData:false,
            success: function(data) {
                if( data == "Success" ) {
                    //alert("Success");
                    window.location = "../../event_room/"+$('#event_id').text();    
                }
                else if( data == "Start" ) {
                    alert("走讀已開始，無法進行設定。")
                    window.location = "../../event_room/"+$('#event_id').text();    
                }
                else if( data == "Error" ) {
                    alert("Error");
                    $('#loading').hide();
                }
            },
            error: function(data) {
                alert("error");
                $('#loading').hide();
            }
        });
    });

    $('#loading').hide();

});

function IncreaseChest(){
    var newChest = $('#chest0').clone();
    newChest.attr('id','chest'+(++numChest))
    newChest.show();
    newChest.find('input[name=chest0_TF]').each( function(index) {
        $(this).attr( 'name' , newChest.attr('id')+'_TF' );
        $(this).attr( 'id' , newChest.attr('id')+'_TF'+(index+1) );
        $(this).next().attr( 'for' , newChest.attr('id')+'_TF'+(index+1) );
    });
    newChest.find('input[name=chest0_option]').each( function(index) {
        $(this).attr( 'name' , newChest.attr('id')+'_option' );
        $(this).attr( 'id' , newChest.attr('id')+'_option'+(index+1) );
        $(this).next().attr( 'for' , newChest.attr('id')+'_option'+(index+1) );
    });    
    InitChest(newChest);
    newChest.appendTo($('#chests'));
}

function InitChest(newChest){
    var func = function() {
        checkAnswerValidate(newChest);
    };
    newChest.find('.title').text('題目 ' + newChest.find('.chest_question').val().substr(0,10) + (newChest.find('.chest_question').val().length>10?'...':''));
    newChest.find('.chest_question').change(function() {
        newChest.find('.title').text('題目 ' + newChest.find('.chest_question').val().substr(0,10) + (newChest.find('.chest_question').val().length>10?'...':''));
    });
    newChest.find('.chest_question').attr('required',true);
    newChest.find('.chest_question_type').change(func);
    newChest.find('.chest_option1').change(func);
    newChest.find('.chest_option2').change(func);
    newChest.find('.chest_option3').change(func);
    newChest.find('.chest_option4').change(func);
    newChest.find('.chest_option :radio').each(function() {
        $(this).click(func);
    });
    newChest.find('.chest_level1').change(func);
    newChest.find('.chest_level2').change(func);
    newChest.find('.chest_level3').change(func);
    newChest.find('.chest_level4').change(func);
    newChest.find('.chest_hint1').change(func);
    newChest.find('.chest_hint2').change(func);
    newChest.find('.chest_hint3').change(func);
    newChest.find('.chest_hint4').change(func);

    func();
    newMap(newChest);
}

function checkAnswerValidate(newChest) {
    switch(newChest.find('.chest_question_type').val()) {
        case "1":
            newChest.find('.chest_num').parent().show();
            newChest.find('.chest_point').parent().show();
            newChest.find('.chest_TF').show();
            newChest.find('.chest_option').hide();
            newChest.find('.chest_level').hide();
            newChest.find('.chest_option1')[0].setCustomValidity('');
            newChest.find('.chest_option2')[0].setCustomValidity('');
            newChest.find('.chest_option3')[0].setCustomValidity('');
            newChest.find('.chest_option4')[0].setCustomValidity('');
            newChest.find('.chest_level1')[0].setCustomValidity('');
            newChest.find('.chest_level2')[0].setCustomValidity('');
            newChest.find('.chest_level3')[0].setCustomValidity('');
            newChest.find('.chest_level4')[0].setCustomValidity('');
            newChest.find('.chest_hint1')[0].setCustomValidity('');
            newChest.find('.chest_hint2')[0].setCustomValidity('');
            newChest.find('.chest_hint3')[0].setCustomValidity('');
            newChest.find('.chest_hint4')[0].setCustomValidity('');
            break;
        case "2":
            newChest.find('.chest_num').parent().show();
            newChest.find('.chest_point').parent().show();
            newChest.find('.chest_TF').hide();
            newChest.find('.chest_option').show();
            newChest.find('.chest_level').hide();
            if(newChest.find('.chest_option1').val() == '' && newChest.find('.chest_option2').val() + newChest.find('.chest_option3').val() + newChest.find('.chest_option4').val() != '') {
                newChest.find('.chest_option1')[0].setCustomValidity('請依序填入選項');
            }
            else if(newChest.find('.chest_option1').val() == '') {
                newChest.find('.chest_option1')[0].setCustomValidity('請至少填入兩項選項');
            }
            else {
                newChest.find('.chest_option1')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_option2').val() == '' && newChest.find('.chest_option3').val() + newChest.find('.chest_option4').val() != '') {
                newChest.find('.chest_option1')[0].setCustomValidity('請依序填入選項');
            }
            else if(newChest.find('.chest_option2').val() == '') {
                newChest.find('.chest_option2')[0].setCustomValidity('請至少填入兩項選項');
            }
            else {
                newChest.find('.chest_option2')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_option3').val() == '' && newChest.find('.chest_option4').val() != '') {
                newChest.find('.chest_option3')[0].setCustomValidity('請依序填入選項');
            }
            else if(newChest.find('.chest_option :radio:checked').val() =='C' && newChest.find('.chest_option3').val() == '') {
                newChest.find('.chest_option3')[0].setCustomValidity('設為答案的選項必須有值');
            }
            else {
                newChest.find('.chest_option3')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_option :radio:checked').val() =='D' && newChest.find('.chest_option4').val() == '') {
                newChest.find('.chest_option4')[0].setCustomValidity('設為答案的選項必須有值');
            }
            else {
                newChest.find('.chest_option4')[0].setCustomValidity('');
            }
            newChest.find('.chest_level1')[0].setCustomValidity('');
            newChest.find('.chest_level2')[0].setCustomValidity('');
            newChest.find('.chest_level3')[0].setCustomValidity('');
            newChest.find('.chest_level4')[0].setCustomValidity('');
            newChest.find('.chest_hint1')[0].setCustomValidity('');
            newChest.find('.chest_hint2')[0].setCustomValidity('');
            newChest.find('.chest_hint3')[0].setCustomValidity('');
            newChest.find('.chest_hint4')[0].setCustomValidity('');
            break;
        case "3":
            newChest.find('.chest_num').parent().show();
            newChest.find('.chest_point').parent().show();
            newChest.find('.chest_TF').hide();
            newChest.find('.chest_option').hide();
            newChest.find('.chest_level').hide();
            newChest.find('.chest_option1')[0].setCustomValidity('');
            newChest.find('.chest_option2')[0].setCustomValidity('');
            newChest.find('.chest_option3')[0].setCustomValidity('');
            newChest.find('.chest_option4')[0].setCustomValidity('');
            newChest.find('.chest_level1')[0].setCustomValidity('');
            newChest.find('.chest_level2')[0].setCustomValidity('');
            newChest.find('.chest_level3')[0].setCustomValidity('');
            newChest.find('.chest_level4')[0].setCustomValidity('');
            newChest.find('.chest_hint1')[0].setCustomValidity('');
            newChest.find('.chest_hint2')[0].setCustomValidity('');
            newChest.find('.chest_hint3')[0].setCustomValidity('');
            newChest.find('.chest_hint4')[0].setCustomValidity('');
            break;
        case "4":
            newChest.find('.chest_num').parent().hide();
            newChest.find('.chest_point').parent().hide();
            newChest.find('.chest_TF').hide();
            newChest.find('.chest_option').hide();
            newChest.find('.chest_level').show();
            newChest.find('.chest_option1')[0].setCustomValidity('');
            newChest.find('.chest_option2')[0].setCustomValidity('');
            newChest.find('.chest_option3')[0].setCustomValidity('');
            newChest.find('.chest_option4')[0].setCustomValidity('');
            if(newChest.find('.chest_level1').val() == '' && newChest.find('.chest_level2').val() + newChest.find('.chest_level3').val() + newChest.find('.chest_level4').val() != '' ) {
                newChest.find('.chest_level1')[0].setCustomValidity('請依序填入選項');
            }
            else if(newChest.find('.chest_level1').val() == '') {
                newChest.find('.chest_level1')[0].setCustomValidity('請至少填入一項選項');
            }
            else {
                newChest.find('.chest_level1')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_level2').val() == '' && newChest.find('.chest_level3').val() + newChest.find('.chest_level4').val() != '' ) {
                newChest.find('.chest_level2')[0].setCustomValidity('請依序填入選項');
            }
            else if(newChest.find('.chest_level2').val() == '' && newChest.find('.chest_hint2').val() != '') {
                newChest.find('.chest_level2')[0].setCustomValidity('指示B有值則選項B需填寫');
            }
            else {
                newChest.find('.chest_level2')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_level3').val() == '' && newChest.find('.chest_level4').val() != '') {
                newChest.find('.chest_level3')[0].setCustomValidity('請依序填入選項');
            }
            else if(newChest.find('.chest_level3').val() == '' && newChest.find('.chest_hint3').val() != '') {
                newChest.find('.chest_level3')[0].setCustomValidity('指示C有值則選項C需填寫');
            }
            else {
                newChest.find('.chest_level3')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_level4').val() == '' && newChest.find('.chest_hint4').val() != '') {
                newChest.find('.chest_level4')[0].setCustomValidity('指示D有值則選項D需填寫');
            }
            else {
                newChest.find('.chest_level4')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_level1').val() != '' && newChest.find('.chest_hint1').val() == '') {
                newChest.find('.chest_hint1')[0].setCustomValidity('選項A有值則指示A需填寫');
            }
            else {
                newChest.find('.chest_hint1')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_level2').val() != '' && newChest.find('.chest_hint2').val() == '') {
                newChest.find('.chest_hint2')[0].setCustomValidity('選項B有值則指示B需填寫');
            }
            else {
                newChest.find('.chest_hint2')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_level3').val() != '' && newChest.find('.chest_hint3').val() == '') {
                newChest.find('.chest_hint3')[0].setCustomValidity('選項C有值則指示C需填寫');
            }
            else {
                newChest.find('.chest_hint3')[0].setCustomValidity('');
            }
            if(newChest.find('.chest_level4').val() != '' && newChest.find('.chest_hint4').val() == '') {
                newChest.find('.chest_hint4')[0].setCustomValidity('選項D有值則指示D需填寫');
            }
            else {
                newChest.find('.chest_hint4')[0].setCustomValidity('');
            }
            break;
        case "5":
            newChest.find('.chest_num').parent().show();
            newChest.find('.chest_point').parent().show();
            newChest.find('.chest_TF').hide();
            newChest.find('.chest_option').hide();
            newChest.find('.chest_level').hide();
            newChest.find('.chest_option1')[0].setCustomValidity('');
            newChest.find('.chest_option2')[0].setCustomValidity('');
            newChest.find('.chest_option3')[0].setCustomValidity('');
            newChest.find('.chest_option4')[0].setCustomValidity('');
            newChest.find('.chest_level1')[0].setCustomValidity('');
            newChest.find('.chest_level2')[0].setCustomValidity('');
            newChest.find('.chest_level3')[0].setCustomValidity('');
            newChest.find('.chest_level4')[0].setCustomValidity('');
            newChest.find('.chest_hint1')[0].setCustomValidity('');
            newChest.find('.chest_hint2')[0].setCustomValidity('');
            newChest.find('.chest_hint3')[0].setCustomValidity('');
            newChest.find('.chest_hint4')[0].setCustomValidity('');
            break;
    }
}

function RemoveChest(chest){
    var del_id = chest.find('.chest_id').text();
    if( del_id != "" ) {
        del_chest.push(del_id);
        chest.find(".spam_expound_review").children("img").click();
        chest.find(".delAtt").each(function(){
            $(this).click();
        });
    }
    chest.remove();
}

function ToggleChest(e) {
    if(e.text()=='隱藏') {
        e.closest('.chest').find('.panel-body').hide();
        e.text("顯示");
    }
    else if(e.text()=='顯示') {
        e.closest('.chest').find('.panel-body').show();
        e.text("隱藏");
    }
}

function CopyChest(chest) {
    if(chest.find('input:invalid,textarea:invalid').length > 0) {
        chest.find('.panel-body').show();
        chest.find('.toggle').text("隱藏");
        $('#game_chest_setting')[0].reportValidity();
        return;
    }
    var modal = $('#Modal');
    if(modal.find('input[name="copyChest"]')[0].length == 0) {
        alert('查無可複製場次，請先新增場次再複製題目。');
        return;
    }
    modal.find('.copy').click(function() {
        $(this).unbind('click');

        var copy_chest = []

        modal.find('input[name="copyChest"]:checked').each(function() {
            copy_chest.push($(this).val());
        });

        if(copy_chest.length == 0) {
            alert("請至少選擇一場場次。");
            return;
        }
        
        modal.modal('hide');
        $('#loading').show();
        var oldMedia = [];
        var data = new FormData();
        data.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
        var c = {
            'id': null,
            'poi_id_id': null,
            'lat': chest.find('.chest_lat').val(),
            'lng': chest.find('.chest_lng').val(),
            'num': null,
            'point': null,
            'distance': null,
            'question_type': chest.find('.chest_question_type').val(),
            'question': chest.find('.chest_question').val(),
            'answer': null,
            'option1': null,
            'option2': null,
            'option3': null,
            'option4': null,
            'hint1': null,
            'hint2': null,
            'hint3': null,
            'hint4': null,
        };
    
        if( chest.find('.chest_num').val() != "" && c['question_type'] != "4") {
            c['num'] = chest.find('.chest_num').val();
        }
    
        if( chest.find('.chest_point').val() != "" && c['question_type'] != "4") {
            c['point'] = chest.find('.chest_point').val();
        }
    
        if( chest.find('.chest_distance').val() != "" ) {
            c['distance'] = chest.find('.chest_distance').val();
        }
    
        if( $('.poi_id').length != 0 && chest.find('.chest_poi').val() != "" ) {
            c['poi_id_id'] = $('#poi_'+chest.find('.chest_poi').val()+' .poi_id').val();
        }
    
        switch(c['question_type']) {
        case "1":
            c['answer'] = chest.find('.chest_TF :radio:checked').val();    
            break;          
        case "2":
            if(chest.find('.chest_option1').val()!= "")
                c['option1'] = chest.find('.chest_option1').val();
            if(chest.find('.chest_option2').val()!= "")
                c['option2'] = chest.find('.chest_option2').val();
            if(chest.find('.chest_option3').val()!= "")
                c['option3'] = chest.find('.chest_option3').val();
            if(chest.find('.chest_option4').val()!= "")
                c['option4'] = chest.find('.chest_option4').val();
            c['answer'] = chest.find('.chest_option :radio:checked').val();
            break;
        case "4":
            if(chest.find('.chest_level1').val()!= "")
                c['option1'] = chest.find('.chest_level1').val();
            if(chest.find('.chest_level2').val()!= "")
                c['option2'] = chest.find('.chest_level2').val();
            if(chest.find('.chest_level3').val()!= "")
                c['option3'] = chest.find('.chest_level3').val();
            if(chest.find('.chest_level4').val()!= "")
                c['option4'] = chest.find('.chest_level4').val();
            if(chest.find('.chest_level1').val()!= "")
                c['hint1'] = chest.find('.chest_hint1').val();
            if(chest.find('.chest_hint2').val()!= "")
                c['hint2'] = chest.find('.chest_hint2').val();
            if(chest.find('.chest_hint3').val()!= "")
                c['hint3'] = chest.find('.chest_hint3').val();
            if(chest.find('.chest_hint4').val()!= "")
                c['hint4'] = chest.find('.chest_hint4').val();
            break;
        }
    
        chest.find('.oldMedia').each(function() {
            oldMedia.push($(this).attr('class').split('_')[1]);
        });
    
        if(chest.find(".expound")[0].files.length != 0) {
            var file = chest.find(".expound")[0].files[0];
            data.append('newMedia[]', new File([file], 'expound' + '.' + file.name.split('.').pop()));
        }
        
        chest.find(".attachment").each(function(){
            if($(this)[0].files.length != 0) {
                var file = $(this)[0].files[0];
                if(modify_image.hasOwnProperty(file.name)) {
                    file = modify_image[file.name];
                }
                data.append('newMedia[]', new File([file], file.type.split('/')[0] + '.' + file.name.split('.').pop()));
            }
        });
        data.append('oldMedia[]', JSON.stringify(oldMedia));
        data.append('copy_chest[]', JSON.stringify(copy_chest));
        data.append('chest', JSON.stringify(c));
    
        $.ajax({
            method: "POST",
            url: "/ajax_event_chest_copy",
            data: data,
            contentType:false,
            processData:false,
            success: function(data) {
                if( data == "Success" ) {
                    alert("Success");
                }
                else if( data == "Start" ) {
                    alert("選擇場次中有已開始走讀的場次，無法複製。")
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
    
    });
    modal.modal('show');

}

function newMap(chest) {
    var mapCanvas = chest.find('.map_poi')[0];
    var poi_name = null;
    var defaultLatLng = new google.maps.LatLng(22.9977819, 120.2205494);
    var poiLatLng = null;
    var chestLatLng = null;
    var poiMarker = null;
    var chestMarker = null;

    if($('.poi_id').length == 0) {
        chest.find('.chest_poi_random').hide();
    } else if(chest.find('.chest_poi').val() != "") {
        poi_name = chest.find('.chest_poi').val();
        poiLatLng = new google.maps.LatLng(parseFloat($('#poi_'+poi_name+' .poi_lat').val()), parseFloat($('#poi_'+poi_name+' .poi_lng').val()));
        chest.find('.poi_distance').prop('disabled', false);
        chest.find('.random_position').prop('disabled', false);
    } else {
        chest.find('.poi_distance').prop('disabled', true);      
        chest.find('.random_position').prop('disabled', true);
    }

    if( chest.find('.chest_lat').val() == "" || chest.find('.chest_lng').val() == "") {
        chest.find('.chest_lat').val(poiLatLng==null?defaultLatLng.lat():poiLatLng.lat());
        chest.find('.chest_lng').val(poiLatLng==null?defaultLatLng.lng():poiLatLng.lng());    
    }
    chestLatLng = new google.maps.LatLng(parseFloat(chest.find('.chest_lat').val()), parseFloat(chest.find('.chest_lng').val()));
    
    var mapOptions = {
        center: poiLatLng==null?chestLatLng:poiLatLng,
        zoom: 15
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);

    poiMarker = new google.maps.Marker({
        position: poiLatLng,
        label: {
            text: "POI"
        },
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        map: poiLatLng==null?null:map
    });

    chestMarker = new google.maps.Marker({
        position: chestLatLng,
        label: {
            text: "chest"
        },
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        map: chestLatLng==null?null:map
    });


    chest.find('.chest_poi').change(function () {
        if(chest.find('.chest_poi').val() != "") {
            poi_name = chest.find('.chest_poi').val();
            poiLatLng = new google.maps.LatLng(parseFloat($('#poi_'+poi_name+' .poi_lat').val()), parseFloat($('#poi_'+poi_name+' .poi_lng').val()));
            poiMarker.setPosition(poiLatLng);
            poiMarker.setMap(map);
            chestLatLng = poiLatLng;
            chestMarker.setPosition(chestLatLng);
            map.setCenter(poiLatLng);
            chest.find('.chest_lat').val(poiLatLng.lat());
            chest.find('.chest_lng').val(poiLatLng.lng());    
            chest.find('.poi_distance').prop('disabled', false);
            chest.find('.random_position').prop('disabled', false);
        } else {
            poi_name = null;
            poiLatLng = null;
            poiMarker.setMap(null);
            chest.find('.poi_distance').prop('disabled', true);      
            chest.find('.random_position').prop('disabled', true);
        }
    
    });

    chest.find('.random_position').click(function () {

        var lat = 0;
        var lng = 0;
        var startlat=poiLatLng.lat();
        var startlng=poiLatLng.lng();
    
        with (Math) {

            function normalizeLongitude(lon) {
                var n = PI;
                if (lon > n) {
                    lon = lon - 2 * n
                } else if (lon < -n) {
                    lon = lon + 2 * n
                }
                return lon;
            }        
    
    
            if (startlat == 90) {
                startlat = 89.99999999;
            }
            if (startlat == -90) {
                startlat = -89.99999999;
            }
    
            startlat = startlat * PI / 180;
            startlng = startlng * PI / 180;
    
            var radiusEarth = 6372.796924;
            var maxdist = parseInt(chest.find('.poi_distance').val()) / 1000.0 / radiusEarth;
            var cosdif = cos(maxdist) - 1;
            var sinstartlat = sin(startlat);
            var cosstartlat = cos(startlat);
            var dist = acos(random() * cosdif + 1);;
            var rad = 2 * PI * random();
        
            lat = asin(sinstartlat * cos(dist) + cosstartlat * sin(dist) * cos(rad));
            lng = normalizeLongitude(startlng * 1 + atan2(sin(rad) * sin(dist) * cosstartlat, cos(dist) - sinstartlat * sin(lat))) * 180 / PI;
            lat = lat * 180 / PI;
            dist = round(dist * radiusEarth * 10000) / 10000;
            rad = round(rad * 180 / PI * 1000) / 1000;
        }

        chestLatLng = new google.maps.LatLng(lat, lng);
        chestMarker.setPosition(chestLatLng);
        chest.find('.chest_lat').val(lat);
        chest.find('.chest_lng').val(lng);
    });
    
    google.maps.event.addListener(map, "click", function(event) {
        chestLatLng = event.latLng;
        chestMarker.setPosition(chestLatLng);
        chest.find('.chest_lat').val(chestLatLng.lat());
        chest.find('.chest_lng').val(chestLatLng.lng());

    });
    
}

function review_expound(where){
    $(where).hide();
    $(where).parent().children('.spam_expound_review').show();

    reader = new FileReader();
    file = $(where)[0].files[0];
    reader.onload = function(event){
        $($(where).parent().find('.expound_review')).attr("src", event.target.result);
    }
    reader.readAsDataURL(file);
}

function deleteExpound(e){
    $(e).parent().hide();
    $(e).parent().parent().children(".expound").val("");
    $(e).parent().parent().children(".expound").show();
}

function deleteOldExpound(e, num){
    $(e).parent().hide();
    $(e).parent().parent().children(".expound").attr('class', 'expound');
    $(e).parent().parent().children(".expound").val("");
    $(e).parent().parent().children(".expound").show();
    if(!del_media.includes(num))
        del_media.push(num);
}

function review_media(where, input, num){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        $(where).children("#attachment_review").append("<span id='att_span_"+num+"' class='att_span' style='margin: 4px; position: relative'></span>");
        reader.onload = function (e) {
            switch(e.target.result.split(',')[0].split(':')[1].split('/')[0]){
                case "image":
                    $('#loading').show();
                    var image = new Image();
                    var ratio = 1 / Math.pow(e.total / 1048576, 0.5);
                    if(ratio > 1) {
                        ratio = 1;
                    }
                    var canvas = document.createElement("canvas");
                    image.onload = function() {
                        var ctx = canvas.getContext("2d");
                        EXIF.getData(image, function() {
                            var orientation = EXIF.getTag(image, 'Orientation');
                            switch (orientation) {
                                case 6:
                                    canvas.width = image.height;
                                    canvas.height = image.width;
                                    ctx.rotate(90 * Math.PI / 180);
                                    ctx.translate(0, -canvas.width)
                                    break;
                                default:
                                    canvas.width = image.width;
                                    canvas.height = image.height;
                            }
                            ctx.drawImage(image, 0, 0);
                            canvas.toBlob(function(blob){
                                modify_image[input.files[0].name] = new File([blob], input.files[0].name, {type:input.files[0].type});
                                
                                $(where).find("#att_span_"+num).append("<img id='attachment_"+num+"' src='"+canvas.toDataURL()+"' onclick='preview_img(\""+canvas.toDataURL()+"\")'\
                                                                    style='display:inline; height: 70px; width: 70px; border: 1px solid black; border-radius: 5px;'>");
                                $(where).find("#att_span_"+num).append("<img class='delAtt' src='/static/images/delete.png' onclick='deleteMedia($(this), "+num+")' \
                                                                style='position: absolute; right: -15px; top: -45px; height: 30px; width: 30px;'>");
                                $('#loading').hide();
                            }, "image/jpeg", ratio);
                            
                        });
                    };
                    image.src = e.target.result;
                    break;
                case "video":
                    $(where).find("#att_span_"+num).append("<img id='attachment_"+num+"' src='/static/images/video.png' onclick='preview_video(\""+e.target.result+"\")'\
                                                            style='display:inline; height: 70px; width: 70px; border: 1px solid black; border-radius: 5px; padding: 15px; background-color: gray;'>");
                    $(where).find("#att_span_"+num).append("<img class='delAtt' src='/static/images/delete.png' onclick='deleteMedia($(this), "+num+")' \
                                                            style='position: absolute; right: -15px; top: -45px; height: 30px; width: 30px;'>");

                    break;
                case "audio":
                    $(where).find("#att_span_"+num).append("<img id='attachment_"+num+"' src='/static/images/sound.png' onclick='preview_audio(\""+e.target.result+"\")'\
                                                            style='display:inline; height: 70px; width: 70px; border: 1px solid black; border-radius: 5px; padding: 15px; background-color: gray;'>");
                    $(where).find("#att_span_"+num).append("<img class='delAtt' src='/static/images/delete.png' onclick='deleteMedia($(this), "+num+")' \
                                                            style='position: absolute; right: -15px; top: -45px; height: 30px; width: 30px;'>");
                    break;
                }
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function upload_media(where, id){
    div = $(where).parent();
    $(div).children("#FormAttachment").children("#attachment_"+id).click().change(function(){
        var num = $(div).find("#attachmentNum").text();
        review_media($(div), this, num);
        num++;
        $(div).children("#FormAttachment").append("<input type='file' class='attachment' id='attachment_"+num+"' accept='audio/*,image/*,video/*' style='display: none;'>");
        $(div).children("#add_attachment").attr("onclick", "upload_media($(this), "+ num +")");
        $(div).children("#attachmentNum").text(num);
    });
}

function deleteMedia(e, num){
    $(e).parent().parent().parent().children("#FormAttachment").children("#attachment_"+num).remove();
    $(e).parent().remove();
}

function deleteOldMedia(e, num){
    $(e).parent().remove();
    del_media.push(num);
}

function preview_img(src){
    $(".shady").children("img").attr("src", src);
    $(".shady").children("img").css("display", "block");
    $(".shady").css("display", "block");
}

function preview_audio(src){
    $(".shady").children("audio").attr("src", src);
    $(".shady").children("audio").css("display", "block");
    $(".shady").css("display", "block");
}

function preview_video(src){
    $(".shady").children("video").attr("src", src);
    $(".shady").children("video").css("display", "block");
    $(".shady").css("display", "block");
}

function hidden_preview(){
    $(".shady").children("audio")[0].pause();
    $(".shady").children("video")[0].pause();
    $(".shady").css("display", "none");
    $(".shady").children("img").css("display", "none");
    $(".shady").children("audio").css("display", "none");
    $(".shady").children("video").css("display", "none");
}

function InitPrize(newPrize){
    newPrize.find(':input').each(function(){
        $(this).val("")
    });
    
    if (newPrize.find('#game_prize_name option:first').text() != "無"){
        newPrize.find('#game_prize_name option:first').remove();
    }
}
function IncreasePrize(){
    var newPrize = $('#prize1').clone();
    var prizenum = $('#addPrize div').length; //取得現在的獎品數量

    newPrize.attr('id','prize'+(++prizenum))
    newPrize.show();

    InitPrize(newPrize);
    
    newPrize.appendTo($('#addPrize'));
}
function DelPrize(){
    var prizenum = $('#addPrize div').length; //取得現在的獎品數量
    if(prizenum > 1) $('#prize' + (prizenum)).remove();
    else alert('已剩最後一個獎品選項，若不想新增獎品請將選項改為\'否\'!')
    //alert(prizenum);
}
