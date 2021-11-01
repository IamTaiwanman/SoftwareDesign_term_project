var is_edit = false;

$(document).ready(function() {
    if(!navigator.cookieEnabled) {
        $('.login').css('display','none');
        $('.cookie').css('display','block');
    }
});
