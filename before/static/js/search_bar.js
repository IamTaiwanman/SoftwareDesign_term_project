$(document).ready(function(){
    is_edit = false;
    $('#advance-search').on('click' , function (e) {
    e.preventDefault();
    if ($('.well').attr("style") != undefined){
        $('.well').removeAttr("style");
        $(this).attr('class' , 'btn btn-success');
        $(this).children().attr('class' , 'glyphicon glyphicon-pencil');
    }
    else{
        $('.well').attr('style' , 'display:none');
        $(this).attr('class' , 'btn btn-warning');
        $(this).children().attr('class' , 'glyphicon  glyphicon-hand-up');
    }
    });

    $('select[name = "city"]').on('change' , function () {
        var city_name = $(this).val();
        $(this).siblings('select').each(function (i , item) {
            if($(this).attr('style') == undefined){
                $(this).attr('style' , 'display:none');
                $(this).attr('disabled' , '');
            }
            if($(this).attr('id') == city_name){
                $(this).removeAttr('style');
                $(this).removeAttr('disabled');
            }
        });
    });

    $('#srch_term_advance').keypress(function (event){        
         if (event.which == 13){
             event.preventDefault();
             $("#advance_srch_submit").trigger("click");
         }
     });
});
function modifyInput(){
        document.getElementById("srch_term_advance").value = document.getElementById("srch_term_advance").value.replaceAll("'","");
        document.getElementById("srch_term_advance").value = document.getElementById("srch_term_advance").value.replaceAll('"',"");
    }
