let webMap, mobileMap;
let map = {
    web: webMap,
    mobile: mobileMap
};
let markers = {
    web: [],
    mobile: [],
    point: [],
};

$(document).ready(function () {
    $('#web_search').bind('click', () => hisSearch('web'));
    $('#mobile_search').bind('click', () => hisSearch('mobile'));
    initTime();
})

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
    deleteAllMarker('point');
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
            appendStr = '<tr onclick="setMapCenter(' + mobileCount + ', `mobile`)" ><td>' +
                month + '/' + day + ' ' + hour + ':' + minute + '</td><td>';

            if (data[i].page.type != 'search') {
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
    setMapMarker(pointArray, 'point');
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

    if (mapType == 'mobile') {
        clearAllMarker('point');
        addMapMarker(markers['point'][index], map[mapType]);
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
            default:
                content_color = '10060f';
                break;
        }

        let marker = new google.maps.Marker({
            position: { lat: latlng[i][0], lng: latlng[i][1] },
            map: map[platform],
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + content_color + '|000000'
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