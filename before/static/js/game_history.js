is_edit = false;
sort = null;

function Export( url, filename ) {
    $('#loading').show();
    $.ajax({
        method: "GET",
        url: url,
        success: function(data) {
            if( data == "Error" ) {
                alert("Error");
            }
            else {
                $($.parseHTML(data)).table2csv( 'download', {
                    filename: filename
                });
            }
            $('#loading').hide();
        },
        error: function(data) {
            alert("Error");
            $('#loading').hide();
        }
    });
}

$(document).ready(function() {
    if($('.map').length != 0) {
        $('#loading').hide();
        $('input[name="sort"]').each(function () {
            $(this).change(function () {
                sort = $(this).prop('id');
                if(navigator.cookieEnabled) {
                    localStorage.setItem('sort', sort);
                }
                sortRecord();
            });
        });
        if(!navigator.cookieEnabled) {
            sort = 'sort_chest';
        } else if (localStorage.getItem('sort') == null) {
            sort = 'sort_chest';
            localStorage.setItem('sort', sort);
        } else {
            sort = localStorage.getItem('sort');
        }
        $('#' + sort).prop('checked', true);
        sortRecord();
        initMap();
    }
});

function initMap() {
    var defaultLatLng = new google.maps.LatLng(22.9977819, 120.2205494);
    var recordLatLng = null;
    var chestLatLng = null;
    var poiLatLng = null;
    
    if( $('#record_lat').length != 0 ) {
        recordLatLng = new google.maps.LatLng(parseFloat($('#record_lat').val()), parseFloat($('#record_lng').val()));
    }
    if( $('#chest_lat').length != 0 ) {
        chestLatLng = new google.maps.LatLng(parseFloat($('#chest_lat').val()), parseFloat($('#chest_lng').val()));
    }
    if( $('#poi_lat').length != 0 ) {
        poiLatLng = new google.maps.LatLng(parseFloat($('#poi_lat').val()), parseFloat($('#poi_lng').val()));
    }
    
    var mapOptions = {
        center: recordLatLng==null?defaultLatLng:recordLatLng,
        zoom: 15
    }
    var map = new google.maps.Map($('.map')[0], mapOptions);

    if(recordLatLng != null) {
        new google.maps.Marker({
            position: recordLatLng,
            label: {
                text: "record"
            },
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            map: map
        });
    }


    if(chestLatLng != null) {
        new google.maps.Marker({
            position: chestLatLng,
            label: {
                text: "chest"
            },
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            map: map
        });
    }
    
    if(poiLatLng != null) {
        new google.maps.Marker({
            position: poiLatLng,
            label: {
                text: "POI"
            },
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            map: map
        });
    }

}

function submit(game_id, record_id, max_point) {
    if(record_id == null) {
        if($('.grading').length != 0) {
            alert("有尚未評分的作答紀錄。請先全部批改完成再送出成績。")
            return;
        }
        else if(!confirm("成績一經送出就無法更改。是否送出?")) {
            return;
        }
        else {
            $('#loading').show();
            $.ajax({
                method: "POST",
                url: "/ajax_game_correction",
                data: {
                    game_id: game_id
                },
                success: function(data) {
                    if( data == "Success" ) {
                        alert("Success");
                        $('#loading').hide();
                        $('#back').click();
                    }
                    else if( data == "Error" ) {
                        alert("Error");
                        $('#loading').hide();
                    }
                },
                error: function(data) {
                    alert("Error");
                    $('#loading').hide();
                    return;
                }
            });    
        }
    }
    else {
        var ask = "請給分?請輸入一個整數(最低0分；" + (max_point==null?"最高不限)":("最高" + max_point + "分)"));
        while(true) {
            var ans = prompt(ask);
            if(ans == null) {
                return;
            }
            else if(!/^(|[0-9]+)$/.test(ans)) {
                alert("輸入錯誤分數");
            }
            else {
                ans = parseInt(ans);
                if(max_point != null && ans > max_point) {
                    alert("輸入錯誤分數");
                }
                else {
                    $('#loading').show();
                    $.ajax({
                        method: "POST",
                        url: "/ajax_game_correction",
                        data: {
                            game_id: game_id,
                            record_id: record_id,
                            point: ans
                        },
                        success: function(data) {
                            if( data == "Success" ) {
                                alert("Success");
                                $('#loading').hide();
                                window.location = window.location;
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
                    break;           
                }
            }
        }
    }
}

function sortRecord() {
    var sorted_game_record = game_record.sort(function (a, b) {
        switch(sort) {
        case "sort_chest":
            return a.chest_id > b.chest_id ? 1 : a.chest_id == b.chest_id && a.user_name > b.user_name ? 1 : -1;
        case "sort_user":
            return a.user_name > b.user_name ? 1 : a.user_name == b.user_name && a.chest_id > b.chest_id ? 1 : -1;
        default:
            return a.chest_id > b.chest_id ? 1 : a.chest_id == b.chest_id && a.user_name > b.user_name ? 1 : -1;
        }
    });
    var grading = $('#grading .list-group');
    var graded = $('#graded .list-group');
    grading.html("");
    graded.html("");
    sorted_game_record.forEach(function(r) {
        if(r.point == null) {
            grading.append('<a href="' + r.id + '" class="list-group-item list-group-item-action ' + (r.active ? "active" : "") + ' grading">'
                + r.user_name + '&nbsp;&nbsp;' + r.answer_time_string + '&nbsp;&nbsp;' + r.chest_question
            );
        } else {
            graded.append('<a href="' + r.id + '" class="list-group-item list-group-item-action ' + (r.active ? "active" : "") + ' graded">'
                + r.user_name + '&nbsp;&nbsp;' + r.answer_time_string + '&nbsp;&nbsp;' + r.chest_question
                + '<span class="badge badge-primary badge-pill">' + r.point + '分</span></a>'
            );
        }
    });
}

function prize_distribution(game_id){
    $.ajax({
                method: "POST",
                url: "/prize_distribution/" + game_id,
                data: {
                    game_id: game_id
                },
                success: function(data) {
                    if( data == "Success" ) {
                        alert("prize_distribution success");
                        $('#loading').hide();
                        $('#back').click();
                    }
                    else if( data == "Error" ) {
                        alert("Error");
                        $('#loading').hide();
                    }
                },
                error: function(data) {
                    alert("Error");
                    $('#loading').hide();
                    return;
                }
            });    
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