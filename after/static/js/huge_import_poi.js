function Import(url) {
    $('#loading').show();
    $("<input>").attr('type','file').attr('accept','.csv').click().change(function(){
        Papa.parse(this.files[0], {
            complete: function(results, file) {

                var data = results.data;

                var poi_list = [];

                for(i=15;i<data.length;i++) {

                    if(data[i].join('') == "") {
                        continue;
                    }
                    else {
                        while(data[i].length < 18) {
                            data[i].push("");
                        }

                        var d = {
                            poi_title: data[i][0],
                            my_areas: data[i][1],
                            period: data[i][2],
                            year: data[i][3],
                            keyword1: data[i][4],
                            keyword2: data[i][5],
                            keyword3: data[i][6],
                            keyword4: data[i][7],
                            poi_address: data[i][8],
                            latitude: data[i][9],
                            longitude: data[i][10],
                            poi_description_1: data[i][11],
                            format: data[i][12],
                            poi_source: data[i][13],
                            creator: data[i][14],
                            publisher: data[i][15],
                            contributor: data[i][16],
                            open: data[i][17],
                            picture1: data[i][18],
                            picture2: data[i][19],
                            picture3: data[i][20],
                            picture4: data[i][21],
                            picture5: data[i][22],
                            video: data[i][23],
                            audio: data[i][24],
                            poi_id: "",
                            media_val: "",
                            sound_val: "",
                            poi_make: "make",
                        }
                        console.log(d)
                        if(d['poi_title'] == "") {
                            alert("第"+(i-14)+"筆POI標題資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        /*if(!/^(消逝的|體驗的|活化再造的)$/.test(d['subject'])) {
                            alert("第"+(i-14)+"筆POI主題資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }*/  // 2020/08/29 不給輸入  預設為體驗的

                        if(d['my_areas'] == "") {
                            alert("第"+(i-14)+"筆POI地區資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }
                        
                        /*if(!/^(自然景觀|人文景觀|事件|人物|產業)$/.test(d['type1'])) {
                            alert("第"+(i-14)+"筆POI類型資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }*/ // 2020/08/29 不給輸入  預設為文化景觀

                        if(d['period'] == ""){
                            alert(d['period']);
                            alert("第"+(i-14)+"筆POI時期/年份資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['keyword1'] == "") {
                            alert("第"+(i-14)+"筆POI關鍵字1資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['poi_address'] == "") {
                            alert("第"+(i-14)+"筆POI地址資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        // if(d['poi_address'].indexOf(d['my_areas']) == -1) {
                        //     alert("第"+(i-14)+"筆POI地區與地址不一致");
                        //     $('#loading').hide();
                        //     return;
                        // }

                        if(!/^(|-)\d*(|\.)\d*$/.test(d['latitude'])) {
                            alert("第"+(i-14)+"筆POI緯度資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(!/^(|-)\d*(|\.)\d*$/.test(d['longitude'])) {
                            alert("第"+(i-14)+"筆POI經度資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['poi_description_1'] == "") {
                            alert("第"+(i-14)+"筆POI描述資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(!/^古蹟|歷史建築|紀念建築|聚落建築群|考古遺址|史蹟|文化景觀|古物|自然地景、自然紀念物|傳統表演藝術|傳統工藝|口述傳統|民俗|傳統知識與實踐|一般景觀|植物|動物|生物|食衣住行育樂|其它$/.test(d['format'])) {
                            console.log(d['format'])
                            alert("第"+(i-14)+"筆POI範疇資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['contributor'] == "") {
                            alert("第"+(i-14)+"筆POI景點製作貢獻者資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(!/^[01]$/.test(d['open'])) {
                            alert("第"+(i-14)+"筆POI公開資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        poi_list.push(d);
                    }
                }

                if(poi_list.length == 0) {
                    alert("Success，共匯入"+poi_list.length+"筆POI。");
                    document.location = document.location;
                }
                else {
                    UploadPOI(0,poi_list,url);
                }
            
            }
        });
    });
}

function Import_extn(url) {
    $('#loading').show();
    $("<input>").attr('type','file').attr('accept','.csv').click().change(function(){
        Papa.parse(this.files[0], {
            complete: function(results, file) {

                var data = results.data;

                var poi_list = [];

                for(i=15;i<data.length;i++) {

                    if(data[i].join('') == "") {
                        continue;
                    }
                    else {
                        while(data[i].length < 20) {
                            data[i].push("");
                        }

                        var d = {
                            poi_title: data[i][0],
                            subject: data[i][1],
                            my_areas: data[i][2],
                            type1: data[i][3],
                            period: data[i][4],
                            year: data[i][5],
                            keyword1: data[i][6],
                            keyword2: data[i][7],
                            keyword3: data[i][8],
                            keyword4: data[i][9],
                            poi_address: data[i][10],
                            latitude: data[i][11],
                            longitude: data[i][12],
                            poi_description_1: data[i][13],
                            format: data[i][14],
                            poi_source: data[i][15],
                            creator: data[i][16],
                            publisher: data[i][17],
                            contributor: data[i][18],
                            open: data[i][19],
                            poi_id: "",
                            media_val: "",
                            sound_val: "",
                            poi_make: "make",
                        }

                        if(d['poi_title'] == "") {
                            alert("第"+(i-14)+"筆POI標題資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(!/^(消逝的|體驗的|活化再造的)$/.test(d['subject'])) {
                            alert("第"+(i-14)+"筆POI主題資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['my_areas'] == "") {
                            alert("第"+(i-14)+"筆POI地區資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }
                        
                        if(!/^(自然景觀|人文景觀|事件|人物|產業)$/.test(d['type1'])) {
                            alert("第"+(i-14)+"筆POI類型資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['period'] == '西元前' && /^(-2999~-2500|-2499~-2000|-1999~-1500|-1499~-1000|-999~-500|-499~0)$/.test(d['year'])) {
                            d['period'] = '西元前~0';
                        }
                        else if(d['period'] == '西元' && /^(0|\d*[1-9]\d*)$/.test(d['year']) && parseInt(d['year']) > 0) {
                            var period = parseInt(parseInt(d['year']/100))*100;
                            d['period'] = period + '~' + (period>=2000?'':period+99); 
                        }
                        else {
                            alert(d['period']);
                            alert("第"+(i-14)+"筆POI時期/年份資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['keyword1'] == "") {
                            alert("第"+(i-14)+"筆POI關鍵字1資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['poi_address'] == "") {
                            alert("第"+(i-14)+"筆POI地址資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        // if(d['poi_address'].indexOf(d['my_areas']) == -1) {
                        //     alert("第"+(i-14)+"筆POI地區與地址不一致");
                        //     $('#loading').hide();
                        //     return;
                        // }

                        if(!/^(|-)\d*(|\.)\d*$/.test(d['latitude'])) {
                            alert("第"+(i-14)+"筆POI緯度資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(!/^(|-)\d*(|\.)\d*$/.test(d['longitude'])) {
                            alert("第"+(i-14)+"筆POI經度資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['poi_description_1'] == "") {
                            alert("第"+(i-14)+"筆POI描述資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(!/^古蹟、歷史建築、聚落|遺址|文化景觀|自然景觀|民俗及相關文物|古物|傳統藝術|食衣住行育樂|其它$/.test(d['format'])) {
                            alert("第"+(i-14)+"筆POI範疇資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(d['contributor'] == "") {
                            alert("第"+(i-14)+"筆POI景點製作貢獻者資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        if(!/^[01]$/.test(d['open'])) {
                            alert("第"+(i-14)+"筆POI公開資料未填或有誤");
                            $('#loading').hide();
                            return;
                        }

                        poi_list.push(d);
                    }
                }

                if(poi_list.length == 0) {
                    alert("Error, no data input");
                    document.location = document.location;
                }
                else {
                    UploadPOI(0,poi_list,url);
                }
            
            }
        });
    });
}



function UploadPOI(index,array,url) {
    $.ajax({
        method: "POST",
        url: url,
        data: array[index++],
        success: function(data) {                           
            console.log('data');
            if(index == array.length) {
                alert("Success，共匯入"+array.length+"筆POI。");
                document.location = document.location;
            }
            else {
                UploadPOI(index,array,url);
            }
        },
        error: function(data) {
            alert("Error");
            $('#loading').hide();
        }
    });        
}