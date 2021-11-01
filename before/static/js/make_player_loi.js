loi_num = 0;
is_edit = false;
username = $('#route_owner').val();
role = $('#identifier').val();

var area_list = []; //keep tracking of area user has choosen
var map_markers = new Array();
var map2;
items = document.querySelectorAll('.test');

$(window).on('beforeunload', function() {
    localStorage.setItem('loi_title', $('#route_title').val());
    localStorage.setItem('loi_description', $('#route_description').val());
    localStorage.setItem('loi_transportation', $('#transportation').val());
});

window.onload = function() {
    var title = localStorage.getItem('loi_title');
    if (title != null) $('#route_title').val(title);
    var description = localStorage.getItem('loi_description');
    if (description != null) $('#route_description').val(description);
    var transportation = localStorage.getItem('loi_transportation');
    if (transportation != null) $('#transportation').val(transportation);
}

$(document).ready(function() {
    $('#make_loiform').submit(function(e) {
        $('#loading').show();
        e.preventDefault();
        loi_form(e);
    });

    $('#filter_btn').click(event => { filterBtn(event) });
});



function Choosen_loi(i) { //列出poi list
    var can_choose = true;
    if (loi_num > 999) {
        alert('選太多景點囉!');
        event.preventDefault();
        can_choose = false;
    } else {
        $('#choosen_id' + i).each(function(event) {
            var ids = $('[id="' + this.id + '"]');
            if (ids.length > 0 && ids[0] == this) {
                alert('重複景點囉!');
                can_choose = false;
                event.preventDefault();
            }
        });
        if (can_choose) {
            area_list.push($('#areas').val());
            var temp_name="valid_or_not"+i;
            // alert("temp_name : "+temp_name);
            var valid_or_not = document.getElementById(temp_name).value;
            // alert(temp_name+" : "+valid_or_not);
            var str_valid_or_not="";
            switch(valid_or_not) {
                case'0':
                    str_valid_or_not="尚未驗證";
                    break;
                case'1':
                    str_valid_or_not="已驗證通過";
                    break;
                case'-1':
                    str_valid_or_not="驗證不通過";
                    break;
                default:
                    console.log('怪怪的喔');
                    str_valid_or_not="已驗證通過";
            }
            var temp_name="open_or_not"+i;
            // alert("temp_name : "+temp_name);
            var open_or_not = document.getElementById(temp_name).value;
            // alert(temp_name+" : "+open_or_not);
            var str_open_or_not="";
            switch(open_or_not) {
                case'true':
                    str_open_or_not="公開";
                    break;
                case'false':
                    str_open_or_not="不公開";
                    break;
                default:
                    console.log('怪怪的喔');
                    str_open_or_not="公開";
            }
            $('#items-list').append(
                '<li id="choosen_title' + i + '" class="test" style="list-style-image: none;margin: 10px;border: 1px solid #ccc;padding: 4px;border-radius: 4px;color: #666;cursor: move;user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;" onclick="removePoi(' + i + ')" value="' + i + '">\
                \
                </li>'
            );
            $('#choosen_title' + i).html($('#choose_loi' + i).text()+"("+str_valid_or_not+"/"+str_open_or_not+")"+"<input name=\"pid\" id=\"pid" + loi_num + "\" type=\"hidden\"  value=\"" + i + "\"/><p hidden name=\"choose_order\" class=\"choose_order\" id=\"choosen_id" + i + "\">"+ (loi_num + 1) + "</p><input type=\"hidden\" name=\"final_valid_or_not\"  value=\"" + valid_or_not + "\"><p hidden name=\"mylist_order\"  id=\"mylist_order" + i + "\">" + (loi_num + 1) + "</p>");
            var latlng = $('input[name = "poi' + i + '"]').val().split(",");
            var location = {lat:Number(latlng[0]) , lng:Number(latlng[1])};
            addMapMaker(loi_num + 1 , location,$('#choose_loi' + i).text());
            loi_num++;
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
        // console.log(area_list);
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
        for(var i=0;i<loi_num;i++){
            temp[i]=map_markers[i];
        }
        for(var i=0;i<loi_num;i++){
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
        for(var i=0;i<loi_num;i++){
            temp[i]=map_markers[i];
        }
        for(var i=0;i<loi_num;i++){
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

function removePoi(id) { //刪除特定POI
    loi_num--;
    var mapCount = parseInt($('#mylist_order' + id).text());
    var curCount = parseInt($('#choosen_id' + id).text()); //目前位置編號
    curCount--;
    area_list.splice(curCount, 1); //remove 1 area according to the index user removed
    if(loi_num != 0){
      var curlist = $('#choosen_title' + id);
      var next_list = curlist.next();
      curlist.remove();
      for (var i = curCount;i < loi_num;i++){
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

function Refresh() { //清空poi list
    var del = confirm('確定重選?');
    if (del) {
        $('#items-list').empty();
        loi_num = 0;
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



function myMap() {
    var mapCanvas2 = document.getElementById("map_loi");
    var mapOptions2 = {
        center: new google.maps.LatLng(23.5, 121),
        zoom: 7
    }
    map2 = new google.maps.Map(mapCanvas2, mapOptions2);
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

function loi_form(e) {
    var final_valid_or_not_Arr = document.getElementsByName('final_valid_or_not');
    // var open = $('.selectPublic').val();
    var open = $('#open').val();
    var valid_flag=true;
    for(var i=0;i<loi_num;i++){
        if(final_valid_or_not_Arr[i].value == "0" || final_valid_or_not_Arr[i].value == "-1"){
            valid_flag=false;
            break;
        }
    }
    // alert("valid_flag : "+valid_flag);
    if(valid_flag==false && open=="1"){
        alert("選擇內容含有 私有/尚未驗證/驗證不通過 之選項，請改為不公開!");
        $('#loading').hide();
        return;
    }        
    alert("成功通過");
    var myLOI_order_Arr = document.getElementsByName('pid');
    var first_poi_id = myLOI_order_Arr[0].value;
    var my_areas = area_list[0];
    if(my_areas == null){
        // alert("is null");
        my_areas="TainanEast";
    }
    var transportation = $('#transportation').val();
    var route_owner = $('#route_owner').val();
    var route_description = $('#route_description').val();
    var route_title = $('#route_title').val();
    var identifier = $('#identifier').val();
    var contributor = $('#contributor').val();
    var loi_make = $('#l_make').val();
    var urls = LOI_URL;
    var data = {
        first_poi_id: first_poi_id,
        my_areas: my_areas,
        transportation: transportation,
        open: open,
        route_owner: route_owner,
        route_description: route_description,
        route_title: route_title,
        identifier: identifier,
        contributor: contributor,
        loi_make: loi_make,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
    $('#loading').show();
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        success: function(data) {
            $('#loading').hide();            
            loi_sequence(data.ids);
        },
        error: function(data) {
            $('#loading').hide();
            console.log(data);
        }

    });
}

function loi_sequence(ids) {
    if (loi_num == 0) {
        alert('尚未選擇poi!!');
    } else {
        var urls = "/ajax_sequence";
        var sequence = [];
        var poi_id = [];
        var loi_id = ids;
        var myLOI_order_Arr = document.getElementsByName('pid');
        for (var i = 0; i < loi_num; i++) {
            sequence[i] = i;
            poi_id[i] = myLOI_order_Arr[i].value;
        }
        console.log(sequence);
        console.log(poi_id);
        var data = {
            count: loi_num,
            num: sequence,
            poi_id: poi_id,
            loi_id: loi_id
        }
        $('#loading').show();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                alert('上傳成功');
                $('#loading').hide();
                window.location = HOME_URL;
            },
            error: function(data) {
                console.log(data);
                $('#loading').hide();
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
    // alert("change area");
    var urls = POI_URL;
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
            $('#loading').hide();
            dataAppend(data);
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
            $('#loading').hide();
            dataAppend(data);
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
    var myOwn = $('#myOwn').val();

    let data = {
        citys: citys,
        areas: areas,
        key: key,
        myOwn: myOwn,
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
    //alert(media_counts);
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
        if (open == 1 && data.all_poi[i].foreignkey__rights == username && data.all_poi[i].foreignkey__identifier != 'docent' && data.all_poi[i].foreignkey__open != 1) 
        {
            div_poi_detail.append
            // data-target="#loi_modal
            (
                '<button type="button" class="choose_loi" id="choose_loi' + data.all_poi[i].foreignkey__poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_loi(' + data.all_poi[i].foreignkey__poi_id + ')">' +
                data.all_poi[i].foreignkey__poi_title + '</button>\
                      <input type="hidden" id="poi' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__poi_id + '"/>\
                      <input type="hidden" name="poi' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__latitude + ',' + data.all_poi[i].foreignkey__longitude + '"/>\
                      <input type="hidden" id="open_or_not' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__open +'"/>\
                      <input type="hidden" id="valid_or_not' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__verification + '"/><br>'
            );
        }
        else {
            div_poi_detail.append(
                '<button type="button" class="choose_loi" id="choose_loi' + data.all_poi[i].foreignkey__poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_loi(' + data.all_poi[i].foreignkey__poi_id + ')">' +
                data.all_poi[i].foreignkey__poi_title + '</button>\
                      <input type="hidden" id="poi' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__poi_id + '"/>\
                      <input type="hidden" name="poi' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__latitude + ',' + data.all_poi[i].foreignkey__longitude + '"/>\
                      <input type="hidden" id="open_or_not' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__open +'"/>\
                      <input type="hidden" id="valid_or_not' + data.all_poi[i].foreignkey__poi_id + '" value="' + data.all_poi[i].foreignkey__verification + '"/><br>'
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
            div_poi_detail.append
            // data-target="#loi_modal
            (
                '<button type="button" class="choose_loi" id="choose_loi' + data.no_list[i].poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;"  onclick="Choosen_loi(' + data.no_list[i].poi_id + ')">' +
                data.no_list[i].poi_title + '</button>\
                      <input type="hidden" id="poi' + data.no_list[i].poi_id + '" value="' + data.no_list[i].poi_id + '"/>\
                      <input type="hidden" name="poi' + data.no_list[i].poi_id + '" value="' + data.no_list[i].latitude + ',' + data.no_list[i].longitude + '"/>\
                      <input type="hidden" id="open_or_not' + data.no_list[i].poi_id + '" value="' + data.no_list[i].open +'"/>\
                      <input type="hidden" id="valid_or_not' + data.no_list[i].poi_id + '" value="' + data.no_list[i].verification + '"/><br>'
            );
        }
        else {
            div_poi_detail.append(
                '<button type="button" class="choose_loi" id="choose_loi' + data.no_list[i].poi_id + '" \
                      style="margin-botton:0px; font-size:15px; color:#00F;" onclick="Choosen_loi(' + data.no_list[i].poi_id + ')">' +
                data.no_list[i].poi_title + '</button>\
                      <input type="hidden" id="poi' + data.no_list[i].poi_id + '" value="' + data.no_list[i].poi_id + '"/>\
                      <input type="hidden" name="poi' + data.no_list[i].poi_id + '" value="' + data.no_list[i].latitude + ',' + data.no_list[i].longitude + '"/>\
                      <input type="hidden" id="open_or_not' + data.no_list[i].poi_id + '" value="' + data.no_list[i].open +'"/>\
                      <input type="hidden" id="valid_or_not' + data.no_list[i].poi_id + '" value="' + data.no_list[i].verification + '"/><br>'
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