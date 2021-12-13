is_edit = false;


$(document).ready(function() {
    $('#get_pwd').submit(function(e) {
        e.preventDefault();
        pwd_find();
    });
});


function pwd_find(){
    var urls = "../ajax_findpwd";
    var account = $('#account').val();
    var email = $('#email').val();
    var languages = $('#language').val();
    data = {
        account: account,
        email: email,
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function(data) {
            console.log(data)
            if(data == 'success' && languages == 'chinese'){
                alert('密碼已成功變更,請至您的信箱確認');
            }else if(data == 'fail' && languages == 'chinese'){
               alert('帳號與信箱不符合');
            }else if(data == 'profile' && languages == 'chinese'){
                alert('帳號不存在');
            }else if(data == 'success' && languages == 'english'){
                alert('Password has been changed, please go to your mailbox to confirm.');
            }else if(data == 'fail' && languages == 'english'){
               alert('The account does not match the mailbox.');
            }else if(data == 'profile' && languages == 'english'){
                alert('account does not exist.');
            }else if(data == 'success' && languages == 'japanese'){
                alert('パスワードが変更されました。あなたのメールボックスに確認してください');
            }else if(data == 'fail' && languages == 'japanese'){
               alert('アカウントがメールボックスと一致しません');
            }else if(data == 'profile' && languages == 'japanese'){
               alert('アカウントが存在しません');
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

