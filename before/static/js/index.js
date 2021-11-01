$(document).ready(function() {
    $('.android-app-1').hide();
    $('.ios-app-1').hide();
    $('.handout-1').hide();
    $('.intro_video-1').hide();
    $('#sel_option').hide();
    $('.check_login').hide();


    $('.android-1').click(function() {
        $('.android-app-1').toggle();
    });
    $('.apple-1').click(function() {
        $('.ios-app-1').toggle();
    });
    $('#handout-2').click(function() {
        $('.handout-1').toggle();
    });
    $('#intro_video-2').click(function() {
        $('.intro_video-1').toggle();
    });
    $('#go_browse').click(function() {
        $('#sel_option').toggle();
    });
});

$('.make').click(function(e) {
    var role = $('.role').text();
    if (role == '(玩家)' || role == '(User)' || role == '(ユーザー)') {
        $('.check_login').hide();
        window.location = '/make_player';
    } else if (role == '(專家)' || role == '(Expert)' || role == '(エキスパート)') {
        $('.check_login').hide();
        window.location = '/make_player';
    } else if (role == '(導覽員)' || role == '(Narrator)' || role == '(ガイド)') {
        $('.check_login').hide();
        window.location = '/make_navi';
    } else if (role == '(Admin)'){
        $('.check_login').hide();
        window.location = '/make_player';
    } else if (role == '(驗證者)' || role =='(Verifier)' || role == '(認定者)'){
        $('.check_login').hide();
        window.location = '/make_player';
    } else if (role == null) {
        $('.check_login').show();
    } else {
        e.preventDefault();
        $('.check_login').show();
    }
});
$('#searchGrade').click(function(e) {
    var searchGameID = document.getElementById('searchGameID').value;
    window.location = '/searchGrade/'+searchGameID;
});
document.querySelector('#searchGameID').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        var searchGameID = document.getElementById('searchGameID').value;
        window.location = '/searchGrade/'+searchGameID;
    }
});