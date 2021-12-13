var is_edit = false;
var var_update = false;
$(window).on('beforeunload', function() {
    localStorage.setItem('ver_item', $("#ver_item").val());
    localStorage.setItem('role', $("#role").val());
    localStorage.setItem('content', $("#content").val());
    localStorage.setItem('city', $("#city").val());
    localStorage.setItem('area', $("#areas").val());
});
window.onload = function() {
    var old_item = localStorage.getItem('ver_item');
    var old_role = localStorage.getItem('role');
    var old_content = localStorage.getItem('content');
    var old_city = localStorage.getItem('city');
    var old_area = localStorage.getItem('area');
    var languages = localStorage.getItem('language');
    if (languages != null) {
        $('#language').val(languages);
        chg_lan(languages);
    }
    if (old_item && old_role && old_content && old_city && old_area) {
        $('#ver_item').val(old_item);
        $('#role').val(old_role);
        $('#content').val(old_content);
        $('#content').trigger("change");
        $('#city').val(old_city);
        $("#city").trigger("change");
        $('#areas').val(old_area);
        if (!var_update) {
            $("#search").trigger("click");
        }
    }
}

$('#content').on('change', function() {
    var val = this.value;
    if (val == 'group') {
        $('#role').prev().hide();
        $('#role').hide();
        $('#areas').hide();
        $('#city').prev().hide();
        $('#city').hide();
    } else {
        $('#role').prev().show();
        $('#role').show();
        $('#areas').show();
        $('#city').prev().show();
        $('#city').show();
    }
});

$('#search').click(function() {
    var_update = true;
    ver_item = $('#ver_item').val();
    role = $('#role').val();
    content = $('#content').val();
    citys = $('#city').val();
    areas = $('#areas').val();
    if ((ver_item && role && content) || content == 'group') {
        var urls = '../ajax_verification';
        data = {
            ver_item: ver_item,
            role: role,
            content: content,
            citys: citys,
            area: 　areas
        }
        $('#loading').show();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                $('#loading').hide();
                console.log(data);
                $('.content_detail').empty();
                var counts = 0;
                var roles = { 'user': '玩家', 'docent': '解說員', 'expert': '專家' };
                if (content == "poi") {
                    counts = data.all_poi.length;
                    if (counts != 0) {
                        $('.content_detail').append('<h5>共:' + counts + '筆' + roles[role] + '景點</h5>');
                        for (var i = 0; i < counts; i++) {
                            $('.content_detail').append(
                                '<table class="table table-hover" id="deh' + data.all_poi[i].poi_id + '"\
                            style="margin-bottom:0px;"><th><a style="font-size:15px;" href="/' + COINAME + '/poi_detail/' + data.all_poi[i].poi_id + '">' + data.all_poi[i].poi_title + '</a>\
                            <button class="btn btn-success" style="float:right" onclick="Verify(\'' + content + '\',' + data.all_poi[i].poi_id + ',1)">驗證通過</button>\
                            <button class="btn btn-danger" style="float:right" data-toggle="modal" data-target="#exampleModalCenter" onclick="auto_fill_in(\'' + content + '\',' + data.all_poi[i].poi_id + ',-1)">驗證不通過</button></th></table>'
                            );
                        }
                    } else {
                        $('.content_detail').append('<h5>共:' + counts + '筆' + role + '景點</h5>');
                    }
                } else if (content == "loi") {
                    counts = data.all_loi.length;
                    if (counts != 0) {
                        $('.content_detail').append('<h5>共:' + counts + '筆' + role + '景線</h5>');
                        for (var i = 0; i < counts; i++) {
                            $('.content_detail').append(
                                '<table class="table table-hover" id="deh' + data.all_loi[i].route_id + '"\
                            style="margin-bottom:0px;"><th><a style="font-size:15px;" href="/' + COINAME + '/loi_detail/' + data.all_loi[i].route_id + '">' + data.all_loi[i].route_title + '</a>\
                            <button class="btn btn-success" style="float:right" onclick="Verify(\'' + content + '\',' + data.all_loi[i].route_id + ',1)">驗證通過</button>\
                            <button class="btn btn-danger" style="float:right" data-toggle="modal" data-target="#exampleModalCenter" onclick="auto_fill_in(\'' + content + '\',' + data.all_loi[i].route_id + ',-1)">驗證不通過</button></th></table>'
                            );
                        }
                    } else {
                        $('.content_detail').append('<h5>共:' + counts + '筆' + role + '景線</h5>');
                    }
                } else if (content == "aoi") {
                    counts = data.all_aoi.length;
                    if (counts != 0) {
                        $('.content_detail').append('<h5>共:' + counts + '筆' + role + '景區</h5>');
                        for (var i = 0; i < counts; i++) {
                            $('.content_detail').append(
                                '<table class="table table-hover" id="deh' + data.all_aoi[i].aoi_id + '"\
                            style="margin-bottom:0px;"><th><a style="font-size:15px;" href="/'+ COINAME + '/aoi_detail/' + data.all_aoi[i].aoi_id + '">' + data.all_aoi[i].title + '</a>\
                            <button class="btn btn-success" style="float:right" onclick="Verify(\'' + content + '\',' + data.all_aoi[i].aoi_id + ',1)">驗證通過</button>\
                            <button class="btn btn-danger" style="float:right" data-toggle="modal" data-target="#exampleModalCenter" onclick="auto_fill_in(\'' + content + '\',' + data.all_aoi[i].aoi_id + ',-1)">驗證不通過</button></th></table>'
                            );
                        }
                    } else {
                        $('.content_detail').append('<h5>共:' + counts + '筆' + role + '景區</h5>');
                    }
                } else if (content == "soi") {
                    counts = data.all_soi.length;
                    if (counts != 0) {
                        $('.content_detail').append('<h5>共:' + counts + '筆' + role + '主題故事</h5>');
                        for (var i = 0; i < counts; i++) {
                            $('.content_detail').append(
                                '<table class="table table-hover" id="deh' + data.all_soi[i].soi_id + '"\
                            style="margin-bottom:0px;"><th><a style="font-size:15px;" href="/' + COINAME + '/soi_detail/' + data.all_soi[i].soi_id + '">' + data.all_soi[i].soi_title + '</a>\
                            <button class="btn btn-success" style="float:right" onclick="Verify(\'' + content + '\',' + data.all_soi[i].soi_id + ',1)">驗證通過</button>\
                            <button class="btn btn-danger" style="float:right" data-toggle="modal" data-target="#exampleModalCenter" onclick="auto_fill_in(\'' + content + '\',' + data.all_soi[i].soi_id + ',-1)">驗證不通過</button></th></table>'
                            );
                        }
                    } else {
                        $('.content_detail').append('<h5>共:' + counts + '筆' + role + '主題故事</h5>');
                    }
                } else if (content == "group") {
                    counts = data.all_group.length;
                    if (counts != 0) {
                        $('.content_detail').append('<h5>共:' + counts + '筆群組</h5>');
                        for (var i = 0; i < counts; i++) {
                            $('.content_detail').append(
                                '<table class="table table-hover" id="deh' + data.all_group[i].group_id + '"\
                            style="margin-bottom:0px;"><th><a style="font-size:15px;" href="/' + COINAME + '/list_groups">' + data.all_group[i].group_name + '</a>\
                            <button class="btn btn-success" style="float:right" onclick="Verify(\'' + content + '\',' + data.all_group[i].group_id + ',1)">驗證通過</button>\
                            <button class="btn btn-danger" style="float:right" onclick="Verify(\'' + content + '\',' + data.all_group[i].group_id + ',-1)">驗證不通過</button></th></table>'
                            );
                        }
                    } else {
                        $('.content_detail').append('<h5>共:' + counts + '筆群組</h5>');
                    }
                }
            },
            error: function(data) {
                console.log(data);
                $('#loading').hide();
            }
        });
    } else {
        alert('尚有未選擇項目')
    }
});

function Verify(content, id, verification) {
    var urls = '/coi_verification';
    var cfm = confirm("確定驗證?");
    if (cfm == true) {
        data = {
            types: content,
            id: id,
            verification: verification,
            coi: COINAME
        }
        console.log(data);
        $('#loading').show();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                if (data == 'Fail') {
                    alert("LOI/AOI/SOI 內尚有POI未驗證");
                } else {
                    $('#deh' + id).fadeOut();
                }
                $('#loading').hide();
            },
            error: function(data) {
                console.log(data);
                $('#loading').hide();
            }
        });
    }
}
function auto_fill_in(content, id, verification){
    document.getElementById("modal-content").value = content;
    document.getElementById("modal-id").value = id;
    document.getElementById("modal-verification").value = verification;
}
function ModalVerify() {
    var urls = '/coi_verification';
    var cfm = confirm("確定驗證?");
    var content = document.getElementById("modal-content").value;
    var id = document.getElementById("modal-id").value;
    var verification = document.getElementById("modal-verification").value;

    var feedback_mes = $("#modal-feedback").val();

    console.log(verification);
    if (cfm == true) {
        data = {
            types: content,  // coi/loi/poi
            id: id,
            verification: verification,
            coi: COINAME,
            feedback_mes:feedback_mes
        }
        console.log(data);
        $('#loading').show();
        $.ajax({
            method: "POST",
            data: data,
            url: urls,
            success: function(data) {
                if (data == 'Fail') {
                    alert("LOI/AOI/SOI 內尚有POI未驗證");
                } else {
                    $('#deh' + id).fadeOut();
                }
                $('#loading').hide();
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
    var urls = "../../feed_area";
    var data = {
        city: city
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            var area_count = data.area.length;
            console.log(data);
            var area_select = $('#areas').empty();
            area_select.append('<option selected disabled hidden>請選擇</option>');
            area_select.append('<option vlaue="all" class="all">全部</option>');
            for (var i = 0; i < area_count; i++) {
                area_select.append(
                    $('<option></option>').val(data.area[i].area_name_en).html(data.area[i].area_name_ch)
                );
            }
        },
        error: function(data) {
            console.log('data error');
        }
    });
});
