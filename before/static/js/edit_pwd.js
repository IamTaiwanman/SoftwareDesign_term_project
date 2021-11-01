$(document).ready(function() {
    $('#edit_pwd').submit(function(e) {
        e.preventDefault();
        pwd_edit();
    });
});
function check() {
    var NewPWD = document.getElementById("NewPWD");
    if(NewPWD.value =="") {
        alert("新密碼不可為空")
        NewPWD.focus();
    }
    else{}
}
function pwd_edit() {
    var urls = "../ajax_pwd";
    var data = new FormData($('#edit_pwd').get(0));
    $('#loading').show();
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        processData: false,
        contentType: false,
        success: function(data) {
            $('#loading').hide();
            if (data == '0') {
                $('.alert-danger').show();
                $('.alert-danger').append('<p>原密碼錯誤!</p>');
            } else if (data == '1') {
                $('.alert-danger').show();
                $('.alert-danger').append('<p>輸入密碼不相同!</p>');
            } else if (data == '2'){
                $('.alert-danger').show();
                $('.alert-danger').append('<p>新的密碼為空!</p>');
            } else {
                $('.alert-success').show();
                $('.alert-success').append('<p>密碼變更成功!</p>');
                window.history.back();
            }
        },
        error: function(data) {
            console.log(data);
        },
    });
}
