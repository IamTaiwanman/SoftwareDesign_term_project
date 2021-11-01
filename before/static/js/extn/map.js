const AJAX_URL = '/' + COINAME + '/ajax_area';
const DATA_DICT = {
    'poiid':'poi_id',
    'poititle':'poi_title',
    'loiid': 'route_id',
    'loititle': 'route_title',
    'aoiid': 'aoi_id',
    'aoititle': 'title',
    'soiid': 'soi_id',
    'soititle': 'soi_title',
};
let is_edit = false;

$(document).ready(function (){
    $(window).on('beforeunload', () => { setLocalStorage() });
    $('#map_role').change(() => { ajaxUpdate() });
    $('#content').change(() => { contentTitle($('#content').val()) });
    $('#city').change(() => { cityChange($('#city').val()) });
    $('#areas').change(() => { ajaxUpdate() });
    $('#topic').change(() => { ajaxUpdate()});
    $('#type').change(() => { ajaxUpdate() });
    $('#category').change(() => { ajaxUpdate() });
    $('#medias').change(() => { ajaxUpdate() });

    initialValue();
});

function initialValue(){
    $('#map_role').val(localStorage.getItem('map_role') || 'user');
    $('#content').val(localStorage.getItem('content') || 's_poi');
    $('#city').val(localStorage.getItem('city') || '臺南市');
    $('#topic').val(localStorage.getItem('topic') || 'all');
    $('#type').val(localStorage.getItem('type') || 'all');
    $('#category').val(localStorage.getItem('category') || 'all');
    $('#medias').val(localStorage.getItem('medias') || 'all');
    $("#city").trigger("change");
}

function setLocalStorage(){
    localStorage.setItem('map_role', $('#map_role').val());
    localStorage.setItem('content', $('#content').val());
    localStorage.setItem('city', $('#city').val());
    localStorage.setItem('topic', $('#topic').val());
    localStorage.setItem('type', $('#type').val());
    localStorage.setItem('category', $('#category').val());
    localStorage.setItem('medias', $('#medias').val());
}

function contentTitle(xoiType){
    xoiType = xoiType.slice(2,5);
    if(xoiType == 'poi'){
        $('#topic').fadeIn();
        $('#type').fadeIn();
        $('#category').fadeIn();
        $('#medias').fadeIn();
    } else {
        $('#topic').hide();
        $('#type').hide();
        $('#category').hide();
        $('#medias').hide();
    }

    $('#poi_show').hide();
    $('#loi_show').hide();
    $('#aoi_show').hide();
    $('#soi_show').hide();
    $('#' + xoiType + '_show').show();

    ajaxUpdate();
}

function cityChange(city_val){
    let data = {
        city: city_val
    };
    $.ajax({
        method: 'POST',
        data: data,
        url: '/feed_area',

        success: function (data){
            let area_select = $('#areas').empty();
            area_select.append('<option value="全部" class="all">全部</option>');
            for(let i = 0; i < data.area.length; ++i){
                area_select.append(
                    $('<option></option>').val(data.area[i].area_name_en).html(data.area[i].area_name_ch)
                );
            }
            area_select.val('全部');
            area_select.trigger('change');
        },

        error: function (data){
            console.log(data);
        }
    });
}

function ajaxUpdate(){
    let data = getFilterData();
    let contentType = data['contents'].slice(2,5);
    $.ajax({
        method: 'POST',
        data: data,
        url: AJAX_URL,

        success: function (data){
            let count = data['all_' + contentType].length;
            appendList(contentType, data, count);
        },

        error: function (data){
            console.log(data);
        },
    });
}

function getFilterData(){
    let data = {
        contents: $('#content').val(),
        map_role: $('#map_role').val(),
        citys: $('#city').val(),
        areas: $('#areas').val(),
        topic: $('#topic').val(),
        type: $('#type').val(),
        category: $('#category').val(),
        media: $('#medias').val(),
    };
    return data
}

function appendList(contentType, data, count){
    let xoiTable = $('#' + contentType + '_table').empty();
    xoiTable.append('<h5>共:' + count + '筆</h5>');
    if (count > 0){
        let dataList = data['all_' + contentType];
        for (let i = 0; i < count; ++i) {
            let insertRow = $('<tr></tr>').append($('<a></a>', {
                'style': "font-size:15px;",
                'href': '/' + COINAME + '/' + contentType + '_detail/' + dataList[i][DATA_DICT[contentType + 'id']],
                'text': dataList[i][DATA_DICT[contentType + 'title']],
            }));
            insertRow.appendTo(xoiTable);
        }
    }
}