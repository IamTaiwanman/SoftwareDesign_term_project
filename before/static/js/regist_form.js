$(document).ready(function() {
    $('#id_role').val('user');
    $('#id_role > option[value = ""]').remove();

    if (coi != '') {
        $('#id_role > option[value = "user"]').text("學生");        
    }
});