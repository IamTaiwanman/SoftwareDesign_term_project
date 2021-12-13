is_ref = false;
is_edit = false;
window.onload = function () {
    var languages = localStorage.getItem('language')==null?"chinese":localStorage.getItem('language');
    if (languages != null) {
        $('#language').val(languages);
        chg_lan(languages);
        // $('#language').trigger('change');
    }
    // alert("lan:"+languages);
}

//all language

//taiwan
L_taiwan = new Array();
//index
L_taiwan[0] = "<p><li> Point Of Interest (POI): 景點單一的景點介紹,導覽的最基本單位</li><br> <li>Line Of Interest (LOI): 景線 以導覽情境為考量,\
                設計出具地域關聯性的一條有參訪先後次序規劃的景點 \
                路線(A sequence of POIs)</li><br> <li> Area Of Interest(AOI): 以一特定區域之文化資產為主軸,設計出有地域關聯性的 一組導覽景點區域(A set of POIs)\
                </li><br> <li>Story/Site Of Interest (SOI): 主題故事/場域針對一(i)跨越多個時間/空間之相關人/事/物的故事或(ii)某個特定場域之\
                相關人/事/物的故事,設計出的一個可包涵許多景點(POIs),景線(LOIs)和景區(AOI)的主題故事</li></p>";
L_taiwan[1] = "<i class='fa fa-fw fa-check'></i>行動數位文化資產之導覽地圖";
L_taiwan[2] = "<i class='fa fa-fw fa-check'></i>文化資產之行動數位內容創作空間";
L_taiwan[3] = "<i class='fa fa-fw fa-check'></i>導覽解說員創作空間";
L_taiwan[4] = "<i class='fa fa-fw fa-check'></i>玩家創作空間";
L_taiwan[5] = "文史專家創作景點、景線、景區、主題故事";
L_taiwan[6] = "導覽解說員創作景點、景線、景區、主題故事";
L_taiwan[7] = "玩家創作景點、景線、景區、主題故事";
L_taiwan[8] = "前往查看";
L_taiwan[9] = "--請選擇--";
L_taiwan[10] = "專家地圖";
L_taiwan[11] = "玩家地圖";
L_taiwan[12] = "解說員地圖";
L_taiwan[13] = "前往創作";
L_taiwan[14] = "前往創作";
L_taiwan[15] = "前往創作";

//navbar
L_taiwan[16] = "創作";
L_taiwan[17] = "登出";
L_taiwan[18] = "登入";
L_taiwan[19] = "平台使用簡介";

L_taiwan[20] = "今日景點";
L_taiwan[21] = "今日景線";
L_taiwan[22] = "今日景區";
L_taiwan[23] = "今日主題故事";
L_taiwan[24] = "APP 下載";
L_taiwan[25] = "使用手冊下載";



//header
L_taiwan[26] = "文史脈流網站";

//sidebar
L_taiwan[31] = "我的景點/景線/景區/主題故事";
L_taiwan[32] = "製作景點";
L_taiwan[33] = "製作景線";
L_taiwan[34] = "製作景區";
L_taiwan[35] = "製作主題故事";
L_taiwan[271] = "群組管理";
L_taiwan[272] = "建立群組";

//map_player
L_taiwan[36] = "內容型態";
L_taiwan[37] = "地區";
//L_taiwan[38] = "主題";
//L_taiwan[39] = "類型";
L_taiwan[40] = "範疇";
L_taiwan[41] = "媒體類別";
L_taiwan[42] = "景點";
L_taiwan[43] = "景線";
L_taiwan[44] = "景區";
L_taiwan[45] = "主題故事";
L_taiwan[46] = "全部";
L_taiwan[47] = "體驗的";
L_taiwan[48] = "活化再造的";
L_taiwan[49] = "消逝的"; 
L_taiwan[50] = "人物";
L_taiwan[51] = "事件";
L_taiwan[52] = "人文景觀";
L_taiwan[53] = "自然景觀";
L_taiwan[54] = "產業";
L_taiwan[55] = "<option class=\"all\" value=\"all\">全部</option>\
                <option id=\"Historical\" value=\"古蹟\">古蹟</option>\
                <option id=\"historical_buildings\" value=\"歷史建築\">歷史建築</option>\
                <option id=\"Memorial_building\" value=\"紀念建築\">紀念建築</option>\
                <option id=\"Settlement_buildings\" value=\"聚落建築群\">聚落建築群</option>\
                <option id=\"Ruins\" value=\"考古遺址\">考古遺址</option>\
                <option id=\"Historical_site\" value=\"史蹟\">史蹟</option>\
                <option id=\"Cultural-1\" value=\"文化景觀\">文化景觀</option>\
                <option id=\"Antique\" value=\"古物\">古物</option>\
                <option class=\"natural\" value=\"自然景觀\">自然景觀</option>\
                <option id=\"Traditional\" value=\"傳統表演藝術\">傳統表演藝術</option>\
                <option id=\"Traditional2\" value=\"傳統工藝\">傳統工藝</option>\
                <option id=\"Traditional3\" value=\"口述傳統\">口述傳統</option>\
                <option id=\"Folk\" value=\"民俗\">民俗</option>\
                <option id=\"Traditional-knowledge\" value=\"傳統知識與實踐\">傳統知識與實踐</option>\
                <option id=\"General_landscape\" value=\"一般景觀(建築/人工地景/自然地景)\">一般景觀(建築/人工地景/自然地景)</option>\
                <option id=\"Plants\" value=\"植物\">植物</option>\
                <option id=\"Animals\" value=\"動物\">動物</option>\
                <option id=\"biological\" value=\"生物\">生物</option>\
                <option id=\"Food\" value=\"食衣住行育樂\">食衣住行育樂</option>\
                <option id=\"Others\" value=\"其他\">其他</option>";
L_taiwan[56] = "遺址";
L_taiwan[57] = "文化景觀";
L_taiwan[58] = "傳統藝術";
L_taiwan[59] = "民俗及相關文物";
L_taiwan[60] = "古物";
L_taiwan[61] = "食衣住行育樂";
L_taiwan[62] = "其它";
L_taiwan[63] = "相片";
L_taiwan[64] = "聲音";
L_taiwan[65] = "影片";
L_taiwan[66] = "景點列表";
L_taiwan[67] = "景線列表";
L_taiwan[68] = "景區列表";
L_taiwan[69] = "故事列表";

//docentinfo
L_taiwan[70] = "導覽員資訊";
L_taiwan[71] = "姓名:";
L_taiwan[72] = "電話:";
L_taiwan[73] = "手機:";
L_taiwan[74] = "導覽語言:";
L_taiwan[75] = "FB/LINE或其他帳號:";
L_taiwan[76] = "個人簡介:";
L_taiwan[77] = "收費標準:";
L_taiwan[78] = "確認";


//userinfo
L_taiwan[79] = "使用者資訊";
L_taiwan[80] = "用戶名稱:";
L_taiwan[81] = "姓名/暱稱:";
L_taiwan[82] = "性別:";
L_taiwan[83] = "男";
L_taiwan[84] = "女";
L_taiwan[85] = "地址:";
L_taiwan[86] = "生日:";
L_taiwan[87] = "學歷:";
L_taiwan[88] = "職業:";
L_taiwan[89] = "網站:";
L_taiwan[90] = "登入角色:";
L_taiwan[91] = "玩家";
L_taiwan[92] = "專家";
L_taiwan[93] = "解說員";
L_taiwan[94] = "驗證者";
L_taiwan[95] = "編輯個人資訊";
L_taiwan[96] = "變更密碼";
L_taiwan[201] = "修改個人資料";
L_taiwan[192] = "(玩家)";
L_taiwan[193] = "(專家)";
L_taiwan[194] = "(導覽員)";
L_taiwan[195] = "(驗證者)";

//map_player_detail
L_taiwan[97] = "時間";
L_taiwan[98] = "時期";
L_taiwan[99] = "地址";
L_taiwan[100] = "緯度";
L_taiwan[101] = "經度";
L_taiwan[102] = "參考來源";
L_taiwan[103] = "參考來源作者";
L_taiwan[104] = "參考來源出版者";
L_taiwan[105] = "景點製作貢獻者";
L_taiwan[106] = "標題";
L_taiwan[107] = "描述";
L_taiwan[108] = "語音導覽解說:";
L_taiwan[109] = "媒體檔案";
L_taiwan[110] = "語音導覽";
L_taiwan[111] = "圖片";
L_taiwan[112] = "聲音";
L_taiwan[113] = "影片";
L_taiwan[114] = "導覽解說使用語言:";
L_taiwan[115] = "自我介紹:";

//make_player_poi
L_taiwan[116] = "景點製作<img src='../static/images/question.png' data-toggle='modal' data-target='#poi_make_notes' style='display: inline;'>";
L_taiwan[117] = "年份";
L_taiwan[118] = "關鍵字";
L_taiwan[119] = "緯度:";
L_taiwan[120] = "經度:";
L_taiwan[121] = "公開";
L_taiwan[122] = "公開";
L_taiwan[123] = "不公開";
L_taiwan[124] = "上傳語音導覽解說";
L_taiwan[125] = "上傳照片/聲音/影片";
L_taiwan[126] = "無";
L_taiwan[127] = "(ex:彰化縣鹿港鎮民族路228號)可利用地圖自動取得地址與經緯度(在地圖上按左鍵)";
L_taiwan[128] = "無語音導覽檔案";
L_taiwan[129] = "返回上一頁";
L_taiwan[130] = "確認";
L_taiwan[131] = "清除";
L_taiwan[132] = "史前";
L_taiwan[133] = "荷西";
L_taiwan[134] = "明鄭";
L_taiwan[135] = "清領";
L_taiwan[136] = "日治";
L_taiwan[137] = "現代台灣";
L_taiwan[138] = "西元前~0";

//make_player
L_taiwan[27] = "我的景點列表";
L_taiwan[28] = "我的景線列表";
L_taiwan[29] = "我的景區列表";
L_taiwan[30] = "我的主題故事列表";
L_taiwan[139] = "景點編輯";
L_taiwan[188] = "景線編輯";
L_taiwan[189] = "景區編輯";
L_taiwan[190] = "主題故事編輯";
L_taiwan[140] = "匯出POI至CSV";
L_taiwan[141] = "匯出LOI至CSV";
L_taiwan[142] = "匯出AOI至CSV";
L_taiwan[143] = "匯出SOI至CSV";
L_taiwan[144] = "(尚未驗證 /";
L_taiwan[145] = "(已驗證通過 /";
L_taiwan[146] = "(驗證不通過 /";
L_taiwan[147] = "公開";
L_taiwan[148] = "不公開";
L_taiwan[149] = "相片)";
L_taiwan[150] = "聲音)";
L_taiwan[151] = "影片)";
L_taiwan[152] = "無多媒體檔案)";
L_taiwan[153] = "刪除";
L_taiwan[154] = "修改";
L_taiwan[292] = "加入群組";
L_taiwan[422] = "景點匯入範例檔案下載";
L_taiwan[423] = "匯入POI";


L_taiwan[156] = "語音導覽";
L_taiwan[157] = "交通工具:";
L_taiwan[158] = "景線製作貢獻者";
L_taiwan[159] = "允許上傳wav/mp3/ogg格式的錄音檔，檔案大小不能超過5M";
L_taiwan[160] = "允許上傳gif/jpg/jpeg格式的圖片，圖片檔案大小不能超過2M(可上傳5張照片)";
L_taiwan[161] = "允許上傳mp4/ogg/webm 格式的影片，影片檔案大小不能超過15M";
L_taiwan[162] = "無";
L_taiwan[163] = "清除";
L_taiwan[164] = "刪除";
L_taiwan[165] = "選擇檔案";

//map_player_detail
L_taiwan[155] = "景線列表";
L_taiwan[166] = "POI 列表";
L_taiwan[167] = "景區列表";
L_taiwan[168] = "LOI 列表";
L_taiwan[169] = "AOI 列表";
L_taiwan[170] = "主題故事列表";

//make_player_loi
L_taiwan[171] = "景線製作";
L_taiwan[172] = "請選擇POI";
L_taiwan[173] = "標題:";
L_taiwan[174] = "描述:";
L_taiwan[175] = "交通工具:";
L_taiwan[176] = "是否公開:";
L_taiwan[177] = "開車";
L_taiwan[178] = "騎腳踏車";
L_taiwan[179] = "走路";
L_taiwan[180] = "景線製作貢獻者:";

//make_player_aoi
L_taiwan[182] = "景區製作";
L_taiwan[183] = "重選";
L_taiwan[184] = "景區製作貢獻者:";

//make_player_soi
L_taiwan[185] = "請選擇LOI";
L_taiwan[186] = "請選擇AOI";
L_taiwan[187] = "主題故事製作";
L_taiwan[181] = "主題故事製作貢獻者:";

//google_map
L_taiwan[191] = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrH6PFm6YsUakE6OxkTi3ekc_bp827osQ&callback=myMap&language=zh-tw&region=zh-tw";

//footer
L_taiwan[196] = "聯絡方式:";

//userpwd
L_taiwan[197] = "使用者密碼變更";
L_taiwan[198] = "目前的密碼";
L_taiwan[199] = "新密碼";
L_taiwan[200] = "新密碼確認";

//export CSV
L_taiwan[201] = "關鍵字1";
L_taiwan[202] = "關鍵字2";
L_taiwan[203] = "關鍵字3";
L_taiwan[204] = "關鍵字4";
L_taiwan[205] = "關鍵字5";
L_taiwan[206] = "該POI擁有者帳號";
L_taiwan[207] = "語言";
L_taiwan[208] = "POI 標題";
L_taiwan[209] = "LOI 標題";
L_taiwan[210] = "該LOI擁有者帳號";
L_taiwan[211] = "AOI 標題";
L_taiwan[212] = "該AOI擁有者帳號";
L_taiwan[213] = "景區製作貢獻者";
L_taiwan[214] = "SOI 標題";
L_taiwan[215] = "該SOI擁有者帳號";
L_taiwan[216] = "主題故事製作貢獻者";

//find_pwd
L_taiwan[217] = "遺失密碼";
L_taiwan[218] = "目前的帳號";
L_taiwan[219] = "電子信箱";

//login
L_taiwan[220] = "帳號";
L_taiwan[221] = "密碼";
L_taiwan[222] = "登入";
L_taiwan[223] = "忘記密碼";
L_taiwan[224] = "尚未註冊";

//userpwd
L_taiwan[225] = "使用者密碼變更";
L_taiwan[226] = "目前的密碼";
L_taiwan[227] = "新密碼";
L_taiwan[228] = "新密碼確認";

//make_player_poi
L_taiwan[229] = "Poi 製作需知";
L_taiwan[230] = "景點設定為";
L_taiwan[231] = "時，經驗證通過後可予大眾閱聽";
L_taiwan[232] = "(私有)時，則不需驗證";
L_taiwan[233] = "<b>地區</b>與<b>地址</b>需一致";
L_taiwan[234] = "1.電腦按住鍵盤<b>Ctrl</b>同時點選圖片即可選取多張(最多五張)圖片，圖片超過2MB將會被壓縮";
L_taiwan[235] = "<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h4 class=\"modal-title\"></h4><div class=\"modal-body make_poi_info\" >\
                </div><p>古蹟：</b><br>指人類為生活需要所營建之具有歷史、文化、藝術價值之建造物及附屬設施。</p><p><b>歷史建築：</b><br>指歷史事件所定著或具有歷史性、地方性、特殊性之文化、藝術價值，應予保存之建造物及附屬設施。</p>\
                <p><b>紀念建築：</b><br>指與歷史、文化、藝術等具有重要貢獻之人物相關而應予保存之建造物及附屬設施。</p><p><b>聚落建築群：</b><br>指建築式樣、風格特殊或與景觀協調，而具有歷史、藝術或科學價值之建造物群或街區。</p>\
                <p><b>考古遺址：</b><br>指蘊藏過去人類生活遺物、遺跡，而具有歷史、美學、民族學或人類學價值之場域。</p><p><b>史蹟：</b><br>指歷史事件所定著而具有歷史、文化、藝術價值應予保存所定著之空間及附屬設施。</p>\
                <p><b>文化景觀：</b><br>指人類與自然環境經長時間相互影響所形成具有歷史、美學、民族學或人類學價值之場域。</p><p><b>古物：</b><br>指各時代、各族群經人為加工具有文化意義之藝術作品、生活及儀禮器物、圖書文獻及影音資料等。</p>\
                <p><b>自然地景、自然紀念物：</b><br>指具保育自然價值之自然區域、特殊地形、地質現象、珍貴稀有植物及礦物。</p><p><b>傳統表演藝術：</b><br>指流傳於各族群與地方之傳統表演藝能。</p>\
                <p><b>傳統工藝：</b><br>指流傳於各族群與地方以手工製作為主之傳統技藝。</p><p><b>口述傳統：</b><br>指透過口語、吟唱傳承，世代相傳之文化表現形式。</p>\
                <p><b>民俗：</b><br>指與國民生活有關之傳統並有特殊文化意義之風俗、儀式、祭典及節慶。</p><p><b>傳統知識與實踐：</b><br>指各族群或社群，為因應自然環境而生存、適應與管理，長年累積、發展出之知識、技術及相關實踐。</p>\
                <p><b>一般景觀：</b><br>指一定區域呈現的景象，即視覺效果。 這種視覺效果反映了土地及土地上的空間和物質所構成的綜合體，是複雜的自然過程和人類活動在大地上的烙印。</p>\
                <p><b>植物：</b><br>百谷草木等的總稱。為生物的一大類。這類生物的細胞多具有細胞壁。一般有葉綠素，多以無機物為養料，沒有神經，沒有感覺。</p><p><b>動物：</b><br>相對於植物的另一大類生物，這類生物多可自行攝食有機物以維生，有神經、感覺，並具運動能力。 生存範圍遍及世界各處。</p>\
                <p><b>生物：</b><br>有生命的物體,具有生長、發育、繁殖等能力,能通過新陳代謝作用與周圍環境進行物質交換。動物、植物、微生物都是生物。</p><p><b>食衣住行育樂：</b><br>民生主義中, 提到人民有六大需要是指：（一）食、衣、住、行：為物質生活所必需。(國父孫中山先生原著)（二）育、樂：為精神生活所必需。</p></div>\
                <div class=\"modal-footer\"><button id=\"make_poi_close\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">關閉</button></div>";
//L_taiwan[236] = "<b>體驗的:</b><br>表示該景點仍然存在，並沒有因為時間的流逝而消失。如現存的歷史文化地景(台南府城的大南門)、產業(度小月)、文物(翠玉白菜)等。";
//L_taiwan[237] = "<b>活化與再造的:</b><br>表示該景點的景觀是被還原過或重新修復的，再度賦予新的用途。如台南仁德十鼓文創園區(過去為台糖糖廠)和台北松山文創園區(過去為松山菸廠)。";

//make_player_loi
L_taiwan[238] = "景線之行政區域為第一個景點之所在的行政區域";
L_taiwan[239] = "景區之行政區域為第一個景點之所在的行政區域";
L_taiwan[240] = "主題故事之行政區域為第一個景點之所在的行政區域";

//index
L_taiwan[241] = "請先登入帳號";

//list_group
L_taiwan[243] = "通知";
L_taiwan[244] = "申請加入群組";
L_taiwan[245] = "同意";
L_taiwan[246] = "拒絕";
L_taiwan[247] = "邀請你加入群組:";
L_taiwan[249] = "無通知訊息";
L_taiwan[250] = "探索";
L_taiwan[251] = "我的群組";
L_taiwan[252] = "解散";
L_taiwan[253] = "管理";
L_taiwan[254] = "退出";
L_taiwan[255] = "查看";
L_taiwan[256] = "申請加入";
L_taiwan[257] = "送出邀請";
L_taiwan[258] = "群組Leader可邀請成員進入群組";
L_taiwan[259] = "User 可建立多個群組亦可申請加入多個群組";
L_taiwan[260] = "群組Leader可解散群組";
L_taiwan[261] = "群組Member可退出群組";
L_taiwan[262] = "若群組為不公開則無法探索該群組";
L_taiwan[263] = "若群組為公開且驗證通過才可在搜尋功能查詢群組";
L_taiwan[264] = "關閉";
L_taiwan[265] = "邀請";
L_taiwan[291] = "搜尋群組";


//make_group
L_taiwan[266] = "建立群組";
L_taiwan[267] = "群組名稱:";
L_taiwan[268] = "群組描述:";
L_taiwan[269] = "是否公開:";
L_taiwan[270] = "確認";

//manage_group
L_taiwan[273] = "群組";
L_taiwan[274] = "編輯";
L_taiwan[275] = "群組描述";
L_taiwan[276] = "成員";
L_taiwan[277] = "踢出";
L_taiwan[278] = "自己做的";
L_taiwan[279] = "全部";
L_taiwan[280] = "移出";
L_taiwan[281] = "修改";
L_taiwan[282] = "群組Leader可編輯群組資訊";
L_taiwan[283] = "群組Leader還有該製作成員可看到成員製做之不公開之景點/景線/景區/主題故事";
L_taiwan[284] = "非群組成員只可看到成員製做之公開且驗證通過之景點/景線/景區/主題故事";
L_taiwan[285] = "群組Leader可踢出Member";
L_taiwan[286] = "群組Leader/Member可放入自己製做之景點/景線/景區/主題故事";
L_taiwan[287] = "群組Leader可修改/移出成員製做之景點/景線/景區/主題故事";
L_taiwan[288] = "群組Member退出/被踢出群組後群組內之景點/景線/景區/主題故事仍會存在群組，若刪除後則會消失";
L_taiwan[289] = "修改群組資訊";
L_taiwan[290] = "公開/不公開";

//forms.py  regist
L_taiwan[294] = "帳號(必要):";
L_taiwan[295] = "密碼(必要):";
L_taiwan[296] = "姓名/暱稱(必要):";
L_taiwan[297] = "Email:";
L_taiwan[298] = "性別:";
L_taiwan[299] = "生日:";
L_taiwan[300] = "網站:";
L_taiwan[301] = "學歷:";
L_taiwan[302] = "職業:";
L_taiwan[303] = "地址:";
L_taiwan[304] = "身份:";
L_taiwan[305] = "密碼確認(必要): ";
L_taiwan[306] = "電子信箱請照實填寫，確保自身權益";
L_taiwan[307] = "註冊";
L_taiwan[308] = "玩家";
L_taiwan[309] = "解說員";
L_taiwan[310] = "高中";
L_taiwan[311] = "大學";
L_taiwan[312] = "博士";
L_taiwan[313] = "碩士";
L_taiwan[314] = "其他";
L_taiwan[315] = "農漁牧";
L_taiwan[316] = "政府機關";
L_taiwan[317] = "軍警";
L_taiwan[318] = "研究";
L_taiwan[319] = "經商";
L_taiwan[320] = "建築/營造";
L_taiwan[321] = "製造/供應商";
L_taiwan[322] = "金融/保險";
L_taiwan[323] = "房地產";
L_taiwan[324] = "資訊";
L_taiwan[325] = "服務";
L_taiwan[326] = "學生";
L_taiwan[327] = "家管";
L_taiwan[328] = "醫療";
L_taiwan[329] = "法律相關行業";
L_taiwan[330] = "流通/零售";
L_taiwan[331] = "交通/運輸/旅遊";
L_taiwan[332] = "娛樂/出版";
L_taiwan[333] = "傳播/行銷";
L_taiwan[334] = "藝術";
L_taiwan[335] = "待業中";
L_taiwan[336] = "其他";

L_taiwan[337] = "消逝的： ";
L_taiwan[340] = "表示該景點已經不復存在，僅剩下歷史文獻記載當作參考。如台南府城的大/小城門和台北舊火車站。";
L_taiwan[338] = "體驗的： ";
L_taiwan[341] = "表示該景點仍然存在，並沒有因為時間的流逝而消失。如現存的歷史文化地景(台南府城的大南門)、產業(度小月)、文物(翠玉白菜)等。";
L_taiwan[339] = "活化與再造的： ";
L_taiwan[342] = "表示該景點的景觀是被還原過或重新修復的，再度賦予新的用途。如台南仁德十鼓文創園區(過去為台糖糖廠)和台北松山文創園區(過去為松山菸廠)。";

//導覽地圖

L_taiwan[343] = "搜尋導覽員: ";

//歷史搜尋

L_taiwan[344] = "歷史記錄";
L_taiwan[345] = "瀏覽軌跡";
L_taiwan[346] = "行動軌跡";
L_taiwan[347] = "<h3>歷史記錄:記錄在DEH上所瀏覽過的POIs/LOIs/AOIs/SOIs</h3>";
L_taiwan[348] = "瀏覽軌跡:在DEH網頁上所瀏覽過的POIs/LOIs/AOIs/SOIs資訊";
L_taiwan[349] = "行動軌跡:在DEH APPs上所瀏覽過的POIs/LOIs/AOIs/SOIs資訊";
L_taiwan[350] = "景點";
L_taiwan[351] = "景線";
L_taiwan[352] = "景區";
L_taiwan[353] = "主題故事";
L_taiwan[354] = "查詢";
L_taiwan[355] = "時間";
L_taiwan[356] = "標題";

//文史脈流服務平台會員服務使用條款

L_taiwan[357] = "<strong>文史脈流服務平台會員服務使用條款</strong><br />歡迎您加入成為文史脈流服務平台的會員，所有使用會員服務的使用者(以下稱會員)，都應該詳細閱讀下列約定條款，這些約定條款訂立的目的，是為了保護會員服務的提供者以及所有使用者的利益，並構成使用者與會員服務提供者之間的契約。";
L_taiwan[358] = "若您未滿十八歲，應於您的家長（或監護人）閱讀、瞭解並同意本服務條款之所有內容及其後修改變更後，方得使用或繼續使用本服務。當您使用或繼續使用本服務時，即表示您的家長（或監護人）已閱讀、瞭解並同意接受本約定書之所有內容及其後修改變更。";
L_taiwan[359] = "使用者完成註冊手續、或開始使用文史脈流服務平台所提供的會員服務時，就視為已知悉、並完全同意本使用條款的所有約定：<br /><br /><strong>";
L_taiwan[360] = "<strong>一、會員服務</strong>&nbsp;<br /><br />1.&nbsp;確認會員申請後，將依本系統當時所建置的服務頻道、項目、內容、狀態及功能，對會員提供服務；本服務平台保留隨時新增、減少或變更各該服務頻道、項目、內容及功能之全部或一部份之權利，且不另行個別通知。<br />2.&nbsp;部份服務或項目可能係由本服務平台之合作夥伴所建置或提供、或需由會員進行個別申請或登錄程序、或需由會員付費使用，均依當時及隨後所修改的各該服務頻道及項目之使用說明及相關頁面而定。<br /> 3.&nbsp;本服務平台保留隨時變更免費服務為收費服務、以及變更收費標準之權利，變更後之內容，除公佈於各該網頁外，不另行個別通知。<br />4.&nbsp;部分會員服務可能另訂有相關使用規範或約定，會員應同時遵守各該服務頻道或項目之使用規範及相關約定。<br /><br />";
L_taiwan[361] = "<strong>二、帳號、密碼與安全性</strong>&nbsp;<br /><br />1.&nbsp;會員應完成註冊程序、提供會員註冊或流程中所要求的資料，並應擔保所提供的所有資料都是正確且即時的資料，如果會員所提供的資料事後有變更，會員應即時更新所留存的資料。如果會員未即時提供資料、未按指定方式提供資料、或所提供之資料不正確或與事實不符，本服務平台保留不經事先通知，隨時拒絕或暫停對該會員提供相關服務之全部或一部份之權利。<br />2.&nbsp;會員可以自行選擇使用者名稱和密碼，但會員有妥善自行保管和保密的義務，不得透漏或提供予第三人使用，對於使用特定使用者名稱和密碼使用會員服務之行為、以及登入系統後之所有行為，均應由持有該使用者名稱和密碼之會員負責。<br />3.&nbsp;會員如果發現或懷疑其使用者名稱和密碼被第三人冒用或不當使用，會員應立即通知本服務平台，以利本服務平台及時採取適當的因應措施；但上述因應措施不得解釋為本服務平台因此而明示或默示對會員負有任何形式之賠償或補償義務。<br /><br />";
L_taiwan[362] = "<strong>三、個人資料保護&nbsp;</strong><br /><br />1.&nbsp; 本服務平台會保護每一位會員的個人資料，對於會員所提供的個人資料，本服務平台只限於提供本服務的目的而使用。除了會員可能涉及違法、侵權、違反本使用條款或各該服務之使用規範或約定、或經本人同意外，本服務平台不會將會員個人資料提供給第三人。<br />2.&nbsp;在下列的情況下，本服務平台有可能會查看或提供會員的個人資料或相關電信資料給相關政府機關、或主張其權利受侵害並提出適當證明之第三人：<br />(1)&nbsp;依法令規定、或依司法機關或其他相關政府機關的命令；<br />(2)&nbsp;會員涉及違反法令、侵害第三人權益、或違反本使用條款或各該使用規範或約定；<br />(3)&nbsp;為保護會員服務系統之安全或經營者之合法權益；<br />(4)&nbsp;為保護其他使用者或其他第三人的合法權益；<br />(5)&nbsp;為維護本系統的正常運作;<br />3. 其他未規定之事項，依中華民國「個人資料保護法」之規定辦理。<br /><br />";
L_taiwan[363] = "<strong>四、資料儲存</strong><br /><br />1.&nbsp;會員應自行備份其所上傳、刊載或儲存於本系統內的所有資料。本服務平台將依當時本系統所設定之方式及處理能量，定期備份會員所儲存的資料，但不擔保會員所儲存的資料將全部被完整備份；會員同意，本服務平台不需對未備份、已刪除的資料或備份儲存失敗的資料負責。<br />2.&nbsp;本系統不擔保會員所上載的資料將被正常顯示、亦不擔保資料傳輸的正確性；如果會員發現本系統有錯誤或疏失，請立即通知本系統網站管理者。<br />3.&nbsp;本系統會自動偵測一定期間沒有使用的會員帳號，對於一定期間未登入使用之會員帳號，本系統將自動刪除該使用者帳號之所有郵件、檔案、使用者設定資料檔及相關資料，且不予另行備份，並暫停該使用者帳號之使用。有無登入使用之紀錄，以本服務平台會員服務系統內所留存之紀錄為準。<br /><strong><br />";
L_taiwan[364] = "五、會員服務之提供及使用</strong><br /><br />1.&nbsp;本服務平台或合作夥伴為提供會員服務所提供之所有相關網域名稱及網路位址，仍屬本服務平台或其他合法權利人所有，會員僅得於保有會員資格之期間內，依本使用條款及各該使用規範或相關約定所約定之方式加以使用，且會員不得將其會員資格或會員權益移轉、出租或出借予任何第三人。<br />2.&nbsp;會員服務內所提供之搜尋、檢索或找圖之服務或功能，係電腦程式系統所提供之自動化服務及軟體工具，由使用者自行依照所選定或設定之條件或內容，進行搜尋或檢索；因此所得之搜尋、檢索或找圖之結果、相關連結及其內容，本系統不擔保所有資料將被正常顯示、亦不擔保資料傳輸的正確性。<br />3.&nbsp;針對特定會員服務，本服務平台可能接洽合作夥伴或其他廠商提供相關圖檔、圖片或其他著作或資料，供會員瀏覽、檢索或使用，但使用者需遵守相關授權約定或限制。該等圖檔、圖片及其他著作或資料之合法性，均由提供各該圖檔、圖片及其他著作或資料之合作夥伴或廠商自行負責。<br />4.&nbsp;會員在本系統所提供的伺服器空間上建置的任何資料（包括且不限於文字、圖片、影片、檔案或其他資料）或頁面，其相關所有權及廣告版面經營權，均仍歸本服務平台所有，除另行取得本服務平台事前同意外，不論是否有償，會員不得自行由經由第三人以任何方式銷售、經營、或提供網路廣告或類似業務。<br />5.會員所申請的帳號除了可以用在此「文史脈流行動導覽服務」平台外，亦可使用在其餘客製化平台 (如「踏溯台南行動導覽服務」) 上，包含網站及APPs。<br>6. 會員在「文史脈流行動導覽服務」平台所上傳的內容 (POIs/LOIs/AOIs/SOIs) 可挑選自己製作的POIs/LOIs/AOIs/SOIs匯入至其餘的客製化平台上。<br><br />";
L_taiwan[365] = "<strong>六、使用者行為</strong><br /><br />1.&nbsp;會員不得為未經事前授權的商業行為。<br />2.&nbsp;會員上傳或刊載於各類會員服務內的資訊（包括且不限於文字、圖片、影片、檔案或其他資料），均由電腦系統自動依會員之指令，上傳、刊載或儲存於各類會員服務相關網頁及位置，本服務平台不負責審查、核對或編輯。<br />3.&nbsp;會員必須遵守相關法令規範，且不得從事下列行為：<br />(1)&nbsp;傳送任何違反中華民國技術資料輸出等相關法令之郵件、檔案或資料。<br />(2)&nbsp;刊載、傳輸、發送或儲存任何誹謗或妨害他人名譽或商譽、詐欺、猥褻、色情、賭博、違反公序良俗或其他違反法令之郵件、圖片、檔案或資料。<br />(3)&nbsp;刊載、傳輸、發送或儲存任何侵害他人智慧財產權或其他權益的著作或資料。<br />(4)&nbsp;未經同意收集他人電子郵件位址以及其他個人資料。<br />(5)&nbsp;未經同意擅自摘錄或使用會員服務內任何資料庫內容之全部或一部份。<br />(6)&nbsp;刊載、傳輸、發送、儲存病毒、或其他任何足以破壞或干擾電腦系統或資料的程式或訊息。<br />(7)&nbsp;破壞或干擾會員服務的系統運作或違反一般網路禮節之行為。<br />(8)&nbsp;在未經授權下進入會員服務系統或是與系統有關之網路，或冒用他人帳號或偽造寄件人辨識資料傳送郵件，企圖誤導收件人之判斷。<br />(9)&nbsp;任何妨礙或干擾其他使用者使用會員服務之行為。<br />(10)&nbsp;傳送幸運連鎖信、垃圾郵件、廣告信或其他漫無目的之郵件。<br />(11)&nbsp;任何透過不正當管道竊取會員服務之會員帳號、密碼或存取權限之行為。<br />(12)&nbsp;其他不符合會員服務所提供的使用目的之行為。<br />4.&nbsp;如果會員或第三人所上傳、刊載、傳輸、發送或儲存之任何文字、圖片、影片、檔案或其他著作或資料，有任何違反法令或侵害第三人權益之虞、或違反本使用條款或其他使用規範或約定、或經第三人主張涉及侵權或其他合法性爭議，本服務平台有權隨時不經通知，直接加以刪除、移動或停止存取，或對各該會員停止提供會員服務之全部或一部份；為該等行為之會員，除須自負因此所生之法律責任外，對於本服務平台因此所受之損害及所支出之費用，並應負賠償及償還之責任。<br /><br />";
L_taiwan[366] = "<strong>七、權利歸屬及會員對本服務平台的授權</strong><br /><br />1.&nbsp;會員服務所提供的所有網頁設計、介面、URL、商標或標識、電腦程式、資料庫等，其商標、著作權、其他智慧財產權及資料所有權等，均屬於本服務平台或授權本服務平台使用之合法權利人所有。<br />2.&nbsp;本服務平台之各項會員服務，僅提供相關伺服器空間及系統供會員使用，會員不因此而取得本服務平台及個別會員服務的相關商標、著作權或其他智慧財產權之授權。 <br />3. 會員自行上傳、建置、刊載及儲存於本服務之資訊，同意授權留存於本平台使用，供網友瀏覽、推薦等非商業行為之用途。<br />4.&nbsp;會員自行上傳、建置、刊載及儲存於會員服務內之所有著作及資料，其著作權或其他智慧財產權仍然歸會員或授權會員使用之合法權利人所有；但會員除必須擔保該等著作或資料絕無違反法令或侵害第三人權益外，並同意授權本服務平台得儲存、刊載於網站上，並得經由網站，以本服務平台所認為適當之方式，包括為配合不同軟體或硬體設備所製作或轉換之各種不同版本或格式，例如適合於網路線上閱讀之版本、以及可供下載於各種不同電腦設備(包括智慧型手機、行動裝置、以及將來市場上所開發之類似設備)之不同版本或格式等，提供予特定或不特定之人於線上瀏覽、查詢、檢索、離線閱讀或接收，只要不涉及商業行為皆可自由使用。會員並同意授權本服務平台得自行挑選會員已上傳、建置、刊載及儲存於各項會員服務內之著作及資料，單獨、彙整、或與其他會員之著作及資料集結後發行電子報或類似電子訊息，包括但不限於使用於為配合本服務平台及各項會員服務之行銷或推廣目的所發送之電子報及相關訊息。除了隨同各該會員服務一起移轉或再授權外，本服務平台不會將會員所上傳、刊載及儲存的著作及資料單獨轉讓或再授權給第三人。<br>5. 本服務平台會蒐集會員的瀏覽紀錄及上傳資料之位置紀錄作為會員行動軌跡及瀏覽軌跡之使用。<br><br /><br />";
L_taiwan[367] = "<strong>八、責任排除及限制</strong><br /><br />1.&nbsp;對於本服務平台所提供之各項會員服務，均僅依各該服務當時之功能及現況提供使用，對於使用者之特定要求或需求，包括但不限於速度、安全性、可靠性、完整性、正確性及不會斷線和出錯等，本服務平台不負任何明示或默示之擔保或保證責任。<br />2.&nbsp;本服務平台不保證任何郵件、檔案或資料之傳送及儲存均係可靠且正確無誤，亦不保證所儲存或所傳送之郵件、檔案或資料之安全性、可靠性、完整性、正確性及不會斷線和出錯等，因各該郵件、檔案或資料傳送或儲存失敗、遺失或錯誤等所致之損害，本服務平台不負賠償責任。<br />3.&nbsp;因本服務平台所提供的會員服務本身之使用，所造成之任何直接或間接之損害，本服務平台不負任何賠償責任，即使係本服務平台曾明白提示注意之建議事項亦同。<br /><br />";
L_taiwan[368] = "<strong>九、服務暫停或中斷</strong><br /><br />1.&nbsp;會員服務系統或功能之例行性維護、改置或變動所發生之服務暫停或中斷，本服務平台將於暫停或中斷前，以電子郵件、公告或其他適當之方式告知會員。<br />2.&nbsp;在下列情形，本服務平台將暫停或中斷會員服務之全部或一部份，且對使用者因此所受之所有直接或間接損害，不負賠償責任：<br />(1)&nbsp;對會員服務相關軟硬體設備進行搬遷、更換、升級、保養或維修時；<br />(2)&nbsp;使用者有任何違反法令、本使用條款或各該使用規範及約定之情形；<br />(3)&nbsp;因第三人之行為、天災或其他不可抗力所致之會員服務停止或中斷；<br />(4)&nbsp;因其他非本服務平台所得完全控制或不可歸責於本服務平台之事由所致之會員服務停止或中斷。<br />3.&nbsp;會員付費使用之加值服務，如因會員違反相關法令、違反本使用條款或各該使用規範或約定，或因法令規定或依相關主管機關之要求、或因其他不可歸責於本服務平台之事由，而致付費加值服務全部或一部份暫停或中斷時，暫停或中斷期間仍照常計費。<br /><br />";
L_taiwan[369] = "<strong>十、終止服務</strong><br /><br />1.&nbsp;基於服務平台運作，本服務平台保留隨時停止提供會員服務之全部或一部份之權利，本服務平台不因此而對會員負賠償或補償之責任。<br />2.&nbsp;如會員違反本使用條款或各該會員服務之使用規範或約定，本服務平台保留隨時暫時停止提供服務、或終止提供服務之權利，且不因此而對會員負任何賠償或補償之責任。<br /><br />";
L_taiwan[370] = "<strong>十一、本使用條款之修改</strong><br /><br />本服務平台保留隨時修改本會員服務使用條款及各該使用規範或約定之權利，修改後的內容，將公佈在會員服務相關網頁上，不另外個別通知使用者。<br /><br />";
L_taiwan[371] = "<strong>十二、準據法及管轄權</strong>&nbsp;<br /><br />1.&nbsp;本使用條款及各該會員服務之相關使用規範及約定，均以中華民國法令為準據法。&nbsp;<br />2.&nbsp;因會員服務、或本使用條款及各該會員服務之相關使用規範及約定所發生之爭議，如因此而訴訟，以台灣台南地方法院為第一審管轄法院。";
L_taiwan[372] = "<strong>十三、其他 </strong>";
L_taiwan[373] = "本條款未盡事宜，雙方同意按相關法規及誠信原則公平處理。 ";
L_taiwan[374] = "我有詳細閱讀，瞭解和接受";
L_taiwan[375] = "確認";
L_taiwan[376] = "請勾選接受後確認";

//intro

L_taiwan[377] = "「文史脈流行動數位文化資產導覽服務平台」為一開放式平台，提供 (1)文化資產行動數位內容予大家(i) 利用手機或平板電腦進行現地的文化資產導覽或(ii)在桌機、手機或平板電腦上進行虛擬的文化資產導覽，和(2)各種軟體工具予大家製作及存放各種型態的文化資產行動數位內容 (Mobile Digital Culture Heritage Content)。";
L_taiwan[378] = "文化資產行動數位內容分類";
L_taiwan[379] = "文化資產行動數位內容的型態 (Category)";
L_taiwan[380] = "<ul><li>景點 (Point Of Interest, POI):<br> 單一的景點介紹,導覽的最基本單位.</li><li> 景線 (Line Of Interest, LOI):<br>以導覽情境為考量,設計出有地域關聯性的一條導覽景點路線(A sequence of POIs),為一有參訪先後次序規劃的景線.</li><li>景區 (Area Of Interest, AOI):<br> 以一特定區域之文化資產為主軸,設計出有地域關聯性的一組導覽景點區域(A set of POIs),得為一有故事性的景區.<li>主題故事/場域(Story/Site of Interest, SOI):<br>針對一(i)跨越多個時間/空間之相關人/事/物的故事或(ii)某個特定場域之相關人/事/物的故事,設計出的一個包涵許多景點(POIs),景線(LOIs)和景區(AOI)的主題故事；<br>一個主題故事 (SOI)可由多個(1)景點(POIs),(2)景線(LOIs), (3)景區(AOI), (4)景點(POIs)和景線(LOIs), (5)景點(POIs)和景區(AOI), (6)景線(LOIs)和景區(AOI), 或 (7)景點(POIs),景線(LOIs)和景區(AOI)組成。</li>";
L_taiwan[381] = "文化資產行動數位內容的級別 (Class)";
L_taiwan[382] = " <ul><li>專家</li><li>玩家</li><li>導覽解說員</li></ul>";
L_taiwan[383] = "文化資產行動數位內容的語言 (Language)";
L_taiwan[384] = "<ul><li>中文</li><li>英文</li><li>日文</li></ul>";
L_taiwan[385] = "中文版文化資產行動數位內容的地區 (Region)";
L_taiwan[386] = "<ul><li>可使用中文製作及導覽全世界國家及地區的景點/景線/景區(手機設定為中文模式)</li><li>台灣: 以縣/市-鄉/鎮/區為單位區域</li><li>世界各國: 以國家為單位區域</li></ul>";
L_taiwan[387] = "外文版文化資產行動數位內容的地區 (Region)";
L_taiwan[388] = "<ul><li>可使用英/日文製作及導覽全世界國家及地區的景點/景線/景區 (手機設定為英/日文模式)</li><li> 英文: 台灣: 以縣/市-鄉/鎮/區為單位區域<br>世界各國: 以國家為單位區域</li><li>日文: 台灣: 以縣/市-鄉/鎮/區為單位區域<br>日本:</li></ul>";
L_taiwan[389] = "景點(POI)內容分類";
//L_taiwan[390] = "<ul><li>消逝的: 表示該景點已經不復存在，僅剩下歷史文獻記載當作參考。如台南府城的大/小城門和台北舊火車站。</li><li>體驗的: 表示該景點仍然存在，並沒有因為時間的流逝而消失。如現存的歷史文化地景(台南府城的大南門)、產業(度小月)、文物(翠玉白菜)等。</li><li>活化與再造的: 表示該景點的景觀是被還原過或重新修復的，再度賦予新的用途。如台南仁德十鼓文創園區(過去為台糖糖廠)和台北松山文創園區(過去為松山菸廠)。</li></ul>";
//L_taiwan[391] = "景點主題 (Subject)";
//L_taiwan[392] = "景點類型 (Type)";
//L_taiwan[393] = "<ul><li>自然景觀</li><li>人文景觀</li><li>事件</li><li>人物</li><li>產業</li></ul>";
L_taiwan[394] = "景點範疇 (Format)";
L_taiwan[395] = "<ul><li>古蹟</li><li>歷史建築</li><li>紀念建築</li><li>聚落建築群</li><li>考古遺址</li><li>史蹟</li><li>文化景觀</li><li>古物</li><li>自然景觀</li><li>傳統表演藝術</li><li>傳統工藝</li><li>口述傳統</li><li>民俗</li><li>傳統知識與實踐</li><li>一般景觀(建築/人工地景/自然地景)</li><li>植物</li><li>動物</li><li>生物</li><li>食衣住行育樂</li><li>其他</li></ul>";
L_taiwan[396] = "景點媒體類別 (Media Type)";
L_taiwan[397] = "<ul><li>照片 (Picture) + 文字</li><li>影片 (Movie) + 文字</li><li>聲音 (Audio) + 文字</li></ul>";
L_taiwan[398] = "景點語音導覽解說";
L_taiwan[399] = " <ul><li>景點製作者得附加相關之語音導覽解說，讓使用者可更深入得了解相關景點。</li></ul>";
L_taiwan[400] = "景點使用權限";
L_taiwan[401] = "<ul><li>公開</li><li>不公開(私有)</li></ul>";
L_taiwan[402] = "<h5 class=\"page-header\">此平台所提供的網站, 請輸入<a href=\"http://deh.csie.ncku.edu.tw\">http://deh.csie.ncku.edu.tw</a> 系統會自動導入</h5><ul><li>桌機版</li><li>手機及平板電腦版</li></ul>";
L_taiwan[403] = "DEH平台所提供的APPs";
L_taiwan[404] = "<div class=\"panel panel-info\"><div class=\"panel-heading\"><h3>純導覽</h3></div><div class=\"panel-body\"><ul> <li><strong>DEH Lite<strong style='color:red;'>(暫不提供)</strong></strong>:<br> 展現附近相片(image)、聲音(audio)和影片(video)景點(Point Of Interests, POIs);播放景點(POI)內含之語音導覽解說;使用FB, Line及其它工具分享相關景點(POI)。</li><li><strong>DEH Mini II</strong>:<br>展現附近/我的相片(image)、聲音(audio)和影片(video)景點(POIs)及附近/我的景線(Line Of Interests , LOIs)和景區(Area Of Interests, AOIs);播放景點(POI)內含之語音導覽解說;使用FB, Line及其它工具分享相關景點(POI)。</li><li><strong>Narrator<strong style='color:red;'>(暫不提供)</strong></strong>:<br>此APP可讓導覽解說員打開其手機Wi-Fi熱點的功能，讓參加導覽解說的成員可用其手機上之Wi-Fi網路連線到導覽解說員的Wi-Fi熱點，由此分享到導覽解說員的文字及影音景點的輔助導覽解說。導覽解說員可以利用此APP下載其所在地點附近文化資產之相片／影片／聲音景點（景線／景區）資訊，藉此可運用手機或平板電腦輔助其進行增加文字及影音的文化資產解說。</li></ul></div></div>";
L_taiwan[405] = "純製作POIs";
L_taiwan[406] = "<ul><li><strong>DEH Make II</strong>:<br>製作相片(image)、影片(video)和聲音(audio)景點(POI);錄製景點(POI)之相關語音導覽解說;使用FB, Line及其它工具分享製作好之景點(POI)。<br>群組功能:建立自己群組或者申請加入他人的群組，群組leader可以驗證群組內所有成員建立POI/LOI/AOI/SOI。</li></ul>";
L_taiwan[407] = "<div class=\"panel-heading\"><h3>導覽及製作POIs</h3></div><div class=\"panel-body\"><ul><li><strong>DEH Image<strong style='color:red;'>(暫不提供)</strong></strong>:<br>製作相片(image)、影片(video)和聲音(audio)景點(POI);錄製景點(POI)之相關語音導覽解說;使用FB, Line及其它工具分享製作好之景點(POI)。</li><li><strong>DEH Video<strong style='color:red;'>(暫不提供)</strong></strong>:<br>製作影片(video)景點(POI)及錄製景點(POI)之相關語音導覽解說;展現我的影片(video)景點(POI);使用FB, Line及其它工具分享製作好之影片(video)景點(POI)。</li><li><strong>DEH Audio<strong style='color:red;'>(暫不提供)</strong></strong>:<br>製作聲音(audio)景點(POI)及錄製景點(POI)之相關語音導覽解說;展現我的聲音(audio)景點(POI);使用FB, Line及其它工具分享製作好之聲音(audio)景點(POI)。</li></ul></div>";
L_taiwan[408] = "<div class=\"panel-heading\"><h3>純導覽</h3></div><div class=\"panel-body\"><ul><li><strong>DEH Micro<strong style='color:red;'>(暫不提供)</strong></strong>:<br>展現附近相片(image)景點(POIs)、景線(Line Of Interests , LOIs)和景區(Area Of Interests, AOIs);使用FB, Line及其它工具分享相關景點(POI)。</li></ul></div>";
L_taiwan[409] = "<h5 class=\"page-header\">此平台所提供的網站, 請輸入<a href=\"http://deh.csie.ncku.edu.tw\">http://deh.csie.ncku.edu.tw</a> 系統會自動導入</h5><ul><li>桌機版</li><li>手機及平板電腦版</li></ul>";
L_taiwan[410] = " <h1 class=\"page-header\">平台可能使用對象及情境(不限定,不限制,請使用者發想)</h1><ul><li> 庶民生活圈:<br>社區發展協會存放其社區文史和自然景觀資料<br>原住民部落存放其文史紀錄和自然景觀資料</li><li>場域:<br>農/林/漁/牧園區及民宿<br>自然景觀園區<br>博物館/文物館文資園區</li><li>文史工作者/室:<br>數位化及存放其在地文史資料</li><li>國家公園和國家風景區:<br>數位化及存放其自然景觀資內容</li><li>文化資產導覽解說員</li><li>出租車/計程車包車旅遊之司機導覽解說員</li><li>傳統文化資產保留與運用:<br>古蹟<br>歷史建築<br>聚落<br>遺址<br>文化景觀</li><li>學校教育:<br>高/中/小學數位行動/戶外/鄉土教學<br>大學文/史/觀光/休憩等學系之台灣古蹟文化資產相關課程<br>社區大學課程<br>大學通識課程</li><li>普羅大眾深度旅遊日記</li><li>場域主題故事</li></ul>";
L_taiwan[411] = "平台使用情境列舉";
L_taiwan[412] = "<div class=\"panel-heading\"><h3>情境1: 社區發展協會/原住民部落導覽/場域/民宿</h3></div><div class=\"panel-body\"><ul><li> 規劃景區(AOI)及製作景點(POIs):<br>古蹟,歷史建築,聚落<br>遺址<br>文化景觀<br>自然景觀<br>民俗及有關文物<br>消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs<br></li><li>自製景線(LOIs):<br>依各個主題特性，規劃及設計出相關之數條景線</li><li>現地解說及導覽 - 社區,部落和場域解說員</li><li>自助旅遊 – 利用手機或平板電腦之自助解說導覽</li></ul></div>";
L_taiwan[413] = "<div class=\"panel-heading\"><h3>情境2:大/高/中/小學數位行動/戶外/鄉土教學&社區大學在地文化資產課程</h3></div><div class=\"panel-body\"><ul><li>導覽課程一:<br>現有景點(POIs)=>設製景區(AOI)/景線(LOI)</li><li>導覽課程二:<br>現有景點+老師/學生自製景點(POIs)(導覽前先製)<br>=>設製景區(AOI)/景線(LOI)</li><li>導覽課程三:<br>現有景點(POIs)=>設製景區(AOI)/景線(LOI)+  老師/學生on-touring時收集內容 (調查,紀錄,照相, 錄影, 錄音)<br>=>導覽後製作景點(POIs)/景區(AOI)/景線(LOI) (家庭作業)</li><li>Pure家庭作業 without現地導覽:<br>行動數位化在地鄉土文化資產製作景點(POIs)/景區(AOI)/景線(LOI)</li></ul></div>";
L_taiwan[414] = "<div class=\"panel-heading\"><h3>情境3:行動文化資產導覽解說員</h3></div><div class=\"panel-body\"><ul><li>古蹟,歷史建築,聚落<br>遺址<br>文化景觀<br>自然景觀<br>民俗及有關文物<br>消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs</li><li>公開景點及私房景點</li><li>設計各類景線(LOIs) for 不同類之旅由個人或團體:<br>公開景線及私房景線</li><li>現地解說及導覽</li><li>可以一(或多)個旗艦(Flag-Ship)景點搭配周邊其它景點組成各類景線(LOI)和景區(AOI)</li><li>可為解說員/場域廣告行銷之方法:<br>網路廣告 (藉由FB):全由公開景點組成<br>實際導覽:含一些公開景點及一些不公開之私房景點 (自己開發出私藏景點)</li><li>分成春夏秋冬4種POIs/LOIs/AOIs</li><li>每年更新內容:<br>同樣的場域: 不同的人/事/物<br>開發不同的場域:不同的人/事/地/物<br>去年的私房景點變成今年自己或他人的公開景點<br>今年再開發自己的不公開之私房景點<br></li></ul></div>";
L_taiwan[415] = "<div class=\"panel-heading\"><h3>情境4: 文史工作者/室</h3></div><div class=\"panel-body\"><ul><li>依擁有之文史資料及知識擇定目標文化資產景區(AOI)及製作景點(POIs):<br>古蹟,歷史建築,聚落<br>遺址<br>文化景觀<br>自然景觀<br>民俗及有關文物<br>消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs<br></li><li>設計各類主題景線(LOIs)</li><li>目的:<br>文化資產保留及傳習<br>現地解說及導覽<br>來訪之自助旅遊人士</li></ul></div>";
L_taiwan[416] = "<div class=\"panel-heading\"><h3>情境5:普羅大眾深度旅遊</h3></div><div class=\"panel-body\"><ul><li> 旅行前:路線規劃(在DEH web site(http://deh.csie.ncku.edu.tw)<br>搜尋景點, 建立旅遊景線/景區 (LOI /AOI)<br>選擇專家或玩家景線/景區(LOI /AOI)<br>參考專家或玩家景線/景區(LOI /AOI),建立旅遊景線/景區 (LOI /AOI)</li><li>旅行中:實地導覽(使用DEH Mini II)<br>及時景點介紹<br>目的地導航<br>實地導覽<br>使用DEH Make II照相,錄影,及錄音,製作POIs,上傳至DEH server</li><li>旅行後:<br>在回程的車上或回家後, 到DEH web site(http://deh.csie.ncku.edu.tw) 整理完成上傳之相片/影片/聲音各類POIs<br>撰製景區和景線<br>完成旅遊日記, 放送至FB, Line, 微博, etc.,分享親朋好友 </li></ul></div>";
L_taiwan[436] = "<div class=\"panel panel-info\" id = \"Platform_use_scenario6\"><div class=\"panel-heading\"><h3>情境6:場域主題故事</h3></div><div class=\"panel-body\"><ul><li>目的:<br>打造及行銷特定場域，活動或故事</li><li>原則:<br>依場域之實際或傳說的在地人物/事件/景觀/產業, 選定目標國內/外目標人士,打造主題場域或故事 (Site/Story Of Interest, SOI)<br></li><li>內容:<br>撰寫主題故內容(SOI);設計及規劃景線(LOIs)和景區(AOIs);製作景點(POIs)。<br></li><li>目標:<br>保留及宣傳在地文化資產;增加導覽解說員之工作機會及收入;提升在地產業、增加/創造在地工作機會。</li></ul></div></div>";
L_taiwan[417] = "APP 下載";
L_taiwan[418] = "<li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=com.mmlab.m1\">在Google Play上取得DEH-Mini II (景點導覽)</a></li><li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=edu.deh.make_II\">在Google Play上取得DEH-Make II (景點製作)</a></li>";
L_taiwan[419] = "<li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-lite/id1347669266?l=zh&mt=8\">在Apple Store上取得DEH-Mini II (景點導覽)</a></li><li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-make/id1324053125?l=zh&mt=8\">在Apple Store上取得DEH-Make II (景點製作)</a></li>";
L_taiwan[420] = "<a class=\"btn btn-lg btn-default btn-block\" id=\"handout-2\">使用手冊下載</a><li><a class=\"link-2\" href=\"/static/activites/DEH_Make_II_使用手冊.pptx\">DEH Make II使用手冊</a></li><li><a class=\"link-2\" href=\"/static/activites/DEH_Mini_II_使用手冊.pptx\">DEH Mini II使用手冊</a></li><li><a class=\"link-2\" href=\"/static/activites/DEH_網站_使用手冊.pptx\">DEH 網站 使用手冊</a></li></ul>";
L_taiwan[421] = " <a class=\"btn btn-lg btn-default btn-block\" id=\"intro_video-2\">使用情境影片</a><ul class=\"intro_video-1\"><li><a class=\"link-3\" href=\"https://youtu.be/ht5Y4-xPxT4\" target=\"_blank\">文史脈流－踏溯台南之歡樂篇</a></li><li><a class=\"link-3\" href=\"https://www.youtube.com/watch?v=yFi8ueKYpC8&feature=youtu.be\" target=\"_blank\">文史脈流－踏溯台南之邂逅篇</a></li></ul>";
L_taiwan[438] = "DEH平台之進階功能"
L_taiwan[439] = "<div class=\"panel panel-info\"><div class=\"panel-heading\"><h3>群組功能</h3></div><div class=\"panel-body\"><ul><li>DEH平台的群組功能與FB/Line的群組功能的差別是群組建立(Group Leader)者有權力修成員做的景點/線/區和主題故事的內容及各種屬性。<br></li>\
                <li>使用情境:<br>i)每班開課老師建一群組，該班學生將其為這門課製作的景點/線/區和主題故事作業內容，歸類在此群組，老師到此群組內即可很容易找到學生的作品;可為社團建個群組，並將社團的社員邀請進來，之後這些社員上傳的景點/線/區和主題故事內容可歸納在此群組，在群組就可看到社團所有成員的作品。開課/社團指導老師可利用群組建立者(Group Leader)的權限，修改學生/社員做的景點/線/區和主題故事的內容及種屬性(公開<->不公開)，如一般學生/社員繳交的紙本(或.docx)作業般，可修改內容。<br>ii)景線/景區群體創作:<br>*負責人建立群組，邀請組員加入此群組。<br>\
                *每個組員將分工後負責的景點內容製作好並上傳後，歸類在此群組中，大家即可很方便看到其他人做的內容。<br>*群組負責人將組員們製作的景點內容修改後，點選全部或部份景點，組成目標景線/景區。<br>iii)主題故事群體創作:<br>*負責人建立群組，邀請組員加入此群組。<br>*每個組員將分工後負責的景點/線/區內容製作好並上傳後，歸類在此群組中，大家即可很方便看到其他人做的內容。<br>*群組負責人將組員們製作的景點/線/區內容修改後，點選全部或部份景點/線/區內容，組成目標主題故事。<br></li></ul></div></div>";
L_taiwan[440] = "<div class=\"panel panel-info\">\
                <div class=\"panel-heading\">\
                    <h3>\文資學堂-類似寶可夢(Pokemon Go)般的互動功能</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul>\
                        <li>\
                            類似寶可夢般(Pokemon Go-like)互動功能的「文資學堂」，讓使用者可利用手機在走動中進行空中抓題/搶題回答:<br>\
                            1)題目可設定在(a)某個定點n公尺/公里範圍內的(b)某個時段可以有© k個人可答對。<br>\
                            2)答案可為是非、選擇或問答(文字+照片、影片或聲音)。<br>\
                            3)題目可為純文字或文字+照片、影片and/or聲音。<br>\
                            4)在APP DEH Mini II (Android/iPhone)的「文資學堂」中具啟動、搶題、答題、答案揭示和績分呈現功能。<br>\
                            5)具彈性的走讀設定方式、客製化評分功能、自動化計分及排名統計和搶題與答題歷史紀錄功能。<br>\
                            6)使用情境:<br>\
                            &nbsp&nbsp&nbspi)大學通識/文史和高/中/小學在地鄉土/文化導覽課程進行現地導覽解說後，可由老師啟動「文資學堂」，讓學生在當下當地進行「寓試於樂」的空中搶題和答題。<br>\
                            &nbsp&nbsp&nbspii)文化資產解說員在進行導覽解說後，可以讓成員在自由活動時藉由「文資學堂」進行答題，增加趣味及娛樂性。<br>\
                            &nbsp&nbsp&nbspiii)在一些活動(如台灣燈會、花博、農博、節慶等)或場域(如國家公園、國家風景區、文化園區等)推出的定時導覽解說(如10:00~11:00；14:00~15:00)，於解說完後，可以進行n分鐘的類似寶可夢(Pokémon Go)的「文資學堂」有獎搶題/答題活動，增加參與民眾的互動性與趣味性。<br>\
                            &nbsp&nbsp&nbspiv)配合ABC節慶/活動、XYZ日/周/月、…，針對特定主題場域或故事先建置100~1000~n個文資景點(POIs)，(及組成一些景線(LOIs)/景區(AOIs))，讓普羅大眾自行自助導覽(或請文史解說員定時定點解說)。之後設定在某些地方/某些日期/某些時段進行n分鐘的類似寶可夢(Pokémon Go)的「文資學堂」有獎搶題/答題活動，達到寓教於樂的「深度了解ABC」。<br>\
                        </li>\
                    </ul>\
                </div>";
                
//game

L_taiwan[424] = "<li><a href=\"/game\">文資學堂</a></li>";
L_taiwan[425] = "走讀群組";
L_taiwan[426] = " <thead><tr><th><p style=\"color:#00F; display:inline;\">{{g.foreignkey.group_name}}</p><p style=\"color:#00F; display:inline;\">({% if g.foreignkey.verification == 0  %}尚未驗證 /{% elif g.foreignkey.verification == 1  %}已驗證通過 /{% else %}驗證不通過 /{% endif %} {% if g.foreignkey.open == 1 %}公開{% else %}不公開{% endif %})</p><div class=\"btn btn-success\" style=\"float: right; margin-right: 10px;\" onclick=\"document.location='game_room/{{g.foreignkey.group_id}}'\">選擇群組</div></th></tr></thead>";
L_taiwan[430] = "尚未驗證 / ";
L_taiwan[431] = "已驗證通過 / ";
L_taiwan[432] = "驗證不通過 / ";
L_taiwan[433] = "公開";
L_taiwan[434] = "非公開";
L_taiwan[435] = "選擇群組";

// game_room

L_taiwan[427] = "場次";
L_taiwan[428] = "新增場次";
L_taiwan[429] = "文資學堂匯入範例檔案下載";

//群組說明最後一行
L_taiwan[437] = "群組建立(Group Leader)者有權力修成員做的景點/線/區和主題故事的內容及各種屬性(公開<->不公開)。"


L_taiwan[441] = "文資學堂成績查詢"
L_taiwan[442] = "總瀏覽次數"
L_taiwan[443] = "轉"
L_taiwan[444] = "WEB瀏覽次數"
L_taiwan[445] = "APP瀏覽次數"
L_taiwan[446] = "瀏覽總數"
L_taiwan[447] = "文史專家創作空間"
L_taiwan[448] = "導覽解說員創作空間"
L_taiwan[449] = "玩家創作空間"
L_taiwan[450] = "文史專家創作景點、景線、景區、主題故事"
L_taiwan[451] = "導覽解說員創作景點、景線、景區、主題故事"
L_taiwan[452] = "玩家創作景點、景線、景區、主題故事"

L_taiwan[453] = "全部同意"
L_taiwan[454] = "申請加入群組"
L_taiwan[455] = "拒絕加入群組"
L_taiwan[456] = "尚未驗證"
L_taiwan[457] = "已驗證通過"
L_taiwan[458] = "驗證不通過"
L_taiwan[459] = "探索 - 搜尋公開且驗證通過之群組"
L_taiwan[460] = "邀請 - 發出訊息邀請成員加入(DEH帳號)"
L_taiwan[461] = "通知 - 群組邀請(申請加入群組/組頭邀請加入群組)通知"
L_taiwan[462] = "根據地址自動產生"
L_taiwan[463] = "景點製作"
L_taiwan[464] = "我所獲得的獎品列表"

//japan
L_japan = new Array();
L_japan[0] = "<p> <li>POI（Point Of Interest）：単一の導入ポイントのアトラクション、最も基本的なナビゲーションユニット\
                </li> <br> <li>興味のある行（LOI）：状況を考慮するルートを表示し、\
                計画ポイントの継承訪問の地理的関連性を持つように設計されています\
                POIのシーケンス </li> <br> <li>AOI（Interest Of Area）：地域協会とのPOIのセットは、特定の地域の文化財に基づいて設計されています。\
                </li> <br> <li>ストーリー/興味のある場所（SOI）：（i）人/物や物語の話に関連する多くの時間/空間にわたる物語/フィールド、または（ii）\
                多くのアトラクション（POI）、風景（LOI）、および景勝地（AOI）を含むことができる物語をデザインした人物/物物の関連記事。</p>";
L_japan[1] = "<i class='fa fa-fw fa-check'></i>モバイル文化資産マップ";
L_japan[2] = "<i class='fa fa-fw fa-check'></i>エキスパー スペース";
L_japan[3] = "<i class='fa fa-fw fa-check'></i>ガイド スペース";
L_japan[4] = "<i class='fa fa-fw fa-check'></i>ユーザー スペース";
L_japan[5] = "エキスパー作成のスポット、ルート、エリア、場域";
L_japan[6] = "ガイド作成のスポット、ルート、エリア、場域";
L_japan[7] = "ユーザー作成のスポット、ルート、エリア、場域";

L_japan[8] = "ビューに移動します";
L_japan[9] = "--選択--";
L_japan[10] = "エキスパートマップ";
L_japan[11] = "ユーザーマップ";
L_japan[12] = "ガイドマップ";
L_japan[13] = "せいさく";
L_japan[14] = "せいさく";
L_japan[15] = "せいさく";
L_japan[20] = "今日のスポットを表示する";
L_japan[21] = "今日のルートを表示する";
L_japan[22] = "今日のエリアを表示する";
L_japan[23] = "今日の場域を表示する";
L_japan[24] = "アプリをダウンロード";
L_japan[25] = "関連ファイルをダウンロード";

//navbar
L_japan[16] = "創建";
L_japan[17] = "サインアウト";
L_japan[18] = "サインイン";
L_japan[19] = "はじめに";

//header
L_japan[26] = "台湾歴史散策ナビ";

//sidebar
L_japan[31] = "お気に入りスポット/ルート/エリア/場域";
L_japan[32] = "スポットを追加";
L_japan[33] = "ルートを追加";
L_japan[34] = "エリアを追加";
L_japan[35] = "場域を追加";
L_japan[271] = "グループを管理";
L_japan[272] = "グループを追加";

//map_player
L_japan[36] = "テーマ選択";
L_japan[37] = "エリア";
//L_japan[38] = "テーマ";
//L_japan[39] = "分類";
L_japan[40] = "フォーマット";
L_japan[41] = "ファイル形式";
L_japan[42] = "スポット";
L_japan[43] = "ルート";
L_japan[44] = "エリア";
L_japan[45] = "場域";
L_japan[46] = "全部";
L_japan[47] = "現存している";
L_japan[48] = "再建と復建による他目的活用";
L_japan[49] = "現存していない";
L_japan[50] = "人物";
L_japan[51] = "出来事";
L_japan[52] = "文化的背景による産物";
L_japan[53] = "自然的背景による産物";
L_japan[54] = "產業";
L_japan[55] = "<option class=\"all\" value=\"all\">すべて</option>\
                <option id=\"Historical\" value=\"古蹟\">古跡</option>\
                <option id=\"historical_buildings\" value=\"歷史建築\">歴史的建造物</option>\
                <option id=\"Memorial_building\" value=\"紀念建築\">記念館</option>\
                <option id=\"Settlement_buildings\" value=\"聚落建築群\">決済複合施設</option>\
                <option id=\"Ruins\" value=\"考古遺址\">遺跡</option>\
                <option id=\"Historical_site\" value=\"史蹟\">史跡</option>\
                <option id=\"Cultural-1\" value=\"文化景觀\">文化的景観</option>\
                <option id=\"Antique\" value=\"古物\">骨董品</option>\
                <option class=\"natural\" value=\"自然景觀\">自然景觀</option>\
                <option id=\"Traditional\" value=\"傳統表演藝術\">伝統芸能</option>\
                <option id=\"Traditional2\" value=\"傳統工藝\">伝統工芸品</option>\
                <option id=\"Traditional3\" value=\"口述傳統\">口頭伝承</option>\
                <option id=\"Folk\" value=\"民俗\">\民俗学</option>\
                <option id=\"Traditional-knowledge\" value=\"傳統知識與實踐\">伝統的な知識と実践</option>\
                <option id=\"General_landscape\" value=\"一般景觀(建築/人工地景/自然地景)\">一般的な景観（建築/人工景観/自然景観）</option>\
                <option id=\"Plants\" value=\"植物\">植物</option>\
                <option id=\"Animals\" value=\"動物\">動物</option>\
                <option id=\"biological\" value=\"生物\">生物学的</option>\
                <option id=\"Food\" value=\"食衣住行育樂\">食品、衣料品、住宅、輸送、娯楽</option>\
                <option id=\"Others\" value=\"其他\">その他の</option>";
L_japan[56] = "遺跡";
L_japan[57] = "文化景観";
L_japan[58] = "伝統的な工芸品";
L_japan[59] = "習俗等に関する文物";
L_japan[60] = "昔の物";
L_japan[61] = "衣食住および日々の楽しみなど";
L_japan[62] = "その他";
L_japan[63] = "アップ";
L_japan[64] = "音声";
L_japan[65] = "ビデオ";
L_japan[66] = "スポットリスト";
L_japan[67] = "ルートリスト";
L_japan[68] = "エリアリスト";
L_japan[69] = "場域リスト";

//docentinfo
L_japan[70] = "導覽員資訊";
L_japan[71] = "フルネーム:";
L_japan[72] = "電話:";
L_japan[73] = "攜帯:";
L_japan[74] = "ガイドツアーの言語:";
L_japan[75] = "FB/ LINEまたは他のアカウント:";
L_japan[76] = "自己紹介:";
L_japan[77] = "バーゲン:";
L_japan[78] = "確認";


//userinfo
L_japan[79] = "個人情報";
L_japan[80] = "アカウントID:";
L_japan[81] = "ニックネーム:";
L_japan[82] = "ジェンダー:";
L_japan[83] = "マレ";
L_japan[84] = "女性";
L_japan[85] = "生活ので:";
L_japan[86] = "誕生日:";
L_japan[87] = "学歴:";
L_japan[88] = "職業:";
L_japan[89] = "個人ページ:";
L_japan[90] = "登入角色:";
L_japan[91] = "ユーザー";
L_japan[92] = "歴史の専門家";
L_japan[93] = "アーガイド";
L_japan[94] = "認定者";
L_japan[95] = "個人情報を変更します";
L_japan[96] = "パスワードの変更";
L_japan[201] = "個人情報の変更";
L_japan[192] = "(ユーザー)";
L_japan[193] = "(エキスパート)";
L_japan[194] = "(ガイド)";
L_japan[195] = "(認定者)";

//map_player_detail
L_japan[97] = "時間";
L_japan[98] = "時期";
L_japan[99] = "住所";
L_japan[100] = "緯度";
L_japan[101] = "經度";
L_japan[102] = "ソース元";
L_japan[103] = "製作者";
L_japan[104] = "出版者";
L_japan[105] = "協力者";
L_japan[106] = "タイトル";
L_japan[107] = "概略";
L_japan[108] = "スポット紹介の音声ファイル:";
L_japan[109] = "ファイル形式";
L_japan[110] = "ガイド";
L_japan[111] = "アップ";
L_japan[112] = "音声";
L_japan[113] = "ビデオ";
L_japan[114] = "ガイドツアーの言語:";
L_japan[115] = "自己紹介:";

//make_player_poi
L_japan[116] = "新スポット登録<img src='../static/images/question.png' data-toggle='modal' data-target='#poi_make_notes' style='display: inline;'>";
L_japan[117] = "年";
L_japan[118] = "キーワード";
L_japan[119] = "緯度:";
L_japan[120] = "經度:";
L_japan[121] = "公開";
L_japan[122] = "公開";
L_japan[123] = "不公開";
L_japan[124] = "フォトをガイド";
L_japan[125] = "フォトをアップ/音声/ビデオ";
L_japan[126] = "無し";
L_japan[127] = "例:彰化県鹿港鎮民族路228号)地図から位置情報を取得する(地図上で左クリックして下さい)";
L_japan[128] = "無をガイド";
L_japan[129] = "返回上一頁";
L_japan[130] = "決定";
L_japan[131] = "取消し";
L_japan[132] = "先史時代";
L_japan[133] = "オランダ・スペイン時代";
L_japan[134] = "鄭氏政権";
L_japan[135] = "清朝統治時代";
L_japan[136] = "日本統治時代";
L_japan[137] = "現代台湾";
L_japan[138] = "BC~0";

//make_player
L_japan[27] = "スポットリスト";
L_japan[28] = "ルートリスト";
L_japan[29] = "エリアリスト";
L_japan[30] = "場域リスト";
L_japan[139] = "新スポット登録と編集";
L_japan[188] = "新ルート登録と編集";
L_japan[189] = "新エリア登録と編集";
L_japan[190] = "新場域登録と編集";
L_japan[140] = "POIをCSVに出力";
L_japan[141] = "LOIをCSVに出力";
L_japan[142] = "AOIをCSVに出力";
L_japan[143] = "SOIをCSVに出力";
L_japan[144] = "(検証されていません /";
L_japan[145] = "(検証されています /";
L_japan[146] = "(認証が失敗します /";
L_japan[147] = "公開";
L_japan[148] = "不公開";
L_japan[149] = "写真)";
L_japan[150] = "音声)";
L_japan[151] = "ビデオ)";
L_japan[152] = "メディアがありません)";
L_japan[153] = "削除";
L_japan[154] = "修正";
L_japan[292] = "グループに参加";
L_japan[293] = "参加";

L_japan[156] = "語音導覽";
L_japan[157] = "ツール:";
L_japan[158] = "協力者";
L_japan[159] = "アップロードするamr/3gpp/aac形式の音声ファイルの、最大ファイル容量は5MBまでです(アップロード可能数5つのファイル)";
L_japan[160] = "アップロードするgif/jpg/png形式のフォトの、最大ファイル容量は2MBまでです(アップロード可能枚数5枚のフォト)";
L_japan[161] = "アップロードするmp4/avi形式の動画ファイルの、最大ファイル容量は15MBまでです(アップロード可能数5つのファイル)";
L_japan[162] = "無し";
L_japan[163] = "清除";
L_japan[164] = "刪除";
L_japan[165] = "ファイルを選択します";

//map_player_detail
L_japan[155] = "ルートリスト";
L_japan[166] = "POI リスト";
L_japan[167] = "エリアリスト";
L_japan[168] = "LOI リスト";
L_japan[169] = "AOI リスト";
L_japan[170] = "主題故事列表";

//make_player_loi
L_japan[171] = "新スポット登録";
L_japan[172] = "POIエリアを選択して下さい";
L_japan[173] = "タイトル:";
L_japan[174] = "概略:";
L_japan[175] = "ツール:";
L_japan[176] = "是否公開:";
L_japan[177] = "車";
L_japan[178] = "自転車";
L_japan[179] = "徒歩";
L_japan[180] = "協力者:";

//make_player_aoi
L_japan[182] = "エリアを保存する";
L_japan[183] = "再選択し";
L_japan[184] = "協力者:";

//make_player_soi
L_japan[185] = "LOIエリアを選択して下さい";
L_japan[186] = "AOIエリアを選択して下さい";
L_japan[187] = "新增場域";
L_japan[181] = "協力者:";

//google_map
L_japan[191] = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrH6PFm6YsUakE6OxkTi3ekc_bp827osQ&callback=myMap&language=ja&region=ja";

//footer
L_japan[196] = "連絡先ウィンドウ:";

//userpwd
L_japan[197] = "パスワードの変更";
L_japan[198] = "現在のパスワード";
L_japan[199] = "新しいパスワード";
L_japan[200] = "パスワードを確認";

//export CSV
L_japan[201] = "キーワード1";
L_japan[202] = "キーワード2";
L_japan[203] = "キーワード3";
L_japan[204] = "キーワード4";
L_japan[205] = "キーワード5";
L_japan[206] = "アカウントのPOIの所有者";
L_japan[207] = "言語";
L_japan[208] = "POI タイトル";
L_japan[209] = "LOI タイトル";
L_japan[210] = "アカウントのLOIの所有者";
L_japan[211] = "AOI タイトル";
L_japan[212] = "アカウントのAOIの所有者";
L_japan[213] = "協力者";
L_japan[214] = "SOI タイトル";
L_japan[215] = "アカウントのSOIの所有者";
L_japan[216] = "協力者";

//find_pwd
L_japan[217] = "紛失パスワード";
L_japan[218] = "現在のアカウント";
L_japan[219] = "Email";

//login
L_japan[220] = "アカウント";
L_japan[221] = "パスワード";
L_japan[222] = "ログイン";
L_japan[223] = "パスワードを忘れました";
L_japan[224] = "登録";

//userpwd
L_japan[225] = "ユーザーパスワードの編集";
L_japan[226] = "現在のパスワード";
L_japan[227] = "新しいパスワード";
L_japan[228] = "パスワードの確認";

//make_player_poi
L_japan[229] = "Poi notes";
L_japan[230] = "POIがに設定されています";
L_japan[231] = "一般市民が読んだ後、国民によって確認された";
L_japan[232] = "確認する必要はありません";
L_japan[233] = "<b>地域</ b>と<b>住所</ b>は一貫性が必要です";
L_japan[234] = "複数の（最大5枚の）画像を選択するには、画像をクリックして、<b> Ctrl </ b>を押したまま、画像は2MB以上圧縮されます。";
L_japan[235] = "<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h4 class=\"modal-title\"></h4><div class=\"modal-body make_poi_info\" >\
                </div><p>古蹟：</b><br>指人類為生活需要所營建之具有歷史、文化、藝術價值之建造物及附屬設施。</p><p><b>歷史建築：</b><br>指歷史事件所定著或具有歷史性、地方性、特殊性之文化、藝術價值，應予保存之建造物及附屬設施。</p>\
                <p><b>紀念建築：</b><br>指與歷史、文化、藝術等具有重要貢獻之人物相關而應予保存之建造物及附屬設施。</p><p><b>聚落建築群：</b><br>指建築式樣、風格特殊或與景觀協調，而具有歷史、藝術或科學價值之建造物群或街區。</p>\
                <p><b>考古遺址：</b><br>指蘊藏過去人類生活遺物、遺跡，而具有歷史、美學、民族學或人類學價值之場域。</p><p><b>史蹟：</b><br>指歷史事件所定著而具有歷史、文化、藝術價值應予保存所定著之空間及附屬設施。</p>\
                <p><b>文化景觀：</b><br>指人類與自然環境經長時間相互影響所形成具有歷史、美學、民族學或人類學價值之場域。</p><p><b>古物：</b><br>指各時代、各族群經人為加工具有文化意義之藝術作品、生活及儀禮器物、圖書文獻及影音資料等。</p>\
                <p><b>自然地景、自然紀念物：</b><br>指具保育自然價值之自然區域、特殊地形、地質現象、珍貴稀有植物及礦物。</p><p><b>傳統表演藝術：</b><br>指流傳於各族群與地方之傳統表演藝能。</p>\
                <p><b>傳統工藝：</b><br>指流傳於各族群與地方以手工製作為主之傳統技藝。</p><p><b>口述傳統：</b><br>指透過口語、吟唱傳承，世代相傳之文化表現形式。</p>\
                <p><b>民俗：</b><br>指與國民生活有關之傳統並有特殊文化意義之風俗、儀式、祭典及節慶。</p><p><b>傳統知識與實踐：</b><br>指各族群或社群，為因應自然環境而生存、適應與管理，長年累積、發展出之知識、技術及相關實踐。</p>\
                <p><b>一般景觀：</b><br>指一定區域呈現的景象，即視覺效果。 這種視覺效果反映了土地及土地上的空間和物質所構成的綜合體，是複雜的自然過程和人類活動在大地上的烙印。</p>\
                <p><b>植物：</b><br>百谷草木等的總稱。為生物的一大類。這類生物的細胞多具有細胞壁。一般有葉綠素，多以無機物為養料，沒有神經，沒有感覺。</p><p><b>動物：</b><br>相對於植物的另一大類生物，這類生物多可自行攝食有機物以維生，有神經、感覺，並具運動能力。 生存範圍遍及世界各處。</p>\
                <p><b>生物：</b><br>有生命的物體,具有生長、發育、繁殖等能力,能通過新陳代謝作用與周圍環境進行物質交換。動物、植物、微生物都是生物。</p><p><b>食衣住行育樂：</b><br>民生主義中, 提到人民有六大需要是指：（一）食、衣、住、行：為物質生活所必需。(國父孫中山先生原著)（二）育、樂：為精神生活所必需。</p></div>\
                <div class=\"modal-footer\"><button id=\"make_poi_close\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">關閉</button></div>";
//L_japan[236] = "<b>体験する：</b><br>既存の歴史的、文化的景観、産業、文化遺産などの時間の経過と消滅のためではなく、観光名所がまだ存在することを示すそうです。";
//L_japan[237] = "<b>再建と復建による他目的活用：</b><br>アトラクションのビューが復元または再修復されたことを示し、新しいアトラクションを提供します。";

//make_player_loi
L_japan[238] = "LOI、最初のアトラクションがある行政区です";
L_japan[239] = "AOI、最初のアトラクションがある行政区です";
L_japan[240] = "SOI、最初のアトラクションがある行政区です";

L_japan[241] = "最初にログインしてください";

//list_group
L_japan[243] = "通知";
L_japan[244] = "グループへの参加申請:";
L_japan[245] = "同意する";
L_japan[246] = "拒否";
L_japan[247] = "あなたをグループに招待してください:";
L_japan[249] = "通知メッセージがありません";
L_japan[250] = "探査";
L_japan[251] = "私のグループ";
L_japan[252] = "解散";
L_japan[253] = "マネジメント";
L_japan[254] = "終了する";
L_japan[255] = "見る";
L_japan[256] = "適用";
L_japan[257] = "招待状を送る";
L_japan[258] = "グループリーダーはグループにメンバーを招待できます";
L_japan[259] = "ユーザーは複数のグループを作成したり、複数のグループに参加することができます";
L_japan[260] = "グループリーダー離脱可能グループ";
L_japan[261] = "グループメンバーはグループを終了できます";
L_japan[262] = "グループが公開されていない場合、グループを調査することはできません";
L_japan[263] = "グループが公開されており、検証されている場合、グループ内で検索機能を見つけることができます";
L_japan[264] = "閉じる";
L_japan[265] = "招待状";
L_japan[291] = "検索グループ";

//make_froup
L_japan[266] = "グループを作成する";
L_japan[267] = "グループ名:";
L_japan[268] = "グループ記述:";
L_japan[269] = "開いているかどうか：";
L_japan[270] = "確認";

//manage_group
L_japan[273] = "グループ";
L_japan[274] = "編集";
L_japan[275] = "グループ記述";
L_japan[276] = "メンバー";
L_japan[277] = "蹴った";
L_japan[278] = "自分でやる";
L_japan[279] = "すべて";
L_japan[280] = "移動";
L_japan[281] = "変更";
L_japan[282] = "グループリーダー編集可能グループ情報";
L_japan[283] = "グループリーダとプロダクションメンバーは、公衆のメンバーにアトラクション/風光明媚/テーマストーリーを見ることができます";
L_japan[284] = "グループ以外のメンバーは、公衆のメンバーだけを見て、観光スポット/風光明媚な/テーマストーリーを通じて確認することができます";
L_japan[285] = "グループリーダがメンバーを追い出すことができます";
L_japan[286] = "グループリーダー/メンバーは、自分のアトラクション/風景/風光明媚/テーマストーリーを作ることができます";
L_japan[287] = "グループリーダーはアトラクション/風景/景色/テーマストーリーのメンバーを変更/削除できます";
L_japan[288] = "グループメンバーが退場した後にグループを離れる/グループ/シーン/風光明媚/テーマストーリーから蹴り出す";
L_japan[289] = "グループ情報を変更する";
L_japan[290] = "公開/非公開";

//forms regist
L_japan[294] = "アカウント(Required)：";
L_japan[295] = "パスワード(Required)：";
L_japan[296] = "名前/ニックネーム(Required)：";
L_japan[297] = "Email：";
L_japan[298] = "性別：";
L_japan[299] = "誕生日：";
L_japan[300] = "ウェブサイト：";
L_japan[301] = "教育：";
L_japan[302] = "占領：";
L_japan[303] = "住所：";
L_japan[304] = "同一性：";
L_japan[305] = "パスワードの確認 (Required)：";
L_japan[306] = "電子メールで真実を記入して、自分の利益を確保してください";
L_japan[307] = "登録済み";
L_japan[308] = "ユーザー";
L_japan[309] = "アーガイド";
L_japan[310] = "高校";
L_japan[311] = "大学";
L_japan[312] = "ドクター";
L_japan[313] = "マスター";
L_japan[314] = "その他";
L_japan[315] = "農業と漁業";
L_japan[316] = "政府機関";
L_japan[317] = "警察";
L_japan[318] = "研究";
L_japan[319] = "ビジネス";
L_japan[320] = "建物/建物";
L_japan[321] = "製造/サプライヤ";
L_japan[322] = "金融/保険";
L_japan[323] = "不動産";
L_japan[324] = "情報";
L_japan[325] = "サービス";
L_japan[326] = "学生";
L_japan[327] = "ハウスキーピング";
L_japan[328] = "医療";
L_japan[329] = "法律関連産業";
L_japan[330] = "循環/小売";
L_japan[331] = "交通/交通/観光";
L_japan[332] = "エンターテインメント/パブリッシング";
L_japan[333] = "コミュニケーション/マーケティング";
L_japan[334] = "アート";
L_japan[335] = "失業者";
L_japan[336] = "その他";

L_japan[337] = "現存していない： ";
L_japan[340] = "テーマアトラクションが消滅したことを示しています。履歴レコードのみが参照として使用されています。"
L_japan[338] = "体験する： ";
L_japan[341] = "既存の歴史的、文化的景観、産業、文化遺産などの時間の経過と消滅のためではなく、観光名所がまだ存在することを示すそうです。";
L_japan[339] = "再建と復建による他目的活用： ";
L_japan[342] = "アトラクションのビューが復元または再修復されたことを示し、新しいアトラクションを提供します。";

//導覽地圖
L_japan[343] = "Serch docent: "

// 歷史紀錄
L_japan[344] = "歴史";
L_japan[345] = "ブラウズトラック";
L_japan[346] = "アクショントラック";
L_japan[347] = "<h3>歴史：DEHで見られるPOI / LOI / AOI / SOIの記録</ h3>";
L_japan[348] = "ブラウズトラック：DEHウェブサイトで閲覧されたPOI / LOI / AOI / SOI情報";
L_japan[349] = "アクショントラック：DEH APPで見たPOI / LOI / AOI / SOI情報";
L_japan[350] = "POI";
L_japan[351] = "LOI";
L_japan[352] = "AOI";
L_japan[353] = "SOI";
L_japan[354] = "クエリ";
L_japan[355] = "時間";
L_japan[356] = "タイトル";

// 文史脈流服務平台會員服務使用條款
L_japan[357] = "<strong> Cultural and Historical Service Platformメンバーサービス利用規約</ strong> <br /> Cultural History Serviceプラットフォームのメンバーシップに参加できます。メンバーシップサービスを使用するすべてのユーザー（以下、メンバーと呼びます）は、以下の詳細をお読みください。会員サービスのプロバイダーとすべてのユーザーの利益を保護し、ユーザーとメンバーサービスプロバイダー間の契約を構成することを目的とする契約の条件。";
L_japan[358] = "18歳未満の場合、親（または保護者）がこれらの利用規約の内容とその後の変更を読み、理解し、同意した後、サービスを使用するか、継続して使用する必要があります。サービスの使用または使用の継続により、親（または保護者）は、本契約のすべての内容およびその後の変更を読み、理解し、同意することに同意します。";
L_japan[359] = "ユーザーが登録プロセスを完了するか、文学サービスプラットフォームが提供するメンバーサービスの使用を開始すると、これらの利用規約のすべての条件を認識し、完全に同意したものとみなされます。<br /><br />";
L_japan[360] = "<strong>一、会員サービス</strong>&nbsp;<br /><br />1.&nbsp;入会申込を確認した後、システムの時点で確立されたサービスチャネル、プロジェクト、コンテンツ、ステータス、機能に基づいてメンバーにサービスを提供します。サービスプラットフォームは、各サービスチャネル、プロジェクト、コンテンツ、機能のすべてまたは一部をいつでも追加、削減、または変更する権利を留保します，個別に通知されることはありません。<br />2.&nbsp;一部のサービスまたはプロジェクトは、サービスプラットフォームのパートナーによって構築または提供される場合があります。または、個々のアプリケーションまたはログイン手順をメンバーが必要とする場合があります。 プロジェクトおよび関連ページの使用方法。<br /> 3.&nbsp;サービスプラットフォームは、無料サービスを有料サービスに変更し、いつでも課金基準を変更する権利を留保します。変更されたコンテンツは、各ページに公開されない限り、個別に開示されません。<br />4.&nbsp;一部のメンバーサービスには異なる使用仕様または契約がある場合があり、メンバーは各サービスチャネルまたはプロジェクトの使用仕様および関連する契約にも従う必要があります。<br /><br />";
L_japan[361] = "<strong>二、アカウント番号、パスワード、セキュリティ</strong>&nbsp;<br /><br />1.&nbsp;メンバーは登録プロセスを完了し、メンバー登録またはプロセスに必要な情報を提供し、提供されたすべての情報が正確かつ最新であることを保証する必要があります。メンバーによって提供された情報がその後変更された場合、メンバーは保持された情報をすぐに更新する必要があります 情報。 メンバーが情報をすぐに提供しない場合、指定された方法に従って情報を提供できない場合、または提供された情報が正しくないか事実に準拠していない場合、サービスプラットフォームは、事前の通知なくいつでも関連サービスのすべてまたは1つを拒否または一時停止する権利を留保します。 権利。<br />2.&nbsp;メンバーは独自のユーザー名とパスワードを選択できますが、メンバーはそれを安全かつ機密に保つ義務があります。第三者に開示または提供してはなりません。 すべてのアクションは、ユーザー名とパスワードを保持するメンバーの責任となります。<br />3.&nbsp;メンバーは、自分のユーザー名とパスワードが第三者によって不正に使用されている、または不適切に使用されていることを発見または疑った場合、直ちにサービスプラットフォームに通知して、サービスプラットフォームによる適切な対応措置を促進するものとします。ただし、上記の措置はサービスとは解釈されません。 したがって、プラットフォームは、明示的または暗示的に、メンバーに対するあらゆる形態の報酬または報酬を引き受けます。<br /><br />";
L_japan[362] = "<strong>三、個人データ保護&nbsp;</strong><br /><br />1.&nbsp; このサービスプラットフォームは、各メンバーの個人データを保護しますメンバーが提供する個人情報については、サービスプラットフォームはサービスを提供する目的でのみ使用されます。 サービスプラットフォームは、メンバーが法律、侵害、これらの利用規約、サービスまたは契約の使用の違反、または本人の同意を得た場合を除き、メンバーの個人データを第三者に提供しません。<br />2.&nbsp;以下の状況では、サービスプラットフォームは、メンバーの個人データまたは関連する通信資料を閲覧または関連する政府機関、または権利が侵害されていると主張し、適切な認証を提供する第三者に提供する場合があります:<br />(1)&nbsp;法律、または司法機関またはその他の関連政府機関の命令に従って、<br />(2)&nbsp;メンバーは、法律や規制の違反、第三者の権利の侵害、これらの利用規約またはこれらの各使用規則または契約の違反に関与しています。<br />(3)&nbsp;会員サービスシステムのセキュリティまたはオペレーターの正当な権利と利益を保護するため。<br />(4)&nbsp;他のユーザーまたは他の第三者の正当な権利と利益を保護するため。<br />(5)&nbsp;システムの正常な動作を維持するため。<br />3.その他の不特定の事項は、中華民国の個人情報保護法の規定に従って処理されます。<br /><br />";
L_japan[363] = "<strong>四、データ保存</strong><br /><br />1.&nbsp;メンバーは、システムにアップロード、公開、または保存するすべての資料をバックアップする必要があります。 サービスプラットフォームは、その時点でシステムによって設定された方法と処理エネルギーに従ってメンバーが保存した情報を定期的にバックアップしますが、メンバーが保存した情報が完全にバックアップされることを保証しません。メンバーは、サービスプラットフォームをバックアップする必要がないことに同意します、 削除されたデータ、またはバックアップに失敗したデータがデータの原因です。<br />2.&nbsp;このシステムは、メンバーによってアップロードされた情報が正常に表示されることを保証するものではなく、データ送信の正確性を保証するものでもありません。メンバーがシステムにエラーがあることを発見した場合、システムのウェブサイト管理者にすぐに通知してください。<br />3.&nbsp;システムは、一定期間使用されていないメンバーアカウントを自動的に検出します。一定期間使用されていないメンバーアカウントについては、システムはすべての電子メール、ファイル、ユーザー設定データファイル、およびユーザーアカウントの関連資料を自動的に削除します。 別のバックアップを作成し、このユーザーアカウントの使用を一時停止します。 ログインを使用するかどうかの記録は、サービスプラットフォームのメンバーサービスシステムに保持されている記録に従います。<br /><strong><br />";
L_japan[364] = "五、会員サービスの提供と利用</strong><br /><br />1.&nbsp;会員サービスを提供するためにサービスプラットフォームまたはパートナーが提供するすべての関連ドメイン名とネットワークアドレスは、引き続きサービスプラットフォームまたはその他の法的権利所有者が所有します。メンバーシップは、メンバーシップの保持期間中のみ使用できます。 各利用規約または関連する契約で合意された規約と方法が使用されるものとし、メンバーはメンバーシップまたはメンバーシップ権を第三者に譲渡、貸与、または貸与してはなりません。<br />2.&nbsp;会員サービスで提供される検索または検索または検索サービスまたは機能は、コンピュータープログラムシステムによって提供される自動化されたサービスおよびソフトウェアツールですユーザーは、選択または設定された条件またはコンテンツに従って検索または取得します。 検索、検索またはマッピング、関連リンクおよびそれらのコンテンツの結果が表示されることは保証されておらず、データ送信の正確性は保証されていません。<br />3.&nbsp;特定のメンバーサービスの場合、サービスプラットフォームはパートナーまたは他のベンダーに連絡して、関連する画像、写真、その他の作品や資料を提供してメンバーが閲覧、取得、または使用することができますが、ユーザーは関連するライセンス契約または制限に従う必要があります。 そのような図面、画像、その他の作品または資料の合法性は、画像、画像、その他の作品または資料を提供するパートナーまたは製造業者の単独責任です。<br />4.&nbsp;システムが提供するサーバースペースのメンバーが作成した情報（テキスト、画像、ビデオ、ファイル、またはその他の資料を含むがこれらに限定されない）またはページ、関連する所有権、および広告レイアウトの権利は引き続きサービスプラットフォームが所有しています。 サービスプラットフォームの事前の同意を除き、支払いの有無にかかわらず、メンバーは第三者によるオンライン広告または同様のサービスを販売、運営、または提供することはできません。<br />5.メンバーが適用したアカウント番号は、「歴史とナビゲーションの歴史」サービスプラットフォームに加えて使用できます。また、WebサイトやAPPなど、カスタマイズされたプラットフォーム（「台湾台南アクションガイドサービス」など）の残りで使用できます。<br>6. 「歴史の歴史と歴史の行動ガイド」プラットフォームでメンバーがアップロードしたコンテンツ (POIs/LOIs/AOIs/SOIs) 自分で作ることができますPOIs/LOIs/AOIs/SOIsカスタマイズされたプラットフォームの残りにインポートされます。<br><br />";
L_japan[365] = "<strong>六、ユーザーの行動</strong><br /><br />1.&nbsp;メンバーは、事前の許可なしに商業活動に従事してはなりません。<br />2.&nbsp;メンバーによってアップロードされた、またはさまざまなメンバーサービスで公開された情報（テキスト、写真、ビデオ、ファイル、またはその他の資料を含むがこれらに限定されない）は、メンバーの指示に従ってコンピューターシステムによってさまざまなメンバーサービスで自動的にアップロード、公開、または保存されます。 このサービスプラットフォームのWebサイトと場所は、レビュー、検証、編集の責任を負いません。<br />3.&nbsp;会員は、関連する法律および規制を遵守しなければならず、以下の活動に従事してはなりません:<br />(1)&nbsp;技術データの輸出に関する中華民国の関連法規に違反するメール、ファイル、または情報を送信します。<br />(2)&nbsp;他人の評判や善意、詐欺、名誉ation損、ポルノ、ギャンブル、公序良俗に反する、またはその他の法律違反を損なう可能性のあるメール、写真、ファイル、資料を公開、送信、送信、または保存する。<br />(3)&nbsp;他者の知的財産権またはその他の権利を侵害する作品または資料を公開、送信、送信、または保存する。<br />(4)&nbsp;同意なしにメールアドレスやその他の個人情報を収集する。<br />(5)&nbsp;メンバーサービスのデータベースコンテンツの全部または一部を同意なしに抽出または使用します。<br />(6)&nbsp;ウイルス、またはコンピューターシステムまたはデータを混乱または妨害するのに十分な他のプログラムまたはメッセージを公開、送信、送信、保存します。<br />(7)&nbsp;会員サービスシステムの運用の破壊または妨害、または一般的なオンライン礼儀違反。<br />(8)&nbsp;メンバーサービスシステムまたはシステムに関連するネットワークへの不正アクセス、または他の人のアカウントまたは偽造送信者識別データの不正使用により、受信者の判断を誤解させる試みでメールを送信する。<br />(9)&nbsp;他のユーザーによるメンバーサービスの使用を妨害または妨害する行為。<br />(10)&nbsp;ラッキーチェーンレター、スパム、広告レター、またはその他の未承諾メッセージを送信します。<br />(11)&nbsp;不適切なチャネルを通じてメンバーシップサービスのメンバーアカウント、パスワード、またはアクセス権を盗む行為。<br />(12)&nbsp;その他のメンバーは、メンバーサービスによって提供される使用目的を順守しません。<br />4.&nbsp;メンバーまたは第三者によってアップロード、公開、送信、送信、または保存されたテキスト、画像、ビデオ、ファイルまたはその他の作品または素材が、法律または第三者の権利の侵害、またはこれらの利用規約に違反している場合、または 他のサービス仕様または契約、または第三者による侵害またはその他の合法性に関連する紛争の場合、サービスプラットフォームは、予告なしにいつでもアクセスを削除、移動、停止する権利、または各メンバーへのメンバーサービスの提供を停止する権利を有します。 そのすべてまたは一部;そのような行為のメンバーについては、そこから生じる法的責任に加えて、サービスプラットフォームの損傷および発生した費用に対する責任を負担し、補償するものとします。<br /><br />";
L_japan[366] = "<strong>七、このサービスプラットフォームの権利の所有権とメンバーシップの承認</strong><br /><br />1.&nbsp;商標、著作権、その他の知的財産権、データの所有権など、メンバーサービスによって提供されるすべてのWebデザイン、インターフェイス、URL、商標またはロゴ、コンピュータープログラム、データベースなどは、サービスプラットフォームによって合法的に使用されるか、サービスプラットフォームによって承認されます。 権利の所有者。<br />2.&nbsp;このサービスプラットフォームのメンバーサービスは、メンバーが使用する関連サーバースペースとシステムのみを提供し、メンバーは、サービスプラットフォームおよび個々のメンバーサービスの関連商標、著作権、またはその他の知的財産権の認可を取得しません。 <br />3. メンバーは、サービスの情報をアップロード、作成、公開、保存し、ユーザーによるブラウジングや推奨などの非営利活動の使用のためにウェブサイトの使用を許可することに同意します。<br />4.&nbsp;会員サービスで会員がアップロード、構築、公開、保存するすべての作品と資料、およびそれらの著作権またはその他の知的財産権は、会員または認定会員の法的権利保有者が引き続き所有していますが、会員は作品または資料を保証する必要があります法律に違反することも、第三者の権利を侵害することもありません。また、サービスプラットフォームがウェブサイトに保存および公開されることを承認し、サービスプラットフォームが適切と考える方法でウェブサイト上で使用することができます（異なるソフトウェアまたはハードウェアデバイスの使用を含む）。オンラインでの閲覧に適したバージョンや、さまざまなコンピューターデバイス（スマートフォン、モバイルデバイス、および将来の市場で開発される同様のデバイスを含む）にダウンロード可能なバージョンなど、制作または変換のさまざまなバージョンまたは形式バージョンや形式などは、オンラインでの閲覧、照会、検索、オフラインでの閲覧または受信のために特定のまたは不特定の人々に提供され、商業活動を伴わない限り無料で使用できます。会員はまた、会員が会員サービスにアップロード、構築、公開、保存した書籍や資料を選択し、ニュースレターなどを収集、編集、または他の会員の作品や資料と統合した後に、サービスプラットフォームが許可することに同意します。サービスプラットフォームおよびメンバーサービスと組み合わせてマーケティングまたはプロモーション目的で使用される電子ニュースレターおよび関連メッセージを含むがこれらに限定されない電子メッセージ。会員サービスの譲渡または再承認を除き、サービスプラットフォームは、会員が第三者にアップロード、公開、保存した書籍や資料を譲渡または再承認しません。<br>5. サービスプラットフォームは、メンバーのブラウジング履歴と、アップロードされたデータのロケーションレコードをメンバーのアクショントラックおよびブラウジングトラックとして収集します。<br><br /><br />";
L_japan[367] = "<strong>八、責任の除外と制限</strong><br /><br />1.&nbsp;サービスプラットフォームによって提供されるメンバーサービスは、その時点での各サービスの機能と現在のステータス、および速度、セキュリティ、信頼性、整合性などのユーザーの特定の要件に従ってのみ提供されます。 サービスプラットフォームは、正確性および非切断性およびエラーに関して、明示または黙示を問わず、いかなる保証についても責任を負いません。<br />2.&nbsp;このサービスプラットフォームは、メール、ファイル、またはデータの送信および保存が信頼性があり正確であることを保証するものではなく、保存または送信されるメール、ファイル、または資料のセキュリティ、信頼性、完全性、正確性、および存在しないことを保証するものでもありません。 サービスプラットフォームは、メール、ファイル、またはデータの送信または保存の失敗、損失、またはエラーに起因する切断、エラーなどに起因する損害について責任を負わないものとします。<br />3.&nbsp;サービスプラットフォームは、提案されたアクションを理解している場合でも、サービスプラットフォームが提供するメンバーサービスの使用に起因する直接的または間接的な損害については責任を負いません。<br /><br />";
L_japan[368] = "<strong>九、サービスが中断または中断されました</strong><br /><br />1.&nbsp;サービスは、メンバーサービスシステムまたは機能の定期的なメンテナンス、変更、変更中に一時停止または中断され、サービスプラットフォームは、一時停止または中断の前に、電子メール、アナウンス、またはその他の適切な手段でメンバーに通知します。<br />2.&nbsp;サービスプラットフォームは、以下の状況でメンバーサービスのすべてまたは一部を停止または中止し、ユーザーが被った直接的または間接的な損害について責任を負いません:<br />(1)&nbsp;メンバーサービスに関連するハードウェアおよびソフトウェア機器の移転、交換、アップグレード、保守、または修理を行う場合。<br />(2)&nbsp;ユーザーは、法律、本利用規約、または各利用規約に違反している。<br />(3)&nbsp;第三者の行為、自然災害、その他の不可抗力による会員サービスの停止または中断。<br /(4)&nbsp;会員サービスは、サービスプラットフォームの管理下にない、またはサービスプラットフォームに起因しない他の問題により、中止または中止されます。<br />3.&nbsp;会員が使用のために支払った付加価値サービス。関連する法律および規制、本利用規約またはそれぞれの使用規則または契約に違反している場合、または法律の要求に応じて、または関係当局の要件に従って、またはサービスプラットフォームに起因しないために、 支払いまたは付加価値サービスの全部または一部が中断または中断された場合でも、中断または中断中は通常どおり課金されます。<br /><br />";
L_japan[369] = "<strong>十、サービスの終了</strong><br /><br />1.&nbsp;サービスプラットフォームの運用に基づいて、サービスプラットフォームはいつでもメンバーサービスの全部または一部の提供を停止する権利を留保し、サービスプラットフォームはメンバーに対する補償または補償の責任を負わないものとします。<br />2.&nbsp;会員がこれらの利用規約または会員サービスの使用規則または契約に違反した場合、サービスプラットフォームは、補償または補償の責任を負うことなく、いつでも一時的にサービスを一時停止またはサービスを終了する権利を留保します。<br /><br />";
L_japan[370] = "<strong>十一、これらの利用規約の変更</strong><br /><br />このサービスプラットフォームは、いつでもこのメンバーサービスの使用条件とそれぞれの使用仕様または契約を変更する権利を留保し、改訂されたコンテンツは、ユーザーに個別に通知することなくメンバーサービス関連のWebページに掲載されます。<br /><br />";
L_japan[371] = "<strong>十二、準拠法および管轄権</strong>&nbsp;<br /><br />1.&nbsp;これらの利用規約および各メンバーサービスの関連する使用仕様と契約は、中華民国の法律に準拠しています。&nbsp;<br />2.&nbsp;会員サービス、または利用規約、会員サービスの関連する使用規則および契約に起因する紛争の場合、台湾の台南地方裁判所が第一審の裁判所となります。";
L_japan[372] = "<strong>十三、その他</strong>";
L_japan[373] = "これらの条件が存在しない場合、当事者は関連する法律および誠実な原則に公正に対処することに同意します。";
L_japan[374] = "私はそれを詳細に読み、理解し、受け入れました";
L_japan[375] = "確認する";
L_japan[376] = "同意して確認するにはチェックしてください";

// intro
L_japan[377] = "「Arts and History Pulseデジタル文化資産ガイドサービスプラットフォーム」は、（1）文化資産のデジタルコンテンツをすべての人に提供するオープンプラットフォームです。（i）地域の文化資産ナビゲーションに携帯電話またはタブレットを使用するか、（ii） デスク、携帯電話、タブレット上の仮想文化資産ナビゲーション、および（2）誰もがさまざまな種類のモバイル資産文化デジタルコンテンツ（モバイルデジタル文化遺産コンテンツ）を作成および保存するためのさまざまなソフトウェアツール。";
L_japan[378] = "文化財アクションデジタルコンテンツの分類";
L_japan[379] = "文化財アクションのデジタルコンテンツの種類 (Category)";
L_japan[380] = "<ul><li>見どころ (Point Of Interest, POI): <br>ナビゲーションの最も基本的な単位である、単一のアトラクションの紹介。</li><li>観光ルート (Line Of Interest, LOI):<br>ガイド付きの状況を考慮して、地理的に関連するガイド付きツアールートを設計する(A sequence of POIs),為一有參訪先後次序規劃的景線.</li><li>アトラクションエリア (Area Of Interest, AOI):<br> 特定の地域の文化的資産に基づいて地理的に関連する景勝地のグループを設計する(A set of POIs),物語のような景勝地でなければなりません。<li>Story/Site Of Interest（SOI）：<br>ストーリー/サイトオブインタレストは、（i）複数の時間/スペースにまたがる関連する人物/イベント/事物、または（ii）特定の分野の関連する人物/イベント/事物向けです 多くのPoint Of Interests（POIs）、Line Of Interests（LOIs）、Area Of Interest（AOI）を持つストーリー/サイトオブインタレストが設計されました。<br>Story/Site Of Interest (SOI）は複数（1）ポイントにすることができますPoint Of Interests（POIs）、（2）Line Of Interests（LOIs）、（3）Area Of Interest（AOI）、（4）Point Of Interests（POIs）Line Of Interests（LOIs）、（5）Point Of Interests（ POI）およびArea Of Interest（AOI）、（6）Line Of Interests（LOI）およびArea Of Interests（AOI）、または（7）Point Of Interests（POIs）、Line Of Interests（LOIs）およびArea Of Interest（AOI)組成。";
L_japan[381] = "文化財アクションのデジタルコンテンツのレベル (Class)";
L_japan[382] = " <ul><li>エキスパート</li><li>プレイヤー</li><li>ガイド解説者</li></ul>";
L_japan[383] = "文化財アクションデジタルコンテンツの言語 (Language)";
L_japan[384] = "<ul><li>中国語</li><li>英語</li><li>日本語</li></ul>";
L_japan[385] = "文化資産アクションデジタルコンテンツ領域の中国語版(Region)";
L_japan[386] = "<ul><li>中国語を使用して、世界中の国や地域のアトラクション/ビュー/景色を作成およびナビゲートできます（電話は中国語モードに設定されています）</li><li>台湾：郡/市町村/町/地区別</li><li>世界の国々：ユニットとしての国</li></ul>";
L_japan[387] = "文化財アクションデジタルコンテンツ領域の外国語版 (Region)";
L_japan[388] = "<ul><li>英語/日本語の制作と、世界中の国や地域でのアトラクション/ビュー/シーンのナビゲーション（英語/日本語モードの電話設定）</li><li>英語：台湾：郡/市町村/町/地区別<br>世界の国々：ユニットとしての国</li><li>日本語：台湾：郡/市町村/町/地区別<br>日本:</li></ul>";
L_japan[389] = "アトラクション（POI）コンテンツの分類";
//L_japan[390] = "<ul><li>エヴァネッセント：それは魅力が存在しなくなったことを意味し、参照のために歴史的な文書のみを残します。 台南富城の大小都市の門や台北の古い駅など。</li><li>経験あり：アトラクションがまだ存在し、時間の経過によって消えないことを示します。 既存の歴史的および文化的景観（台南富城の大南門）、産業（小月の程度）、文化遺物（玉jaキャベツ）など。</li><li>再生と再構築：アトラクションの風景が復元されたか、復元され、新しい用途に再利用されたことを示します。 たとえば、台南レンデシグーウェンチュアンパーク（旧台湾砂糖工場）や台北松山ウェンチュアンパーク（旧松山タバコ工場）などです。</li></ul>";
//L_japan[391] = "アトラクションのテーマ（Subject）";
//L_japan[392] = "アトラクションタイプ（Type）";
//L_japan[393] = "<ul><li>自然の風景</li><li>人間の風景</li><li>イベント</li><li>キャラクター</li><li>産業</li></ul>";
L_japan[394] = "アトラクションカテゴリ（Format）";
L_japan[395] = "<ul><li>古跡</li><li>歴史的建造物</li><li>記念館</li><li>決済複合施設</li><li>遺跡</li><li>史跡</li><li>文化的景観</li><li>骨董品</li><li>自然景観</li><li>伝統芸能</li><li>伝統工芸品</li><li>口頭伝承</li><li>民俗学</li><li>伝統的な知識と実践</li><li>一般的な景観（建築/人工景観/自然景観）</li><li>植物</li><li>動物</li><li>生物学的</li><li>食品、衣料品、住宅、輸送、娯楽</li><li>その他の</li></ul>";
L_japan[396] = "アトラクションメディアカテゴリ (Media Type)";
L_japan[397] = "<ul><li>写真 (Picture) + テキスト</li><li>映像 (Movie) + テキスト</li><li>音 (Audio) + テキスト</li></ul>";
L_japan[398] = "観光音声ガイド解説";
L_japan[399] = " <ul><li>サイト制作者は、関連する音声ガイドを追加して、ユーザーがアトラクションをより深く理解できるようにする必要があります。</li></ul>";
L_japan[400] = "アトラクションの使用許可";
L_japan[401] = "<ul><li>一般公開</li><li>非公開（プライベート）</li></ul>";
L_japan[402] = "<h5 class=\"page-header\">このプラットフォームが提供するウェブサイトについては、入力してください<a href=\"http://deh.csie.ncku.edu.tw\">http://deh.csie.ncku.edu.tw</a>システムは自動的にインポートします</h5><ul><li>テーブル機バージョン</li><li>モバイルおよびタブレット版</li></ul>";
L_japan[403] = "DEHプラットフォームが提供するアプリ";
L_japan[404] = "<div class=\"panel panel-info\"><div class=\"panel-heading\"><h3>純粋なツアー</h3></div><div class=\"panel-body\"><ul><li><strong>DEH Lite<strong style='color:red;'>(利用不可)</strong></strong>:<br>近くの写真を表示(image)、音(audio)そして映画(video)アトラクション(Point Of Interests, POIs);アトラクションプレーヤー(POI)埋め込みオーディオガイドの解説;使用FB、Lineおよびその他のツール分享相關景點(POI)。</li><li><strong>DEH Mini II</strong>:<br>近く/私の写真を表示(image)、音(audio)和影片(video)アトラクション(POIs)そして近く/私の風景(Line Of Interests , LOIs)風光明媚(Area Of Interests, AOIs);アトラクションプレーヤー(POI埋め込みオーディオガイドの解説;使用FB、Lineおよびその他のツール分享相關景點(POI)。</li><li><strong>Narrator<strong style='color:red;'>(利用不可)</strong></strong>:<br>このアプリにより、ガイドナレーターは携帯電話のWi-Fiホットスポットをオンにして、ガイド付きツアーに参加するメンバーが携帯電話のWi-Fiネットワーク経由でWi-Fiホットスポットに接続できるようになります。 ナレーターのテキストおよび視聴覚アトラクションのガイドを共有します。 ガイド付きナレーターは、このアプリを使用して、その場所の近くにある文化財の写真/ビデオ/サウンドアトラクション（ビュー/シーン）情報をダウンロードできます。これは、文化財を追加してテキストや音声、ビデオを追加する際に役立ちます</li></ul></div></div>";
L_japan[405] = "純粋に作成されたPOI";
L_japan[406] = "<ul><li><strong>DEH Make II</strong>:<br>写真、ビデオ、オーディオアトラクション（POI）、アトラクションを記録するためのオーディオガイド（POI）、FB、Line、その他のツールを使用して適切な場所（POI）を共有します。<br>グループ機能：独自のグループを作成するか、別のグループへの参加を申請します。グループリーダーは、グループのすべてのメンバーがPOI / LOI / AOI / SOIを作成することを確認できます。</li></ul>";
L_japan[407] = "<div class=\"panel-heading\"><h3>ガイドと制作POIs</h3></div><div class=\"panel-body\"><ul><li><strong>DEH Image<strong style='color:red;'>(利用不可)</strong></strong>:<br>写真、ビデオ、オーディオアトラクション（POI）、アトラクションを記録するためのオーディオガイド（POI）、FB、Line、その他のツールを使用して適切な場所（POI）を共有します。</li><li><strong>DEH Video<strong style='color:red;'>(利用不可)</strong></strong>:<br>ビデオアトラクション（POI）と記録されたアトラクション（POI）の音声ガイドを作成し、ビデオアトラクション（POI）を紹介し、制作したビデオをFB、Lineなどのツールと共有します （POI）。</li><li><strong>DEH Audio<strong style='color:red;'>(利用不可)</strong></strong>:<br>オーディオアトラクション（POI）および記録されたアトラクション（POI）のオーディオガイドの作成、オーディオアトラクション（POI）の表示、FB、Line、その他のツールとのオーディオサウンドの共有 （POI）。</li></ul></div>";
L_japan[408] = "<div class=\"panel-heading\"><h3>純粋なツアー</h3></div><div class=\"panel-body\"><ul><li><strong>DEH Micro<strong style='color:red;'>(利用不可)</strong></strong>:<br>近くの写真スポット（POI）、関心のある線（LOI）、関心のある領域（AOI）を表示し、FB、線などのツールを使用して関連するアトラクション（POI）を共有します。</li></ul></div>";
L_japan[409] = "<h5 class=\"page-header\">このプラットフォームが提供するウェブサイトについては、入力してください<a href=\"http://deh.csie.ncku.edu.tw\">http://deh.csie.ncku.edu.tw</a>システムは自動的にインポートします</h5><ul><li>テーブル機バージョン</li><li>モバイルおよびタブレット版</li></ul>";
L_japan[410] = " <h1 class=\"page-header\">プラットフォームはオブジェクトと状況を使用する場合があります（制限なし、制限なし、ユーザーが考えてください）</h1><ul><li> 人々のライフサークル：<br>コミュニティ開発協会は、その文化史と自然景観情報を保存しています<br>アボリジニの部族は、文化的な記録と自然の風景情報を保存</li><li>フィールド：<br>農場/森林/漁業/放牧公園およびホームステイ<br>自然景観公園<br>博物館/遺産博物館</li><li>文学と歴史の労働者/部屋：<br>履歴データをデジタル化して保存する</li><li>国立公園および国立風景区：<br>自然の景観コンテンツをデジタル化して保存する</li> <li>文化財ガイドナレーター</li><li>タクシー/タクシーのチャータードライバーガイドガイドコメンテーター</li><li>伝統的な文化財の保持と使用：<br>古代の建物<br>歴史的建造物<br>和解<br>廃<br>文化的景観</li><li>学校教育：<br>高/中/小学校のデジタルアクション/屋外/地域教育<br>大学の歴史/歴史/観光/レジャーと台湾の文化財関連コースの他のコース<br>コミュニティ大学コース<br>大学一般教育コース</li><li>プロフォルクスワーゲンディープトラベルダイアリー</li><li>フィールドテーマストーリー</li></ul>";
L_japan[411] = "プラットフォーム使用状況の列挙";
L_japan[412] = "<div class=\"panel-heading\"><h3>状況1：コミュニティ開発協会/アボリジニ族ガイド/フィールド/ホームステイ</h3></div><div class=\"panel-body\"><ul><li> 計画エリア（AOI）および生産アトラクション（POI）：<br>史跡、歴史的建造物、集落<br>廃<br>文化的景観<br>自然の風景<br>民俗および関連する文化遺産<br>エバネッセント/体験/自然の風景/人間の風景/イベント/人/業界の写真/ビデオ/サウンドの再活性化と再構築<br></li><li>自家製シーナリーライン（LOIs）：<br>各テーマの特性に応じて、いくつかの関連シーンを計画および設計します</li><li>地元の説明とツアー-コミュニティ、部族、野外解説者</li><li>セルフヘルプ旅行-スマートフォンまたはタブレットでのセルフガイドツアーガイド</li></ul></div>";
L_japan[413] = "<div class=\"panel-heading\"><h3>状況2：ビッグ/ハイ/ミディアム/プライマリーデジタルアクション/アウトドア/地域教育およびコミュニティ大学地域文化資産コース</h3></div><div class=\"panel-body\"><ul><li>ガイドコース1：<br>既存のアトラクション（POI）=>指定エリア（AOI）/視線（LOI）</li><li>ガイド付きコース2：<br>既存のアトラクション+教師/学生が作成したアトラクション（POI）（事前ガイド付きシステム）<br>=>設計された景観エリア（AOI）/ビューイングライン（LOI）</li><li>ガイドコース3：<br>既存のアトラクション（POI）=> AOI / LOI +教師/生徒のコレクションコンテンツ（調査、記録、写真、ビデオ、記録）<br>=>ツアーの後、POI / AOI / LOI（宿題）を作成します</li><li>ローカルツアーなしの純粋な宿題：<br>地元の文化財生産現場（POI）/景観地域（AOI）/視線（LOI）のアクションデジタル化</li></ul></div>";
L_japan[414] = "<div class=\"panel-heading\"><h3>状況3：アクションカルチャーアセットガイドトーカー</h3></div><div class=\"panel-body\"><ul><li>史跡、歴史的建造物、集落<br>廃<br>文化的景観<br>自然の風景<br>民俗および関連する文化遺産<br>エスケープ/経験/リバイタライズおよび再作成された自然の風景/人間の風景/イベント/人/業界の写真/ビデオ/サウンドさまざまなPOI</li><li>パブリックアトラクションとプライベートアトラクション</li><li>個人またはグループによるさまざまなタイプの旅行のためのさまざまなランドスケープ（LOI）の設計：<br>オープンビューラインとプライベートビューライン</li><li>現地説明とナビゲーション</li><li>さまざまな風景（LOI）および景勝地（AOI）を形成するための、他の周辺のアトラクションとの1つ（またはそれ以上）の旗艦（旗艦）アトラクション</li><li>ナレーター/フィールド広告のマーケティング方法：<br>オンライン広告（FB経由）：すべてが公共のアトラクションで構成されています<br>実際のツアー：いくつかのパブリックアトラクションとオープンしていないプライベートスポットを含む（自己開発のプライベートアトラクション）</li><li>春、夏、秋に4種類のPOI / LOI / AOIに分割されます。</li><li>毎年更新されるコンテンツ：<br>同じフィールド：異なる人/物/オブジェクト</br><br>さまざまなフィールドを開発する：さまざまな人/物/地面/オブジェクト<br>昨年のプライベートアトラクションは、今年または他の人々のパブリックビューになりました。點<br>今年、私は私有地を開発します。<br></li></ul></div>";
L_japan[415] = "<div class=\"panel-heading\"><h3>状況4：文学と歴史の労働者/スタジオ</h3></div><div class=\"panel-body\"><ul><li>文献および所有物の知識に従って、対象文化財景勝地（AOI）および生産アトラクション（POI）を選択します。<br>史跡、歴史的建造物、集落<br>廃<br>文化的景観<br>自然の風景<br>民俗および関連する文化遺産<br>エバネッセント/体験/自然の風景/人間の風景/イベント/人/業界の写真/ビデオ/サウンドの再活性化と再構築<br></li><li>さまざまなテーマライン（LOI）を設計する</li><li>目的：<br>文化的資産の保持と研究<br>現地説明とナビゲーション<br>自助旅行者の訪問</li></ul></div>";
L_japan[416] = "<div class=\"panel-heading\"><h3>状況5：マスディープツアー</h3></div><div class=\"panel-body\"><ul><li>旅行前：ルート計画（DEH Webサイト（http://deh.csie.ncku.edu.tw）<br>観光スポットを検索し、観光スポット/景観を構築します（LOI / AOI）<br>エキスパートまたはプレイヤーのビュー/景色を選択（LOI / AOI）<br>専門家またはプレイヤーの視線/景観（LOI / AOI）を参照して、観光名所/景観（LOI / AOI）を作成します。</li><li>旅行：フィールドツアー（DEH Mini IIを使用）<br>タイムリーなアトラクション紹介<br>目的地ナビゲーション<br>フィールドツアー<br>DEH Make IIを使用して、写真、ビデオ、録画を撮り、POIを作成し、DEHサーバーにアップロードします</li><li>旅行後：<br>車に戻ったり帰宅した後、DEHのWebサイト（http://deh.csie.ncku.edu.tw）にアクセスして、アップロードされたさまざまなPOIの写真/映画/サウンドを整理します。<br>景勝地と景勝線を書く<br>旅行日記を完成させ、FB、Line、Weiboなどに送信し、友人や家族を共有する </li></ul></div>";
L_japan[436] = "<div class=\"panel panel-info\" id = \"Platform_use_scenario6\"><div class=\"panel-heading\"><h3>シナリオ6：フィールドテーマストーリー</h3></div><div class=\"panel-body\"><ul><li>目的：<br>特定のフィールド、イベント、またはストーリーを作成してマーケティングする。</li><li>原則：<br>フィールドの実際または伝説的な地元のキャラクター/イベント/風景/業界に応じて、テーマのフィールドまたはストーリー（サイト/興味のあるストーリー、SOI）を作成するターゲットの国内/外国のターゲット人物を選択します。<br></li>\
                <li>内容：<br>主題の記述（SOI）、見通し線（LOI）と景勝地（AOI）の設計と計画、景勝地（POI）の作成。<br></li><li>目標：<br>地元の文化財を保護および促進し、ガイドとコメンテーターの雇用機会と収入を増やし、地元の産業を強化し、地元の雇用機会を増やし/創出する。</li></ul></div></div>";
L_japan[417] = "APPダウンロード";
L_japan[418] = "<li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=com.mmlab.m1\">Google PlayでDEH-Mini IIを入手（アトラクションのツアー)</a></li><li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=edu.deh.make_II\">Google PlayでDEH-Make IIを入手（Sights Maker）</a></li>";
L_japan[419] = "<li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-lite/id1347669266?l=zh&mt=8\">Apple StoreでDEH-Mini IIを入手（観光ガイド）</a></li><li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-make/id1324053125?l=zh&mt=8\">Apple StoreでDEH-Make IIを入手（アトラクション制作）</a></li>";
L_japan[420] = "<a class=\"btn btn-lg btn-default btn-block\" id=\"handout-2\">ユーザーマニュアルのダウンロード</a><li><a class=\"link-2\" href=\"/static/activites/DEH_Make_II_使用手冊.pptx\">DEH Make IIバージョン_ユーザーマニュアル</a></li><li><a class=\"link-2\" href=\"/static/activites/DEH_Mini_II_使用手冊.pptx\">DEH Mini IIバージョン_ユーザーマニュアル</a></li><li><a class=\"link-2\" href=\"/static/activites/DEH_網站_使用手冊.pptx\">DEH ウェブサイト ユーザーマニュアル</a></li></ul>";
L_japan[421] = " <a class=\"btn btn-lg btn-default btn-block\" id=\"intro_video-2\">状況ビデオを使用する</a><ul class=\"intro_video-1\"><li><a class=\"link-3\" href=\"https://youtu.be/ht5Y4-xPxT4\" target=\"_blank\">文学史の歴史-台南の喜びを踏んで</a></li><li><a class=\"link-3\" href=\"https://www.youtube.com/watch?v=yFi8ueKYpC8&feature=youtu.be\" target=\"_blank\">文学史と歴史-台南のエッセイ</a></li></ul>";
L_japan[438] = "DEHプラットフォームの高度な機能"
L_japan[439] = "<div class=\"panel panel-info\"><div class=\"panel-heading\"><h3>グループ機能</h3></div><div class=\"panel-body\"><ul><li>DEHプラットフォームのグループ機能とFB /ラインのグループ機能の違いは、グループリーダーが、メンバーによって作成された景勝地/ライン/ゾーンとテーマストーリーのコンテンツとさまざまな属性を変更する権利を持つことです。<br></li>\
                <li>使用情境:<br>i)各クラスの教師がグループを開始します。このクラスの生徒は、このコースで作成された景勝地/ライン/エリアとテーマストーリーの割り当てをこのグループに分類します。教師はこのグループの生徒を簡単に見つけることができます 機能します。クラブのグループを作成して、クラブのメンバーを招待できます。次に、これらのメンバーによってアップロードされたアトラクション/ライン/エリアおよびテーマのストーリーをこのグループにまとめ、クラブのすべてのメンバーをグループで見ることができます。 仕事。 クラス/クラブのインストラクターは、グループリーダーの権限を使用して、一般的な学生などの学生/メンバー（公共<->非公開）によって作成された景勝地/行/地区およびテーマ別ストーリーの内容と属性を変更できます。 メンバーが提出した論文（または.docx）は宿題のようなものであり、内容を変更できます。<br>\
                ii）シーンライン/景観グループの作成：<br>\
                *担当者がグループを作成し、グループメンバーをこのグループに招待します。 <br>\
                ※各チームメンバーが分業後に担当する景勝地のコンテンツを作成してアップロードすると、このグループに分類され、誰もが簡単に他人が作ったコンテンツを見ることができます。 <br>\
                *グループの担当者は、グループメンバーが作成した景勝地の内容を変更し、景勝地の全部または一部をクリックして、目的の景勝地/景勝地を形成します。 <br>\
                iii）テーマストーリーグループの作成：<br>\
                *担当者がグループを作成し、グループメンバーをこのグループに招待します。 <br>\
                ※各チームメンバーが分業を担う景勝地・路線・エリアのコンテンツを作成・アップロードすると、このグループに分類され、誰もが簡単に他人のコンテンツを見ることができます。 <br>\
                *グループの担当者は、チームメンバーが作成した景勝地/ライン/リージョンのコンテンツを変更し、景勝地/ライン/リージョンの全部または一部をクリックして、ターゲットテーマストーリーを作成します。<br></li></ul></div></div>";
L_japan[440] = "<div class = \"panel panel-info \"> \
                <div class = \"panel-heading \"> \
                    <h3> \ Wenzi Academy-Pokemon Goのようなインタラクティブ機能</ h3> \
                </div> \
                <div class = \"panel-body \"> \
                    <ul> \
                        <li> \
                            Pokemon Goのようなインタラクティブ機能「ウェンジアカデミー」と同様に、ユーザーは携帯電話を使用して、歩きながら空中で質問をつかんで答えることができます。<br> \
                            1）質問は、（a）nメートル/ km内の特定の固定点に設定できます。（b）一定の期間、©k人に正しく回答させることができます。 <br> \
                            2）回答は、「はい」または「いいえ」、選択肢または質問と回答（テキスト+写真、ビデオまたはサウンド）のいずれかです。 <br> \
                            3）タイトルは、プレーンテキストまたはテキスト+写真、ビデオ、および/またはサウンドにすることができます。 <br> \
                            4）APP DEH Mini II（Android / iPhone）「ウェンジアカデミー」では、起動、質問の取得、質問への回答、回答の公開、スコアの表示の機能を備えています。 <br> \
                            5）柔軟な日読み設定方法、カスタマイズされたスコアリング機能、自動スコアリングおよびランキング統計、および履歴レコードを取得して応答する機能。 <br> \
                            6）コンテキストを使用：<br> \
                            &nbsp&nbsp&nbspi）大学の一般的な研究/文学と歴史および高/中/小学校地元および地方/文化ガイド付きコースは、現地ガイド付きツアーの後に教師が開始することができ、学生は地元エリアで「楽しい実験」を行うことができます。空中での質問と回答。 <br> \
                            &nbsp&nbsp&nbspii）文化財コメンテーターがガイド付き解説を行った後、メンバーは「ウェンジアカデミー」を使用して無料のアクティビティ中に質問に答えることができ、楽しさと娯楽性が向上します。 <br> \
                            &nbsp&nbsp&nbspiii）一部のアクティビティ（台湾ランタンフェスティバル、フラワーエキスポ、農業エキスポ、フェスティバルなど）または会場（国立公園、国立風光明媚な地域、文化公園など）での時間指定のガイド付きツアーの解説（例：10：00〜11：00） ； 14：00〜15：00）説明終了後、「ポケモン囲碁」「ポケモン囲碁」でn分間の入賞コンテスト・解答活動を行い、参加者の交流や興味を高めることができますセックス。 <br>\
                            &nbsp&nbsp&nbspiv）ABCフェスティバル/イベント、XYZ日/週/月などと協力するために、最初に特定のテーマフィールドまたはストーリー用に100〜1000〜nの文化的アトラクション（POI）を構築します（およびいくつかのLOIを形成します）/景勝地（AOI））、一般市民が自分でガイドなしのツアーに参加できるようにします（または文化的および歴史的な解説者に定期的に説明するよう依頼してください）。その後、特定の場所/特定の日付/特定の期間に、n分間のコンテストとポケモンゴーの「ポケモンゴー」と同様の回答アクティビティを実施して、面白い「ABCの深い理解」を達成するように設定されています。」 <br>\
                        </li> \
                    </ul> \
                </div>";


//make_player
L_japan[422] = "サイトのインポートサンプルファイルのダウンロード";
L_japan[423] = "POIをインポート";

// game
L_japan[424] = "";
L_japan[425] = "歩きながら読むグループ";
L_japan[426] = " <thead><tr><th><p style=\"color:#00F; display:inline;\">{{g.foreignkey.group_name}}</p><p style=\"color:#00F; display:inline;\">({% if g.foreignkey.verification == 0  %}まだ確認されていません /{% elif g.foreignkey.verification == 1  %}確認済み /{% else %}検証に失敗しました /{% endif %} {% if g.foreignkey.open == 1 %}一般公開{% else %}非公開{% endif %})</p><div class=\"btn btn-success\" style=\"float: right; margin-right: 10px;\" onclick=\"document.location='game_room/{{g.foreignkey.group_id}}'\">グループを選択</div></th></tr></thead>";
L_japan[430] = "まだ確認されていません /";
L_japan[431] = "確認済み / ";
L_japan[432] = "検証に失敗しました / ";
L_japan[433] = "一般公開";
L_japan[434] = "非公開";
L_japan[435] = "グループを選択";


// game_room
L_japan[427] = "セッション"; 
L_japan[428] = "時間を追加";
L_japan[429] = "文学および首都学校のインポートサンプルファイルのダウンロード";

//群組說明的最後一行
L_japan[437] = "グループリーダーは、メンバーによって作成された景勝地/行/地区およびテーマストーリーのコンテンツとさまざまな属性を変更する権利を持っています（公開<->非公開）。"
L_japan[441] = "リベラルアーツスクール結果お問い合わせ"
L_japan[442] = "総視聴回数"
L_japan[443] = "transfer"
L_japan[444] = "WEBビュー"
L_japan[445] = "APPビュー"
L_japan[446] = "総視聴回数"
L_japan[447] = "文化的および歴史的な専門家の作成スペース"
L_japan[448] = "ガイド付きコメンテーター作成スペース"
L_japan[449] = "プレイヤー作成スペース"
L_japan[450] = "文化と歴史の専門家が景勝地、景勝地、景勝地、テーマストーリーを作成します"
L_japan[451] = "ガイドコメンテーターが景勝地、景勝地、景勝地、テーマストーリーを作成"
L_japan[452] = "プレイヤーは、景勝地、景勝地、景勝地、テーマストーリーを作成します"
L_japan[453] = "すべてに同意する"
L_japan[454] = "グループへの参加を申し込む"
L_japan[455] = "グループへの参加を拒否する"
L_japan[456] = "まだ確認されていません"
L_japan[457] = "確認済み"
L_japan[458] = "検証に失敗しました"
L_japan[459] = "探索-公開グループと検証済みグループを検索"
L_japan[460] = "招待-メンバーを招待するメッセージを送信します（DEHアカウント）"
L_japan[461] = "通知-グループへの招待（グループへの参加の申し込み/グループリーダーのグループへの招待）通知"
L_japan[462] = "住所に基づいて自動生成"
L_japan[463] = "景勝地制作"
L_japan[464] = "私が獲得した賞品のリスト"
//English
L_english = new Array();
L_english[0] = "<p> <li> Point Of Interest (POI): attractions of a single point of introduction, the most basic unit of navigation\
                </li> <br> <li>Line Of Interest (LOI): View the route to consider the situation, \
                Designed to have a geographical relevance of a visit to the succession of planning points \
                A sequence of POIs</li> <br> <li> Area Of Interest (AOI): A set of POIs with a regional association is designed based on a cultural asset of a specific area.\
                </li> <br> <li>Story / Site Of Interest (SOI): The story / field for a (i) across a number of time / space related to people / things or things story or (ii) a specific field of \
                Related story of the person / thing / thing, designed a story that can contain many attractions (POIs), landscape (LOIs) and scenic spots (AOI)</li> </p> ";
L_english[1] = "<i class='fa fa-fw fa-check'></i>Mobile Digital Culture Asset Map";
L_english[2] = "<i class='fa fa-fw fa-check'></i>Creating Space of Culture Expert";
L_english[3] = "<i class='fa fa-fw fa-check'></i>Creating Space of Narrator";
L_english[4] = "<i class='fa fa-fw fa-check'></i>Creating Space of User";
L_english[5] = "Create POI, LOI, AOI, SOI with expert ";
L_english[6] = "Create POI, LOI, AOI, SOI with narrator";
L_english[7] = "Create POI, LOI, AOI, SOI with user";

L_english[8] = "View";
L_english[9] = "--Select--";
L_english[10] = "Expert's Map";
L_english[11] = "User's Map";
L_english[12] = "Narrator's Map";
L_english[13] = "Create Now";
L_english[14] = "Create Now";
L_english[15] = "Create Now";
L_english[20] = "Daily POI";
L_english[21] = "Daily LOI";
L_english[22] = "Daily AOI";
L_english[23] = "Daily SOI";
L_english[24] = "APP Download";
L_english[25] = "Download Manual";

L_english[16] = "Create";
L_english[17] = "Logout";
L_english[18] = "Login";
L_english[19] = "DEH Introduction";

L_english[26] = "DEH Website";

L_english[27] = "My POI ";
L_english[28] = "My LOI";
L_english[29] = "My AOI";
L_english[30] = "My SOI";

L_english[31] = "My POI/LOI/AOI/SOI";
L_english[32] = "Create POI";
L_english[33] = "Create LOI";
L_english[34] = "Create AOI";
L_english[35] = "Create SOI";
L_english[271] = "Group management";
L_english[272] = "Create group";


L_english[36] = "Category";
L_english[37] = "Region";
//L_english[38] = "Subject";
//L_english[39] = "Type";
L_english[40] = "Format";
L_english[41] = "Media Type";
L_english[42] = "POI";
L_english[43] = "LOI";
L_english[44] = "AOI";
L_english[45] = "SOI";
L_english[46] = "All";
L_english[47] = "Experiential";
L_english[48] = "Activation and Reconstructed";
L_english[49] = "disappeared";
L_english[50] = "Figure";
L_english[51] = "Event";
L_english[52] = "Human Landscape";
L_english[53] = "Natural Landscape";
L_english[54] = "Industry";
L_english[55] = "<option class=\"all\" value=\"all\">All</option>\
                <option id=\"Historical\" value=\"古蹟\">Monuments</option>\
                <option id=\"historical_buildings\" value=\"歷史建築\">Historic Buildings</option>\
                <option id=\"Memorial_building\" value=\"紀念建築\">Commemorative Buildings</option>\
                <option id=\"Settlement_buildings\" value=\"聚落建築群\">Groups of Buildings</option>\
                <option id=\"Ruins\" value=\"考古遺址\">Archaeological Sites</option>\
                <option id=\"Historical_site\" value=\"史蹟\">Historic Sites</option>\
                <option id=\"Cultural-1\" value=\"文化景觀\">Cultural Landscape</option>\
                <option id=\"Antique\" value=\"古物\">Antiquities</option>\
                <option class=\"natural\" value=\"自然景觀\">Natural Landscapes</option>\
                <option id=\"Traditional\" value=\"傳統表演藝術\">Traditional Performing Arts</option>\
                <option id=\"Traditional2\" value=\"傳統工藝\">Traditional Craftsmanship</option>\
                <option id=\"Traditional3\" value=\"口述傳統\">Oral Traditions and Expressions</option>\
                <option id=\"Folk\" value=\"民俗\">Folklore</option>\
                <option id=\"Traditional-knowledge\" value=\"傳統知識與實踐\">Traditional Knowledge and Practices</option>\
                <option id=\"General_landscape\" value=\"一般景觀(建築/人工地景/自然地景)\">General landscape (architecture/artificial landscape/natural landscape)</option>\
                <option id=\"Plants\" value=\"植物\">Plant</option>\
                <option id=\"Animals\" value=\"動物\">Animal</option>\
                <option id=\"biological\" value=\"生物\">Biological</option>\
                <option id=\"Food\" value=\"食衣住行育樂\">Food, Clothing, Housing, Transportation, Education, Entertainment</option>\
                <option id=\"Others\" value=\"其他\">Other</option>";
L_english[56] = "Ruins";
L_english[57] = "Culture Landscape";
L_english[58] = "Traditional Art";
L_english[59] = "Folk Customs and Relevant Cultural Artifacts";
L_english[60] = "Antique";
L_english[61] = "Food & Drink, Lodging, Reansportation, Infotainment";
L_english[62] = "Others";
L_english[63] = "Image";
L_english[64] = "Audio";
L_english[65] = "Video";
L_english[66] = "POIs";
L_english[67] = "LOIs";
L_english[68] = "AOIs";
L_english[69] = "SOIs";

L_english[70] = "Docent Information";
L_english[71] = "Name:";
L_english[72] = "Telphone:";
L_english[73] = "Cellphone:";
L_english[74] = "Language:";
L_english[75] = "FB/LINE Account:";
L_english[76] = "Introduction:";
L_english[77] = "Change:";
L_english[78] = "Confirm";

L_english[79] = "Account Information";
L_english[80] = "Account name:";
L_english[81] = "User's Nickname:";
L_english[82] = "Gender:";
L_english[83] = "Male";
L_english[84] = "Female";
L_english[85] = "Address:";
L_english[86] = "Birthday:";
L_english[87] = "Level of Education:";
L_english[88] = "Occupation:";
L_english[89] = "Personnal Homepage:";
L_english[90] = "Login Role:"
L_english[91] = "User";
L_english[92] = "Expert";
L_english[93] = "Docent";
L_english[94] = "Identifier";
L_english[95] = "Edit Personal Information";
L_english[96] = "Edit Password";
L_english[201] = "Modify Personal Information";

L_english[97] = "Year";
L_english[98] = "Period";
L_english[99] = "Address";
L_english[100] = "Latitude";
L_english[101] = "Longitude";
L_english[102] = "Source";
L_english[103] = "Source Creator";
L_english[104] = "Source Publisher";
L_english[105] = "POI Creator/Contributor";
L_english[106] = "Title";
L_english[107] = "Description";

L_english[108] = "Guide Instruction Audio:";
L_english[109] = "Media File";
L_english[110] = "Guide Audio";
L_english[111] = "Image";
L_english[112] = "Audio";
L_english[113] = "Video";
L_english[114] = "Docent Language:";
L_english[115] = "Docent Introduction:";

L_english[116] = "Create POI<img src='../static/images/question.png' data-toggle='modal' data-target='#poi_make_notes' style='display: inline;'>";
L_english[117] = "year";
L_english[118] = "Keyword";
L_english[119] = "Latitude:"
L_english[120] = "Longitude:"
L_english[121] = "Public";
L_english[122] = "Yes";
L_english[123] = "No";
L_english[124] = "Upload Guide Instruction Audio";
L_english[125] = "Upload Image/Video/Audio";
L_english[126] = "None";
L_english[127] = "(ex:No.228, Minzu Rd., Lukang Township, Changhua County 505, Taiwan)-->You can use map to get the address, longitude, and latitude(use left click on the map) ";
L_english[128] = "None Guide Instruction Audio";
L_english[129] = "Back";
L_english[130] = "Confirm";
L_english[131] = "Reset";
L_english[132] = "Prehistory";
L_english[133] = "Dutch and Spanish Colonial Rule";
L_english[134] = "Ming Dynasty";
L_english[135] = "Qing Dynasty";
L_english[136] = "Japanese Occupation";
L_english[137] = "Modem Taiwan";
L_english[138] = "BC~0";
L_english[139] = "Edit POI";
L_english[140] = "Export POI to CSV";
L_english[141] = "Export LOI to CSV";
L_english[142] = "Export AOI to CSV";
L_english[143] = "Export SOI to CSV";
L_english[144] = "(Unverified /";
L_english[145] = "(Verified /";
L_english[146] = "(Verification Failed /";
L_english[147] = "Public";
L_english[148] = "Private";
L_english[149] = "Image)";
L_english[150] = "Audio)";
L_english[151] = "Video)";
L_english[152] = "None)";
L_english[153] = "Delete";
L_english[154] = "Edit";
L_english[155] = "LOI";
L_english[156] = "Guide Audio";
L_english[157] = "Tool";
L_english[158] = "LOI Create/Contributor"
L_english[159] = "Audio format of amr/3gpp/aac is allowed to upload, and the file shouldn't be over 5 M";
L_english[160] = "Image format of gif/jpg/png is allowed to upload, and the capacity shouldn't be over 2 MB.";
L_english[161] = "Video format of mp4/avi is allowed to upload, and the capacity shouldn't be over 15 MB.";
L_english[162] = "None";
L_english[163] = "Clear";
L_english[164] = "Delete";
L_english[165] = "Choose a file";
L_english[166] = "POIs";
L_english[167] = "AOI";
L_english[168] = "LOIs";
L_english[169] = "AOIs";
L_english[170] = "SOI";

//make_player_loi
L_english[171] = "Create LOI";
L_english[172] = "Please Select The POI Region";
L_english[173] = "Title:";
L_english[174] = "Description:";
L_english[175] = "Tool:";
L_english[176] = "Public:";
L_english[177] = "Car";
L_english[178] = "Bike";
L_english[179] = "Foot";
L_english[180] = "LOI Create/Contributor:";

//make_player_aoi
L_english[182] = "Create AOI";
L_english[183] = "Refresh";
L_english[184] = "AOI Create/Contributor:";

//make_player_soi
L_english[187] = "Create SOI";
L_english[185] = "Please Select The LOI Region";
L_english[186] = "Please Select The AOI Region";
L_english[181] = "SOI Create/Contributor:";

L_english[188] = "Edit LOI";
L_english[189] = "Edit AOI";
L_english[190] = "Edit SOI";

//google_map
L_english[191] = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrH6PFm6YsUakE6OxkTi3ekc_bp827osQ&callback=myMap&language=en&region=EN";

L_english[192] = "(User)";
L_english[193] = "(Expert)";
L_english[194] = "(Narrator)";
L_english[195] = "(Verifier)";

L_english[196] = "Contacting window:";

L_english[197] = "Edit Password";
L_english[198] = "Current Password";
L_english[199] = "New Password";
L_english[200] = "Confirm Password";


//export CSV
L_english[201] = "Keyword-1";
L_english[202] = "Keyword-2";
L_english[203] = "Keyword-3";
L_english[204] = "Keyword-4";
L_english[205] = "Keyword-5";
L_english[206] = "POI owner account";
L_english[207] = "Language";
L_english[208] = "POI Title";
L_english[209] = "LOI Title";
L_english[210] = "LOI Owner Account";
L_english[211] = "AOI Title";
L_english[212] = "AOI Owner Account";
L_english[213] = "AOI Contributor";
L_english[214] = "SOI Title";
L_english[215] = "SOI Owner Account";
L_english[216] = "SOI Contributor";

//find_pwd
L_english[217] = "Loss Password";
L_english[218] = "Current account";
L_english[219] = "Email";

//login
L_english[220] = "Account";
L_english[221] = "Password";
L_english[222] = "Login";
L_english[223] = "Forget password";
L_english[224] = "Regist";

//userpwd
L_english[225] = "User password edit";
L_english[226] = "Current Password";
L_english[227] = "New Password";
L_english[228] = "Confirm Password";

//make_player_poi
L_english[229] = "Poi notes";
L_english[230] = "POI is set to ";
L_english[231] = "Verified by the public after the public to read";
L_english[232] = ", you do not need to verify";
L_english[233] = "<b>Region </b>and<b> address</b> Need to be consistent";
L_english[234] = "Hold the keyboard <b>Ctrl </b>Click the picture to select multiple (up to five) pictures, the picture will be more than 2MB will be compressed";
L_english[235] = "<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button><h4 class=\"modal-title\"></h4><div class=\"modal-body make_poi_info\" >\
                </div><p>Monuments:</b><br>Architectural works and its ancillary facilities built for the needs of human life, which are of outstanding universal value from the point of view of history, art or science.</p>\
                <p><b>Historic Buildings: </b><br>Buildings and its ancillary facilities where historical events occurred, or which are of value from the point of view of history, art or science, need to be preserved.</p>\
                <p><b>Commemorative Buildings: </b><br>Buildings and ancillary facilities that have a connection with persons having made important historical, cultural or artistic contributions, and should be preserved.</p>\
                <p><b>Groups of Buildings:</b><br>Groups of separated or connected buildings which, because of their architecture, homogeneity or place in the landscape, are of which are of outstanding universal value from the point of view of history, art or science.</p>\
                <p><b>Archaeological Sites:</b><br>Sites and places that contain the remains or vestiges of past human life which are of value from the point of view of history, aesthetics, ethnology or anthropology.</p>\
                <p><b>Historic Sites:</b><br>Spaces and its ancillary facilities where historical events occurred and are of value from the point of view of history, art or science need to be preserved.</p>\
                <p><b>Cultural Landscapes:</b><br>Locations or environments formed through longtime interactions between human beings and the natural environments, which are of value from the point of view of history, aesthetics, ethnology, or anthropology.</p>\
                <p><b>Antiquities:</b><br>Any arts, utensils of life or civility, books or documents and audiovisual materials having cultural significance and of value of different eras and from different ethnic groups.</p>\
                <p><b>Natural Landscapes and Natural Monuments: </b><br>Natural zones, land formations, geological phenomena, plants, or minerals, which are of value in preserving natural environments.</p>\
                <p><b>Traditional Performing Arts:</b><br>A traditional art that is created in front of or presented to an audience by the artistto pass down through generations among ethnic groups or geographic regions.</p>\
                <p><b>Traditional Craftsmanship:</b><br>Traditional skills and crafts that are mainly handmade and are passed down through generations among ethnic groups or geographic regions.</p>\
                <p><b>Oral Traditions and Expressions:</b><br>To pass the traditions down through generations via language, recitation or singing.</p><p><b>Folklore:</b><br>Traditional customs, ceremonies, religious rites, festivals and ceremonies that are related to citizens' life and of special cultural significance.</p>\
                <p><b>Traditional Knowledge and Practices：</b><br>Knowledge, skills and related practices addressed to nature environment that are accumulated or developed by different ethnic or social groups over a long period of time in order to survive in, adapt to, and handle with.</p>\
                <p><b>General landscape:</b><br>Refers to the scene presented in a certain area, that is, the visual effect. This visual effect reflects the complex composed of the land and the space and material on the land, and is the imprint of complex natural processes and human activities on the earth.</p>\
                <p><b>Plants:</b><br>The general term for all kinds of plants, etc. It is a large category of creatures. The cells of these organisms have cell walls. Generally, there is chlorophyll, and it uses inorganic substances as nourishment, without nerves and feelings.</p>\
                <p><b>Animals:</b><br>Compared to the other large type of organisms of plants, this type of organisms can feed on organic matter on their own to sustain themselves. They have nerves, sensations, and exercise ability. The scope of survival is everywhere in the world.</p>\
                <p><b>Biology:</b><br>Living objects that have the ability to grow, develop, and reproduce, and can exchange substances with the surrounding environment through metabolism. Animals, plants, and microorganisms are all living things.</p>\
                <p><b>Food, clothing, housing, transportation, and entertainment:</b><br>In people's livelihood, the six major needs of the people refer to: (1) Food, clothing, housing, and transportation: necessary for material life. (Original by Dr. Sun Yat-sen, the founding father of the country) (2) Education and music: necessary for spiritual life.</p></div>\
                <div class=\"modal-footer\"><button id=\"make_poi_close\" type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">關閉</button></div>";
L_english[236] = "<b>Experiential:</b><br>It means that the scenic spot still exists and has not disappeared because of the passage of time, such as the existing historical and cultural landscape, industry, cultural relics, etc.";
L_english[237] = "<b>Activation and Reconstructed:</b><br>Denotes that the landscape of the site was restored or rehabilitated, and reapplied to new uses.";

//make_player_loi
L_english[238] = "LOI of the scenic area is the administrative area where the first attraction is located";
L_english[239] = "AOI of the scenic area is the administrative area where the first attraction is located";
L_english[240] = "SOI of the scenic area is the administrative area where the first attraction is located";

L_english[241] = "Please login first";

//list_group
L_english[243] = "Notify";
L_english[244] = "Apply to join group:";
L_english[245] = "Agree";
L_english[246] = "Refuse";
L_english[247] = "invite you to join the group:";
L_english[249] = "No notification message";
L_english[250] = "Explore";
L_english[251] = "My Group";
L_english[252] = "Disband";
L_english[253] = "Manage";
L_english[254] = "Leave";
L_english[255] = "View";
L_english[256] = "Apply";
L_english[257] = "Send Invitation";
L_english[258] = "Group Leader can invite members to the group";
L_english[259] = "User can create multiple groups or apply to join multiple groups";
L_english[260] = "Group Leader Disbandable Group";
L_english[261] = "Group Member could exit group";
L_english[262] = "The group can not be explored if the group is not public";
L_english[263] = "If the group is public and validated, the search function can be found in the group";
L_english[264] = "Close";
L_english[265] = "Invite";
L_english[291] = "Search group";

//make_group
L_english[266] = "Create Group";
L_english[267] = "Group Name:";
L_english[268] = "Group Description:";
L_english[269] = "Public:";
L_english[270] = "Confirm";

//manage_group
L_english[273] = "Group";
L_english[274] = "Edit";
L_english[275] = "Group Description";
L_english[276] = "Members";
L_english[277] = "Kick Out";
L_english[278] = "Yourself";
L_english[279] = "All";
L_english[280] = "Move";
L_english[281] = "Modify";
L_english[282] = "Group Leader Editable Group Information";
L_english[283] = "The group Leader and the production member can see the members of the public to do the POI / LOI / AOI / SOI";
L_english[284] = "Non-group members can only see the members of the public and verified through the POI / LOI / AOI / SOI";
L_english[285] = "Group Leader can kick out Member";
L_english[286] = "Group Leader / Member can be placed in the making of their own POI / LOI / AOI / SOI";
L_english[287] = "Group Leader can modify / remove members made of POI / LOI / AOI / SOI";
L_english[288] = "Group members will leave the group after the group is exited / be kicked out of the group / POI / LOI / AOI / SOI will still exist group, if deleted will disappear";
L_english[289] = "Modify group information";
L_english[290] = "Public / Private";
L_english[292] = "Join Group";
L_english[293] = "Join";

//regist
L_english[294] = "Account (Required):";
L_english[295] = "Password (Required):";
L_english[296] = "name / nickname(Required):";
L_english[297] = "Email:";
L_english[298] = "Gender:";
L_english[299] = "Birthday:";
L_english[300] = "Website:";
L_english[301] = "Education:";
L_english[302] = "Occupation:";
L_english[303] = "Address:";
L_english[304] = "Identity:";
L_english[305] = "Password confirm (Required):";
L_english[306] = "E-mail please fill in the truth, to ensure their own interests";
L_english[307] = "Registration";
L_english[308] = "User";
L_english[309] = "Docent";
L_english[310] = "High school";
L_english[311] = "University";
L_english[312] = "Doctor";
L_english[313] = "Master";
L_english[314] = "Other";
L_english[315] = "Agriculture Farming";
L_english[316] = "Government Structure";
L_english[317] = "Mlitary Police";
L_english[318] = "Research";
L_english[319] = "Social Service";
L_english[320] = "Architecture / Caving";
L_english[321] = "Manufacturing / Foreign";
L_english[322] = "Finance / Security";
L_english[323] = "Battlefield product";
L_english[324] = "Question";
L_english[325] = "Service";
L_english[326] = "Student";
L_english[327] = "house tube";
L_english[328] = "Medical Treatment";
L_english[329] = "Philippine Law Practice";
L_english[330] = "Distribution / Zeroing";
L_english[331] = "Transportation / Transportation / Traveling";
L_english[332] = "Raku / Publishing";
L_english[333] = "Propagation / Rowing";
L_english[334] = "Arts";
L_english[335] = "Waiting for work";
L_english[336] = "Other";

L_english[337] = "Disappeared： ";
L_english[340] = "Indicates that the theme attraction no longer exists. Only historical records are used as a reference."
L_english[338] = "Activation and Reconstructed： ";
L_english[341] = "It means that the scenic spot still exists and has not disappeared because of the passage of time, such as the existing historical and cultural landscape, industry, cultural relics, etc."
L_english[339] = "Activation and Reconstructed： ";
L_english[342] = "Denotes that the landscape of the site was restored or rehabilitated, and reapplied to new uses."

//導覽地圖
L_english[343] = "Serch docent: "

//歷史紀錄
L_english[344] = "History";
L_english[345] = "Browsing Track";
L_english[346] = "Action Track";
L_english[347] = "<h3>History: Record POIs/LOIs/AOIs/SOIs</h3> viewed on DEH";
L_english[348] = "Browsing Track: POIs/LOIs/AOIs/SOIs Information Viewed on the DEH Website";
L_english[349] = "Action Track: POIs/LOIs/AOIs/SOIs information viewed on DEH APPs";
L_english[350] = "Attraction";
L_english[351] = "Viewline";
L_english[352] = "Scenic District";
L_english[353] = "Theme Story";
L_english[354] = "Query";
L_english[355] = "Time";
L_english[356] = "Title";

// 文史脈流服務平台會員服務使用條款
L_english[357] = "<strong>DEH Member Service Terms of Use</strong><br />You are welcome to join the membership of the cultural history service platform. All users who use membership services (hereinafter referred to as members) should read the following details. The terms of the agreement, which are intended to protect the interests of the provider of the member service and all users, and constitute a contract between the user and the member service provider.";
L_english[358] = "If you are under the age of 18, you must use or continue to use the Service after your parent (or guardian) has read, understood and agreed to all the contents of these Terms of Service and subsequent changes. By using or continuing to use the Service, your parent (or guardian) has read, understood and agreed to accept all of the contents of this Agreement and subsequent changes.";
L_english[359] = "When the user completes the registration process or begins to use the member services provided by the literary service platform, it is deemed to be aware of and fully agrees with all the terms of these Terms of Use:";
L_english[360] = "<strong>I、Membership Service</strong>&nbsp;<br /><br />1.&nbsp;After confirming the membership application, the member will be provided with services according to the service channel, project, content, status and function established by the system at that time;The Service Platform reserves the right to add, reduce or change all or part of each Service Channel, Project, Content and Function at any time without notice.<br />2.&nbsp;Some services or projects may be built or provided by partners of the Service Platform,or need to be individually applied or registered by the member, or need to be paid by the member，all are subject to the instructions and related pages of the service channels and projects modified at the time and subsequently.<br /> 3.&nbsp;The service platform reserves the right to change the free service to a fee-based service at any time, and to change the charging standard.The content of the changes will not be separately notified unless published on each of these pages.<br />4.&nbsp;Some member services may have different usage specifications or agreements, and members should also abide by the usage specifications and related agreements of each service channel or project.<br /><br />";
L_english[361] = "<strong>II、Account number, Password and Security</strong>&nbsp;<br /><br />1.&nbsp;Members should complete the registration process, provide the information required in the member registration or process, and warrant that all information provided is correct and current. If the information provided by the member is changed afterwards, the member should update the retained information immediately. data. If the member does not provide the information immediately, fails to provide the information according to the specified method, or the information provided is incorrect or does not conform to the facts, the service platform reserves the right to refuse or suspend all or one of the related services to the member at any time without prior notice. Rights.<br />2.&nbsp;Members can choose their own username and password, but members have the obligation to keep it safe and confidential. They must not disclose or provide it to third parties. For the use of member services with a specific username and password, and after logging in to the system, All actions shall be the responsibility of the member holding the username and password.<br />3.&nbsp;If a member discovers or suspects that his or her username and password have been fraudulently used or improperly used by a third party, the member shall immediately notify the service platform to facilitate appropriate response measures by the service platform; however, the above measures shall not be construed as the service. The Platform therefore expressly or implicitly assumes any form of compensation or compensation for the Member.<br /><br />";
L_english[362] = "<strong>III、Personal Data Protection&nbsp;</strong><br /><br />1.&nbsp; This service platform will protect the personal data of each member. For the personal information provided by the members, the service platform is only used for the purpose of providing the service. The Service Platform will not provide the Member's personal data to third parties except members may be involved in violations of the law, infringement, violation of these Terms of Use or the use of the service or the agreement, or with the consent of the person.<br />2.&nbsp;In the following circumstances, the service platform may view or provide members' personal data or related telecommunications materials to relevant government agencies, or third parties who claim that their rights are infringed and provide appropriate certification:<br />(1)&nbsp;According to the law, or according to the orders of the judicial organs or other relevant government agencies;<br />(2)&nbsp;Members are involved in violation of laws and regulations, infringement of third party rights, or violation of these Terms of Use or each of these usage rules or agreements;<br />(3)&nbsp;To protect the security of the member service system or the legitimate rights and interests of the operator;<br />(4)&nbsp;To protect the legitimate rights and interests of other users or other third parties;<br />(5)&nbsp;To maintain the normal operation of the system;<br />3. Other unspecified matters shall be handled in accordance with the provisions of the Personal Data Protection Law of the Republic of China.<br /><br />";
L_english[363] = "<strong>IV、Data Storage</strong><br /><br />1.&nbsp;Members should back up all materials they upload, publish or store in the system. The service platform will periodically back up the information stored by the members according to the method and processing energy set by the system at the time, but does not guarantee that the information stored by the members will be completely backed up; the member agrees that the service platform does not need to be backed up, The deleted data or the data that failed to be backed up is responsible for the data.<br />2.&nbsp;This system does not guarantee that the information uploaded by the member will be displayed normally, nor does it guarantee the correctness of the data transmission; if the member finds that the system has errors or errors, please notify the website administrator of the system immediately.<br />3.&nbsp;The system will automatically detect the member accounts that have not been used for a certain period of time. For the member accounts that have not been used for a certain period of time, the system will automatically delete all emails, files, user-set data files and related materials of the user account, and Make another backup and suspend the use of this user account. The record of whether or not to use the login is subject to the records retained in the member service system of the service platform.<br /><strong><br />";
L_english[364] = "V、Provision and Use of member services</strong><br /><br />1.&nbsp;All relevant domain names and network addresses provided by the service platform or partners for providing member services are still owned by the service platform or other legal rights holders. Members are only allowed to use the membership during the period of retaining membership. The Terms and the methods agreed upon in each of the Terms of Use or related agreements shall be used, and Members shall not transfer, rent or lend their membership or membership rights to any third party.<br />2.&nbsp;The search or search or search service or function provided in the member service is an automated service and software tool provided by the computer program system. The user searches or retrieves according to the selected or set conditions or content; The results of the search, search or mapping, related links and their contents are not guaranteed to be displayed and the correctness of the data transmission is not guaranteed.<br />3.&nbsp;For specific member services, the service platform may contact partners or other vendors to provide relevant images, pictures or other works or materials for members to browse, retrieve or use, but users must comply with relevant licensing agreements or restrictions. The legality of such drawings, images and other works or materials is the sole responsibility of the partner or manufacturer providing the images, images and other works or materials.<br />4.&nbsp;Any information (including, but not limited to, text, images, videos, files or other materials) or pages created by members in the server space provided by the system, the relevant ownership and advertising layout rights are still owned by the service platform. All, except for the prior consent of the service platform, whether or not it is paid, members may not sell, operate, or provide online advertising or similar services by any third party.<br />5.The account number applied by the member can be used in addition to the \"History of History and Navigation\" service platform, and can also be used on the rest of the customized platform (such as \"Taiwan Tainan Action Guide Service\"), including websites and APPs.<br>6. Members\' content (POIs/LOIs/AOIs/SOIs) uploaded on the \“Civil History Action Navigation Service\” platform can select their own POIs/LOIs/AOIs/SOIs to be imported into the rest of the customized platform.<br><br />";
L_english[365] = "<strong>VI、User Behavior</strong><br /><br />1.&nbsp;Members must not engage in commercial activities without prior authorization.<br />2.&nbsp;Information uploaded by members or published in various member services (including and not limited to text, pictures, videos, files or other materials) is automatically uploaded, published or stored in various member services by the computer system in accordance with the instructions of the members. The website and location, this service platform is not responsible for review, verification or editing.<br />3.&nbsp;Members must abide by the relevant laws and regulations and must not engage in the following activities:<br />(1)&nbsp;Send any mail, file or information that violates the relevant laws and regulations of the Republic of China on the export of technical data.<br />(2)&nbsp;Publish, transmit, transmit or store any mail, pictures, files or materials that may impair the reputation or goodwill of others, fraud, defamation, pornography, gambling, violation of public order or other violations of the law.<br />(3)&nbsp;Publish, transmit, transmit or store any work or material that infringes upon the intellectual property rights or other rights of others.<br />(4)&nbsp;Collecting email addresses and other personal information without consent.<br />(5)&nbsp;Extract or use all or part of any database content in the Member Services without consent.<br />(6)&nbsp;Publish, transmit, transmit, store viruses, or any other program or message that is sufficient to disrupt or interfere with computer systems or data.<br />(7)&nbsp;Destruction or interference with the operation of the member service system or violation of general online courtesy.<br />(8)&nbsp;Unauthorized access to the member service system or network related to the system, or fraudulent use of other people's accounts or forged sender identification data to send mail in an attempt to mislead the recipient's judgment.<br />(9)&nbsp;Any behavior that interferes with or interferes with the use of Member Services by other users.<br />(10)&nbsp;Send lucky chain letters, spam, advertising letters or other unsolicited messages.<br />(11)&nbsp;Any act of stealing member account, password or access rights for membership services through improper channels.<br />(12)&nbsp;Others do not comply with the purpose of use provided by the member services.<br />4.&nbsp;If any text, image, video, file or other work or material uploaded, published, transmitted, transmitted or stored by a member or a third party is in violation of the Act or infringement of the rights of third parties, or in violation of these Terms of Use or Other service specifications or agreements, or disputes involving infringement or other legality by third parties, the service platform has the right to delete, move or stop accessing at any time without notice, or to stop providing member services for each member. All or part of it; for the members of such acts, in addition to the legal liabilities arising therefrom, the liability for the damage to the service platform and the expenses incurred shall be borne and compensated.<br /><br />";
L_english[366] = "<strong>VII、Ownership of rights and membership authorization for this service platform</strong><br /><br />1.&nbsp;All web design, interface, URL, trademark or logo, computer program, database, etc. provided by the member service, such as trademark, copyright, other intellectual property rights and ownership of the data, are legally used by the service platform or authorized by the service platform. The owner of the rights.<br />2.&nbsp;The member services of this service platform only provide relevant server space and system for members to use. Members will not obtain authorization for the relevant trademarks, copyrights or other intellectual property rights of the service platform and individual member services. <br />3.Members upload, build, publish and store information on the Service, and agree to authorize the use of the website for the use of non-commercial activities such as browsing and recommendation by users.<br />4.&nbsp;All works and materials uploaded, constructed, published and stored by the Member in the Member Services, and their copyright or other intellectual property rights are still owned by the legal rights holders of the members or authorized members; however, the members must guarantee the works or materials Not in violation of the Act or infringement of the rights of third parties, and agrees to authorize the Service Platform to be stored and published on the Website, and may be used on the Website in such manner as the Service Platform deems appropriate, including for the use of different software or hardware devices. Various versions or formats of production or conversion, such as versions suitable for online reading, and downloadable for various computer devices (including smartphones, mobile devices, and similar devices developed in the future market) Versions or formats, etc., are provided to specific or unspecified people for online browsing, enquiry, retrieval, offline reading or receiving, and are free to use as long as they do not involve commercial activities. The Member also agrees to authorize the Service Platform to select the books and materials that the Member has uploaded, constructed, published and stored in the Member Services, and to publish the newsletter or similar after it has been collected, compiled, or aggregated with other members\' works and materials. Electronic messages, including but not limited to e-newsletters and related messages used for marketing or promotional purposes in conjunction with the Service Platform and the Member Services. Except for the transfer or re-authorization of the member services, the service platform will not transfer or re-authorize the books and materials uploaded, published and stored by the members to third parties.<br>5. The service platform collects the member\'s browsing history and the location record of the uploaded data as the member\'s action track and browsing track.<br><br /><br />";
L_english[367] = "<strong>VIII、Exclusion and limitation of liability</strong><br /><br />1.&nbsp;The member services provided by the service platform are only provided according to the function and current status of each service at the time, and the specific requirements or requirements of the user, including but not limited to speed, security, reliability, integrity, The service platform is not responsible for any warranty or guarantee, express or implied, as to the correctness and non-disconnection and error.<br />2.&nbsp;This service platform does not guarantee that the transmission and storage of any mail, file or data is reliable and correct, and does not guarantee the security, reliability, completeness, correctness and non-existence of the stored or transmitted mail, files or materials. The service platform shall not be liable for damages caused by disconnection, error, etc. due to failure, loss or error in the transmission or storage of the mail, file or data.<br />3.&nbsp;The Service Platform is not liable for any direct or indirect damages resulting from the use of the Member Services provided by the Service Platform, even if the Service Platform has understood the suggested actions.<br /><br />";
L_english[368] = "<strong>IX、Service suspended or interrupted</strong><br /><br />1.&nbsp;The service is suspended or interrupted during the routine maintenance, alteration or change of the member service system or function. The service platform will notify the member by email, announcement or other appropriate means before the suspension or interruption.<br />2.&nbsp;The Service Platform will suspend or discontinue all or part of the Member Services in the following circumstances and shall not be liable for any direct or indirect damages suffered by the User:<br />(1)&nbsp;When relocating, replacing, upgrading, maintaining or repairing the hardware and software equipment related to the member service;<br />(2)&nbsp;The user has any violation of the Act, these Terms of Use or each of the Terms and Conditions of Use;<br />(3)&nbsp;The suspension or interruption of membership services due to the actions of third parties, natural disasters or other force majeure;<br />(4)&nbsp;Member services are discontinued or discontinued due to other matters that are not under the control of the Service Platform or that are not attributable to the Service Platform.<br />3.&nbsp;Value-added services paid by members for use, if they are in violation of relevant laws and regulations, violation of these Terms of Use or the respective usage rules or agreements, or as required by the law or according to the requirements of the relevant authorities, or because they are not attributable to the service platform. When the payment or value-added service is suspended or interrupted in whole or in part, it will still be charged as usual during the suspension or interruption.<br /><br />";
L_english[369] = "<strong>X、Termination of Service</strong><br /><br />1.&nbsp;Based on the operation of the service platform, the service platform reserves the right to stop providing all or part of the member service at any time. The service platform shall not be liable for compensation or compensation to the member.<br />2.&nbsp;If the member violates these Terms of Use or the usage rules or agreements of the member services, the service platform reserves the right to temporarily suspend the service or terminate the service at any time without any liability for compensation or compensation.<br /><br />";
L_english[370] = "<strong>XI、Modification of these Terms of Use</strong><br /><br />This service platform reserves the right to modify the terms of use of this member service and the respective usage specifications or agreements at any time. The revised content will be posted on the member service related webpage without separately notifying the user.<br /><br />";
L_english[371] = "<strong>XII、Governing law and Jurisdiction</strong>&nbsp;<br /><br />1.&nbsp;These Terms of Use and the relevant usage specifications and agreements for each member service are governed by the laws of the Republic of China.&nbsp;<br />2.&nbsp;In case of any dispute arising from the membership service, or the terms of use and the relevant usage rules and agreements of the member services, the Tainan District Court of Taiwan shall be the court of first instance.";
L_english[372] = "<strong>XIII、Other </strong>";
L_english[373] = "In the absence of any of these terms, the parties agree to deal fairly with the relevant laws and principles of good faith.";
L_english[374] = "I have read it in detail, understand and accept";
L_english[375] = "CONFIRM";
L_english[376] = "Please tick to accept and confirm";

//intro
L_english[377] = "The \"Arts and History Pulse Digital Cultural Assets Guide Service Platform\" is an open platform that provides (1) digital content of cultural assets to everyone (i) using mobile phones or tablets for local cultural asset navigation or (ii) Virtual cultural asset navigation on a desk, mobile phone or tablet, and (2) various software tools for everyone to create and store various types of Mobile Asset Culture Digital Content (Mobile Digital Culture Heritage Content).";
L_english[378] = "Cultural Asset Action Digital Content Classification";
L_english[379] = "The type of digital content of cultural assets action (Category)";
L_english[380] = "<ul><li>Point Of Interest, POI:<br> A single attraction introduction, the most basic unit for navigation.</li><li>Line Of Interest, LOI:<br>Taking a guided situation as a consideration, designing a guided tour route with geographical relevance(A sequence of POIs),for a sight line with a sequence of visits.</li><li>Area Of Interest, AOI:<br> Designing a group of scenic spots with geographical relevance based on the cultural assets of a specific region(A set of POIs),getting a storyful scenic spot.<li>Story/Site Of Interest, SOI:<br>It is targeted for related persons, events and objects of a Story/Site in the temporal/spatial axis SOI can contain a number of POIs, LOIs, and/or AOIs.</li>";
L_english[381] = "The level of digital content of cultural assets actions (Class)";
L_english[382] = " <ul><li>Expert</li><li>Player</li><li>Guide commentator</li></ul>";
L_english[383] = "Language of cultural assets action digital content (Language)";
L_english[384] = "<ul><li>Chinese</li><li>English</li><li>Japanese</li></ul>";
L_english[385] = "Region of Chinese Cultural Assets Action Digital Content (Region)";
L_english[386] = "<ul><li>You can use Chinese to create and navigate the attractions/views/scenics of countries and regions around the world (the phone is set to Chinese mode)</li><li>Taiwan: by county/city-township/town/district area</li><li>Countries of the world: countries as a unit</li></ul>";
L_english[387] = "Region of the foreign language version of the cultural assets action digital content (Region)";
L_english[388] = "<ul><li>English/Japanese production and navigation of attractions/views/scenes in countries and regions around the world (phone settings in English/Japanese mode)</li><li> English: Taiwan: by county/city-township/town/district area<br>Countries of the world: countries as a unit</li><li>Japanese: Taiwan: by county/city-township/town/district area<br>Japan:</li></ul>";
L_english[389] = "Attractions (POI) content classification";
//L_english[390] = "<ul><li>Evanescent: It means that the attraction has ceased to exist, leaving only historical documents for reference. Such as the big/small city gate of Tainan Fucheng and the old railway station of Taipei.</li><li>Experienced: Indicates that the attraction still exists and does not disappear because of the passage of time. Such as the existing historical and cultural landscape (Da Nanmen of Tainan Fucheng), industry (degree of small moon), cultural relics (Jade jade cabbage) and so on.</li><li>Revitalization and Reconstruction: Indicates that the landscape of the attraction has been restored or restored and re-used for new uses. For example, Tainan Rende Shigu Wenchuang Park (formerly Taiwan Sugar Factory) and Taipei Songshan Wenchuang Park (formerly Songshan Tobacco Factory).</li></ul>";
//L_english[391] = "Attractions theme (Subject)";
//L_english[392] = "Attraction type (Type)";
//L_english[393] = "<ul><li>Natural landscape</li><li>Cultural attractions</li><li>Event</li><li>Character</li><li>Industry</li></ul>";
L_english[394] = "Attractions category (Format)";
L_english[395] = "<ul><li>Monuments</li><li>Historic Buildings</li><li>Commemorative Buildings</li><li>Groups of Buildings</li><li>Archaeological Sites</li><li>Historic Sites</li><li>Cultural Landscape</li><li>Antiquities</li><li>Natural Landscapes</li><li>Traditional Performing Arts</li><li>Traditional Craftsmanship</li><li>Oral Traditions and Expressions</li><li>Folklore</li><li>Traditional Knowledge and Practices</li><li>General landscape (architecture/artificial landscape/natural landscape)</li><li>Plant</li><li>Animal</li><li>Biological</li><li>Food, Clothing, Housing, Transportation, Education, Entertainment</li><li>Other</li></ul>";
L_english[396] = "Attractions Media Category (Media Type)";
L_english[397] = "<ul><li>Picture + Text</li><li>Movie + Text</li><li>Audio + Text</li></ul>";
L_english[398] = "Sightseeing Audio Guide Commentary";
L_english[399] = " <ul><li>Sight producers have to add relevant audio guides to give users a deeper understanding of the attractions.</li></ul>";
L_english[400] = "Permissions for Use of Attractions";
L_english[401] = "<ul><li>public</li><li>Not public (private)</li></ul>";
L_english[402] = "<h5 class=\"page-header\">For the website provided by this platform, please enter<a href=\"http://deh.csie.ncku.edu.tw\">http://deh.csie.ncku.edu.tw</a> The system will automatically import</h5><ul><li>Table machine version</li><li>Mobile and tablet version</li></ul>";
L_english[403] = "APPs Provided By The DEH Platform";
L_english[404] = "<div class=\"panel panel-info\"><div class=\"panel-heading\"><h3>Pure Guide</h3></div><div class=\"panel-bod\"><ul><li><strong>DEH Lite<strong style='color:red;'>(Not available)</strong></strong>:<br>Show nearby photos(image)、sound(audio)and film(video) Point Of Interests(POIs);Play the audio guide commentary included in the POI;Using Facebook, Line and other tools share related POI.</li><li><strong>DEH Mini II</strong>:<br>Show nearby or my photos(image)、sound(audio)and film(video)POIs , nearby or my Line Of Interests(LOIs)and Area Of Interests(AOIs);Play the audio guide commentary included in the POI;Using Facebook, Line and other tools share related POI.</li><li><strong>Narrator<strong style='color:red;'>(Not available)</strong></strong>:<br>This app allows the guide narrator to turn on the Wi-Fi hotspot of his mobile phone, allowing members who participate in the guided tour to connect to the Wi-Fi hotspot via the Wi-Fi network on their mobile phone. Share the guide to the narrator's text and audio-visual attractions. Guided narrators can use this app to download photos/videos/sound attractions (views/scenes) information of cultural assets near their location, which can be used to assist them in adding cultural assets to add text and audio and video.</li></ul></div></div>";
L_english[405] = "Purely Produced POIs";
L_english[406] = "<ul><li><strong>DEH Make II</strong>:<br>Create photo, video and audio attractions (POI); audio guides for recording attractions (POI); use FB, Line and other tools to share a good location (POI).<br>Group function: Create your own group or apply to join another group. The group leader can verify that all members in the group create POI/LOI/AOI/SOI.</li></ul>";
L_english[407] = "<div class=\"panel-heading\"><h3>Guide and production of POIs</h3></div><div class=\"panel-body\"><ul><li><strong>DEH Image<strong style='color:red;'>(Not available)</strong></strong>:<br>Create photo, video and audio attractions (POI); audio guides for recording attractions (POI); use FB, Line and other tools to share a good location (POI).</li><li><strong>DEH Video<strong style='color:red;'>(Not available)</strong></strong>:<br>Produce audio guides for video attractions (POI) and recorded attractions (POI); showcase my video attractions (POI); share fascinating flim(video) attractions (POI) with FB, Line and other tools.</li><li><strong>DEH Audio<strong style='color:red;'>(Not available)</strong></strong>:<br>Produce audio guides for audio attractions (POI) and recorded attractions (POI); showcase my audio attractions (POI); share fascinating sound(audio) attractions (POI) with FB, Line and other tools.</li></ul></div>";
L_english[408] = "<div class=\"panel-heading\"><h3>Pure Guide</h3></div><div class=\"panel-body\"><ul><li><strong>DEH Micro<strong style='color:red;'>(Not available)</strong></strong>:<br>Show nearby photos, POIs, Line Of Interests (LOIs) and Area Of Interests (AOIs); share relevant attractions (POI) with FB, Line and other tools.</li></ul></div>";
L_english[409] = "<h5 class=\"page-header\">For the website provided by this platform, please enter<a href=\"http://deh.csie.ncku.edu.tw\">http://deh.csie.ncku.edu.tw</a> The system will automatically import</h5><ul><li>Table machine version</li><li>Mobile and tablet version</li></ul>";
L_english[410] = " <h1 class=\"page-header\">The platform may use objects and situations (not limited, no restrictions, please users think)</h1><ul> <li> The people's life circle:<br>Community Development Association stores its cultural history and natural landscape information<br>Aboriginal tribes store their cultural records and natural landscape information</li><li>Field:<br>Farm/forest/fishing/grazing park and homestay<br>Natural landscape park<br>Museum / Heritage Museum</li><li>Literature and History Worker/Studio:<br>Digitize and store its historical data</li><li>National Parks and National Scenic Areas:<br>Digitize and store its natural landscape content</li><li>Cultural Assets Guide narrator</li><li>Driver guide commentator for taxi/taxi car charter tour</li><li>Retention and use of traditional cultural assets:<br>Monument<br>historical buildings<br>Settlements<br>Ruins<br>Cultural landscape</li><li>school education:<br>High/Medium/Primary School Digital Mobile/Outdoor/Local Teaching<br>University Culture / History / Sightseeing / Leisure and other courses in Taiwan's heritage cultural assets related courses<br>Community university course<br>University general education course</li><li>Public depth travel diary</li><li>Field theme story</li></ul>";
L_english[411] = " List of usage scenario of Platform";
L_english[412] = "<div class=\"panel-heading\"><h3>Scenario 1: Community Development Association / Aboriginal Tribe Guide / Field / Homestay</h3></div><div class=\"panel-body\"><ul><li> Planning AOI and Production POIs:<br>Historic sites, historic buildings, settlements<br>Ruins<br>Cultural landscape<br>Natural landscape<br>Folk customs and related cultural relics<br>Evanescent/experience/revitalization and re-creation of natural landscapes/human landscapes/events/characters/industry photos/movies/sounds of various POIs<br></li><li>Self made LOIs :<br>According to the characteristics of each theme, plan and design several related LOIs</li><li>Local explanations and tours - community, tribe and field commentators</li><li>Self-help travel – self-guided tour guide with your phone or tablet</li></ul></div>";
L_english[413] = "<div class=\"panel-heading\"><h3>Scenario 2: University/High School/Junior/Primary School Digital Action/Outdoor/Local Teaching & Community University Local Cultural Assets Course</h3></div><div class=\"panel-body\"><ul><li>Guide course 1:<br>Existing POIs => Designated AOI / LOI</li><li>Guided Course 2:<br>Existing POIs + teachers / student-made POIs (produced before the tour)<br>=> Designated AOI / LOI</li><li>Guided Course 3:<br>Existing POIs=>Designated AOI / LOI+  Teacher/student collects content on-touring (investigation, record, photography, video, recording)<br>=>After the tour, make POIs/AOI/LOI (homework)</li><li>Pure homework without a local tour:<br>Action Digitalization in Local Cultural Assets Production POIs / AOI / LOI</li></ul></div>";
L_english[414] = "<div class=\"panel-heading\"><h3>Scenario 3: Mobile Culture Asset Guide Talker</h3></div><div class=\"panel-body\"><ul><li>Historic sites, historic buildings, settlements<br>Ruins<br>Cultural landscape<br>Natural landscape<br>Folk customs and related cultural relics<br>Evanescent/experience/revitalization and re-creation of natural landscapes/human landscapes/events/characters/industry photos/movies/sounds of various POIs</li><li>Public attractions and private attractions</li><li>Designing a variety of LOIs for different types of trips by individuals or groups:<br>Public LOIs and private LOIs</li><li>Local explanation and navigation</li><li>One (or more) Flag-Ship attractions with other surrounding attractions to form a variety of LOIs and AOIs</li><li>Ways to market for narrator/field advertising:<br>Online advertising (via FB): all made up of public POIs<br>Actual tour: including some public attractions and some private spots that are not open (self-developed private attractions)</li><li>Divided into spring, summer, autumn and winter 4 kinds of POIs/LOIs/AOIs</li><li>Updated content every year:<br>The same field: different people / things / objects<br>Develop different fields: different people / things / places / objects<br>Last year’s private POIs became public spots for themselves or others this year.<br>This year, I will develop my own private property POIs.<br></li></ul></div>";
L_english[415] = "<div class=\"panel-heading\"><h3>Scenario 4: Literature and History Worker / Studio</h3></div><div class=\"panel-body\"><ul><li>Select the target cultural assets scenic AOI and production POIs according to the literature and knowledge of the possession:<br>Historic sites, historic buildings, settlements<br>Ruins<br>Cultural landscape<br>Natural landscape<br>Folk customs and related cultural relics<br>Evanescent/experience/revitalization and re-creation of natural landscapes/human landscapes/events/characters/industry photos/movies/sounds of various POIs<br></li><li>Design a variety of theme LOIs</li><li>purpose:<br>Cultural asset retention and study<br>Local explanation and navigation<br>Visiting self-help tourists</li></ul></div>";
L_english[416] = "<div class=\"panel-heading\"><h3>Scenario 5: Pro-Volkswagen Deep Tour</h3></div><div class=\"panel-body\"><ul><li> Before travel: route planning (on the DEH web site (http://deh.csie.ncku.edu.tw)<br>Search for POI, build tourist LOI /AOI<br>Select an expert or player LOI /AOI<br>Create a tourist LOI /AOI with reference to the expert or player's LOI /AOI</li><li>Travel: Field tour (using DEH Mini II)<br>Timely attraction introduction<br>Destination navigation<br>Field tour<br>Use DEH Make II to take photos, videos, and recordings, make POIs, upload to DEH server</li><li>After the trip:<br>After returning to the car or going home, go to the DEH web site (http://deh.csie.ncku.edu.tw) to organize the uploaded photos/movies/sounds of various POIs.<br>Write LOIs and AOIs<br>Complete the travel diary, send to FB, Line, Weibo, etc., share friends and family </li></ul></div>";
L_english[436] = "<div class=\"panel panel-info\" id = \"Platform_use_scenario6\"><div class=\"panel-heading\"><h3>Scenario 6: Field theme story</h3></div><div class=\"panel-body\"><ul><li>Purpose:<br>Create and market a specific field, event or story.</li><li>Principle:<br>According to the actual or legendary local characters/events/landscapes/industry of the field, select the target domestic/foreign target people to create the theme field or story (Site/Story Of Interest, SOI)<br></li>\
                <li>Contents:<br>writing the subject matter (SOI); designing and planning sightlines (LOIs) and scenic spots (AOIs); making scenic spots (POIs).<br></li><li>Goals:<br>Preserve and promote local cultural assets; increase job opportunities and income for guides and commentators; enhance local industries and increase/create local job opportunities.</li></ul></div></div>";
L_english[417] = "APP Download";
L_english[418] = "<li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=com.mmlab.m1\">Get DEH-Mini II on Google Play (Tour of attractions)</a></li><li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=edu.deh.make_II\">Get DEH-Make II on Google Play (Sights Maker)</a></li>";
L_english[419] = "<li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-lite/id1347669266?l=zh&mt=8\">Get DEH-Mini II on the Apple Store (Sightseeing Guide)</a></li><li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-make/id1324053125?l=zh&mt=8\">Get DEH-Make II on the Apple Store (POIs production)</a></li>";
L_english[420] = "<a class=\"btn btn-lg btn-default btn-block\" id=\"handout-2\">Handout Download</a><li><a class=\"link-2\" href=\"/static/activites/DEH_Make_II_使用手冊.pptx\">DEH Make II handout</a></li><li><a class=\"link-2\" href=\"/static/activites/DEH_Mini_II_使用手冊.pptx\">DEH Mini II handout</a></li><li><a class=\"link-2\" href=\"/static/activites/DEH_網站_使用手冊.pptx\">DEH Website handout</a></li></ul>";
L_english[421] = " <a class=\"btn btn-lg btn-default btn-block\" id=\"intro_video-2\">Video of usage scenario</a><ul class=\"intro_video-1\"><li><a class=\"link-3\" href=\"https://youtu.be/ht5Y4-xPxT4\" target=\"_blank\">The History of Literature - Stepping on the Joy of Tainan</a></li><li><a class=\"link-3\" href=\"https://www.youtube.com/watch?v=yFi8ueKYpC8&feature=youtu.be\" target=\"_blank\">The history of literature and history - the essays of Tainan</a></li></ul>";
L_english[438] = "Advanced functions of DEH platform"
L_english[439] = "<div class=\"panel panel-info\">\
                <div class=\"panel-heading\">\
                    <h3>\Group function</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul>\
                        <li>\
                            The difference between the group function of the DEH platform and the group function of FB/Line is that the group leader has the right to modify the content and various attributes of the scenic spots/lines/zones and themed stories made by the members. <br>\
                        </li>\
                        <li>\
                            Use context:<br>\
                            i) The opening teacher of each class creates a group. The students in this class classify the scenic spots/lines/regions and thematic story assignments they made for this course into this group. The teacher can easily enter this group Find students’ works; you can create a group for the club and invite the members of the club in. Then the attractions/lines/area and themed stories uploaded by these members can be summarized in this group, and you can see the club in the group All members’ works. The class/club instructor can use the permissions of the group leader to modify the content and attributes of the scenic spots/lines/districts and themed stories made by students/members (public <->\not public), such as general students/ The paper (or .docx) submitted by the members is just like homework, and the content can be modified. <br>\
                            ii) Scene line/scenic group creation:<br>\
                            *The person in charge creates a group and invites group members to join this group. <br>\
                            *After each team member has created and uploaded the content of the scenic spots that they are responsible for after the division of labor, they are classified in this group, and everyone can easily see the content made by others. <br>\
                            *The person in charge of the group modifies the content of the scenic spots made by the group members, and clicks on all or part of the scenic spots to form the target scenic line/scenic area. <br>\
                            iii) Themed story group creation:<br>\
                            *The person in charge creates a group and invites group members to join this group. <br>\
                            *After each team member has created and uploaded the content of the scenic spot/line/area that is responsible for the division of labor, they are classified in this group, and everyone can easily see the content made by others. <br>\
                            *The person in charge of the group modifies the content of the scenic spots/lines/regions created by the team members and clicks on all or part of the scenic spots/lines/regions to form the target theme story. <br>\
                        </li>\
                    </ul>\
                </div>\
                </div>";
L_english[440] = "<div class=\"panel panel-info\">\
                <div class=\"panel-heading\">\
                    <h3>\Wenzi Academy-Pokemon Go-like interactive features</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul>\
                        <li>\
                            Similar to the Pokemon Go-like interactive function \"Wenzi Academy\", users can use their mobile phones to grab and answer questions in the air while walking:<br>\
                            1) The question can be set in (a) a certain fixed point within n meters/km (b) a certain period of time can have © k people to answer correctly. <br>\
                            2) The answer can be yes or no, choice or question and answer (text+photo, video or sound). <br>\
                            3) The title can be plain text or text+photo, video and/or sound. <br>\
                            4) In the APP DEH Mini II (Android/iPhone) \"WenZi Academy\", it has the functions of launching, grabbing questions, answering questions, revealing answers and presenting scores. <br>\
                            5) Flexible day reading setting methods, customized scoring function, automatic scoring and ranking statistics, as well as the function of grabbing and answering historical records. <br>\
                            6) Use context: <br>\
                            &nbsp&nbsp&nbspi) University general / literature and history and high / middle school / elementary school in the local and rural / cultural guide courses after the on-site guided tour, the teacher can start the \"literacy school\", allowing students to \"experiment in fun\" in the current local Questions and answers in the air. <br>\
                            &nbsp&nbsp&nbspii) After the cultural assets commentator conducts the guided commentary, the members can use the \"Wenzi Academy\" to answer questions during free activities, which will increase the fun and entertainment. <br>\
                            &nbsp&nbsp&nbspiii) Timed guided tour commentary (e.g. 10:00~11:00) in some activities (such as Taiwan Lantern Festival, Flower Expo, Agricultural Expo, festivals, etc.) or venues (such as national parks, national scenic areas, cultural parks, etc.) ；14:00~15:00), after the explanation, you can conduct n-minute prize-winning contests/answer activities in the \"Pokémon Go\" \"Pokémon Go\" to increase the interaction and interest of the participating people Sex. <br>\
                            &nbsp&nbsp&nbsp iv) To cooperate with ABC festivals/events, XYZ days/weeks/months,..., first build 100~1000~n cultural attractions (POIs) for specific themed fields or stories, (and form some sight lines (LOIs)/ Scenic spots (AOIs)), let the general public take self-guided tours on their own (or ask cultural and historical commentators to explain regularly). After that, it is set to conduct n-minute contests and answering activities similar to Pokémon Go’s \"Pokémon Go\" in certain places/certain dates/certain periods to achieve the entertaining \"deep understanding of ABC\". <br>\
                        </li>\
                    </ul>\
                </div>";

//make_player
L_english[422] = "sample file of Sights'import download";
L_english[423] = "Import POI";

//群組說明的最後一行
L_english[437] = "The group leader has the right to modify the content and various attributes of the POI/LOI/AOI and SOI made by the members (public <-> not public)."

// game
L_english[424] = "";
L_english[425] = "Group read while walking";
L_english[426] = " <thead><tr><th><p style=\"color:#00F; display:inline;\">{{g.foreignkey.group_name}}</p><p style=\"color:#00F; display:inline;\">({% if g.foreignkey.verification == 0  %}Not verified yet /{% elif g.foreignkey.verification == 1  %}Verified passed /{% else %}Verification failed /{% endif %} {% if g.foreignkey.open == 1 %}public{% else %}private{% endif %})</p><div class=\"btn btn-success\" style=\"float: right; margin-right: 10px;\" onclick=\"document.location='game_room/{{g.foreignkey.group_id}}'\">Select group</div></th></tr></thead>";
L_english[430] = "Not verified yet /";
L_english[431] = "Verified passed /"
L_english[432] = "Verification failed /";
L_english[433] = "public";
L_english[434] = "private";
L_english[435] = "Select group";

// game_room
L_english[427] = "Session";
L_english[428] = "Add session";
L_english[429] = "Literature and imformation school import sample file download";
L_english[441] = "Liberal Arts School Results Inquiry"
L_english[442] = "Total number of views"
L_english[443] = "transfer"
L_english[444] = "WEB Views"
L_english[445] = "APP Views"
L_english[446] = "Total number of views"
L_english[447] = "Creative Space for Experts in Literature and History"
L_english[448] = "Guide and commentator creation space"
L_english[449] = "player creation space"
L_english[450] = "A cultural and historical expert creates scenic spots, scenic lines, scenic spots, and themed stories"
L_english[451] = "Guide commentator creates scenic spots, scenic lines, scenic spots, and themed stories"
L_english[452] = "The player creates scenic spots, scenic lines, scenic spots, and themed stories"
L_english[453] = "Agree to all"
L_english[454] = "Apply to join the group"
L_english[455] = "Refuse to join the group"
L_english[456] = "Not verified yet"
L_english[457] = "Verified"
L_english[458] = "Verification failed"
L_english[459] = "Explore-Search for public and verified groups"
L_english[460] = "Invite-send a message to invite members to join (DEH account)"
L_english[461] = "Notification-Group invitation (application to join the group/group leader invitation to join the group) notification"
L_english[462] = "Automatically generated based on address"
L_english[463] = "Scenic spot production"
L_english[464] = "List of prizes I have won"


function chg_lan(lan_index) {
    var myLangArray;
    switch (lan_index) {
        //必須要有language.js才行
        case "chinese":
            myLangArray = L_taiwan;
            break;
        case "english":
            myLangArray = L_english;
            break;
        case "japanese":
            myLangArray = L_japan;
            break;
        default: //taiwan
            myLangArray = L_taiwan;
            break;

    }
    try {
        if(document.getElementById('exp_map')){
            document.getElementById('exp_map').innerHTML = myLangArray[10];
        } 
        if(document.getElementById('player_map')){
            document.getElementById('player_map').innerHTML = myLangArray[11];
        } 

        if(document.getElementById('docent_map')){
            document.getElementById('docent_map').innerHTML = myLangArray[12];
        } 

        if(document.getElementById('todayPOI')){
            document.getElementById('todayPOI').innerHTML = myLangArray[20];
        } 

        if(document.getElementById('todayLOI')){
            document.getElementById('todayLOI').innerHTML = myLangArray[21];
        } 

        if(document.getElementById('todayAOI')){
            document.getElementById('todayAOI').innerHTML = myLangArray[22];
        } 

        if(document.getElementById('todaySOI')){
            document.getElementById('todaySOI').innerHTML = myLangArray[23];
        }

        if(document.getElementById('wzResultInquiry')){
            document.getElementById('wzResultInquiry').innerHTML = myLangArray[441];
        }

        if(document.getElementById('session')){
            document.getElementById('session').innerHTML = myLangArray[427];
        }

        if(document.getElementById('searchGrade')){
            document.getElementById('searchGrade').innerHTML = myLangArray[354];
        }

        if(document.getElementById('totalViewNumber')){
            document.getElementById('totalViewNumber').innerHTML = myLangArray[442];
        }

        if(document.getElementById('contactMethod')){
            document.getElementById('contactMethod').innerHTML = myLangArray[196];
        }

        if(document.getElementById('transfer')){
            document.getElementById('transfer').innerHTML = myLangArray[443];
        }

        if(document.getElementById('webViewNumber')){
            document.getElementById('webViewNumber').innerHTML = myLangArray[444];
        }

        if(document.getElementById('appViewNumber')){
            document.getElementById('appViewNumber').innerHTML = myLangArray[445];
        }

        if(document.getElementById('totalViewNumber')){
            document.getElementById('totalViewNumber').innerHTML = myLangArray[446];
        }

        if(document.getElementById('culturalHistoricalSpace')){
            document.getElementById('culturalHistoricalSpace').innerHTML = myLangArray[447];
        }

        if(document.getElementById('expertMapeDescription')){
            document.getElementById('expertMapeDescription').innerHTML = myLangArray[448];
        }

        if(document.getElementById('guideSpace')){
            document.getElementById('guideSpace').innerHTML = myLangArray[449];
        }

        if(document.getElementById('docentMapeDescription')){
            document.getElementById('docentMapeDescription').innerHTML = myLangArray[450];
        }

        if(document.getElementById('playerSpace')){
            document.getElementById('playerSpace').innerHTML = myLangArray[451];
        }

        if(document.getElementById('userMapeDescription')){
            document.getElementById('userMapeDescription').innerHTML = myLangArray[452];
        }

        
        if(document.getElementById('notify')){
            document.getElementById('notify').innerHTML = myLangArray[243];
        }

        if(document.getElementById('allAgree')){
            document.getElementById('allAgree').innerHTML = myLangArray[453];
        }

        if(document.getElementById('applyJoinG')){
            document.getElementById('applyJoinG').innerHTML = myLangArray[454];
        }

        if(document.getElementById('rejectJoinG')){
            document.getElementById('rejectJoinG').innerHTML = myLangArray[455];
        }

        if(document.getElementById('confirm')){
            document.getElementById('confirm').innerHTML = myLangArray[375];
        }

        if(document.getElementById('agree')){
            document.getElementById('agree').innerHTML = myLangArray[245];
        }

        if(document.getElementById('reject')){
            document.getElementById('reject').innerHTML = myLangArray[246];
        }

        if(document.getElementById('explore')){
            document.getElementById('explore').innerHTML = myLangArray[250];
        }

        if(document.getElementById('myG')){
            document.getElementById('myG').innerHTML = myLangArray[251];
        }

        if(document.getElementById('public')){
            document.getElementById('public').innerHTML = myLangArray[147];
        }

        if(document.getElementById('private')){
            document.getElementById('private').innerHTML = myLangArray[148];
        }

        if(document.getElementById('notYetVerified')){
            document.getElementById('notYetVerified').innerHTML = myLangArray[456];
        }

        if(document.getElementById('verified')){
            document.getElementById('verified').innerHTML = myLangArray[457];
        }

        if(document.getElementById('verificationFailed')){
            document.getElementById('verificationFailed').innerHTML = myLangArray[458];
        }

        if(document.getElementById('invite')){
            document.getElementById('invite').innerHTML = myLangArray[265];
        }

        if(document.getElementById('disband')){
            document.getElementById('disband').innerHTML = myLangArray[252];
        }

        if(document.getElementById('manage')){
            document.getElementById('manage').innerHTML = myLangArray[253];
        }

        if(document.getElementById('quit')){
            document.getElementById('quit').innerHTML = myLangArray[254];
        }

        if(document.getElementById('check')){
            document.getElementById('check').innerHTML = myLangArray[255];
        }
        
        if(document.getElementById('joinG')){
            document.getElementById('joinG').innerHTML = myLangArray[256];
        }
        
        if(document.getElementById('inviteFriend')){
            document.getElementById('inviteFriend').innerHTML = myLangArray[257];
        }
        
        if(document.getElementById('exploreDescription')){
            document.getElementById('exploreDescription').innerHTML = myLangArray[459];
        }
        
        if(document.getElementById('inviteDescription')){
            document.getElementById('inviteDescription').innerHTML = myLangArray[460];
        }
        
        if(document.getElementById('notifyDescription')){
            document.getElementById('notifyDescription').innerHTML = myLangArray[461];
        }
        
        if(document.getElementById('group_modal-1-1')){
            document.getElementById('group_modal-1-1').innerHTML = myLangArray[258];
        }
        
        if(document.getElementById('group_modal-1-2')){
            document.getElementById('group_modal-1-2').innerHTML = myLangArray[259];
        }
        
        if(document.getElementById('group_modal-1-3')){
            document.getElementById('group_modal-1-3').innerHTML = myLangArray[260];
        }
        
        if(document.getElementById('group_modal-1-4')){
            document.getElementById('group_modal-1-4').innerHTML = myLangArray[261];
        }
        
        if(document.getElementById('group_modal-1-5')){
            document.getElementById('group_modal-1-5').innerHTML = myLangArray[262];
        }
        
        if(document.getElementById('group_modal-1-6')){
            document.getElementById('group_modal-1-6').innerHTML = myLangArray[263];
        }

        if(document.getElementById('weidu')){
            document.getElementById('weidu').innerHTML = myLangArray[100];
        }

        if(document.getElementById('jingdu')){
            document.getElementById('jingdu').innerHTML = myLangArray[101];
        }

        if(document.getElementById('byAddrGenerate')){
            document.getElementById('byAddrGenerate').innerHTML = myLangArray[462];
        }

        if(document.getElementById('makeScenario')){
            document.getElementById('makeScenario').innerHTML = myLangArray[463];
        }

        if(document.getElementById('myPrize')){
            document.getElementById('myPrize').innerHTML = myLangArray[464];
        }
    }
    catch (err) {
        console.log(err)
    }

    try {
        document.getElementById('deh_introduction').innerHTML = myLangArray[0];
        document.getElementById('deh_mobile_map').innerHTML = myLangArray[1];
        document.getElementById('expertMape').innerHTML = myLangArray[2];
        document.getElementById('docentMape').innerHTML = myLangArray[3];
        document.getElementById('userMape').innerHTML = myLangArray[4];
        document.getElementById('expertMape-1').innerHTML = myLangArray[5];
        document.getElementById('docentMape-1').innerHTML = myLangArray[6];
        document.getElementById('userMape-1').innerHTML = myLangArray[7];
        document.getElementById('go_browse').innerHTML = myLangArray[8];
        document.getElementById('sel_option-2').innerHTML = myLangArray[10];
        document.getElementById('sel_option-3').innerHTML = myLangArray[11];
        document.getElementById('sel_option-4').innerHTML = myLangArray[12];
        document.getElementById('make_pro').innerHTML = myLangArray[13];
        document.getElementById('make_navi').innerHTML = myLangArray[14];
        document.getElementById('make_player').innerHTML = myLangArray[15];
        document.getElementById('todayPOI').innerHTML = myLangArray[20];
        document.getElementById('todayLOI').innerHTML = myLangArray[21];
        document.getElementById('todayAOI').innerHTML = myLangArray[22];
        document.getElementById('todaySOI').innerHTML = myLangArray[23];
        document.getElementById('app_download').innerHTML = myLangArray[24];
        document.getElementById('handout-2').innerHTML = myLangArray[25];
        
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('make_navbar').innerHTML = myLangArray[16];
        document.getElementById('deh_in').innerHTML = myLangArray[19];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('logout-1').innerHTML = myLangArray[17];
    }
    catch (err) {
        console.log(err);
    }
    try {
        document.getElementById('login').innerHTML = myLangArray[18];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('deh_title').innerHTML = myLangArray[26];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('myPOI').innerHTML = myLangArray[27];
        document.getElementById('myLOI').innerHTML = myLangArray[28];
        document.getElementById('myAOI').innerHTML = myLangArray[29];
        document.getElementById('mySOI').innerHTML = myLangArray[30];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('myall').innerHTML = myLangArray[31];
        document.getElementById('createPOI').innerHTML = myLangArray[32];
        document.getElementById('createLOI').innerHTML = myLangArray[33];
        document.getElementById('createAOI').innerHTML = myLangArray[34];
        document.getElementById('createSOI').innerHTML = myLangArray[35];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('Category-1').innerHTML = myLangArray[36];
        document.getElementById('Region-1').innerHTML = myLangArray[37];
        //document.getElementById('Subject-1').innerHTML = myLangArray[38];
        //document.getElementById('Type-1').innerHTML = myLangArray[39];
        if(document.getElementById('Format-1')){
            document.getElementById('Format-1').innerHTML = myLangArray[40];
        }
        if(document.getElementById('Media Type-1')){
            document.getElementById('Media Type-1').innerHTML = myLangArray[41];
        }
        if(document.getElementById('s_poi')){
            document.getElementById('s_poi').innerHTML = myLangArray[42];
        }
        if(document.getElementById('s_loi')){
            document.getElementById('s_loi').innerHTML = myLangArray[43];
        }
        if(document.getElementById('s_aoi')){
            document.getElementById('s_aoi').innerHTML = myLangArray[44];
        }
        document.getElementById('s_soi').innerHTML = myLangArray[45];
        document.getElementById('experiential').innerHTML = myLangArray[47];
        document.getElementById('activation').innerHTML = myLangArray[48];
        document.getElementById('disappeared').innerHTML = myLangArray[49];
        document.getElementById('figure').innerHTML = myLangArray[50];
        document.getElementById('event').innerHTML = myLangArray[51];
        document.getElementById('human').innerHTML = myLangArray[52];
        document.getElementById('industry').innerHTML = myLangArray[54];
        document.getElementById('Ruins').innerHTML = myLangArray[56];
        document.getElementById('Cultural-1').innerHTML = myLangArray[57];
        document.getElementById('Traditional').innerHTML = myLangArray[58];
        document.getElementById('Folk').innerHTML = myLangArray[59];
        document.getElementById('Antique').innerHTML = myLangArray[60];
        document.getElementById('Food').innerHTML = myLangArray[61];
        document.getElementById('Others').innerHTML = myLangArray[62];
        document.getElementById('loi_show-1').innerHTML = myLangArray[67];
        document.getElementById('aoi_show-1').innerHTML = myLangArray[68];
        document.getElementById('soi_show-1').innerHTML = myLangArray[69];
        document.getElementById('images-3').innerHTML = myLangArray[63];
        document.getElementById('audio-3').innerHTML = myLangArray[64];
        document.getElementById('video-3').innerHTML = myLangArray[65];
        $('.natural').text(myLangArray[53]);
        $('.all').text(myLangArray[46]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("docent_info-1").innerHTML = myLangArray[70];
        document.getElementById("telphone").innerHTML = myLangArray[72];
        document.getElementById("cellphone").innerHTML = myLangArray[73];
        document.getElementById("languagebox").innerHTML = myLangArray[74];
        document.getElementById("social_id").innerHTML = myLangArray[75];
        document.getElementById("person_introduction").innerHTML = myLangArray[76];
        document.getElementById("charge").innerHTML = myLangArray[77];
        document.getElementById("confirm").innerHTML = myLangArray[78];
        document.getElementById("name").innerHTML = myLangArray[71];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("user_info").innerHTML = myLangArray[79];
        document.getElementById("user_name").innerHTML = myLangArray[80];
        document.getElementById("user_nickname").innerHTML = myLangArray[81];
        document.getElementById("gender").innerHTML = myLangArray[82];
        document.getElementById("user_address").innerHTML = myLangArray[85];
        document.getElementById("birthday").innerHTML = myLangArray[86];
        document.getElementById("education").innerHTML = myLangArray[87];
        document.getElementById("career").innerHTML = myLangArray[88];
        document.getElementById("homewebsite").innerHTML = myLangArray[89];
        document.getElementById("loginuser").innerHTML = myLangArray[90];
        document.getElementById("edit").innerHTML = myLangArray[95];
        document.getElementById("edit_pwd-1").value = myLangArray[96];
        document.getElementById("edit_info").value = myLangArray[201];
        document.getElementById("id_nickname").innerHTML = myLangArray[202];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("boy").innerHTML = myLangArray[83];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("girl").innerHTML = myLangArray[84];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("user_role").innerHTML = myLangArray[91];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("expert_role").innerHTML = myLangArray[92];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("docent_role").innerHTML = myLangArray[93];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("identifier_role").innerHTML = myLangArray[94];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        if(document.getElementById("title-1")){
            document.getElementById("title-1").innerHTML = myLangArray[106];
        }
        if(document.getElementById('Format-1')){
            document.getElementById('Format-1').innerHTML = myLangArray[40];
        }
        if( document.getElementById("docent_period")){
            document.getElementById("docent_period").innerHTML = myLangArray[98];

        }
        if(document.getElementById("docent_address")){
            document.getElementById("docent_address").innerHTML = myLangArray[99];
        }
        if(document.getElementById("docent_lati")){
            document.getElementById("docent_lati").innerHTML = myLangArray[100];
        }
        if(document.getElementById("docent_long")){
            document.getElementById("docent_long").innerHTML = myLangArray[101];
            
        }
        if(document.getElementById("contributor-1")){
            document.getElementById("contributor-1").innerHTML = myLangArray[105];
        }
        
        if(document.getElementById("time")){
            document.getElementById("time").innerHTML = myLangArray[97];
        }
        if(document.getElementById("description")){
            document.getElementById("description").innerHTML = myLangArray[107];
        }

        if(document.getElementById("guide")){
            document.getElementById("guide").innerHTML = myLangArray[108];
        }

        if(document.getElementById("media_file")){
            document.getElementById("media_file").innerHTML = myLangArray[109];
        }
        if(document.getElementById("back")){
            document.getElementById("back").value = myLangArray[129];
        }

        if(document.getElementById("docent_info-1")){
            document.getElementById("docent_info-1").innerHTML = myLangArray[70];
        }
        
        $(".format-content").text(myLangArray[55]);
    }
    catch (err) {
        console.log(err);
    }
    try {
        document.getElementById("audio_guide-1").innerHTML = myLangArray[110];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("img_file").innerHTML = myLangArray[111];
        $(".img_file").text(myLangArray[111]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("audio_file-1").innerHTML = myLangArray[112];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("video_file-1").innerHTML = myLangArray[113];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("name").innerHTML = myLangArray[71];
        document.getElementById("telphone").innerHTML = myLangArray[72];
        document.getElementById("cellphone").innerHTML = myLangArray[73];
        document.getElementById("social_id").innerHTML = myLangArray[75];
        document.getElementById("charge").innerHTML = myLangArray[77];
        document.getElementById("user_address").innerHTML = myLangArray[85];
        document.getElementById("Changhua_map").innerHTML = myLangArray[127];
        document.getElementById("docent_language").innerHTML = myLangArray[114];
        document.getElementById("docent_intro").innerHTML = myLangArray[115];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('Region-1').innerHTML = myLangArray[37];
        document.getElementById("Changhua_map").innerHTML = myLangArray[127];
        document.getElementById("description").innerHTML = myLangArray[107];
        //document.getElementById('Subject-1').innerHTML = myLangArray[38];
        //document.getElementById('Type-1').innerHTML = myLangArray[39];
        document.getElementById('Format-1').innerHTML = myLangArray[40];
        document.getElementById("docent_period").innerHTML = myLangArray[98];
        document.getElementById("docent_address").innerHTML = myLangArray[99];
        //document.getElementById("docent_source").innerHTML = myLangArray[102];
        //document.getElementById("creator-1").innerHTML = myLangArray[103];
        //document.getElementById("publisher-1").innerHTML = myLangArray[104];
        document.getElementById("contributor-1").innerHTML = myLangArray[105];
        document.getElementById("public-1").innerHTML = myLangArray[121];
        document.getElementById("keyword-1").innerHTML = myLangArray[118];
        document.getElementById("year-1").innerHTML = myLangArray[117];
        document.getElementById('experiential').innerHTML = myLangArray[47];
        document.getElementById('activation').innerHTML = myLangArray[48];
        document.getElementById('disappeared').innerHTML = myLangArray[49];
        document.getElementById('figure').innerHTML = myLangArray[50];
        document.getElementById('event').innerHTML = myLangArray[51];
        document.getElementById('human').innerHTML = myLangArray[52];
        document.getElementById('industry').innerHTML = myLangArray[54];
        //document.getElementById('Historical').innerHTML = myLangArray[55];
        document.getElementById('Ruins').innerHTML = myLangArray[56];
        document.getElementById('Cultural-1').innerHTML = myLangArray[57];
        document.getElementById('Traditional').innerHTML = myLangArray[58];
        document.getElementById('Folk').innerHTML = myLangArray[59];
        document.getElementById('Antique').innerHTML = myLangArray[60];
        document.getElementById('Food').innerHTML = myLangArray[61];
        document.getElementById('Others').innerHTML = myLangArray[62];
        //document.getElementById("title-1").innerHTML = myLangArray[106];
        document.getElementById("img_file").innerHTML = myLangArray[111];
        //document.getElementById("make_poiform-1").innerHTML = myLangArray[116];
        document.getElementById("lati:").innerHTML = myLangArray[119];
        document.getElementById("long:").innerHTML = myLangArray[120];
        document.getElementById("yes").innerHTML = myLangArray[122];
        document.getElementById("no").innerHTML = myLangArray[123];
        document.getElementById("upload_guide").innerHTML = myLangArray[124];
        document.getElementById("upload_media").innerHTML = myLangArray[125];
        document.getElementById("none_file").innerHTML = myLangArray[126];
        //document.getElementById("Changhua_map").innerHTML = myLangArray[127];
        document.getElementById("btn_confirm").innerHTML = myLangArray[130];
        document.getElementById("btn_reset").innerHTML = myLangArray[131];
        document.getElementById("Prehistory-1").innerHTML = myLangArray[132];
        document.getElementById("Dutch-1").innerHTML = myLangArray[133];
        document.getElementById("Ming-1").innerHTML = myLangArray[134];
        document.getElementById("Qing-1").innerHTML = myLangArray[135];
        document.getElementById("japanese_Occ-1").innerHTML = myLangArray[136];
        document.getElementById("Modem-1").innerHTML = myLangArray[137];
        document.getElementById("BC-1").innerHTML = myLangArray[138];

        $('.natural').text(myLangArray[53]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("none_guide").innerHTML = myLangArray[128];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('deh_title').innerHTML = myLangArray[26];
        document.getElementById("poi_edit").innerHTML = myLangArray[139];
        document.getElementById('Region-1').innerHTML = myLangArray[37];
        //document.getElementById('Subject-1').innerHTML = myLangArray[38];
        //document.getElementById('Type-1').innerHTML = myLangArray[39];
        document.getElementById('Format-1').innerHTML = myLangArray[40];
        document.getElementById('experiential').innerHTML = myLangArray[47];
        document.getElementById('activation').innerHTML = myLangArray[48];
        document.getElementById('disappeared').innerHTML = myLangArray[49];
        document.getElementById('figure').innerHTML = myLangArray[50];
        document.getElementById('event').innerHTML = myLangArray[51];
        document.getElementById('human').innerHTML = myLangArray[52];
        document.getElementById('industry').innerHTML = myLangArray[54];
        //document.getElementById('Historical').innerHTML = myLangArray[55];
        document.getElementById('Ruins').innerHTML = myLangArray[56];
        document.getElementById('Cultural-1').innerHTML = myLangArray[57];
        document.getElementById('Traditional').innerHTML = myLangArray[58];
        document.getElementById('Folk').innerHTML = myLangArray[59];
        document.getElementById('Antique').innerHTML = myLangArray[60];
        document.getElementById('Food').innerHTML = myLangArray[61];
        document.getElementById('Others').innerHTML = myLangArray[62];
        document.getElementById("docent_period").innerHTML = myLangArray[98];
        document.getElementById("docent_address").innerHTML = myLangArray[99];
        //document.getElementById("docent_source").innerHTML = myLangArray[102];
        //document.getElementById("creator-1").innerHTML = myLangArray[103];
        //document.getElementById("publisher-1").innerHTML = myLangArray[104];
        document.getElementById("contributor-1").innerHTML = myLangArray[105];
        //document.getElementById("title-1").innerHTML = myLangArray[106];
        document.getElementById("description").innerHTML = myLangArray[107];
        document.getElementById("year-1").innerHTML = myLangArray[117];
        document.getElementById("keyword-1").innerHTML = myLangArray[118];
        //document.getElementById("lati:").innerHTML = myLangArray[119];
        //document.getElementById("long:").innerHTML = myLangArray[120];
        document.getElementById("public-1").innerHTML = myLangArray[121];
        document.getElementById("yes").innerHTML = myLangArray[122];
        document.getElementById("no").innerHTML = myLangArray[123];
        document.getElementById("upload_guide").innerHTML = myLangArray[124];
        document.getElementById("upload_media").innerHTML = myLangArray[125];
        document.getElementById("Changhua_map").innerHTML = myLangArray[127];
        document.getElementById("btn_confirm").innerHTML = myLangArray[130];
        document.getElementById("clear").innerHTML = myLangArray[163];
        document.getElementById("Prehistory-1").innerHTML = myLangArray[132];
        document.getElementById("Dutch-1").innerHTML = myLangArray[133];
        document.getElementById("Ming-1").innerHTML = myLangArray[134];
        document.getElementById("Qing-1").innerHTML = myLangArray[135];
        document.getElementById("japanese_Occ-1").innerHTML = myLangArray[136];
        document.getElementById("Modem-1").innerHTML = myLangArray[137];
        document.getElementById("BC-1").innerHTML = myLangArray[138];

        $('.natural').text(myLangArray[53]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.sel_option-1').text(myLangArray[9]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("none_file").innerHTML = myLangArray[126];
        document.getElementById("none_guide").innerHTML = myLangArray[128];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("audio_guide").innerHTML = myLangArray[110];
        document.getElementById("3gpp").innerHTML = myLangArray[159];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.img_file').text(myLangArray[111]);
        document.getElementById("gif/jpg/png").innerHTML = myLangArray[160];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("audio-3").innerHTML = myLangArray[64];
        document.getElementById("3gpp").innerHTML = myLangArray[159];
    }
    catch (err) {
        //console.log(err);
    }

    try {
        document.getElementById("video-3").innerHTML = myLangArray[65];
        document.getElementById("mp4/avi").innerHTML = myLangArray[162];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.delete_file').text(myLangArray[164]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.media_val').text(myLangArray[165]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('myPOI').innerHTML = myLangArray[27];
        document.getElementById('myLOI').innerHTML = myLangArray[28];
        document.getElementById('myAOI').innerHTML = myLangArray[29];
        document.getElementById('mySOI').innerHTML = myLangArray[30];
        document.getElementById('exp_poi').innerHTML = myLangArray[140];
        document.getElementById("exp_loi").innerHTML = myLangArray[141];
        document.getElementById("exp_aoi").innerHTML = myLangArray[142];
        document.getElementById("exp_soi").innerHTML = myLangArray[143];
        document.getElementById("download_POI_ex").innerHTML = myLangArray[422];
        document.getElementById("imp_poi").innerHTML = myLangArray[423];
        $('.btn-danger').text(myLangArray[153]);
        $('.btn-info').text(myLangArray[154]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.Unverified').text(myLangArray[144]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.verified').text(myLangArray[145]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.Verification_Failed').text(myLangArray[146]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.public-2').text(myLangArray[147]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.private').text(myLangArray[148]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.img_1').text(myLangArray[149]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.audio_1').text(myLangArray[150]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.video_1').text(myLangArray[151]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $('.none_file_1').text(myLangArray[152]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("tool").innerHTML = myLangArray[157];
        //document.getElementById("title-1").innerHTML = myLangArray[106];
        document.getElementById("back").value = myLangArray[129];
        document.getElementById("loi_show-1").innerHTML = myLangArray[155];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("docent_info-1").innerHTML = myLangArray[70];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $(".loi_contributor").text(myLangArray[158]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("soi_contributor:").innerHTML = myLangArray[181];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("poi_list-1").innerHTML = myLangArray[166];
        document.getElementById("loi_list-1").innerHTML = myLangArray[168];
        document.getElementById("aoi_list-1").innerHTML = myLangArray[169];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("aoi_show-1").innerHTML = myLangArray[167];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("soi_show-1").innerHTML = myLangArray[170];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("title:").innerHTML = myLangArray[173];
        document.getElementById("description:").innerHTML = myLangArray[174];
        document.getElementById("public:").innerHTML = myLangArray[176];
        document.getElementById("yes").innerHTML = myLangArray[122];
        document.getElementById("no").innerHTML = myLangArray[123];
        document.getElementById("tool:").innerHTML = myLangArray[175];
        document.getElementById("car-1").innerHTML = myLangArray[177];
        document.getElementById("bike-1").innerHTML = myLangArray[178];
        document.getElementById("foot-1").innerHTML = myLangArray[179];
        document.getElementById("loi_make").innerHTML = myLangArray[171];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("poi_choose").innerHTML = myLangArray[172];
        document.getElementById("loi_choose").innerHTML = myLangArray[185];
        document.getElementById("aoi_choose").innerHTML = myLangArray[186];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("loi_contributor:").innerHTML = myLangArray[180];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("refresh").innerHTML = myLangArray[183];
        document.getElementById("btn_confirm").innerHTML = myLangArray[130];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("aoi_contributor:").innerHTML = myLangArray[184];
        document.getElementById("aoi_make").innerHTML = myLangArray[182];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("soi_make").innerHTML = myLangArray[187];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("loi_edit-1").innerHTML = myLangArray[188];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("aoi_edit-1").innerHTML = myLangArray[189];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("soi_edit-1").innerHTML = myLangArray[190];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("language_script").src = myLangArray[191];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("(user)").innerHTML = myLangArray[192];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("(Expert)").innerHTML = myLangArray[193];
    }
    catch (err) {
    }
    try {
        document.getElementById("(Narrator)").innerHTML = myLangArray[194];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("(Verifier)").innerHTML = myLangArray[195];
    }
    catch (err) {

        //console.log(err);   //console.log(err);
    }
    try {
        document.getElementById("Contacting window:").innerHTML = myLangArray[196];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("edit_pwd-1").innerHTML = myLangArray[197];
        document.getElementById("now_pwd").innerHTML = myLangArray[198];
        document.getElementById("new_pwd").innerHTML = myLangArray[199];
        document.getElementById("confirm_pwd").innerHTML = myLangArray[200];
        $(".btn-default").text(myLangArray[78]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $(".export_language").text(myLangArray[207]);
        $(".public-1").text(myLangArray[121]);
        $(".Region-1").text(myLangArray[37]);
        $(".description").text(myLangArray[107]);
        document.getElementById("keyword-2").innerHTML = myLangArray[201];
        document.getElementById("keyword-3").innerHTML = myLangArray[202];
        document.getElementById("keyword-4").innerHTML = myLangArray[203];
        document.getElementById("keyword-5").innerHTML = myLangArray[204];
        document.getElementById("keyword-6").innerHTML = myLangArray[205];
        document.getElementById("POI_account").innerHTML = myLangArray[206];
        document.getElementById("poi_title-1").innerHTML = myLangArray[208];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $(".tool").text(myLangArray[157]);
        document.getElementById("loi_title-1").innerHTML = myLangArray[209];
        document.getElementById("LOI_account").innerHTML = myLangArray[210];
        document.getElementById("loi_contributor").innerHTML = myLangArray[158];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("aoi_title-1").innerHTML = myLangArray[211];
        document.getElementById("AOI_account").innerHTML = myLangArray[212];
        document.getElementById("aoi_contributor").innerHTML = myLangArray[213];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById("soi_title-1").innerHTML = myLangArray[214];
        document.getElementById("SOI_account").innerHTML = myLangArray[215];
        document.getElementById("soi_contributor").innerHTML = myLangArray[216];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('loss_password').innerHTML = myLangArray[217];
        document.getElementById('current_account').innerHTML = myLangArray[218];
        document.getElementById('findpwd_email').innerHTML = myLangArray[219];
        document.getElementById("confirm").innerHTML = myLangArray[78];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('login_account').innerHTML = myLangArray[220];
        document.getElementById('login_password').innerHTML = myLangArray[221];
        document.getElementById('login-1').value = myLangArray[222];
        document.getElementById("forget_password").innerHTML = myLangArray[223];
        document.getElementById("login_regist").innerHTML = myLangArray[224];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('user_pwd').innerHTML = myLangArray[225];
        document.getElementById('current_pwd').innerHTML = myLangArray[226];
        document.getElementById('new_password').innerHTML = myLangArray[227];
        document.getElementById("confirm_password").innerHTML = myLangArray[228];
        document.getElementById("confirm").innerHTML = myLangArray[78];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        document.getElementById('poi_notes').innerHTML = myLangArray[229];
        $(".poi_msg-1").text(myLangArray[230]);
        document.getElementById('poi_msg-2').innerHTML = myLangArray[231];
        $(".public-1").text(myLangArray[121]);
        document.getElementById('poi_msg-4').innerHTML = myLangArray[148];
        document.getElementById("poi_msg-5").innerHTML = myLangArray[232];
        document.getElementById("poi_msg-6").innerHTML = myLangArray[233];
        document.getElementById("poi_msg-7").innerHTML = myLangArray[234];
        document.getElementById("subject_notes-1").innerHTML = myLangArray[235];
        //document.getElementById("subject_notes-1").innerHTML = myLangArray[236];
        //document.getElementById("subject_notes-2").innerHTML = myLangArray[237];
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $(".first_loi_area").text(myLangArray[238]);
        $(".first_aoi_area").text(myLangArray[239]);
        $(".first_soi_area").text(myLangArray[240]);
    }
    catch (err) {
        //console.log(err);
    }
    try {
        $(".check_login").text(myLangArray[241]);
    }
    catch (err) {
        //console.log(err);
    }
    //list_group.html
    try {
        $('#group_modal-1').children().each(function (index) {
            $(this).text(myLangArray[258 + index]);
        });
        document.getElementById("group_modal_last_line").innerHTML = myLangArray[437]
        $("p[name = invite]").each(function (index) {
            var sender_name = $(this).siblings('input[name = "group_username_hidden"]').val() + " ";
            var group_name = " " + $(this).siblings('input[name = "group_groupname_hidden"]').val();
            $(this).html(sender_name + myLangArray[247] + group_name);
        });
        $("#apply_join").text(myLangArray[256]);
        $('.group_agree').text(myLangArray[245]);
        $('.group_refuse').text(myLangArray[246]);
        $("#close_info").text(myLangArray[264]);
        var tempvalue = $("#btnGroupDrop1 > span").html();
        $("#btnGroupDrop1").html(myLangArray[243] + ' ' + '<span class="badge">' + tempvalue + '</span>');
        $("p[name = apply_group]").each(function (index) {
            var sender_name = $(this).siblings('input[name = group_username_hidden]').val() + " ";
            var group_name = " " + $(this).siblings('input[name = group_groupname_hidden]').val();
            $(this).html(sender_name + myLangArray[244] + group_name);
        });
        $("#group_search").html('<span class="glyphicon glyphicon-search"></span>' + ' ' + myLangArray[250]);
        $("#myGOI").text(myLangArray[251]);
        $(".list_group_invite").html('<span class="glyphicon glyphicon-user"></span>' + ' ' + myLangArray[265]);
        $(".group_management").text(myLangArray[253]);
        $(".group_diss").text(myLangArray[252]);
        $("#send_invite").text(myLangArray[257]);
        $("#no_msg").html(myLangArray[249]);

        $(".group_leave").text(myLangArray[254]);
        $(".group_view").text(myLangArray[255]);
        $("#group_info_close").text(myLangArray[264]);


    }
    catch (err) {
        //console.log(err);
    }

    //make
    try {
        $('#create_group').text(myLangArray[266]);
        $('#group_title1').text(myLangArray[267]);
        $('#groupdescription').text(myLangArray[268]);
        $('#ispublic').text(myLangArray[269]);
        $('#btn_confirm').text(myLangArray[270]);
        $('#btn_reset').text(myLangArray[131]);
        $('#yes').text(myLangArray[122]);
        $('#no').text(myLangArray[123]);
        $('#mygroup').text(myLangArray[271]);
        $('#createGroup').text(myLangArray[272]);
    }
    catch (err) {
        //console.log(err);
    }

    //manage_group
    try {
        $('#GroupLabel').text(myLangArray[273]);
        $('#group_description').text(myLangArray[275]);
        $('#group_description1').text(myLangArray[275]);
        $('.mana_member').text(myLangArray[276]);
        $("#kicked").each(function (index) {
            $(this).html(myLangArray[244]);
        });
        $('#kicked').text(myLangArray[277]);
        $(".move_out").each(function (index) {
            $(this).html(myLangArray[280]);
        });
        $(".maana_group_edit").each(function (index) {
            $(this).html(myLangArray[281]);
        });
        $('#manage_group_info').children().each(function (index) {
            $(this).text(myLangArray[282 + index]);
        });
        $('.manage_edit_group').text(myLangArray[289]);
        $('#public_private').text(myLangArray[290]);
        $('.btn-maana_group_edit').text(myLangArray[154]);
        $('#edit_info_closed').text(myLangArray[264]);
        $("#group_info_close").text(myLangArray[264]);
        $('#group_public').text(myLangArray[121]);
        $('#group_private').text(myLangArray[148]);
        $('.add_in_group').text(myLangArray[292]);
        $('#make_player_join').text(myLangArray[293]);
    }
    catch (err) {
        //console.log(err);
    }

    //regist
    try {
        $('label[for = id_user_name]').text(myLangArray[294]);
        $('label[for = id_password]').text(myLangArray[295]);
        $('label[for = id_nickname]').text(myLangArray[296]);
        $('label[for = id_email]').text(myLangArray[297]);
        $('label[for = id_gender]').text(myLangArray[298]);
        $('label[for = id_birthday_month]').text(myLangArray[299]);
        $('label[for = id_homepage]').text(myLangArray[300]);
        $('label[for = id_education]').text(myLangArray[301]);
        $('label[for = id_career]').text(myLangArray[302]);
        $('label[for = id_user_address]').text(myLangArray[303]);
        $('label[for = id_role]').text(myLangArray[304]);
        $('label[for = id_password_confirm]').text(myLangArray[305]);
        $('.confirm_email').text(myLangArray[306]);
        $('.login-button').text(myLangArray[307]);
        $('#id_gender').children().each(function (index) {
            if (index != '0') {
                $(this).text(myLangArray[83 + index - 1]);
            }
        });
        $('#id_education').children().each(function (index) {
            if (index != '0') {
                $(this).text(myLangArray[310 + index - 1]);
            }
        });
        $('#id_career').children().each(function (index) {
            if (index != '0') {
                $(this).text(myLangArray[315 + index - 1]);
            }
        });
        $('#id_role').children().each(function (index) {
            $(this).text(myLangArray[308 + index]);

        });

    }
    catch (err) {
        //console.log(err);
    }

    try {
        $('.make_poi_info').children().each(function (index) {
            $(this).html(myLangArray[337 + index] + '<br>' + myLangArray[340 + index]);
        });
        $('#make_poi_close').text(myLangArray[264]);

    }
    catch (err) {
        //console.log(err);
    }

    try {
        $('#logo_content_expert').text(myLangArray[10]);
        $('#logo_content_player').text(myLangArray[11]);
        $('#logo_content_docent').text(myLangArray[12]);
        $('#serch_docent').text(myLangArray[343]);
    }
    catch (err) {
        //console.log(err);
    }

    try { // my_history
        $("#historyIntro").text(myLangArray[344]);
        $("#webHistory").text(myLangArray[345]);
        $("#mobileHistory").text(myLangArray[346]);
        $("#history_intro").children().each(function (index) {
            if (index == 0) {
                $(this).html(myLangArray[347]);
            }
        });
        $("#history_intros").children().each(function (index) {
            $(this).text(myLangArray[348 + index]);
        });
        $("#web_contents").children().each(function (index) {
            $(this).text(myLangArray[350 + index]);
        });
        $("#web_search").text(myLangArray[354]);
        $("#mobile_search").text(myLangArray[354]);
        $("#web_search_result").children().children().children().children().each(function (index) {
            $(this).text(myLangArray[355 + index]);
        });
        $("#mobile_search_result").children().children().children().children().each(function (index) {
            $(this).text(myLangArray[355 + index]);
        });
    }
    catch (err) {
        // console.log(err);
    }

    try{ //know.html
        document.getElementById('know_title').innerHTML = myLangArray[357];
        document.getElementById('know_age').innerHTML = myLangArray[358];
        document.getElementById('know_term').innerHTML = myLangArray[359];
        document.getElementById('term_1').innerHTML = myLangArray[360];
        document.getElementById('term_2').innerHTML = myLangArray[361];
        document.getElementById('term_3').innerHTML = myLangArray[362];
        document.getElementById('term_4').innerHTML = myLangArray[363];
        document.getElementById('term_5').innerHTML = myLangArray[364];
        document.getElementById('term_6').innerHTML = myLangArray[365];
        document.getElementById('term_7').innerHTML = myLangArray[366];
        document.getElementById('term_8').innerHTML = myLangArray[367];
        document.getElementById('term_9').innerHTML = myLangArray[368];
        document.getElementById('term_10').innerHTML = myLangArray[369];
        document.getElementById('term_11').innerHTML = myLangArray[370];
        document.getElementById('term_12').innerHTML = myLangArray[371];
        document.getElementById('term_13').innerHTML = myLangArray[372];
        document.getElementById('know_last').innerHTML = myLangArray[373];
        document.getElementById('Agree').innerHTML = myLangArray[374];
        document.getElementById('checkOK').value = myLangArray[375];
        $('#checkOK').attr('data-content',myLangArray[376]);
    }
    catch(err) {
        // console.log(err);
    } 
    
    try{ //intro.html
        document.getElementById('page_introduction').innerHTML = myLangArray[377];
        document.getElementById('Content_classification').innerHTML = myLangArray[378];
        document.getElementById('Title_category').innerHTML = myLangArray[379];
        document.getElementById('Content_category').innerHTML = myLangArray[380];
        document.getElementById('Title_class').innerHTML = myLangArray[381];
        document.getElementById('Content_class').innerHTML = myLangArray[382];
        document.getElementById('Title_language').innerHTML = myLangArray[383];
        document.getElementById('Content_language').innerHTML = myLangArray[384];
        document.getElementById('Title_Cregion').innerHTML = myLangArray[385];
        document.getElementById('Content_Cregion').innerHTML = myLangArray[386];
        document.getElementById('Title_Fregion').innerHTML = myLangArray[387];
        document.getElementById('Content_Fregion').innerHTML = myLangArray[388];
        document.getElementById('Title_POI').innerHTML = myLangArray[389];
        //document.getElementById('Content_subject').innerHTML = myLangArray[390];
        //document.getElementById('Title_subject').innerHTML = myLangArray[391];
        //document.getElementById('Title_type').innerHTML = myLangArray[392];
        //document.getElementById('Content_type').innerHTML = myLangArray[393];
        document.getElementById('Title_format').innerHTML = myLangArray[394];
        document.getElementById('Content_format').innerHTML = myLangArray[395];
        document.getElementById('Title_media_type').innerHTML = myLangArray[396];
        document.getElementById('Content_media_type').innerHTML = myLangArray[397];
        document.getElementById('Title_commentary').innerHTML = myLangArray[398];
        document.getElementById('Content_commentary').innerHTML = myLangArray[399];
        document.getElementById('Title_sightseeing_permission').innerHTML = myLangArray[400];
        document.getElementById('Content_sightseeing_permission').innerHTML = myLangArray[401];
        //document.getElementById('Website_version_kind').innerHTML = myLangArray[402];
        document.getElementById('Title_DEH_APPs').innerHTML = myLangArray[403];
        document.getElementById('Pure_Tour').innerHTML = myLangArray[404];
        document.getElementById('Pure_POIs_make').innerHTML = myLangArray[405];
        document.getElementById('Pure_POIs_make_DEHMAKE').innerHTML = myLangArray[406];
        document.getElementById('Tour_make_POTs').innerHTML = myLangArray[407];
        document.getElementById('Pure_Tour_ios').innerHTML = myLangArray[408];
        //document.getElementById('Website_version_kind2').innerHTML = myLangArray[409];
        document.getElementById('Platform_may_use').innerHTML = myLangArray[410];
        document.getElementById('Platform_use_example').innerHTML = myLangArray[411];
        document.getElementById('Platform_use_scenario1').innerHTML = myLangArray[412];
        document.getElementById('Platform_use_scenario2').innerHTML = myLangArray[413];
        document.getElementById('Platform_use_scenario3').innerHTML = myLangArray[414];
        document.getElementById('Platform_use_scenario4').innerHTML = myLangArray[415];
        document.getElementById('Platform_use_scenario5').innerHTML = myLangArray[416];
        document.getElementById('Platform_use_scenario6').innerHTML = myLangArray[436]
        document.getElementById('APP_DOWNLOAD_Title').innerHTML = myLangArray[417];
        document.getElementById('APP_DOWNLOAD_android').innerHTML = myLangArray[418];
        document.getElementById('APP_DOWNLOAD_ios').innerHTML = myLangArray[419];
        document.getElementById('handout-2_download').innerHTML = myLangArray[420];
        document.getElementById('Intro_video').innerHTML = myLangArray[421];
        document.getElementById('Advanced_function').innerHTML = myLangArray[438];
        document.getElementById('Group_function').innerHTML = myLangArray[439];
        document.getElementById('similar_to_pokemon').innerHTML = myLangArray[440];
    }
    catch(err) {
        // console.log(err);
    }

    try{  //game
            document.getElementById('game').innerHTML = myLangArray[424];
            document.getElementById('Title_group').innerHTML = myLangArray[425]; 
            document.getElementById('Not_verified').innerHTML = myLangArray[430];
            document.getElementById('verified').innerHTML = myLangArray[431];
            document.getElementById('Verification_failed').innerHTML = myLangArray[432];
            document.getElementById('public').innerHTML = myLangArray[433];
            document.getElementById('private').innerHTML = myLangArray[434];
            document.getElementById('select_group').value = myLangArray[435];
            document.getElementById('group_table').innerHTML = myLangArray[426]; 
        }
        catch(err){
            // console.log(err);
        }

    try{  //game_room
            document.getElementById('GAME_Room_Session').innerHTML = myLangArray[427]; 
            document.getElementById('add_session').value = myLangArray[428]; 
            document.getElementById('example_download').value = myLangArray[429];
           // document.getElementById('group_table').innerHTML = myLangArray[426]; 
    }
    catch(err){
            // console.log(err);
    }
}

$('#language').change(function () {
    var language = $('#language').val();
    if (is_edit) {
        var urls = '/toggle_lang';
    } else {
        var urls = '../toggle_lang';
    }
    var data = { language: language }
    localStorage.setItem('language', language);
    $.ajax({
        method: "POST",
        url: urls,
        data: data,
        success: function (data) {
            location.reload();
            console.log(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
});

function confirm_logout(e) {
    var language = $('#language').val();
    if (language == 'chinese') {
        if(confirm('確認登出?')){
            window.location.replace("/logout");
        }
    } else if (language == 'english') {
        if(confirm('Confirmation of logout?')){
            window.location.replace("/logout");
        }
    } else if (language == 'japanese') {
        if(confirm('ログアウトの確認?')){
            window.location.replace("/logout");
        }
    }
}
