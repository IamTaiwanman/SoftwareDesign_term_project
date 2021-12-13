$('#searchGrade').click(function(){
	var searchGameID = $('#searchGameID').val();
	window.location = '/searchGrade/'+searchGameID;
});

function Export( url, filename ) {
    $('#loading').show();
    $.ajax({
        method: "GET",
        url: url,
        success: function(data) {
            if( data == "Error" ) {
                alert("Error");
            }
            else {
                $($.parseHTML(data)).table2csv( 'download', {
                    filename: filename
                });
            }
            $('#loading').hide();
        },
        error: function(data) {
            alert("Error");
            $('#loading').hide();
        }
    });
}