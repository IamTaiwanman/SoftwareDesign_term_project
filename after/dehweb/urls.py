# _*_ encoding: utf-8 *_*
"""sqltest URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from mysite import views
from apscheduler.scheduler import Scheduler

from mysite.interface import ajax, player, uschool


urlpatterns = [
    url(r'^$', views.index),  # 首頁
    url(r'^userinfo/$', views.userinfo),  # 使用者資訊
    url(r'^userinfo/pwd$', views.userpwd),  # 使用者變更密碼
    url(r'^findpwd$', views.findpwd),  # 找回密碼
    url(r'^ajax_findpwd$', ajax.ajax_findpwd, name='ajax_findpwd'),  # 找回密碼
    url(r'^userinfo/docnet$', views.docinfo),  # 導覽員資訊
    url(r'^toggle_lang$', views.toggle_lang),  # 變更語言
    url(r'^ajax_docentinfo$', ajax.ajax_docentinfo,
        name='ajax_docentinfo'),  # 變更導覽員資訊
    url(r'^ajax_pwd$', ajax.ajax_pwd, name='ajax_pwd'),  # 變更密碼
    url(r'^intro/$', views.intro),  # 平台使用簡介
    url(r'^pro/(?P<map_role>\w+)$', views.map_player),  # 專家地圖
    url(r'^player/(?P<map_role>\w+)$', views.map_player),  # 玩家地圖
    url(r'^navi/(?P<map_role>\w+)$', views.map_player),  # 導覽員地圖
    url(r'^verification/$', views.verification),  # 驗證系統
    url(r'^ajax_verification$', ajax.ajax_verification, name='ajax_verification'),  # 驗證內容
    url(r'^edit_verification$',        views.edit_verification,
        name='edit_verification'),  # 編輯驗證內容
    url(r'^poi_detail/(\w+)$', views.map_player_post),  # 景點列表
    url(r'^loi_detail/(\w+)$', views.map_player_loi_post),  # 景線列表
    url(r'^aoi_detail/(\w+)$', views.map_player_aoi_post),  # 景區列表
    url(r'^soi_detail/(\w+)$', views.map_player_soi_post),  # 故事列表
    url(r'^make_player/$', player.make_player),  # 玩家製作
    url(r'^make_player/(?P<ids>\d+)/(?P<types>\w+)$', player.make_player),  # 玩家製作(刪除)
    url(r'^edit_player/(?P<ids>\d+)/(?P<types>\w+)/(?P<group_id>\d+)$',
        views.edit_player),  # Group Leader 編輯poi/loi/aoi/soi
    url(r'^edit_player/(?P<ids>\d+)/(?P<types>\w+)$',
        views.edit_player),  # 玩家編輯poi/loi/aoi/soi
    url(r'^(?P<xoi>make_player_poi)/$', player.make_xoi),  # 玩家製作poi
    url(r'^(?P<xoi>make_player_loi)/$', player.make_xoi),  # 玩家製作loi
    url(r'^(?P<xoi>make_player_aoi)/$', player.make_xoi),  # 玩家製作aoi
    url(r'^(?P<xoi>make_player_soi)/$', player.make_xoi),  # 玩家製作soi
    url(r'^make_navi/$', player.make_player),  # 導覽員製作
    url(r'^make_navi/(\d+)/(\w+)$', player.make_player),  # 導覽員製作(刪除)
    url(r'^make_navi_poi/$', player.make_player_poi),  # 導覽員製作poi
    url(r'^make_navi_loi/$', player.make_player_loi),  # 導覽員製作loi
    url(r'^make_navi_aoi/$', player.make_player_aoi),  # 導覽員製作aoi
    url(r'^make_navi_soi/$', player.make_player_soi),  # 導覽員製作soi
    url(r'^login/$', views.login),  # 登入頁面
    url(r'^logout/$', views.logout),  # 登入頁面
    url(r'^regist/$', views.regist),  # 註冊
    url(r'^admin/', admin.site.urls),  # 管理頁面
    url(r'^feed_area', views.feed_area, name='feed_area'),  # 地區篩選(中轉英)
    url(r'^get_area', views.get_area, name='get_area'),  # 地區篩選(英轉中)
    url(r'^ajax_area', views.ajax_area, name='ajax_area'),  # 景點篩選
    url(r'^ajax_makeloi', ajax.ajax_makeloi,
        name='ajax_makeloi'),  # 製作景線.景區(景點的篩選)
    url(r'^ajax_makesoi', ajax.ajax_makesoi,
        name='ajax_makesoi'),  # 製作主題故事(景點景線景區的篩選)
    url(r'^ajax_dublincore', ajax.savePoi, name='ajax_dublincore'),  # poi Poi table store
    url(r'^ajax_mpeg', ajax.ajax_mpeg, name='ajax_mpeg'),  # poi Mpeg table store
    url(r'^ajax_prize', ajax.savePrize, name='ajax_prize'),  # prize table store
    url(r'^ajax_sound', ajax.ajax_sound, name='ajax_sound'),  # poi Mpeg table store
    url(r'^ajax_routeing', ajax.ajax_routeing,
        name='ajax_routeing'),  # loi RoutePlaning table store
    url(r'^ajax_sequence', ajax.ajax_sequence,
        name='ajax_sequence'),  # loi Sequsence table store
    url(r'^edit_sequence', views.edit_sequence,
        name='edit_sequence'),  # loi Sequsence table edit
    url(r'^ajax_aoipoi', ajax.ajax_aoipoi,
        name='ajax_aoipoi'),  # aoi AOIPOI table store
    url(r'^edit_aoipoi', views.edit_aoipoi,
        name='edit_aoipoi'),  # aoi AOIPOI table edit
    url(r'^ajax_aoi', ajax.ajax_aoi, name='ajax_aoi'),  # aoi AOI table store
    url(r'^ajax_soistory', ajax.ajax_soistory, name='ajax_soistory'),  # soi SoiStoryXoi table store
    url(r'^edit_soistory', views.edit_soistory,
        name='edit_soistory'),  # soi SoiStoryXoi table edit
    # soi SoiStory table store
    url(r'^ajax_soi', ajax.ajax_soi, name='ajax_soi'),
    url(r'^delete_media', player.delete_media, name='delete_media'),  # delete metia
    url(r'^search_bar', views.search_bar),  # search bar
    url(r'^make_group/$', views.make_groups),  # 使用者資訊
    url(r'^ajax_groups', ajax.ajax_groups, name='ajax_groups'),  # 創建群組
    url(r'^ajax_groupmember', ajax.ajax_groupmember, name='ajax_groupmember'),  # 群組成員
    url(r'^manage_group/(\w+)$', views.manage_group,
        name='manage_group'),  # 管理群組
    url(r'^list_groups/$', views.list_groups),  # 我的群組頁面
    url(r'^list_groups/(\d+)/(\w+)$', views.list_groups),  # 我的群組頁面/functions
    url(r'^ajax_invite', ajax.ajax_invite),  # 邀請朋友
    url(r'^ajax_handle_err_upload', ajax.ajax_handle_errupload),  # 上傳無多媒體處理
    url(r'^my_history', views.my_history),  # DEH歷史記錄
    url(r'^ajax_newhistorynew', ajax.ajax_historynew),  # get log data
    url(r'^ajax_allloiaoi', ajax.ajax_allloiaoi),
    url(r'^ajax_loiaoipoint', ajax.ajax_loiaoipoint),
    url(r'^know', views.know),
    url(r'^list_prize/$',uschool.list_prize), #我所提供的獎品清單
    url(r'^list_prize/(?P<Pid>\d+)$',uschool.list_prize),
    url(r'^my_prize/$',uschool.my_prize), #我所獲得的獎品清單
    url(r'^make_prize',player.make_prize),
    url(r'^ajax_prize', ajax.savePrize),
    url(r'^prize_detail/(?P<prize_id>\w+)$',uschool.prize_detail),
    url(r'^edit_prize/(?P<prize_id>\w+)$',views.edit_prize),
    url(r'^prize_exchange/(?P<PTP_id>\w+)$',views.prize_exchange),

   
    # for coi url
    url(r'^(extn)$', views.coi_static_page),
    url(r'^(extn)/$', views.coi_static_page),
    url(r'^(\w+)/(index)', views.coi_static_page),
    url(r'^(\w+)/(intro)', views.coi_static_page),
    url(r'^(\w+)/(map)', views.coi_static_page),
    url(r'^(\w+)/(findpwd)', views.coi_static_page),
    url(r'^(\w+)/(my_history)', views.coi_static_page),
    url(r'^(\w+)/(userpwd)', views.coi_static_page),
    url(r'^(\w+)/(know)', views.coi_static_page),
    url(r'^coi_lang', views.coi_lang),
    url(r'^(\w+)/userinfo/$', views.userinfo),
    url(r'^(\w+)/login', views.login),
    url(r'^(\w+)/logout/$', views.logout),
    url(r'^(\w+)/regist', views.regist),
    url(r'^(\w+)/make_player', views.get_user_all_coi_point), #**************
    url(r'^userjoincoi', views.add_user_to_coi),
    url(r'^get_server_coi', views.get_server_coi),
    url(r'^get_point_all_coi', views.get_point_all_coi),
    url(r'^export_single_point', views.export_single_point),
    url(r'^coi_verification', views.verification_xoi_coi),
    url(r'^(\w+)/(make_poi)', player.make_xoi),
    url(r'^(\w+)/(make_loi)', player.make_xoi),
    url(r'^(\w+)/(make_aoi)', player.make_xoi),
    url(r'^(\w+)/(make_soi)', player.make_xoi),
    url(r'^(\w+)/ajax_dublincore', ajax.savePoi),

    
    url(r'^(\w+)/ajax_routeing', ajax.ajax_routeing),
    url(r'^(\w+)/ajax_aoi', ajax.ajax_aoi),
    url(r'^(\w+)/ajax_soi', ajax.ajax_soi),
    url(r'^(\w+)/ajax_area', ajax.ajax_area),
    url(r'^(\w+)/ajax_makeloi', ajax.ajax_makeloi),
    url(r'^(\w+)/ajax_makesoi', ajax.ajax_makesoi),
    url(r'^(\w+)/get_all_point_soi', ajax.get_all_point_soi),
    url(r'^(\w+)/get_all_point_account', views.get_all_point_account),
    url(r'^(\w+)/get_all_point_group', views.get_all_point_group),
    url(r'^(\w+)/export_data', views.export_data),
    url(r'^(\w+)/delete_xoi_coi/(\d+)/(\w+)$', views.delete_xoi_coi),
    url(r'^(?P<coi>\w+)/edit_player/(?P<ids>\d+)/(?P<types>\w+)/(?P<group_id>\d+)$',
        views.edit_player),  # Group Leader 編輯poi/loi/aoi/soi
    url(r'^(?P<coi>\w+)/edit_player/(?P<ids>\d+)/(?P<types>\w+)$',
        views.edit_player),  # 玩家編輯poi/loi/aoi/soi
    url(r'^(?P<coi>\w+)/poi_detail/(?P<poi_id>\w+)$',
        views.map_player_post),  # COI景點列表
    url(r'^(?P<coi>\w+)/loi_detail/(?P<route_id>\w+)$',
        views.map_player_loi_post),  # COI景線列表
    url(r'^(?P<coi>\w+)/aoi_detail/(?P<aoi_id>\w+)$',
        views.map_player_aoi_post),  # COI景區列表
    url(r'^(?P<coi>\w+)/soi_detail/(?P<soi_id>\w+)$',
        views.map_player_soi_post),  # COI故事列表
    url(r'^(?P<coi>\w+)/list_groups/$', views.list_groups),
    url(r'^(?P<coi>\w+)/list_groups/(?P<ids>\d+)/(?P<types>\w+)$',
        views.list_groups),
    url(r'^(?P<coi>\w+)/ajax_groups', ajax.ajax_groups, name='ajax_groups'),
    url(r'^(\w+)/(make_group)/$', views.coi_static_page),
    url(r'^(?P<coi>\w+)/ajax_groupmember', ajax.ajax_groupmember, name='ajax_groupmember'),
    url(r'^(?P<coi>\w+)/manage_group/(?P<group_id>\w+)$', views.manage_group),
    url(r'^(?P<coi>\w+)/ajax_invite', ajax.ajax_invite),
    url(r'^(?P<coi>\w+)/verification/$', views.verification),
    url(r'^(?P<coi>\w+)/ajax_verification$',
        views.get_verification_coi),
    url(r'^(sdc)$', views.coi_static_page),
    url(r'^(sdc)/$', views.coi_static_page),
    #++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++<--------------------------------------------
    
    #兌獎系統
    url(r'^(?P<coi>\w+)/list_prize/(?P<Pid>\d+)$',uschool.list_prize),
    url(r'^(?P<coi>\w+)/list_prize',uschool.list_prize), 
    url(r'^(?P<coi>\w+)/make_prize',player.make_prize),
    url(r'^(\w+)/ajax_prize', ajax.savePrize),
    url(r'^(?P<coi>\w+)/prize_detail/(?P<prize_id>\w+)$',uschool.prize_detail),
    url(r'^(?P<coi>\w+)/edit_prize/(?P<prize_id>\w+)$',views.edit_prize),
    url(r'^(?P<coi>\w+)/prize_exchange/(?P<PTP_id>\w+)$',views.prize_exchange),
    
    # 文資學堂  
    url(r'^list_events$', uschool.list_events),    
    url(r'^list_events/(\d+)/(\w+)$', uschool.list_events),  # 我的群組頁面/functions
    url(r'^ajax_event_invite', ajax.ajax_event_invite),  # 邀請朋友
    url(r'^make_event$', player.make_events),
    url(r'^manage_event/(\w+)$', uschool.manage_event,name='manage_event'),  # 管理活動
    url(r'^ajax_events$', ajax.ajax_events),
    url(r'^ajax_eventmember$', ajax.ajax_eventmember),
    url(r'^event_authority$', uschool.Event_Authority),
    url(r'^event_room/(?P<event_id>\w+)$', uschool.event_room),
    url(r'^event_setting/(?P<event_id>\w+)/(?P<room_id>\w+)$', uschool.event_setting),
    url(r'^game_history/(?P<room_id>\w+)/(?P<page>\w+)$', uschool.game_history),
    url(r'^event_history/(?P<event_id>\w+)/(?P<room_id>\w+)/(?P<page>\w+)$', uschool.event_history),
    url(r'^event_history_export/(?P<event_id>\w+)/(?P<game_id>\w+)$', uschool.event_history_export),
    url(r'^event_history_record/(?P<event_id>\w+)/(?P<game_id>\w+)/(?P<record_id>\w+)$', uschool.event_history_record),
    url(r'^event_history_correction/(?P<event_id>\w+)/(?P<game_id>\w+)/(?P<record_id>\w+)$', uschool.event_history_correction),
    url(r'^searchGrade/(?P<game_id>\w+)$', uschool.searchGrade),  # 查詢遊客文資學堂成績
    url(r'^searchGrade/$', uschool.searchGrade),  # 查詢遊客文資學堂成績

    url(r'^(?P<coi>\w+)/prize_exchange/(?P<PTP_id>\d+)$', views.prize_exchange),  # 獎品派發
    url(r'^prize_distribution/(?P<game_id>\d+)$', uschool.prize_distribution),  # 獎品派發

    url(r'^(?P<coi>\w+)/list_events$', uschool.list_events),
    url(r'^(?P<coi>\w+)/list_events/(?P<ids>\d+)/(?P<types>\w+)$', uschool.list_events),  # 我的群組頁面/functions
    url(r'^(?P<coi>\w+)/ajax_event_invite', ajax.ajax_event_invite),  # 邀請朋友
    url(r'^(?P<coi>\w+)/make_event$', player.make_events),
    url(r'^(?P<coi>\w+)/manage_event/(?P<event_id>\w+)$', uschool.manage_event,name='manage_event'),  # 管理活動
    url(r'^(?P<coi>\w+)/ajax_events$', ajax.ajax_events),
    url(r'^(?P<coi>\w+)/ajax_eventmember$', ajax.ajax_eventmember),
    url(r'^(?P<coi>\w+)/event_setting/(?P<event_id>\w+)/(?P<room_id>\w+)$', uschool.event_setting),
    url(r'^(?P<coi>\w+)/event_history/(?P<event_id>\w+)/(?P<room_id>\w+)/(?P<page>\w+)$', uschool.event_history),
    url(r'^sdc/event_authority$', uschool.Event_Authority),
    url(r'^(?P<coi>\w+)/event_room/(?P<event_id>\w+)$', uschool.event_room),
    url(r'^(?P<coi>\w+)/event_history_record/(?P<event_id>\w+)/(?P<game_id>\w+)/(?P<record_id>\w+)$', uschool.event_history_record),
    url(r'^(?P<coi>\w+)/event_history_correction/(?P<event_id>\w+)/(?P<game_id>\w+)/(?P<record_id>\w+)$', uschool.event_history_correction),
    url(r'^(?P<coi>\w+)/event_history_export/(?P<event_id>\w+)/(?P<game_id>\w+)$', uschool.event_history_export),

    url(r'^(?P<coi>\w+)/game$', uschool.game),
    url(r'^(?P<coi>\w+)/game_room/(?P<group_id>\w+)$', uschool.game_room),
    url(r'^(?P<coi>\w+)/game_setting/(?P<group_id>\w+)/(?P<room_id>\w+)$', uschool.game_setting),
    url(r'^(?P<coi>\w+)/game_history/(?P<group_id>\w+)/(?P<room_id>\w+)/(?P<page>\w+)$', uschool.game_history),
    url(r'^(?P<coi>\w+)/game_history_export/(?P<group_id>\w+)/(?P<game_id>\w+)$', uschool.game_history_export),
    url(r'^(?P<coi>\w+)/game_history_record/(?P<group_id>\w+)/(?P<game_id>\w+)/(?P<record_id>\w+)$', uschool.game_history_record),
    url(r'^(?P<coi>\w+)/game_history_correction/(?P<group_id>\w+)/(?P<game_id>\w+)/(?P<record_id>\w+)$', uschool.game_history_correction),

    url(r'^ajax_game_setting$', ajax.ajax_game_setting),
    url(r'^ajax_game_chest_setting$', ajax.ajax_game_chest_setting),
    url(r'^ajax_event_chest_setting$', ajax.ajax_event_chest_setting),
    url(r'^ajax_game_chest_copy$', ajax.ajax_game_chest_copy),
    url(r'^ajax_event_chest_copy$', ajax.ajax_event_chest_copy),
    url(r'^ajax_game_create$', ajax.ajax_game_create),
    url(r'^ajax_event_room_create$', ajax.ajax_event_room_create),
    url(r'^ajax_game_remove$', ajax.ajax_game_remove),
    url(r'^ajax_event_room_remove$', ajax.ajax_event_room_remove),
    url(r'^ajax_game_correction$', ajax.ajax_game_correction),


    


]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# 定時任務 https://www.cnblogs.com/diaolanshan/p/7841169.html
# 需安裝 pip install apscheduler==2.1.2
sched = Scheduler()     

@sched.interval_schedule(seconds=10.0)

def my_task():      
    views.apscheduler_for_group()
    views.apscheduler_for_test()
sched.start()