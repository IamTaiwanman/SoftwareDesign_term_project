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

is_leader = ''

def index(request, pid=None):
    try:
        language = request.session['language']
    except:
        request.session['language'] = '中文'
        language = request.session['language']
    try:
        username = request.session['username']
        role = request.session['role']
        nickname = request.session['nickname']
        is_leader = request.session['is_leader']
    except:
        pass
    poi_count = models.Poi.objects.filter(
        ~Q(verification=0) & ~Q(verification=-1), open=1, language=language)
    loi_count = models.RoutePlanning.objects.filter(
        ~Q(verification=0) & ~Q(verification=-1), open=1, language=language)
    aoi_count = models.Aoi.objects.filter(
        ~Q(verification=0) & ~Q(verification=-1), open=1, language=language)
    soi_count = models.SoiStory.objects.filter(
        ~Q(verification=0) & ~Q(verification=-1), open=1, language=language)
    poi_list = list(poi_count.values_list('poi_id', flat=True))
    loi_list = list(loi_count.values_list('route_id', flat=True))
    aoi_list = list(aoi_count.values_list('aoi_id', flat=True))
    soi_list = list(soi_count.values_list('soi_id', flat=True))

    count = 3  # 每日推薦數量
    try:
        poi = models.Poi.objects.filter(
            poi_id__in=random.sample(poi_list, count))  # 每日推薦景點
        loi = models.RoutePlanning.objects.filter(
            route_id__in=random.sample(loi_list, count))  # 每日推薦景線
        aoi = models.Aoi.objects.filter(
            aoi_id__in=random.sample(aoi_list, count))  # 每日推薦景區
        soi = models.SoiStory.objects.filter(
            soi_id__in=random.sample(soi_list, count))  # 每日推薦主題故事
    except:
        print('retry')
   
    if 'username' in locals():
        user = models.UserProfile.objects.get(user_name=username)
        user_id = user.user_id
    else:
        user_id = 0
    ip = get_user_ip(request)
    obj = models.Logs(
        user_id=user_id,
        ip=ip,
        dt=datetime.now(),
        page='pageviews/deh',
        ulatitude=0,
        ulongitude=0,
        pre_page = '0'
    )
    obj.save(force_insert=True)
    pageviews = 10000 + models.Logs.objects.filter(page='pageviews/deh').count()

    template = get_template('index.html')
    html = template.render(locals())
    return HttpResponse(html)

def coi_static_page(request, coi, page='index'):
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        pass

    if page == 'my_history' and not 'username' in locals():
        page = 'index'

    if coi =='extn' and page == 'index':
        if 'username' in locals():
            user = models.UserProfile.objects.get(user_name=username)
            user_id = user.user_id
        else:
            user_id = 0
        ip = get_user_ip(request)
        obj = models.Logs(
            user_id=user_id,
            ip=ip,
            dt=datetime.now(),
            page='pageviews/extn',
            ulatitude=0,
            ulongitude=0
        )
        obj.save(force_insert=True)
        pageviews = 10000 + models.Logs.objects.filter(page='pageviews/extn').count()
        
    elif coi =='sdc' and page == 'index' :
        if 'username' in locals():
            user = models.UserProfile.objects.get(user_name=username)
            user_id = user.user_id
        else:
            user_id = 0
        ip = get_user_ip(request)
        obj = models.Logs(
            user_id=user_id,
            ip=ip,
            dt=datetime.now(),
            page='pageviews/sdc',
            ulatitude=0,
            ulongitude=0
        )
        obj.save(force_insert=True)
        pageviews = models.Logs.objects.filter(page='pageviews/sdc').count()

    all_poi = FilterCoiPoint("poi", coi)
    template = get_template('%s/%s.html' % (coi, page))
    html = template.render(locals())
    return HttpResponse(html)

def know(request):
    try:
        username = request.session['username']
        role = request.session['role']
        nickname = request.session['nickname']
        is_leader = request.session['is_leader']
    except:
        pass
    messages.get_messages(request)
    template = get_template('know.html')
    html = template.render(locals())
    return HttpResponse(html)

def intro(request):
    try:
        username = request.session['username']
        role = request.session['role']
        nickname = request.session['nickname']
        is_leader = request.session['is_leader']
    except:
        pass
    messages.get_messages(request)
    template = get_template('intro.html')
    html = template.render(locals())
    return HttpResponse(html)

def logout(request, coi=''):
    del request.session['%susername' % (coi)]
    try:
        del request.session['%snickname' % (coi)]
    except:
        pass
    return HttpResponseRedirect('/%s' % coi)

def map_player(request, map_role):
    try:
        username = request.session['username']
        role = request.session['role']
        nickname = request.session['nickname']
        is_leader = request.session['is_leader']
    except:
        pass
    language = request.session['language']
    map_role = map_role
    if language == '中文':
        areas = models.Area.objects.values('area_country').distinct()
    else:
        areas = models.Area.objects.values(
            'area_country_en', 'area_country').distinct()
    user_info = models.UserProfile.objects.filter(role='docent')
    docent_info = models.DocentProfile.objects.filter(fk_userid__in=user_info)
    template = get_template('map_player.html')
    html = template.render(locals())
    return HttpResponse(html)

def CheckDocentName(content_type, all_xoi, map_role, docents):
    user_info = models.UserProfile.objects.filter(user_name=docents)
    docent_name = []
    if map_role == 'docent' and docents != 'all':
        user = []
        for i in user_info:
            user.append(i.user_name)
        if content_type == 'poi':
            all_xoi = all_xoi.filter(rights__in=user)
        elif content_type == 'loi':
            all_xoi = all_xoi.filter(route_owner__in=user)
        elif content_type == 'aoi':
            all_xoi = all_xoi.filter(owner__in=user)
        elif content_type == 'soi':
            all_xoi = all_xoi.filter(soi_user_name__in=user)
    elif docents == 'all':
        user = []
        docent_id = []
        for p in all_xoi:
            if content_type == 'poi':
                user.append(p.rights)
            elif content_type == 'loi':
                user.append(p.route_owner)
            elif content_type == 'aoi':
                user.append(p.owner)
            elif content_type == 'soi':
                user.append(p.soi_user_name)
        users = models.UserProfile.objects.filter(user_name__in=user)
        for u in users:
            docent_id.append(u.user_id)
        docent_name = models.DocentProfile.objects.filter(
            fk_userid__in=docent_id)
        docent_name = list(docent_name.values(
            'fk_userid', 'fk_userid__user_name', 'name'))
    return all_xoi, docent_name

def map_player_post(request, poi_id, coi=''):  # poi map
    try:
        username = request.session['%susername' % (coi)]
        # is_leader = request.session['%sis_leader' % (coi)]
        role = request.session['%srole' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        is_leader = request.session['is_leader']
    except:
        username = ''
    all_poi = FilterCoiPoint("poi", coi)

    if coi != '':
        try:
            is_leader = request.session['%sis_leader' % (coi)]
        except:
            is_leader = ''
        template_url = '%s/poi_detail.html' % (coi)
        redirect_url = '/%s/make_player' % (coi)
    else:
        template_url = 'map_player_detail.html'
        redirect_url = '/make_player'
    if username != '':
        recordLog(request, poi_id, username, coi + 'poi_detail')
    else:
        recordLog(request, poi_id, '', coi + 'poi_detail')
    try:
        poi = all_poi.get(poi_id=poi_id)
        all_poi_web_count = models.Logs.objects.filter(page='http://deh.csie.ncku.edu.tw/poi_detail/'+poi_id).count() 
        all_poi_api_count = models.Logs.objects.filter(page='/API/test/poi_detail/' +poi_id).count()
        print(all_poi_api_count)
        all_poi_count = all_poi_web_count + all_poi_api_count
        if poi.language != '中文' and poi.orig_poi != 0:
            mpeg = models.Mpeg.objects.filter(
                Q(foreignkey=poi) | Q(foreignkey=poi.orig_poi))
        else:
            mpeg = models.Mpeg.objects.filter(Q(foreignkey=poi))
        if poi.identifier == 'docent':
            try:
                info = models.UserProfile.objects.get(user_name=poi.rights)
                poi_docent = models.DocentProfile.objects.get(fk_userid=info)
            except:
                print('No docent information')
        template = get_template(template_url)
        if poi != None:
            html = template.render(locals())
            return HttpResponse(html)
    except ObjectDoesNotExist:
        print('ObjectDoesNotExist')
        return HttpResponseRedirect(redirect_url)

def map_player_loi_post(request, route_id, coi=''):  # loi map
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        nickname = request.session['%snickname' % (coi)]
    except:
        username = ''

    if coi != '':
        template_url = '%s/loi_detail.html' % (coi)
        redirect_url = '/%s/make_player' % (coi)
    else:
        template_url = 'map_player_detail_loi.html'
        redirect_url = '/make_player'

    all_loi = FilterCoiPoint("loi", coi)
    if username != '':
        recordLog(request, route_id, username, coi + 'loi_detail')
    else:
        recordLog(request, route_id, '', coi + 'loi_detail')
    try:
        loi = all_loi.get(route_id=route_id)
        all_loi_web_count = models.Logs.objects.filter(page='http://deh.csie.ncku.edu.tw/loi_detail/'+route_id).count()
        all_loi_api_count = models.Logs.objects.filter(page='/API/test/loi_detail/' + route_id).count()
        all_loi_count = all_loi_web_count + all_loi_api_count
        sequence = models.Sequence.objects.filter(foreignkey=route_id)
        if loi.identifier == 'docent':
            try:
                info = models.UserProfile.objects.get(
                    user_name=loi.route_owner)
                loi_docent = models.DocentProfile.objects.get(fk_userid=info)
            except:
                print('No docent information')
        if coi != '':
            loi_poi_list = sequence.values_list('poi_id', flat=True)

            for i in sequence:
                try:
                    i.poi_id.verification = models.CoiPoint.objects.get(point_id=i.poi_id.poi_id, types='poi', coi_name=coi).verification
                except:
                    pass

            check_list = check_coi_point(loi_poi_list, "poi", coi)
        template = get_template(template_url)
        if loi != None:
            html = template.render(locals())
            return HttpResponse(html)
    except ObjectDoesNotExist:
        print('ObjectDoesNotExist')
        return HttpResponseRedirect(redirect_url)

def map_player_aoi_post(request, aoi_id, coi=''):
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        nickname = request.session['%snickname' % (coi)]
    except:
        username = ''

    if coi != '':
        template_url = '%s/aoi_detail.html' % (coi)
        redirect_url = '/%s/make_player' % (coi)
    else:
        template_url = 'map_player_detail_aoi.html'
        redirect_url = '/make_player'
    if username != '':
        recordLog(request, aoi_id, username, coi + 'aoi_detail')
    else:
        recordLog(request, aoi_id, '', coi + 'aoi_detail')

    all_aoi = FilterCoiPoint("aoi", coi)
    try:
        aoi = all_aoi.get(aoi_id=aoi_id)
        all_aoi_web_count = models.Logs.objects.filter(page='http://deh.csie.ncku.edu.tw/aoi_detail/'+aoi_id).count()
        all_aoi_api_count = models.Logs.objects.filter(page='/API/test/aoi_detail/' + aoi_id).count()
        all_aoi_count = all_aoi_web_count + all_aoi_api_count
        aoipoi = models.AoiPois.objects.filter(aoi_id_fk=aoi_id)
        if aoi.identifier == 'docent':
            try:
                info = models.UserProfile.objects.get(user_name=aoi.owner)
                aoi_docent = models.DocentProfile.objects.get(fk_userid=info)
            except:
                print('No docent information')
        if coi != '':
            aoi_poi_list = aoipoi.values_list('poi_id', flat=True)

            for i in aoipoi:
                try:
                    i.poi_id.verification = models.CoiPoint.objects.get(point_id=i.poi_id.poi_id, types='poi', coi_name=coi).verification
                except:
                    pass

            check_list = check_coi_point(aoi_poi_list, "poi", coi)
        messages.get_messages(request)
        template = get_template(template_url)
        if aoi != None:
            html = template.render(locals())
            return HttpResponse(html)
    except ObjectDoesNotExist:
        print('ObjectDoesNotExist')
        return HttpResponseRedirect(redirect_url)

def map_player_soi_post(request, soi_id, coi=''):
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        nickname = request.session['%snickname' % (coi)]
    except:
        username = ''

    if coi != '':
        template_url = '%s/soi_detail.html' % (coi)
        redirect_url = '/%s/make_player' % (coi)
    else:
        template_url = 'map_player_detail_soi.html'
        redirect_url = '/make_player'

    if username != '':
        recordLog(request, soi_id, username, coi + 'soi_detail')
    else:
        recordLog(request, soi_id, '', coi + 'soi_detail')

    all_soi = FilterCoiPoint("soi", coi)
    try:
        soi = all_soi.get(soi_id=soi_id)
        all_soi_web_count = models.Logs.objects.filter(page='http://deh.csie.ncku.edu.tw/soi_detail/'+soi_id).count()
        all_soi_api_count = models.Logs.objects.filter(page='/API/test/soi_detail/' + soi_id).count()
        all_soi_count = all_soi_web_count + all_soi_api_count
        soi_list = models.SoiStoryXoi.objects.filter(soi_id_fk=soi_id)
        if soi.identifier == 'docent':
            try:
                info = models.UserProfile.objects.get(
                    user_name=soi.soi_user_name)
                soi_docent = models.DocentProfile.objects.get(fk_userid=info)
            except:
                print('No docent information')
        get_poi = soi_list.values_list('poi_id', flat=True)
        get_loi = soi_list.values_list('loi_id', flat=True)
        get_aoi = soi_list.values_list('aoi_id', flat=True)
        get_xoi = soi_list.values_list('poi_id', 'loi_id', 'aoi_id')
        poi_count = get_poi.filter(~Q(poi_id=0)).count()  # poi數量
        loi_count = get_loi.filter(~Q(loi_id=0)).count()  # loi數量
        aoi_count = get_aoi.filter(~Q(aoi_id=0)).count()  # aoi數量

        xoi_type = []
        for x in get_xoi:
            for idx, item in enumerate(list(x)):
                if item != 0:
                    xoi_type.append(idx)
        if coi != '':
            poi_check = check_coi_point(get_poi, "poi", coi)
            loi_check = check_coi_point(get_loi, "loi", coi)
            aoi_check = check_coi_point(get_aoi, "aoi", coi)

            for i in soi_list:                
                try:                    
                    i.poi_id.verification = models.CoiPoint.objects.get(point_id=i.poi_id.poi_id, types='poi', coi_name=coi).verification
                except:
                    pass                

                try:
                    i.loi_id.verification = models.CoiPoint.objects.get(point_id=i.loi_id.route_id, types='loi', coi_name=coi).verification
                except:
                    pass
                
                try:
                    i.aoi_id.verification = models.CoiPoint.objects.get(point_id=i.aoi_id.aoi_id, types='aoi', coi_name=coi).verification
                except:
                    pass
            check_list = []
            for i in range(poi_count + loi_count + aoi_count):
                check_list.append(poi_check[i] + loi_check[i] + aoi_check[i])

        all_poi = models.Poi.objects.filter(
            poi_id__in=get_poi.filter(~Q(poi_id=0)))[:poi_count]
        loi_poi = models.Sequence.objects.filter(
            foreignkey__in=get_loi.filter(~Q(loi_id=0)))[:loi_count]
        aoi_poi = models.AoiPois.objects.filter(
            aoi_id_fk__in=get_aoi.filter(~Q(aoi_id=0)))[:aoi_count]
        messages.get_messages(request)
        template = get_template(template_url)
        if soi != None:
            html = template.render(locals())
            return HttpResponse(html)
    except ObjectDoesNotExist as e:
        print(e)
        return HttpResponseRedirect(redirect_url)

def feed_area(request):
    city = request.POST.get('city')  # 中文
    areas = models.Area.objects.filter(area_country=city)
    values_list = list(areas.values('area_name_ch', 'area_name_en'))
    data = {
        "area": values_list
    }
    return JsonResponse(data)

def edit_player(request, ids=None, types=None, group_id=None, coi=''):  # 編輯

    if coi != '':
        template_url = '%s/edit_%s.html' % (coi, types)
        redirect_url = '/%s/index' % (coi)
    else:
        template_url = 'edit_player_%s.html' % (types)
        redirect_url = '/'
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
    except:
        return HttpResponseRedirect(redirect_url)
    
    # 取得 edit_player的group
    user = models.UserProfile.objects.get(user_name=username)
    group_list = models.GroupsMember.objects.filter(user_id=user.user_id)
    group_id_list = group_list.values_list('foreignkey', flat=True) 
    group = models.Groups.objects.filter(group_id__in=group_id_list)

    #防止透過修改參數，修改別人的poi
    if(group_id != None):
        if(Prevent_Inspector_Attact(types, ids, group_id) == False):
            print("attack happened")
            return HttpResponseRedirect(redirect_url)

    try:
        nickname = request.session['%snickname' % (coi)]
    except:
        pass
    if language == '中文':
        areas = models.Area.objects.values('area_country').distinct()
    else:
        areas = models.Area.objects.values(
            'area_country_en', 'area_country').distinct()
    if group_id:
        is_leader = CheckLeader(username, language, group_id)
    else:
        is_leader = False
    edit_xoi = FilterCoiPoint(types, coi)
    try:
        user = models.objects.filter(user_name=username)
    except:
        pass
    if types == 'poi':
        poi_id = ids
        try:  # 檢查編輯權限
            print("role", role)
            print("leader? ",is_leader)
            if role == 'admin' or is_leader == True:
                edit_poi = edit_xoi.get(poi_id=ids, language=language)
            else:
                edit_poi = edit_xoi.get(
                    poi_id=ids, rights=username, language=language)
        except ObjectDoesNotExist:
            return HttpResponseRedirect(redirect_url)
        if models.Mpeg.objects.filter(foreignkey=edit_poi):
            try:
                edit_mpeg = models.Mpeg.objects.filter(
                    ~Q(format=8), foreignkey=edit_poi)
                mpeg_format = models.Mpeg.objects.filter(
                    ~Q(format=8), foreignkey=edit_poi)[0]
                edit_sound = models.Mpeg.objects.filter(
                    format=8, foreignkey=edit_poi)
                sound_format = models.Mpeg.objects.filter(
                    format=8, foreignkey=edit_poi)[0]
            except:
                print('no mpeg')
    elif types == 'loi':
        loi_id = ids
        try:
            if role == 'admin' or is_leader == True:
                edit_loi = edit_xoi.get(route_id=ids, language=language)
            else:
                edit_loi = edit_xoi.get(
                    route_id=ids, route_owner=username, language=language)
            edit_seq = models.Sequence.objects.filter(foreignkey=ids)
        except ObjectDoesNotExist:
            return HttpResponseRedirect(redirect_url)
    elif types == 'aoi':
        aoi_id = ids
        try:
            if role == 'admin' or is_leader == True:
                edit_aoi = edit_xoi.get(aoi_id=ids, language=language)
            else:
                edit_aoi = edit_xoi.get(
                    aoi_id=ids, owner=username, language=language)
            edit_aoipoi = models.AoiPois.objects.filter(aoi_id_fk=ids)
        except ObjectDoesNotExist:
            return HttpResponseRedirect(redirect_url)
    elif types == 'soi':
        soi_id = ids
        try:
            if role == 'admin' or is_leader == True:
                edit_soi = edit_xoi.get(soi_id=ids, language=language)
            else:
                edit_soi = edit_xoi.get(
                    soi_id=ids, soi_user_name=username, language=language)
            edit_soixoi = models.SoiStoryXoi.objects.filter(soi_id_fk=ids)
            poi_list = edit_soixoi.values_list('poi_id')
            loi_list = edit_soixoi.values_list('loi_id')
            aoi_list = edit_soixoi.values_list('aoi_id')
            all_list = edit_soixoi.values_list('poi_id', 'loi_id', 'aoi_id')

            xoi_list = []
            for i in all_list:
                if i[0] != 0:
                    xoi_type = "poi"
                    xoi_id = i[0]
                    xoi_latlng = models.Poi.objects.filter(
                        poi_id=xoi_id).values_list('poi_title', 'latitude', 'longitude', 'verification', 'open')[0]
                elif i[1] != 0:
                    xoi_type = "loi"
                    xoi_id = i[1]
                    xoi_latlng = models.Sequence.objects.filter(foreignkey=xoi_id).values_list(
                        'foreignkey__route_title', 'poi_id__latitude', 'poi_id__longitude', 'foreignkey__verification', 'foreignkey__open')[0]
                elif i[2] != 0:
                    xoi_type = "aoi"
                    xoi_id = i[2]
                    xoi_latlng = models.AoiPois.objects.filter(aoi_id_fk=xoi_id).values_list(
                        'aoi_id_fk__title', 'poi_id__latitude', 'poi_id__longitude', 'aoi_id_fk__verification', 'aoi_id_fk__open')[0]
                xoi_list.append([xoi_id, xoi_type, xoi_latlng])
        except ObjectDoesNotExist:
            return HttpResponseRedirect(redirect_url)
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def Prevent_Inspector_Attact(types, point_id, group_id):
    try:
        models.GroupsPoint.objects.get(types=types, point_id= point_id, foreignkey_id=group_id)
        return True
    except Exception as e:
        print(e)
        return False


def get_area(request):
    area = request.POST.get('area')  # 英文
    areas = models.Area.objects.filter(area_name_en=area)
    values_list = list(areas.values(
        'area_name_ch', 'area_country', 'area_name_en'))
    data = {
        "area": values_list
    }
    return JsonResponse(data)

def ManageMediaFile(foreignkey, picture_id, username, afile, picture_url, media_format):  # 處理多媒體資料(相片/聲音/影片)
    picture_upload_user = username
    picture_rights = username
    picture_upload_time = datetime.now()
    picture_name = afile  # original picture name
    picture_size = round(afile.size/1024, 2)  # picture size
    picture_type = afile.name.split(".")[-1]  # picture_type
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

def edit_prize(request, prize_id=None, coi=''):  # 編輯獎品
    if coi != '':
        template_url = '%s/edit_prize.html' % (coi)
        #redirect_url = '/%s/index' % (coi)
    else:
        template_url = 'edit_prize.html'
        #redirect_url = '/'
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        if coi == '':
            return HttpResponseRedirect('/')
        else:
            return HttpResponseRedirect('/%s/index.html' % (coi))
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    try:
        nickname = request.session['%snickname' % (coi)]
    except:
        pass
    
    try:
        if prize_id:
            try:
                # print(prize_id)
                user = models.UserProfile.objects.get(user_name=username)
                prize = models.prize_profile.objects.get(prize_id = prize_id)
                # print(prize.prize_name)
                authorized_prize = prize.group_id
                authorized_groups_id = [] #所有授權使用此獎品的群組ID
                
                for p in filter(None,authorized_prize.split(",",-1)):
                    authorized_groups_id.append(p)
                
                # for pp in authorized_groups_id :
                #     print(pp)
                #authorized_list = zip(authorized_groups_num, authorized_groups_id) 

                mygroup = models.EventsMember.objects.filter(user_id_id=user.user_id)
                mygroup_id = []
                for m in mygroup:
                    mygroup_id.append(m.event_id_id)

                # for m in mygroup_id:
                #     print(m)
                
                if coi == '':
                    authorized_grouplist = models.Events.objects.filter(Q(verification=1,open=1,coi_name='deh')|Q(Event_id__in=authorized_groups_id,coi_name='deh'))
                    grouplist = models.Events.objects.filter(Q(verification=1,open=1,coi_name='deh')|Q(Event_id__in=mygroup_id,coi_name='deh'))
                    authorized_groupname = [] #所有授權使用此獎品的群組名稱
                    for a in authorized_groups_id:
                        temp = models.Events.objects.get(Event_id = a)
                        authorized_groupname.append(temp)
                    authorized_list = zip(authorized_groups_id, authorized_groupname) #將兩個list合在一起供前端使用
                    
                else:
                    authorized_grouplist = models.Events.objects.filter(Q(verification=1,open=1,coi_name=coi)|Q(Event_id__in=authorized_groups_id,coi_name=coi))
                    grouplist = models.Events.objects.filter(Q(verification=1,open=1,coi_name='deh')|Q(Event_id__in=mygroup_id,coi_name='deh'))
            except Exception as e:
                print(e)
                prize = None
        template = get_template(template_url)

        html = template.render(locals())
        return HttpResponse(html)
    except ObjectDoesNotExist:
        print('ObjectDoesNotExist')
        #return HttpResponseRedirect(redirect_url)

def prize_exchange(request, PTP_id=None, coi=''): #兌換獎品
    if coi != '':
        template_url = '%s/prize_exchange.html' % (coi)
        redirect_url = '/%s/index' % (coi)
    else:
        template_url = 'prize_exchange.html'
        redirect_url = '/'
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        if coi == '':
            return HttpResponseRedirect('/')
        else:
            return HttpResponseRedirect('/%s/index.html' % (coi))
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    try:
        nickname = request.session['%snickname' % (coi)]
    except:
        pass
    try:
        if PTP_id:
            try:
                PTP = models.prize_to_player.objects.get(PTP_id = PTP_id)
                prize = models.prize_profile.objects.get(prize_id = PTP.player_prize_id)
            except Exception as e:
                PTP = None
                print("e = ", e)
                print("PTP = None")
                template = get_template(template_url)
                html = template.render(locals())
                return HttpResponse(html)

        user = models.UserProfile.objects.get(user_name = username)
        is_exchange = ""
        if user.role != 'user' or is_leader=="is_leader" or user.is_prizeadder:
            PTP.is_exchanged = 1
            PTP.save()
            prize.prize_number = prize.prize_number - PTP.prize_amount
            prize.save()
            print("Success")
            is_exchanged = "Success"
        else:
            print("You don't have authority!!")
            is_exchanged = "Error"

        template = get_template(template_url)
        html = template.render(locals())
        return HttpResponse(html)
    except ObjectDoesNotExist:
        print("Error in prize_exchange!!")
        is_exchanged = "Error in prize_exchange!!"

def edit_aoipoi(request):  # 編輯AoiPois page
    f = request.POST.get('aoi_id')
    f = int(f)
    del_poi = models.AoiPois.objects.filter(aoi_id_fk=f)
    del_poi.delete()
    max_ids = models.AoiPois.objects.all().aggregate(Max('ids'))  # 取得最大ids
    ids = int(max_ids['ids__max']) + 1  # 最大ids轉成整數+1
    count = request.POST.get('count')
    count = int(count)  # poi數量
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

def edit_soistory(request):
    max_soi_xois_id = models.SoiStoryXoi.objects.all().aggregate(
        Max('soi_xois_id'))  # 取得最大soi_xois_id
    # 最大soi_xois_id轉成整數+1
    soi_xois_id = int(max_soi_xois_id['soi_xois_id__max']) + 1
    count = request.POST.get('count')
    count = int(count)  # poi/loi/aoi數量
    f = request.POST.get('soi_id')
    f = int(f)
    del_xoi = models.SoiStoryXoi.objects.filter(soi_id_fk=f)
    del_xoi.delete()
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

    return HttpResponseRedirect('/make_player')  # 編輯SoiStoryXoi page

def computeMD5hash(string):
    m = hashlib.md5()
    m.update(string.encode('utf-8'))
    return m.hexdigest()  # MD5 encrypt

def login(request, coi=''):  # login page
    if coi != '':
        template_url = '%s/login.html' % (coi)
        redirect_url = '/%s/index' % (coi)
    else:
        template_url = 'login.html'
        redirect_url = '/'
    if request.method == 'POST':
        login_name = request.POST.get('username').strip()
        login_password = request.POST.get('password')
        passwords = computeMD5hash(login_password)

        try:
            user = models.UserProfile.objects.get(user_name=login_name)
            #user = models.UserProfile.objects.get(user_name = username)
            Groups = models.Groups.objects.filter(group_leader_id = user.user_id)
            
            #print(Groups.count())
            if( Groups.count() != 0):
                
                request.session['%sis_leader' % (coi)] = "is_leader"
                print(request.session['%sis_leader' % (coi)])
            else :
                request.session['%sis_leader' % (coi)] = ""
                
            if user.password == passwords:
                request.session['%susername' % (coi)] = user.user_name
                request.session['%srole' % (coi)] = user.role
                request.session['%suserid' % (coi)] = user.user_id                                  
                user_id = user.user_id      # get user id
                ip = get_user_ip(request)   # get user ip
                login_time = datetime.now()  # get login time
                page = 'http://deh.csie.ncku.edu.tw/'
                obj = models.Logs(
                    user_id=user_id,
                    ip=ip,
                    dt=login_time,
                    page=page,
                    pre_page = user_id,
                    ulatitude=0,
                    ulongitude=0
                )
                obj.save(force_insert=True)
                if user.nickname:
                    request.session['%snickname' % (coi)] = user.nickname
                if coi != '':
                    if check_user_in_coi(user, coi):
                        if models.CoiUser.objects.get(user_fk=user, coi_name=coi).role != 0:
                            request.session['%srole' % (coi)] = 'identifier'
                        return HttpResponseRedirect(redirect_url)
                    else:
                        if request.POST.get('regist') == '0':
                            AddCoiUser(user, coi)
                            return HttpResponseRedirect(redirect_url)
                        else:
                            message = "not in coi"
                else:
                    return HttpResponseRedirect(redirect_url)
            else:
                passwordError = 0
                HttpResponse('test')
          
        except:
            message = "無法登入"
    else:
        login_form = forms.LoginForm()

   

    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def get_user_ip(request):
    x_forward = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forward:
        ip = x_forward.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def userinfo(request, coi=''):
    if coi:
        template_url = '%s/userinfo.html' % (coi)
        index_url = '/%s/index' % (coi)
        info_url = '/%s/userinfo' % (coi)
    else:
        template_url = 'userinfo.html'
        index_url = '/'
        info_url = '/userinfo'
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
    except:
        return HttpResponseRedirect(index_url)
    try:
        nickname = request.session['%snickname' % (coi)]
    except:
        pass
    profile = models.UserProfile.objects.get(user_name=username)

    if request.method == 'POST':
        profile_form = forms.ProfileForm(request.POST, instance=profile)
        if profile_form.is_valid():
            profile_form.save()
            request.session['%snickname' %
                            (coi)] = request.POST.get('nickname')
            return HttpResponseRedirect(info_url)
    else:
        profile_form = forms.ProfileForm(initial={'nickname': profile.nickname, 'gender': profile.gender, 'email': profile.email,
                                                  'birthday': profile.birthday, 'education': profile.education, 'career': profile.career, 'user_address': profile.user_address})

    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def docinfo(request):
    if 'username' in request.session:
        username = request.session['username']
        userid = request.session['userid']
        role = request.session['role']
        profile = models.UserProfile.objects.get(user_id=userid)
        try:
            docent_info = models.DocentProfile.objects.get(fk_userid_id=userid)
        except:
            docent_info = models.DocentProfile(fk_userid_id=profile.user_id)
            docent_info.save()
        template = get_template('docentinfo.html')
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')

def userpwd(request):
    if 'username' in request.session:
        username = request.session['username']
        role = request.session['role']
        try:
            nickname = request.session['nickname']
        except:
            pass
        profile = models.UserProfile.objects.get(user_name=username)

        template = get_template('userpwd.html')
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')

def regist(request, coi=''):
    try:
        username = request.session['%susername' % (coi)]
    except:
        username = None
    u_id = models.UserProfile.objects.aggregate(Max('user_id'))  # 取得最大user_id
    if request.method == 'POST':
        max_id = int(u_id['user_id__max']) + 1  # 最大user_id轉成整數+1
        if max_id == None:
            max_id = 1
        else:
            max_id = max_id
        new_request = request.POST.copy()
        new_request['user_id'] = max_id
        date = request.POST.get('birthday_day')
        month = request.POST.get('birthday_month')
        year = request.POST.get('birthday_year')
        birthday = year + '-' + month + '-' + date
        register_form = forms.RegForm(new_request)
        if register_form.is_valid():
            birthday = register_form.cleaned_data.get('birthday')
            register_form.save()
            if coi:
                try:
                    user_info = models.UserProfile.objects.get(user_id=max_id)
                    AddCoiUser(user_info, coi)
                except ObjectDoesNotExist:
                    pass
                return HttpResponseRedirect('/%s/index' % (coi))
            return HttpResponseRedirect('/')
    else:
        max_id = int(u_id['user_id__max']) + 1  # 最大user_id轉成整數+1
        if max_id == None:
            max_id = 1
        else:
            max_id = max_id
        register_form = forms.RegForm(initial={'user_id': max_id})
    messages.get_messages(request)
    if coi != '':
        template = get_template('%s/regist.html' % (coi))
    else:
        template = get_template('regist.html')
    html = template.render(locals())
    return HttpResponse(html)

def verification(request, coi=''):
    if coi != '':
        template_url = "%s/verification.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "verification.html"
        redirect_url = "/"
    areas = models.Area.objects.values('area_country').distinct()  # 地區
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''

    if role == 'identifier' or role == 'admin' or is_leader == 'is_leader':
        template = get_template(template_url)
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect(redirect_url)

def edit_verification(request):
    content = request.POST.get('content')
    ids = request.POST.get('id')
    verification = request.POST.get('verification')    
    language = request.session['language']
    feedback_mes = request.POST.get('feedback_mes')
    Chk_verify = True
    Role = 'user'
    if content == 'poi':
        edit_poi = models.Poi.objects.get(poi_id=ids, language=language) # 兩個資料表皆存有 verification 狀態
        poi_profile = models.UserProfile.objects.get(user_name=edit_poi.rights)
        mail_address = poi_profile.email
        mail_name = edit_poi.poi_title
        edit_poi.verification = int(verification)
        edit_poi.open = True
        edit_poi.save()
    elif content == 'loi':
        edit_loi = models.RoutePlanning.objects.get(
            route_id=ids, language=language)
        loi_profile = models.UserProfile.objects.get(
            user_name=edit_loi.route_owner)
        sequence = models.Sequence.objects.filter(
            foreignkey=ids)  # 檢查LOI中的 POI是否驗證
        for p in sequence:
            if p.poi_id.verification == -1 or p.poi_id.verification == 0:
                Chk_verify = False
        mail_address = loi_profile.email
        mail_name = edit_loi.route_title
        edit_loi.verification = int(verification)
        if Chk_verify or loi_profile.role == 'docent':
            Chk_verify = True
            edit_loi.save()
    elif content == 'aoi':
        edit_aoi = models.Aoi.objects.get(aoi_id=ids, language=language)
        aoi_profile = models.UserProfile.objects.get(user_name=edit_aoi.owner)
        aoi_poi = models.AoiPois.objects.filter(
            aoi_id_fk=ids)  # 檢查AOI中的 POI是否驗證
        for p in aoi_poi:
            if p.poi_id.verification == -1 or p.poi_id.verification == 0:
                Chk_verify = False
        mail_address = aoi_profile.email
        mail_name = edit_aoi.title
        edit_aoi.verification = int(verification)
        if Chk_verify or aoi_profile.role == 'docent':
            Chk_verify = True
            edit_aoi.save()
    elif content == 'soi':
        edit_soi = models.SoiStory.objects.get(soi_id=ids, language=language)
        soi_profile = models.UserProfile.objects.get(
            user_name=edit_soi.soi_user_name)
        soi_plist = models.SoiStoryXoi.objects.filter(
            soi_id_fk=ids, loi_id=0, aoi_id=0)  # 檢查SOI中的 POI是否驗證
        soi_llist = models.SoiStoryXoi.objects.filter(
            soi_id_fk=ids, poi_id=0, aoi_id=0)  # 檢查SOI中的 LOI是否驗證
        soi_alist = models.SoiStoryXoi.objects.filter(
            soi_id_fk=ids, poi_id=0, loi_id=0)  # 檢查SOI中的 AOI是否驗證
        for p in soi_plist:
            if p.poi_id.verification == -1 or p.poi_id.verification == 0:
                Chk_verify = False
        for p in soi_llist:
            if p.loi_id.verification == -1 or p.loi_id.verification == 0:
                Chk_verify = False
        for p in soi_alist:
            if p.aoi_id.verification == -1 or p.aoi_id.verification == 0:
                Chk_verify = False
        mail_address = soi_profile.email
        mail_name = edit_soi.soi_title
        edit_soi.verification = int(verification)
        if Chk_verify or soi_profile.role == 'docent':
            Chk_verify = True
            edit_soi.save()
    elif content == 'group':
        edit_group = models.Groups.objects.get(group_id=ids, language=language)
        leader_profile = models.UserProfile.objects.get(
            user_id=edit_group.group_leader_id)
        mail_address = leader_profile.email
        mail_name = edit_group.group_name
        edit_group.verification = int(verification)
        edit_group.save()
    if Chk_verify:
        if verification == '1':
            if language == '中文':
                mail_contnt = '恭喜您的 ' + content + ':' + mail_name + ' 已驗証通過'
            elif language == '英文':
                mail_contnt = 'Congratulations! your' + content + ':' + mail_name + \
                    ' has been successfully verified and can be displayed publicly.'
            else:
                mail_contnt == 'ございます!' + content + ':' + mail_name + ' 検証によって'
        elif verification == '-1':
            if language == '中文':
                mail_contnt = '很遺憾您的 ' + content + ':' + mail_name + '驗証未通過\n\n未通過原因為:' + feedback_mes
            elif language == '英文':
                mail_contnt = 'Sorry! your ' + content + ':' + mail_name + \
                    ' cannot be displayed publicly after verification.\n\n Бүтэлгүйтсэн шалтгаан нь:' + feedback_mes
            else:
                mail_contnt = 'ございます! ' + content + ':' + mail_name + ' 検証失敗した\n\n 失敗の理由は:' + feedback_mes
        try:
            SendMailThread('文史脈流驗証系統通知', mail_contnt, mail_address)
            # def SendMail():
            #     print("Send mail through thread : to ", mail_address);
            #     msg = EmailMessage('文史脈流驗証系統通知', mail_contnt, to=[mail_address])
            #     msg.send()

            # t = threading.Thread(target = SendMail)
            # t.start()              
            
        except Exception as e:
            print("exception is : ",e)
            print('Mail fail')
        return HttpResponse('ok')
    else:
        return HttpResponse('fail')

def toggle_lang(request):
    language = request.POST.get('language')
    if language == 'chinese':
        request.session['language'] = '中文'
    elif language == 'english':
        request.session['language'] = '英文'
    elif language == 'japanese':
        request.session['language'] = '日文'
    return HttpResponse('success')

def coi_lang(request):
    coi = request.POST.get('coi')
    lang = request.POST.get('language')
    request.session['%slanguage' % (coi)] = lang
    return HttpResponse('Success')

def findpwd(request):
    try:
        username = request.session['username']
        role = request.session['role']
        nickname = request.session['nickname']
        is_leader = request.session['is_leader' ]
    except:
        pass
    template = get_template('findpwd.html')
    html = template.render(locals())
    return HttpResponse(html)

def search_bar(request):
    # get the element from url
    # split sentence to word list by
    search_words = request.GET.get('srch_term').split()
    map_role = request.GET.get('map_role')  # map_role ex:玩家 導遊
    city = request.GET.get('city')  # city ex:台北市 台南市
    area = request.GET.get('area')  # area ex:永和區
    topic = request.GET.get('topic')  # topic ex:活化的
    ttype = request.GET.get('ttype')  # ttype ex:人文
    category = request.GET.get('category')  # category ex:古蹟 古物
    medias = request.GET.get('media')  # media ex:相片 聲音
    contributor_search = request.GET.get('contributor_search')

    # get the element from session
    try:
        username = request.session['username']
        role = request.session['role']
        nickname = request.session['nickname']
        is_leader = request.session['is_leader']
    except:
        pass
    language = request.session['language']

    # initial  answer queryset
    poi_ans = models.Poi.objects.none()
    loi_ans = models.RoutePlanning.objects.none()
    aoi_ans = models.Aoi.objects.none()
    soi_ans = models.SoiStory.objects.none()
    group_ans = models.Groups.objects.none()

    # for template variable
    search_words_str = ""
    area_list = []
    area_all = []
    if language == '中文':
        cities = models.Area.objects.values('area_country').distinct()
    else:
        cities = models.Area.objects.values(
            'area_country_en', 'area_country').distinct()
    for i in cities:
        country = i['area_country']
        areas = models.Area.objects.filter(
            area_country=country).values_list('area_name_ch', 'area_name_en')
        area_list.append((i, areas))

    # advanced search condition filter

    # get the language and public data queryset
    poi_all = models.Poi.objects.filter(
        ~Q(verification=0) & ~Q(verification=-1), language=language, open=1)
    loi_all = models.RoutePlanning.objects.filter(
        ~Q(verification=0) & ~Q(verification=-1), language=language, open=1)
    aoi_all = models.Aoi.objects.filter(~Q(verification=0) & ~Q(
        verification=-1), language=language, open=1)
    soi_all = models.SoiStory.objects.filter(
        ~Q(verification=0) & ~Q(verification=-1), language=language, open=1)
    group_all = models.Groups.objects.filter(
        ~Q(verification=0) & ~Q(verification=-1), language=language, open=1)


   

    # judge whether value is null then filter
    if contributor_search != '' and contributor_search != None:
        poi_all = poi_all.filter(contributor=contributor_search)
        loi_all = loi_all.filter(contributor=contributor_search)
        aoi_all = aoi_all.filter(contributor=contributor_search)
        soi_all = soi_all.filter(contributor=contributor_search)
    if area != None and area != "0":
        poi_all = poi_all.filter(area_name_en=area)
        loi_all = loi_all.filter(area_name_en=area)
        aoi_all = aoi_all.filter(area_name_en=area)
        soi_all = soi_all.filter(area_name_en=area)
    elif area == "0":
        area_all = models.Area.objects.filter(
            area_country=city).values_list('area_name_en')
        poi_all = poi_all.filter(area_name_en__in=area_all)
        loi_all = models.RoutePlanning.objects.filter(
            area_name_en__in=area_all)
        aoi_all = models.Aoi.objects.filter(area_name_en__in=area_all)
        soi_all = models.SoiStory.objects.filter(area_name_en__in=area_all)
    if map_role != None and map_role != "0":
        poi_all = poi_all.filter(identifier=map_role)
        loi_all = loi_all.filter(identifier=map_role)
        aoi_all = aoi_all.filter(identifier=map_role)
        soi_all = soi_all.filter(identifier=map_role)
    if topic != None and topic != "0":
        poi_all = poi_all.filter(subject=topic)
    if ttype != None and ttype != "0":
        poi_all = poi_all.filter(type1=ttype)
    if category != None and category != "0":
        poi_all = poi_all.filter(format=category)
    if medias != None and medias != "0":
        media_all = models.Mpeg.objects.values(
            'foreignkey').filter(format=medias)
        poi_all = poi_all.filter(poi_id__in=media_all)

    # search every word in list by loop
    # poi by title,description,keyword
    # loi,aoi,soi by title,description
    for word in search_words:
        if language == '中文':
            poi_ans = poi_ans | poi_all.filter(Q(poi_title__contains=word) |
                                               Q(poi_description_1__contains=word) |
                                               Q(poi_description_2__contains=word) |
                                               Q(keyword1__contains=word) |
                                               Q(keyword2__contains=word) |
                                               Q(keyword3__contains=word) |
                                               Q(keyword4__contains=word) |
                                               Q(keyword5__contains=word))
        else:
            poi_ans = poi_ans | poi_all.filter(Q(poi_title__contains=word) |
                                               Q(descriptioneng__contains=word) |
                                               Q(keyword1__contains=word) |
                                               Q(keyword2__contains=word) |
                                               Q(keyword3__contains=word) |
                                               Q(keyword4__contains=word) |
                                               Q(keyword5__contains=word))
        loi_ans = loi_ans | loi_all.filter(
            Q(route_title__contains=word) | Q(route_description=word))
        aoi_ans = aoi_ans | aoi_all.filter(
            Q(title__contains=word) | Q(description=word))
        soi_ans = soi_ans | soi_all.filter(
            Q(soi_title__contains=word) | Q(soi_description=word))
        group_ans = group_ans | group_all.filter(group_name__contains=word)
        search_words_str = search_words_str + " " + word
    poi_list = poi_ans.values_list('poi_id')
    search_words_str = search_words_str[1:]

    # use poi_id to findout relative loi,aoi,soi
    loi_list = models.Sequence.objects.filter(
        poi_id__in=poi_list).values_list('foreignkey')
    loi_ans = loi_ans | loi_all.filter(route_id__in=loi_list)

    aoi_list = models.AoiPois.objects.filter(
        poi_id__in=poi_list).values_list('aoi_id_fk')
    aoi_ans = aoi_ans | aoi_all.filter(aoi_id__in=aoi_list)

    soi_list = models.SoiStoryXoi.objects.filter(Q(poi_id__in=poi_list) | Q(
        loi_id__in=loi_ans) | Q(aoi_id__in=aoi_ans)).values_list('soi_id_fk')
    soi_ans = soi_ans | soi_all.filter(soi_id__in=soi_list)


    poiIDList = poi_list.values_list('poi_id',flat = True)
    
    # count the result number
    poi_num = poi_ans.count()
    loi_num = loi_ans.count()
    aoi_num = aoi_ans.count()
    soi_num = soi_ans.count()
    group_num = group_ans.count()

    template = get_template('search_bar.html')
    html = template.render(locals())

    
    tmpURLs = []
    for id in poiIDList:
        tmp = {"url":"poi_detail","id" : str(id)}
        tmpURLs.append(tmp)

        
    for tmp in loi_ans:
        tmp = {"url":"loi_detail","id" : str(tmp.route_id)}
        tmpURLs.append(tmp)

    for tmp in soi_ans:
        tmp = {"url":"soi_detail","id" : str(tmp.soi_id)}
        tmpURLs.append(tmp)

    for tmp in aoi_ans:
        tmp = {"url":"aoi_detail","id" : str(tmp.aoi_id)}
        tmpURLs.append(tmp)

    try:
        recordLogs(request,tmpURLs,username)
    except Exception as error:
        print(error)

    return HttpResponse(html)

def list_groups(request, ids=None, types=None, coi=''):
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        if coi == '':
            return HttpResponseRedirect('/')
        else:
            return HttpResponseRedirect('/%s/index.html' % (coi))
    try:
        nickname = request.session['%snickname' % (coi)]
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi != '':
        list_group_url = '/%s/list_groups' % (coi)
        template_url = '%s/list_group.html' % (coi)
    else:
        list_group_url = '/list_groups'
        template_url = 'list_group.html'
        coi = 'deh'

    group = models.Groups.objects.filter(coi_name=coi)
    msg, user_id = GetNotification(username)  # Get invite notifications
    msg_count = msg.count()
    try:
        user = models.UserProfile.objects.get(user_name=username)
        group_list = models.GroupsMember.objects.filter(
            user_id=user.user_id, foreignkey__in=group)
    except:
        group_list = None
    if ids and types:
        try:
            if types == 'group':
                del_group = models.Groups.objects.get(group_id=ids)
            elif types == 'leave':
                leave_group = models.GroupsMember.objects.get(
                    foreignkey=ids, user_id=user)
            else:
                del_group = None
                leave_group = None
        except:
            del_group = None
            leave_group = None
    if types == 'group' and del_group:
        del_group.delete()
        user = models.UserProfile.objects.get(user_name = username)
        Groups = models.Groups.objects.filter(group_leader_id = user.user_id)    
        #print(Groups.count())
        if( Groups.count() != 0):
            request.session['%sis_leader' % (coi)] = "is_leader"
            print("have more than 1 group")
        else :
            print("have no group")
            request.session['%sis_leader' % (coi)] = ""
        return HttpResponseRedirect(list_group_url)
    elif types == 'leave' and leave_group:
        leave_group.delete()
        return HttpResponseRedirect(list_group_url)
    else:
        del_group = None
        leave_group = None
    messages.get_messages(request)
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def make_groups(request):  # 製做景點頁面
    if 'username' in request.session:
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']
        is_leader = request.session['is_leader'] 
        try:
            nickname = request.session['nickname']
            user = models.UserProfile.objects.get(user_name=username)
        except:
            pass
        language = request.session['language']
        messages.get_messages(request)
        template = get_template('make_group.html')
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')

def manage_group(request, group_id, coi=''):  # group detail page
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        pre_page = request.session['%spre_page' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        print(is_leader)
    except:
        pass

    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi != '':
        template_url = '%s/manage_group.html' % (coi)
        list_url = '/%s/list_group' % (coi)
        make_url = '/%s/make_player' % (coi)
    else:
        template_url = 'manage_group.html'
        list_url = '/list_groups'
        make_url = '/make_player'
        coi = 'deh'
    try:
        group = models.Groups.objects.get(group_id=group_id, language=language)
        member = models.GroupsMember.objects.filter(foreignkey=group)
        leader_id = group.group_leader_id
        leader_name = models.UserProfile.objects.get(user_id=leader_id)

        if username != '':  # login user
            user = models.UserProfile.objects.get(user_name=username)
            user_id = user.user_id
            #只有組頭能修改群組
            if user_id == leader_id:
                check_leader = True
            else:
                check_leader = False
        else:  # user not login
            user_id = 0
       
        ip = get_user_ip(request)
        exploring_time = datetime.now()
        page = 'http://deh.csie.ncku.edu.tw/manage_group/' + group_id
        request.session['pre_page'] = 'http://deh.csie.ncku.edu.tw/list_groups/'
        obj = models.Logs(
            user_id=user_id,
            ip=ip,
            dt=datetime.now(),
            page=page,
            ulatitude=0,
            ulongitude=0,
            pre_page = request.session['pre_page']
        )
        obj.save(force_insert=True)
        request.session['pre_page'] = group_id
       # models.Logs.objects.filter(page='http://deh.csie.ncku.edu.tw/aoi_detail/'+aoi_id | ).count()


        if username == leader_name.user_name or role == 'admin':  # 檢查是否為leader
            is_leader = True
        else:
            is_leader = False
        try:  # 檢查是否為member
            member_name = models.UserProfile.objects.get(user_name=username)
            is_member = models.GroupsMember.objects.filter(
                user_id=member_name.user_id, foreignkey=group).exists()
        except:
            is_member = False
        try:
            point_list = models.GroupsPoint.objects.filter(foreignkey=group)
        except:
            point_list = None
        poi_ids = []
        loi_ids = []
        aoi_ids = []
        soi_ids = []
        for p in point_list:
            if p.types == 'poi':
                poi_ids.append(p.point_id)
            elif p.types == 'loi':
                loi_ids.append(p.point_id)
            elif p.types == 'aoi':
                aoi_ids.append(p.point_id)
            elif p.types == 'soi':
                soi_ids.append(p.point_id)
        all_poi = models.Poi.objects.filter(poi_id__in=poi_ids)
        all_loi = models.RoutePlanning.objects.filter(route_id__in=loi_ids)
        all_aoi = models.Aoi.objects.filter(aoi_id__in=aoi_ids)
        all_soi = models.SoiStory.objects.filter(soi_id__in=soi_ids)
        if not is_leader:
            if is_member:
                all_poi = all_poi.filter(Q(open=1) | Q(rights=username))
                all_loi = all_loi.filter(Q(open=1) | Q(route_owner=username))
                all_aoi = all_aoi.filter(Q(open=1) | Q(owner=username))
                all_soi = all_soi.filter(Q(open=1) | Q(soi_user_name=username))
            else:
                if group.open == 1 and group.verification == 1:
                    all_poi = all_poi.filter(Q(open=1) | Q(
                        rights=username), verification=1)
                    all_loi = all_loi.filter(Q(open=1) | Q(
                        route_owner=username), verification=1)
                    all_aoi = all_aoi.filter(Q(open=1) | Q(
                        owner=username), verification=1)
                    all_soi = all_soi.filter(Q(open=1) | Q(
                        soi_user_name=username), verification=1)
                else:
                    return HttpResponseRedirect(list_url)
        # 各coi的瀏覽次數計算
        pnum = [] 
        lnum = []
        anum = []
        snum = []
        for p in all_poi:
            pnum.append(models.Logs.objects.filter(Q(page = "http://deh.csie.ncku.edu.tw/poi_detail/"+(str)(p.poi_id)) & Q(pre_page = group_id)).count())
        for l in all_loi:
            lnum.append(models.Logs.objects.filter(Q(page = "http://deh.csie.ncku.edu.tw/loi_detail/"+(str)(l.route_id)) & Q(pre_page = group_id)).count()) 
        for a in all_aoi:
            anum.append(models.Logs.objects.filter(Q(page = "http://deh.csie.ncku.edu.tw/aoi_detail/"+(str)(a.aoi_id)) & Q(pre_page = group_id)).count())
        for s in all_soi:
            snum.append(models.Logs.objects.filter(Q(page = "http://deh.csie.ncku.edu.tw/soi_detail/"+(str)(s.soi_id)) & Q(pre_page = group_id)).count())      
        
        # 合併兩個list為一個，到前端(manage_group.html)再做unzip
        mylist_poi = zip(all_poi, pnum)
        mylist_loi = zip(all_loi, lnum)
        mylist_aoi = zip(all_aoi, anum)
        mylist_soi = zip(all_soi, snum)
        
        is_leader = "is_leader"  # 進入群組後隊長還是可進驗證系統

        template = get_template(template_url)
        html = template.render(locals())
        return HttpResponse(html)
    except ObjectDoesNotExist:
        print('ObjectDoesNotExist')
        return HttpResponseRedirect(make_url)

def GetNotification(username):  # Get invite notifications
    user_id = models.UserProfile.objects.get(user_name=username)
    msg = models.GroupsMessage.objects.filter(
        receiver=user_id.user_id, is_read=False)
    return msg, user_id

def GetMemberid():
    try:
        max_member_id = models.GroupsMember.objects.all(
        ).aggregate(Max('member_id'))  # 取得最大member_id
        # 最大member_id轉成整數+1
        member_id = int(max_member_id['member_id__max']) + 1
    except:
        member_id = 0
    return member_id

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

def AutoIncrementSqlSave(obj, table_name):
    cursor = connection.cursor()
    sql = "SET IDENTITY_INSERT %s ON" % (table_name)
    cursor.execute(sql)
    obj.save()
    sql = "SET IDENTITY_INSERT %s OFF" % (table_name)
    cursor.execute(sql)

def get_all_point_account(request, coi):
    username = request.POST.get('id')
    data = []
    valid_length = 0
    if not models.UserProfile.objects.filter(user_name=username).exists():
        return JsonResponse(data, safe=False)

    poi_list = models.Poi.objects.filter(rights=username)
    loi_list = models.RoutePlanning.objects.filter(route_owner=username)
    aoi_list = models.Aoi.objects.filter(owner=username)
    soi_list = models.SoiStory.objects.filter(soi_user_name=username)

    for poi in poi_list:
        data, valid_length = append_json(
            data, poi.poi_id, 'poi', poi.poi_title, poi.rights, poi.verification, coi, valid_length)

    for loi in loi_list:
        data, valid_length = append_json(
            data, loi.route_id, 'loi', loi.route_title, loi.route_owner, loi.verification, coi, valid_length)

    for aoi in aoi_list:
        data, valid_length = append_json(
            data, aoi.aoi_id, 'aoi', aoi.title, aoi.owner, aoi.verification, coi, valid_length)

    for soi in soi_list:
        data, valid_length = append_json(
            data, soi.soi_id, 'soi', soi.soi_title, soi.soi_user_name, soi.verification, coi, valid_length)

    total_data = {
        'owner': [username],
        'data': data,
        'data_len': valid_length,
    }
    return JsonResponse(total_data, safe=False)

def get_all_point_group(request, coi):
    group_id = request.POST.get('id')
    data = []
    member_list = []
    valid_length = 0
    try:
        group = models.Groups.objects.get(group_id=group_id)
    except:
        return JsonResponse(data, safe=False)

    members = models.GroupsMember.objects.filter(foreignkey=group)
    all_point = models.GroupsPoint.objects.filter(foreignkey=group)

    for member in members:
        member_list.append(member.user_id.user_name)

    for point in all_point:
        if point.types == 'poi':
            try:
                poi = models.Poi.objects.get(poi_id=point.point_id)
                data, valid_length = append_json(
                    data, poi.poi_id, 'poi', poi.poi_title, poi.rights, poi.verification, coi, valid_length)
            except:
                pass
        elif point.types == 'loi':
            try:
                loi = models.RoutePlanning.objects.get(route_id=point.point_id)
                data, valid_length = append_json(
                    data, loi.route_id, 'loi', loi.route_title, loi.route_owner, loi.verification, coi, valid_length)
            except:
                pass
        elif point.types == 'aoi':
            try:
                loi = models.Aoi.objects.get(aoi_id=point.point_id)
                data, valid_length = append_json(
                    data, aoi.aoi_id, 'aoi', aoi.title, aoi.owner, aoi.verication, coi, valid_length)
            except:
                pass
        else:
            try:
                soi = models.SoiStory.objects.get(soi_id=point.point_id)
                data, valid_length = append_json(
                    data, soi.soi_id, 'soi', soi.soi_title, soi.soi_user_name, soi.verification, coi, valid_length)
            except:
                pass

    total_data = {
        'owner': member_list,
        'data': data,
        'data_len': valid_length,
    }
    print(total_data)
    return JsonResponse(total_data, safe=False)

def append_json(data, point_id, point_type, point_title, point_owner, point_verificaion, coi, length):
    valid = not models.CoiPoint.objects.filter(
        types=point_type, point_id=point_id, coi_name=coi).exists()
    if valid:
        length = length + 1
    data.append({
        'id': point_id,
        'type': point_type,
        'title': point_title,
        'owner': point_owner,
        'verification': point_verificaion,
        'valid': valid
    })
    return data, length

def export_data(request, coi):
    owner, data, group_id = request.POST.get('owner'), request.POST.get(
        'data'), int(request.POST.get('groupId'))
    owner_json, data_json = json.loads(owner), json.loads(data)
    owner_err, data_err = [], []

    for user in owner_json:
        err = export_user(user, coi)
        if err:
            owner_err.append(user)

    for point in data_json:
        if point['valid']:
            AddCoiPoint(point['id'], point['type'], coi, point['verification'])

    if group_id != 0:
        group = models.Groups.objects.get(group_id=group_id)
        group.coi_name = coi
        group.save()

    return HttpResponse('Success')

def export_user(username, coi):
    try:
        user_obj = models.UserProfile.objects.get(user_name=username)
    except:
        return True
    AddCoiUser(user_obj, coi)
    return False

def export_single_point(request):
    add_list = json.loads(request.POST.get('add'))
    remove_list = json.loads(request.POST.get('remove'))
    point_id = int(request.POST.get('id'))
    point_type = request.POST.get('type')

    for coi in add_list:
        AddCoiPoint(point_id, point_type, coi)

    for coi in remove_list:
        point = models.CoiPoint.objects.get(
            point_id=point_id, types=point_type, coi_name=coi)
        point.delete()

    return HttpResponse('Success')

def get_server_coi(request):
    coi_list = list(models.CoiUser.objects.values_list(
        'coi_name', flat=True).distinct())
    return JsonResponse(coi_list, safe=False)

def delete_xoi_coi(request, coi, ids, types):
    if coi:
        try:
            del_coi = models.CoiPoint.objects.get(
                types=types, point_id=ids, coi_name=coi)
            del_coi.delete()
            return HttpResponse('1')
        except ObjectDoesNotExist:
            pass
    return HttpResponse('0')

def get_verification_coi(request, coi): # sdc驗證者頁面
    ver_item = request.POST.get('ver_item')
    role = request.POST.get('role')
    content = request.POST.get('content')
    area = request.POST.get('area')
    city = request.POST.get('citys')
    language = request.session['%slanguage' % (coi)]
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
    if content == 'group':
        all_group = models.Groups.objects.filter(
            verification=int(ver_item), language=language, coi_name=coi)
        values_list = list(all_group.values('group_id', 'group_name'))
        data = {
            "all_group": values_list
        }
        return JsonResponse(data)
    all_xoi = FilterCoiPoint(content, coi, int(ver_item))
    #print(all_xoi.count())
    
    #print(all_xoi.count())
    if area == '全部':
        all_xoi = all_xoi.filter(area_name_en__in=all_city)
    else:
        all_xoi = all_xoi.filter(area_name_en=area)
    if content == 'poi':
        if user_role != 'admin' and user_role != 'identifier':
            all_xoi = all_xoi.filter(poi_id__in = Group_xois, identifier=role, language=language)
        else:
            all_xoi = all_xoi.filter(identifier=role, language=language)
        values_list = list(all_xoi.values(
            'poi_id', 'poi_title', 'identifier', 'rights'))
        data = {"all_poi": values_list}
        return JsonResponse(data)
    elif content == 'loi':
        if user_role != 'admin' and user_role != 'identifier':
            all_xoi = all_xoi.filter(route_id__in = Group_xois, identifier=role, language=language)
        else:
            all_xoi = all_xoi.filter(identifier=role, language=language)
        values_list = list(all_xoi.values('route_id', 'route_title'))
        data = {
            "all_loi": values_list
        }
        return JsonResponse(data)
    elif content == 'aoi':
        if user_role != 'admin' and user_role != 'identifier':
            all_xoi = all_xoi.filter(aoi_id__in = Group_xois, identifier=role, language=language)
        else:
            all_xoi = all_xoi.filter(identifier=role, language=language)
        values_list = list(all_xoi.values('aoi_id', 'title'))
        data = {
            "all_aoi": values_list
        }
        return JsonResponse(data)
    elif content == 'soi':
        if user_role != 'admin' and user_role != 'identifier':
            all_xoi = all_xoi.filter(soi_id__in = Group_xois, identifier=role, language=language)
        else:
            all_xoi = all_xoi.filter(identifier=role, language=language)
        values_list = list(all_xoi.values('soi_id', 'soi_title'))
        data = {
            "all_soi": values_list
        }
        return JsonResponse(data)

def verification_xoi_coi(request):
    coi = request.POST.get('coi')
    types = request.POST.get('types')
    point_id = request.POST.get('id')
    feedback_mes = request.POST.get('feedback_mes')
    verification = int(request.POST.get('verification'))
    if types == 'group':
        try:
            coi_group = models.Groups.objects.get(group_id=point_id)
        except ObjectDoesNotExist:
            return HttpResponse('Group not found')
        coi_group.verification = verification
        coi_group.save()
        return HttpResponse("Success")
    verify_check = True
    print("113254646")
    try:
        coi_point = models.CoiPoint.objects.get(
            types=types, point_id=point_id, coi_name=coi)
        print(coi_point.feedback_mes)
    except ObjectDoesNotExist:
        AddCoiPoint(point_id, types, coi)
        coi_point = models.CoiPoint.objects.get(
            types=types, point_id=point_id, coi_name=coi)
    if types == 'loi':
        if verification == 1:
            loi_poi = models.Sequence.objects.filter(
                foreignkey=point_id).values_list('poi_id', flat=True)
            verify_check = check_coi_point_verification(loi_poi, 'poi', coi)
    elif types == 'aoi':
        if verification == 1:
            aoi_poi = models.AoiPois.objects.filter(
                aoi_id_fk=point_id).values_list('poi_id', flat=True)
            verify_check = check_coi_point_verification(aoi_poi, 'poi', coi)
    elif types == 'soi':
        if verification == 1:
            soi_poi = models.SoiStoryXoi.objects.filter(
                soi_id_fk=point_id, loi_id=0, aoi_id=0).values_list('poi_id', flat=True)
            verify_check = check_coi_point_verification(soi_poi, 'poi', coi)
            if verify_check == True:
                soi_loi = models.SoiStoryXoi.objects.filter(
                    soi_id_fk=point_id, poi_id=0, aoi_id=0).values_list('loi_id', flat=True)
                verify_check = check_coi_point_verification(
                    soi_poi, 'loi', coi)
            if verify_check == True:
                soi_aoi = models.SoiStoryXoi.objects.filter(
                    soi_id_fk=point_id, poi_id=0, loi_id=0).values_list('aoi_id', flat=True)
                verify_check = check_coi_point_verification(
                    soi_poi, 'aoi', coi)
    if verification == 1 and verify_check == False:
        return HttpResponse("Fail")
    else:
        coi_point.verification = verification
        if feedback_mes:
            coi_point.feedback_mes = feedback_mes
        else:
            coi_point.feedback_mes = "驗證通過"
            
        print(feedback_mes)
        coi_point.save()
    return HttpResponse("Success")

def check_coi_point_verification(point_list, types, coi):
    verify_check = True
    for point in point_list:
        try:
            check_point = models.CoiPoint.objects.get(
                types=types, point_id=point, coi_name=coi)
        except ObjectDoesNotExist:
            return False
        if check_point.verification == -1:
            verify_check = False
            break
    return verify_check

def get_user_all_coi(user_id):
    coi_list = list(
        models.CoiUser.objects.filter(user_fk=user_id).values_list(
            'coi_name', flat=True))
    return coi_list

def get_point_all_coi(request):
    point_id = request.POST.get('id')
    point_type = request.POST.get('type')

    coi_list = list(models.CoiPoint.objects.filter(
        point_id=point_id, types=point_type).values_list('coi_name', flat=True).distinct())
    return JsonResponse(coi_list, safe=False)

def get_all_point_soi(request, coi):
    soi_id = int(request.POST.get('id'))
    data = []
    valid_length = 0

    try:
        soi = models.SoiStory.objects.get(soi_id=soi_id)
    except ObjectDoesNotExist:
        return JsonResponse(data, safe=False)

    soi_list = models.SoiStoryXoi.objects.filter(soi_id_fk=soi)
    soi_owner = soi.soi_user_name
    owner = [soi_owner]
    for point in soi_list:
        try:
            poi = point.poi_id
            data, valid_length = append_json(
                data, poi.poi_id, 'poi', poi.poi_title, poi.rights, poi.verification, coi, valid_length)
            if poi.rights not in owner:
                user_obj = models.UserProfile.objects.get(user_name=poi.rights)
                if not check_user_in_coi(user_obj, coi):
                    owner.append(poi.rights)
        except:
            pass

        try:
            loi = point.loi_id
            data, valid_length = append_json(
                data, loi.route_id, 'loi', loi.route_title, loi.route_owner, loi.verification, coi, valid_length)
            if loi.route_owner not in owner:
                user_obj = models.UserProfile.objects.get(
                    user_name=loi.route_owner)
                if not check_user_in_coi(user_obj, coi):
                    owner.append(loi.route_owner)
        except:
            pass

        try:
            aoi = point.aoi_id
            data, valid_length = append_json(
                data, aoi.aoi_id, 'aoi', aoi.title, aoi.owner, aoi.verification, coi, valid_length)
            if aoi.owner not in owner:
                user_obj = models.UserProfile.objects.get(user_name=aoi.owner)
                if check_user_in_coi(user_obj, coi):
                    owner.append(aoi.owner)
        except:
            pass

    total_data = {
        'owner': owner,
        'data': data,
        'data_len': valid_length,
    }
    return JsonResponse(total_data, safe=False)

def get_user_all_coi_point(request, coi=''):
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        template = get_template(coi + '/index.html')
        html = template.render(locals())
        return HttpResponse(html)

    try:
        nickname = request.session['%snickname' % (coi)]
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    try:
        user_obj = models.UserProfile.objects.filter(user_name=username)
    except ObjectDoesNotExist:
        template = get_template(coi + '/index.html')
        html = template.render(locals())
        return HttpResponse(html)

    if check_user_in_coi(user_obj, coi):
        coi_poi = FilterCoiPoint('poi', coi)
        coi_loi = FilterCoiPoint('loi', coi)
        coi_aoi = FilterCoiPoint('aoi', coi)
        coi_soi = FilterCoiPoint('soi', coi)

        user_poi = coi_poi.filter(rights=username, language=language)
        user_loi = coi_loi.filter(route_owner=username, language=language)
        user_aoi = coi_aoi.filter(owner=username, language=language)
        user_soi = coi_soi.filter(soi_user_name=username, language=language)

        export_poi_list = list(user_poi.values('poi_id', 'poi_title', 'subject', 'area_name_en', 'type1', 'period', 'year', 
        'keyword1', 'keyword2', 'keyword3', 'keyword4', 'poi_address', 'latitude', 'longitude',
        'poi_description_1', 'format', 'poi_source', 'creator', 'publisher', 'contributor', 'open', 'language'))
        for poi in export_poi_list:
            # print(poi)
            Pictures = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=1) 
            Audio = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=2)
            Video = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=4) 
            index = 1
            for p in Pictures:
                print('picture url:',p.picture_url)
                poi['picture'+str(index)] = p.picture_url
                index += 1
            for a in Audio:
                poi['audio'] = a.picture_url
                print('audio url:',a.picture_url)
            for v in Video:
                poi['video'] = v.picture_url
                print('video url:',v.picture_url)


        poi_list, loi_list, aoi_list, soi_list = [], [], [], []
        for poi in list(user_poi.values('poi_id', 'poi_title', 'open')):
            temp_poi = models.CoiPoint.objects.get(
                point_id=poi['poi_id'], coi_name=coi)
            poi['verification'] = temp_poi.verification
            poi['feedback_mes'] = temp_poi.feedback_mes
            try:
                poi['format'] = min(models.Mpeg.objects.filter(foreignkey=poi['poi_id']).values_list('format', flat=True))
            except:
                poi['format'] = 0
            poi_list.append(poi)

        for loi in list(user_loi.values('route_id', 'route_title', 'open')):
            temp_loi = models.CoiPoint.objects.get(
                point_id=loi['route_id'], coi_name=coi)
            loi['verification'] = temp_loi.verification
            loi['feedback_mes'] = temp_loi.feedback_mes
            loi_list.append(loi)

        for aoi in list(user_aoi.values('aoi_id', 'title', 'open')):
            temp_aoi = models.CoiPoint.objects.get(
                point_id=aoi['aoi_id'], coi_name=coi)
            aoi['verification'] = temp_aoi.verification
            aoi['feedback_mes'] = temp_aoi.feedback_mes
            aoi_list.append(aoi)

        for soi in list(user_soi.values('soi_id', 'soi_title', 'open')):
            temp_soi = models.CoiPoint.objects.get(
                point_id=soi['soi_id'], coi_name=coi)
            soi['verification'] = temp_soi.verification
            soi['feedback_mes'] = temp_soi.feedback_mes
            soi_list.append(soi)

        try:
            loipoi = models.Sequence.objects.filter(foreignkey__in=user_loi)
        except:
            loipoi = None
        try:
            aoipoi = models.AoiPois.objects.filter(aoi_id_fk__in=user_aoi)
        except:
            aoipoi = None
        try:
            soixoi = models.SoiStoryXoi.objects.filter(soi_id_fk__in=user_soi)
        except:
            soixoi = None     

        groups = models.Groups.objects.filter(language=language, coi_name=coi)
        group_list = models.GroupsMember.objects.filter(
            user_id=user_obj, foreignkey__in=groups)
        template = get_template(coi + '/list_point.html')
        html = template.render(locals())
        return HttpResponse(html)
    else:
        template = get_template(coi + '/index.html')
        html = template.render(locals())
        return HttpResponse(html)


def add_user_to_coi(request):
    username = request.POST.get('username')
    coi = request.POST.get('coiname')
    try:
        user_info = models.UserProfile.objects.get(user_name=username)
    except ObjectDoesNotExist:
        return HttpResponse("No user")
    AddCoiUser(user_info, coi)
    return HttpResponse("Success")



#for sdc

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
    # AutoIncrementSqlSave(obj, "[dbo].[CoiPoint]")

def AddCoiUser(user, coi):
    if not models.CoiUser.objects.filter(user_fk=user, coi_name=coi).exists():
        max_coi_id = models.CoiUser.objects.all().aggregate(Max('id'))
        if max_coi_id['id__max'] == None:
            coi_id = 1
        else:
            coi_id = int(max_coi_id['id__max']) + 1
        obj = models.CoiUser(id=coi_id, coi_name=coi, user_fk=user)
        AutoIncrementSqlSave(obj, "[dbo].[CoiUser]")

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

def check_coi_point(point_list, types, coi):
    return_list = []
    for xoi in point_list:        
        check_exist = models.CoiPoint.objects.filter(
            types=types, point_id=xoi, coi_name=coi)
        if check_exist.exists():
            return_list.append(1)
        else:
            return_list.append(0)
    return return_list

def check_user_in_coi(user_obj, coi):
    coi_user = models.CoiUser.objects.filter(user_fk=user_obj, coi_name=coi)
    return coi_user.exists()

def recordLogs(request,urls,username):
    if username != '':  # login user
        user = models.UserProfile.objects.get(user_name=username)
        user_id = user.user_id
    else:  # user not login
        user_id = 0

    if len(urls)==0:
        return

    ip = get_user_ip(request)
    exploring_time = datetime.now()


    pre_page = 'UNKNOWN'

    objList=[]
    for info in urls:
        page = 'http://deh.csie.ncku.edu.tw/' + str(info["url"]) + '/' +str( info["id"])
        obj = models.Logs(
            user_id=user_id,
            ip=ip,
            dt=exploring_time,
            page=page,
            pre_page = pre_page,
            ulatitude=0,
            ulongitude=0
        )
        objList.append((obj))
    # obj.save(force_insert=True)

    print("ddddddddd",len(objList))
    try:
        models.Logs.objects.bulk_create(objList)
    except Exception as error:
        print("there exists error：",error)
    # request.session['pre_page'] = page

def recordLog(request, id, username, url):  # Keep the exploring Log data of use
    if username != '':  # login user
        user = models.UserProfile.objects.get(user_name=username)
        user_id = user.user_id
    else:  # user not login
        user_id = 0
    ip = get_user_ip(request)
    exploring_time = datetime.now()
    page = 'http://deh.csie.ncku.edu.tw/' + url + '/' + id
    pre_page = 'UNKNOWN'
    '''try:
        count = models.Logs.objects.filter(
            user_id=user_id, ip=ip, page=page).count()  # Prevent duplicate data recorded.
    except:
        count = 0

    if count < 1:'''
    obj = models.Logs(
        user_id=user_id,
        ip=ip,
        dt=exploring_time,
        page=page,
        pre_page = pre_page,
        ulatitude=0,
        ulongitude=0
    )
    obj.save(force_insert=True)
    request.session['pre_page'] = page
    '''else:
        print("Duplicated record")'''

def my_history(request):  # history log
    if 'username' in request.session:
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']
        template = get_template('my_history.html')
        user = models.UserProfile.objects.get(user_name=username)
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')

def SendMailThread(title,mail_content,mail_address):
    # 利用thread 平行寄信 減少等待時間
    def SendMail():
        print("Send mail through thread : to ", mail_address)
        msg = EmailMessage(title, mail_content, to=[mail_address])
        msg.send()

    t = threading.Thread(target = SendMail)
    t.start()    
