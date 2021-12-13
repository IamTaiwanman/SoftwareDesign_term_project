let webMap, mobileMap;
let map = {
    web: webMap,
    mobile: mobileMap
};
let markers = {
    web: [],
    mobile: [],
    point: [],
    groupLoi: []
};

$(document).ready(function () {
    $('#group_all').css("background-color", "rgb(83, 170, 245)");
    $('#web_search').bind('click', () => hisSearch('web'));
    $('#mobile_search').bind('click', () => hisSearch('mobile'));
    initTime();
    GetData();
})

function Kickout(group_id, member_id) { //group_id 可拿掉
    var urls = '../ajax_invite';
    data = {
        action: 'kickout',
        group_id: group_id,
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
                    alert('已將用戶移出群組');
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

function remove_point(types, type_id) {
    var urls = '../ajax_invite';
    data = {
        action: 'remove_interest',
        types: types,
        type_id: type_id,
        group_id: group_id
    }
    if (group_id != '' && type_id != '' && types != '') {
        $('#loading').show();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function (data) {
                var languages = $('#language').val();
                if (languages == "chinese") {
                    alert('此' + types + '已移出群組');
                }
                else if (languages == "english") {
                    alert(types + 'is removed');
                }
                else if (languages == "japanese") {
                    alert('この' + types + '削除されたグループ');
                }
                $('#' + types + '_list' + type_id).fadeOut();
                $('#loading').hide();
            },
            error: function (data) {
                $('#loading').hide();
            }
        });
    } else {
        alert('發生錯誤!!');
    }
}

function edit_poi(poi_id, group_id) {
    poi = '/' + poi_id + '/poi/';
    window.location = COI_URL + 'edit_player' + poi + group_id;
}

function edit_loi(loi_id, group_id) {
    loi = '/' + loi_id + '/loi/';
    window.location = COI_URL + 'edit_player' + loi + group_id;
}

function edit_aoi(aoi_id, group_id) {
    aoi = '/' + aoi_id + '/aoi/';
    window.location = COI_URL + 'edit_player' + aoi + group_id;
}

function edit_soi(soi_id, group_id) {
    soi = '/' + soi_id + '/soi/';
    window.location = COI_URL + 'edit_player' + soi + group_id;
}


function modify_group() {
    var urls = '../ajax_groups';
    var group_name = $('#edit_title').val();
    var opens = $("#group-open").val();
    var group_info = $('#group_info').val();
    var manage_start_time = $('#manage_start_time').val().replace('T',' ');
    var manage_end_time = $('#manage_end_time').val().replace('T',' ');
    
    var minus = Date.parse(manage_end_time) - Date.parse(manage_start_time);
    var manage_time = $('#manage_time').val();
    if(minus <= 0){
        alert("開始時間必須設定於結束時間之前!!");
        return;
    }


    var manage;
    data = {
        group_id: group_id,
        group_make: 'edit_group',
        group_name: group_name,
        group_info: group_info,
        open: opens, //Check open value in cloud server
        manage_start_time: manage_start_time, // 群組開放時間
        manage_end_time: manage_end_time,     // 群組關閉時間
        manage_time: manage_time,             // 是否設定固定時間群組開放或關閉
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            if (data == 'success') {
                $('#group_info').delay(1000).fadeOut('slow');
                $('#group_modal').modal('hide');
                location.reload();
            }else if(data == "repeat"){
                alert("repeat group name");
                $('#group_info').delay(1000).fadeOut('slow');
                $('#group_modal').modal('hide');
            }else{
                alert("repeat group name!!!!");
                alert(data)
                $('#group_info').delay(1000).fadeOut('slow');
                $('#group_modal').modal('hide');
            }
        },
        error: function (data) {
            alert("error!");
            console.log(data);
        }
    });
}

function initTime() {
    let now = new Date();

    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let today = now.getFullYear() + "-" + month + "-" + day;

    let hour = ("0" + now.getHours()).slice(-2);
    let minute = ("0" + now.getMinutes()).slice(-2);
    let time = hour + ":" + minute;

    $('#wend_date').val(today);
    $('#wend_time').val(time);
    $('#mend_date').val(today);
    $('#mend_time').val(time);


    now.setDate(now.getDate() - 1);
    day = ("0" + now.getDate()).slice(-2);
    month = ("0" + (now.getMonth() + 1)).slice(-2);
    today = now.getFullYear() + "-" + month + "-" + day;

    $('#wstart_date').val(today);
    $('#wstart_time').val(time);
    $('#mstart_date').val(today);
    $('#mstart_time').val(time);

    initMap();
}

function initMap() {
    let webMapCanvas = document.getElementById('web-history-map');
    let mobileMapCanvas = document.getElementById('mobile-history-map');
    let myLatLng = new google.maps.LatLng(23.5, 121.120850)
    let mapOptions = {
        center: myLatLng,
        zoom: 8
    }
    map['web'] = new google.maps.Map(webMapCanvas, mapOptions);
    map['mobile'] = new google.maps.Map(mobileMapCanvas, mapOptions);
}

function hisSearch(type) {
    let contentType = $('#' + type + '_contents').val();
    let startTime = $('#' + type[0] + 'start_date').val() + 'T' + $('#' + type[0] + 'start_time').val();
    let endTime = $('#' + type[0] + 'end_date').val() + 'T' + $('#' + type[0] + 'end_time').val();
    let userName = $('#search_user').val();

    if (startTime.includes('/')) {
        startTime.replace('/', '-');
        endTime.replace('/', '-');
    }

    let data = {
        log_type: type,
        content_type: contentType,
        coi: COI_NAME,
        start_time: startTime,
        end_time: endTime,
        user_name: userName,
    }

    let url = '/ajax_newhistorynew';

    if (startTime.length > 15 && endTime.length > 15 && userName != '') {
        $('#' + type + '_search').prop('disabled', true);
        $.ajax({
            method: 'POST',
            data: data,
            url: url,

            success: data => {
                $('#' + type + '_search').prop('disabled', false);
                if (data.length > 0) {
                    dataAppend(data, type, contentType);
                } else {
                    $('#' + type + '_table').html('<tr><td colspan="2" style="text-align: center">No data</td></tr>');
                }
            },

            error: data => {
                console.log(data);
                $('#' + type + '_search').prop('disabled', false);
            },
        });
    }
}

function dataAppend(data, platform, type) {
    let table = $('#' + platform + '_table');
    let latlngArray = [];
    let pointArray = [];
    let webCount = 0;
    let mobileCount = 0;

    deleteAllMarker(platform);
    deleteAllMarker('groupLoi');
    table.children().remove();

    for (let i = 0; i < data.length; ++i) {
        let date = new Date(data[i].dt);

        let day = ("0" + date.getDate()).slice(-2);
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let hour = ("0" + date.getHours()).slice(-2);
        let minute = ("0" + date.getMinutes()).slice(-2);

        let appendStr = '';

        if (platform == 'web') {
            latlngArray.push([parseFloat(data[i].page.lati), parseFloat(data[i].page.long), data[i].page.title, data[i].page.type]);
            appendStr = '<tr onclick="setMapCenter(' + webCount + ', `web`)" ><td>' +
                month + '/' + day + ' ' + hour + ':' + minute + '</td><td>' +
                '<a href="' + COI_URL + type + '_detail/' + data[i].page.id + '">' + data[i].page.title + '<a></td></tr>';
            webCount += 1;
        } else {

            if (data[i].page.type != 'search') {
                appendStr = '<tr dataType="'+ data[i].page.type + '" dataId="' + data[i].page.id +
                    '" onclick="setMapCenter(' + mobileCount + ', `mobile`)" ><td>' +
                    month + '/' + day + ' ' + hour + ':' + minute + '</td><td>';
                pointArray.push([parseFloat(data[i].page.lati), parseFloat(data[i].page.long), data[i].page.title, data[i].page.type]);

                let typeStr;
                if (data[i].page.type == 'poi') {
                    typeStr = '(景點)';
                } else if (data[i].page.type == 'loi') {
                    typeStr = '(景線)';
                } else if (data[i].page.type == 'aoi') {
                    typeStr = '(景區)';
                } else if (data[i].page.type == 'soi') {
                    typeStr = '(故事)';
                }

                appendStr += '<a href="' + COI_URL + data[i].page.type + '_detail/' + data[i].page.id + '">' + data[i].page.title + typeStr + '<a></td></tr>';
            } else {
                appendStr = '<tr dataType="search" dataId="-1" onclick="setMapCenter(' + mobileCount + ', `mobile`)" ><td>' +
                    month + '/' + day + ' ' + hour + ':' + minute + '</td><td>';
                if (data[i].page.title == 'nearbyPOI') {
                    data[i].page.title = '搜尋附近景點';
                } else if (data[i].page.title == 'nearbyLOI') {
                    data[i].page.title = '搜尋附近景線';
                } else if (data[i].page.title == 'nearbyAOI') {
                    data[i].page.title = '搜尋附近景區';
                } else if (data[i].page.title == 'nearbySOI') {
                    data[i].page.title = '搜尋附近故事';
                } else if (data[i].page.title == 'UserLogin') {
                    data[i].page.title = '帳號登入';
                } else if (data[i].page.title == 'userPOI') {
                    data[i].page.title = '查看使用者景點';
                } else if (data[i].page.title == 'userLOI') {
                    data[i].page.title = '查看使用者景線';
                } else if (data[i].page.title == 'userAOI') {
                    data[i].page.title = '查看使用者景區';
                } else if (data[i].page.title == 'userSOI') {
                    data[i].page.title = '查看使用者故事';
                } else {
                    data[i].page.title = data[i].page.title;
                }

                appendStr += data[i].page.title + '</td></tr>';
            }
            mobileCount += 1;
            latlngArray.push([parseFloat(data[i].ulatitude), parseFloat(data[i].ulongitude), data[i].page.title, 'search']);
        }
        table.append(appendStr);
    }
    setMapMarker(latlngArray, platform);
    // setMapMarker(pointArray, 'point');
}

// function changePointMarker(index, obj) {
//     if (obj.value === undefined) {
//         obj.value = 1;
//     }
//     if (obj.value == 1) {
//         addMapMarker(markers['point'][index], map['mobile'])
//     } else {
//         addMapMarker(markers['point'][index], null)
//     }
//     obj.value = -1 * obj.value;
// }

function setMapCenter(index, mapType) {
    map[mapType].setCenter(markers[mapType][index].position);
    google.maps.event.trigger(markers[mapType][index], 'click');
    if (map[mapType].getZoom() < 12) {
        map[mapType].setZoom(12);
    }
}

function setMapMarker(latlng, platform) {
    let content_color;
    for (let i = 0; i < latlng.length; ++i) {
        switch (latlng[i][3]) {
            case 'poi':
                content_color = 'FE6256';
                break;
            case 'loi':
                content_color = '58ABFE';
                break;
            case 'aoi':
                content_color = '1AFD9C';
                break;
            case 'soi':
                content_color = '8080ff';
                break;
            case 'search':
                content_color = 'ffff33';
                break;
            case 'groupLoi':
                content_color = 'ffefd5';
                break;
            default:
                content_color = '10060f';
                break;
        }

        let icon;
        if (latlng[i][3] == 'groupLoi') {
            icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + (i + 1) + '|' + content_color + '|000000';
        } else {
            icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + content_color + '|000000';
        }

        let tempPlatform;
        if (platform == 'groupLoi') {
            tempPlatform = 'mobile';
        } else {
            tempPlatform = platform;
        }


        let marker = new google.maps.Marker({
            position: { lat: latlng[i][0], lng: latlng[i][1] },
            map: map[tempPlatform],
            icon: icon
        });

        let infowindow = new google.maps.InfoWindow({
            content: latlng[i][2]
        });

        marker.addListener('click', () => {
            infowindow.open(marker.get('map'), marker);
        });

        markers[platform].push(marker);
    }
}

function addMapMarker(marker, markerMap) {
    marker.setMap(markerMap);
}


function clearAllMarker(key) {
    for (let i = 0; i < markers[key].length; ++i) {
        addMapMarker(markers[key][i], null);
    }
}

function deleteAllMarker(key) {
    clearAllMarker(key);
    markers[key] = [];
}

function historyGroupLoi(id, type) {
    let url = '/ajax_loiaoipoint';
    let data = {
        id: id,
        type: type
    };

    deleteAllMarker('groupLoi');
    $.ajax({
        method: 'POST',
        data: data,
        url: url,

        success: data => {
            groupLoiSet(data[1]);
            setMapMarker(data[0], 'groupLoi');
        },

        error: data => console.log(data),
    });
}

function groupLoiSet(data) {
    let mobileTr = $('#mobile_table > tr');
    for (let i = 0; i < mobileTr.length; ++i) {
        let mobileType = mobileTr[i].attributes.datatype.value;
        let mobileId = parseInt(mobileTr[i].attributes.dataid.value);

        if (mobileType == 'poi' && data.includes(mobileId)) {
            mobileTr[i].bgColor = 'papayawhip';
        } else {
            mobileTr[i].bgColor = '';
        }
    }
}

function GetData() {
    let url = '/ajax_allloiaoi';
    let data = {
        key_word: '',
        coi: COI_NAME
    };

    $.ajax({
        method: 'POST',
        data: data,
        url: url,

        success: function(data){
            console.log(data);
            inputData(data);      
        },

        error: data => console.log(data),
    });
}

$('#group_mine').click(function () {
    $('.not_mine').hide();
    $('#group_mine').css("background-color", "rgb(83, 170, 245)");
    $('#group_all').css("background-color", "");
});

$('#group_all').click(function () {
    $('.not_mine').show();
    $('#group_mine').css("background-color", "");
    $('#group_all').css("background-color", "rgb(83, 170, 245)");
});

$('#history-modal').on('show.bs.modal', event => { //assign value to modal
    let username = $(event.relatedTarget).data('username');
    if (username != $('#search_user').val()) {
        $('#search_user').val(username);
        $('#mobile_table').children().remove();
        $('#web_table').children().remove();
    }
});

$('#loi_btn').click(function(){
    $("#aois").hide();
    $("#lois").show();
});

$('#aoi_btn').click(function(){
    $("#lois").hide();
    $("#aois").show();
});

function filterSearch() {
    let key = $("#historyGroupLoi_modal #srch_term").val();
    let url = '/ajax_allloiaoi';
    let data = {
        key_word: key,
        coi: COI_NAME
    };

    $.ajax({
        method: 'POST',
        data: data,
        url: url,

        success: function(data){
            console.log(data);
            inputData(data); 
        },

        error: data => console.log(data),
    });
}

function inputData(data) {
    $("#lois .list-group-item").detach();
    $("#aois .list-group-item").detach();

    for (let i = 0; i < data.loi.length; ++i) {
        let append = $('#lois').append($('<a></a>', {
            "class": "list-group-item",
            'text': data.loi[i][1],
            'onclick': 'historyGroupLoi(' + data.loi[i][0] + ', "loi")',
            'data-dismiss': "modal"
        }));
    }

    for (let i = 0; i < data.aoi.length; ++i) {
        let append = $('#aois').append($('<a></a>', {
            "class": "list-group-item",
            'text': data.aoi[i][1],
            'onclick': 'historyGroupLoi(' + data.aoi[i][0] + ', "aoi")',
            'data-dismiss': "modal"
        }));
    }
}