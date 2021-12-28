# -*- encoding: utf-8 -*-
import hashlib
import time
import os
import json
import random
import string
import re
import uuid
import threading
import uuid
import math
import threading
import traceback

from mysite import models, forms
from mysite.lib import video_converter

from django.shortcuts import render_to_response, get_object_or_404, redirect, render
from django.template import RequestContext, Context, Template
from django.template.loader import get_template
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.messages import get_messages
from django.core.files.storage import FileSystemStorage
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.db.models import Max, Prefetch, Q, Count, Sum
from django.db import connection
from datetime import  datetime,timedelta

from django.http import JsonResponse
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMessage
from django.core.paginator import Paginator

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
media_dir = os.path.join(BASE_DIR, 'player_pictures/media/')


def ajax_area(request, coi=''):
    city = request.POST.get('citys')  # city
    area = request.POST.get('areas')  # area
    content = request.POST.get('contents')  # poi/loi/aoi/soi
    topic = request.POST.get('topic')  # topic
    ttype = request.POST.get('type')  # type
    category = request.POST.get('category')  # category
    map_role = request.POST.get('map_role')  # role of map
    media = request.POST.get('media')  # media type
    docents = request.POST.get('docents')  # user_name
    language = request.session['%slanguage' % (coi)]
    if content == '':
        content = 's_poi'
    if content:
        if (area == '' or area == None):
            area = '全部'
        else:
            area = area
        if (docents == '全部' or docents == None):
            docents = 'all'
        else:
            docents = docents
        if city == '' or topic == '' or ttype == '' or category == '' or media == '':
            topic = ttype = category = media = 'all'
            city = '臺南市'
        if(area == '全部'):
            get_all = models.Area.objects.filter(
                area_country=city).values_list('area_name_en')
        all_xoi = FilterCoiPoint(content[2:], coi, 1)

        if content == 's_poi':
 
            #area
            if (area == "全部"):
                all_poi = all_xoi.filter(identifier=map_role, language=language, open=1, area_name_en__in=get_all)
            else:
                all_poi = all_xoi.filter(identifier=map_role, language=language, open=1, area_name_en=area)
            #type
            if (not (ttype == None or ttype == 'all')):
                all_poi = all_poi.filter(type1=ttype)
            #topic
            if (not (topic == None or topic == 'all')):
                all_poi = all_poi.filter(subject=topic)
            #category
            if (not(category == None or category == 'all')):
                all_poi = all_poi.filter(format=category)
            #media
            if (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values('foreignkey').filter(format=media)
                all_poi = all_poi.filter(Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))

            all_poi, docent_name = CheckDocentName(
                'poi', all_poi, map_role, docents)
            values_list = list(all_poi.values(
                'poi_id', 'poi_title', 'identifier', 'rights'))
            data = {
                "all_poi": values_list,
                "docent_name": docent_name
            }
            return JsonResponse(data)
        elif content == 's_loi':
            if area == '全部':
                all_loi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en__in=get_all, language=language)
            else:
                all_loi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en=area, language=language)
            all_loi, docent_name = CheckDocentName(
                'loi', all_loi, map_role, docents)
            values_list = list(all_loi.values(
                'route_id', 'route_title', 'identifier'))
            data = {
                "all_loi": values_list,
                "docent_name": docent_name
            }
            return JsonResponse(data)
        elif content == 's_aoi':
            if area == '全部':
                all_aoi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en__in=get_all, language=language)
            else:
                all_aoi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en=area, language=language)
            all_aoi, docent_name = CheckDocentName(
                'aoi', all_aoi, map_role, docents)
            values_list = list(all_aoi.values('aoi_id', 'title', 'identifier'))
            data = {
                "all_aoi": values_list,
                "docent_name": docent_name
            }
            return JsonResponse(data)
        elif content == 's_soi':
            if area == '全部':
                all_soi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en__in=get_all, language=language)
            else:
                all_soi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en=area, language=language)
            all_soi, docent_name = CheckDocentName(
                'soi', all_soi, map_role, docents)
            values_list = list(all_soi.values(
                'soi_id', 'soi_title', 'identifier'))
            data = {
                "all_soi": values_list,
                "docent_name": docent_name
            }
            return JsonResponse(data)

def ajax_mpeg(request):  # 存Mpeg table
    max_picture_id = models.Mpeg.objects.all().aggregate(
        Max('picture_id'))  # 取得最大picture_id
    # 最大picture_id轉成整數+1
    picture_id = int(max_picture_id['picture_id__max']) + 1
    f = request.POST.get('foreignkey')
    f = int(f)
    foreignkey = models.Poi.objects.get(poi_id=f)
    username = foreignkey.rights
    media_type = request.POST.get('media') #對應前端上傳的多媒體
    sound_type = request.POST.get('sounds')
    if request.method == 'POST':
        #多媒體為圖片
        if media_type == "1":
            for afile in request.FILES.getlist('image_file_modified'):
                picture_name = afile  # original picture name
                picture_url = '../player_pictures/media/'
                img_list, picture_name = ManageMediaFile(
                foreignkey, picture_id, username, afile, picture_url, 1)
                if afile:
                    img_list.save()
                    #AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
                picture_id = picture_id + 1
        #多媒體為聲音
        elif media_type == "2":
            afile = request.FILES.get('audio_file')
            picture_name = afile  # original audio name
            picture_url = '../player_pictures/media/audio/'
            img_list, picture_name = ManageMediaFile(
                foreignkey, picture_id, username, afile, picture_url, 2)
            if afile:
                img_list.save()
                #AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
        #多媒體為影片
        elif media_type == "4":
            afile = request.FILES.get('video_file')
            picture_name = afile  # original video name
            picture_url = '../player_pictures/media/video/'
            img_list, picture_name = ManageMediaFile(
                foreignkey, picture_id, username, afile, picture_url, 4)
            if afile:
                img_list.save()
                #AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1    
        #是否有語音導覽
        if sound_type == "8":
            bfile = request.FILES.get('sound_file')
            picture_name = bfile  # original sound name
            picture_url = '../player_pictures/media/audio/'
            sound_list, picture_name = ManageSoundFile(
                foreignkey, picture_id, username, bfile, picture_url, 8)
            if bfile:
                sound_list.save()
            picture_id = picture_id + 1
        return HttpResponseRedirect('/make_player')

def ajax_sound(request):
    max_picture_id = models.Mpeg.objects.all().aggregate(
        Max('picture_id'))  # 取得最大picture_id
    # 最大picture_id轉成整數+1
    picture_id = int(max_picture_id['picture_id__max']) + 1
    f = request.POST.get('poi_id')
    f = int(f)
    foreignkey = models.Poi.objects.get(poi_id=f)
    username = foreignkey.rights
    sound_type = request.POST.get('sounds')

    if request.method == 'POST':
        if sound_type == "8":
            afile = request.FILES.get('sound_file')
            picture_id = picture_id
            picture_name = afile  # original sound name
            picture_size = round(afile.size / 1024, 2)  # sound size
            picture_type = afile.name.split(".")[-1]  # sound_type
            picture_upload_user = username
            picture_rights = username
            picture_upload_time = datetime.now()
            new_name = str(picture_upload_time.year) + str(picture_upload_time.month) + str(picture_upload_time.hour) + str(
                picture_upload_time.minute) + str(picture_upload_time.second) + '_' + str(picture_id) + '.' + picture_type
            picture_name = new_name  # new picture name
            picture_url = '../player_pictures/media/audio/' + str(picture_name)
            dest_file = open(media_dir + 'audio/' + str(picture_name), 'wb+')
            for chunk in afile.chunks():
                dest_file.write(chunk)
            dest_file.close()
            img_list = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=picture_size,
                                   picture_type=picture_type, picture_url=picture_url, picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                                   picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=8)
            if afile:
                img_list.save()
                #AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
            return HttpResponseRedirect('/make_player')

def savePoi(request, coi=''):  # 存Poi table make_poi
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
    except:
        language = '中文'
    media_val = request.POST.get('media_val')
    if request.method == 'POST':
        poi_make = request.POST.get('poi_make')
        if poi_make == 'make':
            max_poi_id = models.Poi.objects.all().aggregate(Max('poi_id'))  # 取得最大poi_id
            poi_id = int(max_poi_id['poi_id__max']) + 1  # 最大poi_id轉成整數+1
        else:
            poi_id = request.POST.get('poi_id')
        try:
            group_id = models.GroupsPoint.objects.get(
                point_id=poi_id, types='poi')
            is_leader = CheckLeader(username, language, group_id.foreignkey.group_id)
        except:
            is_leader = False
        my_areas = request.POST.get('my_areas')
        opens = request.POST.get('open')
        if coi != 'extn':
            subject = "體驗的"
            type1 = "文化景觀"
        else:
            subject = request.POST.get('subject')
            type1 = request.POST.get('type1')        
        period = request.POST.get('period')
        year = request.POST.get('year')
        try:  # admin/grup leader 編輯不能改走別人的著作權
            original = models.Poi.objects.get(poi_id=poi_id)
            if role == 'admin' or is_leader:
                rights = original.rights
                identifier = original.identifier
            else:
                rights = username
                identifier = role
        except:
            rights = username
            identifier = role
        keyword1 = request.POST.get('keyword1')
        keyword2 = request.POST.get('keyword2')
        keyword3 = request.POST.get('keyword3')
        keyword4 = request.POST.get('keyword4')
        poi_address = request.POST.get('poi_address')
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        poi_description_1 = request.POST.get('poi_description_1')
        formats = request.POST.get('format')
        poi_source = request.POST.get('poi_source')
        creator = request.POST.get('creator')
        publisher = request.POST.get('publisher')
        contributor = request.POST.get('contributor')
        poi_added_time = datetime.now()
        poi_title = request.POST.get('poi_title')
        media_val = request.POST.get('media_val')
        sound_val = request.POST.get('sound_val')


        media = request.POST.get('media')

        picture_url = []
        picture_url.append(request.POST.get('picture1')) 
        picture_url.append(request.POST.get('picture2'))
        picture_url.append(request.POST.get('picture3'))
        picture_url.append(request.POST.get('picture4'))
        picture_url.append(request.POST.get('picture5'))
        video = request.POST.get('video')
        audio = request.POST.get('audio')

        obj = models.Poi(
            area_name_en=my_areas,
            poi_id=poi_id,
            subject=subject,
            open=opens,
            type1=type1,
            period=period,
            year=year,
            rights=rights,
            keyword1=keyword1,
            keyword2=keyword2,
            keyword3=keyword3,
            keyword4=keyword4,
            poi_address=poi_address,
            poi_description_1=poi_description_1,
            latitude=latitude,
            longitude=longitude,
            poi_source=poi_source,
            creator=creator,
            publisher=publisher,
            contributor=contributor,
            format=formats,
            poi_added_time=poi_added_time,
            poi_title=poi_title,
            identifier=identifier,
            language=language,
            verification=0
        )
        obj.save()

        try:
            if (1 == int(media)): #image
                del_media = models.Mpeg.objects.filter(~Q(format=1), foreignkey = poi_id) #delete not image
                print("1.",del_media)
                del_media.delete()
            else:
                del_media = models.Mpeg.objects.filter(foreignkey=poi_id)
                print("2.",del_media)
                del_media.delete()
        except:
            del_media = models.Mpeg.objects.filter(foreignkey=poi_id)
            print("2.",del_media)
            del_media.delete()

 

        for i in range(5): 
            if picture_url[i] != "" and picture_url[i] != None:
                max_picture_id = models.Mpeg.objects.all().aggregate(
                Max('picture_id'))  # 取得最大picture_id
                # 最大picture_id轉成整數+1

                picture_id = int(max_picture_id['picture_id__max']) + 1
                picture_upload_user = username
                picture_rights = username
                picture_upload_time = datetime.now()
                picture_name = str(picture_upload_time.year) + str(picture_upload_time.month) + str(picture_upload_time.hour) + \
                str(picture_upload_time.minute) + str(picture_upload_time.second) + \
                '_' + str(picture_id)
                foreignkey = models.Poi.objects.get(poi_id=poi_id)
                picture_type = picture_url[i].split(".")[-1]

                print("開始寫入mpeg第[",i+1,"]張圖片....")

                obj = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=0,
                           picture_type=picture_type, picture_url=picture_url[i], picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                           picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=1)
                obj.save()
                #AutoIncrementSqlSave(obj, "[dbo].[mpeg]")

                print("結束寫入mpeg第[",i+1,"]張圖片....")

            else:
                break

        if audio != "" and audio != None:
            max_picture_id = models.Mpeg.objects.all().aggregate(
                Max('picture_id'))  # 取得最大picture_id
                # 最大picture_id轉成整數+1
            picture_id = int(max_picture_id['picture_id__max']) + 1
            picture_upload_user = username
            picture_rights = username
            picture_upload_time = datetime.now()
            picture_name = str(picture_upload_time.year) + str(picture_upload_time.month) + str(picture_upload_time.hour) + \
                str(picture_upload_time.minute) + str(picture_upload_time.second) + \
                '_' + str(picture_id)
            foreignkey = models.Poi.objects.get(poi_id=poi_id)
            picture_type = audio.split(".")[-1]
            print("開始寫入mpeg聲音....")

            obj = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=0,
                           picture_type=picture_type, picture_url=audio, picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                           picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=2)
            obj.save()
            #AutoIncrementSqlSave(obj, "[dbo].[mpeg]")

            print("結束寫入mpeg聲音....")

        if video != "" and video != None:
            max_picture_id = models.Mpeg.objects.all().aggregate(
                Max('picture_id'))  # 取得最大picture_id
                # 最大picture_id轉成整數+1
            picture_id = int(max_picture_id['picture_id__max']) + 1
            picture_upload_user = username
            picture_rights = username
            picture_upload_time = datetime.now()
            picture_name = str(picture_upload_time.year) + str(picture_upload_time.month) + str(picture_upload_time.hour) + \
                str(picture_upload_time.minute) + str(picture_upload_time.second) + \
                '_' + str(picture_id)
            foreignkey = models.Poi.objects.get(poi_id=poi_id)
            picture_type = video.split(".")[-1]
            print("開始寫入mpeg影片....")

            obj = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=0,
                           picture_type=picture_type, picture_url=video, picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                           picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=4)
            obj.save()
            #AutoIncrementSqlSave(obj, "[dbo].[mpeg]")

            print("結束寫入mpeg影片....")


        try:
            if opens == '1': 
                mail_title = '文史脈流驗証系統通知'               
                mail_contnt = '有一筆新的POI:' + poi_title + '上傳, 作者為' + rights
                mail_address = 'mmnetlab@locust.csie.ncku.edu.tw'
                SendMailThread(mail_title, mail_contnt, mail_address)                
        except:
            print('Mail system error')
        data = json.dumps({
            'media': media_val,
            'sounds': sound_val,
            'ids': poi_id
        })
        if poi_make == 'make':  #if coi != '' and poi_make == 'make':
            AddCoiPoint(poi_id, "poi", coi)

        return HttpResponse(data, content_type='application/json')

def savePrize(request,coi=''):
    try:
        username = request.session['%susername' % (coi)]
    except:
        if coi == '':
            return HttpResponseRedirect('/')
        else:
            return HttpResponseRedirect('/%s/index.html' % (coi))

    user = models.UserProfile.objects.get(user_name=username)
    user_id = user.user_id
    prize_title = request.POST.get('prize_title')
    prize_num = request.POST.get('prize_num')
    prize_description = request.POST.get('prize_description')
    isopen = request.POST.get('isPublic')
    group_id = request.POST.get('group_id')

    if request.method == 'POST':
        prize_make = request.POST.get('prize_make')
        if prize_make == 'make':
            max_prize_id = models.prize_profile.objects.all().aggregate(Max('prize_id'))  # 取得最大prize_id
            prize_id = int(max_prize_id['prize_id__max']) + 1
        else:
            prize_id = request.POST.get('prize_id')
        try:
            afile = request.FILES.get('file')
            if afile != None:
                fname = afile.name.split(".")[-1] #副檔名
                new_name = str(datetime.now()) + \
                '_' + str(prize_id) + '.' + fname
                afile.name = new_name
            else:
                afile = models.prize_profile.objects.get(prize_id = prize_id).prize_url
        except:
            print("error")
        
        obj = {
            'prize_name' : prize_title,
            'prize_description' : prize_description,
            'prize_url' : afile,
            'prize_number' : int(prize_num),
            'upload_time' : datetime.now(),
            'user_id_id' : user_id,
            'is_open' : int(isopen),
            'is_allocated' : 0,
            'group_id' : group_id
            }
        models.prize_profile.objects.update_or_create(
            prize_id = prize_id,
            defaults = obj
        )
    if coi == '':
            return HttpResponseRedirect('/')
    else:
        return HttpResponseRedirect('/%s/list_prize' % (coi))

def ajax_handle_errupload(request):
    poi_id = request.POST.get('id')
    coi = request.POST.get('coi')

    try:
        remove_poi = models.Poi.objects.get(poi_id=poi_id)
        remove_poi.delete()
    except:
        return HttpResponse("POI_Fail")

    if coi != 'deh':
        try:
            remove_coi = models.CoiPoint.objects.get(
                types='poi', point_id=poi_id, coi_name=coi)
            remove_coi.delete()
        except:
            return HttpResponse("COI_Fail")

    return HttpResponse("Success")

def ajax_routeing(request, coi=''):  # 存RoutePlanning table
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
    except:
        language = '中文'
    if request.method == 'POST':
        first_poi_id = request.POST.get('first_poi_id')
        loi_make = request.POST.get('loi_make')
        my_areas = request.POST.get('my_areas')
        transportation = request.POST.get('transportation')
        opens = request.POST.get('open')
        if loi_make == 'make':
            max_loi_id = models.RoutePlanning.objects.all(
            ).aggregate(Max('route_id'))  # 取得最大loi_id
            route_id = int(max_loi_id['route_id__max']) + 1  # 最大loi_id轉成整數+1
        else:
            route_id = request.POST.get('route_id')
        try:
            group_id = models.GroupsPoint.objects.get(
                point_id=route_id, types='loi')
            is_leader = CheckLeader(username, language, group_id.foreignkey.group_id)
        except:
            is_leader = False
        try:  # admin/group leader 編輯不能改走別人的著作權
            original = models.RoutePlanning.objects.get(route_id=route_id)
            if role == 'admin' or is_leader == True:
                identifier = original.identifier
                route_owner = original.route_owner
            else:
                identifier = request.POST.get('identifier')
                route_owner = request.POST.get('route_owner')
        except:
            identifier = request.POST.get('identifier')
            route_owner = request.POST.get('route_owner')
        route_description = request.POST.get('route_description')
        route_title = request.POST.get('route_title')
        contributor = request.POST.get('contributor')

        if my_areas == '' or my_areas == "All":            
            first_poi = models.Poi.objects.get(poi_id=first_poi_id)            
            my_areas = first_poi.area_name_en

        obj = models.RoutePlanning(
            area_name_en=my_areas,
            transportation=transportation,
            route_id=route_id,
            open=opens,
            route_owner=route_owner,
            route_description=route_description,
            route_upload_time=datetime.now(),
            route_title=route_title,
            identifier=identifier,
            verification=0,
            language=language,
            contributor=contributor
        )
        obj.save()
        try:
            if opens == '1':
                # AutoIncrementSqlSave(obj, "[dbo].[route_planning]")
                obj.save()
                title = '文史脈流驗証系統通知'
                mail_contnt = '有一筆新的LOI:' + route_title + '上傳, 作者為' + route_owner
                mail_address = 'mmnetlab@locust.csie.ncku.edu.tw'
                SendMailThread(title, mail_contnt, mail_address)   
        except:
            print("Mail system error")
        data = json.dumps({
            'ids': route_id
        })
        if loi_make == 'make':
            AddCoiPoint(route_id, "loi", coi)
        return HttpResponse(data, content_type='application/json')

def ajax_sequence(request):  # 存Sequence table
    # 取得 foreignkey 也就是routingplanning id
    f = request.POST.get('loi_id')
    f = int(f)
    foreignkey = models.RoutePlanning.objects.get(route_id=f)
    # 先清除已有的sequence
    delete_seq = models.Sequence.objects.filter(foreignkey=foreignkey)
    delete_seq.delete()
    #加入新的sequence
    max_sequence_id = models.Sequence.objects.all().aggregate(
        Max('sequence_id'))  # 取得最大sequence_id
    # 最大sequence_id轉成整數+1
    sequence_id = int(max_sequence_id['sequence_id__max']) + 1
    count = request.POST.get('count')
    count = int(count)  # poi數量
    
    pid = request.POST.getlist('poi_id[]')
    pid = list(map(int, pid))
    n = request.POST.getlist('num[]')
    n = list(map(int, n))
    if request.method == 'POST':
        for i in range(count):
            p_id = pid[i]
            poi_id = models.Poi.objects.get(poi_id=p_id)
            sequence = n[i]
            seq_list = models.Sequence(
                sequence_id=sequence_id, sequence=sequence, foreignkey=foreignkey, poi_id=poi_id)
            sequence_id = sequence_id + 1
            seq_list.save()
    return HttpResponseRedirect('/make_player')

def ajax_makeloi(request, coi=''):
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
    except:
        pass  # 取得欲製做的POI(用於loi & aoi)

    area = request.POST.get('areas')
    city = request.POST.get('citys')
    key = request.POST.get('key', '')
    myOwn = request.POST.get('myOwn')
    mygroup = request.POST.get('group')

    print(myOwn)
    print(mygroup)
    if coi == 'extn':
        myOwn = "-1"
        mygroup = "-1"

    # 因為不知道為甚麼dublincore 沒有存country 所以要反向搜尋
    all_city = models.Area.objects.filter(area_country=city)
    city_list = all_city.values_list('area_name_en', flat=True) 

    all_pois = FilterCoiPoint('poi', coi,100)
    

    if area == "All":
        all_pois = all_pois.filter(Q(open=1) | Q(rights=username), area_name_en__in=city_list, language=language)  # open= 1 (公開)
    elif area and city :
        all_pois = all_pois.filter(Q(open=1) | Q(rights=username), area_name_en=area, language=language)  # open= 1 (公開)
    elif myOwn == "-1" and mygroup == "-1":
        all_pois = models.Poi.objects.none()

    if myOwn != "-1" :   
        # 列出所有個人的(包含所有地區、驗證情形)
        result_list = FilterCoiPoint('poi', coi,100)
        all_pois = result_list.filter(language=language, rights=myOwn)  # open= 1 (公開)
    
    if mygroup != "-1":
        all_pois = models.GroupsPoint.objects.filter(types="poi", foreignkey=mygroup)
        all_pois_id = all_pois.values_list('point_id', flat=True) 
        all_pois = models.Poi.objects.filter(poi_id__in=all_pois_id, open=1)

    

    #因為要在前端顯示驗證狀態/公開私有，所以這裡filter減少，並且還要額外抓公開私有狀態
    #for temp_poi in all_pois:


    poi_ans = models.Poi.objects.none()
    poi_list = all_pois.values_list('poi_id', flat=True)
    if key != '':
        key_list = key.split()
        for element in key_list:
            groups = models.Groups.objects.filter(group_name__contains=element, language=language)
            group_poi = models.GroupsPoint.objects.filter(foreignkey__in=groups, point_id__in=poi_list, types='poi').values_list('point_id', flat=True)

            user_list = models.UserProfile.objects.filter(nickname__contains=element).values_list('user_name', flat=True)

            poi_ans = poi_ans | all_pois.filter(Q(poi_title__contains=element) |
                Q(rights__contains=element) |
                Q(rights__in=user_list) |
                Q(contributor__contains=element) |
                Q(poi_id__in=group_poi))
    else:
        poi_ans = all_pois

    all_poi = models.Mpeg.objects.filter(
        ~Q(format=8), foreignkey__in=poi_ans).distinct()
    values = all_poi.values('foreignkey')
    no_mpeg = poi_ans.exclude(poi_id__in=values)  # 抓無多媒體檔案query
    no_list = list(no_mpeg.values('poi_id', 'poi_title', 'rights',
                                  'identifier', 'open', 'verification', 'latitude', 'longitude'))
    values_list = list(all_poi.values('foreignkey__poi_id', 'foreignkey__poi_title', 'foreignkey__rights', 'foreignkey__identifier',
                                      'foreignkey__open', 'foreignkey__verification', 'foreignkey__latitude', 'foreignkey__longitude', 'format'))
    data = {
        "all_poi": values_list,
        "no_list": no_list
    }
    return JsonResponse(data)

def ajax_aoi(request, coi=''):  # 存Aoi page
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
    except:
        language = '中文'
    if request.method == 'POST':
        first_poi_id = request.POST.get('first_poi_id')
        my_areas = request.POST.get('my_areas')
        opens = request.POST.get('open')
        aoi_make = request.POST.get('aoi_make')
        if aoi_make == 'make':
            max_aoi_id = models.Aoi.objects.all().aggregate(Max('aoi_id'))  # 取得最大aoi_id
            aoi_id = int(max_aoi_id['aoi_id__max']) + 1  # 最大aoi_id轉成整數+1
        else:
            aoi_id = request.POST.get('aoi_id')
        try:
            group_id = models.GroupsPoint.objects.get(
                point_id=aoi_id, types='aoi')
            is_leader = CheckLeader(username, language, group_id.foreignkey.group_id)
        except:
            is_leader = False
        try:  # admin/group leader 編輯不能改走別人的著作權
            original = models.Aoi.objects.get(aoi_id=aoi_id)
            if role == 'admin' or is_leader:
                aoi_owner = original.owner
                identifier = original.identifier
            else:
                aoi_owner = request.POST.get('aoi_owner')
                identifier = request.POST.get('identifier')
        except:
            aoi_owner = request.POST.get('aoi_owner')
            identifier = request.POST.get('identifier')
        aoi_description = request.POST.get('aoi_description')
        aoi_title = request.POST.get('aoi_title')
        no_pois = request.POST.get('no_pois')
        contributor = request.POST.get('contributor')
        transportation = request.POST.get('transportation')

        if my_areas == '' or my_areas == "All":            
            first_poi = models.Poi.objects.get(poi_id=first_poi_id)            
            my_areas = first_poi.area_name_en

        obj = models.Aoi(
            area_name_en=my_areas,
            aoi_id=aoi_id,
            open=opens,
            owner=aoi_owner,
            description=aoi_description,
            upload_time=datetime.now(),
            title=aoi_title,
            identifier=identifier,
            no_pois=no_pois,
            verification=0,
            language=language,
            contributor=contributor,
            transportation=transportation,
        )
        obj.save()
        try:
            if opens == '1':
                title = '文史脈流驗証系統通知'
                mail_contnt = '有一筆新的AOI:' + aoi_title + '上傳, 作者為' + aoi_owner
                mail_address = 'mmnetlab@locust.csie.ncku.edu.tw'
                SendMailThread(title, mail_contnt, mail_address)  
        except:
            print("Mail system error")
        data = json.dumps({
            'ids': aoi_id
        })
        if aoi_make == 'make':
            AddCoiPoint(aoi_id, "aoi", coi)
        return HttpResponse(data, content_type='application/json')

def ajax_aoipoi(request):  # 存AoiPois page
    max_ids = models.AoiPois.objects.all().aggregate(Max('ids'))  # 取得最大ids
    ids = int(max_ids['ids__max']) + 1  # 最大ids轉成整數+1
    count = request.POST.get('count')
    count = int(count)  # poi數量
    f = request.POST.get('aoi_id')
    f = int(f)
    aoi_id_fk = models.Aoi.objects.get(aoi_id=f)
    pid = request.POST.getlist('poi_id[]')
    pid = list(map(int, pid))
    if request.method == 'POST':
        for i in range(count):
            p_id = pid[i]
            poi_id = models.Poi.objects.get(poi_id=p_id)
            aoi_list = models.AoiPois(
                ids=ids, aoi_id_fk=aoi_id_fk, poi_id=poi_id)
            ids = ids + 1
            aoi_list.save()
    return HttpResponseRedirect('/make_player')

def ajax_makesoi(request, coi=''):  # 取得欲製做的POI(用於loi & aoi)
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
    except:
        pass

    area = request.POST.get('areas')
    city = request.POST.get('citys')
    key = request.POST.get('key', '')
    myOwn = request.POST.get('myOwn')
    mygroup = request.POST.get('group')
    print(myOwn)
    print(mygroup)

    all_pois = FilterCoiPoint('poi', coi,100)
    all_loi = FilterCoiPoint('loi', coi,100)
    all_aoi = FilterCoiPoint('aoi', coi,100)

    if coi == 'extn':
        myOwn = "-1"
        mygroup = "-1"

    # Poi 沒有存country 所以要反向搜尋
    all_city = models.Area.objects.filter(area_country=city)
    city_list = all_city.values_list('area_name_en', flat=True)
    # poi filter  

    if area == "All":
        all_pois = all_pois.filter(Q(open=1) | Q(rights=username), area_name_en__in=city_list, language=language)  # open= 1 (公開)
    elif area and city :
        all_pois = all_pois.filter(Q(open=1) | Q(rights=username), area_name_en=area, language=language)  # open= 1 (公開)
    elif myOwn == "-1" and mygroup == "-1":
        all_pois = models.Poi.objects.none()
        

    if myOwn != "-1" :   
        all_pois = all_pois.filter(language=language, rights=myOwn)  # open= 1 (公開)

    
    if mygroup != "-1":
        all_pois = models.GroupsPoint.objects.filter(types="poi", foreignkey=mygroup)
        all_pois_id = all_pois.values_list('point_id', flat=True) 
        all_pois = models.Poi.objects.filter(poi_id__in=all_pois_id, open=1)

    #loi filter

    if area == "All":
        all_loi = all_loi.filter(Q(open=1) | Q(route_owner=username), area_name_en__in=city_list, language=language)  # open= 1 (公開)
    elif area and city :
        all_loi = all_loi.filter(Q(open=1) | Q(route_owner=username), area_name_en=area, language=language)  # open= 1 (公開)
    elif myOwn == "-1" and mygroup == "-1":
        all_loi = models.RoutePlanning.objects.none()

    if myOwn != "-1" :   
        all_loi = all_loi.filter(language=language, route_owner=myOwn)  # open= 1 (公開)
    
    if mygroup != "-1":
        all_loi = models.GroupsPoint.objects.filter(types="loi", foreignkey=mygroup)
        all_loi_id = all_loi.values_list('point_id', flat=True)
        all_loi = models.RoutePlanning.objects.filter(route_id__in=all_loi_id, open=1, verification=1)

    #aoi filter
    if area == "All":
        all_aoi = all_aoi.filter(Q(open=1) | Q(owner=username), area_name_en__in=city_list, language=language)  # open= 1 (公開)
    elif area and city :
        all_aoi = all_aoi.filter(Q(open=1) | Q(owner=username), area_name_en=area, language=language)  # open= 1 (公開)
    elif myOwn == "-1" and mygroup == "-1":
        all_aoi = models.Aoi.objects.none()
    

    if myOwn != "-1" :   
        all_aoi = all_aoi.filter(language=language, owner=myOwn)  # open= 1 (公開)
    
    if mygroup != "-1":
        all_aoi = models.GroupsPoint.objects.filter(types="aoi", foreignkey=mygroup)
        all_aoi_id = all_aoi.values_list('point_id', flat=True)
        all_aoi = models.Aoi.objects.filter(aoi_id__in=all_aoi_id, open=1, verification=1)

    poi_ans = models.Poi.objects.none()
    loi_ans = models.RoutePlanning.objects.none()
    aoi_ans = models.Aoi.objects.none()

    poi_list = all_pois.values_list('poi_id', flat=True)
    loi_list = all_loi.values_list('route_id', flat=True)
    aoi_list = all_aoi.values_list('aoi_id', flat=True)

    if key != '':
        key_list = key.split()
        for element in key_list:
            groups = models.Groups.objects.filter(group_name__contains=element, language=language)

            group_poi = models.GroupsPoint.objects.filter(foreignkey__in=groups, point_id__in=poi_list, types='poi').values_list('point_id', flat=True)
            group_loi = models.GroupsPoint.objects.filter(foreignkey__in=groups, point_id__in=loi_list, types='loi').values_list('point_id', flat=True)
            group_aoi = models.GroupsPoint.objects.filter(foreignkey__in=groups, point_id__in=aoi_list, types='aoi').values_list('point_id', flat=True)

            user_list = models.UserProfile.objects.filter(nickname__contains=element).values_list('user_name', flat=True)

            poi_ans = poi_ans | all_pois.filter(Q(poi_title__contains=element) |
                Q(rights__contains=element) |
                Q(rights__in=user_list) |
                Q(contributor__contains=element) |
                Q(poi_id__in=group_poi))

            loi_ans = loi_ans | all_loi.filter(Q(route_title__contains=element) |
                Q(identifier__contains=element) |
                Q(identifier__in=user_list) |
                Q(contributor__contains=element) |
                Q(route_id__in=group_loi))

            aoi_ans = aoi_ans | all_aoi.filter(Q(title__contains=element) |
                Q(owner__contains=element) |
                Q(owner__in=user_list) |
                Q(contributor__contains=element) |
                Q(aoi_id__in=group_aoi))
    else:
        poi_ans = all_pois
        loi_ans = all_loi
        aoi_ans = all_aoi

    all_poi = models.Mpeg.objects.filter(
        ~Q(format=8), foreignkey__in=poi_ans).distinct()  # 取得圖片資訊
    values = all_poi.values('foreignkey')
    no_mpeg = poi_ans.exclude(poi_id__in=values)  # 取得無多媒體POI queryset

    no_list = list(no_mpeg.values('poi_id', 'poi_title', 'rights',
                                  'identifier', 'open', 'verification', 'latitude', 'longitude'))
    pvalues_list = list(all_poi.values('foreignkey__poi_id', 'foreignkey__poi_title', 'foreignkey__rights', 'foreignkey__identifier',
                                       'foreignkey__open', 'foreignkey__verification', 'foreignkey__latitude', 'foreignkey__longitude', 'format'))
    lvalues_list = list(loi_ans.values(
        'route_id', 'route_title', 'route_owner', 'identifier', 'open','verification'))
    avalues_list = list(aoi_ans.values(
        'aoi_id', 'title', 'owner', 'identifier', 'open','verification'))
    all_aoi_poi_list = []
    all_loi_poi_list = []
    temp_list = avalues_list.copy()
    for i in temp_list:
        try:
            temp = models.AoiPois.objects.filter(aoi_id_fk=i['aoi_id']).values(
                'poi_id__latitude', 'poi_id__longitude')[0]
            all_aoi_poi_list.append(temp)
        except:
            avalues_list.remove(i)

    temp_list = lvalues_list.copy()
    for i in temp_list:
        try:
            temp = models.Sequence.objects.filter(foreignkey=i['route_id']).values(
                'poi_id__latitude', 'poi_id__longitude')[0]
            all_loi_poi_list.append(temp)
        except:
            lvalues_list.remove(i)

    data = {
        "all_poi": pvalues_list,
        "no_list": no_list,
        "all_loi": lvalues_list,
        "all_loi_poi": all_loi_poi_list,
        "all_aoi": avalues_list,
        "all_aoi_poi": all_aoi_poi_list
    }
    return JsonResponse(data)

def ajax_soi(request, coi=''):  # 存SoiStory page
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
    except:
        language = '中文'
    if request.method == 'POST':
        soi_make = request.POST.get('soi_make')
        my_areas = request.POST.get('my_areas')
        opens = request.POST.get('open')
        if soi_make == 'make':
            max_soi_id = models.SoiStory.objects.all().aggregate(Max('soi_id'))  # 取得最大soi_id
            soi_id = int(max_soi_id['soi_id__max']) + 1  # 最大soi_id轉成整數+1
        else:
            soi_id = request.POST.get('soi_id')
        try:
            group_id = models.GroupsPoint.objects.get(
                point_id=soi_id, types='soi')
            is_leader = CheckLeader(username, language, group_id.foreignkey.group_id)
        except:
            is_leader = False
        try:  # admin/group leader 編輯不能改走別人的著作權
            original = models.SoiStory.objects.get(soi_id=soi_id)
            if role == 'admin' or is_leader:
                identifier = original.identifier
                soi_user_name = original.soi_user_name
            else:
                identifier = request.POST.get('identifier')
                soi_user_name = request.POST.get('soi_user_name')
        except:
            identifier = request.POST.get('identifier')
            soi_user_name = request.POST.get('soi_user_name')
        soi_description = request.POST.get('soi_description')
        soi_title = request.POST.get('soi_title')
        contributor = request.POST.get('contributor')
        obj = models.SoiStory(
            area_name_en=my_areas,
            soi_id=soi_id,
            open=opens,
            soi_user_name=soi_user_name,
            soi_description=soi_description,
            soi_upload_time=datetime.now(),
            soi_title=soi_title,
            identifier=identifier,
            verification=0,
            language=language,
            contributor=contributor)
        obj.save()
        try:
            if opens == '1':
                title = '文史脈流驗証系統通知'
                mail_contnt = '有一筆新的SOI:' + soi_title + '上傳, 作者為' + soi_user_name
                mail_address = 'mmnetlab@locust.csie.ncku.edu.tw'
                SendMailThread(title, mail_contnt, mail_address)  
        except:
            print("Mail system error")
        data = json.dumps({
            'ids': soi_id
        })
        if soi_make == 'make':
            AddCoiPoint(soi_id, "soi", coi)
        return HttpResponse(data, content_type='application/json')

def ajax_soistory(request):  # 存SoiStoryXoi page
    max_soi_xois_id = models.SoiStoryXoi.objects.all().aggregate(
        Max('soi_xois_id'))  # 取得最大soi_xois_id
    # 最大soi_xois_id轉成整數+1
    soi_xois_id = int(max_soi_xois_id['soi_xois_id__max']) + 1
    count = request.POST.get('count')
    count = int(count)  # poi/loi/aoi數量
    f = request.POST.get('soi_id')
    f = int(f)
    xoi_id = []
    xoi_type = []
    for i in range(0, count):
        xoi_id.append(request.POST.get('xoi_id[' + repr(i) + '][id]'))
        xoi_type.append(request.POST.get('xoi_id[' + repr(i) + '][type]'))
    soi_id_fk = models.SoiStory.objects.get(soi_id=f)
    if request.method == 'POST':
        for i in range(len(xoi_id)):
            xoi_id[i] = int(xoi_id[i])
            if xoi_type[i] == 'poi':
                poi_id = models.Poi.objects.get(poi_id=xoi_id[i])
                soi_list = models.SoiStoryXoi(
                    soi_xois_id=soi_xois_id, soi_id_fk=soi_id_fk, poi_id=poi_id)
            elif xoi_type[i] == 'loi':
                loi_id = models.RoutePlanning.objects.get(route_id=xoi_id[i])
                soi_list = models.SoiStoryXoi(
                    soi_xois_id=soi_xois_id, soi_id_fk=soi_id_fk, loi_id=loi_id)
            elif xoi_type[i] == 'aoi':
                aoi_id = models.Aoi.objects.get(aoi_id=xoi_id[i])
                soi_list = models.SoiStoryXoi(
                    soi_xois_id=soi_xois_id, soi_id_fk=soi_id_fk, aoi_id=aoi_id)
            soi_xois_id = soi_xois_id + 1
            soi_list.save()
    return HttpResponseRedirect('/make_player')

def ajax_docentinfo(request):
    username = request.session['username']
    userid = request.session['userid']
    user = models.UserProfile.objects.get(user_id=userid)
    name = request.POST.get('name')
    telphone = request.POST.get('telphone')
    cellphone = request.POST.get('cellphone')
    language = request.POST.getlist('language')
    introduction = request.POST.get('introduction')
    social_id = request.POST.get('social_id')
    docent_language = ''
    for l in language:
        if l == 'Chinese':
            docent_language += '中文(Traditional Chinese),'
        elif l == 'English':
            docent_language += '英文(English),'
        elif l == 'Japanese':
            docent_language += '日文(Japanese),'
        elif l == 'Others':
            docent_language += '其他(Others),'
        else:
            return HttpResponse('1')  # no language
    charge = request.POST.get('charge')
    if charge == '':
        charge = "[議價]"
    if name == "":
        return HttpResponse('0')  # no name
    else:
        docent_info = models.DocentProfile(
            fk_userid=user,
            name=name,
            telphone=telphone,
            cellphone=cellphone,
            docent_language=docent_language,
            charge=charge,
            introduction=introduction,
            social_id=social_id,
        )
        docent_info.save()
        return HttpResponse('success')  # success

def ajax_pwd(request):
    username = request.session['username']
    userid = request.session['userid']
    user = models.UserProfile.objects.get(user_name=username)
    orig_pwd = request.POST.get('orig_pwd')
    orig_pwd = computeMD5hash(orig_pwd)
    new_pwd = request.POST.get('new_pwd')
    confirm_pwd = request.POST.get('confirm_pwd')
    if new_pwd == "":
        return HttpResponse('2')    #新密碼為空
    if user.password == orig_pwd:
        if new_pwd == confirm_pwd:
            new_pwd = computeMD5hash(new_pwd)
            user.password = new_pwd
            user.save()
            return HttpResponseRedirect('/')
        else:
            return HttpResponse('1')  # 輸入密碼不相同
    else:
        return HttpResponse('0')  # 原密碼錯誤

def ajax_verification(request, coi=''):
    ver_item = request.POST.get('ver_item')
    role = request.POST.get('role')
    content = request.POST.get('content')
    area = request.POST.get('area')
    city = request.POST.get('citys')
    language = request.session['language']

    try:
        username = request.session['%susername' % (coi)]
        user_role = request.session['%srole' % (coi)]
    except:
        username = None
    user = models.UserProfile.objects.get(user_name = username)
    Groups = models.Groups.objects.filter(group_leader_id = user.user_id)
    Group_xois = models.GroupsPoint.objects.filter(foreignkey_id__in = Groups).values('point_id')
    

    if len(area) != 0:
        request.session['areas'] = area
    if len(area) == 0:
        area = None
    try:
        all_city = models.Area.objects.filter(
            area_country=city).values_list('area_name_en')
    except:
        all_city = None
    if content == 'poi':
        all_xoi = FilterCoiPoint('poi', coi)
        if user_role != 'admin' and user_role != 'identifier':
            all_xoi = all_xoi.filter(poi_id__in = Group_xois, identifier=role, language=language)
        else:
            all_xoi = all_xoi.filter(identifier=role, language=language)
        if area == 'all':
            all_poi = all_xoi.filter(identifier=role, verification=int(
                ver_item), area_name_en__in=all_city, language=language)
        else:
            all_poi = all_xoi.filter(
                identifier=role,
                verification=int(ver_item),
                area_name_en=area,
                language=language)
        values_list = list(all_poi.values(
            'poi_id', 'poi_title', 'identifier', 'rights'))
        data = {"all_poi": values_list}
        return JsonResponse(data)
    elif content == 'loi':
        all_xoi = FilterCoiPoint('loi', coi)
        if user_role != 'admin' and user_role != 'identifier':
            all_xoi = all_xoi.filter(route_id__in = Group_xois, identifier=role, language=language)
        else:
            all_xoi = all_xoi.filter(identifier=role, language=language)
        if area == 'all':
            all_loi = all_xoi.filter(identifier=role, verification=int(
                ver_item), area_name_en__in=all_city)
        else:
            all_loi = all_xoi.filter(
                identifier=role, verification=int(ver_item), area_name_en=area)
        values_list = list(all_loi.values('route_id', 'route_title'))
        data = {
            "all_loi": values_list
        }
        return JsonResponse(data)
    elif content == 'aoi':
        all_xoi = FilterCoiPoint('aoi', coi)
        if user_role != 'admin' and user_role != 'identifier':
            all_xoi = all_xoi.filter(aoi_id__in = Group_xois, identifier=role, language=language)
        else:
            all_xoi = all_xoi.filter(identifier=role, language=language)
        if area == 'all':
            all_aoi = all_xoi.filter(identifier=role, verification=int(
                ver_item), language=language, area_name_en__in=all_city)
        else:
            all_aoi = all_xoi.filter(
                identifier=role,
                verification=int(ver_item),
                area_name_en=area,
                language=language)
        values_list = list(all_aoi.values('aoi_id', 'title'))
        data = {
            "all_aoi": values_list
        }
        return JsonResponse(data)
    elif content == 'soi':
        all_xoi = FilterCoiPoint('soi', coi)
        if user_role != 'admin' and user_role != 'identifier':
            all_xoi = all_xoi.filter(soi_id__in = Group_xois, identifier=role, language=language)
        else:
            all_xoi = all_xoi.filter(identifier=role, language=language)
        if area == 'all':
            all_soi = all_xoi.filter(identifier=role, verification=int(
                ver_item), language=language, area_name_en__in=all_city)
        else:
            all_soi = all_xoi.filter(identifier=role, verification=int(
                ver_item), area_name_en=area, language=language)
        values_list = list(all_soi.values('soi_id', 'soi_title'))
        data = {
            "all_soi": values_list
        }
        return JsonResponse(data)
    elif content == 'group':
        if coi == '':
            coi = 'deh'
        all_group = models.Groups.objects.filter(
            verification=int(ver_item), language=language, coi_name=coi)
        values_list = list(all_group.values('group_id', 'group_name'))
        data = {
            "all_group": values_list
        }
        return JsonResponse(data)

def ajax_findpwd(request):
    account = request.POST.get('account')
    email = request.POST.get('email')
    try:
        profile = models.UserProfile.objects.get(user_name=account)
        if profile.email == email:
            new_pwd = ''.join(random.SystemRandom().choice(
                string.ascii_uppercase + string.digits) for _ in range(5))
            # 寄信
            mail_title = '文史脈流系統通知'
            mail_content = '密碼已變更,新的密碼為' + new_pwd + '請立即改為您的密碼'
            SendMailThread(mail_title, mail_content, email)

            md5_pwd = computeMD5hash(new_pwd)
            profile.password = md5_pwd
            profile.save()
            return HttpResponse('success')
        else:
            return HttpResponse('fail')
    except:
        return HttpResponse('profile')

def ajax_groups(request, coi=''):  # 建立群組
    search_group_name = request.POST.get('group_name')
    try:
        # 尋找是否已有相同名稱group
        temp = models.Groups.objects.get(group_name=search_group_name)
        if (request.POST.get('group_make') == 'edit_group') and (str(temp.group_id) != str(request.POST.get('group_id'))):
            return HttpResponse("repeat")
    except Exception as e:
        if(e.__class__.__name__ == "DoesNotExist"):
            pass
        else:
            return HttpResponse("multiple_duplicate_group_name"+ e.__class__.__name__)
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi == '':
        coi = 'deh'
    if request.method == 'POST':
        group_make = request.POST.get('group_make')
        if group_make == 'make':
            opens = request.POST.get('open')
            print("opens",opens)
            group_name = request.POST.get('group_name')
            group_info = request.POST.get('group_info')
            group_leader = request.POST.get('group_leader')
            try:
                user = models.UserProfile.objects.get(user_name=group_leader)
                group_leader_id = user.user_id
                request.session['%sis_leader' % (coi)] = "is_leader"
            except:
                return HttpResponseRedirect('/')
            try:
                max_group_id = models.Groups.objects.all().aggregate(
                    Max('group_id'))  # 取得最大group_id
                # 最大group_id轉成整數+1
                group_id = int(max_group_id['group_id__max']) + 1
            except:
                group_id = 0
            obj = models.Groups(
                group_id=group_id,
                group_name=group_name,
                group_leader_id=group_leader_id,
                group_info=group_info,
                open=opens,
                create_time=datetime.now(),
                verification=0,
                language=language,
                coi_name=coi,
            )
            
            obj.save()
            #AutoIncrementSqlSave(obj, "[dbo].[Groups]")

            mail_contnt = '有一筆新的群組:' + group_name + '上傳, 創建者為' + group_leader
            mail_title = '文史脈流驗証系統通知'
            mail_address = 'mmnetlab@locust.csie.ncku.edu.tw'
            SendMailThread(mail_title, mail_contnt, mail_address)
            
            data = json.dumps({
                'ids': group_id
            })            
            return HttpResponse(data, content_type='application/json')
        elif group_make == 'edit_group': #編輯group
            group_id = request.POST.get('group_id')
            group_name = request.POST.get('group_name')
            group_info = request.POST.get('group_info')
            opens = request.POST.get('open')
            obj = models.Groups.objects.get(group_id=group_id)
            obj.group_name = group_name
            obj.group_info = group_info

            #轉成server date format
            if request.POST.get('manage_start_time') != "" :
                obj.manage_start_time = datetime.strptime(request.POST.get('manage_start_time'), '%Y-%m-%d %H:%M') 
                obj.manage_end_time = datetime.strptime(request.POST.get('manage_end_time'), '%Y-%m-%d %H:%M')
            obj.manage = request.POST.get('manage_time')

            #更改設定狀態時，紀錄原始open狀態                       
            if opens == '1':
                obj.open = True
                obj.open_origin = True
            else:
                obj.open = False
                obj.open_origin = False
            obj.save()
            return HttpResponse('success')

def ajax_groupmember(request, coi=''):  # 存Group Member(leader)
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi == '':
        coi = 'deh'
    identifier = 'leader'
    member_id = GetMemberid()
    f = request.POST.get('group_id')
    f = int(f)
    foreignkey = models.Groups.objects.get(group_id=f)
    if request.method == 'POST':
        try:
            user = models.UserProfile.objects.get(user_name=username)
            user_id = user.user_id
        except:
            return HttpResponseRedirect('/')
        member_list = models.GroupsMember(
            member_id=member_id, user_id=user, foreignkey=foreignkey, join_time=datetime.now(), identifier=identifier)
        member_list.save()
        #AutoIncrementSqlSave(member_list, "[dbo].[GroupsMember]")
    return HttpResponse('groupmember success')

def ajax_invite(request, coi=''):  # 取得邀請列表/寄出邀請/回覆邀請/踢出群組/搜尋群組/申請群組/放入景點線區
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi == '':
        coi = 'deh'
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'search_member':  # Leader取得邀請member列表
            userid = []  # group_member already exist
            invite_str = request.POST.get('invite_str')
            all_member = models.UserProfile.objects.filter(
                user_name__icontains=invite_str)
            ingroup_member = models.GroupsMember.objects.filter(
                user_id__in=userid)  # 濾出已在群組內的id
            for i in all_member:
                if coi == 'deh' or check_user_in_coi(i, coi):
                    userid.append(i.user_id)
            for i in ingroup_member:
                userid.remove(i.user_id.user_id)
            all_member = all_member.filter(user_id__in=userid)
            values_list = list(all_member.values('user_id', 'user_name'))
            data = {
                "all_member": values_list
            }
            return JsonResponse(data)
        elif action == 'search_group':  # Member搜尋group列表
            group_str = request.POST.get('group_str')
            all_group = models.Groups.objects.filter(
                group_name__contains=group_str, open=1, verification=1, language=language, coi_name=coi)
            values_list = list(all_group.values('group_id', 'group_name'))
            data = {
                "all_group": values_list
            }
            return JsonResponse(data)
        elif action == 'join':  # Member 申請加入群組
            group_name = request.POST.get('group_name')
            group_id = request.POST.get('group_id')        
            group = models.Groups.objects.get(group_id=group_id)
            sender = models.UserProfile.objects.get(
                user_name=username)  # member info
            receiver = models.UserProfile.objects.get(
                user_id=group.group_leader_id)
            message_id = GetMessageid()
            message_exist = models.GroupsMessage.objects.filter(
                sender=sender, receiver=receiver, group_id=group, is_read=False).exists()
            check = models.GroupsMember.objects.filter(
                foreignkey=group, user_id=sender).exists()
            if check:  # 判斷收件者是否為自己
                return HttpResponse('alreay_in_group')
            else:
                if message_exist:  # 判斷是否有寄信
                    return HttpResponse('msg_exist')
                else:
                    obj = models.GroupsMessage(
                        message_id=message_id,
                        is_read=False,
                        sender=sender,
                        receiver=receiver,
                        message_type=0,
                        group_id=group,
                    )
                    AutoIncrementSqlSave(obj, "[dbo].[GroupsMessage]")
                    return HttpResponse('success')
        elif action == 'invite':  # Leader寄出邀請
            member_name = request.POST.get('member_name')
            group_id = request.POST.get('group_id')
            sender = models.UserProfile.objects.get(user_name=username)
            receiver = models.UserProfile.objects.get(user_name=member_name)
            group = models.Groups.objects.get(group_id=group_id)
            message_id = GetMessageid()
            member_exist = models.GroupsMember.objects.filter(
                user_id=receiver.user_id, foreignkey=group).exists()
            message_exist = models.GroupsMessage.objects.filter(
                sender=sender, receiver=receiver, group_id=group, is_read=False).exists()
            if sender.user_id == receiver.user_id:  # 判斷收件者是否為自己
                return HttpResponse('sameid')
            elif member_exist:  # 判斷是否在群組
                return HttpResponse('mamber_exist')
            elif coi != 'deh' and not check_user_in_coi(receiver, coi):
                return HttpResponse('user_not_in_coi')
            else:
                if message_exist:  # 判斷是否有寄信
                    return HttpResponse('msg_exist')
                else:
                    obj = models.GroupsMessage(
                        message_id=message_id,
                        is_read=False,
                        sender=sender,
                        receiver=receiver,
                        message_type=0,
                        group_id=group,
                    )
                    AutoIncrementSqlSave(obj, "[dbo].[GroupsMessage]")
                    return HttpResponse('success')
        elif action == 'reply':  # Member回覆邀請
            reply = request.POST.get('reply')
            group_id = request.POST.get('group_id')
            message_id = request.POST.get('message_id')
            group = models.Groups.objects.get(group_id=group_id)
            message = models.GroupsMessage.objects.get(message_id=message_id)
            inviter = request.POST.get('inviter')
            sender = models.UserProfile.objects.get(
                user_id=inviter)  # 是否建立一新的msg(?)
            receiver = models.UserProfile.objects.get(user_name=username)
            if reply == 'yes':                
                member_id = GetMemberid()
                try:
                    user = models.UserProfile.objects.get(user_name=username)
                    user_id = user.user_id
                except:
                    return HttpResponseRedirect('/')
                msg = models.GroupsMessage(
                    message_id=message.message_id,
                    is_read=True,
                    message_type=1,
                    group_id=group,
                    sender=sender,
                    receiver=receiver
                )
                member = models.GroupsMember(
                    member_id=member_id,
                    user_id=user,
                    join_time=datetime.now(),
                    foreignkey=group,
                    identifier='member'
                )                
                AutoIncrementSqlSave(msg, "[dbo].[GroupsMessage]")
                AutoIncrementSqlSave(member, "[dbo].[GroupsMember]")
                return HttpResponse('success')
            elif reply == 'no':
                msg = models.GroupsMessage(
                    message_id=message.message_id,
                    is_read=False,
                    message_type=-1,
                    group_id=group,
                    sender=receiver,
                    receiver=sender
                )
                AutoIncrementSqlSave(msg, "[dbo].[GroupsMessage]")
                return HttpResponse('reject')
            else:
                msg = models.GroupsMessage(
                    message_id=message.message_id,
                    is_read=True,
                    message_type=1,
                    group_id=group,
                    sender=sender,
                    receiver=receiver
                )
                AutoIncrementSqlSave(msg, "[dbo].[GroupsMessage]")
                return HttpResponse('read')
        elif action == 'application':  # Leader回覆申請
            reply = request.POST.get('reply')
            group_id = request.POST.get('group_id')
            message_id = request.POST.get('message_id')
            group = models.Groups.objects.get(group_id=group_id)
            message = models.GroupsMessage.objects.get(message_id=message_id)
            inviter = request.POST.get('applicant')
            sender = models.UserProfile.objects.get(
                user_id=inviter)  # 是否建立一新的msg(?)
            receiver = models.UserProfile.objects.get(user_name=username)
            if reply == 'agree':
                member_id = GetMemberid()
                try:
                    user = models.UserProfile.objects.get(
                        user_name=sender.user_name)  # 同意申請者
                    user_id = user.user_id
                except:
                    return HttpResponseRedirect('/')
                msg = models.GroupsMessage(
                    message_id=message.message_id,
                    is_read=True,
                    message_type=1,
                    group_id=group,
                    sender=sender,
                    receiver=receiver
                )
                member = models.GroupsMember(
                    member_id=member_id,
                    user_id=user,
                    join_time=datetime.now(),
                    foreignkey=group,
                    identifier='member'
                )
                AutoIncrementSqlSave(msg, "[dbo].[GroupsMessage]")
                AutoIncrementSqlSave(member, "[dbo].[GroupsMember]")
                return HttpResponse('success')
            elif reply == 'refuse':
                msg = models.GroupsMessage(
                    message_id=message_id,
                    is_read=False,
                    message_type=-1,
                    group_id=group,
                    sender=receiver,
                    receiver=sender
                )
                AutoIncrementSqlSave(msg, "[dbo].[GroupsMessage]")
                return HttpResponse('refuse')
            else:
                msg = models.GroupsMessage(
                    message_id=message_id,
                    is_read=True,
                    message_type=1,
                    group_id=group,
                    sender=sender,
                    receiver=receiver
                )
                AutoIncrementSqlSave(msg, "[dbo].[GroupsMessage]")
                return HttpResponse('read')
        elif action == 'kickout':
            group_id = request.POST.get('group_id')
            member_id = request.POST.get('member_id')
            kick_member = models.GroupsMember.objects.filter(
                foreignkey=group_id, user_id=member_id)
            kick_member.delete()
            return HttpResponse('success')
        elif action == 'put_interest':  # 放Poi/Loi/Aoi/Soi進入群組(不能放多個群組)
            group_id = request.POST.get('group_id')
            types = request.POST.get('types')
            point_id = request.POST.get('type_id')
            group = models.Groups.objects.get(group_id=group_id)
            try:
                max_id = models.GroupsPoint.objects.all().aggregate(Max('id'))  # 取得最大id
                ids = int(max_id['id__max']) + 1  # 最大id轉成整數+1
            except:
                ids = 0
            if models.GroupsPoint.objects.filter(types=types, point_id=point_id, foreignkey=group).exists():
                return HttpResponse('samepoint')
            else:
                interest = models.GroupsPoint(
                    id=ids,
                    foreignkey=group,
                    types=types,
                    point_id=point_id
                )
                #AutoIncrementSqlSave(interest, "[dbo].[GroupsPoint]")
                interest.save()
                return HttpResponse('success')
        elif action == 'remove_interest':
            group_id = request.POST.get('group_id')
            types = request.POST.get('types')
            point_id = request.POST.get('type_id')
            group = models.Groups.objects.get(
                group_id=group_id)  # 刪除群組內Poi/Loi/Aoi/Soi
            interest = models.GroupsPoint.objects.get(
                foreignkey=group, types=types, point_id=point_id)
            interest.delete()
            return HttpResponse('success')
        else:
            return HttpResponse(action)
    else:
        return HttpResponse('get')

def ajax_historynew(request):
    if request.method != 'POST':
        return HttpResponse('Error')

    log_type = request.POST.get('log_type')  # web/mobile/action
    content_type = request.POST.get('content_type')
    coi = request.POST.get('coi')
    start = request.POST.get('start_time')
    end = request.POST.get('end_time')
    username = request.POST.get('user_name')

    is_admin = request.session['%srole' % (coi)] == 'admin'

    start_time = datetime.strptime(start, '%Y-%m-%dT%H:%M')
    end_time = datetime.strptime(end, '%Y-%m-%dT%H:%M')

    user = models.UserProfile.objects.get(user_name=username)

    if log_type == 'mobile':
        if coi != '':
            if is_admin:
                page_filter = 'API/%s/' % (coi)
                log_data = models.Logs.objects.filter(
                    user_id=user.user_id, dt__range=[start_time, end_time], page__contains=page_filter)
            else:
                log_data = models.Logs.objects.filter(
                    Q(page__contains='API/%s/poi_detail' % (coi)) |
                    Q(page__contains='API/%s/loi_detail' % (coi)) |
                    Q(page__contains='API/%s/aoi_detail' % (coi)) |
                    Q(page__contains='API/%s/soi_detail' % (coi)),
                    user_id=user.user_id, dt__range=[start_time, end_time])
        else:
            log_data = models.Logs.objects.filter(
                Q(page__contains='API/nearby') |
                Q(page__contains='API/user') |
                Q(page__contains='API/poi_detail') |
                Q(page__contains='API/loi_detail') |
                Q(page__contains='API/aoi_detail') |
                Q(page__contains='API/soi_detail'),
                user_id=user.user_id, dt__range=[start_time, end_time])
            if not is_admin:
                log_data = log_data.exclude(
                    Q(page__contains='API/nearby') |
                    Q(page__contains='API/user'))
    else:
        page_filter = 'tw/%s%s_detail' % (coi, content_type)        
        log_data = models.Logs.objects.filter(
            user_id=user.user_id, dt__range=[start_time, end_time], page__contains=page_filter)        

    data = list(log_data.order_by('dt').values(
        'dt', 'page', 'ulatitude', 'ulongitude'))
    new_data = []
    for row in data:
        page_split = row['page'].split('/')
        new_page = page_split[-1]
        if new_page[0] < '0' or new_page[0] > '9':
            row['page'] = {'title': new_page, 'type': 'search'}
            new_data.append(row)
        else:
            point_id = int(new_page)
            if log_type == 'mobile':
                content_type = page_split[-2].split('_')[0][-3:]
            try:
                print(content_type)
                if content_type == 'poi':
                    point = models.Poi.objects.filter(
                        poi_id=point_id).values_list('poi_id', 'poi_title')
                elif content_type == 'loi':
                    point = models.RoutePlanning.objects.filter(
                        route_id=point_id).values_list('route_id', 'route_title')
                elif content_type == 'aoi':
                    point = models.Aoi.objects.filter(
                        aoi_id=point_id).values_list('aoi_id', 'title')
                elif content_type == 'soi':                    
                    point = models.SoiStory.objects.filter(
                        soi_id=point_id).values_list('soi_id', 'soi_title')       
                print(row)             
                point_latilong = find_latilong(point_id, content_type)                
                row['page'] = {
                    'id': point[0][0],
                    'title': point[0][1],
                    'lati': point_latilong[0],
                    'long': point_latilong[1],
                    'addr': point_latilong[2],
                    'type': content_type
                }
                new_data.append(row)
            except:
                pass
    return JsonResponse(new_data, safe=False)

def ajax_loiaoipoint(request):
    point_id = request.POST.get('id')
    point_type = request.POST.get('type')
    
    data = []
    if point_type == 'loi':
        try:
            route = models.RoutePlanning.objects.get(route_id=point_id)
        except ObjectDoesNotExist:
            return JsonResponse(data, safe=False)

        point_list = models.Sequence.objects.filter(foreignkey=route).values_list('poi_id', flat=True)
    else:
        try:
            aoi = models.Aoi.objects.get(aoi_id=point_id)
        except ObjectDoesNotExist:
            return JsonResponse(data, safe=False)
        
        point_list = models.AoiPois.objects.filter(aoi_id_fk=aoi).values_list('poi_id', flat=True)

    for poi_id in point_list:
        poi = models.Poi.objects.get(poi_id=poi_id)
        data.append([ poi.latitude, poi.longitude, poi.poi_title, 'groupLoi'])    

    return JsonResponse([data, list(point_list)], safe=False)

def ajax_allloiaoi(request):
    key_word = request.POST.get('key_word')
    coi = request.POST.get('coi')

    try:
        language = request.session['%slanguage' % (coi)]
    except:
        language = '中文'    

    all_loi = FilterCoiPoint('loi', coi, 1)
    all_aoi = FilterCoiPoint('aoi', coi, 1)
    
    all_loi = all_loi.filter(open=1, language=language)  # open= 1 (公開)
    all_aoi = all_aoi.filter(open=1, language=language)  # open= 1 (公開)
    
    loi_ans = models.RoutePlanning.objects.none()
    aoi_ans = models.Aoi.objects.none()

    if key_word != '':
        key_list = key_word.split()
        for element in key_list:            
            user_list = models.UserProfile.objects.filter(nickname__contains=element).values_list('user_name', flat=True)
            
            loi_ans = loi_ans | all_loi.filter(Q(route_title__contains=element) |
                Q(identifier__contains=element) |
                Q(identifier__in=user_list) |
                Q(contributor__contains=element))

            aoi_ans = aoi_ans | all_aoi.filter(Q(title__contains=element) |
                Q(owner__contains=element) |
                Q(owner__in=user_list) |
                Q(contributor__contains=element))
    else:
        loi_ans = all_loi
        aoi_ans = all_aoi

    loi_list = list(loi_ans.values_list('route_id', 'route_title'))
    aoi_list = list(aoi_ans.values_list('aoi_id', 'title'))

    data = {
        'loi': loi_list,
        'aoi': aoi_list
    }

    return JsonResponse(data)

#文資學堂
def ajax_game_setting(request): # 儲存走讀設定
    if request.method != 'POST':
        return HttpResponse('Error')

    room_id = int(request.POST.get('room_id'))

    if models.EventSetting.objects.filter(id=room_id).exclude(is_playing=0).count() != 0:
        return HttpResponse('Start')  
    game = json.loads(request.POST.get('game'))
    if game['auto_start']:
        game['start_time'] = datetime.strptime(game['start_time'], '%Y-%m-%d %H:%M')
        game['end_time'] = game['start_time'] + timedelta(minutes=int(game['play_time']))
    
    prize_detail = game['game_prize_detail']
    list_prize_detail = prize_detail.split(",", -1)
    current_num = {}
    for i in range(0, len(list_prize_detail)-1, 3):
        prize_id = list_prize_detail[i+1]
        Prize = models.prize_profile.objects.get(prize_id=prize_id)
        prize_count = list_prize_detail[i+2]
        
        if prize_id in current_num:
            if int(prize_count) > current_num[prize_id]:
                print("ERROR in ajax_game_setting")
                return HttpResponse("獎品-" + str(Prize.prize_name) + "的數量不足，現有獎品數量為:"+ str(current_num[prize_id])) 
            else:
                current_num[prize_id] = current_num[prize_id]-int(prize_count)
        else:
            current_num.update({prize_id:Prize.prize_number})    
            if int(prize_count) > current_num[prize_id]:
                print("ERROR in ajax_game_setting")
                return HttpResponse("獎品-" + str(Prize.prize_name) + "的數量不足，現有獎品數量為:"+ str(current_num[prize_id]))
            else:
                current_num[prize_id] = current_num[prize_id]-int(prize_count)

    models.EventSetting.objects.update_or_create(
        id=room_id,
        defaults=game   
    )
    return HttpResponse('Success')

def ajax_game_chest_setting(request): # 儲存題目設定
    if request.method != 'POST':
        return HttpResponse('Error')

    room_id = int(request.POST.get('room_id'))
    
    if models.GameSetting.objects.filter(id=room_id).exclude(is_playing=0).count() != 0:
        return HttpResponse('Start')  
        
    del_chest = json.loads(request.POST.get('del_chest[]'))
    del_media = json.loads(request.POST.get('del_media[]'))
    chestSetting = json.loads(request.POST.get('chest[]'))

    for del_att in del_media:
        att = models.GameATT.objects.get(ATT_id=del_att)
        if models.GameATT.objects.filter(ATT_url=att.ATT_url).count() + models.GameATTHistory.objects.filter(ATT_url=att.ATT_url).count() == 1:
            att.ATT_url.delete()
        att.delete()
    
    models.GameChestSetting.objects.filter(id__in=del_chest,room_id_id=room_id).delete()

    for c in chestSetting:
        localId = c['localId']
        del c['localId']
        x = models.GameChestSetting.objects.update_or_create(
            id=c['id'],
            defaults=c
        )[0]

        for att in request.FILES.getlist(localId):
            detail = att.name.split('.')
            if detail[0] == 'expound' or detail[0] == 'image' or detail[0] == 'video' or detail[0] == 'audio':
                att.name = detail[0] + '-' + str(uuid.uuid1()) + '.' + detail[1]
                y = models.GameATT.objects.create(
                    ATT_url = att,
                    ATT_upload_time = datetime.now(),
                    ATT_format = detail[0],
                    chest_id = x
                )
                y.save()

    return HttpResponse('Success')

def ajax_event_chest_setting(request): # 儲存題目設定
    if request.method != 'POST':
        return HttpResponse('Error')

    room_id = int(request.POST.get('room_id'))
    
    if models.EventSetting.objects.filter(id=room_id).exclude(is_playing=0).count() != 0:
        return HttpResponse('Start')  
        
    del_chest = json.loads(request.POST.get('del_chest[]'))
    del_media = json.loads(request.POST.get('del_media[]'))
    chestSetting = json.loads(request.POST.get('chest[]'))

    for del_att in del_media:
        att = models.EventATT.objects.get(ATT_id=del_att)
        if models.EventATT.objects.filter(ATT_url=att.ATT_url).count() + models.EventATTHistory.objects.filter(ATT_url=att.ATT_url).count() == 1:
            att.ATT_url.delete()
        att.delete()
    
    models.EventChestSetting.objects.filter(id__in=del_chest,room_id_id=room_id).delete()

    for c in chestSetting:
        localId = c['localId']
        del c['localId']
        x = models.EventChestSetting.objects.update_or_create(
            id=c['id'],
            defaults=c
        )[0]

        for att in request.FILES.getlist(localId):
            detail = att.name.split('.')
            if detail[0] == 'expound' or detail[0] == 'image' or detail[0] == 'video' or detail[0] == 'audio':
                att.name = detail[0] + '-' + str(uuid.uuid1()) + '.' + detail[1]
                y = models.EventATT.objects.create(
                    ATT_url = att,
                    ATT_upload_time = datetime.now(),
                    ATT_format = detail[0],
                    chest_id = x
                )
                y.save()

    return HttpResponse('Success')

def ajax_game_chest_copy(request): # 複製題目設定
    if request.method != 'POST':
        return HttpResponse('Error')

    copy_chest = json.loads(request.POST.get('copy_chest[]'))

    if models.GameSetting.objects.filter(id__in=copy_chest).exclude(is_playing=0).count() != 0:
        return HttpResponse('Start')
    
    c = json.loads(request.POST.get('chest'))

    copy_media = []

    for item in copy_chest:
        c['room_id_id'] = item
        x = models.GameChestSetting.objects.update_or_create(
            id=c['id'],
            defaults=c
        )[0]

        if len(copy_media) != 0:
            for att in copy_media:
                y = models.GameATT.objects.create(
                    ATT_url = att.ATT_url,
                    ATT_upload_time = att.ATT_upload_time,
                    ATT_format = att.ATT_format,
                    chest_id = x
                )
                y.save()    
        
        else:
            for att in models.GameATT.objects.filter(ATT_id__in=json.loads(request.POST.get('oldMedia[]'))).order_by('ATT_id'):
                y = models.GameATT.objects.create(
                    ATT_url = att.ATT_url,
                    ATT_upload_time = att.ATT_upload_time,
                    ATT_format = att.ATT_format,
                    chest_id = x
                )
                y.save()
                copy_media.append(y)

            for att in request.FILES.getlist('newMedia[]'):
                detail = att.name.split('.')
                if detail[0] == 'expound' or detail[0] == 'image' or detail[0] == 'video' or detail[0] == 'audio':
                    att.name = detail[0] + '-' + str(uuid.uuid1()) + '.' + detail[1]
                    y = models.GameATT.objects.create(
                        ATT_url = att,
                        ATT_upload_time = datetime.now(),
                        ATT_format = detail[0],
                        chest_id = x
                    )
                    y.save()
                    copy_media.append(y)

    return HttpResponse('Success')

def ajax_event_chest_copy(request): # 複製題目設定
    if request.method != 'POST':
        return HttpResponse('Error')

    copy_chest = json.loads(request.POST.get('copy_chest[]'))

    if models.EventSetting.objects.filter(id__in=copy_chest).exclude(is_playing=0).count() != 0:
        return HttpResponse('Start')
    
    c = json.loads(request.POST.get('chest'))

    copy_media = []

    for item in copy_chest:
        c['room_id_id'] = item
        x = models.EventChestSetting.objects.update_or_create(
            id=c['id'],
            defaults=c
        )[0]

        if len(copy_media) != 0:
            for att in copy_media:
                y = models.EventATT.objects.create(
                    ATT_url = att.ATT_url,
                    ATT_upload_time = att.ATT_upload_time,
                    ATT_format = att.ATT_format,
                    chest_id = x
                )
                y.save()    
        
        else:
            for att in models.EventATT.objects.filter(ATT_id__in=json.loads(request.POST.get('oldMedia[]'))).order_by('ATT_id'):
                y = models.EventATT.objects.create(
                    ATT_url = att.ATT_url,
                    ATT_upload_time = att.ATT_upload_time,
                    ATT_format = att.ATT_format,
                    chest_id = x
                )
                y.save()
                copy_media.append(y)

            for att in request.FILES.getlist('newMedia[]'):
                detail = att.name.split('.')
                if detail[0] == 'expound' or detail[0] == 'image' or detail[0] == 'video' or detail[0] == 'audio':
                    att.name = detail[0] + '-' + str(uuid.uuid1()) + '.' + detail[1]
                    y = models.EventATT.objects.create(
                        ATT_url = att,
                        ATT_upload_time = datetime.now(),
                        ATT_format = detail[0],
                        chest_id = x
                    )
                    y.save()
                    copy_media.append(y)

    return HttpResponse('Success')

def ajax_game_create(request): # 新增場次
    if request.method != 'POST':
        return HttpResponse('Error')

    models.GameSetting.objects.create(
        group_id_id = request.POST.get('group_id'),
        room_name = request.POST.get('room_name'),
        auto_start = False,
        play_time = 1,
        is_playing = 0
    )
    return HttpResponse('Success')

def ajax_event_room_create(request): # 新增場次
    if request.method != 'POST':
        return HttpResponse('Error')

    models.EventSetting.objects.create(
        event_id_id = request.POST.get('event_id'),
        room_name = request.POST.get('room_name'),
        auto_start = False,
        play_time = 1,
        is_playing = 0,
        game_prize_detail = "沒有設置獎品"
    )
    return HttpResponse('Success')

def ajax_game_remove(request): # 刪除場次
    if request.method != 'POST':
        return HttpResponse('Error')

    game = models.GameSetting.objects.get(id=int(request.POST.get('room_id')))
    if game.is_playing != 0:
        return HttpResponse('Start')
    chest = models.GameChestSetting.objects.filter(room_id=game)
    atts = models.GameATT.objects.filter(chest_id__in=chest)
    for att in atts:
        if models.GameATT.objects.filter(ATT_url=att.ATT_url).count() + models.GameATTHistory.objects.filter(ATT_url=att.ATT_url).count() == 1:
            att.ATT_url.delete()
        att.delete()
    history = models.GameHistory.objects.filter(room_id=game)
    chest = models.GameChestHistory.objects.filter(game_id__in=history)
    atts = models.GameATTHistory.objects.filter(chest_id__in=chest)
    for att in atts:
        if models.GameATT.objects.filter(ATT_url=att.ATT_url).count() + models.GameATTHistory.objects.filter(ATT_url=att.ATT_url).count() == 1:
            att.ATT_url.delete()
        att.delete()
    record = models.GameRecordHistory.objects.filter(game_id__in=history)
    atts = models.GameATTRecord.objects.filter(record_id__in=record)
    for att in atts:
        if models.GameATTRecord.objects.filter(ATT_url=att.ATT_url).count() == 1:
            att.ATT_url.delete()
        att.delete()

    game.delete()  

    return HttpResponse('Success')

def ajax_event_room_remove(request): # 刪除場次
    if request.method != 'POST':
        return HttpResponse('Error')

    game = models.EventSetting.objects.get(id=int(request.POST.get('room_id')))
    if game.is_playing != 0:
        return HttpResponse('Start')
    chest = models.EventChestSetting.objects.filter(room_id=game)
    atts = models.EventATT.objects.filter(chest_id__in=chest)
    for att in atts:
        if models.EventATT.objects.filter(ATT_url=att.ATT_url).count() + models.EventATTHistory.objects.filter(ATT_url=att.ATT_url).count() == 1:
            att.ATT_url.delete()
        att.delete()
    history = models.EventHistory.objects.filter(room_id=game)
    chest = models.EventChestHistory.objects.filter(game_id__in=history)
    atts = models.EventATTHistory.objects.filter(chest_id__in=chest)
    for att in atts:
        if models.EventATT.objects.filter(ATT_url=att.ATT_url).count() + models.EventATTHistory.objects.filter(ATT_url=att.ATT_url).count() == 1:
            att.ATT_url.delete()
        att.delete()
    record = models.EventRecordHistory.objects.filter(game_id__in=history)
    atts = models.EventATTRecord.objects.filter(record_id__in=record)
    for att in atts:
        if models.EventATTRecord.objects.filter(ATT_url=att.ATT_url).count() == 1:
            att.ATT_url.delete()
        att.delete()

    game.delete()  

    return HttpResponse('Success')

def ajax_game_correction(request): # 儲存批改結果
    if request.method != 'POST':
        return HttpResponse('Error')
    try:
        game_id = int(request.POST.get('game_id'))
        if 'record_id' in request.POST:
            record_id = int(request.POST.get('record_id'))
            point = int(request.POST.get('point'))
            record = models.GameRecordHistory.objects.get(game_id_id=game_id, id=record_id)
            if record.chest_id.point != None and record.chest_id.point < point:
                raise Exception("point overflow")
            else:
                record.point = point
                record.save()
        else:
            record = models.GameRecordHistory.objects.filter(game_id_id=game_id, correctness__isnull=True)
            if record.filter(point__isnull=True).count() > 0:
                raise Exception("grading incomplete")
            else:
                for r in record:

                    max_poi_id = models.Poi.objects.all().aggregate(Max('poi_id'))  # 取得最大poi_id
                    poi_id = int(max_poi_id['poi_id__max']) + 1  # 最大poi_id轉成整數+1
                    obj = models.Poi(
                        poi_id=poi_id,
                        subject='體驗的',
                        type1='自然景觀',
                        format='自然景觀',
                        period='現代台灣',
                        year=r.answer_time.year,
                        keyword1='{}多媒體答題'.format('文資學堂' if r.game_id.room_id.group_id.coi_name == 'deh' else '踏溯學堂'),
                        poi_title='{}{}'.format(r.chest_id.question[:95], '...' if len(r.chest_id.question) > 95 else ''),
                        poi_description_1=r.answer,
                        poi_address='無',
                        latitude=r.lat,
                        longitude=r.lng,
                        creator=r.user_id.user_name,
                        publisher=r.user_id.user_name,
                        contributor=r.user_id.user_name,
                        identifier=r.user_id.role,
                        rights=r.user_id.user_name,
                        language=r.game_id.room_id.group_id.language,
                        open=False,
                        verification=0
                    )
                    AutoIncrementSqlSave(obj, "[dbo].[dublincore]")
                    
                    AddCoiPoint(poi_id, "poi", r.game_id.room_id.group_id.coi_name)

                    rmedia = models.GameATTRecord.objects.filter(record_id=r)
                    for m in rmedia:                    
                        max_picture_id = models.Mpeg.objects.all().aggregate(Max('picture_id'))  # 取得最大picture_id                    
                        picture_id = int(max_picture_id['picture_id__max']) + 1  # 最大picture_id轉成整數+1
                        if m.ATT_format == 'image':
                            picture_url = '../player_pictures/media/'
                            media_format = 1
                        elif m.ATT_format == 'video':
                            picture_url = '../player_pictures/media/audio/'
                            media_format = 2
                        elif m.ATT_format == 'video':
                            picture_url = '../player_pictures/media/video/'
                            media_format = 4
                        else:
                            continue
                        media, media_name = ManageMediaFile(
                            obj, picture_id, r.user_id.user_name, m.ATT_url, picture_url, media_format)
                        print(str(m.ATT_url), media_name)
                        AutoIncrementSqlSave(media, '[dbo].[mpeg]')

                record.exclude(point=0).update(correctness=True)
                record.filter(point=0).update(correctness=False)

    except Exception as ex:
        traceback.print_exc()
        return HttpResponse('Error')
    return HttpResponse('Success')

def ajax_events(request, coi=''):  # 建立活動
    search_event_name = request.POST.get('event_name')
    print("event_name = ",search_event_name)
    try:
        # 尋找是否已有相同名稱event
        temp = models.Events.objects.get(Event_name=search_event_name)
        if (request.POST.get('event_make') == 'edit_event') and (str(temp.Event_id) != str(request.POST.get('event_id'))):
            return HttpResponse("repeat")
    except Exception as e:
        if(e.__class__.__name__ == "DoesNotExist"):
            pass
        else:
            return HttpResponse("repeat")
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]

        print("creat event... user = ",username)
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi == '':
        coi = 'deh'
    if request.method == 'POST':
        event_start_time = datetime.strptime(request.POST.get('event_start_time'), '%Y-%m-%d %H:%M') 
        event_end_time = datetime.strptime(request.POST.get('event_end_time'), '%Y-%m-%d %H:%M')
        event_make = request.POST.get('event_make')
        if event_make == 'make':
            opens = request.POST.get('open')
            event_name = request.POST.get('event_name')
            event_info = request.POST.get('event_info')        
            try:
                user = models.UserProfile.objects.get(user_name=username)
                event_leader_id = user.user_id
                request.session['%sis_leader' % (coi)] = "is_leader"
            except:
                return HttpResponseRedirect('/')
            try:
                max_event_id = models.Events.objects.all().aggregate(Max('Event_id'))  # 取得最大event_id
                # 最大event_id轉成整數+1
                event_id = int(max_event_id['Event_id__max']) + 1
                print("取得最大id",event_id)
              

                obj = models.Events(
                    Event_id=event_id,
                    Event_name=event_name,
                    Event_leader_id=event_leader_id,
                    Event_info=event_info,
                    language=language,
                    verification=1,
                    open=opens,
                    coi_name=coi,
                    start_time= event_start_time,
                    end_time= event_end_time,
                )
                print("leader id",event_leader_id)
                
                obj.save()

                mail_contnt = coi+'有一筆新的活動:' + event_name + '上傳, 創建者為' + username
                mail_title = '文史脈流驗証系統通知'
                mail_address = 'mmnetlab@locust.csie.ncku.edu.tw'
                SendMailThread(mail_title, mail_contnt, mail_address)
                
                data = json.dumps({
                    'ids': event_id
                })
                print("ids = ",event_id)
            except Exception as e:
                print("exception happened")
                print(e)          
            return HttpResponse(data, content_type='application/json')
        elif event_make == 'edit_event': #編輯event
            event_id = request.POST.get('event_id')
            event_name = request.POST.get('event_name')
            event_info = request.POST.get('event_info')
            opens = request.POST.get('open')
            obj = models.Events.objects.get(Event_id=event_id)
            obj.Event_name = event_name
            obj.Event_info = event_info
            obj.start_time = event_start_time
            obj.end_time = event_end_time

            if opens == '1':
                obj.open = True
            else:
                obj.open = False
            obj.save()
            return HttpResponse('success')

def ajax_eventmember(request, coi=''):  # 存event Member(leader)
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        print("creat member... user = ",username)
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi == '':
        coi = 'deh'
    identifier = 'leader'
    member_id = GetMemberid()
    f = request.POST.get('event_id')
    print("小夫不要 : "+str(f))
    f = int(f)
    foreignkey = models.Events.objects.get(Event_id=f)
    if request.method == 'POST':
        try:
            user = models.UserProfile.objects.get(user_name=username)
            user_id = user.user_id
        except:
            return HttpResponseRedirect('/')
        member_list = models.EventsMember(
            user_id=user, event_id=foreignkey, identifier=identifier)
        print("user_id",user.user_id)
        member_list.save()
    return HttpResponseRedirect('/make_player')

def ajax_event_invite(request, coi=''):  # 取得邀請列表/寄出邀請/回覆邀請/踢出群組/搜尋群組/申請群組/放入景點線區
    print("COI : ",coi)
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi == '':
        coi = 'deh'
    if request.method == 'POST':            
        action = request.POST.get('action')
        if action == 'search_member':  # Leader取得邀請member列表         #***************************
            userid = []  # event_member already exist
            invite_str = request.POST.get('invite_str')
            all_member = models.UserProfile.objects.filter(user_name__icontains=invite_str)
            inevent_member = models.EventsMember.objects.filter(user_id__in=userid)  # 濾出已在群組內的id
            for i in all_member:
                if coi == 'deh' or check_user_in_coi(i, coi):
                    userid.append(i.user_id)
            for i in inevent_member:
                userid.remove(i.user_id.user_id)
            all_member = all_member.filter(user_id__in=userid)
            values_list = list(all_member.values('user_id', 'user_name'))
            data = {
                "all_member": values_list
            }
            return JsonResponse(data)
        elif action == 'search_event':  # Member搜尋event列表
            event_str = request.POST.get('event_str')
            all_event = models.Events.objects.filter(Event_name__contains=event_str, open=1, verification=1, language=language, coi_name=coi)
            values_list = list(all_event.values('Event_id', 'Event_name'))
            data = {
                "all_event": values_list
            }
            return JsonResponse(data)
        elif action == 'join':  # Member 申請加入群組
            event_name = request.POST.get('event_name')
            event_id = request.POST.get('event_id')        
            event = models.Events.objects.get(Event_id=event_id)
            sender = models.UserProfile.objects.get(user_name=username)  # member info
            receiver = models.UserProfile.objects.get(user_id=event.Event_leader_id)
            message_id = GetEventMessageid()
            message_exist = models.EventsMessage.objects.filter(sender=sender, receiver=receiver, Event_id=event, is_read=False).exists()
            check = models.EventsMember.objects.filter(event_id=event, user_id=sender).exists()
            if check:  # 判斷收件者是否為自己
                return HttpResponse('alreay_in_event')
            else:
                if message_exist:  # 判斷是否有寄信
                    return HttpResponse('msg_exist')
                else:
                    obj = models.EventsMessage(
                        message_id=message_id,
                        is_read=False,
                        sender=sender,
                        receiver=receiver,
                        message_type=0,
                        Event_id=event,
                    )
                    print("洨夫我在這了")
                    # AutoIncrementSqlSave(obj, "[dbo].[EventsMessage]")#*********************
                    obj.save()
                    return HttpResponse('success')
        elif action == 'invite':  # Leader寄出邀請
            member_name = request.POST.get('member_name')
            event_id = request.POST.get('event_id')
            sender = models.UserProfile.objects.get(user_name=username)
            receiver = models.UserProfile.objects.get(user_name=member_name)
            event = models.Events.objects.get(Event_id=event_id)
            message_id = GetEventMessageid()
            member_exist = models.EventsMember.objects.filter(user_id=receiver.user_id, event_id=event).exists()
            message_exist = models.EventsMessage.objects.filter(sender=sender, receiver=receiver, Event_id=event, is_read=False).exists()
            if sender.user_id == receiver.user_id:  # 判斷收件者是否為自己
                return HttpResponse('sameid')
            elif member_exist:  # 判斷是否在活動
                return HttpResponse('mamber_exist')
            elif coi != 'deh' and not check_user_in_coi(receiver, coi):
                return HttpResponse('user_not_in_coi')
            else:
                if message_exist:  # 判斷是否有寄信
                    return HttpResponse('msg_exist')
                else:
                    obj = models.EventsMessage(
                        message_id=message_id,
                        is_read=False,
                        sender=sender,
                        receiver=receiver,
                        message_type=0,
                        Event_id=event,
                    )
                    # AutoIncrementSqlSave(obj, "[dbo].[EventsMessage]")#*********************
                    obj.save()
                    return HttpResponse('success')
        elif action == 'reply':  # Member回覆邀請
            reply = request.POST.get('reply')
            event_id = request.POST.get('event_id')
            message_id = request.POST.get('message_id')
            event = models.Events.objects.get(Event_id=event_id)
            message = models.EventsMessage.objects.get(message_id=message_id)
            inviter = request.POST.get('inviter')
            sender = models.UserProfile.objects.get(user_id=inviter)  # 是否建立一新的msg(?)
            receiver = models.UserProfile.objects.get(user_name=username)
            if reply == 'yes':                
                member_id = GetEventMemberid()
                try:
                    user = models.UserProfile.objects.get(user_name=username)
                    user_id = user.user_id
                except:
                    return HttpResponseRedirect('/')
                msg = models.EventsMessage(
                    message_id=message.message_id,
                    is_read=True,
                    message_type=1,
                    Event_id=event,
                    sender=sender,
                    receiver=receiver
                )
                member = models.EventsMember(
                    member_id=member_id,
                    user_id=user,
                    event_id=event,
                    identifier='member'
                )                
                # AutoIncrementSqlSave(msg, "[dbo].[EventsMessage]")#*********************
                msg.save()
                AutoIncrementSqlSave(member, "[dbo].[EventsMember]")#*********************
                return HttpResponse('success')
            elif reply == 'no':
                msg = models.EventsMessage(
                    message_id=message.message_id,
                    is_read=False,
                    message_type=-1,
                    Event_id=event,
                    sender=receiver,
                    receiver=sender
                )
                # AutoIncrementSqlSave(msg, "[dbo].[EventsMessage]")
                msg.save()
                return HttpResponse('reject')
            else:
                msg = models.EventsMessage(
                    message_id=message.message_id,
                    is_read=True,
                    message_type=1,
                    Event_id=event,
                    sender=sender,
                    receiver=receiver
                )
                # AutoIncrementSqlSave(msg, "[dbo].[EventsMessage]")
                msg.save()
                return HttpResponse('read')
        elif action == 'application':  # Leader回覆申請
            reply = request.POST.get('reply')
            event_id = request.POST.get('event_id')
            message_id = request.POST.get('message_id')
            event = models.Events.objects.get(Event_id=event_id)
            message = models.EventsMessage.objects.get(message_id=message_id)
            inviter = request.POST.get('applicant')
            sender = models.UserProfile.objects.get(user_id=inviter)  # 是否建立一新的msg(?)
            receiver = models.UserProfile.objects.get(user_name=username)
            if reply == 'agree':
                member_id = GetEventMemberid()
                try:
                    user = models.UserProfile.objects.get(user_name=sender.user_name)  # 同意申請者
                    user_id = user.user_id
                except:
                    return HttpResponseRedirect('/')
                msg = models.EventsMessage(
                    message_id=message.message_id,
                    is_read=True,
                    message_type=1,
                    Event_id=event,
                    sender=sender,
                    receiver=receiver
                )
                member = models.EventsMember(
                    member_id=member_id,
                    user_id=user,
                    event_id=event,
                    identifier='member'
                )
                # AutoIncrementSqlSave(msg, "[dbo].[EventsMessage]")
                msg.save()
                AutoIncrementSqlSave(member, "[dbo].[EventsMember]")
                return HttpResponse('success')
            elif reply == 'refuse':
                msg = models.EventsMessage(
                    message_id=message_id,
                    is_read=False,
                    message_type=-1,
                    Event_id=event,
                    sender=receiver,
                    receiver=sender
                )
                # AutoIncrementSqlSave(msg, "[dbo].[EventsMessage]")
                msg.save()
                return HttpResponse('refuse')
            else:
                msg = models.EventsMessage(
                    message_id=message_id,
                    is_read=True,
                    message_type=1,
                    Event_id=event,
                    sender=sender,
                    receiver=receiver
                )
                # AutoIncrementSqlSave(msg, "[dbo].[EventsMessage]")
                msg.save()
                return HttpResponse('read')
        elif action == 'kickout':
            event_id = request.POST.get('event_id')
            member_id = request.POST.get('member_id')
            kick_member = models.EventsMember.objects.filter(event_id=event_id, user_id=member_id)
            kick_member.delete()
            return HttpResponse('success')
        # elif action == 'put_interest':  # 放Poi/Loi/Aoi/Soi進入群組(不能放多個群組)
        #     group_id = request.POST.get('group_id')
        #     types = request.POST.get('types')
        #     point_id = request.POST.get('type_id')
        #     group = models.Groups.objects.get(group_id=group_id)
        #     try:
        #         max_id = models.GroupsPoint.objects.all().aggregate(Max('id'))  # 取得最大id
        #         ids = int(max_id['id__max']) + 1  # 最大id轉成整數+1
        #     except:
        #         ids = 0
        #     if models.GroupsPoint.objects.filter(types=types, point_id=point_id, foreignkey=group).exists():
        #         return HttpResponse('samepoint')
        #     else:
        #         interest = models.GroupsPoint(
        #             id=ids,
        #             foreignkey=group,
        #             types=types,
        #             point_id=point_id
        #         )
        #         AutoIncrementSqlSave(interest, "[dbo].[GroupsPoint]")
        #         return HttpResponse('success')
        # elif action == 'remove_interest':
        #     group_id = request.POST.get('group_id')
        #     types = request.POST.get('types')
        #     point_id = request.POST.get('type_id')
        #     group = models.Groups.objects.get(
        #         group_id=group_id)  # 刪除群組內Poi/Loi/Aoi/Soi
        #     interest = models.GroupsPoint.objects.get(
        #         foreignkey=group, types=types, point_id=point_id)
        #     interest.delete()
        #     return HttpResponse('success')
        else:
            return HttpResponse(action)
    else:
        return HttpResponse('get')

######local functions######

def ManageMediaFile(foreignkey, picture_id, username, afile, picture_url, media_format):  # 處理多媒體資料(相片/聲音/影片)
    picture_upload_user = username
    picture_rights = username
    picture_upload_time = datetime.now()
    picture_size = round(afile.size/1024, 2)  
    picture_type = afile.name.split(".")[-1]  
    new_name = str(picture_upload_time.year) + str(picture_upload_time.month) + str(picture_upload_time.hour) + \
        str(picture_upload_time.minute) + str(picture_upload_time.second) + \
        '_' + str(picture_id) + '.' + picture_type
    picture_name = new_name  # new picture name
    picture_url += str(picture_name)

    if media_format == 1:
        media_type = ''
    elif media_format == 2:
        media_type = 'audio/'
    elif media_format == 4:
        media_type = 'video/'

    print("ManageMediaFile")
    print("media_dir:", media_dir, "media_type:",media_type, "picture_name:", str(picture_name), "picture_type:", picture_type)
    with open(media_dir + media_type + str(picture_name), 'wb+') as dest_file:
        for chunk in afile.chunks():
            dest_file.write(chunk)

    if media_format == 4:
        picture_url = '../player_pictures/media/video/%s' % (picture_name)
        """ check = video_converter.check_codec(
            media_dir + media_type, str(picture_name), picture_type)
        if check == 1:
            picture_name = picture_name.split('.')[0] + '(1).mp4'
            picture_type = 'mp4'
            picture_url = '../player_pictures/media/video/%s' % (picture_name)
        elif check == 2:
            return [], 'error' """

    img_list = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=picture_size,
                           picture_type=picture_type, picture_url=picture_url, picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                           picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=media_format)
    return img_list, picture_name

def ManageSoundFile(foreignkey, picture_id, username, bfile, picture_url, media_format):  # 處理語音導覽
    picture_upload_user = username
    picture_rights = username
    picture_upload_time = datetime.now()
    picture_name = bfile  # original sound name
    picture_size = round(bfile.size/1024, 2)  # sound size
    picture_type = bfile.name.split(".")[-1]  # sound_type
    new_name = str(picture_upload_time.year) + str(picture_upload_time.month) + str(picture_upload_time.hour) + \
        str(picture_upload_time.minute) + str(picture_upload_time.second) + \
        '_' + str(picture_id) + '.' + picture_type
    picture_name = new_name  # new picture name
    picture_url += str(picture_name)
    dest_file = open(media_dir + 'audio/' + str(picture_name), 'wb+')
    for chunk in bfile.chunks():
        dest_file.write(chunk)
    dest_file.close()
    sound_list = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=picture_size,
                             picture_type=picture_type, picture_url=picture_url, picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                             picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=media_format)
    return sound_list, picture_name

def CheckLeader(username, language, group_id):    
    group = models.Groups.objects.get(group_id=group_id, language=language)
    member = models.GroupsMember.objects.filter(foreignkey=group)
    leader_id = group.group_leader_id
    leader_name = models.UserProfile.objects.get(user_id=leader_id)
    if username == leader_name.user_name:
        is_leader = True
    else:
        is_leader = False
    return is_leader

def SendMailThread(title,mail_content,mail_address):
    # 利用thread 平行寄信 減少等待時間
    def SendMail():
        print("Send mail through thread : to ", mail_address)
        msg = EmailMessage(title, mail_content, to=[mail_address])
        msg.send()

    t = threading.Thread(target = SendMail)
    t.start()    

def AddCoiPoint(id, types, coi, verification=0):
    max_coi_id = models.CoiPoint.objects.all().aggregate(Max('id'))
    if max_coi_id['id__max'] == None:
        coi_id = 1
    else:
        coi_id = int(max_coi_id['id__max']) + 1
    if coi == '':
        coi = 'deh'
    obj = models.CoiPoint(id=coi_id, types=types, point_id=id,
                          coi_name=coi, verification=verification)
    obj.save()

def computeMD5hash(string):
    m = hashlib.md5()
    m.update(string.encode('utf-8'))
    return m.hexdigest()  # MD5 encrypt

def FilterCoiPoint(types, coi, verification=100):
    if coi != '':
        if verification != 100:
            point_list = models.CoiPoint.objects.filter(
                types=types, coi_name=coi, verification=verification).values_list('point_id', flat=True)
        else:
            point_list = models.CoiPoint.objects.filter(
                types=types, coi_name=coi).values_list('point_id', flat=True)
        

        if types == "poi":
            result_list = models.Poi.objects.filter(
                poi_id__in=point_list)
        elif types == "loi":
            result_list = models.RoutePlanning.objects.filter(
                route_id__in=point_list)
        elif types == "aoi":
            result_list = models.Aoi.objects.filter(aoi_id__in=point_list)
        elif types == "soi":
            result_list = models.SoiStory.objects.filter(soi_id__in=point_list)
    else:
        if types == "poi":
            result_list = models.Poi.objects.all()
        elif types == "loi":
            result_list = models.RoutePlanning.objects.all()
        elif types == "aoi":
            result_list = models.Aoi.objects.all()
        elif types == "soi":
            result_list = models.SoiStory.objects.all()
        if verification != 100:
            result_list = result_list.filter(
                ~Q(verification=0) & ~Q(verification=-1))
    return result_list

def GetMemberid():

    try:
        max_member_id = models.GroupsMember.objects.all(
        ).aggregate(Max('member_id'))  # 取得最大member_id
        # 最大member_id轉成整數+1
        member_id = int(max_member_id['member_id__max']) + 1
    except:
        member_id = 0
    return member_id

def AutoIncrementSqlSave(obj, table_name):
    cursor = connection.cursor()
    sql = "SET IDENTITY_INSERT %s ON" % (table_name)
    cursor.execute(sql)
    obj.save()
    sql = "SET IDENTITY_INSERT %s OFF" % (table_name)
    cursor.execute(sql)

def check_user_in_coi(user_obj, coi):
    coi_user = models.CoiUser.objects.filter(user_fk=user_obj, coi_name=coi)
    return coi_user.exists()

def GetMessageid():
    try:
        max_message_id = models.GroupsMessage.objects.all(
        ).aggregate(Max('message_id'))  # 取得最大message_id
        # 最大message_id轉成整數+1
        message_id = int(max_message_id['message_id__max']) + 1
    except:
        message_id = 0
    return message_id

def find_latilong(point_id, point_type):    


    if point_type == 'poi':
        point_list = models.Poi.objects.filter(poi_id=point_id).values_list('latitude', 'longitude', 'poi_address')
    elif point_type == 'loi':
        point_list = models.Sequence.objects.filter(foreignkey=point_id).order_by().values_list(
            'poi_id__latitude', 'poi_id__longitude', 'poi_id__poi_address')
    elif point_type == 'aoi':
        point_list = models.AoiPois.objects.filter(aoi_id_fk=point_id).order_by().values_list(
            'poi_id__latitude', 'poi_id__longitude', 'poi_id__poi_address')
    else:
        soi_list = models.SoiStoryXoi.objects.filter(soi_id_fk=point_id).order_by().values_list(
            'poi_id', 'loi_id', 'aoi_id')        
        if len(soi_list) == 0:
            return []
        if soi_list[0][0] > 0:
            return find_latilong(soi_list[0][0], 'poi')
        elif soi_list[0][1] > 0:
            return find_latilong(soi_list[0][1], 'loi')
        else:
            return find_latilong(soi_list[0][2], 'aoi')
    if len(point_list) == 0:
        return []
    else:
        return point_list[0]

def GetEventMemberid():
    try:
        max_member_id = models.EventsMember.objects.all(
        ).aggregate(Max('member_id'))  # 取得最大member_id
        # 最大member_id轉成整數+1
        member_id = int(max_member_id['member_id__max']) + 1
    except:
        member_id = 0
    return member_id

def GetEventMessageid():
    try:
        max_message_id = models.EventsMessage.objects.all(
        ).aggregate(Max('message_id'))  # 取得最大message_id
        # 最大message_id轉成整數+1
        message_id = int(max_message_id['message_id__max']) + 1
    except:
        message_id = 0
    return message_id

