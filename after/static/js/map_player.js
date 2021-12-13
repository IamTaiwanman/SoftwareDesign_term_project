var docent_filter = true; //docent can be filtered.
var poi_filter = false; //topic type category media can't filter.
var is_edit = false;

var topic, type, category, media;
$(window).on('beforeunload', function() {
    localStorage.setItem('content', $("#content").val());
    localStorage.setItem('city', $("#city").val());
    localStorage.setItem('area', $("#areas").val());
    localStorage.setItem('media', $("#medias").val());
    localStorage.setItem('type', $("#type").val());
    localStorage.setItem('category', $("#category").val());
    localStorage.setItem('topic', $("#topic").val());
});
window.onload = function() {
    var languages = localStorage.getItem('language');
    if (languages != null) {
        $('#language').val(languages);
        chg_lan(languages);
    }
    try {
        var old_content = localStorage.getItem('content');
        var old_city = localStorage.getItem('city');
        var old_area = localStorage.getItem('area');
        var media = localStorage.getItem('media');
        var type = localStorage.getItem('type');
        var category = localStorage.getItem('category');
        var topic = localStorage.getItem('topic');
        if (old_content == null) old_content = 's_poi';
        if (old_city == null) old_city = '臺南市';
        if (media == null) media = 'all';
        if (type == null) type = 'all';
        if (category == null) category = 'all';
        if (topic == null) topic = 'all';
        $('#content').val(old_content);
        $('#city').val(old_city);
        $("#city").trigger("change");
        $('#areas').val(old_area);
        $("#areas").trigger("change");
        $('#type').val(type);
        $('#category').val(category);
        $('#topic').val(topic);
        $('#medias').val(media);
        $("#content").trigger("change");
    } catch (err) {
        if (old_content == null) old_content = 's_poi';
        if (old_city == null) old_city = '臺南市';
        if (media == null) media = 'all';
        if (type == null) type = 'all';
        if (category == null) category = 'all';
        if (topic == null) topic = 'all';
        var old_city = $("#city").val();
        var old_area = $("#areas").val();
        var media = $('#medias').val();
        var type = $('#type').val();
        var category = $('#category').val();
        var topic = $('#topic').val();
        $('#city').val(old_city);
        $("#city").trigger("change");
        $('#areas').val(old_area);
        $("#areas").trigger("change");
        if (media == null || type == null || category == null || topic == null) { //2017/9/12
            media = 'all';
            type = 'all';
            category = 'all';
            topic = 'all';
        }
        $('#type').val(type);
        $('#category').val(category);
        $('#topic').val(topic);
        $('#medias').val(media);
    }
}
$("#content").change(function() { //景點景線景區故事篩選
    data = GetFilterList();
    var contents = $("#content").val();
    var urls = '../ajax_area';
    if (contents == 's_loi' || contents == 's_aoi' || contents == 's_soi') {
        $('#topic').hide();
        $('#type').hide();
        $('#category').hide();
        $('#medias').hide();
    } else {
        $('#topic').fadeIn();
        $('#type').fadeIn();
        $('#category').fadeIn();
        $('#medias').fadeIn();
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            if(docent_filter){
                AppendDocent(data.docent_name)
            }
            if (contents  == 's_poi') {
                $(".poi_show").show();
                $(".loi_show").hide();
                $(".aoi_show").hide();
                $(".soi_show").hide();
                var counts = data.all_poi.length;
                AppendList('poi', data.all_poi, counts, user_role);
                poi_object = data;
            } else if (contents  == 's_loi') {
                $(".loi_show").show();
                $(".poi_show").hide();
                $(".aoi_show").hide();
                $(".soi_show").hide();
                var counts = data.all_loi.length;
                var counts = data.all_loi.length;
                AppendList('loi', data.all_loi, counts, user_role);
                loi_object = data;
            } else if (contents  == 's_aoi') {
                $(".aoi_show").show();
                $(".loi_show").hide();
                $(".poi_show").hide();
                $(".soi_show").hide();
                var counts = data.all_aoi.length;
                var counts = data.all_aoi.length;
                AppendList('aoi', data.all_aoi, counts, user_role);
                aoi_object = data;
            } else if (contents  == 's_soi') {
                $(".soi_show").show();
                $(".loi_show").hide();
                $(".aoi_show").hide();
                $(".poi_show").hide();
                var counts = data.all_soi.length;
                AppendList('soi', data.all_soi, counts, user_role);
                soi_object = data;
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
});
$('#city').change(function() { //抓地區資料
    var city = $(this).val();
    var map_role = $('#map_role').val();
    var urls = '../feed_area';
    var data = {
        city: city,
        map_role: map_role
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            var area_count = data.area.length;
            var area_select = $('#areas').empty();
            var languages = $('#language').val();

            if (languages == 'chinese' || languages == 'japanese') {
                area_select.append('<option vlaue="all" class="all" selected>全部</option>');
            } else if (languages == "english") {
                area_select.append('<option vlaue="all" class="all" selected>All</option>');
            }
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
            $('#areas select').val('all');
            $("#areas").trigger("change");
        },
        error: function(data) {
            console.log(data);
        }
    });
});
$('#areas').change(function() { //地區分類篩選
    data = GetFilterList();
    var docents = $('#docents').val();
    var contents = $("#content").val();
    var languages = $('#language').val();
    if (languages != 'chinese' && areas == "all") {
        areas = "全部";
    }
    var urls = '../ajax_area';
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            if(docent_filter){
                AppendDocent(data.docent_name);
            }
            if (contents == 's_poi') {
                var counts = data.all_poi.length;
                AppendList('poi', data.all_poi, counts, user_role);
                poi_filter = true;
            } else if (contents == 's_loi') {
                $('.loi_detail').empty();
                var counts = data.all_loi.length;
                AppendList('loi', data.all_loi, counts, user_role);
                poi_filter = false;
            } else if (contents == 's_aoi') {
                var counts = data.all_aoi.length;
                AppendList('aoi', data.all_aoi, counts, user_role);
                poi_filter = false;
            } else {
                var counts = data.all_soi.length;
                AppendList('soi', data.all_soi, counts, user_role);
                poi_filter = false;
            }
        },
        error: function(data) {
            console.log(data);
        }
    });

});
$('#topic').change(function() {
    data = GetFilterList()
    var urls = '../ajax_area';
    if (poi_filter) {
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                if(docent_filter){
                    AppendDocent(data.docent_name)
                }
                $('.poi_detail').empty();
                var counts = data.all_poi.length;
                if (document.getElementById('language').value == "chinese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">景點列表</h2>');
                    $('.poi_detail').append('<h5>共:' + counts + '筆景點</h5>');
                } else if (document.getElementById('language').value == "english") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>A total of ' + counts + ' POIs</h5>');
                } else if (document.getElementById('language').value == "japanese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>合計' + counts + 'スポット</h5>');
                }
                AppendList('poi', data.all_poi, counts, user_role);
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
});
$('#type').change(function() {
    data = GetFilterList()
    var urls = '../ajax_area';
    if (poi_filter) {
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                if(docent_filter){
                    AppendDocent(data.docent_name)
                }
                $('.poi_detail').empty();
                var counts = data.all_poi.length;
                if (document.getElementById('language').value == "chinese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">景點列表</h2>');
                    $('.poi_detail').append('<h5>共:' + counts + '筆景點</h5>');
                } else if (document.getElementById('language').value == "english") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>A total of ' + counts + ' POIs</h5>');
                } else if (document.getElementById('language').value == "japanese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>合計' + counts + 'スポット</h5>');
                }
                AppendList('poi', data.all_poi, counts, user_role);
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
});
$('#category').change(function() {
    data = GetFilterList()
    var urls = '../ajax_area';
    if (poi_filter) {
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                if(docent_filter){
                    AppendDocent(data.docent_name)
                }
                $('.poi_detail').empty();
                var counts = data.all_poi.length;
                if (document.getElementById('language').value == "chinese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">景點列表</h2>');
                    $('.poi_detail').append('<h5>共:' + counts + '筆景點</h5>');
                } else if (document.getElementById('language').value == "english") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>A total of ' + counts + ' POIs</h5>');
                } else if (document.getElementById('language').value == "japanese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>合計' + counts + 'スポット</h5>');
                }
                AppendList('poi', data.all_poi, counts, user_role);
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
});
$('#medias').change(function() {
    data = GetFilterList()
    var urls = '../ajax_area';
    if (poi_filter) {
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                if(docent_filter){
                    AppendDocent(data.docent_name)
                }
                $('.poi_detail').empty();
                var counts = data.all_poi.length;
                if (document.getElementById('language').value == "chinese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">景點列表</h2>');
                    $('.poi_detail').append('<h5>共:' + counts + '筆景點</h5>');
                } else if (document.getElementById('language').value == "english") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>A total of ' + counts + ' POIs</h5>');
                } else if (document.getElementById('language').value == "japanese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>合計' + counts + 'スポット</h5>');
                }
                AppendList('poi', data.all_poi, counts, user_role);
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
});

$('#docents').change(function(e) {
    data = GetFilterList()
    var urls = '../ajax_area';
    if (poi_filter) {
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                $('.poi_detail').empty();
                var counts = data.all_poi.length;
                if (document.getElementById('language').value == "chinese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">景點列表</h2>');
                    $('.poi_detail').append('<h5>共:' + counts + '筆景點</h5>');
                } else if (document.getElementById('language').value == "english") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>A total of ' + counts + ' POIs</h5>');
                } else if (document.getElementById('language').value == "japanese") {
                    $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
                    $('.poi_detail').append('<h5>合計' + counts + 'スポット</h5>');
                }
                AppendList('poi', data.all_poi, counts, user_role);
            },
            error: function(data) {
                console.log(data);
            }
        });
    }});
function GetFilterList(){
    var media = $('#medias').val();
    var category = $('#category').val();
    var map_role = $('#map_role').val();
    var type = $('#type').val();
    var topic = $('#topic').val();
    var citys = $('#city').val();
    var areas = $('#areas').val();
    var contents = $("#content").val();
    var docents = $('#docents').val();
    var data = {
        contents: contents,
        map_role: map_role,
        citys: citys,
        areas: areas,
        topic: topic,
        type: type,
        category: category,
        media: media,
        docents: docents
    }
    return data
}
function AppendList(type, data, counts, user_role) {
    if (type == 'poi') {
        $('.poi_detail').empty();
        if (document.getElementById('language').value == "chinese") {
            $('.poi_detail').append('<h2 id="poi_show-1">景點列表</h2>');
            $('.poi_detail').append('<h5>共:' + counts + '筆景點</h5>');
        } else if (document.getElementById('language').value == "english") {
            $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
            $('.poi_detail').append('<h5>A total of ' + counts + ' POIs</h5>');
        } else if (document.getElementById('language').value == "japanese") {
            $('.poi_detail').append('<h2 id="poi_show-1">POIs</h2>');
            $('.poi_detail').append('<h5>合計' + counts + 'スポット</h5>');
        }
        for (var i = 0; i < counts; i++) {
            if (user_role == 'admin') {
                $('.poi_detail').append(
                    '<table class="table table-hover" style="margin-bottom:0px;"><th id="poi' + data[i].poi_id + '">\
                <a style="font-size:15px;" href="/poi_detail/' + data[i].poi_id + '">' + data[i].poi_title + '</a>\
                <button class="btn btn-info" onclick="edit_poi(' + data[i].poi_id + ')" style="float: right; margin-right: 10px;">修改</button>\
                <button class="btn btn-danger" onclick="delete_poi(' + data[i].poi_id + ')" style="float: right; margin-right: 10px;">刪除</button>\
                </th></table>'
                );
            } else {
                $('.poi_detail').append(
                    '<table class="table table-hover" style="margin-bottom:0px;"><th>\
                <a style="font-size:15px;" href="/poi_detail/' + data[i].poi_id + '">' + data[i].poi_title + '</a>\
                </th></table>'
                );
            }
        }
    } else if (type == 'loi') {
        $('.loi_detail').empty();
        if (document.getElementById('language').value == "chinese") {
            $('.loi_detail').append('<h2 id="loi_show-1">景線列表</h2>');
            $('.loi_detail').append('<h5>共:' + counts + '筆景線</h5>');
        } else if (document.getElementById('language').value == "english") {
            $('.loi_detail').append('<h2 id="loi_show-1">LOIs</h2>');
            $('.loi_detail').append('<h5>A total of ' + counts + ' LOIs</h5>');
        } else if (document.getElementById('language').value == "japanese") {
            $('.loi_detail').append('<h2 id="loi_show-1">POIs</h2>');
            $('.loi_detail').append('<h5>合計' + counts + 'ルート</h5>');
        }
        for (var i = 0; i < counts; i++) {
            if (user_role == 'admin') {
                $('.loi_detail').append(
                    '<table class="table table-hover" style="margin-bottom:0px;"><th id="loi' + data[i].route_id + '">\
                    <a style="font-size:15px;" href="/loi_detail/' + data[i].route_id + '">' + data[i].route_title + '</a>\
                    <button class="btn btn-info" onclick="edit_loi(' + data[i].route_id + ')" style="float: right; margin-right: 10px;">修改</button>\
                    <button class="btn btn-danger" onclick="delete_loi(' + data[i].route_id + ')" style="float: right; margin-right: 10px;">刪除</button>\
                    </th></table>'
                );
            } else {
                $('.loi_detail').append(
                    '<table class="table table-hover" style="margin-bottom:0px;"><th>\
                    <a style="font-size:15px;" href="/loi_detail/' + data[i].route_id + '">' + data[i].route_title + '</a>\
                    </th></table>'
                );
            }
        }
    } else if (type == 'aoi') {
        $('.aoi_detail').empty();
        if (document.getElementById('language').value == "chinese") {
            $('.aoi_detail').append('<h2 id="aoi_show-1">景區列表</h2>');
            $('.aoi_detail').append('<h5>共:' + counts + '筆景區</h5>');
        } else if (document.getElementById('language').value == "english") {
            $('.aoi_detail').append('<h2 id="aoi_show-1">AOIs</h2>');
            $('.aoi_detail').append('<h5>A total of ' + counts + ' AOIs</h5>');
        } else if (document.getElementById('language').value == "japanese") {
            $('.aoi_detail').append('<h2 id="aoi_show-1">POIs</h2>');
            $('.aoi_detail').append('<h5>合計' + counts + 'エリア</h5>');
        }
        for (var i = 0; i < counts; i++) {
            if (user_role == 'admin') {
                $('.aoi_detail').append(
                    '<table class="table table-hover" style="margin-bottom:0px;"><th id="aoi' + data[i].aoi_id + '">\
                    <a style="font-size:15px;" href="/aoi_detail/' + data[i].aoi_id + '">' + data[i].title + '</a>\
                    <button class="btn btn-info" onclick="edit_aoi(' + data[i].aoi_id + ')" style="float: right; margin-right: 10px;">修改</button>\
                    <button class="btn btn-danger" onclick="delete_aoi(' + data[i].aoi_id + ')" style="float: right; margin-right: 10px;">刪除</button>\
                    </th></table>'
                );
            } else {
                $('.aoi_detail').append(
                    '<table class="table table-hover" style="margin-bottom:0px;"><th>\
                    <a style="font-size:15px;" href="/aoi_detail/' + data[i].aoi_id + '">' + data[i].title + '</a>\
                    </th></table>'
                );
            }
        }
    } else if (type == 'soi') {
        $('.soi_detail').empty();
        if (document.getElementById('language').value == "chinese") {
            $('.soi_detail').append('<h2 id="soi_show-1">故事列表</h2>');
            $('.soi_detail').append('<h5>共:' + counts + '筆主題故事</h5>');
        } else if (document.getElementById('language').value == "english") {
            $('.soi_detail').append('<h2 id="soi_show-1">SOIs</h2>');
            $('.soi_detail').append('<h5>A total of ' + counts + ' SOIs</h5>');
        } else if (document.getElementById('language').value == "japanese") {
            $('.soi_detail').append('<h2 id="soi_show-1">POIs</h2>');
            $('.soi_detail').append('<h5>合計' + counts + '場域</h5>');
        }
        for (var i = 0; i < counts; i++) {
            if (user_role == 'admin') {
                $('.soi_detail').append(
                    '<table class="table table-hover" style="margin-bottom:0px;"><th id="soi' + data[i].soi_id + '">\
                    <a style="font-size:15px;" href="/soi_detail/' + data[i].soi_id + '">' + data[i].soi_title + '</a>\
                    <button class="btn btn-info" onclick="edit_soi(' + data[i].soi_id + ')" style="float: right; margin-right: 10px;">修改</button>\
                    <button class="btn btn-danger" onclick="delete_soi(' + data[i].soi_id + ')" style="float: right; margin-right: 10px;">刪除</button>\
                    </th></table>'
                );
            } else {
                $('.soi_detail').append(
                    '<table class="table table-hover" style="margin-bottom:0px;"><th>\
                    <a style="font-size:15px;" href="/soi_detail/' + data[i].soi_id + '">' + data[i].soi_title + '</a>\
                    </th></table>'
                );
            }
        }
    }
}

function AppendDocent(data) {
    try {
        var doc_len = data.length;
    } catch (err) {
        var doc_len = 0
    }
    var docent_select = $('#docents').empty();
    if (document.getElementById('language').value == "chinese") {
        docent_select.append('<option vlaue="all" class="all">全部</option>');
    } else if (document.getElementById('language').value == "english") {
        docent_select.append('<option vlaue="all" class="all">All</option>');
    } else if (document.getElementById('language').value == "japanese") {
        docent_select.append('<option vlaue="all" class="all">すべて</option>');
    }
    for (var i = 0; i < doc_len; i++) {
        if (data[i].name != '') {
            $('#docents').append(
                $('<option></option>').val(data[i].fk_userid__user_name).html(data[i].name)
            );
        }
    }
}
function delete_poi(poi_id) {
    if (document.getElementById('language').value == "chinese") {
        var del = confirm("確定刪除?");
    } else if (document.getElementById('language').value == "english") {
        var del = confirm("Are you sure you want to delete?");
    } else if (document.getElementById('language').value == "japanese") {
        var del = confirm("削除してもよろしいですか?");
    }
    if (del == true) {
        poi = '/' + poi_id + '/poi';
        window.location = '/make_player' + poi;
        $('#poi' + poi_id).fadeOut();
    }
}
function delete_loi(loi_id) {
    if (document.getElementById('language').value == "chinese") {
        var del = confirm("確定刪除?");
    } else if (document.getElementById('language').value == "english") {
        var del = confirm("Are you sure you want to delete?");
    } else if (document.getElementById('language').value == "japanese") {
        var del = confirm("削除してもよろしいですか?");
    }
    if (del == true) {
        loi = '/' + loi_id + '/loi';
        window.location = '/make_player' + loi;
        $('#loi' + loi_id).fadeOut();
    }
}

function delete_aoi(aoi_id) {
    if (document.getElementById('language').value == "chinese") {
        var del = confirm("確定刪除?");
    } else if (document.getElementById('language').value == "english") {
        var del = confirm("Are you sure you want to delete?");
    } else if (document.getElementById('language').value == "japanese") {
        var del = confirm("削除してもよろしいですか?");
    }
    if (del == true) {
        aoi = '/' + aoi_id + '/aoi';
        window.location = '/make_player' + aoi;
        $('#aoi' + aoi_id).fadeOut();
    }
}

function delete_soi(soi_id) {
    if (document.getElementById('language').value == "chinese") {
        var del = confirm("確定刪除?");
    } else if (document.getElementById('language').value == "english") {
        var del = confirm("Are you sure you want to delete?");
    } else if (document.getElementById('language').value == "japanese") {
        var del = confirm("削除してもよろしいですか?");
    }
    if (del == true) {
        soi = '/' + soi_id + '/soi';
        window.location = '/make_player' + soi;
        $('#soi' + soi_id).fadeOut();
    }
}

function edit_poi(poi_id) {
    poi = '/' + poi_id + '/poi';
    window.location = '/edit_player' + poi;
}

function edit_loi(loi_id) {
    loi = '/' + loi_id + '/loi';
    window.location = '/edit_player' + loi;
}

function edit_aoi(aoi_id) {
    aoi = '/' + aoi_id + '/aoi';
    window.location = '/edit_player' + aoi;
}

function edit_soi(soi_id) {
    soi = '/' + soi_id + '/soi';
    window.location = '/edit_player' + soi;
}