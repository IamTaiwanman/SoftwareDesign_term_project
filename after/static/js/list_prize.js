var is_edit = false;

function buttonLink(linkUrl){
    window.location = linkUrl;
}

function delete_prize(Pid, is_allocated) {
    if(is_allocated == 0){
        alert('此獎品已分配，無法刪除！');
    }
    else{
        var del = confirm("確定刪除?");
        $('#loading').show();
        Pid = '/' + Pid;
        window.location = '/list_prize' + Pid;
    }
}

function edit_prize(Pid) {
    Pid = '/' + Pid;
    window.location = '/edit_player' + Pid;
}
