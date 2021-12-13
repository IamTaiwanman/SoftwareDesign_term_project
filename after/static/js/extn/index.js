$(document).ready(function() {
    $('.check_login').hide();
});

$('.make').click(function(e) {
    var role = $('.role').text();
    if (role == '(玩家)' || '(User)') {
        $('.check_login').hide();
        window.location = '/make_player';
    } else if (role == '(專家)' || '(Expert)') {
        $('.check_login').hide();
        window.location = 'http://deh.csie.ncku.edu.tw/moe2/main.php';
    } else if (role == '(導覽員)' || '(Narrator)') {
        $('.check_login').hide();
        window.location = '/make_navi';
    } else {
        e.preventDefault();
        $('.check_login').show();
        //window.location = '/login';
    }
});
