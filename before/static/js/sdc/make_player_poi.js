image_count = 0; //多媒體
sound_count = 0; //語音導覽
finalFiles = []; //多媒體檔案(圖)
var is_edit = false;
$(window).on('beforeunload', function () {
    localStorage.setItem('poi_title', $('#poi_title').val());
    //localStorage.setItem('poi_subject', $('#subject').val());
    //localStorage.setItem('poi_type', $('#type1').val());
    localStorage.setItem('poi_keyword1', $('#keyword1').val());
    localStorage.setItem('poi_keyword2', $('#keyword2').val());
    localStorage.setItem('poi_keyword3', $('#keyword3').val());
    localStorage.setItem('poi_keyword4', $('#keyword4').val());
    localStorage.setItem('poi_address', $('#poi_address').val());
    localStorage.setItem('poi_latitude', $('#latitude').val());
    localStorage.setItem('poi_longitude', $('#longitude').val());
    localStorage.setItem('poi_description', $('#poi_description_1').val());
    localStorage.setItem('poi_format', $('#format').val());
    //localStorage.setItem('poi_source', $('#poi_source').val());
});

window.onload = function () {
    var title = localStorage.getItem('poi_title');
    if (title != null) $('#poi_title').val(title);
    /*var subject = localStorage.getItem('poi_subject');
    if (subject != null) $('#subject').val(subject);*/
    /*var type1 = localStorage.getItem('poi_type');
    if (type1 != null) $('#type1').val(type1);*/
    var keyword1 = localStorage.getItem('poi_keyword1');
    if (keyword1 != null) $('#keyword1').val(keyword1);
    var keyword2 = localStorage.getItem('poi_keyword2');
    if (keyword2 != null) $('#keyword2').val(keyword2);
    var keyword3 = localStorage.getItem('poi_keyword3');
    if (keyword3 != null) $('#keyword3').val(keyword3);
    var keyword4 = localStorage.getItem('poi_keyword4');
    if (keyword4 != null) $('#keyword4').val(keyword4);
    var address = localStorage.getItem('poi_address');
    if (address != null) $('#poi_address').val(address);
    var latitude = localStorage.getItem('poi_latitude');
    if (latitude != null) $('#latitude').val(latitude);
    var longitude = localStorage.getItem('poi_longitude');
    if (longitude != null) $('#longitude').val(longitude);
    var description = localStorage.getItem('poi_description');
    if (description != null) $('#poi_description_1').val(description);
    var format = localStorage.getItem('poi_format');
    if (format != null) $('#format').val(format);
    /*var source = localStorage.getItem('poi_source');
    if (source != null) $('#poi_source').val(source);*/
}
$(document).ready(function () {
    $('#poi_msg').modal('show');
    $('.upload_nothing').append('<input class="sound_val" name="sounds" value="0" hidden>');
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('Great success! All the File APIs are supported.')
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    $('#clear').click(function () {
        $('input[type=radio][name=media]').value == 'none';
        $('input[type=radio][name=sounds]').value == 'none';
        var upload_none = $('.upload_none').empty();
        var upload_image = $('.upload_image').empty();
        var upload_video = $('.upload_video').empty();
        var upload_audio = $('.upload_audio').empty();
        var upload_none = $('.upload_nothing').empty();
        var upload_audio = $('.upload_sound').empty();
    });
    $('#make_poiform').submit((event) => { SubmitForm(event) });
    $('input[type=radio][name=media]').change(function () {
        var restrict = $('#restrict').empty();
        $('.alert-danger').hide();
        var upload_none = $('.upload_none').empty();
        var upload_image = $('.upload_image').empty();
        var upload_video = $('.upload_video').empty();
        var upload_audio = $('.upload_audio').empty();
        if (this.value == 'image') {
            if (document.getElementById('language').value == "chinese") {
                restrict.html('允許上傳gif/jpg/png/jpeg格式的圖片，圖片檔案大小不能超過2M(可上傳5張照片)');
            } else if (document.getElementById('language').value == "english") {
                restrict.html("Image format of gif/jpg/png is allowed to upload, and the capacity over 2 MB will be compressed.(It is allowed to upload5images)");
            } else if (document.getElementById('language').value == "japanese") {
                restrict.html('アップロードするgif/jpg/png形式のフォトの、最大ファイル容量は2MBまでです(アップロード可能枚数5枚のフォト)');
            }
            upload_image.append('<input class="media_val" name="media" value="1" hidden>');
            upload_image.append('<input type="file" name="image_file" accept=".gif,.jpg,.png,.jpeg" id="image_file" multiple>');
            upload_image.append('<output id="image_list">');
            var el = document.getElementById('image_file');
            if (el) {
                el.addEventListener('change', handleFileSelect, false);
            }
        } else if (this.value == 'video') {
            image_count = 0;
            if (document.getElementById('language').value == "chinese") {
                restrict.html('允許上傳mp4/avi格式的影片，影片檔案大小不能超過15M');
            } else if (document.getElementById('language').value == "english") {
                restrict.html("Video format of mp4/avi is allowed to upload, and the capacity shouldn't be over 15 MB.(It is allowed to upload5videos)");
            } else if (document.getElementById('language').value == "japanese") {
                restrict.html('アップロードするmp4/avi形式の動画ファイルの、最大ファイル容量は15MBまでです(アップロード可能数5つのファイル)');
            }
            upload_video.append('<input class="media_val" name="media" value="4" hidden>');
            upload_video.append('<input type="file" name="video_file" accept=".mp4,.avi, .mov" id="video_file">');
            upload_video.append('<video controls id="disp_video"></video>');
            var el = document.getElementById('video_file');
            if (el) {
                el.addEventListener('change', handleVideo, false);
            }
        } else if (this.value == 'audio') {
            image_count = 0;
            if (document.getElementById('language').value == "chinese") {
                restrict.html('允許上傳amr/3gpp/aac格式的錄音檔，檔案大小不能超過5M');
            } else if (document.getElementById('language').value == "english") {
                restrict.html("Audio format of amr/3gpp/aac is allowed to upload, and the file shouldn't be over 5 M(It is allowed to upload5audio files.)");
            } else if (document.getElementById('language').value == "japanese") {
                restrict.html('アップロードするamr/3gpp/aac形式の音声ファイルの、最大ファイル容量は5MBまでです(アップロード可能数5つのファイル)');
            }
            upload_audio.append('<input class="media_val" name="media" value="2" hidden>');
            upload_audio.append('<input type="file" name="audio_file" accept=".amr,.3gpp,.aac,.mp3" id="audio_file">');
            upload_audio.append('<audio controls id="disp_audio"></audio>');
            var el = document.getElementById('audio_file');
            if (el) {
                el.addEventListener('change', handleAudio, false);
            }
        }
    });
    $('input[type=radio][name=sounds]').change(function () {
        var restrict1 = $('#restrict1').empty();
        $('.alert-danger').hide();
        var upload_nothing = $('.upload_nothing').empty();
        var upload_sound = $('.upload_sound').empty();
        if (this.value == 'sound') {
            sound_count = 0;
            if (document.getElementById('language').value == "chinese") {
                restrict1.html('允許上傳amr/3gpp/aac格式的錄音檔，檔案大小不能超過5M');
            } else if (document.getElementById('language').value == "english") {
                restrict1.html("Audio format of amr/3gpp/aac is allowed to upload, and the file shouldn't be over 5 M(It is allowed to upload5audio files.)");
            } else if (document.getElementById('language').value == "japanese") {
                restrict1.html('アップロードするamr/3gpp/aac形式の音声ファイルの、最大ファイル容量は5MBまでです(アップロード可能数5つのファイル)');
            }
            upload_sound.append('<input class="sound_val" name="sounds" value="8" hidden>');
            upload_sound.append('<input type="file" name="sound_file" accept=".amr,.3gpp,.aac,.mp3" id="sound_file">');
            upload_sound.append('<audio controls id="disp_sound"></audio>');
            var el = document.getElementById('sound_file');
            if (el) {
                el.addEventListener('change', handleSound, false);
            }
        } else if (this.value == 'none') {
            $('.upload_nothing').empty();
            if (document.getElementById('language').value == "chinese") {
                restrict1.html('無語音導覽檔案');
            } else if (document.getElementById('language').value == "english") {
                restrict1.html("No voice navigation file.");
            } else if (document.getElementById('language').value == "japanese") {
                restrict1.html('音声ナビゲーションファイルがありません');
            }
            sound_count = 0;
            upload_nothing.append('<input class="sound_val" name="sounds" value="0" hidden>');
        }
    });
    $('input[type=checkbox][name=option_check]').change(function () {
        if(document.getElementById('poi_source_check').checked == true) {
            document.getElementById('poi_source').style.display="inline";
        }else{
            document.getElementById('poi_source').style.display="none";
        }
        if(document.getElementById('creator_check').checked == true) {
            document.getElementById('creator').style.display="inline";
        }else{
            document.getElementById('creator').style.display="none";
        }
        if(document.getElementById('publisher_check').checked == true) {
            document.getElementById('publisher').style.display="inline";
        }else{
            document.getElementById('publisher').style.display="none";
        }
    });
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
        if (image_count < 5) { //5張限制
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
                                    canvas.width = image.width;
                                    canvas.height = image.height;
                                    if (limit_size > 2) {
                                        canvas.width = canvas.width * ratio;
                                        canvas.height = canvas.height * ratio;
                                    }
                                    var x = canvas.width / 2;
                                    var y = canvas.height / 2;
                                    ctx.save();
                                    ctx.rotate(90 * Math.PI / 180);
                                    ctx.translate(0, -x * 2);
                                    ctx.restore();
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
                        var span = document.createElement('span');
                        span.className = "imgspan";
                        span.innerHTML = ['<img id="thumb' + theFile.name + '" name="thumb" style="height: ' + height + 'px;width: 205px; margin: 10px 5px 0 0;" src="', dataURL,
                            '" title="', escape(theFile.name), '"/> \
                      <button type="button" style="display: block;width: 205px;background: #4bafa9; color: white; text-align:center; \
                      cursor: pointer;" id="remove' + theFile.name + '" onclick="rmvImg(this,\'thumb' + theFile.name + '\')">\u522a\u9664\u5716\u7247</button>'  //刪除圖片
                        ].join('');
                        document.getElementById('image_list').insertBefore(span, null);
                    }
                };
            })(f);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
            image_count++;
        } else {
            alert('請上傳5張以內');
            break;
        }
    }
    //Clear the input files number display.
    $('#image_file').val('');
}

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

function handleSound(evt) {
    reader = new FileReader();
    files = evt.target.files;
    file = files[0];
    reader.onload = function (evt) {
        $('#disp_sound').attr("src", evt.target.result);
    }
    reader.readAsDataURL(file);
    sound_count++;
}

function rmvImg(element, name) {
    $(element).parent().remove();
    image_count--;
}

function myMap() {
    var mapCanvas = document.getElementById("map_poi");
    var myLatLng = new google.maps.LatLng(23.5, 121.120850)
    geocoder = new google.maps.Geocoder();
    markersArray = [];
    var mapOptions = {
        center: myLatLng,
        zoom: 8
    }
    map = new google.maps.Map(mapCanvas, mapOptions);

    var latitude = $('#latitude').val();
    var longitude = $('#longitude').val();
    var poi_address = $('#poi_address').val();

    google.maps.event.addListener(map, "click", function (event) {
        placeMarker(event.latLng);

        document.getElementById("latitude").value = event.latLng.lat();
        document.getElementById("longitude").value = event.latLng.lng();

        myLatLng = event.latLng;

        geocoder.geocode({ 'latLng': myLatLng }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(12);
                // 如果有資料就會回傳
                if (results) {
                    document.getElementById("poi_address").value = results[0].formatted_address;
                }
            }
            // 經緯度資訊錯誤
            else {
                alert("Google 無法辨視此位置 ");
            }
        });
    });


}

function placeMarker(location) {
    deleteOverlays();

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });

    markersArray.push(marker);
}

function deleteOverlays() {
    if (markersArray) {
        for (i in markersArray) {
            markersArray[i].setMap(null);
        }
        markersArray.length = 0;
    }
}

function poi_form() {
    var urls = POI_URL;
    var city_chk = $('#city option:selected').text();
    var my_areas = $('#areas').val();
    var subject = "體驗的";
    var type1 = "人文景觀";
    var period = $('#period').val();
    var year = $('#year').val();
    var keyword1 = $('#keyword1').val();
    var keyword2 = $('#keyword2').val();
    var keyword3 = $('#keyword3').val();
    var keyword4 = $('#keyword4').val();
    var poi_address = $('#poi_address').val();
    var latitude = $('#latitude').val();
    var longitude = $('#longitude').val();
    var poi_description_1 = $('#poi_description_1').val();
    var format = $('#format').val();
    var open = $('#open').val();
    var rights = $('#rights').val();
    var creator = $('#creator').val();
    var publisher = $('#publisher').val();
    var contributor = $('#contributor').val();
    var poi_source = $('#poi_source').val();
    var poi_title = $('#poi_title').val();
    var identifier = $('#identifier').val();
    var media_val = $('.media_val').val();
    var sound_val = $('.sound_val').val();
    var languages = $('#language').val();
    var poi_make = $('#poi_make').val();
    console.log(open);
    var data = {
        my_areas: my_areas,
        subject: subject,
        type1: type1,
        period: period,
        year: year,
        rights: rights,
        keyword1: keyword1,
        keyword2: keyword2,
        keyword3: keyword3,
        keyword4: keyword4,
        poi_address: poi_address,
        latitude: latitude,
        longitude: longitude,
        poi_description_1: poi_description_1,
        format: format,
        open: open,
        creator: creator,
        publisher: publisher,
        contributor: contributor,
        poi_source: poi_source,
        poi_title: poi_title,
        identifier: identifier,
        media_val: media_val,
        sound_val: sound_val,
        poi_make: poi_make,
        csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
    }
    if (poi_title == "") {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>標題尚未填寫</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Title not yet filled in</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>まだ記入されていないタイトル</p>");
        }
        document.getElementById("poi_title").style.border = "solid 1px #F00 ";
     } else if (my_areas == null) {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>地區尚未選擇</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>The areas has not been selected yet</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>エリアはまだ選択されていません</p>");
        }
        document.getElementById("areas").style.border = "solid 1px #F00 ";
        document.getElementById("city").style.border = "solid 1px #F00 ";
    } else if (period == null) {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>時期尚未選擇</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>The period has not been selected yet</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>期間はまだ選択されていません</p>");
        }
        document.getElementById("year").style.border = "solid 1px #F00 ";
        document.getElementById("period").style.border = "solid 1px #F00 ";
    } else if (keyword1 == "") {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>關鍵字至少填一組</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Keywords at least fill in one group</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>少なくとも1つのグループにキーワードを入力する</p>");
        }
        document.getElementById("keyword1").style.border = "solid 1px #F00 ";
    } else if (format == null) {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>範疇尚未選擇</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>The format has not been selected yet</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>カテゴリはまだ選択されていません</p>");
        }
        document.getElementById("format").style.border = "solid 1px #F00 ";
    } else if (poi_address == "") {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>地址尚未填寫</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Address not yet filled in</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>アドレスはまだ入力されていません</p>");
        }
        document.getElementById("poi_address").style.border = "solid 1px #F00 ";
    } else if (latitude == "" || longitude == "") {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>經緯度尚未填寫</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Latitude and longitude not yet filled in</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>緯度と経度はまだ記入されていません</p>");
        }
        document.getElementById("latitude").style.border = "solid 1px #F00 ";
        document.getElementById("longitude").style.border = "solid 1px #F00 ";
    } else if (poi_description_1 == "") {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>描述尚未填寫</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Description not yet filled in</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>説明はまだ記入されていません</p>");
        }
        document.getElementById("poi_description_1").style.border = "solid 1px #F00 ";
    } else if (contributor == "") {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>貢獻者尚未填寫</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>Contributor not yet filled in</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>貢献者はまだ記入されていません</p>");
        }
        document.getElementById("contributor").style.border = "solid 1px #F00 ";
    } else if ($('input[type=radio][name=sounds]:checked').val() == 'sound' && sound_count == 0) {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        $('.alert-danger').append("<p>尚未上傳語音導覽</p>");
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
        var chk_area = $('#areas option:selected').text();
        if (CheckStrIn(city_chk, chk_area, poi_address)) {
            $('.submit_poiform').prop('disabled', true);
            $('btn_confirm').parent().unbind();
            $.ajax({
                method: "POST",
                url: urls,
                data: data,
                success: function (data) {
                    if (data.media != "0" && data.sounds != "0") {
                        poi_mpeg(data.media, data.ids);
                    } else if (data.media != "0" && data.sounds == "0") {
                        poi_mpeg(data.media, data.ids);
                    } else if (data.media == "0" && data.sounds != "0") {
                        poi_sound(data.sounds);
                    } else if (data.media == "0" && data.sounds == "0") {
                        $('.alert-success').show();
                        $('.alert-success').append(escape('<p>景點上傳成功!</p>'));
                        window.location = HOME_URL;
                    }
                    // $('#loading').hide();
                },
                error: function (data) {
                    console.log(data);
                    $('btn_confirm').parent().bind('click');
                }
            });
        } else {
            $('.alert-danger').empty();
            $('.alert-danger').show();
            $('.alert-danger').append('<p>地區與地址請一致!</p>');
            $('#loading').hide();
        }
    }

}

function poi_mpeg(format, ids) {
    var urls = "/ajax_mpeg";
    format = parseInt(format);
    ids = parseInt(ids);
    var data = new FormData($('#make_poiform').get(0));
    data.append('foreignkey', ids);
    var media_val = $('.media_val').val();
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
            HandleErrUpload(ids);
        },
    });
}

function poi_sound(format, ids) {
    var urls = "/ajax_sound";
    format = parseInt(format);
    ids = parseInt(ids);
    var data = new FormData($('#make_poiform').get(0));
    data.append('foreignkey', ids);
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
            $('.alert-success').append('<p>景點上傳成功!</p>');
            window.location = HOME_URL;
        },
        error: function (data) {
            console.log(data);
        },
    });
}

function HandleErrUpload(poi_id) {
    let urls = "/ajax_handle_err_upload";
    let data = {
        id: poi_id,
        coi: COI_NAME,
    };

    $.ajax({
        method: "POST",
        url: urls,
        data: data,

        success: function (data) {
            if (data != 'Success') {
                alert('something wrong');
                console.log(data)
            } else {
                $('#loading').hide();
                $('.alert-danger').empty();
                $('.alert-danger').show();
                $('.alert-danger').append('<p>多媒體上傳錯誤</p>');
            }
        },

        error: function (data) {
            alert('something wrong');
            console.log(data)
        },
    });
}

function SubmitForm(event) {
    event.preventDefault();
    poi_form();
}

$('#city').change(function () {
    var city = $(this).val();
    var urls = "/feed_area";
    var data = {
        city: city
    }
    $.ajax({
        method: "POST",
        data: data,
        url: urls,
        success: function (data) {
            var area_count = data.area.length;
            var area_select = $('#areas').empty();
            var languages = $('#language').val();
            for (var i = 0; i < area_count; i++) {
                if (languages == 'chinese' || languages == 'japanese') {
                    area_select.append(
                        $('<option></option>').val(data.area[i].area_name_en).html(data.area[i].area_name_ch)
                    );
                } else {
                    area_select.append(
                        $('<option></option>').val(data.area[i].area_name_en).html(data.area[i].area_name_en)
                    );
                }
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
});

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

$('.selectPublic').on('click', event => {
    $('#open').val(event.target.value);
});


// address to longitude and latitude by hsieh
$('#trans_addr_but').on('click', function () {
    // 取得地址
    var poi_address = $('#poi_address').val();
    //alert(poi_address);

    // 建立 geocoder 物件實例
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': poi_address}, function(results, status) {
      if (status == 'OK') {
        $('#latitude').val(results[0].geometry.location.lat());
        //console.log(results[0].geometry.location.lat());
        $('#longitude').val(results[0].geometry.location.lng());
        
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

});