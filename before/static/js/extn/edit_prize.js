finalFiles = []; //多媒體檔案(圖)

/*
$(window).on('beforeunload', function () {
    localStorage.setItem('prize_title', $('#prize_title').val());
    localStorage.setItem('prize_num', $('#prize_num').val());
    localStorage.setItem('prize_description', $('#prize_description').val());
    localStorage.setItem('poi_source', $('#poi_source').val());
});
window.onload = function () {
    var prize_title = localStorage.getItem('prize_title');
    if (prize_title != null) $('#prize_title').val(prize_title);
    var prize_num = localStorage.getItem('prize_num');
    if (prize_num != null) $('#prize_num').val(prize_num);
    var description = localStorage.getItem('prize_description');
    if (description != null) $('#prize_description').val(description);
}
*/
$(document).ready(function () {
    image_count = 1
    //$('#poi_msg').modal('show');
    //$('.upload_nothing').append('<input class="sound_val" name="sounds" value="0" hidden>');
    /*if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('Great success! All the File APIs are supported.')
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }*/
    var restrict = $('#img_restrict').empty();
    var upload_none = $('.upload_none').empty();
    var upload_image = $('.upload_image').empty();
    if (document.getElementById('language').value == "chinese") {
        restrict.html('允許上傳gif/jpg/png/jpeg格式的圖片，圖片檔案大小不能超過2M');
    } else if (document.getElementById('language').value == "english") {
        restrict.html("Image format of gif/jpg/png is allowed to upload, and the capacity over 2 MB will be compressed.");
    } else if (document.getElementById('language').value == "japanese") {
        restrict.html('アップロードするgif/jpg/png形式のフォトの、最大ファイル容量は2MBまでです');
    }
    //upload_image.append('<input class="media_val" name="media" value="1" hidden>');
    upload_image.append('<input type="file" name="image_file" accept=".gif,.jpg,.png,.jpeg" id="image_file">');
    //upload_image.append('<output id="image_list">');
    var el = document.getElementById('image_file');
    if (el) {
        el.addEventListener('change', handleFileSelect, false);
    }
    $('#clear').click(function () {
        $('input[type=radio][name=media]').value == 'none';
        //$('input[type=radio][name=sounds]').value == 'none';
        //var upload_none = $('.upload_none').empty();
        //var upload_image = $('.upload_image').empty();
        //var upload_video = $('.upload_video').empty();
        //var upload_audio = $('.upload_audio').empty();
        //var upload_none = $('.upload_nothing').empty();
        //var upload_audio = $('.upload_sound').empty();
    });
    $('#image_file').change(function(evt){
        if(image_count = 1){
          handleFileSelect(evt);
        }
        else{
          alert('圖片檔只能上傳一張,如要繼續上傳請先刪除就圖片');
          $('#image_file').val('');
        }
    });
    $('#make_prizeform').submit((event) => { SubmitForm(event) });
    /*$('input[name=media]').change(function () {
        var restrict = $('#restrict').empty();
        $('.alert-danger').hide();
        var upload_none = $('.upload_none').empty();
        var upload_image = $('.upload_image').empty();
        //var upload_video = $('.upload_video').empty();
        //var upload_audio = $('.upload_audio').empty();
            if (document.getElementById('language').value == "chinese") {
                restrict.html('允許上傳gif/jpg/png/jpeg格式的圖片，圖片檔案大小不能超過2M');
            } else if (document.getElementById('language').value == "english") {
                restrict.html("Image format of gif/jpg/png is allowed to upload, and the capacity over 2 MB will be compressed.");
            } else if (document.getElementById('language').value == "japanese") {
                restrict.html('アップロードするgif/jpg/png形式のフォトの、最大ファイル容量は2MBまでです');
            }
            upload_image.append('<input class="media_val" name="media" value="1" hidden>');
            upload_image.append('<input type="file" name="image_file" accept=".gif,.jpg,.png,.jpeg" id="image_file">');
            upload_image.append('<output id="image_list">');
            var el = document.getElementById('image_file');
            if (el) {
                el.addEventListener('change', handleFileSelect, false);
            }
        
    });*/
});

function handleFileSelect(evt) {
    $('.alert-danger').hide();
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    var files = evt.target.files; // FileList object
    $.each(this.files, function (idx, elm) {
        finalFiles[idx] = elm;
    });
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        if (image_count < 2) { //1張限制
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    limit_size = theFile.size / 1048576;
                    var image = new Image();

                    //create new image and coupute the ratio to compress
                    var ratio = 1 / Math.pow(limit_size, 0.5);
                    var canvas = document.createElement("canvas");
                    var datatype = e.target.result.split(',')[0].split(':')[1].split(';')[0];

                    //when image load complete , use canvas to resize image
                    image.onload = function () {
                        var ctx = canvas.getContext("2d");
                        EXIF.getData(image, function () {
                            var orientation = EXIF.getTag(image, 'Orientation');
                            switch (orientation) {
                                case 6:
                                    canvas.width = image.height;
                                    canvas.height = image.width;
                                    if (limit_size > 2) {
                                        canvas.width = canvas.width * ratio;
                                        canvas.height = canvas.height * ratio;
                                    }
                                    var x = canvas.width / 2;
                                    var y = canvas.height / 2;
                                    ctx.rotate(90 * Math.PI / 180);
                                    ctx.translate(0, -x * 2)
                                    break;
                                default:
                                    if (limit_size > 2) {
                                        canvas.width = image.width * ratio;
                                        canvas.height = image.height * ratio;
                                    }
                                    else {
                                        canvas.width = image.width;
                                        canvas.height = image.height;
                                    }
                            }
                        });
                        if (limit_size > 2) {
                            ctx.scale(ratio, ratio);
                        }
                        ctx.drawImage(image, 0, 0);
                        NewImageInsert(canvas.toDataURL(datatype), 205 * canvas.height / canvas.width);
                    };
                    image.src = e.target.result;
                    //create the new span contains image in output
                    function NewImageInsert(dataURL, height) {
                        var img = document.getElementById('prize_image')
                        img.src = dataURL
                        img.style.height = height
                        /*
                        var span = document.createElement('span');
                        span.className = "imgspan";
                        span.innerHTML = ['<img id="thumb' + theFile.name + '" name="thumb" style="height: ' + height + 'px;width: 205px; margin: 10px 5px 0 0;" src="', dataURL,
                            '" title="', escape(theFile.name), '"/> \
                      <button type="button" style="display: block;width: 205px;background: #4bafa9; color: white; text-align:center; \
                      cursor: pointer;" id="remove' + theFile.name + '" onclick="rmvImg(this,\'thumb' + theFile.name + '\')">刪除圖片</button>'  //刪除圖片
                        ].join('');
                        document.getElementById('image_list').insertBefore(span, null);
                        */
                    }
                };
            })(f);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
            //image_count++;
        } else {
            alert('僅能上傳一張圖片');
            break;
        }
    }
    //Clear the input files number display.
    //$('#image_file').val('');
}
/*
function handleVideo(evt) {
    reader = new FileReader();
    files = evt.target.files;
    file = files[0];
    reader.onload = function (evt) {
        $('#disp_video').attr("src", evt.target.result);
    }
    reader.readAsDataURL(file);
    image_count++;
}

function handleAudio(evt) {
    reader = new FileReader();
    files = evt.target.files;
    file = files[0];
    reader.onload = function (evt) {
        $('#disp_audio').attr("src", evt.target.result);
    }
    reader.readAsDataURL(file);
    image_count++;
}
*/

function rmvImg(element, name) {
    $(element).parent().remove();
    image_count--;
}

function prize_form() {
    var urls = POI_URL;
    var prize_id = $('#prize_id').val();
    var prize_title = $('#prize_title').val();
    var prize_num = $('#prize_num').val();
    var prize_description = $('#prize_description').val();
    var isPublic =  $("[name='isPublic']:checked").val() ;
    var languages = $('#language').val();
    console.log(open);

    
    var data = new FormData();
    data.append("prize_id",prize_id)
    data.append("prize_title",prize_title)
    data.append("prize_num",prize_num)
    data.append("prize_description",prize_description)
    data.append("isPublic",isPublic)
    data.append("csrfmiddlewaretoken", $('input[name=csrfmiddlewaretoken]').val())
    
    if (finalFiles.length != 0){
        data.append("file",finalFiles[0])
    }
    

    if (prize_title == "") {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") { 
            $('.alert-danger').append("<p>獎品名稱尚未填寫</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Title not yet filled in</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>まだ記入されていないタイトル</p>");
        }
        document.getElementById("prize_title").style.border = "solid 1px #F00 ";
     }else if(prize_num == ""){
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>獎品數量尚未填寫</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Prize number not yet filled in</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>まだ記入されていないタイトル</p>");
        }
        document.getElementById("prize_num").style.border = "solid 1px #F00 ";
     }
     else if (prize_description == "") {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>描述尚未填寫</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Description not yet filled in</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>説明はまだ記入されていません</p>");
        }
        document.getElementById("prize_description").style.border = "solid 1px #F00 ";
    } else if (image_count == 0) {
        let media_choose = $('input[type=radio][name=media]:checked').val();
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (media_choose == 'image') {
            $('.alert-danger').append("<p>尚未上傳圖片</p>");
        } else if (media_choose == 'video') {
            $('.alert-danger').append("<p>尚未上傳影片</p>");
        } else if (media_choose == 'audio') {
            $('.alert-danger').append("<p>尚未上傳聲音</p>");
        } else {
            $('.alert-danger').append("<p>尚未選擇多媒體</p>");
        }
    }
    else {
        $('.alert-danger').empty();
        $('#loading').show();
        $('.submit_prizeform').prop('disabled', true);
        $('btn_confirm').parent().unbind();
        $.ajax({
            method: "POST",
            url: urls,
            data: data,
            contentType:false,
            processData:false,

            success: function (data) {
                //poi_mpeg(data.media);  
                $('.alert-success').show();
                $('.alert-success').append(escape('<p>更新成功!</p>'));
                window.location = HOME_URL;
                
                // $('#loading').hide();
            },
            error: function (data) {
                console.log(data);
                console.log(XMLHttpRequest);
                console.log("who am I,where am I");
                $('btn_confirm').parent().bind('click');
            }
        });
        
    }

}
/*
function poi_mpeg(format) {
    var urls = "ajax_prize"; 
    var data = new FormData($('#make_prizeform').get(0));
    var format = parseInt(format);
    var media_val = 1;
    if (media_val == 1) {
        //search every uploaded image and append in formdata
        $("img[name = thumb]").each(function () {
            var dataurl = $(this).attr("src");
            var byteString;
            if (dataurl.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataurl.split(',')[1]);
            else
                byteString = unescape(dataurl.split(',')[1]);

            // separate out the mime component
            var mimeString = dataurl.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            var blob = new Blob([ia], { type: mimeString });
            data.append("image_file_modified", blob, $(this).attr("id"));
        });
    }
    $('.alert-danger').empty();
    $('#loading').show();
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        processData: false,
        contentType: false,
        success: function (data) {
            $('#loading').hide();
            $('.alert-success').show();
            $('.alert-success').append('<p>多媒體上傳成功!</p>');
            window.location = HOME_URL;
        },
        error: function (data) {
           console.log(data);
        },
    });
}
*/

function SubmitForm(event) {
    event.preventDefault();
    prize_form();
}


/*
function CheckStrIn(city, area, address) {
    var languages = $('.lang-1').val();
    if (languages == 'chinese' || languages == 'japanese') {
        city = city.replace(/臺/g, "台");
        area = area.replace(/臺/g, "台");
        address = address.replace(/臺/g, "台");
    } else {
        city = city.toLowerCase();
        area = area.toLowerCase();
        address = address.toLowerCase();
    }
    if (city == "其他國家及地區" || city == "南海諸島") {
        if (area.length > address) {
            chk_city = 1;
            chk_area = area.indexOf(address);
        } else {
            chk_city = 1;
            chk_area = address.indexOf(area);
        }
    } else {
        if (city.length > address || area.length > address) {
            chk_city = city.indexOf(address);
            chk_area = area.indexOf(address);
        } else {
            chk_city = address.indexOf(city);
            chk_area = address.indexOf(area);
        }
    }
    if (chk_city != -1 && chk_area != -1) {
        return true;
    } else {
        return false;
    }
}

$('#clear').on('click', function () {
    image_count = 0;
});
*/

$('.selectPublic').on('click', event => {
    $('#open').val(event.target.value);
});