var is_edit = false;

function delete_poi(poi_id) {
    var del = confirm("確定刪除?");
    if (del == true) {
        $('#loading').show();
        poi = '/' + poi_id + '/poi';
        window.location = '/make_player' + poi;
    }
}

function delete_loi(loi_id) {
    var del = confirm("確定刪除?");
    if (del == true) {
        $('#loading').show();
        loi = '/' + loi_id + '/loi';
        window.location = '/make_player' + loi;
    }
}

function delete_aoi(aoi_id) {
    var del = confirm("確定刪除?");
    if (del == true) {
        $('#loading').show();
        aoi = '/' + aoi_id + '/aoi';
        window.location = '/make_player' + aoi;
    }
}

function delete_soi(soi_id) {
    var del = confirm("確定刪除?");
    if (del == true) {
        $('#loading').show();
        soi = '/' + soi_id + '/soi';
        window.location = '/make_player' + soi;
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

$('#GroupModal').on('show.bs.modal', function (e) { //assign value to modal
    var type_id = $(e.relatedTarget).data('typeid');
    var types = $(e.relatedTarget).data('type');
    $('#all_ids').val(type_id);
    $('#all_types').val(types);
});

$('#CoiModal').on('show.bs.modal', (event) => {
    let type_id = $(event.relatedTarget).data('typeid');
    let types = $(event.relatedTarget).data('type');
    let url = '/get_point_all_coi';

    $('#coi_list_ids').val(type_id);
    $('#coi_list_types').val(types);

    let data = {
        id: type_id,
        type: types,
    };

    $.ajax({
        method: 'POST',
        data: data,
        url: url,

        success: (data) => {
            $('.coi-list-item').each((index, element) => {
                let text = $(element).text().replace(/\s+/g, "");
                if (data.includes(text)) {
                    $(element).attr('check', 1);
                    $(element).val(2);
                    $(element).addClass('active');
                    $(element).html('<span class="glyphicon glyphicon-ok" aria-hidden="true" style="padding-right:5px"></span>' + text);
                } else {
                    $(element).attr('check', -1);
                    $(element).val(1);
                    $(element).removeClass('active');
                    $(element).html('<span class="glyphicon glyphicon-minus" aria-hidden="true" style="padding-right:5px"></span>' + text);
                }
            })
        },

        error: (data) => {
            console.log(data);
        },
    });
});


function PutGroups() {
    type_id = $('#all_ids').val();
    types = $('#all_types').val();
    group_id = $('#group_list').val()
    var urls = '/ajax_invite';
    data = {
        action: 'put_interest',
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
                if (data == 'success') {
                    alert('此' + types + '已放入群組');
                } else if (data == 'samepoint') {
                    alert('此' + types + '已經存在群組內!');
                }
                $('#GroupModal').modal('hide');
                $('#loading').hide();
            },
            error: function (data) {
                console.log(data)
                alert('無此群組');
                $('#loading').hide();
            }
        });
    } else {
        alert('發生錯誤!!');
    }
}

function exportList() {
    let addCoi = [];
    let removeCoi = [];

    $('.coi-list-item').each((index, element) => {
        let text = $(element).text().replace(/\s+/g, "");
        let value = $(element).val();
        if (value == '0') {
            addCoi.push(text);
        } else if (value == '3') {
            removeCoi.push(text);
        }
    });

    let url = '/export_single_point';
    let data = {
        add: JSON.stringify(addCoi),
        remove: JSON.stringify(removeCoi),
        id: $('#coi_list_ids').val(),
        type: $('#coi_list_types').val(),
    }

    if (addCoi.length > 0 || removeCoi.length > 0) {
        $('#loading').show();
        $.ajax({
            method: 'POST',
            url: url,
            data: data,

            success: (data) => {
                $('#CoiModal').modal('hide');
                $('#loading').hide();
            },

            error: (data) => {
                $('#CoiModal').modal('hide');
                $('#loading').hide();
            }
        });
    }
}

$('.coi-list-item').click((event) => {
    let val = parseInt($(event.target).val());
    let check = parseInt($(event.target).attr('check'));
    let text = $(event.target).text().replace(/\s+/g, "");

    $(event.target).val(val + check);
    $(event.target).attr('check', check * -1);

    if (val % 2 == 0) {
        $(event.target).removeClass('active');
        $(event.target).html('<span class="glyphicon glyphicon-minus" aria-hidden="true" style="padding-right:5px"></span>' + text);
    } else {
        $(event.target).addClass('active');
        $(event.target).html('<span class="glyphicon glyphicon-ok" aria-hidden="true" style="padding-right:5px"></span>' + text);
    }
});

$('#exp_poi').click(function() {
    $("#exl_poi").table2csv( 'download', {
        filename: "文史脈流景點檔案.csv"
    });
});
$('#exp_loi').click(function() {
    $("#exl_loi").table2csv( 'download', {
        filename: "文史脈流景線檔案.csv"
    });
});
$('#exp_aoi').click(function() {
    $("#exl_aoi").table2csv( 'download', {
        filename: "文史脈流景區檔案.csv"
    });
});
$('#exp_soi').click(function() {
    $("#exl_soi").table2csv( 'download', {
        filename: "文史脈流主題故事檔案.csv"
    });
});