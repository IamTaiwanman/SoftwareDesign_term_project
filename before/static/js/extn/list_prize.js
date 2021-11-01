var is_edit = false;

function buttonLink(linkUrl){
    window.location = linkUrl;
}

function delete_prize(Pid, is_allocated) {
    if(is_allocated != 0){
        alert('尚有獎品未發出喔!!');
    }
    else{
        var del = confirm("確定刪除?");
        if (del == true) {
            $('#loading').show();
            Pid = '/' + Pid;
            window.location = '/extn/list_prize' + Pid;
        }
    }
    
}



function edit_prize(Pid) {
    Pid = '/' + Pid;
    window.location = '/extn/edit_player' + Pid;
}



