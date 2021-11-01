aoi_num = 0;
username = $('#aoi_owner').val();
role = $('#identifier').val();

var is_edit = false;
var area_list = []; //keep tracking of area user has choosen
var map_markers = new Array();
var map2;

$(window).on('beforeunload', function() {
    localStorage.setItem('aoi_title', $('#aoi_title').val());
    localStorage.setItem('aoi_description', $('#aoi_description').val());
    localStorage.setItem('aoi_transportation', $('#transportation').val());
});

window.onload = function() {
    var title = localStorage.getItem('aoi_title');
    if (title != null) $('#aoi_title').val(title);
    var description = localStorage.getItem('aoi_description');
    if (description != null) $('#aoi_description').val(description);
    var transportation = localStorage.getItem('aoi_transportation');
    if (transportation != null) $('#transportation').val(transportation);
}

$(document).ready(function() {
    $('#make_aoiform').submit(function(e) {
        $('#loading').show();
        e.preventDefault();
        aoi_form(e);
    });

    $('#filter_btn').click(event => { filterBtn(event) });
});


function Choosen_aoi(i) {
    var can_choose = true;
    if (aoi_num > 999) {
        alert('選太多景點囉!');
        event.preventDefault();
        can_choose = false;
    } else {
        $('#choosen_id' + i).each(function() {
            var ids = $('[id="' + this.id + '"]');
            if (ids.length > 0 && ids[0] == this) {
                alert('重複景點囉!');
                can_choose = false;
                event.preventDefault();
            }
        });
        if (can_choose) {
            area_list.push($('#areas').val());
            $('#items-list').append(
                '<li id="choosen_title' + i + '" class="test" style="list-style-image: none;margin: 10px;border: 1px solid #ccc;padding: 4px;border-radius: 4px;color: #666;cursor: move;user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;" onclick="removePoi(' + i + ')" value="' + i + '"></li>'
                // '<div id="list' + i + '" onclick="removePoi(' + i + ')" value="'+ i + '"> \
                // <p style="display:inline;" id="choosen_id' + i + '">' + (aoi_num + 1) + ':</p>\
                // <p style="margin-botton:0px; font-size:15px;display:inline; color:#00F;" id="choosen_title' + i + '"></p>\
                // <input id="pid' + aoi_num + '" type="hidden"  value="' + i + '"/><br></div>'
            );
            $('#choosen_title' + i).html($('#choose_aoi' + i).text()+"<input name=\"pid\" id=\"pid" + aoi_num + "\" type=\"hidden\"  value=\"" + i + "\"/><p hidden name=\"choose_order\" class=\"choose_order\" id=\"choosen_id" + i + "\">" + (aoi_num + 1) + "</p><p hidden name=\"mylist_order\"  id=\"mylist_order" + i + "\">" + (aoi_num + 1) + "</p>");
            // $('#choosen_title' + i).text($('#choose_aoi' + i).text());
            var latlng = $('input[name = "poi' + i + '"]').val().split(",");
            var location = {lat:Number(latlng[0]) , lng:Number(latlng[1])};
            addMapMaker(aoi_num + 1 , location,$('#choose_aoi' + i).text());
            aoi_num++;
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
     
    //clearMap();
    if(oldIndex < newIndex){
        var temp = new Array();
        for(var i=0;i<aoi_num;i++){
            temp[i]=map_markers[i];
        }
        for(var i=0;i<aoi_num;i++){
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
        for(var i=0;i<aoi_num;i++){
            temp[i]=map_markers[i];
        }
        for(var i=0;i<aoi_num;i++){
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

// function Refresh() {
//     var del = confirm('確定重選?');
//     if (del) {
//         $('#aoi_list').empty();
//         area_list = [];
//         aoi_num = 0;
//     }
// }
function Refresh() { //清空poi list
    var del = confirm('確定重選?');
    if (del) {
        $('#items-list').empty();
        aoi_num = 0;
        area_list = [];
        clearMap();
        map_markers = [];
    }
}
function clearMap(){
    map_markers.forEach(function(e) {
    e.setMap(null);
    });
}

function removePoi(id) { //刪除特定POI
    aoi_num--;
    var mapCount = parseInt($('#mylist_order' + id).text());
    var curCount = parseInt($('#choosen_id' + id).text()); //目前位置編號
    curCount--;
    area_list.splice(curCount, 1); //remove 1 area according to the index user removed
    if(aoi_num != 0){
      var curlist = $('#choosen_title' + id);
      var next_list = curlist.next();
      curlist.remove();
      for (var i = curCount;i < aoi_num;i++){
        var next_value = next_list.attr('value')
        $('#choosen_id' + next_value).text(i + 1);
        $('#pid' + (i + 1)).attr('id' , 'pid' + i);
        next_list = next_list.next();
      }
      
    }
    else{
      $('#choosen_title' + id).remove();
      area_list = [];
    }
    // console.log(area_list);
    
 

    var mylist_order_Arr = document.getElementsByName('mylist_order');
    for(var i=0; i<mylist_order_Arr.length; i++){
        mylist_order_Arr[i].innerHTML = i+1;
    } 
    removeMapMaker(mapCount-1); 

}

function addMapMaker(index , location, poiName){
  var marker = new google.maps.Marker({
    position:location,
    label:poiName ,
    animation: google.maps.Animation.DROP,
    map:map2
  });
  map2.setCenter(location);
  if(map2.getZoom() < 12){
    map2.setZoom(12);
  }
  //alert("addMapMaker - index : "+index);
  map_markers[index-1] = marker;
  // console.log(map_markers);
}

function removeMapMaker(index){
  map_markers[index].setMap(null);
  while(typeof map_markers[index + 1] != 'undefined'){
    map_markers[index] = map_markers[index + 1];
    map_markers[index]['label'] = String(index);
    map_markers[index].setMap(map2);
    index = index + 1;
  }
  delete map_markers[index];
}


function myMap() {
    var mapCanvas2 = document.getElementById("map_aoi");
    var mapOptions2 = {
        center: new google.maps.LatLng(23.5, 121),
        zoom: 7
    }
    map2 = new google.maps.Map(mapCanvas2, mapOptions2);
}

function aoi_form(e) {
    var myAOI_order_Arr = document.getElementsByName('pid');
    var first_poi_id = myAOI_order_Arr[0].value;
    var my_areas = area_list[0];
    var open = $('#open').val();
    var aoi_owner = $('#aoi_owner').val();
    var aoi_description = $('#aoi_description').val();
    var aoi_title = $('#aoi_title').val();
    var identifier = $('#identifier').val();
    var contributor = $('#contributor').val();
    var transportation = $('#transportation').val();
    var aoi_make = $('#a_make').val();
    var urls = AOI_URL;
    var data = {
        first_poi_id: first_poi_id,
        my_areas: my_areas,
        open: open,
        aoi_owner: aoi_owner,
        aoi_description: aoi_description,
        aoi_title: aoi_title,
        identifier: identifier,
        no_pois: aoi_num,
        contributor: contributor,
        transportation: transportation,
        aoi_make: aoi_make,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        success: function(data) {
            $('#loading').hide();
            aoi_table(data.ids);
        },
        error: function(data) {
            $('#loading').hide();
            console.log(data);
        }

    });
}

function aoi_table(ids) {       //***************************************************************************************************
    if (aoi_num == 0) {
        alert('尚未選擇poi!!');
    } else {
        var urls = "/ajax_aoipoi";
        var sequence = [];
        var poi_id = [];
        var aoi_id = ids;
        var myAOI_order_Arr = document.getElementsByName('pid');
        for (var i = 0; i < aoi_num; i++) {
            sequence[i] = i;
            poi_id[i] = myAOI_order_Arr[i].value;
        }
        // for (var i = 0; i < aoi_num; i++) {
        //     poi_id[i] = $('#pid' + i).val();
        // }
        var data = {
            count: aoi_num,
            poi_id: poi_id,
            aoi_id: aoi_id
        }
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
    $('#loading').show();
    var urls = POI_URL;
    var data = {
        citys: citys,
        areas: areas,
        myOwn: myOwn,
        group: group,
    }
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
$('#myOwn').change(function () { //我的創作分類篩選
    var areas = $('#areas').val();
    var citys = $('#city').val();
    var myOwn = $(this).val();
    var group = $('#MyselfGroup').val();

    $('#loading').show();
    var urls = POI_URL;
    var data = {
        citys: citys,
        areas: areas,
        myOwn: myOwn,
        group: group,
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {            
            dataAppend(data);
            $('#loading').hide();
        },
        error: function (data) {
            $('#loading').hide();
            console.log(data);
        }
    });
});
$('#MyselfGroup').change(function () { //我的創作分類篩選
    var areas = $('#areas').val();
    var citys = $('#city').val();
    var myOwn = $('#myOwn').val();
    var group = $('#MyselfGroup').val();

    $('#loading').show();
    var urls = POI_URL;
    var data = {
        citys: citys,
        areas: areas,
        myOwn: myOwn,
        group: group,
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            dataAppend(data);
            $('#loading').hide();
        },
        error: function (data) {
            $('#loading').hide();
            console.log(data);
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
            url: POI_URL,

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
    var media_counts = data.all_poi.length;
    var none_counts = data.no_list.length;
    var open = $('#open').val();

    for (var i = 0; i < media_counts; i++) {
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
                div_poi_detail.append('<img src="/static/images/image.png">)');
                break;
            case 2:
                div_poi_detail.append('<img src="/static/images/sound.png">)');
                break;
            case 4:
                div_poi_detail.append('<img src="/static/images/video.png">)');
                break;
            default:
                div_poi_detail.append('<p style="display:inline;">無多媒體檔案)</p>');
        }
        if (data.all_poi[i].foreignkey__rights == username) {
            div_poi_detail.append('<img src="../static/images/user.png">');
        }
        if (open == 1 && data.all_poi[i].foreignkey__rights == username && data.all_poi[i].foreignkey__identifier != 'docent' && data.all_poi[i].foreignkey__open != 1) {
            div_poi_detail.append(
                '<button type="button" class="choose_aoi" id="choose_aoi' + data.all_poi[i].foreignkey__poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" data-toggle="modal" data-target="#aoi_modal">' +
                data.all_poi[i].foreignkey__poi_title + '</button>\
                      <input type="hidden" name="poi' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__latitude + ',' + data.all_poi[i].foreignkey__longitude + '"/><br>'
            );
        }
        else {
            div_poi_detail.append(
                '<button type="button" class="choose_aoi" id="choose_aoi' + data.all_poi[i].foreignkey__poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_aoi(' + data.all_poi[i].foreignkey__poi_id + ')">' +
                data.all_poi[i].foreignkey__poi_title + '</button>\
                      <input type="hidden" name="poi' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__latitude + ',' + data.all_poi[i].foreignkey__longitude + '"/><br>'
            );
        }
        if (data.all_poi[i].foreignkey__rights == username) {
            $('.poi_detail').prepend(div_poi_detail);
        }
        else {
            $('.poi_detail').append(div_poi_detail);
        }
    }
    for (var i = 0; i < none_counts; i++) {
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
                '<button type="button" class="choose_aoi" id="choose_aoi' + data.no_list[i].poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" data-toggle="modal" data-target="#aoi_modal">' +
                data.no_list[i].poi_title + '</button>\
                      <input type="hidden" name="poi' + data.no_list[i].poi_id + '" value="' + data.no_list[i].latitude + ',' + data.no_list[i].longitude + '"/><br>'
            );
        }
        else {
            div_poi_detail.append(
                '<button type="button" class="choose_aoi" id="choose_aoi' + data.no_list[i].poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_aoi(' + data.no_list[i].poi_id + ')">' +
                data.no_list[i].poi_title + '</button>\
                      <input type="hidden" name="poi' + data.no_list[i].poi_id + '" value="' + data.no_list[i].latitude + ',' + data.no_list[i].longitude + '"/><br>'
            );
        }
        if (data.no_list[i].rights == username) {
            $('.poi_detail').prepend(div_poi_detail);
        }
        else {
            $('.poi_detail').append(div_poi_detail);
        }
    }
    poi_filter = true;
}

$('.selectPublic').on('click', event => {
    $('#open').val(event.target.value);
});

$('.selectTool').on('click', event => {
    $('#transportation').val(event.target.value);
});