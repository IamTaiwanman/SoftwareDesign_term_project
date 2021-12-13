$(document).ready(function(){
    $('#list_poi').click(() => { hiddenDiv('#list_poi_show') });
    $('#list_loi').click(() => { hiddenDiv('#list_loi_show') });
    $('#list_aoi').click(() => { hiddenDiv('#list_aoi_show') });
    $('#list_soi').click(() => { hiddenDiv('#list_soi_show') });

    $('#make_poi').click(() => { buttonlink('make_poi') });
    $('#make_loi').click(() => { buttonlink('make_loi') });
    $('#make_aoi').click(() => { buttonlink('make_aoi') });
    $('#make_soi').click(() => { buttonlink('make_soi') });

    $('#GroupModal').on('show.bs.modal', function (e) { setModalVal(e) });
});

function hiddenDiv(divId){
    $('#list_poi_show').attr('hidden', 1);
    $('#list_loi_show').attr('hidden', 1);
    $('#list_aoi_show').attr('hidden', 1);
    $('#list_soi_show').attr('hidden', 1);
    xoiShow(divId);
}

function xoiShow(divId) {
    $(divId).removeAttr('hidden');
}

function deleteXoi(xoiId, xoi){
    let del = confirm('確定刪除?');
    const URL = '/' + COINAME + '/delete_xoi_coi/' + xoiId + xoi;
    if(del == true){
        $('#loading').show();
        $.ajax({
            method:'GET',
            url:URL,

            success:function (response){
                $('#loading').hide();
                if(response == 1){
                    alert('success');
                }  else {
                    alert('fail');
                }
                window.location = '/' + COINAME + '/make_player';
            },

            error:function(response){
                $('#loading').hide();
                alert('fail');
                window.location = '/' + COINAME + '/make_player';
            }
        });
    }
}

function setModalVal(e){
    let type_id = $(e.relatedTarget).data('typeid');
    let type = $(e.relatedTarget).data('type');
    $('#all_ids').val(type_id);
    $('#all_types').val(type);
}

function putGroups(){
    const GROUP_URL = '/' + COINAME + '/ajax_invite';
    let groupId = $('#group_list').val();
    let pointId = $('#all_ids').val();
    let pointType = $('#all_types').val();
    let data = {
        action: 'put_interest',
        types: pointType,
        type_id: pointId,
        group_id: groupId
    };

    if(groupId != '' && pointId != '' && pointType != ''){
        $('#loading').show();
        $.ajax({
            method: 'POST',
            url: GROUP_URL,
            data: data,

            success: function(data){
                if(data == "success"){
                    alert('此' + pointType + '已放入群組');
                } else {
                    alert('此' + pointType + '已經存在群組內!');
                }
                $('#GroupModal').modal('hide');
                $('#loading').hide();
            },

            error: function(){
                alert('無此群組');
                $('#loading').hide();
            }
        });
    } else {
        alert('錯誤');
    }
}

function editXoi(xoiId, xoi){
    window.location = '/' + COINAME + '/edit_player/' + xoiId + xoi;
}

function buttonlink(url){
    window.location = '/' + COINAME + '/' + url;
}

$('#exp_poi').click(function() {
    $("#exl_poi").table2csv( 'download', {
        filename: "踏溯台南景點檔案.csv"
    });
});
$('#exp_loi').click(function() {
    $("#exl_loi").table2csv( 'download', {
        filename: "踏溯台南景線檔案.csv"
    });
});
$('#exp_aoi').click(function() {
    $("#exl_aoi").table2csv( 'download', {
        filename: "踏溯台南景區檔案.csv"
    });
});
$('#exp_soi').click(function() {
    $("#exl_soi").table2csv( 'download', {
        filename: "踏溯台南主題故事檔案.csv"
    });
});