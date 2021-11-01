$(document).ready(function () {
    $(window).on('beforeunload', () => { setLanguage() });
    if(!navigator.cookieEnabled) {
        $('#coilanguage').val('中文');
        chg_lan($('#coilanguage').val());
    } else if (localStorage.getItem(COINAME + 'language') == '中文'
        || localStorage.getItem(COINAME + 'language') == '英文'
        || localStorage.getItem(COINAME + 'language') == '日文') {
        $('#coilanguage').val(localStorage.getItem(COINAME + 'language'))
        chg_lan($('#coilanguage').val());
        ajaxLanguage(false);
    } else {
        $('#coilanguage').val('中文');
        chg_lan($('#coilanguage').val());
        setLanguage();
        ajaxLanguage(true);
    }
});

//array max=415

Taiwan = new Array();
English = new Array();
Japan = new Array();

// index
Taiwan[0] = "校本課程";
Taiwan[1] = "";
Taiwan[2] = "觀看更多";
Taiwan[3] = "實踐校本課程";
Taiwan[4] = "依據學校自身的性質、特點及可利用的資源等條件結合在課程中。";
Taiwan[5] = "由學校成員在自願、自主的基礎上，獨立或與校內外團體、個人合作研究開發。";
Taiwan[6] = "滿足本校學生學習需要的一切形式的課程。";
Taiwan[7] = "";
Taiwan[8] = "前往查看";
Taiwan[9] = "落實地方特色教育";
Taiwan[10] = "師生共同編織地方的特色文化地圖。";
Taiwan[11] = "將課程搬離教室，以創新的方式帶來知識。";
Taiwan[12] = "走出校園，讓考試不再只是紙上談兵。";
Taiwan[500] = "";
Taiwan[13] = "前往創作";
Taiwan[14] = "功能介紹";
Taiwan[15] = "文史專家/玩家/解說員創作景點、景線、景區、主題故事。";
Taiwan[16] = "教師可利用文資學堂的功能，將課程內容跟生活、作業、考試作結合。";
Taiwan[17] = "具有中/英/日多國語言，消弭異國間的語言障礙。";
Taiwan[18] = "前往群組";
Taiwan[412] = "聯絡我們:";

English[0] = "sdc";
English[1] = " - DEH";
English[2] = "Read more";
English[3] = "Action Digital Cultural Assets Map";
English[4] = "Points Of Interest (POI): Introduction to a single attraction, the most basic unit for navigation";
English[5] = "Line Of Interest(LOI): Considering the navigational situation, we design a scenic route that has geographical relevance and has a plan of visiting priorities.";
English[6] = "Area Of Interest(AOI): A set of navigation spots with regional relevance designed with the cultural assets of a specific area as the main axis.";
English[7] = "Story  Of Interest (SOI): A theme story that covers many POIs, LOIs, and AOIs";
English[8] = "Go to view";
English[9] = "Create space";
English[10] = "Literary and historical experts/players/narrators create attractions, scenery, scenic spots, and theme stories.";
English[11] = "You can use Chinese to produce and navigate the sights/views/spots of countries and regions around the world.";
English[12] = "Taiwan: Counties, cities, townships, towns, and districts.<br>Countries in the world: The country as a unit area.";
English[13] = "Create now";
English[14] = "Group management";
English[15] = "User can create multiple groups and apply for joining multiple groups.";
English[16] = "Groups cannot be explored if they are unlisted.";
English[17] = "If the group is public and the verification is passed, the group can be queried in the search function.";
English[18] = "Go to group";
English[412] = "Contact us:";

Japan[0] = "台南";
Japan[1] = "の歴史と歴史をたどる";
Japan[2] = "もっと見る";
Japan[3] = "アクションデジタルカ";
Japan[4] = "POI（Point Of Interest）：ナビゲーションのための最も基本的なユニットである単一アトラクションの紹介";
Japan[5] = "LOI（Line Of Interest）：ナビゲーションの状況を考慮して、地理的に関連性のある景色のあるルートを設計し、優先度の訪問計画を立てます。";
Japan[6] = "風景区域（AOI）：特定の地域の文化財を主軸として地域的に関連性があるナビゲーションスポットのセット";
Japan[7] = "テーマストーリー（SOI）：多くのPOI、LOI、AOIをカバーするテーマストーリー";
Japan[8] = "見に行く";
Japan[9] = "クリエイティブスペース";
Japan[10] = "文学的、歴史的な専門家/選手/ナレーション担当者は、アトラクション、風景、景勝地、テーマストーリーを作成します。";
Japan[11] = "あなたは、世界中の国や地域の観光スポット/シーン/スポットを制作し、ナビゲートするために中国語を使用することができます。";
Japan[12] = "台湾：郡、都市、郡、町、および地区。<br>世界の国々：単位面積としての国。";
Japan[13] = "作成に行く";
Japan[14] = "グループ管理";
Japan[15] = "ユーザーは複数のグループを作成し、複数のグループに参加することができます。";
Japan[16] = "未登録の場合、グループを調査することはできません。";
Japan[17] = "グループがパブリックであり、検証に合格した場合、グループは検索機能で照会できます。";
Japan[18] = "グループに行く";
Japan[412] = "お問い合わせ:";

//navbar
Taiwan[19] = "(玩家)";
Taiwan[20] = "(專家)";
Taiwan[21] = "(導覽員)";
Taiwan[22] = "確定登出?"
Taiwan[23] = "登出";
Taiwan[24] = "登入";
Taiwan[25] = "首頁";
Taiwan[26] = "導覽地圖";
Taiwan[27] = "創作空間";
Taiwan[28] = "群組管理";
Taiwan[414] = "文史脈流網站"
Taiwan[29] = "使用簡介";
Taiwan[30] = "語言：";
Taiwan[413] = "聯絡資訊";

English[19] = "(player)";
English[20] = "(expert)";
English[21] = "(Narrator)";
English[22] = "Confirm logout?";
English[23] = "Logout";
English[24] = "Login";
English[25] = "Home";
English[26] = "Guide map";
English[27] = "Create space";
English[28] = "Group management";
English[414] = "DEH Website";
English[29] = "User introduction";
English[30] = "Language:";
English[413] = "Contact us";

Japan[19] = "（プレーヤー）";
Japan[20] = "（専門家）";
Japan[21] = "（ナレーター）";
Japan[22] = "ログアウトを確認する?";
Japan[23] = "サインアウト";
Japan[24] = "サインイン";
Japan[25] = "ホームページ";
Japan[26] = "ガイドマップ";
Japan[27] = "クリエイティブスペース";
Japan[28] = "グループ管理";
Japan[414] = "DEHウェブサイト";
Japan[29] = "紹介を使う";
Japan[30] = "言語：";
Japan[413] = "お問い合わせ:";

//create space
Taiwan[31] = "● 我的景點";
Taiwan[32] = "● 我的景線";
Taiwan[33] = "● 我的景區";
Taiwan[34] = "● 我的主題故事";
Taiwan[35] = "我的景點列表";
Taiwan[36] = "匯出POI至CSV";
Taiwan[37] = "＋製作新景點";
Taiwan[38] = "(尚未驗證 /";
Taiwan[39] = "(已驗證通過 /";
Taiwan[40] = "(驗證不通過 /";
Taiwan[41] = "公開";
Taiwan[42] = "不公開";
Taiwan[43] = "相片)";
Taiwan[44] = "聲音)";
Taiwan[45] = "影片)";
Taiwan[46] = "無多媒體檔案)";
Taiwan[47] = "加入群組";
Taiwan[48] = "刪除";
Taiwan[49] = "修改";
Taiwan[50] = "我的景線列表";
Taiwan[51] = "匯出LOI至CSV";
Taiwan[52] = "＋製作新景線";
Taiwan[53] = "我的景區列表";
Taiwan[54] = "匯出AOI至CSV";
Taiwan[55] = "＋製作新景區";
Taiwan[56] = "我的主題故事列表";
Taiwan[57] = "匯出SOI至CSV";
Taiwan[58] = "＋製作新主題故事";
Taiwan[59] = "加入";

English[31] = "● My POI";
English[32] = "● My LOI";
English[33] = "● My AOI";
English[34] = "● My SOI";
English[35] = "My POI list";
English[36] = "Export POI to CSV";
English[37] = "+ Create new POI";
English[38] = "(Unverified /";
English[39] = "(Verified /";
English[40] = "(Verification Failed /";
English[41] = "Public";
English[42] = "Private";
English[43] = "Image)";
English[44] = "Audio)";
English[45] = "Video)";
English[46] = "None)";
English[47] = "Join Group";
English[48] = "Delete";
English[49] = "Edit";
English[50] = "My LOI list";
English[51] = "Export LOI to CSV";
English[52] = "+ Create new LOI";
English[53] = "My AOI list";
English[54] = "Export AOI to CSV";
English[55] = "+ Create new AOI";
English[56] = "My SOI list";
English[57] = "Export SOI to CSV";
English[58] = "+ Create new SOI";
English[59] = "join";

Japan[31] = "● 私のPOI";
Japan[32] = "● 私のLOI";
Japan[33] = "● 私のAOI";
Japan[34] = "● 私のSOI";
Japan[35] = "私のPOIリスト";
Japan[36] = "輸出POI至CSV";
Japan[37] = "+新しいPOIを作成する";
Japan[38] = "(検証されていません /";
Japan[39] = "(検証されています /";
Japan[40] = "(認証が失敗します /";
Japan[41] = "公開";
Japan[42] = "不公開";
Japan[43] = "写真)";
Japan[44] = "音声)";
Japan[45] = "ビデオ)";
Japan[46] = "メディアがありません)";
Japan[47] = "グループに参加";
Japan[48] = "削除";
Japan[49] = "修正";
Japan[50] = "私のLOIリスト";
Japan[51] = "輸出LOI至CSV";
Japan[52] = "+新しいLOIを作成する";
Japan[53] = "私のAOIリスト";
Japan[54] = "輸出AOI至CSV";
Japan[55] = "+新しいAOIを作成する";
Japan[56] = "私のSOIリスト";
Japan[57] = "輸出SOI至CSV";
Japan[58] = "+新しいSOIを作成する";
Japan[59] = "参加する";

//listgroup
Taiwan[60] = "通知";
Taiwan[61] = "申請加入群組: ";
Taiwan[62] = "同意";
Taiwan[63] = "拒絕";
Taiwan[64] = "拒絕加入群組: ";
Taiwan[65] = "確認";
Taiwan[66] = "邀請你加入群組:";
Taiwan[67] = "加入";
Taiwan[68] = "不同意你加入群組: ";
Taiwan[69] = "無通知訊息";
Taiwan[70] = "探索";
Taiwan[71] = "我的群組";
Taiwan[72] = "＋建立新群組";
Taiwan[73] = "邀請";
Taiwan[74] = "解散";
Taiwan[75] = "管理";
Taiwan[76] = "退出";
Taiwan[77] = "查看";
Taiwan[78] = "申請加入";
Taiwan[79] = "送出邀請";
Taiwan[80] = "群組Leader可邀請成員進入群組";
Taiwan[81] = "User 可建立多個群組亦可申請加入多個群組";
Taiwan[82] = "群組Leader可解散群組";
Taiwan[83] = "群組Member可退出群組";
Taiwan[84] = "若群組為不公開則無法探索該群組";
Taiwan[85] = "若群組為公開且驗證通過才可在搜尋功能查詢群組";
Taiwan[86] = "關閉";

English[60] = "Notify";
English[61] = "Apply to join group:";
English[62] = "Agree";
English[63] = "Refuse";
English[64] = "Refuse to join the group: ";
English[65] = "Confirmation";
English[66] = "invite you to join the group:";
English[67] = "Join";
English[68] = "Disagree you to join this group: ";
English[69] = "No notification message";
English[70] = "Explore";
English[71] = "My Group";
English[72] = "+Create new group";
English[73] = "Invite";
English[74] = "Disband";
English[75] = "Manage";
English[76] = "Leave";
English[77] = "View";
English[78] = "Apply";
English[79] = "Send Invitation";
English[80] = "Group Leader can invite members to the group";
English[81] = "User can create multiple groups or apply to join multiple groups";
English[82] = "Group Leader Disbandable Group";
English[83] = "Group Member could exit group";
English[84] = "The group can not be explored if the group is not public";
English[85] = "If the group is public and validated, the search function can be found in the group";
English[86] = "Close";

Japan[60] = "通知";
Japan[61] = "グループへの参加申請:";
Japan[62] = "同意する";
Japan[63] = "拒否";
Japan[64] = "グループへの参加を拒否：";
Japan[65] = "確認";
Japan[66] = "あなたをグループに招待してください:";
Japan[67] = "参加";
Japan[68] = "あなたのグループへの参加に同意しないでください：";
Japan[69] = "通知メッセージがありません";
Japan[70] = "探査";
Japan[71] = "私のグループ";
Japan[72] = "+新しいグループを作成する";
Japan[73] = "招待状";
Japan[74] = "解散";
Japan[75] = "マネジメント";
Japan[76] = "終了する";
Japan[77] = "見る";
Japan[78] = "適用";
Japan[79] = "招待状を送る";
Japan[80] = "グループリーダーはグループにメンバーを招待できます";
Japan[81] = "ユーザーは複数のグループを作成したり、複数のグループに参加することができます";
Japan[82] = "グループリーダー離脱可能グループ";
Japan[83] = "グループメンバーはグループを終了できます";
Japan[84] = "グループが公開されていない場合、グループを調査することはできません";
Japan[85] = "グループが公開されており、検証されている場合、グループ内で検索機能を見つけることができます";
Japan[86] = "閉じる";

//map
Taiwan[87] = "導覽地圖";
Taiwan[88] = "級別";
Taiwan[89] = "內容型態";
Taiwan[90] = "地區";
Taiwan[91] = "主題";
Taiwan[92] = "類型";
Taiwan[93] = "範疇";
Taiwan[94] = "媒體類別";
Taiwan[95] = "學生";
Taiwan[96] = "專家";
Taiwan[97] = "解說員";
Taiwan[98] = "景點";
Taiwan[99] = "景線";
Taiwan[100] = "景區";
Taiwan[101] = "主題故事";
Taiwan[102] = "全部";
Taiwan[103] = "體驗的";
Taiwan[104] = "活化再造的";
Taiwan[105] = "消逝的";
Taiwan[106] = "人物";
Taiwan[107] = "事件";
Taiwan[108] = "人文景觀";
Taiwan[109] = "自然景觀";
Taiwan[110] = "產業";
Taiwan[111] = "古蹟";
Taiwan[112] = "歷史建築";
Taiwan[113] = "紀念建築";
Taiwan[114] = "考古遺址";
Taiwan[115] = "史蹟";
Taiwan[116] = "文化景觀";
Taiwan[117] = "古物";
Taiwan[118] = "其它";
Taiwan[119] = "相片";
Taiwan[120] = "聲音";
Taiwan[121] = "影片";
Taiwan[122] = "語音導覽";
Taiwan[123] = "景點列表";
Taiwan[124] = "景線列表";
Taiwan[125] = "景區列表";
Taiwan[126] = "故事列表";

English[87] = "Explore map";
English[88] = "Subject";
English[89] = "Type";
English[90] = "Region";
English[91] = "Subject";
English[92] = "Type";
English[93] = "Format";
English[94] = "Media Type";
English[95] = "student";
English[96] = "expert";
English[97] = "docent";
English[98] = "POI";
English[99] = "LOI";
English[100] = "AOI";
English[101] = "SOI";
English[102] = "All";
English[103] = "Experiential";
English[104] = "Activation and Reconstructed";
English[105] = "disappeared";
English[106] = "People";
English[107] = "Event";
English[108] = "Human Landscape";
English[109] = "Natural Landscape";
English[110] = "Industry";
English[111] = "Historical Site, Historical Buildings, Village";
English[112] = "Ruins";
English[113] = "Culture Landscape";
English[114] = "Traditional Art";
English[115] = "Folk Customs and Relevant Cultural Artifacts";
English[116] = "Antique";
English[117] = "Food & Drink, Lodging, Reansportation, Infotainment";
English[118] = "Others";
English[119] = "Image";
English[120] = "Audio";
English[121] = "Video";
English[122] = "Audio guide";
English[123] = "POIs";
English[124] = "LOIs";
English[125] = "AOIs";
English[126] = "SOIs";

Japan[87] = "ガイドマップ";
Japan[88] = "級別";
Japan[89] = "分類";
Japan[90] = "エリア";
Japan[91] = "テーマ";
Japan[92] = "分類";
Japan[93] = "フォーマット";
Japan[94] = "ファイル形式";
Japan[95] = "学生";
Japan[96] = "教師";
Japan[97] = "ガイド";
Japan[98] = "スポット";
Japan[99] = "ルート";
Japan[100] = "エリア";
Japan[101] = "場域";
Japan[102] = "全部";
Japan[103] = "現存している";
Japan[104] = "再建と復建による他目的活用";
Japan[105] = "現存していない";
Japan[106] = "人物";
Japan[107] = "出来事";
Japan[108] = "文化的背景による産物";
Japan[109] = "自然的背景による産物";
Japan[110] = "產業";
Japan[111] = "古跡、歴史建築、集落";
Japan[112] = "遺跡";
Japan[113] = "文化景観";
Japan[114] = "伝統的な工芸品";
Japan[115] = "習俗等に関する文物";
Japan[116] = "昔の物";
Japan[117] = "衣食住および日々の楽しみなど";
Japan[118] = "その他";
Japan[119] = "アップ";
Japan[120] = "音声";
Japan[121] = "ビデオ";
Japan[122] = "オーディオガイド";
Japan[123] = "スポットリスト";
Japan[124] = "ルートリスト";
Japan[125] = "エリアリスト";
Japan[126] = "場域リスト";

//intro
Taiwan[127] = '「文史脈流行動數位文化資產導覽服務平台」為一開放式平台，提供 (1)文化資產行動數位內容予大家(i) 利用手機或平板電腦進行現地的文化資產導覽或(ii)在桌機、手機或平板電腦上進行虛擬的文化資產導覽，和(2)各種軟體工具予大家製作及存放各種型態的文化資產行動數位內容 (Mobile Digital Culture Heritage Content)。';
Taiwan[128] = "文化資產行動數位內容分類";
Taiwan[129] = "文化資產行動數位內容的型態 (Category)";
Taiwan[130] = "景點 (Point Of Interest, POI):<br> 單一的景點介紹,導覽的最基本單位.";
Taiwan[131] = "景線 (Line Of Interest, LOI):<br>以導覽情境為考量,設計出有地域關聯性的一條導覽景點路線(A sequence of POIs),為一有參訪先後次序規劃的景線.";
Taiwan[132] = "景區 (Area Of Interest, AOI): <br> 以一特定區域之文化資產為主軸,設計出有地域關聯性的一組導覽景點區域(A set of POIs),得為一有故事性的景區.<br> 一個景區(AOI)可包涵蓋許多景點(POIs),並依這些景點(POIs)設計出許多主題景線(LOIs).";
Taiwan[133] = "";
Taiwan[134] = "文化資產行動數位內容的級別 (Class)";
Taiwan[135] = "專家";
Taiwan[136] = "玩家";
Taiwan[137] = "導覽解說員";
Taiwan[138] = '文化資產行動數位內容的語言 (Language)';
Taiwan[139] = "中文";
Taiwan[140] = "英文";
Taiwan[141] = "日文";
Taiwan[142] = "中文版文化資產行動數位內容的地區 (Region)";
Taiwan[143] = "可使用中文製作及導覽全世界國家及地區的景點/景線/景區(手機設定為中文模式)";
Taiwan[144] = "台灣: 以縣/市-鄉/鎮/區為單位區域";
Taiwan[145] = "世界各國: 以國家為單位區域";
Taiwan[146] = "外文版文化資產行動數位內容的地區 (Region)";
Taiwan[147] = "可使用英/日文製作及導覽全世界國家及地區的景點/景線/景區 (手機設定為英/日文模式)";
Taiwan[148] = "英文: 台灣: 以縣/市-鄉/鎮/區為單位區域<br>世界各國: 以國家為單位區域";
Taiwan[149] = '日文: 台灣: 以縣/市-鄉/鎮/區為單位區域<br>日本:';
Taiwan[150] = "景點(POI)內容分類";
Taiwan[151] = "景點主題 (Subject)";
Taiwan[152] = "消逝的: 表示該景點已經不復存在，僅剩下歷史文獻記載當作參考。如台南府城的大/小城門和台北舊火車站。";
Taiwan[153] = "體驗的: 表示該景點仍然存在，並沒有因為時間的流逝而消失。如現存的歷史文化地景(台南府城的大南門)、產業(度小月)、文物(翠玉白菜)等。";
Taiwan[154] = "活化與再造的: 表示該景點的景觀是被還原過或重新修復的，再度賦予新的用途。如台南仁德十鼓文創園區(過去為台糖糖廠)和台北松山文創園區(過去為松山菸廠)。";
Taiwan[155] = "景點類型 (Type)";
Taiwan[156] = "自然景觀";
Taiwan[157] = "人文景觀";
Taiwan[158] = "事件";
Taiwan[159] = "人物";
Taiwan[160] = '產業';
Taiwan[161] = "景點範疇 (Format)";
Taiwan[162] = "古蹟,歷史建築,聚落";
Taiwan[163] = "遺址";
Taiwan[164] = "文化景觀";
Taiwan[165] = "自然景觀";
Taiwan[166] = "民俗及有關文物";
Taiwan[167] = "古物";
Taiwan[168] = "傳統藝術";
Taiwan[169] = "食衣住行育樂";
Taiwan[170] = "其它";
Taiwan[171] = '景點媒體類別 (Media Type)';
Taiwan[172] = "照片 (Picture) + 文字";
Taiwan[173] = "影片 (Movie) + 文字";
Taiwan[174] = "聲音 (Audio) + 文字";
Taiwan[175] = "景點語音導覽解說";
Taiwan[176] = "景點製作者得附加相關之語音導覽解說，讓使用者可更深入得了解相關景點。";
Taiwan[177] = "景點使用權限";
Taiwan[178] = "公開";
Taiwan[179] = "不公開(私有)";
Taiwan[180] = '此平台所提供的網站, 請輸入<a href="http://deh.csie.ncku.edu.tw">http://deh.csie.ncku.edu.tw</a> 系統會自動導入';
Taiwan[181] = "桌機版";
Taiwan[182] = "手機及平板電腦版";
Taiwan[183] = "DEH平台所提供的APPs";
Taiwan[184] = "純導覽";
Taiwan[185] = "<strong>DEH Lite</strong>:<br>展現附近相片(image)、聲音(audio)和影片(video)景點(Point Of Interests, POIs);播放景點(POI)內含之語音導覽解說;使用FB, Line及其它工具分享相關景點(POI)。";
Taiwan[186] = "<strong>DEH Mini</strong>:<br>展現附近/我的相片(image)、聲音(audio)和影片(video)景點(POIs)及附近/我的景線(Line Of Interests , LOIs)和景區(Area Of Interests, AOIs);播放景點(POI)內含之語音導覽解說;使用FB, Line及其它工具分享相關景點(POI)。";
Taiwan[187] = "<strong>Narrator</strong>:<br>此APP可讓導覽解說員打開其手機Wi-Fi熱點的功能，讓參加導覽解說的成員可用其手機上之Wi-Fi網路連線到導覽解說員的Wi-Fi熱點，由此分享到導覽解說員的文字及影音景點的輔助導覽解說。導覽解說員可以利用此APP下載其所在地點附近文化資產之相片／影片／聲音景點（景線／景區）資訊，藉此可運用手機或平板電腦輔助其進行增加文字及影音的文化資產解說。";
Taiwan[188] = "純製作POIs";
Taiwan[189] = "<strong>DEH Make</strong>:<br>製作相片(image)、影片(video)和聲音(audio)景點(POI);錄製景點(POI)之相關語音導覽解說;使用FB, Line及其它工具分享製作好之景點(POI)。";
Taiwan[190] = "導覽及製作POIs";
Taiwan[191] = "<strong>DEH Image</strong>:<br>製作相片(image)、影片(video)和聲音(audio)景點(POI);錄製景點(POI)之相關語音導覽解說;使用FB, Line及其它工具分享製作好之景點(POI)。";
Taiwan[192] = "<strong>DEH Video</strong>:<br>製作影片(video)景點(POI)及錄製景點(POI)之相關語音導覽解說;展現我的影片(video)景點(POI);使用FB, Line及其它工具分享製作好之影片(video)景點(POI)。";
Taiwan[193] = "<strong>DEH Audio</strong>:<br>製作聲音(audio)景點(POI)及錄製景點(POI)之相關語音導覽解說;展現我的聲音(audio)景點(POI);使用FB, Line及其它工具分享製作好之聲音(audio)景點(POI)。";
Taiwan[194] = "<strong>DEH Micro</strong>:<br>展現附近相片(image)景點(POIs)、景線(Line Of Interests , LOIs)和景區(Area Of Interests, AOIs);使用FB, Line及其它工具分享相關景點(POI)。";
Taiwan[195] = "平台可能使用對象及情境(不限定,不限制,請使用者發想)";
Taiwan[196] = "庶民生活圈:<br>社區發展協會存放其社區文史和自然景觀資料<br>原住民部落存放其文史紀錄和自然景觀資料";
Taiwan[197] = "場域:<br> 農/林/漁/牧園區及民宿<br>自然景觀園區<br>博物館/文物館文資園區文史工作者/室:<br>數位化及存放其在地文史資料";
Taiwan[198] = "國家公園和國家風景區:<br>數位化及存放其自然景觀資內容";
Taiwan[199] = "文化資產導覽解說員";
Taiwan[200] = "出租車/計程車包車旅遊之司機導覽解說員";
Taiwan[201] = "傳統文化資產保留與運用:<br>古蹟<br>歷史建築<br>聚落<br>遺址<br>文化景觀";
Taiwan[202] = "學校教育:<br>高/中/小學數位行動/戶外/鄉土教學<br>大學文/史/觀光/休憩等學系之台灣古蹟文化資產相關課程<br>社區大學課程<br>大學通識課程";
Taiwan[203] = "普羅大眾深度旅遊日記";
Taiwan[204] = "場域主題故事";
Taiwan[205] = "平台使用情境列舉";
Taiwan[206] = "情境 1: 社區發展協會/原住民部落導覽/場域/民宿";
Taiwan[207] = "規劃景區(AOI)及製作景點(POIs):<br>古蹟,歷史建築,聚落<br>遺址<br>文化景觀<br>自然景觀<br>民俗及有關文物<br>消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs<br>";
Taiwan[208] = "自製景線(LOIs):<br>依各個主題特性，規劃及設計出相關之數條景線";
Taiwan[209] = "現地解說及導覽 - 社區,部落和場域解說員";
Taiwan[210] = "自助旅遊 – 利用手機或平板電腦之自助解說導覽";
Taiwan[211] = "情境2:大/高/中/小學數位行動/戶外/鄉土教學&社區大學在地文化資產課程";
Taiwan[212] = "導覽課程一: <br> 現有景點(POIs)=>設製景區(AOI)/景線(LOI)";
Taiwan[213] = "導覽課程二:  <br> 現有景點+老師/學生自製景點(POIs)(導覽前先製) <br> =>設製景區(AOI)/景線(LOI)";
Taiwan[214] = "導覽課程三:  <br> 現有景點(POIs)=>設製景區(AOI)/景線(LOI)+  老師/學生on-touring時收集內容 (調查,紀錄,照相, 錄影, 錄音) <br> =>導覽後製作景點(POIs)/景區(AOI)/景線(LOI) (家庭作業)";
Taiwan[215] = "Pure家庭作業 without現地導覽:  <br> 行動數位化在地鄉土文化資產製作景點(POIs)/景區(AOI)/景線(LOI)";
Taiwan[216] = "情境3:行動文化資產導覽解說員";
Taiwan[217] = "古蹟,歷史建築,聚落<br>遺址<br>文化景觀<br>自然景觀<br>民俗及有關文物<br>消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs";
Taiwan[218] = "公開景點及私房景點";
Taiwan[219] = "設計各類景線(LOIs) for 不同類之旅由個人或團體:<br>公開景線及私房景線";
Taiwan[220] = "現地解說及導覽";
Taiwan[221] = "可以一(或多)個旗艦(Flag-Ship)景點搭配周邊其它景點組成各類景線(LOI)和景區(AOI)";
Taiwan[222] = "可為解說員/場域廣告行銷之方法:<br>網路廣告 (藉由FB):全由公開景點組成<br>實際導覽:含一些公開景點及一些不公開之私房景點 (自己開發出私藏景點)";
Taiwan[223] = "分成春夏秋冬4種POIs/LOIs/AOIs";
Taiwan[224] = "每年更新內容:<br>同樣的場域: 不同的人/事/物<br> 開發不同的場域:不同的人/事/地/物<br>去年的私房景點變成今年自己或他人的公開景點<br>今年再開發自己的不公開之私房景點<br>";
Taiwan[225] = "情境4: 文史工作者/室";
Taiwan[226] = "依擁有之文史資料及知識擇定目標文化資產景區(AOI)及製作景點(POIs): <br> 古蹟,歷史建築,聚落 <br> 遺址 <br> 文化景觀 <br> 自然景觀 <br> 民俗及有關文物 <br> 消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs <br>";
Taiwan[227] = "設計各類主題景線(LOIs)";
Taiwan[228] = "目的: <br> 文化資產保留及傳習 <br> 現地解說及導覽 <br> 來訪之自助旅遊人士";
Taiwan[229] = "情境5:普羅大眾深度旅遊";
Taiwan[230] = "旅行前:路線規劃(在DEH web site(http://deh.csie.ncku.edu.tw) <br> 搜尋景點, 建立旅遊景線/景區 (LOI /AOI) <br> 選擇專家或玩家景線/景區(LOI /AOI) <br> 參考專家或玩家景線/景區(LOI /AOI),建立旅遊景線/景區 (LOI /AOI)";
Taiwan[231] = "旅行中:實地導覽(使用DEH Mini) <br> 及時景點介紹 <br> 目的地導航 <br> 實地導覽 <br> 使用DEH Make照相,錄影,及錄音,製作POIs,上傳至DEH server";
Taiwan[232] = "旅行後: <br> 在回程的車上或回家後, 到DEH website(http://deh.csie.ncku.edu.tw) 整理完成上傳之相片/影片/聲音各類POIs <br> 撰製景區和景線 <br> 完成旅遊日記, 放送至FB, Line, 微博, etc.,分享親朋好友 ";

English[127] = 'The "Cultural History and Transaction Stream Digital Cultural Assets Navigation Service Platform" is an open platform that provides (1) cultural asset action digital content for everyone (i) use of mobile phones or tablets for local cultural asset management. Or (ii) conduct virtual cultural asset navigation on desktops, mobile phones or tablets, and (2) various software tools for the production and storage of various types of mobile digital cultural heritage content. . ';
English[128] = "Classification of Cultural Assets Action Digital Content";
English[129] = "Category of Cultural Asset Action Digit Content";
English[130] = "Point Of Interest (POI):<br> Single point of view, the most basic unit of navigation.";
English[131] = "Line Of Interest (LOI): <br> Considering the navigation situation, design a regional sequence of POIs. The order of the planned landscape.";
English[132] = "Area of ​​Interest (AOI): <br> A set of POIs (A set of POIs) with geographical relevance is designed using the cultural assets of a specific area as the principal axis. A story area.<br> An area (AOI) can cover many attractions (POIs), and according to these attractions (POIs) to design many theme lines (LOIs).";
English[133] = "";
English[134] = "Class of Cultural Assets Action Content (Class)";
English[135] = "Experts";
English[136] = "Player";
English[137] = "Guidance narrator";
English[138] = 'Cultural Asset Action Digital Language (Language)';
English[139] = "Chinese";
English[140] = "English";
English[141] = "Japanese";
English[142] = "Chinese version of Cultural Asset Action Digital Content (Region)";
English[143] = "You can use Chinese to create and navigate the sights/views/scenery of countries and regions around the world (the mobile phone is set to Chinese mode)";
English[144] = "Taiwan: Counties, Cities, Townships, Towns, and Districts as Unit Areas";
English[145] = "Countries in the world: Country-by-country area";
English[146] = "Region of Foreign Cultural Asset Action Digital Content";
English[147] = "You can use English/Japanese to create and navigate the sights/scenes/scenery of countries and regions around the world (the phone is set to English/Japanese mode)";
English[148] = "English: Taiwan: Counties / cities-townships / towns / districts as a unit area <br> Countries around the world: Country as a unit area";
English[149] = 'Japanese: Taiwan: Counties / cities-townships / towns / districts as a unit area <br>Japan:';
English[150] = "Category (POI) Content Classification";
English[151] = "Subjects";
English[152] = "Disappeared: Indicates that the theme attraction no longer exists. Only historical records are used as a reference.";
English[153] = "Experienced: It means that the scenic spot still exists and has not disappeared because of the passage of time, such as the existing historical and cultural landscape, industry, cultural relics, etc.";
English[154] = "Activated and Reconstructed: Denotes that the landscape of the site was restored or rehabilitated, and reapplied to new uses.";
English[155] = "Type of Attractions";
English[156] = "Natural Landscape";
English[157] = "Humanistic Landscape";
English[158] = "Events";
English[159] = "persons";
English[160] = 'Industry';
English[161] = "Category (Format)";
English[162] = "Historic Sites, Historic Buildings, Settlements";
English[163] = "Relics";
English[164] = "Cultural Landscape";
English[165] = "Natural Landscape";
English[166] = "Folklore and Related Cultural Relics";
English[167] = "Antiquities";
English[168] = "Traditional Art";
English[169] = "Food, clothing, and live entertainment";
English[170] = "Others";
English[171] = 'Media Type';
English[172] = "Picture + Text";
English[173] = "Movie + Text";
English[174] = "Audio + Text";
English[175] = "Audio Guide for Attractions";
English[176] = "Additional audio guide commentaries are provided by the makers of the sights so that users can learn more about the attractions.";
English[177] = "License Use Rights";
English[178] = "Open";
English[179] = "Not Public (Private)";
English[180] = 'The website provided by this platform, please enter <a href="http://deh.csie.ncku.edu.tw">http://deh.csie.ncku.edu.tw</html> a> The system will automatically import ';
English[181] = "Desktop Edition";
English[182] = "Mobile Phone and Tablet PC Edition";
English[183] = "Apps provided by DEH Platform";
English[184] = "Pure Navigation";
English[185] = "<strong>DEH Lite</strong>:<br>Showing nearby images, audio, and video points (Point Of Interests, POIs); playing within POIs Includes audio guide commentary; share relevant attractions (POI) using FB, Line and other tools.";
English[186] = "<strong>DEH Mini</strong>:<br>Showing nearby/my photos, audio and video spots (POIs) and nearby/my view lines ( Line Of Interests, LOIs) and Area Of Interests (AOIs); audio guide commentary included in POI; use FB, Line and other tools to share POIs.";
English[187] = "<strong>Narrator</strong>:<br>This app allows guide narrators to turn on features of their mobile Wi-Fi hotspot so that members participating in the guide can use Wi-in on their mobile phones. The Fi network is connected to the guide narrator's Wi-Fi hotspot, which is used to share guides to guide narrator's text and audio-visual attractions. The guide narrator can use this app to download cultural assets near their location. Photo/video/sound attraction (view line/scenery) information can be used to assist mobile phone or tablet computer in the interpretation of cultural assets for text and audio/video.";
English[188] = "Pure POIs";
English[189] = "<strong>DEH Make</strong>:<br>Making photos (image), video (video), and audio (POI) spots; related audio guides for recording spots (POI) Use FB, Line and other tools to share well-made attractions (POI).";
English[190] = "Navigation and Production of POIs";
English[191] = "<strong>DEH Image</strong>:<br>Producing image (image), video (video), and audio (POI) spots; related audio guides for recording spots (POI) Use FB, Line and other tools to share well-made attractions (POI).";
English[192] = "<strong>DEH Video</strong>:<br>Properties related to the production of video (POI) and recorded attractions (POI); voice guide to show (video) attractions ( POI); Use FB, Line, and other tools to share well-made video spots (POI).";
English[193] = "<strong>DEH Audio</strong>:<br>Producing voice (audio) spots (POI) and recorded spots (POI) related audio guide commentary; show my voice (audio) spots ( POI); Use FB, Line and other tools to share well-made audio attractions (POI).";
English[194] = "<strong>DEH Micro</strong>:<br>Showing POIs, Line Of Interests (LOIs), and Area Of Interests (AOIs). FB, Line and other tools to share related attractions (POI).";
English[195] = "Platform may use objects and situations (no limit, no limit, please think by users)";
English[196] = "The people's livelihood:<br>Community Development Association stores information on their cultural history and natural landscapes in the community<br>Indigenous people's tribe stores their historical records and natural landscape information";
English[197] = "Fields:<br> Agriculture / Forestry / Fishery / Pastoral Park & ​​B&B <br>Natural Landscape Park <br> Museums / Cultural Assets Cultural Park Workers / Rooms: <br> Digitalization & Store its local history information";
English[198] = "National Parks and National Scenic Area: <br> Digitization and Storage of Natural Landscape Resources";
English[199] = "Guide to Cultural Assets Guide";
English[200] = "Guide for pilots of taxi/taxis chartered tours";
English[201] = "Retention and Use of Traditional Cultural Assets: <br>Historical Sites <br> Historic Buildings <br> Settlements <br> Sites <br> Cultural Landscapes";
English[202] = "School Education:<br>High/Secondary/Primary School Digital Action/Outdoor/Local Education<br>College Literature/History/Sightseeing/Reclining Studies, etc. Taiwan Heritage Cultural Assets Related Courses <br> Community College Courses <br>University General Studies";
English[203] = "Deep Travel Journal of the General Public";
English[204] = "Field Topic Story";
English[205] = "Platform Use Situation Enumeration";
English[206] = "Scenario 1: Community Development Association / Aboriginal Tribal Guide / Field / Homestay";
English[207] = "AOI and POIs: <br> Monuments, Historical Buildings, Settlements <br> Sites <br> Cultural Landscapes <br> Natural Landscapes <br> Folklore and Related Artifacts <br> Disappearing/Experienced /Activated and Reconstructed Natural Landscapes/Humanistic Landscapes/Events/People/Industrial Photos/Videos/Sounds of Various POIs<br>";
English[208] = "LOIs:<br>Planning and designing several related lines according to the characteristics of each theme";
English[209] = "Local commentary and guides - community, tribal and field narrators";
English[210] = "Self-tourism - Self-help guides using mobile or tablet computers";
English[211] = "Scenario 2: Large/High/Medium/Primary School Digital Action/Outdoor/Local Teaching/Community University Cultural Assets";
English[212] = "Navigation Course I: <br> Existing Scenic Spots (POIs) => AOI/Landscape (LOI)";
English[213] = "Scenario 2: <br> Existing Attractions + Teacher/Students POIs (Pre-guided tour) <br> => AOI/Landscape (LOI)";
English[214] = "Navigation course 3: <br> POIs => AOI/LOI + content collected by the teacher/student on-touring (survey, record, photo, etc.) Video, recording) <br> => Guided POIs / AOI / LOI (Homework)";
English[215] = "Pure homework without location guide: <br> Actions digitizing local cultural assets (POIs)/Area (AOI)/Lonelines (LOI)";
English[216] = "Scenario 3: Guides for Action Cultural Assets Guides";
English[217] = "Monuments, Historical Buildings, Settlements <br> Sites <br> Cultural Landscapes <br> Natural Landscapes <br> Folk and Related Cultural Objects Industry Photo/Video/Sound POIs";
English[218] = "Disclosed Attractions and Private Places of Interest";
English[219] = "Designing LOIs for different types of trips by individuals or groups: <br> Public Views and Private Views";
English[220] = "Local commentary and guides";
English[221] = "You can form a variety of landscapes (LOI) and scenic spots (AOI) with one or more Flag-Ship attractions and other surrounding attractions;"
English[222] = "How to market for narrators/field advertising:<br>Online advertising (with FB): All made up of public places of interest <br> Actual tour: With some public places and some unlisted Private-room attractions (developing private collections of their own)";
English[223] = "Divided into 4 types of POIs/LOIs/AOIs in spring, summer, autumn and winter";
English[224] = "Annually updated content:<br>Same field: different people/things/things<br> Developing different fields: different people/things/land/items<br>Last year's private sights Become this year's own or others' public sights<br>Redevelop their own undisclosed private homes this year<br>";
English[225] = "Situation 4: Literary/History Workers/Rooms";
English[226] = "Choose AOI and POIs: According to own historical and historical information and knowledge: <br> Monuments, historic buildings, settlements <br> Sites <br> Cultural landscapes <br> Natural Landscapes <br> Folklore and Related Cultural Relics <br> Evanescent/Experienced/Reactivated Natural Landscapes/Humanistic Landscapes/Events/People/Industrial Photos/Videos/Sounds of Various POIs <br>";
English[227] = "Designing LOIs";
English[228] = "Purpose: <br> Cultural Assets Retention and Discourse <br> Current Commentaries and Guides <br> Visiting Self-Help Tourists";
English[229] = "Situation 5: Depth of the general public";
English[230] = "Before Traveling: Route Planning (at DEH web site(http://deh.csie.ncku.edu.tw) <br> Searching for Attractions, Establishing Travel Lines / Scenic Spots (LOI / AOI) <br> > Select Experts or Players Scenery / Scenic Area (LOI / AOI) <br> Reference Experts / Players Scene / Scenic Area (LOI / AOI), Establishing Travel Landscape / Scenic Area (LOI / AOI)";
English[231] = "Travel: Field Guide (use DEH Mini) <br> timely Attractions <br> destination navigation <br> field tour <br> DEH Make use of photography, video and sound recording, production POIs, uploaded to the DEH server";
English[232] = "After Travel: <br> On the return trip or after returning home, go to the DEH website (http://deh.csie.ncku.edu.tw) to finish uploading the photos/videos/voices. class system POIs <br> essays and scenic landscape line <br> complete travel diary, run to FB, line, microblogging, etc., to share friends and family ";


Japan[127] = "文化史と取引ストリームデジタル文化財ナビゲーションサービスプラットフォーム」は、（1）すべての人が文化財のデジタルコンテンツを利用して、（i）携帯電話やタブレットを地元の文化財（ii）デスクトップ、携帯電話またはタブレット上での仮想的な文化的資産ナビゲーション、（2）様々なタイプのモバイルデジタル文化遺産コンテンツの制作と保存のためのさまざまなソフトウェアツール。 ";
Japan[128] = "文化資産行為内容の分類";
Japan[129] = "文化資産アクション桁コンテンツのカテゴリ";
Japan[130] = "興味のあるポイント（POI）：<br>シングルポイント、ナビゲーションの最も基本的なユニット。";
Japan[131] = "関心のある行（LOI）：<br>ナビゲーション状況を考慮して、POIの地域シーケンスを設計します。計画された風景の順序。 ";
Japan[132] = "関心領域（AOI）：<br>特定の地域の文化財を主軸として、地理的関連性を持つ一連のPOI（POIの集合）を設計する。 （AOI）は多くのアトラクション（POI）をカバーすることができ、多くのテーマライン（LOI）はこれらのアトラクション（POI）に基づいて設計されています。";
Japan[133] = "";
Japan[134] = "文化財活動内容のクラス（クラス）";
Japan[135] = "エキスパート";
Japan[136] = "プレイヤー";
Japan[137] = "ガイダンスナレーター";
Japan[138] = "文化財行動デジタルコンテンツのための言語」";
Japan[139] = "中国語";
Japan[140] = "英語";
Japan[141] = "日本語";
Japan[142] = "中国文化資産アクションデジタルコンテンツの「地域」。";
Japan[143] = "世界中の国や地域の観光スポット/風景/風景を作成したり移動するには中国語を使用できます（携帯電話は中国語モードに設定されています）。";
Japan[144] = "台湾：郡/都市 - 郡/町/区域を単位面積とする。";
Japan[145] = "世界の国々：国別地域";
Japan[146] = "外国の文化財活動デジタルコンテンツの地域"
Japan[147] = "英語/日本語を使用して、世界中の国・地域の観光スポット/シーン/スポットを作成し、ナビゲートすることができます（電話は英語/日本語モードに設定されています）。";
Japan[148] = "英語：台湾：郡/市町村/郡/区域を単位地域として - 世界の国々：単位地域としての国";
Japan[149] = "日本語：台湾：郡/都市 - 郡/町/単位区域としての日本 <br> 日本： ";
Japan[150] = "カテゴリ（POI）コンテンツの分類";
Japan[151] = "科目";
Japan[152] = "現存していない： テーマアトラクションが消滅したことを示しています。履歴レコードのみが参照として使用されています。";
Japan[153] = "体験する： 既存の歴史的、文化的景観、産業、文化遺産などの時間の経過と消滅のためではなく、観光名所がまだ存在することを示すそうです。";
Japan[154] = "再建と復建による他目的活用： アトラクションのビューが復元または再修復されたことを示し、新しいアトラクションを提供します。";
Japan[155] = "観光スポットのタイプ";
Japan[156] = "自然景観";
Japan[157] = "人道的景観";
Japan[158] = "イベント";
Japan[159] = "人";
Japan[160] = "産業";
Japan[161] = "カテゴリ（形式）";
Japan[162] = "歴史的名所、歴史的建造物、集落";
Japan[163] = "遺物";
Japan[164] = "文化的景観";
Japan[165] = "自然景観";
Japan[166] = "民俗と関連する文化遺物";
Japan[167] = "古美術";
Japan[168] = "伝統芸術";
Japan[169] = "食料、衣料品、ライブエンターテイメント";
Japan[170] = "その他";
Japan[171] = 'メディアタイプ';
Japan[172] = "絵+テキスト";
Japan[173] = "映画+テキスト";
Japan[174] = "オーディオ+テキスト";
Japan[175] = "アトラクションのオーディオガイド";
Japan[176] = "観光名所のメーカーが追加の音声ガイド解説を提供しているため、ユーザーは観光スポットについてもっと知ることができます。";
Japan[177] = "ライセンス使用権";
Japan[178] = "オープン";
Japan[179] = "非公開（プライベート）";
Japan[180] = 'このプラットフォームに設けられ、入力<a href="http://deh.csie.ncku.edu.tw"> http://deh.csie.ncku.edu.tw </ a>システムは自動的にインポートされます。';
Japan[181] = "デスクトップ版";
Japan[182] = "携帯電話とタブレットPC版";
Japan[183] = "DEHプラットフォームが提供するアプリ";
Japan[184] = "純粋なナビゲーション";
Japan[185] = "<strong> DEHライト</strong>：<BR>写真（画像）近くのショー、サウンド（オーディオ）とビデオ（映像）の観光名所（持分のポイント、POIの）;プレイヤーの観光名所（POI）内音声ガイドの解説を含み、FB、ラインなどのツールを使用して関連するアトラクション（POI）を共有します。";
Japan[186] = "<strong> DEHミニ</strong>：<BR>私の写真（画像）、サウンド（オーディオ）とビデオ（映像）の観光名所（ランドマーク）/近くのショーと近い/マイキングライン（ （POI）に含まれるオーディオガイドの解説、FB、ライン、およびその他のツールを使用して関連するアトラクション（POI）を共有することができます。";
Japan[187] = "<strong>ナレーター</strong>：<br>このガイドでは、ガイドナレータがモバイルWi-Fiホットスポットの機能を有効にして、ガイドに参加しているメンバーがWi- FiネットワークはナレーターのWi-Fiホットスポットに接続されており、ナレーターのテキストとオーディオビジュアルアトラクションをガイドするガイドを共有します。ガイドナレーターはこのアプリを使用して、近くの文化資産をダウンロードできます。写真/ビデオ/サウンドアトラクションその文化財の携帯電話やタブレットコンピュータ支援の解釈を使用することができる（キングライン/風光明媚な）情報テキストとビデオの増加でした。";
Japan[188] = "純粋POI";
Japan[189] = "<strong> DEH Make </strong>：<br>写真（画像）、ビデオ（ビデオ）、および音声（POI）スポットを作成する、スポットを記録するための関連オーディオガイド（POI） FB、ラインなどのツールを使って、よく作られたアトラクション（POI）を共有してください。";
Japan[190] = "POIのナビゲーションと生産";
Japan[191] = "<strong> DEH画像</ strong>：<br>画像（画像）、ビデオ（ビデオ）、および音声（POI）スポットを作成する、スポットを記録するための関連オーディオガイド（POI）FB、Lineよく作られたアトラクション（POI）を共有するためのツールなどがあります。";
Japan[192] = "<strong> DEHビデオ</ strong>：ビデオ（POI）と録画されたアトラクション（POI）の制作に関連するプロパティ、（ビデオ）アトラクション（POI）を表示する音声ガイド、FB 、ライン、その他のツールを使って、よく作られたビデオスポット（POI）を共有することができます。";
Japan[193] = "<strong> DEH Audio </ strong>：オーディオ（POI）と録音ポイント（POI）に関連するオーディオガイド解説、オーディオ（POI）の提示、FB、 ラインやその他のツールは、よく作られたオーディオアトラクション（POI）を共有します。";
Japan[194] = "<strong> DEH Micro </ strong>：FB、線、その他のツールを使用してPOI、関心領域（LOI）、関心領域（AOI）を表示 関連するアトラクション（POI）を共有します。";
Japan[195] = "プラットフォームはオブジェクトや状況を使用することがあります（無制限、無制限、ユーザーが考えてください）";
Japan[196] = "人々の生活：コミュニティ開発協会は、コミュニティの文化史と自然景観に関する情報を保存しています。 - 先住民族の歴史記録と自然景観情報を保存しています。";
Japan[197] = "フィールド：農業/林業/漁業/牧歌的な公園とB＆B - 自然景観公園 - 博物館/文化資産文化公園労働者/部屋：<br>デジタル化とそのローカルストア履歴情報 ";
Japan[198] = "国立公園と国家風景区：自然景観資源のデジタル化と保存";
Japan[199] = "文化資産ガイド";
Japan[200] = "タクシー/タクシーチャーターツアーのパイロットガイド";
Japan[201] = "伝統的文化財の留保と利用：歴史的建造物と歴史的建造物 - 和解と遺跡 - 文化的景観";
Japan[202] = "学校教育：高等学校/小学校デジタル活動/屋外/地方教育 - 大学文学/歴史/観光/リクライニング研究など台湾遺産文化財関連コース大学の一般的な研究の大学のコース ";
Japan[203] = "一般市民の深い旅行ジャーナル";
Japan[204] = "フィールドトピックストーリー";
Japan[205] = "プラットフォーム利用状況列挙";
Japan[206] = "状況1：コミュニティ開発協会/アボリジニ部族ガイド/フィールド/ホームステイ";
Japan[207] = "AOIとPOI：<br>建造物、歴史的建造物、集落と自然遺産<br>文化的風景と自然の風景 - 民間人物と関連遺物<br>消滅/経験 /活動的で再建された自然の風景/人道的な風景/イベント/人/産業写真/ビデオ/様々なPOIの音<br>";
Japan[208] = "LOIs：<br>各テーマの特徴に応じていくつかの関連する行を計画して設計する";
Japan[209] = "地方の解説とガイド - 地域社会、部族とフィールドナレーション";
Japan[210] = "セルフツアリズム - 携帯またはタブレットコンピュータを使ったセルフヘルプガイド";
Japan[211] = "シナリオ2：大/中/小スクールデジタルアクション/アウトドア/ローカルティーチング/コミュニティ大学文化資産";
Japan[212] = "ナビゲーションコースI：既存の観光スポット（POI）=> AOI /風景（LOI）";
Japan[213] = "コース2：既存のアトラクション+教師/学生POI（事前ガイドツアー）=> AOI /風景（LOI）";
Japan[214] = "ナビゲーションコース3：POI => AOI / LOI +教師/学生ツアー（調査、記録、写真など）で収集されたコンテンツビデオ、録音）<br> =>ガイド付き POI / AOI / LOI（宿題） ";
Japan[215] = "ロケーションガイドのない純粋な宿題：<br>ローカル文化財（POI）/地域（AOI）/孤独（LOI）をデジタル化するアクション";
Japan[216] = "シナリオ3：行動文化資産ガイドのためのガイド";
Japan[217] = "記念建造物、歴史的建造物、居留地、敷地<br>文化的景観<br>自然の風景 - 民族と関連する文化的物体 業界の写真/ビデオ/音声POI";
Japan[218] = "開示されたアトラクションと私有地";
Japan[219] = "個人や団体による異なるタイプの旅行のためのLOIの設計：<br>パブリックビューとプライベートビュー";
Japan[220] = "地方の解説とガイド";
Japan[221] = "1つ以上の旗艦船のアトラクションや周辺のアトラクションで様々な風景（LOI）と景勝地（AOI）を形成することができます。";
Japan[222] = "ナレーター/フィールド広告のマーケティング方法：オンライン広告（FB付き）：すべてが公共の場所で構成されています<br>実際のツアー：公共の場所や一部の私有地（未開発） プライベートコレクション";
Japan[223] = "春、夏、秋、冬の4種類のPOI / LOI / AOIに分かれています。";
Japan[224] = "更新されたコンテンツ毎年：<br>同じフィールド：異なる人々/物事/もの<br>異なるフィールドの開発：異なる人々/物事/土地/物事<br>昨年のプライベートスポットは、 今年のアトラクションの魅力<BR>公共再開発専用の所有者<BR>";
Japan[225] = "状況4：文学/歴史労働者/部屋";
Japan[226] = "自分の歴史的および歴史的な情報と知識に基づいて、目的の文化財（AOI）とPOIを選んでください：<br>モニュメント、歴史的建造物、居住地と集落 - 文化的風景 - 自然の風景 - フォークロア および関連するアーティファクト<br>エバネセント/経験/活性化され、再建された自然の風景/人道的な風景/イベント/人/産業写真/ビデオ/様々なPOIの音<br>";
Japan[227] = "LOIの設計";
Japan[228] = "目的：文化遺産の保持と談話 - 現在の解説とガイド - 訪れるセルフヘルプ観光客";
Japan[229] = "状況5：一般市民の深さ";
Japan[230] = "旅行前：ルートプランニング（DEHウェブサイト（http://deh.csie.ncku.edu.tw））<br>アトラクションの探索、トラベルライン/風景スポットの設定（LOI / AOI）< （LOI / AOI）<br>エキスパート/プレーヤーの選択風景/風景エリア（LOI / AOI） - 参照専門家/プレーヤーシーン/風景エリア（LOI / AOI）、トラベルランドスケープ/風景エリア（LOI / AOI）の設定 ";
Japan[231] = "旅行：DEHサーバーにアップロードフィールドガイド（DEHミニを使用）フィールドツアー<BR> DEHは、写真、映像と音声録音を利用する<BR>タイムリーな観光名所<BR>先のナビゲーションを<BR>、生産のPOI、";
Japan[232] = "旅行後：旅行の帰りに帰宅した後、DEHのウェブサイト（http://deh.csie.ncku.edu.tw）にアクセスして写真/ビデオ/音声のアップロードを終了します。クラスシステムのPOIとエッセイと景色のよい風景の行 - 友達、家族を共有するFB、ライン、マイクロブログなどに実行する完全な旅行日記 ";

//make poi
// 410 411
Taiwan[410] = "景點製作";
Taiwan[233] = "標題";
Taiwan[234] = "主題";
Taiwan[235] = "請選擇";
Taiwan[236] = "消逝的";
Taiwan[237] = "體驗的";
Taiwan[238] = "活化再造的";
Taiwan[239] = "地區";
Taiwan[240] = "類型";
Taiwan[241] = "自然景觀";
Taiwan[242] = "人文景觀";
Taiwan[243] = "事件";
Taiwan[244] = "人物";
Taiwan[245] = "產業";
Taiwan[246] = "時期";
Taiwan[411] = "史前時期";
Taiwan[247] = "荷西時期";
Taiwan[248] = "明鄭時期";
Taiwan[249] = "清朝時期";
Taiwan[250] = "日本時期";
Taiwan[251] = "現代台灣";
Taiwan[252] = "西元前~0";
Taiwan[253] = "年份";
Taiwan[254] = "關鍵字1";
Taiwan[255] = "(ex:彰化縣鹿港鎮民族路228號)可利用地圖自動取得地址與經緯度(在地圖上按左鍵)";
Taiwan[256] = "緯度:";
Taiwan[257] = "經度:";
Taiwan[258] = "描述";
Taiwan[259] = "範疇";
Taiwan[260] = "古蹟、歷史建築、聚落";
Taiwan[261] = "遺址";
Taiwan[262] = "文化景觀";
Taiwan[263] = "自然景觀";
Taiwan[264] = "民俗及相關文物";
Taiwan[265] = "古物";
Taiwan[266] = "傳統藝術";
Taiwan[267] = "食衣住行育樂";
Taiwan[268] = "其它";
Taiwan[269] = "參考來源";
Taiwan[270] = "參考來源作者";
Taiwan[271] = "參考來源出版者";
Taiwan[272] = "景點製作貢獻者";
Taiwan[273] = "公開";
Taiwan[274] = "不公開";
Taiwan[275] = "上傳語音導覽解說";
Taiwan[276] = "無";
Taiwan[277] = "語音導覽";
Taiwan[278] = "上傳照片/聲音/影片";
Taiwan[279] = "相片";
Taiwan[280] = "影片";
Taiwan[281] = "聲音";
Taiwan[282] = "確認";
Taiwan[283] = "清除";
Taiwan[284] = "Poi 製作需知";
Taiwan[285] = '點設定為<p style="color:#00f; display: inline;">公開</p>時，經驗證通過後可予大眾觀看</p>';
Taiwan[286] = '景點設定為<p style="color:#f00; display: inline;">不公開</p>(私有景點)時，則不驗證</p>';
Taiwan[287] = '<p style="display: inline;"><b>地區</b>與<b>地址</b>需一致</p>';
Taiwan[288] = '<p>按住鍵盤<b>Ctrl</b>同時點選圖片即可選取多張(最多五張)圖片</p>';
Taiwan[289] = '地址';

English[410] = "Create POI";
English[233] = "Title";
English[234] = "Theme";
English[235] = "Please select";
English[236] = "Degraded";
English[237] = "Experienced";
English[238] = "Activated Reconstruction";
English[239] = "Region";
English[240] = "Type";
English[241] = "Natural Landscape";
English[242] = "Human Landscape";
English[243] = "Event";
English[244] = "People";
English[245] = "Industry";
English[246] = "Time";
English[411] = "Prehistoric period";
English[247] = "The Jose Dynasty";
English[248] = "Ming Zheng period";
English[249] = "The Qing Dynasty";
English[250] = "Japan Period";
English[251] = "Modern Taiwan";
English[252] = "BC~0";
English[253] = "Year";
English[254] = "keyword1";
English[255] = "(ex: No. 228, Minzu Road, Lugang Town, Changhua County) You can use the map to automatically obtain the address and latitude and longitude (press the left button on the map)";
English[256] = "latitude:";
English[257] = "Longitude:";
English[258] = "Description";
English[259] = "Scope";
English[260] = "Historical sites, historic buildings, settlements";
English[261] = "The ruins";
English[262] = "Cultural landscape";
English[263] = "Natural Landscape";
English[264] = "People and related cultural relics";
English[265] = "Antiquities";
English[266] = "Traditional Art";
English[267] = "Food and clothing and recreation";
English[268] = "Other";
English[269] = "Reference source";
English[270] = "Reference source author";
English[271] = "Reference Source Publisher";
English[272] = "Contributor to the attraction production";
English[273] = "Public";
English[274] = "Private";
English[275] = "Upload audio guide commentary";
English[276] = "None";
English[277] = "Audio Guide";
English[278] = "Upload Photos/Sounds/Videos";
English[279] = "Photo";
English[280] = "Video";
English[281] = "sound";
English[282] = "Confirm";
English[283] = "Clear";
English[284] = "Poi Production Needs";
English[285] = 'The point is set to <p style="color:#00f; display: inline;">public</p>,<p>which can be viewed by the public after verification.</p>';
English[286] = 'The attraction is set to <p style="color:#f00; display: inline;">Unlisted</p> (private attraction), it is not verified</p>';
English[287] = '<p style="display: inline;"><b>Region</b> needs to be consistent with <b>address</b></p>';
English[288] = '<p>Press and hold <b>Ctrl</b> while clicking the image to select multiple (up to five) images</p>';
English[289] = 'address';

Japan[410] = "アトラクション制作";
Japan[233] = "タイトル";
Japan[234] = "テーマ";
Japan[235] = "選択してください";
Japan[236] = "劣化";
Japan[237] = "経験";
Japan[238] = "活性化された復興";
Japan[239] = "地域";
Japan[240] = "タイプ";
Japan[241] = "自然景観";
Japan[242] = "人間の風景";
Japan[243] = "イベント";
Japan[244] = "人";
Japan[245] = "産業";
Japan[246] = "時間";
Japan[410] = "先史時代";
Japan[247] = "ホセ王朝";
Japan[248] = "明正時代";
Japan[249] = "清朝";
Japan[250] = "日本期";
Japan[251] = "近代台湾";
Japan[252] = "BC〜0";
Japan[253] = "年";
Japan[254] = "キーワード-1";
Japan[255] = "例：Changhua County、Lugang Town、Minzu Road 228番地）マップを使用して、住所と緯度と経度を自動的に取得することができます（マップ上の左ボタンを押してください）。";
Japan[256] = "緯度：";
Japan[257] = "経度：";
Japan[258] = "記述";
Japan[259] = "スコープ";
Japan[260] = "史跡、歴史的建造物、和解";
Japan[261] = "廃墟";
Japan[262] = "文化的景観";
Japan[263] = "自然景観";
Japan[264] = "人々と関連する文化遺産";
Japan[265] = "古美術";
Japan[266] = "伝統芸術";
Japan[267] = "食料と衣類とレクリエーション";
Japan[268] = "その他";
Japan[269] = "参照源";
Japan[270] = "参照元著者";
Japan[271] = "参照元発行者";
Japan[272] = "アトラクション制作の貢献者";
Japan[273] = "public";
Japan[274] = "公開していない";
Japan[275] = "オーディオガイド解説のアップロード";
Japan[276] = "なし";
Japan[277] = "オーディオガイド";
Japan[278] = "写真/サウンド/動画のアップロード";
Japan[279] = "写真";
Japan[280] = "ビデオ";
Japan[281] = "音";
Japan[282] = "確認";
Japan[283] = "クリア";
Japan[284] = "Poi生産ニーズ";
Japan[285] = 'ポイントは<p style = "color：＃00f; display：inline;"> public </p>に設定され、検証後に公開されます。';
Japan[286] = '魅力は<p style = "color：＃f00; display：inline;">非公開</p>（プライベートアトラクション）に設定されています。';
Japan[287] = '<p style = "display：inline;"> <b>地域</ b>は<b>住所< b> </p>と一致する必要があります';
Japan[288] = '<p> <b> Ctrl </b>を押しながら画像をクリックし、複数（最大5枚）の画像を選択します</p>';
Japan[289] = '地址';

// make loi
Taiwan[290] = "景線製作";
Taiwan[291] = "地區";
Taiwan[292] = "請選擇";
Taiwan[293] = "請選擇POI地區";
Taiwan[294] = "標題:";
Taiwan[295] = "描述:";
Taiwan[296] = "景線製作貢獻者:";
Taiwan[297] = "交通工具:";
Taiwan[298] = "開車";
Taiwan[299] = "騎腳踏車";
Taiwan[300] = "走路";
Taiwan[301] = "是否公開:";
Taiwan[302] = "公開";
Taiwan[303] = "不公開";
Taiwan[304] = "確認";
Taiwan[305] = "重選";
Taiwan[306] = "你登入的是玩家角色,製作景線/景區選擇公開時,只能包含公開景點!若要包含不公開景點,請以導覽解說員角色登入;或是刪除不公開景點!!";
Taiwan[307] = "關閉";
Taiwan[308] = "景線之行政區域為第一個景點之所在的行政區域";

English[290] = "Create LOI";
English[291] = "Region";
English[292] = "Please select";
English[293] = "Please select POI area";
English[294] = "Title:";
English[295] = "Description:";
English[296] = "Contributor:";
English[297] = "Transportation:";
English[298] = "Car";
English[299] = "Biking";
English[300] = "Walking";
English[301] = "Privacy:";
English[302] = "Public";
English[303] = "Private";
English[304] = "Confirm";
English[305] = "Re-election";
English[306] = "You are logged in to the player character. When you create a view/view selection, you can only include public attractions! To include unlisted attractions, please log in as a guided commentator; or delete unlisted spots !!";
English[307] = "Close";
English[308] = "The administrative area of the line of sight is the administrative area where the first attraction is located";

Japan[290] = "ラインプロダクションを見る";
Japan[291] = "地域";
Japan[292] = "選択してください";
Japan[293] = "POIエリアを選択してください";
Japan[294] = "タイトル：";
Japan[295] = "記述：";
Japan[296] = "景観生産の貢献者：";
Japan[297] = "交通機関";
Japan[298] = "ドライブ";
Japan[299] = "サイクリング";
Japan[300] = "歩く";
Japan[301] = "あなたは開示していますか？";
Japan[302] = "パブリック";
Japan[303] = "非公開";
Japan[304] = "確認";
Japan[305] = "再選";
Japan[306] = "あなたはプレイヤーキャラクターにログインしています。ビュー/ビュー選択を作成するときは、公開アトラクションのみを含めることができます！リストにないアトラクションを含めるには、ガイド付き解説者としてログインするか、 !! ";
Japan[307] = "閉じる";
Japan[308] = "視線の行政区域は、最初の観光名所がある行政区域です";

//make_aoi
Taiwan[309] = "景區製作";
Taiwan[310] = "地區";
Taiwan[311] = "請選擇";
Taiwan[312] = "請選擇POI地區";
Taiwan[313] = "標題:";
Taiwan[314] = "描述:";
Taiwan[315] = "景區製作貢獻者:";
Taiwan[316] = "交通工具:";
Taiwan[317] = "開車";
Taiwan[318] = "騎腳踏車";
Taiwan[319] = "走路";
Taiwan[320] = "是否公開:";
Taiwan[321] = "公開";
Taiwan[322] = "不公開";
Taiwan[323] = "確認";
Taiwan[324] = "重選";
Taiwan[325] = "你登入的是玩家角色,製作景線/景區選擇公開時,只能包含公開景點!若要包含不公開景點,請以導覽解說員角色登入;或是刪除不公開景點!!";
Taiwan[326] = "關閉";
Taiwan[327] = "景區之行政區域為第一個景點之所在的行政區域";

English[309] = "Create AOI";
English[310] = "Region";
English[311] = "Please select";
English[312] = "Please select POI area";
English[313] = "Title:";
English[314] = "Description:";
English[315] = "Contributor of Scenic Production:";
English[316] = "Transportation:";
English[317] = "Drive";
English[318] = "Biking";
English[319] = "Walking";
English[320] = "Privacy:";
English[321] = "Public";
English[322] = "Not public";
English[323] = "Confirm";
English[324] = "Re-election";
English[325] = "You are logged in to the player character. When you create a view/view selection, you can only include public attractions! To include unlisted attractions, please log in as a guided commentator; or delete unlisted spots !!";
English[326] = "Close";
English[327] = "The administrative area of the scenic spot is the administrative area where the first attraction is located";

Japan[309] = "景観の生産";
Japan[310] = "地域";
Japan[311] = "選択してください";
Japan[312] = "POIエリアを選択してください";
Japan[313] = "タイトル：";
Japan[314] = "記述：";
Japan[315] = "景観の生産者：";
Japan[316] = "交通機関";
Japan[317] = "ドライブ";
Japan[318] = "サイクリング";
Japan[319] = "歩く";
Japan[320] = "あなたは開示していますか？";
Japan[321] = "パブリック";
Japan[322] = "非公開";
Japan[323] = "確認";
Japan[324] = "再選";
Japan[325] = "あなたはプレイヤーキャラクターにログインしています。ビュー/ビュー選択を作成するときは、公開アトラクションのみを含むことができます！リストにないアトラクションを含めるには、ガイド付き解説者としてログインするか、 !! ";
Japan[326] = "閉じる";
Japan[327] = "景勝地の行政区域は、最初の魅力がある行政区です";

//make soi
Taiwan[328] = "主題故事製作";
Taiwan[329] = "地區";
Taiwan[330] = "請選擇";
Taiwan[331] = "請選擇POI地區";
Taiwan[332] = "請選擇LOI地區";
Taiwan[333] = "請選擇AOI地區";
Taiwan[334] = "標題:";
Taiwan[335] = "描述:";
Taiwan[336] = "主題故事製作貢獻者:";
Taiwan[337] = "是否公開:";
Taiwan[338] = "公開";
Taiwan[339] = "不公開";
Taiwan[340] = "確認";
Taiwan[341] = "重選";
Taiwan[342] = "你登入的是玩家角色,製作主題故事選擇公開時,只能包含公開景點/景線/景區!若要包含不公開景點景線/景區,請以導覽解說員角色登入;或是刪除不公開景點/景線/景區!!";
Taiwan[343] = "關閉";
Taiwan[344] = "主題故事之行政區域為第一個景點/景線/景區之所在的行政區域";
Taiwan[345] = "關閉";

English[328] = "Create SOI";
English[329] = "Region";
English[330] = "Please select";
English[331] = "Please select POI area";
English[332] = "Please select LOI area";
English[333] = "Please select the AOI area";
English[334] = "Title:";
English[335] = "Description:";
English[336] = "Thematic story production contributors:";
English[337] = "Privacy:";
English[338] = "Public";
English[339] = "Not public";
English[340] = "Confirm";
English[341] = "Re-election";
English[342] = "You are logged in to the player character. When making a theme story selection, you can only include public attractions/views/scenics! To include undisclosed attractions/scenes, please log in as a guided commentator. Or delete unlisted spots/views/scenics!!";
English[343] = "Close";
English[344] = "The administrative area of the theme story is the administrative area where the first attraction/view/view is located";
English[345] = "Close";

Japan[328] = "テーマのストーリー制作";
Japan[329] = "地域";
Japan[330] = "選択してください";
Japan[331] = "POIエリアを選択してください";
Japan[332] = "LOIエリアを選択してください";
Japan[333] = "AOIエリアを選択してください";
Japan[334] = "タイトル：";
Japan[335] = "記述：";
Japan[336] = "テーマ別ストーリー制作者：";
Japan[337] = "あなたは開示していますか？";
Japan[338] = "パブリック";
Japan[339] = "非公開";
Japan[340] = "確認";
Japan[341] = "再選";
Japan[342] = "あなたはプレイヤーキャラクターにログインしています。テーマストーリーを選択するときには、公共のアトラクション/ビュー/風景のみを含めることができます！ リストにないスポット/ビュー/風光明媚なものを削除してください!! ";
Japan[343] = "閉じる";
Japan[344] = "テーマストーリーの管理領域は、最初のアトラクション/ビュー/ビューが配置されている管理領域です。";
Japan[345] = "閉じる";

//make_group
Taiwan[346] = "建立群組";
Taiwan[347] = "群組名稱:";
Taiwan[348] = "群組描述:";
Taiwan[349] = "是否公開:   ";
Taiwan[350] = "公開";
Taiwan[351] = "不公開";
Taiwan[352] = "確認";
Taiwan[353] = "修正";

English[346] = "Create group";
English[347] = "Group Name:";
English[348] = "Group Description:";
English[349] = "Privacy:";
English[350] = "Public";
English[351] = "Private";
English[352] = "Confirm";
English[353] = "Revision";

Japan[346] = "グループを作成する";
Japan[347] = "グループ名：";
Japan[348] = "グループ説明：";
Japan[349] = "それは公開されていますか？";
Japan[350] = "パブリック";
Japan[351] = "非公開";
Japan[352] = "確認";
Japan[353] = "改訂版";

//edit_poi
Taiwan[354] = "景點編輯";
Taiwan[355] = "無語音導覽檔案";
Taiwan[356] = "允許上傳gif/jpg/png/jpeg格式的圖片，圖片檔案大小不能超過2M(可上傳5張照片)";
Taiwan[357] = "允許上傳amr/3gpp/aac格式的錄音檔，檔案大小不能超過5M";
Taiwan[358] = "允許上傳mp4/avi格式的影片，影片檔案大小不能超過15M";
Taiwan[359] = "無多媒體檔案";
Taiwan[360] = "清除";
Taiwan[361] = "語音導覽";
Taiwan[362] = "刪除";
Taiwan[363] = "圖片";
Taiwan[364] = " 聲音";
Taiwan[365] = " 影片";

English[354] = "Edit POI";
English[355] = "No audio guide file";
English[356] = "Allow uploading of images in gif/jpg/png/jpeg format, the size of the image file cannot exceed 2M (5 photos can be uploaded)";
English[357] = "Allow uploading of recording files in amr/3gpp/aac format, the file size cannot exceed 5M";
English[358] = "Allow uploading of videos in mp4/avi format, the size of the video file cannot exceed 15M";
English[359] = "No multimedia files";
English[360] = "Clear";
English[361] = "Audio Guide";
English[362] = "Delete";
English[363] = "Picture";
English[364] = "Sound";
English[365] = "Video";

Japan[354] = "見どころ編集者";
Japan[355] = "オーディオガイドファイルがありません";
Japan[356] = "gif / jpg / png / jpeg形式の画像のアップロードを許可します。画像ファイルのサイズは2Mを超えることはできません（5枚の写真をアップロードできます）。";
Japan[357] = "amr / 3gpp / aac形式の記録ファイルのアップロードを許可します。ファイルサイズは5Mを超えることはできません。";
Japan[358] = "mp4 / avi形式のビデオのアップロードを許可します。ビデオファイルのサイズは15Mを超えることはできません。";
Japan[359] = "マルチメディアファイルがありません";
Japan[360] = "クリア";
Japan[361] = "オーディオガイド";
Japan[362] = "削除";
Japan[363] = "写真";
Japan[364] = "音";
Japan[365] = "ビデオ";

//edit_loi
Taiwan[366] = "景線編輯";

English[366] = "Edit LOI"

Japan[366] = "LOIを編集する"

//edit_aoi
Taiwan[367] = "景區編輯";

English[367] = "Edit AOI"

Japan[367] = "AOIを編集する"

//edit_soi
Taiwan[368] = "主題故事編輯";

English[368] = "Edit SOI"

Japan[368] = "SOIを編集する"

//manage_group
Taiwan[369] = '群組描述';
Taiwan[370] = "成員";
Taiwan[371] = "歷史紀錄";
Taiwan[372] = "移出";
Taiwan[373] = "修改";
Taiwan[374] = "群組Leader可編輯群組資訊";
Taiwan[375] = "群組Leader還有該製作成員可看到成員製做之不公開之景點/景線/景區/主題故事";
Taiwan[376] = "非群組成員只可看到成員製做之公開且驗證通過之景點/景線/景區/主題故事";
Taiwan[377] = "群組Leader可踢出Member";
Taiwan[378] = "群組Leader/Member可放入自己製做之景點/景線/景區/主題故事";
Taiwan[379] = "群組Leader可修改/移出成員製做之景點/景線/景區/主題故事";
Taiwan[380] = "群組Member退出/被踢出群組後群組內之景點/景線/景區/主題故事仍會存在群組，若刪除後則會消失";
Taiwan[381] = "修改群組資訊";
Taiwan[382] = "公開/不公開";
Taiwan[383] = "公開";
Taiwan[384] = "不公開";
Taiwan[385] = "關閉";
Taiwan[386] = "瀏覽軌跡";
Taiwan[387] = "行動軌跡";
Taiwan[388] = "景點";
Taiwan[389] = "景線";
Taiwan[390] = "景區";
Taiwan[391] = "主題故事";
Taiwan[392] = "查詢";
Taiwan[393] = "時間";
Taiwan[394] = "標題";
Taiwan[395] = "群組景線對照";
Taiwan[396] = "群組"

English[369] = 'Group description';
English[370] = "Member";
English[371] = "History Records";
English[372] = "Remove";
English[373] = "Modify";
English[374] = "Group Leader can edit group information";
English[375] = "The group leader and the production member can see the undisclosed attractions / scenery / scenic / theme stories made by the member system";
English[376] = "Non-group members can only see the attractions and views/views/scenes/topic stories that are made public by the membership system;"
English[377] = "Group Leader can kick out Member";
English[378] = "Group Leader/Member can be put into your own attractions / scenery / scenic / theme story";
English[379] = "Group Leader can modify/remove the membership/view/view/theme story"
English[380] = "The group members will exit/being out of the group and the group/view/view/theme story in the group will still exist in the group, if it is deleted, it will disappear";
English[381] = "Modify group information";
English[382] = "Public/Undisclosed";
English[383] = "Public";
English[384] = "Not public";
English[385] = "Close";
English[386] = "Browsing Track";
English[387] = "Action track";
English[388] = "POI";
English[389] = "LOI";
English[390] = "AOI";
English[391] = "SOI";
English[392] = "Query";
English[393] = "Time";
English[394] = "Title";
English[395] = "Group view control";
English[396] = 'Group';

Japan[369] = "グループの説明";
Japan[370] = "会員";
Japan[371] = "歴史的記録";
Japan[372] = "削除";
Japan[373] = "変更";
Japan[374] = "グループリーダーはグループ情報を編集できます";
Japan[375] = "グループリーダーとプロダクションメンバーは、メンバーシステムによって作成された未公開アトラクション/風景/景色/テーマストーリーを見ることができます。";
Japan[376] = "非グループのメンバーは、会員制で公表されたアトラクションや観賞/風景/話題を見ることができます。";
Japan[377] = "グループリーダーはメンバーを追い出すことができます";
Japan[378] = "グループリーダー/メンバーは自分のアトラクション/風景/景色/テーマストーリーに入れることができます";
Japan[379] = "グループリーダーはメンバーシップ/ビュー/ビュー/テーマストーリーを変更/削除できます"
Japan[380] = "グループのメンバーは退室/グループ外になり、グループ内のグループ/ビュー/ビュー/テーマストーリーはグループに残っていますが、削除された場合は消えます。";
Japan[381] = "グループ情報を変更する";
Japan[382] = "公共/非公開";
Japan[383] = "パブリック";
Japan[384] = "公開しない";
Japan[385] = "閉じる";
Japan[386] = "ブラウズトラック";
Japan[387] = "アクショントラック";
Japan[388] = "POI";
Japan[389] = "LOI";
Japan[390] = "AOI";
Japan[391] = "SOI";
Japan[392] = "クエリ";
Japan[393] = "時間";
Japan[394] = "タイトル";
Japan[395] = "グループビューコントロール";
Japan[396] = "グループ";

// my_history
Taiwan[397] = "歷史記錄";
Taiwan[398] = "瀏覽軌跡";
Taiwan[399] = "行動軌跡";
Taiwan[400] = "<h3>歷史記錄:記錄在SDC-DEH上所瀏覽過的POIs/LOIs/AOIs/SOIs</h3>";
Taiwan[401] = "瀏覽軌跡:在SDC-DEH網頁上所瀏覽過的POIs/LOIs/AOIs/SOIs資訊";
Taiwan[402] = "行動軌跡:在SDC-DEH APPs上所瀏覽過的POIs/LOIs/AOIs/SOIs資訊";
Taiwan[403] = "景點";
Taiwan[404] = "景線";
Taiwan[405] = "景區";
Taiwan[406] = "主題故事";
Taiwan[407] = "查詢";
Taiwan[408] = "時間";
Taiwan[409] = "標題";

English[397] = "History";
English[398] = "Browsing Track";
English[399] = "Action Track";
English[400] = "<h3>History: Record POIs/LOIs/AOIs/SOIs viewed on SDC-DEH</h3>";
English[401] = "Browsing Track: POIs/LOIs/AOIs/SOIs Information Viewed on the SDC-DEH Website";
English[402] = "Action Track: POIs/LOIs/AOIs/SOIs information viewed on SDC-DEH APPs";
English[403] = "POI";
English[404] = "LOI";
English[405] = "AOI";
English[406] = "SOI";
English[407] = "Query";
English[408] = "Time";
English[409] = "Title";

Japan[397] = "歴史";
Japan[398] = "ブラウズトラック";
Japan[399] = "アクショントラック";
Japan[400] = "<h3>歴史：SDC-DEHで見られるPOI / LOI / AOI / SOIの記録</h3>";
Japan[401] = "ブラウズトラック：SDC-DEHウェブサイトで閲覧されたPOI / LOI / AOI / SOI情報";
Japan[402] = "アクショントラック：SDC-DEH APPで見たPOI / LOI / AOI / SOI情報";
Japan[403] = "POI";
Japan[404] = "LOI";
Japan[405] = "AOI";
Japan[406] = "SOI";
Japan[407] = "クエリ";
Japan[408] = "時間";
Japan[409] = "タイトル";

//google_map
Taiwan[415] = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrH6PFm6YsUakE6OxkTi3ekc_bp827osQ&callback=myMap&language=zh-tw&region=zh-tw";
Japan[415] = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrH6PFm6YsUakE6OxkTi3ekc_bp827osQ&callback=myMap&language=ja&region=ja";
English[415] = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrH6PFm6YsUakE6OxkTi3ekc_bp827osQ&callback=myMap&language=en&region=EN";

Taiwan[416] = "植物";
English[416] = "Plants";
Japan[416] = "植物";

Taiwan[417] = "自然景觀";
English[417] = "Natural_landscape";
Japan[417] = "自然景觀";

Taiwan[418] = "植物傳統表演藝術";
English[418] = "Traditional performing arts";
Japan[418] = "傳統表演藝術";

Taiwan[419] = "傳統工藝";
English[419] = "Traditional crafts";
Japan[419] = "傳統工藝";

Taiwan[420] = "口述傳統";
English[420] = "Oral tradition";
Japan[420] = "口述傳統";

Taiwan[421] = "民俗";
English[421] = "Flok";
Japan[421] = "民俗";

Taiwan[422] = "傳統知識與實踐";
English[422] = "Traditional knowledge and practice";
Japan[422] = "傳統知識與實踐";

Taiwan[423] = "一般景觀含建築:人工地景與自然地景";
English[423] = "General landscape including architecture: artificial landscape and natural landscape";
Japan[423] = "一般景觀含建築:人工地景與自然地景";

Taiwan[424] = "動物";
English[424] = "Animals";
Japan[424] = "動物";

Taiwan[425] = "生物";
English[425] = "biological";
Japan[425] = "生物";

Taiwan[426] = "食衣住行育樂";
English[426] = "Food, clothing, live and play";
Japan[426] = "食衣住行育樂";

// intro

Taiwan[427] = "使用手冊";
Japan[427] = "SDCのマニュアル";
English[427] = "The Manual of SDC";

Taiwan[428] = "使用手冊下載";
Japan[428] = "SDCの関連ファイルをダウンロード";
English[428] = "Download The Manual of SDC";

Taiwan[429] = "<li><a class=\"link-2\" href=\"/static/activites/SDC_DEH_網站使用手冊.pptx\">SDC-DEH_網站使用手冊</a></li>\
                <li><a class=\"link-2\" href=\"/static/activites/SDC_DEH_Mini.pptx\">SDC_DEH_Mini</a></li>\
                <li><a class=\"link-2\" href=\"/static/activites/DEH_MAKE_II_使用手冊.pptx\">DEH MAKE II 使用手冊</a></li>";
Japan[429] = "<li><a class=\"link-2\" href=\"/static/activites/SDC_DEH_網站使用手冊.pptx\">SDC-DEH_ウェブサイトマニュアル</a></li>\
            <li><a class=\"link-2\" href=\"/static/activites/SDC_DEH_Mini.pptx\">SDC_DEH_Mini</a></li>\
            <li><a class=\"link-2\" href=\"/static/activites/DEH_MAKE_II_使用手冊.pptx\">DEH MAKE IIユーザーマニュアル</a></li>";
English[429] = "<li><a class=\"link-2\" href=\"/static/activites/SDC_DEH_Website User Manual.pptx\">SDC-DEH_Website User Manual</a></li>\
                <li><a class=\"link-2\" href=\"/static/activites/SDC_DEH_Mini.pptx\">SDC_DEH_Mini</a></li>\
                <li><a class=\"link-2\" href=\"/static/activites/DEH_MAKE_II_User Manual.pptx\">DEH MAKE II User Manual</a></li>";

Taiwan[430] = "<div class=\"col-lg-12\">\
                <h1 id=\"classify\" class=\"page-header\">情境影片</h1>\
                </div>\
                <div class=\"col-lg-12\">\
                <div class=\"panel panel-info\">\
                    <div class=\"panel-heading\">\
                        <h3 id=\"intro_category_header\">使用情境影片</h3>\
                    </div>\
                    <div class=\"panel-body\">\
                        <ul id=\"intro_category_body\">\
                            <li><a class=\"link-2\" href=\"https://www.youtube.com/watch?v=ht5Y4-xPxT4\" target=\"_blank\">文史脈流－踏溯台南之歡樂篇</a></li>\
                            <li><a class=\"link-2\" href=\"https://www.youtube.com/watch?v=yFi8ueKYpC8\" target=\"_blank\">文史脈流－踏溯台南之邂逅篇</a></li>\
                        </ul>\
                    </div>\
                </div>\
            </div>";
Japan[430] =  "<div class=\"col-lg-12\">\
                <h1 id=\"classify\" class=\"page-header\">状況ビデオ</h1>\
                </div>\
                <div class=\"col-lg-12\">\
                <div class=\"panel panel-info\">\
                    <div class=\"panel-heading\">\
                        <h3 id=\"intro_category_header\">シナリオ動画を使用する</h3>\
                    </div>\
                    <div class=\"panel-body\">\
                        <ul id=\"intro_category_body\">\
                            <li><a class=\"link-2\" href=\"https://www.youtube.com/watch?v=ht5Y4-xPxT4\" target=\"_blank\">文芸の歴史-台南をたどる：喜び</a></li>\
                            <li><a class=\"link-2\" href=\"https://www.youtube.com/watch?v=yFi8ueKYpC8\" target=\"_blank\">文学の歴史-台南をたどる：出会い</a></li>\
                        </ul>\
                    </div>\
                </div>\
            </div>";
English[430] = "<div class=\"col-lg-12\">\
                <h1 id=\"classify\" class=\"page-header\">Situational Videos</h1>\
                </div>\
                <div class=\"col-lg-12\">\
                <div class=\"panel panel-info\">\
                    <div class=\"panel-heading\">\
                        <h3 id=\"intro_category_header\">Use scenario videos</h3>\
                    </div>\
                    <div class=\"panel-body\">\
                        <ul id=\"intro_category_body\">\
                            <li><a class=\"link-2\" href=\"https://www.youtube.com/watch?v=ht5Y4-xPxT4\" target=\"_blank\">Literary History-Tracing Tainan: Joy</a></li>\
                            <li><a class=\"link-2\" href=\"https://www.youtube.com/watch?v=yFi8ueKYpC8\" target=\"_blank\">Literary History-Tracing Tainan: Encounters</a></li>\
                        </ul>\
                    </div>\
                </div>\
            </div>";

Taiwan[431] = "<div class=\"col-lg-12\">\
            <h1 id=\"classify\" class=\"page-header\">文化資產行動數位內容分類</h1>\
        </div>\
        <div class=\"col-lg-12\">\
            <div class=\"panel panel-info\">\
                <div class=\"panel-heading\">\
                    <h3 id=\"intro_category_header\">文化資產行動數位內容的型態 (Category)</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul id=\"intro_category_body\">\
                        <li>景點 (Point Of Interest, POI):\
                            <br> 單一的景點介紹,導覽的最基本單位.\
                        </li>\
                        <li> 景線 (Line Of Interest, LOI):\
                            <br>以導覽情境為考量,設計出有地域關聯性的一條導覽景點路線(A sequence of POIs),為一有參訪先後次序規劃的景線.</li>\
                        <li>景區 (Area Of Interest, AOI):\
                            <br> 以一特定區域之文化資產為主軸,設計出有地域關聯性的一組導覽景點區域(A set of POIs),得為一有故事性的景區.\
                        </li>\
                        <li>主題故事/場域(Story/Site of Interest, SOI):\
                            <br>針對一(i)跨越多個時間/空間之相關人/事/物的故事或(ii)某個特定場域之相關人/事/物的故事,設計出的一個包涵許多景點(POIs),景線(LOIs)和景區(AOI)的主題故事；\
                            <br>一個主題故事 (SOI)可由多個(1)景點(POIs),(2)景線(LOIs), (3)景區(AOI), (4)景點(POIs)和景線(LOIs), (5)景點(POIs)和景區(AOI), (6)景線(LOIs)和景區(AOI), 或 (7)景點(POIs),景線(LOIs)和景區(AOI)組成。\
                        </li>\
                    </ul>\
                </div>\
            </div>\
        </div>";
Japan[431] = "<div class = \"col-lg-12\"> \
        <h1 id = \"classify \" class = \"page-header \">文化資産アクションデジタルコンテンツ分類</h1> \
    </div> \
    <div class = \"col-lg-12\"> \
        <div class = \"panel panel-info\"> \
            <div class = \"panel-heading\"> \
                <h3 id = \"intro_category_header\">文化資産アクションデジタルコンテンツタイプ（カテゴリ）</h3> \
            </ div> \
            <div class = \"panel-body\"> \
                <ul id = \"intro_category_body \"> \
                    <li>関心のあるポイント（POI）：\
                        <br>ツアーの最も基本的な単位である、単一のアトラクションの紹介。\
                    </li> \
                    <li>関心のあるライン（LOI）：\
                        <br>ガイドの状況を考慮して、地理的に関連するツアールート（POIのシーケンス）を設計しました。これは、訪問順に計画された景色の良いルートです。</ li> \
                    <li>関心領域（AOI）：\
                        <br>特定の地域の文化財を主軸として、地理的に関連性のあるPOIのセットを設計します。これは、ストーリーのある風光明媚なエリアでなければなりません。\
                    </li> \
                    <li>ストーリー/関心のあるサイト（SOI）：\
                        <br>[ POI）、視線のテーマ別ストーリー（LOI）、景勝地（AOI）; \
                        <br>テーマストーリー（SOI）は、複数の（1）景勝地（POI）、（2）景勝地（LOI）、（3）景勝地（AOI）、（4）景勝地（POI）および景勝地（LOI）で構成できます。 、（5）景勝地（POI）および景勝地（AOI）、（6）景勝地（LOI）および景勝地（AOI）、または（7）景勝地（POI）、景勝地（LOI）および景勝地（AOI）。 \
                    </li> \
                </ul> \
            </div> \
        </div> \
    </div> ";
English[431] = "<div class=\"col-lg-12\">\
            <h1 id=\"classify\" class=\"page-header\">Cultural Asset Action Digital Content Classification</h1>\
        </div>\
        <div class=\"col-lg-12\">\
            <div class=\"panel panel-info\">\
                <div class=\"panel-heading\">\
                    <h3 id=\"intro_category_header\">Cultural asset action digital content type (Category)</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul id=\"intro_category_body\">\
                        <li>Point Of Interest (POI):\
                            <br> A single attraction introduction, the most basic unit of the tour.\
                        </li>\
                        <li>Line Of Interest (LOI):\
                            <br>Taking the guide situation as the consideration, we designed a route of guided scenic spots (A sequence of POIs) with geographical relevance, which is a scenic line planned with the order of visits.</li>\
                        <li>Area Of Interest (AOI):\
                            <br> Taking the cultural assets of a specific area as the main axis, design a set of POIs with geographic relevance, which must be a scenic area with a story.\
                        </li>\
                        <li>Story/Site of Interest (SOI):\
                            <br>It is targeted for related persons, events and objects of a Story/Site in the temporal/spatial axis SOI can contain a number of POIs, LOIs, and/or AOIs. \
                        </li>\
                    </ul>\
                </div>\
            </div>\
        </div>";            

Taiwan[432] = "文化資產行動數位內容的級別 (Class)";
Japan[432] = "文化財アクションのデジタルコンテンツのレベル (Class)";
English[432] = "The level of digital content of cultural assets actions (Class)";

Taiwan[433] = " <ul><li>專家</li><li>玩家</li><li>導覽解說員</li></ul>";
Japan[433] = " <ul><li>エキスパート</li><li>プレイヤー</li><li>ガイド解説者</li></ul>";
English[433] = " <ul><li>Expert</li><li>Player</li><li>Guide commentator</li></ul>";

Taiwan[434]  = "文化資產行動數位內容的語言 (Language)";
Japan[434] = "文化財アクションデジタルコンテンツの言語 (Language)"; 
English[434] = "Language of cultural assets action digital content (Language)";

Taiwan[435] = "<li>中文</li><li>英文</li><li>日文</li>";
Japan[435] = "<li>中国語</li><li>英語</li><li>日本語</li>";
English[435] = "<li>Chinese</li><li>English</li><li>Japanese</li>";

Taiwan[436] = "<div class=\"panel-heading\">\
                    <h3 id=\"intro_region\">中文版文化資產行動數位內容的地區 (Region)</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul id=\"intro_region_body\">\
                        <li>可使用中文製作及導覽全世界國家及地區的景點/景線/景區(手機設定為中文模式)</li>\
                        <li>台灣: 以縣/市-鄉/鎮/區為單位區域</li>\
                        <li>世界各國: 以國家為單位區域</li>\
                    </ul>\
                </div>";
Japan[436] = "<div class = \" panel-heading \"> \
                    <h3 id = \"intro_region \">中国版の文化財アクションデジタルコンテンツの地域（Region）</h3> \
                </div> \
                <div class = \"panel-body\"> \
                    <ul id = \"intro_region_body\"> \
                        <li>中国語を使用して、世界中の国や地域の観光スポット/シーン/風光明媚なエリアを作成および案内できます（電話は中国語モードに設定されています）</li> \
                        <li>台湾：郡/市町区/町/地区を単位面積とする</li> \
                        <li>世界の国：国ベースの地域</li> \
                    </ul> \
                </div> ";
English[436] = "<div class=\"panel-heading\">\
                    <h3 id=\"intro_region\">Region (Region) of the Chinese version of cultural asset action digital content</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul id=\"intro_region_body\">\
                        <li>You can use Chinese to make and guide the sights/scenes/scenic areas of countries and regions around the world (the phone is set to Chinese mode)</li>\
                        <li>Taiwan: County/city-township/town/district as the unit area</li>\
                        <li>Countries in the world: country-based regions</li>\
                    </ul>\
                </div>";
Taiwan[437] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_foreign\">外文版文化資產行動數位內容的地區 (Region)</h3>\
            </div>\
            <div class=\"panel-body\">\
                <ul id=\"intro_foreign_body\">\
                    <li>可使用英/日文製作及導覽全世界國家及地區的景點/景線/景區 (手機設定為英/日文模式)</li>\
                    <li> 英文: 台灣: 以縣/市-鄉/鎮/區為單位區域\
                        <br>世界各國: 以國家為單位區域</li>\
                    <li>日文: 台灣: 以縣/市-鄉/鎮/區為單位區域\
                        <br>日本:</li>\
                </ul>\
            </div>";   
Japan[437] =  "<div class = \"panel-heading\"> \
                <h3 id = \"intro_foreign \">外国語版の文化財がデジタルコンテンツとして機能する地域（Region）</h3> \
            </div> \
            <div class = \"panel-body \"> \
                <ul id = \"intro_foreign_body \"> \
                    <li>英語/日本語を使用して、世界中の国や地域の観光スポット/シーン/風光明媚なエリアを作成し、ガイドすることができます（電話は英語/日本語モードに設定されています）</li> \
                    <li>英語：台湾：county / city-township / town / districtを単位領域として\
                        <br>世界の国々：国を単位面積とする</li> \
                    <li>日本語：台湾：郡/市町村/町/地区を単位面積として\
                        <br>日本：</li> \
                </ul> \
            </div> ";   
English[437] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_foreign\">Region (Region) where foreign language version of cultural assets acts digital content</h3>\
            </div>\
            <div class=\"panel-body\">\
                <ul id=\"intro_foreign_body\">\
                    <li>You can use English/Japanese to make and guide the sights/scenes/scenic areas of countries and regions around the world (the phone is set to English/Japanese mode)</li>\
                    <li> English: Taiwan: Take the county/city-township/town/district as the unit area\
                        <br>Countries in the world: take the country as the unit area</li>\
                    <li>Japanese: Taiwan: Take county/city-township/town/district as the unit area\
                        <br>Japan:</li>\
                </ul>\
            </div>";

Taiwan[438] = "景點(POI)內容分類";
Japan[438] = "アトラクション（POI）コンテンツの分類";
English[438] = "Attractions (POI) content classification";

Taiwan[439] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_format\">景點範疇 (Format)</h3>\
                </div>\
                <div class=\"panel-body\">\
                <ul id=\"intro_format_body\">\
                    <li>古蹟</li>\
                    <li>歷史建築</option>\
                    <li>紀念建築</li>\
                    <li>聚落建築群</li>\
                    <li>考古遺址</li>\
                    <li>史蹟</li>\
                    <li>文化景觀</li>\
                    <li>古物</li>\
                    <li>自然景觀</li>\
                    <li>傳統表演藝術</li>\
                    <li>傳統工藝</li>\
                    <li>口述傳統</li>\
                    <li>民俗</li>\
                    <li>傳統知識與實踐</li>\
                    <li>一般景觀(建築/人工地景/自然地景)</li>\
                    <li>植物</li>\
                    <li>動物</li>\
                    <li>生物</li>\
                    <li>食衣住行育樂</li>\
                    <li>其它</li>\
                </ul>\
                </div>";
Japan[439] =    "<div class=\"panel-heading\">\
                <h3 id=\"intro_format\">アトラクションカテゴリ（フォーマット）</h3>\
                </div>\
                <div class=\"panel-body\">\
                <ul id=\"intro_format_body\">\
                    <li>古跡</ li> \
                    <li>歴史的建造物</ option> \
                    <li>記念館</ li> \
                    <li>集落の建物</ li> \
                    <li>考古学遺跡</ li> \
                    <li>史跡</ li> \
                    <li>文化的景観</ li> \
                    <li>骨董品</ li> \
                    <li>自然景観</ li> \
                    <li>伝統芸能</ li> \
                    <li>伝統工芸品</ li> \
                    <li>口頭伝承</ li> \
                    <li>民俗</ li> \
                    <li>伝統的な知識と実践</ li> \
                    <li>一般的な風景（建築/人工の風景/自然の風景）</ li> \
                    <li>植物</ li> \
                    <li>動物</ li> \
                    <li>生物学</ li> \
                    <li>食料、衣料品、住居、輸送、教育</ li> \
                    <li>その他</ li> \
                </ul>\
                </div>";
English[439] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_format\">Attraction category (Format)</h3>\
                </div>\
                <div class=\"panel-body\">\
                <ul id=\"intro_format_body\">\
                    <li>Monuments</li>\
                    <li>Historic Buildings</option>\
                    <li>Commemorative Buildings</li>\
                    <li>Groups of Buildings</li>\
                    <li>Archaeological Sites</li>\
                    <li>Historic Sites</li>\
                    <li>Cultural Landscapes</li>\
                    <li>Antiquities</li>\
                    <li>Natural Landscapes and Natural Monuments</li>\
                    <li>Traditional Performing Arts</li>\
                    <li>Traditional Craftsmanship</li>\
                    <li>Oral Traditions and Expressions</li>\
                    <li>Folklore</li>\
                    <li>Traditional Knowledge and Practices</li>\
                    <li>General landscape (architecture/artificial landscape/natural landscape)</li>\
                    <li>Plants</li>\
                    <li>Animals</li>\
                    <li>Biology</li>\
                    <li>Food, clothing, housing, transportation and education</li>\
                    <li>Other</li>\
                </ul>\
                </div>";
Taiwan[440] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_media\">景點媒體類別 (Media Type)</h3>\
            </div>\
            <div class=\"panel-body\">\
                <ul id=\"intro_media_body\">\
                    <li>照片 (Picture) + 文字</li>\
                    <li>影片 (Movie) + 文字</li>\
                    <li>聲音 (Audio) + 文字</li>\
                </ul>\
            </div>";
Japan[440] = "<div class = \"panel-heading\"> \
            <h3 id = \"intro_media \">アトラクションメディアタイプ（メディアタイプ）</h3> \
        </div> \
        <div class = \"panel-body\"> \
            <ul id = \"intro_media_body \"> \
                <li>画像+テキスト</li> \
                <li>映画+テキスト</li> \
                <li>オーディオ（オーディオ）+テキスト</li> \
            </ul> \
        </div> ";
English[440] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_media\">Attraction Media Type (Media Type)</h3>\
            </div>\
            <div class=\"panel-body\">\
                <ul id=\"intro_media_body\">\
                    <li>Picture + text</li>\
                    <li>Movie + text</li>\
                    <li>Audio (Audio) + text</li>\
                </ul>\
            </div>";

Taiwan[441] = "<div class=\"panel-heading\">\
            <h3 id=\"poi_audio\">景點語音導覽解說</h3>\
        </div>\
        <div class=\"panel-body\">\
            <ul id=\"poi_audio_body\">\
                <li>景點製作者得附加相關之語音導覽解說，讓使用者可更深入得了解相關景點。</li>\
            </ul>\
        </div>";
Japan[441] = "<div class = \"panel-heading\">\
        <h3 id = \"poi_audio \">アトラクションオーディオガイドの解説</h3> \
    </div> \
    <div class = \"panel-body \"> \
        <ul id = \"poi_audio_body \"> \
            <li>アトラクションの作成者は、関連するオーディオガイドの説明を添付して、ユーザーが関連するアトラクションについてより深く理解できるようにすることができます。 </li> \
        </ul> \
    </div> ";
English[441] = "<div class=\"panel-heading\">\
            <h3 id=\"poi_audio\">Attraction audio guide commentary</h3>\
        </div>\
        <div class=\"panel-body\">\
            <ul id=\"poi_audio_body\">\
                <li>Attraction creators may attach relevant audio guide explanations so that users can have a deeper understanding of relevant attractions. </li>\
            </ul>\
        </div>";

Taiwan[442] = "<div class=\"panel-heading\">\
        <h3 id=\"intro_right\">景點使用權限</h3>\
    </div>\
    <div class=\"panel-body\">\
        <ul id=\"intro_right_body\">\
            <li>公開</li>\
            <li>不公開(私有)</li>\
        </ul>\
    </div>";
Japan[442] = "<div class = \"panel-heading \"> \
    <h3 id = \"intro_right \">アトラクションのアクセス権</h3> \
</div> \
<div class = \"panel-body \"> \
    <ul id = \"intro_right_body \"> \
        <li>公開</li> \
        <li>非公開（非公開）</li> \
    </ul> \
</div> ";
English[442] = "<div class=\"panel-heading\">\
        <h3 id=\"intro_right\">Attraction access rights</h3>\
    </div>\
    <div class=\"panel-body\">\
        <ul id=\"intro_right_body\">\
            <li>Public</li>\
            <li>Unlisted (Private)</li>\
        </ul>\
    </div>";

Taiwan[443]  = "EXTN平台所提供的APP" ;
Japan[443] = "EXTNプラットフォームが提供するAPP";
English[443] = "APP provided by EXTN platform"; 

Taiwan[444] = "<div class=\"col-lg-12\">\
                    <div class=\"panel panel-info\">\
                        <div class=\"panel-heading\">\
                            <h3 class=\"intro_pure\">純導覽</h3>\
                        </div>\
                        <div class=\"panel-body\">\
                            <ul id=\"intro_pure_body\">\
                                <li><strong>SDC-DEH Mini</strong>:<br>\
                                展現附近/我的相片(image)、聲音(audio)和影片(video)景點(POIs)及附近/我的景線(Line Of Interests , LOIs)和景區(Area Of Interests, AOIs);播放景點(POI)內含之語音導覽解說;使用FB, Line及其它工具分享相關景點(POI)。</li>\
                            </ul>\
                        </div>\
                    </div>\
                </div>\
                <div class=\"col-lg-12\">\
                    <div class=\"panel panel-info\">\
                        <div class=\"panel-heading\">\
                            <h3 id=\"intro_pureMake\">純製作POIs</h3>\
                        </div>\
                        <div class=\"panel-body\">\
                            <ul id=\"intro_pureMake_body\">\
                                <li><strong>DEH Make II</strong>:<br>\
                                製作相片(image)、影片(video)和聲音(audio)景點(POI);錄製景點(POI)之相關語音導覽解說;使用FB, Line及其它工具分享製作好之景點(POI)。</li>\
                            </ul>\
                        </div>\
                    </div>\
                </div>";
Japan[444] = "<div class = \" col-lg-12 \"> \
                <div class = \"panel panel-info\"> \
                    <div class = \"panel-heading\"> \
                        <h3 class = \"intro_pure\">純粋なガイド付きツアー</h3> \
                    </div> \
                    <div class = \"panel-body\">\
                        <ul id = \"intro_pure_body\"> \
                            <li> <strong> SDC-DEH Mini </strong>：<br> \
                            近く/私の写真（画像）、音声（オーディオ）、ビデオ（ビデオ）の興味のあるポイント（POI）と近く/私の観光スポット（興味のあるライン、LOI）と観光スポット（興味のあるエリア、AOI）を表示し、アトラクションを再生します（ POI）には音声ガイドの解説が含まれています。FB、Line、その他のツールを使用して、関連するアトラクション（POI）を共有します。 </li> \
                        </ul> \
                    </div> \
                </div> \
            </div> \
            <div class = \"col-lg-12\"> \
                <div class = \"panel panel-info\"> \
                    <div class = \"panel-heading\"> \
                        <h3 id = \"intro_pureMake\"> Pure Make POI </h3> \
                    </div> \
                    <div class = \"panel-body\"> \
                        <ul id = \"intro_pureMake_body\"> \
                            <li> <strong> DEH Make II </strong>：<br> \
                            写真（画像）、ビデオ（動画）、音声（POI）を作成し、観光スポットの関連する音声ガイドの説明を記録します（POI）。FB、ライン、その他のツールを使用して、作成された観光スポット（POI）を共有します。 </li> \
                        </ul> \
                    </div> \
                </div> \
            </div> ";
English[444] = "<div class=\"col-lg-12\">\
                        <div class=\"panel panel-info\">\
                            <div class=\"panel-heading\">\
                                <h3 class=\"intro_pure\">Pure guided tour</h3>\
                            </div>\
                            <div class=\"panel-body\">\
                                <ul id=\"intro_pure_body\">\
                                    <li><strong>SDC-DEH Mini</strong>:<br>\
                                    Show nearby/my photos (image), audio (audio), and video (POIs) and nearby/my sights (Line Of Interests, LOIs) and scenic spots (Area Of Interests, AOIs); play attractions ( POI) contains audio guide commentary; use FB, Line and other tools to share related attractions (POI). </li>\
                                </ul>\
                            </div>\
                        </div>\
                    </div>\
                    <div class=\"col-lg-12\">\
                        <div class=\"panel panel-info\">\
                            <div class=\"panel-heading\">\
                                <h3 id=\"intro_pureMake\">Pure Make POIs</h3>\
                            </div>\
                            <div class=\"panel-body\">\
                                <ul id=\"intro_pureMake_body\">\
                                    <li><strong>DEH Make II</strong>:<br>\
                                    Make photos (image), videos (video) and audio (POI); record the relevant audio guide explanation of the sights (POI); use FB, Line and other tools to share the produced sights (POI). </li>\
                                </ul>\
                            </div>\
                        </div>\
                    </div>";

Taiwan[445] = "<h1 id=\"intro_exp\" class=\"page-header\">平台可能使用對象及情境(不限定,不限制,請使用者發想)</h1>\
                <ul id=\"intro_exp_body\">\
                    <li> 庶民生活圈:<br>\
                    社區發展協會存放其社區文史和自然景觀資料<br>\
                    原住民部落存放其文史紀錄和自然景觀資料</li>\
                    <li>場域:<br>\
                    農/林/漁/牧園區及民宿<br>\
                    自然景觀園區<br>\
                    博物館/文物館文資園區</li>\
                    <li>文史工作者/室:<br>\
                    數位化及存放其在地文史資料</li>\
                    <li>國家公園和國家風景區:<br>\
                    數位化及存放其自然景觀資內容</li>\
                    <li>文化資產導覽解說員</li>\
                    <li>出租車/計程車包車旅遊之司機導覽解說員</li>\
                    <li>傳統文化資產保留與運用:<br>\
                    古蹟<br>\
                    歷史建築<br>\
                    聚落<br>\
                    遺址<br>\
                    文化景觀</li>\
                    <li>學校教育:<br>\
                    高/中/小學數位行動/戶外/鄉土教學<br>\
                    大學文/史/觀光/休憩等學系之台灣古蹟文化資產相關課程<br>\
                    社區大學課程<br>\
                    大學通識課程</li>\
                    <li>普羅大眾深度旅遊日記</li>\
                    <li>場域主題故事</li>\
                </ul>";
Japan[445] = "<h1 id = \"intro_exp\"class = \" page-header \">プラットフォームはオブジェクトとコンテキストを使用できます（制限なし、無制限、ご意見をお寄せください）</h1> \
                <ul id = \"intro_exp_body\"> \
                    <li>一般市民のライフサークル：<br> \
                    コミュニティ開発協会は、コミュニティの文化史と自然景観資料を保管しています<br> \
                    アボリジニの部族は、過去の記録と自然景観データを保存します</ li> \
                    <li>フィールド：<br> \
                    農業/林業/漁業/牧歌的な地域とホームステイ<br> \
                    自然景観公園<br> \
                    博物館/文化博物館文化資源公園</li> \
                    <li>文学および歴史の労働者/部屋：<br> \
                    地域の文化的および歴史的データをデジタル化して保存する</li> \
                    <li>国立公園と国立風光明媚なエリア：<br> \
                    自然の景観コンテンツをデジタル化して保存する</li> \
                    <li>文化財ガイド解説者</li> \
                    <li>タクシー/タクシーチャーターツアーのドライバー向けガイドとコメンテーター</li> \
                    <li>伝統的な文化財の保持と使用：<br> \
                    史跡<br> \
                    歴史的建造物<br> \
                    決済<br> \
                    廃墟<br> \
                    文化的景観</li> \
                    <li>学校教育：<br> \
                    高校/中学校/小学校デジタルアクション/アウトドア/ローカルティーチング<br> \
                    教養学科/歴史/観光/レクリエーションなど、台湾の史跡の文化財に関連するコース<br> \
                    コミュニティカレッジコース<br> \
                    大学一般コース</li> \
                    <li>一般向けの詳細な旅行日記</li> \
                    <li>フィールドテーマストーリー</li> \
                </ul> ";
English[445] = "<h1 id=\"intro_exp\" class=\"page-header\">Platform may use objects and contexts (not limited, unlimited, please send your thoughts)</h1>\
                    <ul id=\"intro_exp_body\">\
                        <li> Common people's life circle:<br>\
                        The Community Development Association stores its community cultural history and natural landscape materials<br>\
                        Aboriginal tribes store their historical records and natural landscape data</li>\
                        <li>Field:<br>\
                        Agriculture/forestry/fishing/pastoral area and homestays<br>\
                        Natural Landscape Park<br>\
                        Museum/Cultural Museum Cultural Resources Park</li>\
                        <li>Literature and History Worker/Room:<br>\
                        Digitize and store its local cultural and historical data</li>\
                        <li>National Parks and National Scenic Areas:<br>\
                        Digitize and store its natural landscape content</li>\
                        <li>Cultural assets guide commentator</li>\
                        <li>Guide and commentator for the driver of a taxi/taxi charter tour</li>\
                        <li>Retention and use of traditional cultural assets:<br>\
                        Historic Site<br>\
                        Historical building<br>\
                        Settlement<br>\
                        Ruins<br>\
                        Cultural landscape</li>\
                        <li>School Education:<br>\
                        High/Middle School/Primary School Digital Action/Outdoor/Local Teaching<br>\
                        Courses related to cultural assets of Taiwan’s historical sites in the Department of Liberal Arts/History/Tourism/Recreation, etc.<br>\
                        Community College Courses<br>\
                        University General Course</li>\
                        <li>General public in-depth travel diary</li>\
                        <li>Field theme story</li>\
                    </ul>";

Taiwan[446] = "平台使用情境列舉";
Japan[446] = "プラットフォーム使用状況の列挙";
English[446] = "List of usage scenario of Platform";

Taiwan[447] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_status1\">情境 1: 社區發展協會/原住民部落導覽/場域/民宿</h3>\
                </div>\
                <div class=\"panel-body\">\
                <ul id=\"intro_status1_body\">\
                    <li> 規劃景區(AOI)及製作景點(POIs):<br>\
                    古蹟,歷史建築,聚落<br>\
                    遺址<br>\
                    文化景觀<br>\
                    自然景觀<br>\
                    民俗及有關文物<br>\
                    消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs<br>\
                    </li>\
                    <li>自製景線(LOIs):<br>\
                    依各個主題特性，規劃及設計出相關之數條景線</li>\
                    <li>現地解說及導覽 - 社區,部落和場域解說員</li>\
                    <li>自助旅遊 – 利用手機或平板電腦之自助解說導覽</li>\
                </ul>\
                </div>";
Japan[447] = "<div class = \" panel-heading \"> \
                <h3 id = \"intro_status1\">シナリオ1：コミュニティ開発協会/先住民族ガイド/サイト/ B＆B </h3> \
                </div> \
                <div class = \"panel-body\"> \
                <ul id = \"intro_status1_body \"> \
                    <li>景勝地（AOI）の計画と生産景勝地（POI）：<br> \
                    記念碑、歴史的建造物、集落<br> \
                    廃墟<br> \
                    文化的景観<br> \
                    自然景観<br> \
                    民間伝承および関連する文化的遺物<br> \
                    消えた/経験された/活性化され、再現された自然の風景/人間の風景/イベント/人々/業界の写真/ビデオ/サウンドとさまざまなPOI <br> \
                    </li> \
                    <li>自家製シーナリーライン（LOI）：<br> \
                    各テーマの特性に応じて、いくつかの関連する風景を計画および設計します</li> \
                    <li>現場での解説とガイド付きツアーコミュニティ、部族、野外解説者</li> \
                    <li>携帯電話またはタブレットを使用したセルフガイドツアー-ガイド付きツアーガイド</li> \
                </ul> \
                </div> ";
English[447] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_status1\">Scenario 1: Community Development Association/Aboriginal Tribe Guide/Site/B&B</h3>\
                </div>\
                <div class=\"panel-body\">\
                <ul id=\"intro_status1_body\">\
                    <li>Planning scenic spots (AOI) and production scenic spots (POIs):<br>\
                    Monuments, historical buildings, settlements<br>\
                    Ruins<br>\
                    Cultural Landscape<br>\
                    Natural landscape<br>\
                    Folklore and related cultural relics<br>\
                    Disappeared/experienced/activated and recreated natural landscapes/human landscapes/events/people/industry photos/videos/sounds and various POIs<br>\
                    </li>\
                    <li>Homemade Scenery Lines (LOIs):<br>\
                    According to the characteristics of each theme, plan and design several related sceneries</li>\
                    <li>On-site commentary and guided tour-community, tribe and field commentator</li>\
                    <li>Self-guided tour-self-guided tour guide using mobile phone or tablet</li>\
                </ul>\
                </div>";

Taiwan[448] = "<div class=\"panel-heading\">\
                    <h3 id=\"intro_status2\">情境2:大/高/中/小學數位行動/戶外/鄉土教學&社區大學在地文化資產課程</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul id=\"intro_status2_body\">\
                        <li>導覽課程一:<br>\
                        現有景點(POIs)=>設製景區(AOI)/景線(LOI)</li>\
                        <li>導覽課程二:<br>\
                        現有景點+老師/學生自製景點(POIs)(導覽前先製)<br>\
                        =>設製景區(AOI)/景線(LOI)</li>\
                        <li>導覽課程三:<br>\
                        現有景點(POIs)=>設製景區(AOI)/景線(LOI)+  老師/學生on-touring時收集內容 (調查,紀錄,照相, 錄影, 錄音)<br>\
                        =>導覽後製作景點(POIs)/景區(AOI)/景線(LOI) (家庭作業)</li>\
                        <li>Pure家庭作業 without現地導覽:<br>\
                        行動數位化在地鄉土文化資產製作景點(POIs)/景區(AOI)/景線(LOI)</li>\
                    </ul>\
                </div>";
Japan[448] = "<div class = \" panel-heading \"> \
                <h3 id = \"intro_status2 \">シナリオ2：ビッグ/ハイ/ミドル/エレメンタリーデジタルアクション/アウトドア/ローカルティーチング＆コミュニティカレッジローカル文化資産コース</h3> \
            </div> \
            <div class = \"panel-body\"> \
                <ul id = \"intro_status2_body\"> \
                    <li>ガイドコース1：<br> \
                    既存の景勝地（POI）=>指定された景勝地（AOI）/景勝地（LOI）</li> \
                    <li>ガイドコース2：<br> \
                    既存のアトラクション+教師/学生が作成したアトラクション（POI）（事前ガイド付きツアー）<br> \
                    =>デザイン風景区（AOI）/景観ライン（LOI）</li> \
                    <li>ガイドコース3：<br> \
                    既存の景勝地（POI）=>指定された景勝地（AOI）/景色のライン（LOI）+オンツーリング中に教師/学生が収集したコンテンツ（調査、記録、写真、ビデオ、オーディオ）<br> \
                    =>観光スポット（POI）/景勝地（AOI）/ツアー後の視線（LOI）（宿題）を作成する</li> \
                    <li>現地ツアーなしの純粋な宿題：<br> \
                    地方および地方の文化財生産スポット（POI）/スポット（AOI）/シーナリーライン（LOI）のアクションのデジタル化</li> \
                </ul> \
            </div> ";
English[448] = "<div class=\"panel-heading\">\
                    <h3 id=\"intro_status2\">Scenario 2: Big/High/Middle/Elementary Digital Action/Outdoor/Local Teaching & Community College Local Cultural Asset Course</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul id=\"intro_status2_body\">\
                        <li>Guide Course One:<br>\
                        Existing Scenic Spots (POIs) => Designated Scenic Spots (AOI) / Scenic Lines (LOI)</li>\
                        <li>Guide Course Two:<br>\
                        Existing attractions + teacher/student-made attractions (POIs) (pre-guided tour)<br>\
                        =>Design Scenic Area (AOI)/Scenery Line (LOI)</li>\
                        <li>Guide Course Three:<br>\
                        Existing Scenic Spots (POIs) => Designated Scenic Spots (AOI)/Lines of Scenery (LOI) + Content collected by teachers/students during on-touring (survey, record, photograph, video, audio)<br>\
                        =>Make scenic spots (POIs) / scenic spots (AOI) / sight lines (LOI) after the tour (homework)</li>\
                        <li>Pure homework without local tour:<br>\
                        Action digitization of local and rural cultural assets production scenic spots (POIs) / scenic spots (AOI) / scenery lines (LOI)</li>\
                    </ul>\
                </div>";

Taiwan[449] = "<div class=\"panel-heading\">\
                <h3 id=\"intro_status3\">情境3:行動文化資產導覽解說員</h3>\
                </div>\
                <div class=\"panel-body\">\
                <ul id=\"intro_status3_body\">\
                    <li>古蹟,歷史建築,聚落<br>\
                    遺址<br>\
                    文化景觀<br>\
                    自然景觀<br>\
                    民俗及有關文物<br>\
                    消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs</li>\
                    <li>公開景點及私房景點</li>\
                    <li>設計各類景線(LOIs) for 不同類之旅由個人或團體:<br>\
                    公開景線及私房景線</li>\
                    <li>現地解說及導覽</li>\
                    <li>可以一(或多)個旗艦(Flag-Ship)景點搭配周邊其它景點組成各類景線(LOI)和景區(AOI)</li>\
                    <li>可為解說員/場域廣告行銷之方法:<br>\
                    網路廣告 (藉由FB):全由公開景點組成<br>\
                    實際導覽:含一些公開景點及一些不公開之私房景點 (自己開發出私藏景點)</li>\
                    <li>分成春夏秋冬4種POIs/LOIs/AOIs</li>\
                    <li>每年更新內容:<br>\
                    同樣的場域: 不同的人/事/物<br>\
                    開發不同的場域:不同的人/事/地/物<br>\
                    去年的私房景點變成今年自己或他人的公開景點<br>\
                    今年再開發自己的不公開之私房景點<br>\
                    </li>\
                </ul>\
                </div>";

Japan[449] =   "<div class = \" panel-heading \"> \
                <h3 id = \"intro_status3 \">シナリオ3：アクション文化資産ガイドコメンテーター</h3> \
                </div> \
                <div class = \"panel-body \"> \
                <ul id = \"intro_status3_body\"> \
                    <li>史跡、歴史的建造物、集落<br> \
                    廃墟<br> \
                    文化的景観<br> \
                    自然景観<br> \
                    民間伝承および関連する文化的遺物<br> \
                    消えた、経験された、活性化された、再現された自然の風景/人間の風景/イベント/人々/業界の写真/ビデオ/サウンドとさまざまなPOI </li> \
                    <li>公共および民間のアトラクション</li> \
                    <li>個人またはグループによるさまざまなタイプのツアーのさまざまなLOIを設計する：<br> \
                    パブリックビューラインとプライベートハウスビューライン</li> \
                    <li>オンサイト解説とガイド付きツアー</ li> \
                    <li> 1つ以上の旗艦アトラクションを他の周囲のアトラクションと組み合わせて、さまざまな視線（LOI）と景勝地（AOI）を形成できます</ li> \
                    <li>ナレーター/サイト広告のマーケティング手法：<br> \
                    オンライン広告（FB経由）：すべてが公共のアトラクションで構成されています<br> \
                    実際のガイド：いくつかの公共のアトラクションといくつかの非公開のプライベートアトラクション（開発されたプライベートアトラクション）を含む</ li> \
                    <li>春、夏、秋、冬の4種類のPOI / LOI / AOIに分類</ li> \
                    <li>毎年コンテンツを更新する：<br> \
                    同じフィールド：さまざまな人/物/物<br> \
                    さまざまな分野を開発する：さまざまな人/物/場所/オブジェクト<br> \
                    昨年のプライベートアトラクションは、今年、自分や他の人にとってパブリックアトラクションになりました<br> \
                    今年は自分だけの民家アトラクションを開発します<br> \
                    </ li> \
                </ ul> \
                </ div> ";           
English[449] =  "<div class=\"panel-heading\">\
                    <h3 id=\"intro_status3\">Scenario 3: Action cultural assets guide commentator</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul id=\"intro_status3_body\">\
                        <li>Historic sites, historical buildings, settlements<br>\
                        Ruins<br>\
                        Cultural Landscape<br>\
                        Natural landscape<br>\
                        Folklore and related cultural relics<br>\
                        Disappeared/experienced/activated and recreated natural landscapes/human landscapes/events/people/industry photos/videos/sounds and various POIs</li>\
                        <li>Public and private attractions</li>\
                        <li>Design various LOIs for different types of tours by individuals or groups:<br>\
                        Public view line and private house view line</li>\
                        <li>On-site commentary and guided tour</li>\
                        <li>One (or more) Flag-Ship attractions can be combined with other surrounding attractions to form various sight lines (LOI) and scenic spots (AOI)</li>\
                        <li>A marketing method for the narrator/site advertising:<br>\
                        Online advertising (via FB): all composed of public attractions<br>\
                        Actual guide: Including some public attractions and some undisclosed private attractions (developed private attractions)</li>\
                        <li>Divided into 4 types of POIs/LOIs/AOIs in spring, summer, autumn and winter</li>\
                        <li>Update content every year:<br>\
                        Same field: different people/things/things<br>\
                        Develop different fields: different people/things/places/objects<br>\
                        Last year’s private attractions became public attractions for yourself or others this year<br>\
                        This year, I will develop my own private private house attraction<br>\
                        </li>\
                    </ul>\
                </div>";

Taiwan[450] =  "<div class=\"panel-heading\">\
                    <h3 id=\"intro_status4\">情境4: 文史工作者/室</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul id=\"intro_status4_body\">\
                        <li>依擁有之文史資料及知識擇定目標文化資產景區(AOI)及製作景點(POIs):<br>\
                        古蹟,歷史建築,聚落<br>\
                        遺址<br>\
                        文化景觀<br>\
                        自然景觀<br>\
                        民俗及有關文物<br>\
                        消逝的/體驗的/活化與再造的自然景觀/人文景觀/事件/人物/產業之相片/影片/聲音各類POIs<br>\
                        </li>\
                        <li>設計各類主題景線(LOIs)</li>\
                        <li>目的:<br>\
                        文化資產保留及傳習<br>\
                        現地解說及導覽<br>\
                        來訪之自助旅遊人士</li>\
                    </ul>\
                </div>";
Japan[450] =   "<div class = \" panel-heading \"> \
                 <h3 id = \"intro_status4 \">シナリオ4：文学と歴史の労働者/部屋</h3> \
                </div> \
                <div class = \"panel-body \"> \
                    <ul id = \"intro_status4_body\"> \
                        <li>次のような過去のデータと知識に基づいて、対象の文化財の景勝地（AOI）と生産の景勝地（POI）を選択します。<br> \
                        記念碑、歴史的建造物、集落<br> \
                        廃墟<br> \
                        文化的景観<br> \
                        自然景観<br> \
                        民間伝承および関連する文化的遺物<br> \
                        消えた/経験された/活性化され、再現された自然の風景/人間の風景/イベント/人々/業界の写真/ビデオ/サウンドとさまざまなPOI <br> \
                        </li> \
                        <li>あらゆる種類のテーマシーナリーライン（LOI）を設計する</li> \
                        <li>目的：<br> \
                        文化財の保存と譲渡<br> \
                        ローカル解説とガイド付きツアー<br> \
                        セルフヘルプの観光客が訪れる</ li> \
                    </ul> \
                </div> ";              
English[450] =  "<div class=\"panel-heading\">\
                <h3 id=\"intro_status4\">Scenario 4: Literature and History Worker/Room</h3>\
                </div>\
                <div class=\"panel-body\">\
                <ul id=\"intro_status4_body\">\
                    <li>Select target cultural asset scenic spots (AOI) and production scenic spots (POIs) based on the historical data and knowledge you have:<br>\
                    Monuments, historical buildings, settlements<br>\
                    Ruins<br>\
                    Cultural Landscape<br>\
                    Natural landscape<br>\
                    Folklore and related cultural relics<br>\
                    Disappeared/experienced/activated and recreated natural landscapes/human landscapes/events/people/industry photos/videos/sounds and various POIs<br>\
                    </li>\
                    <li>Design all kinds of theme scenery lines (LOIs)</li>\
                    <li>Purpose:<br>\
                    Cultural asset preservation and transfer<br>\
                    Local commentary and guided tour<br>\
                    Self-help tourists visiting</li>\
                </ul>\
                </div>";

Taiwan[451] =   "<div class=\"panel-heading\">\
                    <h3>情境5:普羅大眾深度旅遊</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul>\
                        <li> 旅行前:路線規劃(在DEH web site(http://deh.csie.ncku.edu.tw)<br>\
                        搜尋景點, 建立旅遊景線/景區 (LOI /AOI)<br>\
                        選擇專家或玩家景線/景區(LOI /AOI)<br>\
                        參考專家或玩家景線/景區(LOI /AOI),建立旅遊景線/景區 (LOI /AOI)</li>\
                        <li>旅行中:實地導覽(使用DEH Mini II)<br>\
                        及時景點介紹<br>\
                        目的地導航<br>\
                        實地導覽<br>\
                        使用DEH Make II照相,錄影,及錄音,製作POIs,上傳至DEH server</li>\
                        <li>旅行後:<br>\
                        在回程的車上或回家後, 到DEH web site(http://deh.csie.ncku.edu.tw) 整理完成上傳之相片/影片/聲音各類POIs<br>\
                        撰製景區和景線<br>\
                        完成旅遊日記, 放送至FB, Line, 微博, etc.,分享親朋好友 </li>\
                    </ul>\
                </div>";
Japan[451] =   "<div class = \" panel-heading \"> \
                    <h3>シナリオ5：一般的な公共の詳細な観光</h3> \
                </div> \
                <div class = \"panel-body \"> \
                    <ul> \
                        <li>旅行前：ルート計画（DEH Webサイト（http://deh.csie.ncku.edu.tw）で）<br> \
                        景勝地を検索し、観光スポット/景勝地を確立する（LOI / AOI）<br> \
                        エキスパートまたはプレーヤーの視線/景観エリア（LOI / AOI）を選択します<br> \
                        専門家またはプレーヤーの視線/景観エリア（LOI / AOI）を参照して、観光客の視線/景観エリア（LOI / AOI）を確立する</li> \
                        <li>旅行：フィールドツアー（DEH Mini IIを使用）<br> \
                        アトラクションへのタイムリーな紹介<br> \
                        目的地のナビゲーション<br> \
                        フィールドツアー<br> \
                        DEH Make IIを使用して写真、ビデオ、オーディオを撮り、POIを作成してDEHサーバーにアップロードする</li> \
                        <li>旅行後：<br> \
                        帰路または帰国後、DEH Webサイト（http://deh.csie.ncku.edu.tw）にアクセスして、アップロードされた写真/ビデオ/サウンドおよびさまざまなPOIを整理します<br> \
                        景勝地と景勝地を作成する<br> \
                        旅行日記を完成させ、FB、Line、Weiboなどに投稿し、友人や家族と共有してください</li> \
                    </ul> \
                </div> ";
English[451] =  "<div class=\"panel-heading\">\
                    <h3>Scenario 5: General public in-depth tourism</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul>\
                        <li> Before traveling: Route planning (on DEH web site(http://deh.csie.ncku.edu.tw)<br>\
                        Search for scenic spots and establish tourist attractions/scenic spots (LOI /AOI)<br>\
                        Select expert or player line of sight/scenic area (LOI /AOI)<br>\
                        Refer to the expert or player's sight line/scenic area (LOI /AOI) to establish a tourist sight line/scenic area (LOI /AOI)</li>\
                        <li>Traveling: Field Tour (using DEH Mini II)<br>\
                        Timely introduction to attractions<br>\
                        Destination navigation<br>\
                        Field tour<br>\
                        Use DEH Make II to take photos, videos, and audios, make POIs, and upload them to DEH server</li>\
                        <li>After the trip:<br>\
                        On the return car or after returning home, go to the DEH web site (http://deh.csie.ncku.edu.tw) to organize the uploaded photos/videos/sounds and various POIs<br>\
                        Compose scenic spots and scenic lines<br>\
                        Complete the travel diary, post it to FB, Line, Weibo, etc., share with friends and family </li>\
                    </ul>\
                </div>";

Taiwan[452] =   "<div class=\"panel-heading\">\
                    <h3>情境6:場域主題故事</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul>\
                        <li>目的:<br>\
                            打造及行銷特定場域，活動或故事\
                        </li>\
                        <li>原則:<br>\
                            依場域之實際或傳說的在地人物/事件/景觀/產業, 選定目標國內/外目標人士,打造主題場域或故事 (Site/Story Of Interest, SOI)<br>\
                        </li>\
                        <li>內容:<br>\
                            撰寫主題故內容(SOI);設計及規劃景線(LOIs)和景區(AOIs);製作景點(POIs)。<br>\
                        </li>\
                        <li>目標:<br>\
                            保留及宣傳在地文化資產;增加導覽解說員之工作機會及收入;提升在地產業、增加/創造在地工作機會。\
                        </li>\
                    </ul>\
                </div>";
Japan[452] =    "<div class = \"panel-heading\"> \
                <h3>シナリオ6：フィールドテーマストーリー</ h3> \
                </div> \
                <div class = \"panel-body \"> \
                <ul> \
                    <li>目的：<br> \
                        特定のフィールド、イベント、またはストーリーを作成して販売する\
                    </li> \
                    <li>原則：<br> \
                        フィールドの実際または伝説的な地元のキャラクター/イベント/風景/産業に従って、テーマのフィールドまたはストーリー（サイト/興味の対象、SOI）を作成するターゲットの国内/外国のターゲットの人々を選択します<br> \
                    </li> \
                    <li>コンテンツ：<br> \
                        テーマとコンテンツ（SOI）を記述し、視線（LOI）と景勝地（AOI）を設計および計画し、景勝地（POI）を作成します。 <br> \
                    </li> \
                    <li>目標：<br> \
                        地元の文化資産を維持および促進し、ガイドとコメンテーターの雇用機会と収入を増やし、地元産業を強化し、地元の雇用機会を増やし/創出します。 \
                    </li> \
                </ul> \
                </div> ";
English[452] =  "<div class=\"panel-heading\">\
                    <h3>Scenario 6: Field theme story</h3>\
                </div>\
                <div class=\"panel-body\">\
                    <ul>\
                        <li>Purpose:<br>\
                            Create and market a specific field, event or story\
                        </li>\
                        <li>Principle:<br>\
                            According to the actual or legendary local characters/events/landscapes/industry of the field, select the target domestic/foreign target people to create themed field or story (Site/Story Of Interest, SOI)<br>\
                        </li>\
                        <li>Content:<br>\
                            Write the theme and content (SOI); design and plan the sight lines (LOIs) and scenic spots (AOIs); make scenic spots (POIs). <br>\
                        </li>\
                        <li>Goal:<br>\
                            Retain and promote local cultural assets; increase the job opportunities and income of guides and commentators; enhance the local industry and increase/create local job opportunities. \
                        </li>\
                    </ul>\
                </div>";

Taiwan[453] = "<div class=\"col-lg-12\">\
               <h2 class=\"page-header\">APP 下載</h2>\
                </div>\
                <div class=\"col-md-12\">\
                <img class=\"android-1\" src=\"/static/images/android.png\">\
                <ul class=\"android-app-1\">\
                    <li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=com.mmlab.zzjh_deh\">在Google Play上取得SDC-DEH Mini (景點導覽)</a></li>\
                    <li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=edu.deh.make_II\">在Google Play上取得DEH Make II (景點製作)</a></li>\
                </ul>\
                <br>\
                <img class=\"apple-1\" src=\"/static/images/apple.png\">\
                <ul class=\"ios-app-1\">\
                    <li><a class=\"link-1\" href=\"https://apps.apple.com/tw/app/sdc-deh/id1501458139\">在Apple Store上取得SDC-DEH Mini (景點導覽)</a></li>\
                    <li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-make-ii/id1324053125?mt=8\">在Apple Store上取得DEH Make II (景點製作)</a></li>\
                </ul>\
                </div>";
Japan[453] = "<div class=\"col-lg-12\">\
            <h2 class=\"page-header\">APP 下載</h2>\
            </div>\
            <div class=\"col-md-12\">\
            <img class=\"android-1\" src=\"/static/images/android.png\">\
            <ul class=\"android-app-1\">\
                <li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=com.mmlab.zzjh_deh\">在Google Play上取得SDC-DEH Mini(景點導覽)</a></li>\
                <li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=edu.deh.make_II\">在Google Play上取得DEH Make II(景點製作)</a></li>\
            </ul>\
            <br>\
            <img class=\"apple-1\" src=\"/static/images/apple.png\">\
            <ul class=\"ios-app-1\">\
                <li><a class=\"link-1\" href=\"https://apps.apple.com/tw/app/sdc-deh/id1501458139\">在Apple Store上取得SDC-DEH Mini(景點導覽)</a></li>\
                <li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-make-ii/id1324053125?mt=8\">在Apple Store上取得DEH Make II(景點製作)</a></li>\
            </ul>\
            </div>";
English[453] = "<div class=\"col-lg-12\">\
                <h2 class=\"page-header\">APP download</h2>\
                </div>\
                <div class=\"col-md-12\">\
                <img class=\"android-1\" src=\"/static/images/android.png\">\
                <ul class=\"android-app-1\">\
                    <li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=com.mmlab.zzjh_deh\">Get SDC on Google Play -DEH Mini (tour of attractions)</a></li>\
                    <li><a class=\"link-1\" href=\"https://play.google.com/store/apps/details?id=edu.deh.make_II\">Get DEH on Google Play Make II (making of scenic spots)</a></li>\
                </ul>\
                <br>\
                <img class=\"apple-1\" src=\"/static/images/apple.png\">\
                <ul class=\"ios-app-1\">\
                    <li><a class=\"link-1\" href=\"https://apps.apple.com/tw/app/sdc-deh/id1501458139\">Get SDC-DEH Mini( Attractions Guide)</a></li>\
                    <li><a class=\"link-1\" href=\"https://itunes.apple.com/tw/app/deh-make-ii/id1324053125?mt=8\">On the Apple Store Get DEH Make II (scenery making)</a></li>\
                </ul>\
                </div>";
Taiwan[454] = "關鍵字2";
English[454] = "keyword2";
Japan[454] = "キーワード-2";

Taiwan[455] = "關鍵字3";
English[455] = "keyword3";
Japan[455] = "キーワード-3";

Taiwan[456] = "關鍵字4";
English[456] = "keyword4";
Japan[456] = "キーワード-4";

Taiwan[457] = "關鍵字5";
English[457] = "keyword5";
Japan[457] = "キーワード-5";



function chg_lan(lan_index) {
    var myLangArray;
    switch (lan_index) {
        //必須要有language.js才行
        case "中文":
            myLangArray = Taiwan;
            break;
        case "英文":
            myLangArray = English;
            break;
        case "日文":
            myLangArray = Japan;
            break;
        default: //taiwan
            myLangArray = Taiwan;
            break;
    }
    try { // index
        $("#sdc").html('<a id="sdc" href="http://exptainan.liberal.ncku.edu.tw/index.php?lang=cht&task=home/">' + myLangArray[0] + '</a>' + myLangArray[1]);
        $("#more").text(myLangArray[2]);
        $("#map").text(myLangArray[3]);
        $("#poi").text(myLangArray[4]);
        $("#loi").text(myLangArray[5]);
        $("#aoi").text(myLangArray[6]);
        $("#soi").text(myLangArray[7]);
        $("#view").text(myLangArray[8]);
        $("#makeplayer").text(myLangArray[9]);
        $("#makeplayer-1").text(myLangArray[10]);
        $("#makeplayer-2").text(myLangArray[11]);
        $("#makeplayer-3").text(myLangArray[12]);
        $("#makeplayer-4").text(myLangArray[500]);
        $("#create").text(myLangArray[13]);
        $("#listgroup").text(myLangArray[14]);
        $("#listgroup-1").text(myLangArray[15]);
        $("#listgroup-2").text(myLangArray[16]);
        $("#listgroup-3").text(myLangArray[17]);
        $("#gogroup").text(myLangArray[18]);
        $("#contact").text(myLangArray[412]);
    }
    catch (err) {
        //console.log(err);
    }
    // intro
    try {
        $("#classify").text(myLangArray[427]);
        $("#intro_category_header").text(myLangArray[428]);
        document.getElementById('intro_category_body').innerHTML = myLangArray[429];
        document.getElementById('extn-video').innerHTML = myLangArray[430];
        document.getElementById('intro_category').innerHTML = myLangArray[431];
        document.getElementById('Title_class').innerHTML = myLangArray[432];
        document.getElementById('Content_class').innerHTML = myLangArray[433];
        document.getElementById('intro_Lang').innerHTML = myLangArray[434];
        document.getElementById('intro_Lang_body').innerHTML = myLangArray[435];
        document.getElementById('Region_info').innerHTML = myLangArray[436];
        document.getElementById('Region_info_2').innerHTML = myLangArray[437];
        document.getElementById('poi_class').innerHTML = myLangArray[438];
        document.getElementById('Format_info').innerHTML = myLangArray[439];
        document.getElementById('Media_Type_info').innerHTML = myLangArray[440];
        document.getElementById('Guide_info').innerHTML = myLangArray[441];
        document.getElementById('Permission_info').innerHTML = myLangArray[442];
        document.getElementById('intro_dehApp').innerHTML = myLangArray[443];
        document.getElementById('android_app').innerHTML = myLangArray[444]; //** */
        document.getElementById('use_scenario').innerHTML = myLangArray[445];
        document.getElementById('intro_status').innerHTML = myLangArray[446];
        document.getElementById('intro_status1_info').innerHTML = myLangArray[447];
        document.getElementById('intro_status2_info').innerHTML = myLangArray[448];
        document.getElementById('intro_status3_info').innerHTML = myLangArray[449];
        document.getElementById('intro_status4_info').innerHTML = myLangArray[450];
        document.getElementById('Platform_use_scenario5').innerHTML = myLangArray[451];
        document.getElementById('Platform_use_scenario6').innerHTML = myLangArray[452];
        document.getElementById('app_download').innerHTML = myLangArray[453];
    
    }
    catch(err){
        //console.log(err)
    }
    try { // navbar
        $("#user").text(myLangArray[19]);
        $("#Expert").text(myLangArray[20]);
        $("#Narrator").text(myLangArray[21]);
        $("#logout-1").html('<a href="/' + COINAME + '/logout" onclick="return confirm()" id="logout-1">' + myLangArray[23]);
        $("#login").text(myLangArray[24]);
        $("#home").text(myLangArray[25]);
        $("#guideMap").text(myLangArray[26]);
        $("#createSpace").text(myLangArray[27]);
        $("#group").text(myLangArray[28]);
        $("#useinfo").text(myLangArray[29]);
        $("#lan").text(myLangArray[30]);
        $("#DEH").text(myLangArray[414]);
        $("#history").text(myLangArray[397]);
        $("#contactInfo").text(myLangArray[413]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // listpoint
        $("#list_poi").text(myLangArray[31]);
        $("#list_loi").text(myLangArray[32]);
        $("#list_aoi").text(myLangArray[33]);
        $("#list_soi").text(myLangArray[34]);
        $("#myPOI").text(myLangArray[35]);
        $("#exp_poi").text(myLangArray[36]);
        $("#make_poi").text(myLangArray[37]);
        $(".Unverified").text(myLangArray[38]);
        $(".verified").text(myLangArray[39]);
        $(".Verification_Failed").text(myLangArray[40]);
        $(".public-2").text(myLangArray[41]);
        $(".private").text(myLangArray[42]);
        $("#img").text(myLangArray[43]);
        $("#audio").text(myLangArray[44]);
        $("#video").text(myLangArray[45]);
        $("#none_file").text(myLangArray[46]);
        $(".joinGroup").text(myLangArray[47]);
        $("#delete").text(myLangArray[48]);
        $("#edit").text(myLangArray[49]);
        $("#myLOI").text(myLangArray[50]);
        $("#exp_loi").text(myLangArray[51]);
        $("#make_loi").text(myLangArray[52]);
        $("#myAOI").text(myLangArray[53]);
        $("#exp_aoi").text(myLangArray[54]);
        $("#make_aoi").text(myLangArray[55]);
        $("#mySOI").text(myLangArray[56]);
        $("#exp_soi").text(myLangArray[57]);
        $("#make_soi").text(myLangArray[58]);
        $("#make_player_join").text(myLangArray[59]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // list_group
        var notice = $("#btnGroupDrop1 > span").html();
        $("#btnGroupDrop1").html(myLangArray[60] + '  ' + '<span class="badge">' + notice + '</span>');
        // $("p[name = apply_group]").each(function (index) {
        //     var sender_name = $('input[name = group_username_hidden]').val() + " ";
        //     var group_name = " " + $(this).siblings('input[name = group_groupname_hidden]').val();
        //     $(this).html(sender_name + myLangArray[61] + group_name);
        // });
        $('.group_agree').text(myLangArray[62]);
        $('.group_refuse').text(myLangArray[63]);

        $('.group_confirm').text(myLangArray[65]);
        // $("p[name = invite]").each(function (index) {
        //     var sender_name = $(".sender_user_name").val() + " ";
        //     var group_name = " " + $(".sender_group_name").val();
        //     console.log(sender_name);
        //     $(this).html(sender_name + myLangArray[66] + group_name);
        // });
        $('.group_joint').text(myLangArray[67]);

        $('#no_msg').text(myLangArray[69]);
        $("#group_search").html('<span class="glyphicon glyphicon-search"></span> ' + myLangArray[70]);
        $("#myGOI").text(myLangArray[71]);
        $("#make_group").text(myLangArray[72]);
        $(".group_invite").html('<span class="glyphicon glyphicon-user"></span>' + ' ' + myLangArray[73]);
        $(".group_dismiss").text(myLangArray[74]);
        $(".group_management").text(myLangArray[75]);
        $(".group_quit").text(myLangArray[76]);
        $(".group_view").text(myLangArray[77]);
        $("#apply_join").text(myLangArray[78]);
        $("#send_invite").text(myLangArray[79]);
        $("#group_modal-1").children().each(function (index) {
            $(this).text(myLangArray[80 + index]);
        });
        $("#close_info").text(myLangArray[86]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // map
        $("#guide_map").text(myLangArray[87]);
        
        document.getElementById('Map_role-1').innerHTML = myLangArray[88];
        document.getElementById('Category-1').innerHTML = myLangArray[89];
        document.getElementById('Region-1').innerHTML = myLangArray[90];
        document.getElementById('Type-1').innerHTML = myLangArray[92];
        document.getElementById('Format-1').innerHTML = myLangArray[93];
        document.getElementById('Media Type-1').innerHTML = myLangArray[94];
        
        /*$("#heading").children().each(function (index) {
             
            if (index < 7){
                console.log(index);
                $(this).text(myLangArray[88 + index]);
            }
            
        });*/

        $("#map_role").children().each(function (index) {
            $(this).text(myLangArray[95 + index - 1]);
        });

        $("#content").children().each(function (index) {
            $(this).text(myLangArray[98 + index - 1]);
        });

        $(".all").text(myLangArray[102]);

        $("#topic").children().each(function (index) {
            if (index > 0) {
                $(this).text(myLangArray[103 + index - 1]);
            }            
        });        

        $("#type").children().each(function(index){
            if (index > 0) {
                $(this).text(myLangArray[106 + index -1]);
            }            
        });

        $("#category").children().each(function (index) { 
            
            if (index < 7 && index > 0) { 
            //console.log(index);
                $(this).text(myLangArray[111 + index - 1]);
            } 
            
        });        

        $("#medias").children().each(function (index) {
            if (index > 0) {
                $(this).text(myLangArray[119 + index - 1]);
            }            
        });

        $("#poi_show-1").text(myLangArray[123]);
        $("#loi_show-1").text(myLangArray[124]);
        $("#aoi_show-1").text(myLangArray[125]);
        $("#soi_show-1").text(myLangArray[126]);
    }
    catch (err) {
        // console.log(err);
    }



    // try { // intro
    //     $("#intro_header1").text(myLangArray[127]);
    //     $("#classify").text(myLangArray[128]);
    //     $("#intro_category_header").text(myLangArray[129]);

    //     $("#intro_category_body").children().each(function (index) {
    //         $(this).html(myLangArray[130 + index]);
    //     });
    //     $("#intro_class").text(myLangArray[134]);
    //     $("#intro_class_body").children().each(function (index) {
    //         $(this).text(myLangArray[135 + index]);
    //     });
    //     $("#intro_Lang").text(myLangArray[138]);
    //     $("#intro_Lang_body").children().each(function (index) {
    //         $(this).text(myLangArray[139 + index]);
    //     });
    //     $("#intro_region").text(myLangArray[142]);
    //     $("#intro_region_body").children().each(function (index) {
    //         $(this).text(myLangArray[143 + index]);
    //     });
    //     $("#intro_foreign").text(myLangArray[146]);
    //     $("#intro_foreign_body").children().each(function (index) {
    //         $(this).text(myLangArray[147 + index]);
    //     });
    //     $("#poi_class").text(myLangArray[150]);
    //     $("#intro_subject").text(myLangArray[151]);
    //     $("#intro_subject_body").children().each(function (index) {
    //         $(this).text(myLangArray[152 + index]);
    //     });
    //     $("#intro_type").text(myLangArray[155]);
    //     $("#intro_type_body").children().each(function (index) {
    //         $(this).text(myLangArray[156 + index]);
    //     });
    //     $("#intro_format").text(myLangArray[161]);
    //     $("#intro_format_body").children().each(function (index) {
    //         $(this).text(myLangArray[162 + index]);
    //     });
    //     $("#intro_media").text(myLangArray[171]);
    //     $("#intro_media_body").children().each(function (index) {
    //         $(this).text(myLangArray[172 + index]);
    //     });
    //     $("#poi_audio").text(myLangArray[175]);
    //     $("#poi_audio_body").children().each(function (index) {
    //         $(this).text(myLangArray[176 + index]);
    //     });
    //     $("#intro_right").text(myLangArray[177]);
    //     $("#intro_right_body").children().each(function (index) {
    //         $(this).text(myLangArray[178 + index]);
    //     });
    //     $(".intro_link").html(myLangArray[180]);
    //     $(".intro_link_body").children().each(function (index) {
    //         $(this).text(myLangArray[181 + index]);
    //     });
    //     $("#intro_dehApp").text(myLangArray[183]);
    //     $(".intro_pure").text(myLangArray[184]);
    //     $("#intro_pure_body").children().each(function (index) {
    //         $(this).html(myLangArray[185 + index]);
    //     });
    //     $("#intro_pureMake").text(myLangArray[188]);
    //     $("#intro_pureMake_body").children().each(function (index) {
    //         $(this).html(myLangArray[189 + index]);
    //     });
    //     $("#intro_make").text(myLangArray[190]);
    //     $("#intro_make_body").children().each(function (index) {
    //         $(this).html(myLangArray[191 + index]);
    //     });
    //     $("#intro_pure_body2").html(myLangArray[194]);
    //     $("#intro_exp").text(myLangArray[195]);
    //     $("#intro_exp_body").children().each(function (index) {
    //         $(this).html(myLangArray[196 + index]);
    //     });
    //     $("#intro_status").text(myLangArray[205]);
    //     $("#intro_status1").text(myLangArray[206]);
    //     $("#intro_status1_body").children().each(function (index) {
    //         $(this).html(myLangArray[207 + index]);
    //     });
    //     $("#intro_status2").text(myLangArray[211]);
    //     $("#intro_status2_body").children().each(function (index) {
    //         $(this).html(myLangArray[212 + index]);
    //     });
    //     $("#intro_status3").text(myLangArray[216]);
    //     $("#intro_status3_body").children().each(function (index) {
    //         $(this).html(myLangArray[217 + index]);
    //     });
    //     $("#intro_status4").text(myLangArray[225]);
    //     $("#intro_status4_body").children().each(function (index) {
    //         $(this).html(myLangArray[226 + index]);
    //     });
    //     $("#intro_status5").text(myLangArray[229]);
    //     $("#intro_status5_body").children().each(function (index) {
    //         $(this).html(myLangArray[230 + index]);
    //     });
    // }
    // catch (err) {
    //     // console.log(err);
    // }

    try { // make_poi
        $("#make_poiform-1").text(myLangArray[410]);
        $("#title-1").text(myLangArray[233]);
        $("#Subject-1").text(myLangArray[234]);
        $("#subject").children().each(function (index) {
            $(this).html(myLangArray[235 + index]);
        });
        $("#Region-1").text(myLangArray[239]);
        $(".sel_option-1").text(myLangArray[235]);
        $("#Type-1").text(myLangArray[240]);
        // $(".sel_option-1").text(myLangArray[235]);
        $("#type1").children().each(function (index) {
            // console.log(index)
            if (index == 0) {
                $(".sel_option-1").text(myLangArray[235]);
            } else {
                $(this).text(myLangArray[241 + index - 1]);
            }
        });
        $("#docent_period").text(myLangArray[246]);
        $("#period").children().each(function (index) {
            if (index == 0) {
                $(".sel_option-1").text(myLangArray[235]);
            } else if (index == 1) {
                $(this).text(myLangArray[411]);
            } else if (index < 8) {
                $(this).text(myLangArray[247 + index - 2]);
            } else {
                return false;
            }
        });
        $("#year-1").text(myLangArray[253]);
        $("#keyword1").text(myLangArray[254]);
        $("#keyword2").text(myLangArray[454]);
        $("#keyword3").text(myLangArray[455]);
        $("#keyword4").text(myLangArray[456]);
        $("#keyword5").text(myLangArray[457]);

        $("#docent_address").text(myLangArray[289]);
        $("#Changhua_map").text(myLangArray[255]);
        $("#lati").text(myLangArray[256]);
        $("#long").text(myLangArray[257]);
        $("#description").text(myLangArray[258]);
        $("#Format-1").text(myLangArray[259]);
        $("#format").children().each(function (index) {
            if (index == 0) {
                $(".sel_option-1").text(myLangArray[235]);
            } else {
                //$(this).text(myLangArray[260 + index - 1]);
            }
        });
        $("#docent_source").text(myLangArray[269]);
        $("#creator-1").text(myLangArray[270]);
        $("#publisher-1").text(myLangArray[271]);
        $("#contributor-1").text(myLangArray[272]);
        $("#poi_public").text(myLangArray[273]);
        $("#poi_private").text(myLangArray[274]);
        $("#upload_guide").text(myLangArray[275]);
        $("#no_file").text(myLangArray[276]);
        $("#audio_guide").text(myLangArray[277]);
        $("#upload_media").text(myLangArray[278]);
        $(".img_file").text(myLangArray[279]);
        $("#video_file-1").text(myLangArray[280]);
        $("#audio_file-1").text(myLangArray[281]);
        $("#btn_confirm").text(myLangArray[282]);
        $("#btn_reset").text(myLangArray[283]);
        $("#make_poi_info").text(myLangArray[284]);
        $("#make_poi_info-1").html(myLangArray[285]);
        $("#make_poi_info-2").html(myLangArray[286]);
        $("#make_poi_info-3").html(myLangArray[287]);
        $("#make_poi_info-4").html(myLangArray[288]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // make_loi
        $("#loi_make").text(myLangArray[290]);
        $("#Region-1").text(myLangArray[291]);
        $(".sel_option-1").text(myLangArray[292]);
        $("#poi_choose").text(myLangArray[293]);
        $("#loi_title").text(myLangArray[294]);
        $("#loi_description").text(myLangArray[295]);
        $("#loi_contributor").text(myLangArray[296]);
        $("#loi_tool").text(myLangArray[297]);
        $("#loi_car").text(myLangArray[298]);
        $("#loi_bike").text(myLangArray[299]);
        $("#loi_foot").text(myLangArray[300]);
        $("#loi_isPublic").text(myLangArray[301]);
        $("#loi_public").text(myLangArray[302]);
        $("#loi_private").text(myLangArray[303]);
        $("#loi_button").text(myLangArray[304]);
        $("#refresh").text(myLangArray[305]);
        $("#loi_info").text(myLangArray[306]);
        $("#loi_close").text(myLangArray[307]);
        $(".first_loi_area").text(myLangArray[308]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // make_aoi
        $("#aoi_make").text(myLangArray[309]);
        $("#Region-1").text(myLangArray[310]);
        $(".sel_option-1").text(myLangArray[311]);
        $("#poi_choose").text(myLangArray[312]);
        $("#make_aoi_title").text(myLangArray[313]);
        $("#make_aoi_description").text(myLangArray[314]);
        $("#aoi_contributor").text(myLangArray[315]);
        $("#aoi_tool").text(myLangArray[316]);
        $("#aoi_car").text(myLangArray[317]);
        $("#aoi_bike").text(myLangArray[318]);
        $("#aoi_foot").text(myLangArray[319]);
        $("#aoi_isPublic").text(myLangArray[320]);
        $("#aoi_public").text(myLangArray[321]);
        $("#aoi_private").text(myLangArray[322]);
        $("#aoi_button").text(myLangArray[323]);
        $("#refresh").text(myLangArray[324]);
        $("#aoi_info").text(myLangArray[325]);
        $("#aoi_close").text(myLangArray[326]);
        $(".first_aoi_area").text(myLangArray[327]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // make_soi
        $("#soi_make").text(myLangArray[328]);
        $("#Region-1").text(myLangArray[329]);
        $(".sel_option-1").text(myLangArray[330]);
        $("#poi_choose").text(myLangArray[331]);
        $("#loi_choose").text(myLangArray[332]);
        $("#aoi_choose").text(myLangArray[333]);
        $("#make_soi_title").text(myLangArray[334]);
        $("#make_soi_description").text(myLangArray[335]);
        $("#soi_contributor").text(myLangArray[336]);
        $("#soi_isPublic").text(myLangArray[337]);
        $("#soi_public").text(myLangArray[338]);
        $("#soi_private").text(myLangArray[339]);
        $("#soi_button").text(myLangArray[340]);
        $("#refresh").text(myLangArray[341]);
        $("#soi_info").text(myLangArray[342]);
        $("#soi_close").text(myLangArray[343]);
        $(".first_soi_area").text(myLangArray[344]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // make_group
        $("#create_group").text(myLangArray[346]);
        $("#group_title1").text(myLangArray[347]);
        $("#groupdescription").text(myLangArray[348]);
        $("#ispublic").text(myLangArray[349]);
        $("#group_public").text(myLangArray[350]);
        $("#group_private").text(myLangArray[351]);
        $("#group_button").text(myLangArray[352]);
        $("#reset_button").text(myLangArray[353]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // edit_poi
        $("#poi_edit").text(myLangArray[354]);
        $("#none_guide").text(myLangArray[355]);
        $("#gif_jpg_png").text(myLangArray[356]);
        $("#3ggp").text(myLangArray[357]);
        $("#mp4_avi").text(myLangArray[358]);
        $("#restrict").text(myLangArray[359]);
        $("#clear").text(myLangArray[360]);
        $(".sound_guide").text(myLangArray[361]);
        $(".delete_file").text(myLangArray[362]);
        $(".img_file").text(myLangArray[363]);
        $(".sound_files").text(myLangArray[364]);
        $(".video_files").text(myLangArray[365]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // edit_loi
        $("#loi_edit-1").text(myLangArray[366]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // edit_aoi
        $("#aoi_edit-1").text(myLangArray[367]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // edit_soi
        $("#soi_edit-1").text(myLangArray[368]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // manage_group
        $("#group_icon").text(myLangArray[396]);
        $("#group_description").html(myLangArray[369]);
        $("#group_member").text(myLangArray[370]);
        $(".group_history").text(myLangArray[371]);
        $(".group_moveout").text(myLangArray[372]);
        $(".group_edit").text(myLangArray[373]);
        $("#group_inf").children().each(function (index) {
            $(this).text(myLangArray[374 + index]);
        });
        $("#edit_group").text(myLangArray[381]);
        $("#group_open").text(myLangArray[382]);
        $("#group-open").children().each(function (index) {
            $(this).text(myLangArray[383 + index]);
        });
        $("#edit_close").text(myLangArray[385]);
        $("#track").text(myLangArray[386]);
        $("#action").text(myLangArray[387]);
        $("#w_poi").text(myLangArray[388]);
        $("#w_loi").text(myLangArray[389]);
        $("#w_aoi").text(myLangArray[390]);
        $("#w_soi").text(myLangArray[391]);
        $("#web_search").text(myLangArray[392]);
        $("#group_time").text(myLangArray[393]);
        $("#group_title").text(myLangArray[394]);
        $("#group_loi_list").text(myLangArray[395]);
    }
    catch (err) {
        // console.log(err);
    }

    try { // my_history
        $("#historyIntro").text(myLangArray[397]);
        $("#webHistory").text(myLangArray[398]);
        $("#mobileHistory").text(myLangArray[399]);
        $("#history_intro").children().each(function (index) {
            if (index == 0) {
                $(this).html(myLangArray[400]);
            }
        });
        $("#history_intros").children().each(function (index) {
            $(this).text(myLangArray[401 + index]);
        });
        $("#web_contents").children().each(function (index) {
            $(this).text(myLangArray[403 + index]);
        });
        $("#web_search").text(myLangArray[407]);
        $("#mobile_search").text(myLangArray[407]);
        $("#web_search_result").children().children().children().children().each(function (index) {
            $(this).text(myLangArray[408 + index]);
        });
        $("#mobile_search_result").children().children().children().children().each(function (index) {
            $(this).text(myLangArray[408 + index]);
        });
    }
    catch (err) {
        // console.log(err);
    }

    try { //google_map
        document.getElementById("language_script").src = myLangArray[415];
    }
    catch(err) {
        // console.log(err);
    }

    try{
        document.getElementById('Plants').innerHTML = myLangArray[416];
        document.getElementById('natural').innerHTML = myLangArray[417];
        document.getElementById('Traditional').innerHTML = myLangArray[418];
        document.getElementById('Traditional2').innerHTML = myLangArray[419];
        document.getElementById('Traditional3').innerHTML = myLangArray[420];
        document.getElementById('Folk').innerHTML = myLangArray[421];
        document.getElementById('Traditional-knowledge').innerHTML = myLangArray[422];
        document.getElementById('General_landscape').innerHTML = myLangArray[423];
        document.getElementById('Animals').innerHTML = myLangArray[424];
        document.getElementById('biological').innerHTML = myLangArray[425];
        document.getElementById('Food').innerHTML = myLangArray[426];

    }
    catch(err){
        //
    }

}


$('#chinese').click(function () {
    $("input[name='langs']").val('chinese')
    if ($('#coilanguage').val() != '中文') {
        $('#coilanguage').val('中文');
        ajaxLanguage(true);
    }
})
$('#english').click(function () {
    $("input[name='langs']").val('english')
    if ($('#coilanguage').val() != '英文') {
        $('#coilanguage').val('英文');
        ajaxLanguage(true);
    }
})
$('#japan').click(function () {
    $("input[name='langs']").val('japanese')
    if ($('#coilanguage').val() != '日文') {
        $('#coilanguage').val('日文');
        ajaxLanguage(true);
    }

})

function setLanguage() {
    localStorage.setItem(COINAME + 'language', $('#coilanguage').val());
}

function ajaxLanguage(notFirst) {
    let data = {
        language: $('#coilanguage').val(),
        coi: COINAME,
    }
    $.ajax({
        method: 'POST',
        url: '/coi_lang',
        data: data,

        success: function (data) {
            console.log(data);
            console.log($('#coilanguage').val());
            if (notFirst) {
                location.reload()
            }
        },

        error: function (data) {
            console.log(data);
        }

    });
}