finalFiles = [];

temp_flag = false; //代表使用者有刪除原本圖片，true代表先做暫存
temp_media_id = 0; //media的id暫存
temp_media_name = ""; //media的name暫存
temp_media_format = ""; //media的format暫存

$(document).ready(function() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        console.log('Great success! All the File APIs are supported.')
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    if(image_count == 1)temp_flag = true;

    $('#clear').click(function() {
        $('input[type=radio][name=media]').value == 'none';
        var upload_none = $('.upload_none').empty();
        var upload_image = $('.upload_image').empty();
        var upload_video = $('.upload_video').empty();
        var upload_audio = $('.upload_audio').empty();
        var upload_none = $('.upload_nothing').empty();
        var upload_audio = $('.upload_sound').empty();
    });
    
    $('.alert-danger').hide();
    if (chk == 1){
      $('#image_file').change(function(evt){
        
        if(image_count < 5 && image_count > 0){
          handleFileSelect(evt);
        }
        else if(imaga_count == 0)
        {
            alert("請砍掉重練");
        }
        else{
          alert('圖片檔只能上傳五張,如要繼續上傳請先刪除就圖片');
          $('#image_file').val('');
        }
      });
    }
    else if (chk == 2){
      $('#audio_file').change(function(evt) {
        if(image_count < 1){
          handleAudio(evt);
        }
        else{
          alert("聲音檔只能上傳一個");
          $('#audio_file').val('');
        }
      });
    }
    else if (chk == 4){
      $('#video_file').change(function(evt) {
        if(image_count < 1){
          handleVideo(evt);
        }
        else{
          alert("影片檔只能上傳一個");
          $('#video_file').val('');
        }
      });
    }

    $('#sound_file').change(function(evt) {
        console.log(chk_sound);
      if(sound_count < 1){
        handleSound(evt);
      }
      else{
        alert("語音導覽只能上傳一個");
        $('#sound_file').val('');
      }
    });

    if(chk == '' && chk_sound == ''){
        alert("無多媒體資料");
        //chk = 1;
        //break;
      //$('.upload_none').empty();
      image_count = 0;  //be careful a bomb
      sound_count = 0;
    }
    
    $('#make_poiform').submit(function(e){
        e.preventDefault();
        if(image_count > 0){
            if(temp_flag == true) {
                temp_flag = false;
                delete_img(temp_media_id, temp_media_name, temp_media_format, true);
            }
            poi_form();
        }
        else{

            //image_count = 1;
            /*$('.alert-danger').empty();
            $('.alert-danger').show();
            $('.alert-danger').append('<p>至少需要一個多媒體檔案或是語音導覽!</p>');

            return false;*/
            if(confirm("您尚未上傳多媒體檔案，確定要送出嗎?")) poi_form();
        }
    });
    if($('#poi_source').val()){
        document.getElementById('poi_source_check').checked = true;
        document.getElementById('poi_source').style.display="inline";
    }
    if($('#creator').val()){
        document.getElementById('creator_check').checked = true;
        document.getElementById('creator').style.display="inline";
    }
    if($('#publisher').val()){
        document.getElementById('publisher_check').checked = true;
        document.getElementById('publisher').style.display="inline";
    }

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
    $('input[type=radio][name=new_media]').change(function () {
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
});

function handleFileSelect(evt) {  //選擇檔案
    $('.alert-danger').hide();
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    var files = evt.target.files; // FileList object
    $.each(files, function(idx, elm) {
        finalFiles[idx] = elm;
    });
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        if (image_count  < 5) { //5張限制
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    // Render thumbnail.
                    limit_size = theFile.size / 1048576;
                    var image = new Image();

                    //create new image and coupute the ratio to compress
                    var ratio = 1 / Math.pow(limit_size, 0.5);
                    var canvas = document.createElement("canvas");
                    var datatype = e.target.result.split(',')[0].split(':')[1].split(';')[0];

                    //when image load complete , use canvas to resize image
                    image.onload = function() {
                        var ctx = canvas.getContext("2d");
                        EXIF.getData(image , function(){
                          var orientation = EXIF.getTag(image , 'Orientation');
                          switch (orientation) {
                            case 6:
                              canvas.width = image.width;
                              canvas.height = image.height;
                              if(limit_size > 2){
                                canvas.width = canvas.width * ratio;
                                canvas.height = canvas.height * ratio;
                              }
                              var x = canvas.width / 2;
                              var y = canvas.height / 2;
                              ctx.save();
                              ctx.rotate(90 * Math.PI / 180);
                              ctx.translate(0 , -x * 2);
                              ctx.restore();
                              break;
                            default:
                              if(limit_size > 2){
                                canvas.width = image.width * ratio;
                                canvas.height = image.height * ratio;
                              }
                              else{
                                canvas.width = image.width;
                                canvas.height = image.height;
                              }
                          }
                        });
                        if(limit_size > 2){
                          ctx.scale(ratio, ratio);
                        }
                        ctx.drawImage(image, 0, 0);
                        NewImageInsert(canvas.toDataURL(datatype) , 205 * canvas.height / canvas.width);
                  };
                  image.src = e.target.result;
                    //create the new span contains image in output
                    function NewImageInsert(dataURL , height){
                        var span = document.createElement('span');
                        span.className = "imgspan";
                        span.innerHTML = ['<img id="thumb' + theFile.name + '" name="thumb" style="height: ' + height +'px;width: 205px; margin: 10px 5px 0 0;" src="', dataURL,
                            '" title="', escape(theFile.name), '"/> \
                      <button type="button" style="display: block;width: 205px;background: #4bafa9; color: white; text-align:center; \
                      cursor: pointer;" id="remove' + theFile.name + '" onclick="rmvImg(this,\'thumb' + theFile.name + '\')">刪除圖片</button>'
                        ].join('');
                        document.getElementById('image_list').insertBefore(span, null);
                      $(".media_val").val('1');
                    }
                };
            })(f);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
            image_count = image_count + 1;
        } else {
            alert('請上傳5張以內');
            break;
        }
    }
    //Clear the input files number display.
    //$('#image_file').val('');
}

function handleVideo(evt) {
    reader = new FileReader();
    files = evt.target.files;
    file = files[0];
    reader.onload = function(evt) {
        $('#disp_video').attr("src", evt.target.result);
    }
    reader.readAsDataURL(file);
    image_count++;
    $(".media_val").val('4');
}

function handleAudio(evt) {
    reader = new FileReader();
    files = evt.target.files;
    file = files[0];
    reader.onload = function(evt) {
        $('#disp_audio').attr("src", evt.target.result);
    }
    reader.readAsDataURL(file);
    image_count++;
    $(".media_val").val('2');
}

function handleSound(evt) {
    
    console.log("1");

    reader = new FileReader();
    console.log("2");

    files = evt.target.files;
    console.log("3");

    file = files[0];
    console.log("4");

    reader.onload = function(evt) {
        console.log("5");
        $('#disp_sound').attr("src", evt.target.result);
        console.log("6");
    }

    reader.readAsDataURL(file);
    console.log("7");

    sound_count++;
    console.log("8");
    
    $(".sound_val").val('8');
    console.log("9");
}


function rmvImg(element,name) {
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

    google.maps.event.addListener(map, "click", function(event){
        placeMarker(event.latLng);

        document.getElementById("latitude").value = event.latLng.lat();
        document.getElementById("longitude").value = event.latLng.lng();

        myLatLng = event.latLng;

        geocoder.geocode({'latLng': myLatLng }, function(results, status) {
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
    var poi_id = $('#poi_id').val();
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
    var creator = $('#creator').val();;
    var publisher = $('#publisher').val();;
    var contributor = $('#contributor').val();
    var poi_source = $('#poi_source').val();
    var poi_added_time = $('#poi_added_time').val();
    var poi_title = $('#poi_title').val();
    var identifier = $('#identifier').val();
    var language = $('#langeage').text();
    var media_val = $('.media_val').val();
    var sound_val = $('.sound_val').val();    
    var languages = $('#language').val();

    var data = {
        my_areas: my_areas,
        poi_id: poi_id,
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
        poi_added_time: poi_added_time,
        poi_title: poi_title,
        identifier: identifier,
        language: language,
        media_val: media_val,
        sound_val: sound_val,
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
    } else if (my_areas == null ){
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
    } else if (period == null){
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
    } else if (keyword1 == ""){
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
    } else if (poi_address == ""){
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
    } else if (latitude == "" || longitude == ""){
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
    } else if (poi_description_1 == ""){
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
    } else if (contributor == ""){
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
    } /*else if (sound_val == null) {
        $('.alert-danger').empty();
        $('.alert-danger').show();
        if (languages == "chinese") {
            $('.alert-danger').append("<p>語音尚未上傳</p>");
        } else if (languages == "english") {
            $('.alert-danger').append("<p>The audio guide has not been selected yet</p>");
        } else if (languages == "japanese") {
            $('.alert-danger').append("<p>音声ナビゲーションはまだ選択されていません</p>");
        }
    }*/ else {
        $('#loading').show();
        var chk_area = $('#areas option:selected').text();
        if (CheckStrIn(city_chk, chk_area, poi_address))  {
            $('.submit_poiform').prop('disabled', true);
            $.ajax({
                method: "POST",
                url: urls,
                data: data,
                success: function(data) {
                    if (data.media != "0" && data.sounds != "0") {
                        //alert(data.media)
                        switch (data.media) {
                            case "1":
                                var case_a = $('#image_file').val() != '';
                                var case_b = $('#sound_file').val() != '';
                                break;
                            case "2":
                                var case_a = $('#audio_file').val() != '';
                                var case_b = $('#sound_file').val() != '';
                                break;
                            case "4":
                                case_a = $('#video_file').val() != '';
                                case_b = $('#sound_file').val() != '';
                                break;
                        }
                        if (case_a && case_b) {
                            poi_mpeg(data.media,data.ids);
                        } else if (!case_a && case_b) {
                            poi_sound(data.sounds,data.ids);
                        } else if (case_a && !case_b) {
                            poi_mpeg(data.media,data.ids);
                        } else {
                            $('.alert-success').show();
                            $('.alert-success').append('<p>景點編輯成功!</p>');
                            window.location = HOME_URL;
                        }
                    } else if (data.media != "0" && data.sounds == "0") {
                        switch (data.media) {
                            case "1":
                                var case_a = $('#image_file').val() != '';
                                break;
                            case "2":
                                var case_a = $('#audio_file').val() != '';
                                break;
                            case "4":
                                var case_a = $('#video_file').val() != '';
                                break;
                        }
                        if (case_a) {
                            poi_mpeg(data.media,data.ids);
                        } else {
                            $('.alert-success').show();
                            $('.alert-success').append('<p>景點編輯成功!</p>');
                            window.location = HOME_URL;
                        }
                    } else if (data.media == "0" && data.sounds != "0") {
                        var case_a = $('#sound_file').val() != '';
                        if (case_a) {
                            poi_sound(data.sounds,data.ids);
                        } else {
                            $('.alert-success').show();
                            $('.alert-success').append('<p>景點編輯成功!</p>');
                            window.location = HOME_URL;
                        }
                    } else {
                        $('.alert-success').show();
                        $('.alert-success').append('<p>景點編輯成功!</p>');
                        window.location = HOME_URL;
                    }
                    $('#loading').hide();
                },
                error: function(data) {
                    console.log(data);
                }
            });
        } else {
            $('.alert-danger').show();
            $('.alert-danger').append('<p>地區與地址請一致!</p>');
            $('#loading').hide();
        }
    }
}

function poi_mpeg(format,ids) {
    var urls = "/ajax_mpeg";
    format = parseInt(format);
    ids = parseInt(ids);
    var media_val = $('.media_val').val();
    var sound_val = $('.sound_val').val();
    var data = new FormData($('#make_poiform').get(0));
    data.append('foreignkey',ids);

    if(media_val == 1){
        $("img[name = thumb]").each(function(){
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

          var blob = new Blob([ia] , {type : mimeString});
          data.append("image_file_modified" , blob , $(this).attr("id"));
        });
    }

    $('#loading').show();
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        processData: false,
        contentType: false,
        success: function(data) {
            $('#loading').hide();
            $('.alert-success').show();
            $('.alert-success').append('<p>多媒體修改成功!</p>');
            window.location = HOME_URL;
        },
        error: function(data) {
            console.log(data);
        },
    });
}

function poi_sound(format, ids) {
    var urls = "/ajax_sound";
    format = parseInt(format);
    ids = parseInt(ids);
    var media_val = $('.media_val').val();
    //var sound_val = $('.sound_val').val();
    var data = new FormData($('#make_poiform').get(0));
    data.append('foreignkey',ids);
    
    if(media_val == 8){
        console.log("media_val");
        $("img[name = thumb]").each(function(){
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

          var blob = new Blob([ia] , {type : mimeString});
          data.append("image_file_modified" , blob , $(this).attr("id"));
        });
    }

    $('#loading').show();
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        processData: false,
        contentType: false,
        success: function(data) {
            $('#loading').hide();
            $('.alert-success').show();
            $('.alert-success').append('<p>景點上傳成功!</p>');
            window.location = HOME_URL;
        },
        error: function(data) {
            console.log(data);
        },
    });
}
function delete_confirm(id, name, format){
    var del = confirm("確定刪除?");
    if (del == true && format != 8)
        delete_img(id, name, format, del);
    else if(del == true){
        delete_sound(id,name, format,del);
        chk_sound = 8;
    }

        
}
function delete_img(id, name, format, del) {
    //var del = confirm("確定刪除?");
    var urls = "/delete_media";
    var rmv = $('#edit_' + id);
    var data = {
        picture_id: id,
        picture_name: name,
        format: format,
    }
    if (del == true && image_count >1 && temp_flag == false || format == 2 || format == 4){
        $('#loading').show();
        $.ajax({
            method: "POST",
            url: urls,
            data: data,
            success: function(data) {
                console.log(data);
                if (data == 'success' && 　format != 8) {
                    $('.alert-success').show();
                    $('.alert-success').append('<p>多媒體刪除成功!</p>');
                    $('#loading').hide();
                    rmv.remove();
                    orig_count--;
                    if(image_count > 1){
                      image_count--;  
                    }
                    
                } else if (data == 'success' && 　format == 8) {
                    $('.alert-success').show();
                    $('.alert-success').append('<p>語音導覽刪除成功!</p>');
                    $('#loading').hide();
                    rmv.remove();
                    sound_count--;
                } else {
                    $('.alert-danger').show();
                    $('.alert-danger').append('<p>多媒體刪除失敗!</p>');
                }

            },
            error: function(data) {
                console.log(data);
                console.log("error");
            }
        });
    }
    else{
        //alert("多媒體數量不可為0");
        temp_flag = true;
        temp_media_id = id;
        temp_media_name = name;
        temp_media_format = format;
        rmv.remove();
    }
}

function delete_sound(id, name, format, del){
    var urls = "/delete_media";
    var rmv = $('#edit_' + id);
    var data = {
        picture_id: id,
        picture_name: name,
        format: format,
    }
    if (del == true && sound_count >= 1 ){
        $('#loading').show();
        $.ajax({
            method: "POST",
            url: urls,
            data: data,
            success: function(data) {
                console.log(data);
                if (data == 'success' && 　format == 8) {
                    $('.alert-success').show();
                    $('.alert-success').append('<p>語音導覽刪除成功!</p>');
                    $('#loading').hide();
                    rmv.remove();
                    sound_count--;
                } else {
                    $('.alert-danger').show();
                    $('.alert-danger').append('<p>多媒體刪除失敗!</p>');
                }

            },
            error: function(data) {
                console.log(data);
                console.log("delete sound error");
            }
        });
    }

};


function CheckStrIn(city, area, address) {
    var languages = $('.lang-1').val();
    if (languages == 'chinese' || languages == 'japanese') {
        city = city.replace(/臺/g, "台");
        area = area.replace(/臺/g, "台");
        address = address.replace(/臺/g, "台");
    }else{
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

$('.selectPublic').on('click', event => {
    $('#open').val(event.target.value);
});