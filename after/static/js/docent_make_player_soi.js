soi_num = 0;
username = $('#soi_owner').val();
role = $('#identifier').val();

var area_list = []; //keep tracking of area user has choosen
var is_edit = false;
var map_markers = [];
var map2;
var icon_url = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=';
var icon_type = {'poi':'|FE6256|000000','loi':'|58ABFE|000000','aoi':'|1AFD9C|000000'};

$(window).on('beforeunload', function() {
    localStorage.setItem('soi_title', $('#soi_title').val());
    localStorage.setItem('soi_description', $('#soi_description').val());
});

window.onload = function() {
    var title = localStorage.getItem('soi_title');
    if (title != null) $('#soi_title').val(title);
    var description = localStorage.getItem('soi_description');
    if (description != null) $('#soi_description').val(description);
}

$(document).ready(function() {
    $('#make_soiform').submit(function(e) {
        $('#loading').show();
        e.preventDefault();
        soi_form(e);
    });

    $('#filter_btn').click(event => { filterBtn(event) });
});

function Choosen_soi(type, i) {
    var can_choose = true;
    if (soi_num > 20) {
        alert('選太多景點囉!');
        event.preventDefault();
        can_choose = false;
    } else {
        // if($('#list' + type + i).length){
        //   if (type == 'poi') {
        //       alert('重複景點囉!');
        //   } else if (type == 'loi') {
        //       alert('重複景線囉!');
        //   } else {
        //       alert('重複景區囉!');
        //   }
        //   can_choose = false;
        //   event.preventDefault();
        // }
        $('#choosen_id'+ type + i).each(function(event) {
            var ids = $('[id="' + this.id + '"]');
            if (ids.length > 0 && ids[0] == this) {
                alert('重複景點囉!');
                can_choose = false;
                event.preventDefault();
            }
        });
        if (can_choose) { //景點景線景區列表
            area_list.push($('#areas').val());
            // $('#soi_list').append(
            //   '<div id="list' + type + i + '" onclick="removeXoi(' + i + ',`' + type + '`)" value="' + type + i + '">\
            //   <p style="display:inline;" id="choosen_id' + type + i + '">' + (soi_num + 1) + ':</p> \
            //   <p style="margin-botton:0px; font-size:15px;display:inline; color:#00F;" id="choosen_title' + type + i + '"></p>\
            //   <input class="inputId' + i + '" id="' + type[0] + 'id' + soi_num + '" type="hidden"  value="' + i + '"/><br></div>'
            // );
            $('#items-list').append(
                '<li id="choosen_title' + type + i + '" class="test" style="list-style-image: none;margin: 10px;border: 1px solid #ccc;padding: 4px;border-radius: 4px;color: #666;cursor: move;user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;" onclick="removeXoi(' + i + ',`' + type + '`)"></li>'
            );
            $('#choosen_title'+ type + i).html($('#choose_' + type + i).text()+"<input name=\"pid\" id=\"pid" + soi_num + "\" type=\"hidden\"  value=\"" + i + "\"/><input name=\"pid_type\" id=\"pid_type" + soi_num + "\" type=\"hidden\"  value=\"" + type + "\"/><p hidden name=\"choose_order\" class=\"choose_order\" id=\"choosen_id"+ type + i + "\">" + (soi_num + 1) + "</p><p hidden name=\"mylist_order\"  id=\"mylist_order"+type + i + "\">" + (soi_num + 1) + "</p>");
            // $('#choosen_title' + type + i).text($('#choose_' + type + i).text());
            var latlng = $('#latlng' + type + i).val().split(",");
            var location = {lat:Number(latlng[0]) , lng:Number(latlng[1])};
            addMapMaker(soi_num + 1 , location , type,$('#choose_' + type + i).text());
            soi_num++;
            //Group the items(li) in list(ul)
            items = document.querySelectorAll('.test');
            items.forEach(item => {
              $(item).prop('draggable', true)
              item.addEventListener('dragstart', dragStart)
              item.addEventListener('drop', dropped)
              item.addEventListener('dragenter', cancelDefault)
              item.addEventListener('dragover', cancelDefault)
            })
        }
    }
}
function dragStart (e) {
  var index = $(e.target).index()
  e.dataTransfer.setData('text/plain', index)
}
function dropped (e) {
  cancelDefault(e)
  
  // get new and old index
  let oldIndex = e.dataTransfer.getData('text/plain')
  let target = $(e.target)
  let newIndex = target.index()

  // console.log("oldIndex : "+oldIndex);
  // console.log("target : "+target);
  // console.log("newIndex : "+newIndex);


     
    //clearMap();
    if(oldIndex < newIndex){
        var temp = new Array();
        for(var i=0;i<soi_num;i++){
            temp[i]=map_markers[i];
        }
        for(var i=0;i<soi_num;i++){
            if(i<oldIndex)
                map_markers[i]=temp[i];
            else if(i>=oldIndex && i<newIndex)
                map_markers[i]=temp[i+1];
            else if(i==newIndex)
                map_markers[i]=temp[oldIndex];
            else
                map_markers[i]=temp[i];
        }
    }
    else{
        var temp = new Array();
        for(var i=0;i<soi_num;i++){
            temp[i]=map_markers[i];
        }
        for(var i=0;i<soi_num;i++){
            if(i<newIndex)
                map_markers[i]=temp[i];
            else if(i==newIndex)
                map_markers[i]=temp[oldIndex];
            else if(i>newIndex && i<=oldIndex)
                map_markers[i]=temp[i-1];
            else
                map_markers[i]=temp[i];
        }
    }

    // console.log("map_markers :");
    // console.log(map_markers);
    // console.log("temp :");
    // console.log(temp);
    //map_markers[newIndex] = temp[0];
    //console.log(map_markers);

    //rebuildMap();

  
  // remove dropped items at old place
  if (newIndex == oldIndex) //避免原地移動造成意外刪除
    return
  let dropped = $(this).parent().children().eq(oldIndex).remove()

  // insert the dropped items at new place
  if (newIndex < oldIndex) {
    target.before(dropped)
  } else {
    target.after(dropped)
  }
  var mylist_order_Arr = document.getElementsByName('mylist_order');
  for(var i=0; i<mylist_order_Arr.length; i++){
      mylist_order_Arr[i].innerHTML = i+1;
  }
}

function cancelDefault (e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}
function Refresh() {
    var del = confirm('確定重選?');
    if (del) {
        $('#soi_list').empty();
        soi_num = 0;
        area_list = [];
    }
}

function removeXoi(id, type) { //刪除特定XOI
    // alert("小夫我要進來囉");
    soi_num--;
    var mapCount = parseInt($('#mylist_order'+type + id).text());
    var curCount = parseInt($('#choosen_id' + type + id).text()); //目前位置編號
    curCount--;
    area_list.splice(curCount, 1); //remove 1 area according to the index user removed
    if(soi_num != 0){
      var curlist = $('#choosen_title' + type + id);
      var next_list = curlist.next();
      curlist.remove();
      for (var i = 0;i < (soi_num - curCount);i++){
        var next_value = next_list.attr('value')
        $('#choosen_id' + next_value).text(curCount + i + 1);
        $('#' + next_value[0] + 'id' + (curCount + i + 1)).attr('id' , next_value[0] + 'id' + (curCount + i));
        next_list = next_list.next();
      }
    }
    else{
      $('#choosen_title' + type + id).remove();
      area_list = [];
    }

    var mylist_order_Arr = document.getElementsByName('mylist_order');
    for(var i=0; i<mylist_order_Arr.length; i++){
        mylist_order_Arr[i].innerHTML = i+1;
    }
    removeMapMaker(mapCount-1);
}

function myMap() {
    var mapCanvas2 = document.getElementById("map_soi");
    var mapOptions2 = {
        center: new google.maps.LatLng(23.5, 121),
        zoom: 7
    }
    map2 = new google.maps.Map(mapCanvas2, mapOptions2);
}

function addMapMaker(index , location , type,xoiName){
  var icon = icon_url +xoiName+  icon_type[type];
  var marker = new google.maps.Marker({
    position:location,
    icon:icon,
    animation: google.maps.Animation.DROP,
    map:map2
  });
  map2.setCenter(location);
  if(map2.getZoom() < 12){
    map2.setZoom(12);
  }
  map_markers[index-1] = marker;
}

function removeMapMaker(index){
  map_markers[index].setMap(null);
  while(typeof map_markers[index + 1] != 'undefined'){
    map_markers[index] = map_markers[index + 1];
    temp = map_markers[index + 1]['icon'].split("|");
    map_markers[index]['icon'] = icon_url + String(index) + "|" + temp[1] + "|" + temp[2];
    map_markers[index].setMap(map2);
    index = index + 1;
  }
  delete map_markers[index];
}

function soi_form(e) {
    var my_areas = area_list[0];
    var open = $('#open').val();
    var soi_user_name = $('#soi_owner').val();
    var soi_description = $('#soi_description').val();
    var soi_title = $('#soi_title').val();
    var identifier = $('#identifier').val();
    var contributor = $('#contributor').val();
    var soi_make = $('#s_make').val();
    var urls = SOI_URL;
    var data = {
        my_areas: my_areas,
        open: open,
        soi_user_name: soi_user_name,
        soi_description: soi_description,
        soi_title: soi_title,
        identifier: identifier,
        contributor: contributor,
        soi_make: soi_make,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        success: function(data) {
            soi_table(data.ids);
        },
        error: function(data) {
            $('#loading').hide();
            console.log(data);
        }

    });
}

function soi_table(ids) {      
    if (soi_num == 0) {
        alert('尚未選擇poi/loi/aoi!!');
    } else {
        var urls = "/ajax_soistory";
        var xoi_id = [];
        var soi_id = ids;
        // for (var i = 0; i < soi_num; i++) {
        //     if ($('#pid' + i).length != 0) {
        //         xoi_id[i] = { "id": $('#pid' + i).val(), "type": 'poi' };
        //     } else if ($('#lid' + i).length != 0) {
        //         xoi_id[i] = { "id": $('#lid' + i).val(), "type": 'loi' };
        //     } else if ($('#aid' + i).length != 0) {
        //         xoi_id[i] = { "id": $('#aid' + i).val(), "type": 'aoi' };
        //     } else {
        //         console.log("Type error!");
        //     }
        // }
        var mySOI_order_Arr = document.getElementsByName('pid');
        var mySOI_type_order_Arr = document.getElementsByName('pid_type');
        for (var i = 0; i < soi_num; i++) {
            // sequence[i] = i;
            // poi_id[i] = mySOI_order_Arr[i].value;
            xoi_id[i] = { "id": mySOI_order_Arr[i].value, "type": mySOI_type_order_Arr[i].value };
        }
        console.log(xoi_id);
        var data = {
            count: soi_num,
            soi_id: soi_id,
            xoi_id: xoi_id
        }
        console.log(data['xoi_id']);

        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                alert('上傳成功');
                window.location = HOME_URL;
            },
            error: function(data) {
                $('#loading').hide();
                console.log(data);
            }
        });
    }
}

$('#city').change(function() {
    var city = $(this).val();
    var urls = "/feed_area";
    var data = {
        city: city
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            var area_count = data.area.length;
            var area_select = $('#areas').empty();
            var languages = $('#language').val();
            area_select.append('<option selected disabled hidden>請選擇</option>');
            area_select.append('<option value="All">全部</option>');
            for (var i = 0; i < area_count; i++) {
                if (languages == 'chinese' || languages == 'japanese') {
                    area_select.append(
                        $('<option></option>').val(data.area[i].area_name_en).html(data.area[i].area_name_ch)
                    );
                } else {
                    area_select.append(
                        $('<option></option>').val(data.area[i].area_name_en).html(data.area[i].area_name_en)
                    );
                }
            }
        },
        error: function(data) {
            console.log('data error');
        }
    });
});

$('#areas').change(function () { //地區分類篩選
    var areas = $(this).val();
    var citys = $('#city').val();
    var myOwn = $('#myOwn').val();
    var group = $('#MyselfGroup').val();

    if (citys == '') {
        event.preventDefault();
        alert("請先選擇地區");
    }
    var urls = XOI_URL;
    var data = {
        citys: citys,
        areas: areas,
        myOwn: myOwn,
        group: group,
    }
    $('#loading').show();
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            $('#loading').hide();
            dataAppend(data);
        },
        error: function (data) {
            $('#loading').hide();
            console.log(data);
        }
    });
});
$('#myOwn').change(function () { //地區分類篩選
    var areas = $('#areas').val();
    var citys = $('#city').val();
    var myOwn = $('#myOwn').val();
    var group = $('#MyselfGroup').val();

    if (citys == '') {
        event.preventDefault();
        alert("請先選擇地區");
    }
    
    var urls = XOI_URL;
    var data = {
        citys: citys,
        areas: areas,
        myOwn: myOwn,
        group: group,
    }
    $('#loading').show();
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            dataAppend(data);
            $('#loading').hide();
        },
        error: function (data) {
            console.log(data);
            $('#loading').hide();
        }
    });
});
$('#MyselfGroup').change(function () { //地區分類篩選
    var areas = $('#areas').val();
    var citys = $('#city').val();
    var myOwn = $('#myOwn').val();
    var group = $('#MyselfGroup').val();

    if (citys == '') {
        event.preventDefault();
        alert("請先選擇地區");
    }
    var urls = XOI_URL;
    var data = {
        citys: citys,
        areas: areas,
        myOwn: myOwn,
        group: group,
    }
    $('#loading').show();
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            dataAppend(data);
            $('#loading').hide();
        },
        error: function (data) {
            console.log(data);
            $('#loading').hide();
        }
    });
});

function filterBtn(event) {
    event.preventDefault();

    let areas = $('#areas').val();
    let citys = $('#city').val();
    let key = $('#filter_key').val();

    let data = {
        citys: citys,
        areas: areas,
        key: key
    };

    if (areas != null && citys != null) {
        $('#loading').show();
        $.ajax({
            method: "POST",
            data: data,
            url: XOI_URL,

            success: data => {
                $('#loading').hide();
                dataAppend(data);
            },

            error: data => {
                $('#loading').hide();
                console.log(data);
            }
        });
    }
}

function dataAppend(data) {
    $('.poi_detail').empty();
    $('.loi_detail').empty();
    $('.aoi_detail').empty();
    var p_counts = data.all_poi.length;
    var np_counts = data.no_list.length;
    var l_counts = data.all_loi.length;
    var a_counts = data.all_aoi.length;
    var open = $('.selectPublic').val();

    for (var i = 0; i < p_counts; i++) {
        var div_poi_detail = $('<div>').attr('name', 'poi_detail_array');
        switch (data.all_poi[i].foreignkey__identifier) {
            case 'user':
                div_poi_detail.append('<p style="display:inline;">(玩家,</p>');
                break;
            case 'docent':
                div_poi_detail.append('<p style="display:inline;">(導覽員,</p>');
                break;
            case 'expert':
                div_poi_detail.append('<p style="display:inline;">(專家,</p>');
                break;
            default:
                div_poi_detail.append('<p style="display:inline;">(未定,</p>');
        }
        switch (data.all_poi[i].format) {
            case 1:
                div_poi_detail.append('<img src="../static/images/image.png">)');
                break;
            case 2:
                div_poi_detail.append('<img src="../static/images/sound.png">)');
                break;
            case 4:
                div_poi_detail.append('<img src="../static/images/video.png">)');
                break;
            default:
                div_poi_detail.append('<p style="display:inline;">無多媒體檔案)</p>');
        }
        if (data.all_poi[i].foreignkey__rights == username) {
            div_poi_detail.append('<img src="../static/images/user.png">');
        }
        if (open == 1 && data.all_poi[i].foreignkey__rights == username && data.all_poi[i].foreignkey__identifier != 'docent' && data.all_poi[i].foreignkey__open != 1) {
            div_poi_detail.append(
                '<button type="button" class="choose_soi" id="choose_poi' + data.all_poi[i].foreignkey__poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" data-toggle="modal" data-target="#soi_modal">' +
                data.all_poi[i].foreignkey__poi_title + '</button>'
            );
        }
        else {
            div_poi_detail.append(
                '<button type="button" class="choose_soi" id="choose_poi' + data.all_poi[i].foreignkey__poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_soi(\'poi\',' + data.all_poi[i].foreignkey__poi_id + ')">' +
                data.all_poi[i].foreignkey__poi_title + '</button>\
                      <input id="latlngpoi' + data.all_poi[i].foreignkey__poi_id + '"type="hidden" value="' + data.all_poi[i].foreignkey__latitude + ',' + data.all_poi[i].foreignkey__longitude + '"/><br>'
            );
        }
        if (data.all_poi[i].foreignkey__rights == username) {
            $('.poi_detail').prepend(div_poi_detail);
        }
        else {
            $('.poi_detail').append(div_poi_detail);
        }
    }
    for (var i = 0; i < np_counts; i++) {
        var div_poi_detail = $('<div>').attr('name', 'poi_detail_array');
        switch (data.no_list[i].identifier) {
            case 'user':
                div_poi_detail.append('<p style="display:inline;">(玩家,</p>');
                break;
            case 'docent':
                div_poi_detail.append('<p style="display:inline;">(導覽員,</p>');
                break;
            case 'expert':
                div_poi_detail.append('<p style="display:inline;">(專家,</p>');
                break;
            default:
                div_poi_detail.append('<p style="display:inline;">(未定,</p>');
        }
        div_poi_detail.append('<p style="display:inline;">無多媒體檔案)</p>');
        if (data.no_list[i].rights == username) {
            div_poi_detail.append('<img src="../static/images/user.png">');
        }
        if (open == 1 && data.no_list[i].rights == username && data.no_list[i].identifier != 'docent' && data.no_list[i].foreignkey__open != 1) {
            div_poi_detail.append(
                '<button type="button" class="choose_soi" id="choose_poi' + data.no_list[i].poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" data-toggle="modal" data-target="#soi_modal">' +
                data.no_list[i].poi_title + '</button>'
            );
        }
        else {
            div_poi_detail.append(
                '<button type="button" class="choose_soi" id="choose_poi' + data.no_list[i].poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_soi(\'poi\',' + data.no_list[i].poi_id + ')">' +
                data.no_list[i].poi_title + '</button>\
                      <input id="latlngpoi' + data.no_list[i].poi_id + '"type="hidden" value="' + data.no_list[i].latitude + ',' + data.no_list[i].longitude + '"/><br>'
            );
        }
        if (data.no_list[i].rights == username) {
            $('.poi_detail').prepend(div_poi_detail);
        }
        else {
            $('.poi_detail').append(div_poi_detail);
        }
    }
    for (var i = 0; i < l_counts; i++) {
        var div_poi_detail = $('<div>').attr('name', 'poi_detail_array');
        switch (data.all_loi[i].identifier) {
            case 'user':
                div_poi_detail.append('<p style="display:inline;">(玩家)</p>');
                break;
            case 'docent':
                div_poi_detail.append('<p style="display:inline;">(導覽員)</p>');
                break;
            case 'expert':
                div_poi_detail.append('<p style="display:inline;">(專家)</p>');
                break;
            default:
                div_poi_detail.append('<p style="display:inline;">(未定)</p>');
        }
        if (data.all_loi[i].route_owner == username) {
            div_poi_detail.append('<img src="../static/images/user.png">');
        }
        if (open == 1 && data.all_loi[i].route_owner == username && data.all_loi[i].identifier != 'docent' && data.all_loi[i].open != 1) {
            div_poi_detail.append(
                '<button type="button" class="choose_soi" id="choose_loi' + data.all_loi[i].route_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" data-toggle="modal" data-target="#soi_modal">' +
                data.all_loi[i].route_title + '</button>\
                      '
            );
        }
        else {
            if (data.all_loi_poi[i].poi_id__longitude == null) {
                data.all_loi_poi[i].poi_id__longitude = 0;
                data.all_loi_poi[i].poi_id__latitude = 0;
            }
            div_poi_detail.append(
                '<button type="button" class="choose_soi" id="choose_loi' + data.all_loi[i].route_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_soi(\'loi\',' + data.all_loi[i].route_id + ')">' +
                data.all_loi[i].route_title + '</button>\
                      <input id="latlngloi' + data.all_loi[i].route_id + '"type="hidden" value="' + data.all_loi_poi[i].poi_id__latitude + ',' +
                data.all_loi_poi[i].poi_id__longitude + '">'
            );
        }
        if (data.all_loi[i].route_owner == username) {
            $('.loi_detail').prepend(div_poi_detail);
        }
        else {
            $('.loi_detail').append(div_poi_detail);
        }
    }
    for (var i = 0; i < a_counts; i++) {
        var div_poi_detail = $('<div>').attr('name', 'poi_detail_array');
        switch (data.all_aoi[i].identifier) {
            case 'user':
                div_poi_detail.append('<p style="display:inline;">(玩家)</p>');
                break;
            case 'docent':
                div_poi_detail.append('<p style="display:inline;">(導覽員)</p>');
                break;
            case 'expert':
                div_poi_detail.append('<p style="display:inline;">(專家)</p>');
                break;
            default:
                div_poi_detail.append('<p style="display:inline;">(未定)</p>');
        }
        if (data.all_aoi[i].owner == username) {
            div_poi_detail.append('<img src="../static/images/user.png">');
        }
        if (open == 1 && data.all_aoi[i].owner == username && data.all_aoi[i].identifier != 'docent' && data.all_aoi[i].open != 1) {
            div_poi_detail.append(
                '<button type="button" class="choose_soi" id="choose_aoi' + data.all_aoi[i].aoi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" data-toggle="modal" data-target="#soi_modal">' +
                data.all_aoi[i].title + '</button>\
                      '
            );
        }
        else {
            if (data.all_aoi_poi[i].poi_id__longitude == null) {
                data.all_aoi_poi[i].poi_id__longitude = 0;
                data.all_aoi_poi[i].poi_id__latitude = 0;
            }
            div_poi_detail.append(
                '<button type="button" class="choose_soi" id="choose_aoi' + data.all_aoi[i].aoi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_soi(\'aoi\',' + data.all_aoi[i].aoi_id + ')">' +
                data.all_aoi[i].title + '</button>\
                      <input id="latlngaoi' + data.all_aoi[i].aoi_id + '" type="hidden" value="' + data.all_aoi_poi[i].poi_id__latitude + ',' +
                data.all_aoi_poi[i].poi_id__longitude + '">'
            );
        }
        if (data.all_aoi[i].owner == username) {
            $('.aoi_detail').prepend(div_poi_detail);
        }
        else {
            $('.aoi_detail').append(div_poi_detail);
        }
    }
    poi_filter = true;
}

$('.selectPublic').on('click', event => {
    $('#open').val(event.target.value);
});