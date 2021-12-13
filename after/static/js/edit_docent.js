is_edit = false;
$(document).ready(function() {
    $('#edit_docent').submit(function(e) {
        e.preventDefault();
        docent_edit();
    });
});

function docent_edit(){
	var urls = "../ajax_docentinfo";
    var data = new FormData($('form').get(1));
    $('#loading').show();
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        processData: false,
        contentType: false,
        success: function(data) {
        	if(data == '1'){
        		$('.alert-danger').show();
            	$('.alert-danger').append('<p>未選擇導覽語言!</p>');
        	}else if(data == '0'){
        		$('.alert-danger').show();
            	$('.alert-danger').append('<p>未填寫姓名!</p>');
        	}else{
        	$('#loading').hide();
            $('.alert-success').show();
            $('.alert-success').append('<p>更改成功!</p>');
            window.location = '/userinfo';
        	}

        },
        error: function(data) {
            console.log(data);
            $('.alert-danger').show();
            $('.alert-danger').append('<p>更改失敗!</p>');
        },
    });
}