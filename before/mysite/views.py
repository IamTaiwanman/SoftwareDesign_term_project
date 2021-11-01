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
    poi_count = models.Dublincore.objects.filter(
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
        poi = models.Dublincore.objects.filter(
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
            # topic(all) area(all) ttype(all) category(all) media(all)
            if (area == '全部') and (topic == None or topic == 'all') and (ttype == None or ttype == 'all') and (category == None or category == 'all') and (media == None or media == 'all'):
                all_poi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en__in=get_all, language=language)  # open= 1 (公開)
            # topic(all) area(all) ttype(all) category(all) media(not all)
            elif (area == '全部') and (topic == None or topic == 'all') and (ttype == None or ttype == 'all') and (category == None or category == 'all') and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en__in=get_all, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(all) area(all) ttype(not all) category(all) media(all)
            elif (area == '全部') and (topic == None or topic == 'all') and (not (ttype == None or ttype == 'all')) and (category == None or category == 'all') and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, type1=ttype,
                                         area_name_en__in=get_all, language=language)  # open= 1 (公開)
            # topic(all) area(all) ttype(not all) category(all) #media(not all)
            elif (area == '全部') and (topic == None or topic == 'all') and (not (ttype == None or ttype == 'all')) and (category == None or category == 'all') and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, type1=ttype, area_name_en__in=get_all, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(all) area(all) ttype(all) category(not all) media(all)
            elif (area == '全部') and (topic == None or topic == 'all') and (ttype == None or ttype == 'all') and (not(category == None or category == 'all')) and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, format=category,
                                         area_name_en__in=get_all, language=language)  # open= 1 (公開)
            # topic(all) area(all) ttype(all) category(not all) media(not all)
            elif (area == '全部') and (topic == None or topic == 'all') and (ttype == None or ttype == 'all') and (not(category == None or category == 'all')) and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, format=category, area_name_en__in=get_all, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(all) area(all) ttype(not all) category(not all) media(all)
            elif (area == '全部') and (topic == None or topic == 'all') and (not (ttype == None or ttype == 'all')) and (not(category == None or category == 'all')) and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, type1=ttype, format=category,
                                         area_name_en__in=get_all, language=language)  # open= 1 (公開)
            # topic(all) area(all) ttype(not all) category(not all) media(not all)
            elif (area == '全部') and (topic == None or topic == 'all') and (not (ttype == None or ttype == 'all')) and (not(category == None or category == 'all')) and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, type1=ttype, format=category, area_name_en__in=get_all, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(not all) area(all) ttype(all) category(all) media(all)
            elif (area == '全部') and (not (topic == None or topic == 'all')) and (ttype == None or ttype == 'all') and (category == None or category == 'all') and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, subject=topic,
                                         area_name_en__in=get_all, language=language)  # open= 1 (公開)
            # topic(not all) area(all) ttype(all) category(all) media(not all)
            elif (area == '全部') and (not (topic == None or topic == 'all')) and (ttype == None or ttype == 'all') and (category == None or category == 'all') and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, subject=topic, area_name_en__in=get_all, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(not all) area(all) ttype(not all) category(all) media(all)
            elif (area == '全部') and (not (topic == None or topic == 'all')) and (not (ttype == None or ttype == 'all')) and (category == None or category == 'all') and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, subject=topic,
                                         type1=ttype, area_name_en__in=get_all, language=language)  # open= 1 (公開)
            # topic(not all) area(all) ttype(not all) category(all) media(not all)
            elif (area == '全部') and (not (topic == None or topic == 'all')) and (not (ttype == None or ttype == 'all')) and (category == None or category == 'all') and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, subject=topic, type1=ttype, area_name_en__in=get_all, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(not all) area(all) ttype(all) category(not all) media(all)
            elif (area == '全部') and (not (topic == None or topic == 'all')) and (ttype == None or ttype == 'all') and (not(category == None or category == 'all')) and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, subject=topic, format=category,
                                         area_name_en__in=get_all, language=language)  # open= 1 (公開)
            # topic(not all) area(all) ttype(all) category(not all) media(not all)
            elif (area == '全部') and (not (topic == None or topic == 'all')) and (ttype == None or ttype == 'all') and (not(category == None or category == 'all')) and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, subject=topic, format=category, area_name_en__in=get_all, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(not all) area(all) ttype(not all) category(not all) media(all)
            elif (area == '全部') and (not (topic == None or topic == 'all')) and (not (ttype == None or ttype == 'all')) and (not(category == None or category == 'all')) and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, subject=topic, format=category,
                                         type1=ttype, area_name_en__in=get_all, language=language)  # open= 1 (公開)
            # topic(not all) area(all) ttype(not all) category(not all) media(not all)
            elif (area == '全部') and (not (topic == None or topic == 'all')) and (not (ttype == None or ttype == 'all')) and (not(category == None or category == 'all')) and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, subject=topic, format=category, type1=ttype, area_name_en__in=get_all, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(all) area(not all) ttype(all) category(all) media(all)
            elif (not (area == '全部')) and (topic == None or topic == 'all') and (ttype == None or ttype == 'all') and (category == None or category == 'all') and (media == None or media == 'all'):
                all_poi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en=area, language=language)  # open= 1 (公開)
            # topic(all) area(not all) ttype(all) category(all) media(not all)
            elif (not (area == '全部')) and (topic == None or topic == 'all') and (ttype == None or ttype == 'all') and (category == None or category == 'all') and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(all) area(not all) ttype(not all) category(all) media(all)
            elif (not (area == '全部')) and (topic == None or topic == 'all') and (not (ttype == None or ttype == 'all')) and (category == None or category == 'all') and (media == None or media == 'all'):
                all_poi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en=area, type1=ttype, language=language)  # open= 1 (公開)
            # topic(all) area(not all) ttype(not all) category(all) media(not all)
            elif (not (area == '全部')) and (topic == None or topic == 'all') and (not (ttype == None or ttype == 'all')) and (category == None or category == 'all') and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area, type1=ttype, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(all) area(not all) ttype(all) category(not all) media(all)
            elif (not (area == '全部')) and (topic == None or topic == 'all') and (ttype == None or ttype == 'all') and (not(category == None or category == 'all')) and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, format=category,
                                         area_name_en=area, language=language)  # open= 1 (公開)
            # topic(all) area(not all) ttype(all) category(not all) media(not all)
            elif (not (area == '全部')) and (topic == None or topic == 'all') and (ttype == None or ttype == 'all') and (not(category == None or category == 'all')) and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, format=category, area_name_en=area, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(all) area(not all) ttype(not all) category(not all) media(all)
            elif (not (area == '全部')) and (topic == None or topic == 'all') and (not (ttype == None or ttype == 'all')) and (not(category == None or category == 'all')) and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, format=category,
                                         area_name_en=area, type1=ttype, language=language)  # open= 1 (公開)
            # topic(all) area(not all) ttype(not all) category(not all) media(not all)
            elif (not (area == '全部')) and (topic == None or topic == 'all') and (not (ttype == None or ttype == 'all')) and (not(category == None or category == 'all')) and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, format=category, area_name_en=area, type1=ttype, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(not all) area(not all) ttype(all) category(all) media(all)
            elif (not (area == '全部')) and (not (topic == None or topic == 'all')) and (ttype == None or ttype == 'all') and (category == None or category == 'all') and (media == None or media == 'all'):
                all_poi = all_xoi.filter(
                    identifier=map_role, open=1, area_name_en=area, subject=topic, language=language)  # open= 1 (公開)
            # topic(not all) area(not all) ttype(all) category(all) media(not all)
            elif (not (area == '全部')) and (not (topic == None or topic == 'all')) and (ttype == None or ttype == 'all') and (category == None or category == 'all') and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area, subject=topic, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(not all) area(not all) ttype(not all) category(all) media(all)
            elif (not (area == '全部')) and (not (topic == None or topic == 'all')) and (not (ttype == None or ttype == 'all')) and (category == None or category == 'all') and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area,
                                         subject=topic, type1=ttype, language=language)  # open= 1 (公開)
            # topic(not all) area(not all) ttype(not all) category(all) media(not all)
            elif (not (area == '全部')) and (not (topic == None or topic == 'all')) and (not (ttype == None or ttype == 'all')) and (category == None or category == 'all') and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area, subject=topic, type1=ttype, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(not all) area(not all) ttype(all) category(not all) media(all)
            elif (not (area == '全部')) and (not (topic == None or topic == 'all')) and (ttype == None or ttype == 'all') and (not(category == None or category == 'all')) and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area,
                                         subject=topic, format=category, language=language)  # open= 1 (公開)
            # topic(not all) area(not all) ttype(all) category(not all) media(not all)
            elif (not (area == '全部')) and (not (topic == None or topic == 'all')) and (ttype == None or ttype == 'all') and (not(category == None or category == 'all')) and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area, subject=topic, format=category, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
            # topic(not all) area(not all) ttype(not all) category(not all) media(all)
            elif (not (area == '全部')) and (not (topic == None or topic == 'all')) and (not (ttype == None or ttype == 'all')) and (not(category == None or category == 'all')) and (media == None or media == 'all'):
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area,
                                         subject=topic, type1=ttype, format=category, language=language)  # open= 1 (公開)
            # topic(not all) area(not all) ttype(not all) category(not all) media(not all)
            elif (not (area == '全部')) and (not (topic == None or topic == 'all')) and (not (ttype == None or ttype == 'all')) and (not(category == None or category == 'all')) and (not(media == None or media == 'all')):
                all_mpeg = models.Mpeg.objects.values(
                    'foreignkey').filter(format=media)
                all_poi = all_xoi.filter(identifier=map_role, open=1, area_name_en=area, subject=topic, type1=ttype, format=category, language=language).filter(
                    Q(poi_id__in=all_mpeg) | Q(orig_poi__in=all_mpeg))  # open= 1 (公開)
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

        all_poi = models.Dublincore.objects.filter(
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


def make_player(request, ids=None, types=None):
    if 'username' in request.session:
        try:
            nickname = request.session['nickname']
        except:
            pass
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']
        all_poi = models.Dublincore.objects.filter(
            rights=username, language=language)

        temp_loi = models.RoutePlanning.objects.filter(
            route_owner=username, language=language)
        temp_aoi = models.Aoi.objects.filter(owner=username, language=language)
        temp_soi = models.SoiStory.objects.filter(
            soi_user_name=username, language=language)
        user = models.UserProfile.objects.get(user_name=username)
        group = models.Groups.objects.filter(language=language)  # 是否要分語言(?)   
        count_nn = 0   

        ###匯出檔案專用###
        export_poi_list = list(all_poi.values('poi_id', 'poi_title', 'subject', 'area_name_en', 'type1', 'period', 'year', 
        'keyword1', 'keyword2', 'keyword3', 'keyword4', 'poi_address', 'latitude', 'longitude',
        'poi_description_1', 'format', 'poi_source', 'creator', 'publisher', 'contributor', 'open', 'language'))
        for poi in export_poi_list:
            # print(poi)
            Pictures = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=1) 
            Audio = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=2)
            Video = models.Mpeg.objects.filter(foreignkey=poi['poi_id'],format=4) 
            index = 1
            for p in Pictures:
                #print('picture url:',p.picture_url)
                poi['picture'+str(index)] = p.picture_url
                index += 1
            for a in Audio:
                poi['audio'] = a.picture_url
                #print('audio url:',a.picture_url)
            for v in Video:
                poi['video'] = v.picture_url
                #print('video url:',v.picture_url)
        ###匯出檔案專用###  

        try:
            values = models.Mpeg.objects.filter(
                foreignkey__in=all_poi).values('foreignkey')
            no_mpeg_temp = all_poi.exclude(poi_id__in=values)
            poi_list = all_poi.filter(poi_id__in=values)       
            poi = [] 
              
            for p in list(poi_list.values('poi_id', 'poi_title', 'open', 'verification')):
                p['format'] = min(models.Mpeg.objects.filter(foreignkey=p['poi_id']).values_list('format', flat=True))
                try:
                    #print("poi_id:",p['poi_id']," count: ", count_nn) 
                    count_nn+= 1
                    temp = models.CoiPoint.objects.get(types = 'poi', point_id = p['poi_id'], coi_name = 'deh').feedback_mes
                    p['feedback_mes'] = temp
                except ObjectDoesNotExist:
                    trace_back = traceback.format_exc()
                    AddCoiPoint(p['poi_id'], "poi", "deh",p['verification'])
                    p['feedback_mes'] = '驗證不通過'  #default 為驗證不通過
                    print("ObjectDoesNotExist exception happened")
                except Exception as e:
                    print(e)
                    print("資料庫重複")
                poi.append(p)

                
        except Exception as e:
            print("no data")
            print(e)


        no_mpeg = []  
        for temp in list(no_mpeg_temp.values('poi_id', 'poi_title', 'open', 'verification')):
            try:
                mes = models.CoiPoint.objects.get(types = 'poi', point_id = temp['poi_id'], coi_name = 'deh').feedback_mes
                temp['feedback_mes'] = mes
            except ObjectDoesNotExist:
                AddCoiPoint(temp['poi_id'], "poi", "deh",temp['verification'])
                temp['feedback_mes'] = '驗證不通過'  #default 為驗證不通過
                print("Coipoint not found , addCoipoint")
            except:
                print("資料庫重複")
            no_mpeg.append(temp)

        loi = []
        loi_list = []
        for temp in list(temp_loi.values('route_id','area_name_en','route_description','contributor','transportation','language','route_owner', 'route_title', 'open', 'verification')):            
            try:             
                mes = models.CoiPoint.objects.get(types = 'loi', point_id = temp['route_id'], coi_name = 'deh').feedback_mes
                temp['feedback_mes'] = mes
            except ObjectDoesNotExist:
                AddCoiPoint(temp['route_id'], "loi", "deh",temp['verification'])
                temp['feedback_mes'] = '驗證不通過'  #default 為驗證不通過
                print("Coipoint not found , addCoipoint")
            except:
                print("資料已存在")
            loi.append(temp)
            loi_list.append(temp['route_id'])

        aoi = []
        aoi_list = []
        for temp in list(temp_aoi.values('aoi_id', 'title','area_name_en','description','contributor','transportation','owner','language', 'open', 'verification')):
            try:
                mes = models.CoiPoint.objects.get(types = 'aoi', point_id = temp['aoi_id'], coi_name = 'deh').feedback_mes
                temp['feedback_mes'] = mes
            except ObjectDoesNotExist:
                AddCoiPoint(temp['aoi_id'], "aoi", "deh",temp['verification'])
                temp['feedback_mes'] = '驗證不通過'  #default 為驗證不通過
                print("Coipoint not found , addCoipoint")
            except:
                print("資料已存在")
            aoi.append(temp)
            aoi_list.append(temp['aoi_id'])

        soi = []
        soi_id_list = []
        for temp in list(temp_soi.values('soi_id', 'soi_title','area_name_en','soi_description','contributor','language', 'open', 'verification')):
            try:
                mes = models.CoiPoint.objects.get(types = 'soi', point_id = temp['soi_id'], coi_name = 'deh').feedback_mes
                temp['feedback_mes'] = mes
            except ObjectDoesNotExist:
                AddCoiPoint(temp['soi_id'], "soi", "deh",temp['verification'])
                temp['feedback_mes'] = '驗證不通過'  #default 為驗證不通過
                print("Coipoint not found , addCoipoint")
            except:
                print("資料已存在")
            soi.append(temp)
            soi_id_list.append(temp['soi_id'])

        try:
            sequence = models.Sequence.objects.filter(foreignkey__in=loi_list)
        except Exception as e:
            print("error happened",e)
            sequence = None
        try:
            aoipoi = models.AoiPois.objects.filter(aoi_id_fk__in=aoi_list)
        except:
            aoipoi = None
        try:
            soi_list = models.SoiStoryXoi.objects.filter(soi_id_fk__in=soi_id_list)
        except:
            soi_list = None
        try:
            group_list = models.GroupsMember.objects.filter(
                user_id=user, foreignkey__in=group)
        except:
            group_list = None
        if ids and types:
            try:
                if types == 'poi':
                    del_poi = models.Dublincore.objects.get(poi_id=ids)
                    mpeg = models.Mpeg.objects.filter(foreignkey=del_poi)
                elif types == 'loi':
                    del_loi = models.RoutePlanning.objects.get(route_id=ids)
                elif types == 'aoi':
                    del_aoi = models.Aoi.objects.get(aoi_id=ids)
                elif types == 'soi':
                    del_soi = models.SoiStory.objects.get(soi_id=ids)
            except:
                del_poi = None
                mpeg = None
                del_loi = None
                del_aoi = None
                del_soi = None
            if types == 'poi' and del_poi:
                if mpeg:
                    for m in mpeg:
                        if m.format == 1:
                            file_neme = (media_dir + m.picture_name)
                            try:
                                os.remove(file_neme)
                            except OSError:
                                pass
                        elif m.format == 2:
                            file_neme = (media_dir + 'audio/' + m.picture_name)
                            try:
                                os.remove(file_neme)
                            except OSError:
                                pass
                        elif m.format == 4:
                            file_neme = (media_dir + 'video/' + m.picture_name)
                            try:
                                os.remove(file_neme)
                            except OSError:
                                pass
                        elif m.format == 8:
                            file_neme = (media_dir + 'audio/' + m.picture_name)
                            try:
                                os.remove(file_neme)
                            except OSError:
                                pass
                del_poi.delete()
            elif types == 'loi' and del_loi:
                del_loi.delete()
            elif types == 'aoi' and del_aoi:
                del_aoi.delete()
            elif types == 'soi' and del_soi:
                del_soi.delete()
            else:
                mpeg = None
                del_poi = None
                del_loi = None
                del_aoi = None
                del_soi = None
            delete_all_xoi_in_coi(ids, types)
            return HttpResponseRedirect('/make_player')
        coi_list = get_user_all_coi(user)
        coi_len = len(coi_list)
        template = get_template('make_player.html')
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')


def feed_area(request):
    city = request.POST.get('city')  # 中文
    areas = models.Area.objects.filter(area_country=city)
    values_list = list(areas.values('area_name_ch', 'area_name_en'))
    data = {
        "area": values_list
    }
    return JsonResponse(data)


def make_player_poi(request):  # 製做景點頁面
    if 'username' in request.session:
        username = request.session['username']
        role = request.session['role']
        try:
            nickname = request.session['nickname']
        except:
            pass
        language = request.session['language']
        messages.get_messages(request)
        template = get_template('make_player_poi.html')
        if language == '中文':
            areas = models.Area.objects.values('area_country').distinct()
        else:
            areas = models.Area.objects.values(
                'area_country_en', 'area_country').distinct()
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')


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
                    xoi_latlng = models.Dublincore.objects.filter(
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


def delete_media(request):
    picture_id = request.POST.get('picture_id')
    media_name = request.POST.get('picture_name')
    formats = request.POST.get('format')
    del_media = models.Mpeg.objects.get(picture_id=picture_id)
    del_media.delete()
    if picture_id and media_name:
        try:
            if formats == "1":  #上傳圖片
                os.remove(media_dir + media_name)
            elif formats == "2":  #上傳聲音
                os.remove(media_dir + 'audio/' + media_name)
            elif formats == "4":  #上傳影片
                os.remove(media_dir + 'video/' + media_name)
            elif formats == "8":  #語音導覽
                os.remove(media_dir + 'audio/' + media_name)
        except OSError:
            pass
        return HttpResponse('success')
    else:
        return HttpResponse('fail')


def get_area(request):
    area = request.POST.get('area')  # 英文
    areas = models.Area.objects.filter(area_name_en=area)
    values_list = list(areas.values(
        'area_name_ch', 'area_country', 'area_name_en'))
    data = {
        "area": values_list
    }
    return JsonResponse(data)


def ajax_dublincore(request, coi=''):  # 存Dublincore table make_poi
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
            max_poi_id = models.Dublincore.objects.all().aggregate(Max('poi_id'))  # 取得最大poi_id
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
            original = models.Dublincore.objects.get(poi_id=poi_id)
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
        
        print("============")
        print(picture_url)
        print("============")


        obj = models.Dublincore(
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
        #obj.save()
        AutoIncrementSqlSave(obj, "[dbo].[dublincore]")
        
        print("************************************************")
        print("************************************************")
        print(media,type(media))
        print("************************************************")
        print("************************************************")

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
                foreignkey = models.Dublincore.objects.get(poi_id=poi_id)
                picture_type = picture_url[i].split(".")[-1]

                print("開始寫入mpeg第[",i+1,"]張圖片....")

                obj = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=0,
                           picture_type=picture_type, picture_url=picture_url[i], picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                           picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=1)
                AutoIncrementSqlSave(obj, "[dbo].[mpeg]")

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
            foreignkey = models.Dublincore.objects.get(poi_id=poi_id)
            picture_type = audio.split(".")[-1]
            print("開始寫入mpeg聲音....")

            obj = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=0,
                           picture_type=picture_type, picture_url=audio, picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                           picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=2)
            AutoIncrementSqlSave(obj, "[dbo].[mpeg]")

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
            foreignkey = models.Dublincore.objects.get(poi_id=poi_id)
            picture_type = video.split(".")[-1]
            print("開始寫入mpeg影片....")

            obj = models.Mpeg(picture_id=picture_id, picture_name=picture_name, picture_size=0,
                           picture_type=picture_type, picture_url=video, picture_upload_user=picture_upload_user, picture_rights=picture_rights,
                           picture_upload_time=picture_upload_time, foreignkey=foreignkey, format=4)
            AutoIncrementSqlSave(obj, "[dbo].[mpeg]")

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



def ajax_prize(request,coi=''):
    try:
        username = request.session['%susername' % (coi)]
    except:
        if coi == '':
            return HttpResponseRedirect('/')
        else:
            return HttpResponseRedirect('/%s/index.html' % (coi))

    user = models.UserProfile.objects.get(user_name=username)
    user_id = user.user_id
    #max_prize_id = models.prize_profile.objects.all().aggregate(Max('prize_id'))  # 取得最大prize_id
    #prize_id = int(max_prize_id['prize_id__max']) + 1  
    #print(prize_id)
    
    # f = request.POST.get('foreignkey')
    # f = int(f)
    # foreignkey = models.Dublincore.objects.get(poi_id=f)
    # username = foreignkey.rights

    prize_title = request.POST.get('prize_title')
    prize_num = request.POST.get('prize_num')
    prize_description = request.POST.get('prize_description')
    isopen = request.POST.get('isPublic')
    group_id = request.POST.get('group_id')

    #print(group_id)
    if request.method == 'POST':
        prize_make = request.POST.get('prize_make')
        #print(prize_make)
        if prize_make == 'make':
            max_prize_id = models.prize_profile.objects.all().aggregate(Max('prize_id'))  # 取得最大prize_id
            prize_id = int(max_prize_id['prize_id__max']) + 1
        else:
            prize_id = request.POST.get('prize_id')
        try:
            afile = request.FILES.get('file')
            #print(afile)
            if afile != None:
                fname = afile.name.split(".")[-1] #副檔名
                new_name = str(datetime.now()) + \
                '_' + str(prize_id) + '.' + fname
                afile.name = new_name
                #print(afile)
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
        #AutoIncrementSqlSave(obj, '[dbo].[prize_profile]')
        #prize_id = prize_id + 1
    if coi == '':
            return HttpResponseRedirect('/')
    else:
        return HttpResponseRedirect('/%s/list_prize' % (coi))
    #return HttpResponseRedirect('/%s/list_prize' % (coi))

def ajax_mpeg(request):  # 存Mpeg table
    max_picture_id = models.Mpeg.objects.all().aggregate(
        Max('picture_id'))  # 取得最大picture_id
    # 最大picture_id轉成整數+1
    picture_id = int(max_picture_id['picture_id__max']) + 1
    f = request.POST.get('foreignkey')
    f = int(f)
    foreignkey = models.Dublincore.objects.get(poi_id=f)
    username = foreignkey.rights
    media_type = request.POST.get('media') #對應前端上傳的多媒體
    sound_type = request.POST.get('sounds')
    if request.method == 'POST':
        if media_type == "1" and sound_type == "0":
            for afile in request.FILES.getlist('image_file_modified'):
                picture_name = afile  # original picture name
                picture_url = '../player_pictures/media/'
                img_list, picture_name = ManageMediaFile(
                    foreignkey, picture_id, username, afile, picture_url, 1)
                if afile:
                    img_list.save()
                    #AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
                picture_id = picture_id + 1
            return HttpResponseRedirect('/make_player')
        elif media_type == "2" and sound_type == "0":
            afile = request.FILES.get('audio_file')
            picture_name = afile  # original audio name
            picture_url = '../player_pictures/media/audio/'
            img_list, picture_name = ManageMediaFile(
                foreignkey, picture_id, username, afile, picture_url, 2)
            if afile:
                AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
            return HttpResponseRedirect('/make_player')
        elif media_type == "4" and sound_type == "0":
            print("444444444444444000000000000000000")
            afile = request.FILES.get('video_file')
            print(afile)
            picture_name = afile  # original video name
            picture_url = '../player_pictures/media/video/'
            img_list, picture_name = ManageMediaFile(
                foreignkey, picture_id, username, afile, picture_url, 4)
            """ if picture_name == 'error':
                print("error")
                return HttpResponseServerError() """
            if afile:
                AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
            return HttpResponseRedirect('/make_player')
        elif media_type == "1" and sound_type == "8":
            for afile in request.FILES.getlist('image_file_modified'):
                picture_name = afile  # original picture name
                picture_url = '../player_pictures/media/'
                img_list, picture_name = ManageMediaFile(
                    foreignkey, picture_id, username, afile, picture_url, 1)
                if afile:
                    AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
                picture_id = picture_id + 1
            bfile = request.FILES.get('sound_file')
            picture_name = bfile  # original sound name
            picture_url = '../player_pictures/media/audio/'
            sound_list, picture_name = ManageSoundFile(
                foreignkey, picture_id, username, bfile, picture_url, 8)
            if bfile:
                AutoIncrementSqlSave(sound_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
            return HttpResponseRedirect('/make_player')
        elif media_type == "2" and sound_type == "8":
            afile = request.FILES.get('audio_file')
            picture_name = afile  # original audio name
            picture_url = '../player_pictures/media/audio/'
            img_list, picture_name = ManageMediaFile(
                foreignkey, picture_id, username, afile, picture_url, 2)
            if afile:
                AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1

            bfile = request.FILES.get('sound_file')
            picture_name = bfile  # original sound name
            picture_url = '../player_pictures/media/audio/'
            sound_list, picture_name = ManageSoundFile(
                foreignkey, picture_id, username, bfile, picture_url, 8)
            if bfile:
                AutoIncrementSqlSave(sound_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
            return HttpResponseRedirect('/make_player')
        elif media_type == "4" and sound_type == "8":
            afile = request.FILES.get('video_file')
            picture_name = afile  # original video name
            picture_url = '../player_pictures/media/video/'
            img_list, picture_name = ManageMediaFile(
                foreignkey, picture_id, username, afile, picture_url, 4)

            if picture_name == 'error':
                return HttpResponseServerError()

            if afile:
                AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
            bfile = request.FILES.get('sound_file')
            picture_name = bfile  # original sound name
            picture_url = '../player_pictures/media/audio/'
            sound_list, picture_name = ManageSoundFile(
                foreignkey, picture_id, username, bfile, picture_url, 8)
            if bfile:
                AutoIncrementSqlSave(sound_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
            return HttpResponseRedirect('/make_player')


def ajax_sound(request):
    max_picture_id = models.Mpeg.objects.all().aggregate(
        Max('picture_id'))  # 取得最大picture_id
    # 最大picture_id轉成整數+1
    picture_id = int(max_picture_id['picture_id__max']) + 1
    f = request.POST.get('poi_id')
    f = int(f)
    foreignkey = models.Dublincore.objects.get(poi_id=f)
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
                AutoIncrementSqlSave(img_list, '[dbo].[mpeg]')
            picture_id = picture_id + 1
            return HttpResponseRedirect('/make_player')


def ajax_handle_errupload(request):
    poi_id = request.POST.get('id')
    coi = request.POST.get('coi')

    try:
        remove_poi = models.Dublincore.objects.get(poi_id=poi_id)
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


def make_player_loi(request):  # loi page load
    if 'username' in request.session:
        username = request.session['username']
        role = request.session['role']
        try:
            nickname = request.session['nickname']
        except:
            pass        

        language = request.session['language']
        template = get_template('make_player_loi.html')
        if language == '中文':
            areas = models.Area.objects.values('area_country').distinct()
        else:
            areas = models.Area.objects.values(
                'area_country_en', 'area_country').distinct()
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')


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
            first_poi = models.Dublincore.objects.get(poi_id=first_poi_id)            
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
            poi_id = models.Dublincore.objects.get(poi_id=p_id)
            sequence = n[i]
            seq_list = models.Sequence(
                sequence_id=sequence_id, sequence=sequence, foreignkey=foreignkey, poi_id=poi_id)
            sequence_id = sequence_id + 1
            seq_list.save()
    return HttpResponseRedirect('/make_player')


def edit_sequence(request):  # 編輯Sequence table
    f = request.POST.get('loi_id')  # Loi id
    f = int(f)
    del_poi = models.Sequence.objects.filter(foreignkey=f)
    del_poi.delete()  # 刪除舊的sequence
    max_sequence_id = models.Sequence.objects.all().aggregate(
        Max('sequence_id'))  # 取得最大sequence_id
    # 最大sequence_id轉成整數+1
    sequence_id = int(max_sequence_id['sequence_id__max']) + 1
    count = request.POST.get('count')
    count = int(count)  # poi數量
    foreignkey = models.RoutePlanning.objects.get(route_id=f)
    pid = request.POST.getlist('poi_id[]')
    pid = list(map(int, pid))
    n = request.POST.getlist('num[]')
    n = list(map(int, n))
    if request.method == 'POST':
        for i in range(count):
            p_id = pid[i]
            poi_id = models.Dublincore.objects.get(poi_id=p_id)
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
        all_pois = models.Dublincore.objects.none()

    if myOwn != "-1" :   
        # 列出所有個人的(包含所有地區、驗證情形)
        result_list = FilterCoiPoint('poi', coi,100)
        all_pois = result_list.filter(language=language, rights=myOwn)  # open= 1 (公開)
    
    if mygroup != "-1":
        all_pois = models.GroupsPoint.objects.filter(types="poi", foreignkey=mygroup)
        all_pois_id = all_pois.values_list('point_id', flat=True) 
        all_pois = models.Dublincore.objects.filter(poi_id__in=all_pois_id, open=1)

    

    #因為要在前端顯示驗證狀態/公開私有，所以這裡filter減少，並且還要額外抓公開私有狀態
    #for temp_poi in all_pois:


    poi_ans = models.Dublincore.objects.none()
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


def make_player_aoi(request):  # aoi page load
    if 'username' in request.session:
        username = request.session['username']
        role = request.session['role']
        try:
            nickname = request.session['nickname']
        except:
            pass
        language = request.session['language']
        messages.get_messages(request)
        template = get_template('make_player_aoi.html')
        if language == '中文':
            areas = models.Area.objects.values('area_country').distinct()
        else:
            areas = models.Area.objects.values(
                'area_country_en', 'area_country').distinct()
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')


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
            first_poi = models.Dublincore.objects.get(poi_id=first_poi_id)            
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
            poi_id = models.Dublincore.objects.get(poi_id=p_id)
            aoi_list = models.AoiPois(
                ids=ids, aoi_id_fk=aoi_id_fk, poi_id=poi_id)
            ids = ids + 1
            aoi_list.save()
    return HttpResponseRedirect('/make_player')

def make_prize(request,coi=''):
    max_ids = models.prize_profile.objects.all().aggregate(Max('prize_id'))  # 取得最大ids
    if(models.prize_profile.objects.count() == 0): #如果資料庫仍沒有獎品
        ids = 0
    elif(models.prize_profile.objects.count() > 0):
        ids = int(max_ids['prize_id__max'])   # 最大ids轉成整數
    ids = ids + 1
    #print(ids)
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
        #print(username)
        user = models.UserProfile.objects.get(user_name=username)
        #print(user.user_id)
        mygroup = models.EventsMember.objects.filter(user_id_id=user.user_id)

        mygroup_id = []
        for m in mygroup:
            mygroup_id.append(m.event_id_id)
            #print(m.foreignkey_id)
        if coi == '':
            group_list = models.Events.objects.filter(Q(verification=1,open=1,coi_name='deh')|Q(Event_id__in=mygroup_id,coi_name='deh'))
            print( group_list)
        else:
            group_list = models.Events.objects.filter(Q(verification=1,open=1,coi_name=coi)|Q(Event_id__in=mygroup_id,coi_name=coi))
        
        for group in group_list:
            print(group.group_name)
    except:
        pass
   
    
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    try:
        nickname = request.session['%snickname' % (coi)]
    except:
        pass 
    if coi != '':
        template_url = '%s/make_prize.html' % (coi)
    else:
        template_url = 'make_prize.html'
        coi = 'deh' 
    
    #messages.get_messages(request)
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

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
            poi_id = models.Dublincore.objects.get(poi_id=p_id)
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

    # Dublincore 沒有存country 所以要反向搜尋
    all_city = models.Area.objects.filter(area_country=city)
    city_list = all_city.values_list('area_name_en', flat=True)

##########################################################
    # poi filter  

    if area == "All":
        all_pois = all_pois.filter(Q(open=1) | Q(rights=username), area_name_en__in=city_list, language=language)  # open= 1 (公開)
    elif area and city :
        all_pois = all_pois.filter(Q(open=1) | Q(rights=username), area_name_en=area, language=language)  # open= 1 (公開)
    elif myOwn == "-1" and mygroup == "-1":
        all_pois = models.Dublincore.objects.none()
        

    if myOwn != "-1" :   
        all_pois = all_pois.filter(language=language, rights=myOwn)  # open= 1 (公開)

    
    if mygroup != "-1":
        all_pois = models.GroupsPoint.objects.filter(types="poi", foreignkey=mygroup)
        all_pois_id = all_pois.values_list('point_id', flat=True) 
        all_pois = models.Dublincore.objects.filter(poi_id__in=all_pois_id, open=1)

############################################################
############################################################
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

############################################################
############################################################
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


############################################################

    poi_ans = models.Dublincore.objects.none()
    loi_ans = models.RoutePlanning.objects.none()
    aoi_ans = models.Aoi.objects.none()

    # all_pois = all_pois.filter(Q(open=1) | Q(
    #     rights=username), area_name_en=area, language=language)  # open= 1 (公開)
    # all_loi = all_loi.filter(Q(open=1) | Q(
    #     route_owner=username), area_name_en=area, language=language)  # open= 1 (公開)
    # all_aoi = all_aoi.filter(Q(open=1) | Q(
    #     owner=username), area_name_en=area, language=language)  # open= 1 (公開)

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


def make_player_soi(request):  # soi page load
    if 'username' in request.session:
        username = request.session['username']
        language = request.session['language']
        role = request.session['role']
        try:
            nickname = request.session['nickname']
        except:
            pass
        messages.get_messages(request)
        template = get_template('make_player_soi.html')
        if language == '中文':
            areas = models.Area.objects.values('area_country').distinct()
        else:
            areas = models.Area.objects.values(
                'area_country_en', 'area_country').distinct()
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')


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
                poi_id = models.Dublincore.objects.get(poi_id=xoi_id[i])
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
                poi_id = models.Dublincore.objects.get(poi_id=xoi_id[i])
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


def edit_verification(request):
    content = request.POST.get('content')
    ids = request.POST.get('id')
    verification = request.POST.get('verification')    
    language = request.session['language']
    feedback_mes = request.POST.get('feedback_mes')
    Chk_verify = True
    Role = 'user'
    if content == 'poi':
        edit_poi = models.Dublincore.objects.get(poi_id=ids, language=language) # 兩個資料表皆存有 verification 狀態
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
    poi_ans = models.Dublincore.objects.none()
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
    poi_all = models.Dublincore.objects.filter(
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

def list_prize(request, Pid=None, coi=''):
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
        list_prize_url = '/%s/list_prize' % (coi)
        template_url = '%s/list_prize.html' % (coi)
    else:
        list_prize_url = '/list_prize'
        template_url = 'list_prize.html'
        coi = 'deh'
    user = models.UserProfile.objects.get(user_name=username)    
    prize =  models.prize_profile.objects.filter(user_id_id = user.user_id)
    PTP = models.prize_to_player.objects.filter(user_id_id = user.user_id)

    try:
        prize_list = []
        for p in PTP:
            #print(p.PTP_id)
            my_prize = {}
            prize_name = models.prize_profile.objects.get(prize_id = p.player_prize_id).prize_name
            start_time = p.start_time.split('.')[0]
            my_prize = {'PTP_id' : p.PTP_id, 'prize_id':p.player_prize_id, 'prize_name':prize_name, 'prize_amount':p.prize_amount, 'start_time':start_time, 'is_exchanged':p.is_exchanged}
            
            prize_list.append(my_prize)
    except:
        print("Prize list error.")

    if Pid:
        try:
            del_prize =  models.prize_profile.objects.get(prize_id = Pid)
            if(del_prize.is_allocated == 0): #如果此獎品尚未被分配才可以刪除
                del_prize.delete()
            return HttpResponseRedirect(list_prize_url)
        except:
            del_prize = None
    else:
        print("no delete")

    #messages.get_messages(request)
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def prize_detail(request, prize_id=None, coi=''):
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
    #mpeg = models.Mpeg.objects.filter(Q(foreignkey=poi))

    if coi != '':
        template_url = '%s/prize_detail.html' % (coi)
        #prize_detail_url = '/%s/prize_detail' % (coi)
        
    else:
        template_url = 'prize_detail.html'
        #list_group_url = '/prize_detail'
        coi = 'deh'
    try:
        if prize_id:
            try:
                prize = models.prize_profile.objects.get(prize_id = prize_id)

            except:
                prize = None
        template = get_template(template_url)
        html = template.render(locals())
        return HttpResponse(html)
    except ObjectDoesNotExist:
        print('ObjectDoesNotExist')
        #return HttpResponseRedirect(redirect_url)


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

def my_prize(request, Pid=None, coi=''):
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
        list_prize_url = '/%s/my_prize' % (coi)
        template_url = '%s/my_prize.html' % (coi)
    else:
        list_prize_url = '/my_prize'
        template_url = 'my_prize.html'
        coi = 'deh'
    user = models.UserProfile.objects.get(user_name=username)
    PTP = models.prize_to_player.objects.filter(user_id_id = user.user_id)

    try:
        prize_list = []
        for p in PTP:
            my_prize = {}
            prize_name = models.prize_profile.objects.get(prize_id = p.player_prize_id).prize_name
            gameName = models.EventSetting.objects.get(id = p.room_id_id)
            eventName = models.Events.objects.get(Event_id = gameName.event_id_id).Event_name
            start_time = p.start_time.split('.')[0]
            my_prize = {'eventName' : eventName, 'PTP_id' : p.PTP_id, 'prize_id':p.player_prize_id, 'prize_name':prize_name, 'prize_amount':p.prize_amount, 'game_name': gameName.room_name, 'start_time':start_time, 'is_exchanged':p.is_exchanged}
            
            prize_list.append(my_prize)
    except:
        print("My prize list error.")

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
            
            AutoIncrementSqlSave(obj, "[dbo].[Groups]")

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
        AutoIncrementSqlSave(member_list, "[dbo].[GroupsMember]")
    return HttpResponse('groupmember success')


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
        all_poi = models.Dublincore.objects.filter(poi_id__in=poi_ids)
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


def GetNotification(username):  # Get invite notifications
    user_id = models.UserProfile.objects.get(user_name=username)
    msg = models.GroupsMessage.objects.filter(
        receiver=user_id.user_id, is_read=False)
    return msg, user_id


def GetMessageid():
    try:
        max_message_id = models.GroupsMessage.objects.all(
        ).aggregate(Max('message_id'))  # 取得最大message_id
        # 最大message_id轉成整數+1
        message_id = int(max_message_id['message_id__max']) + 1
    except:
        message_id = 0
    return message_id


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


def contents_cal(request, filterRole):
    username = request.session['username']
    role = request.session['role']
    language = request.session['language']
    is_leader = request.session['is_leader']
    if role == 'admin':
        if filterRole != None and filterRole != 'all':
            poi_count = models.Dublincore.objects.filter(
                language=language, identifier=filterRole)
            loi_count = models.RoutePlanning.objects.filter(
                language=language, identifier=filterRole)
            aoi_count = models.Aoi.objects.filter(
                language=language, identifier=filterRole)
            soi_count = models.SoiStory.objects.filter(
                language=language, identifier=filterRole)
        else:
            poi_count = models.Dublincore.objects.filter(language=language)
            loi_count = models.RoutePlanning.objects.filter(language=language)
            aoi_count = models.Aoi.objects.filter(language=language)
            soi_count = models.SoiStory.objects.filter(language=language)
        pvo_count = poi_count.filter(Q(verification=1) | Q(
            verification=10), open=1)  # poi/verified/open
        puo_count = poi_count.filter(
            verification=0, open=1)  # poi/unverified/open
        pp_count = poi_count.filter(open=False)  # poi/private
        pf_count = poi_count.filter(verification=-1)  # poi/failed verified
        lvo_count = loi_count.filter(Q(verification=1) | Q(
            verification=10), open=1)  # loi/verified/open
        luo_count = loi_count.filter(
            verification=0, open=1)  # loi/unverified/open
        lp_count = loi_count.filter(open=False)  # loi/private
        lf_count = loi_count.filter(verification=-1)  # loi/failed verified
        avo_count = aoi_count.filter(Q(verification=1) | Q(
            verification=10), open=1)  # aoi/verified/open
        auo_count = aoi_count.filter(
            verification=0, open=1)  # aoi/unverified/open
        ap_count = aoi_count.filter(open=False)  # aoi/private
        af_count = aoi_count.filter(verification=-1)  # aoi/failed verified
        svo_count = soi_count.filter(Q(verification=1) | Q(
            verification=10), open=1)  # soi/verified/open
        suo_count = soi_count.filter(
            verification=0, open=1)  # soi/unverified/open
        sp_count = soi_count.filter(open=False)  # soi/private
        sf_count = soi_count.filter(verification=-1)  # soi/failed verified

        north_city = ['基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣']
        mid_city = ['雲林縣', '臺中市', '彰化縣', '南投縣']
        south_city = ['嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣']
        east_city = ['宜蘭縣', '花蓮縣', '臺東縣']
        island_city = ['金門縣', '連江縣', '澎湖縣', '南海諸島']
        for index in range(len(north_city)):
            locals()["get_north%d" % index] = models.Area.objects.filter(
                area_country=north_city[index]).values_list('area_name_en')
            # Total
            locals()["poi_tnorth%d" % index] = poi_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["loi_tnorth%d" % index] = loi_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["aoi_tnorth%d" % index] = aoi_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["soi_tnorth%d" % index] = soi_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            #Verified % open
            locals()["pvo_tnorth%d" % index] = pvo_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["lvo_tnorth%d" % index] = lvo_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["avo_tnorth%d" % index] = avo_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["svo_tnorth%d" % index] = svo_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            # Not verified &　Open
            locals()["puo_tnorth%d" % index] = puo_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["luo_tnorth%d" % index] = luo_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["auo_tnorth%d" % index] = auo_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["suo_tnorth%d" % index] = suo_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            # Private
            locals()["pp_tnorth%d" % index] = pp_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["lp_tnorth%d" % index] = lp_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["ap_tnorth%d" % index] = ap_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["sp_tnorth%d" % index] = sp_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            # failed verified
            locals()["pf_tnorth%d" % index] = pf_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["lf_tnorth%d" % index] = lf_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["af_tnorth%d" % index] = af_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
            locals()["sf_tnorth%d" % index] = sf_count.filter(
                area_name_en__in=locals()["get_north%d" % index]).count()
        for index in range(len(mid_city)):
            locals()["get_mid%d" % index] = models.Area.objects.filter(
                area_country=mid_city[index]).values_list('area_name_en')
            # Total
            locals()["poi_tmid%d" % index] = poi_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["loi_tmid%d" % index] = loi_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["aoi_tmid%d" % index] = aoi_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["soi_tmid%d" % index] = soi_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            #Verified % open
            locals()["pvo_tmid%d" % index] = pvo_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["lvo_tmid%d" % index] = lvo_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["avo_tmid%d" % index] = avo_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["svo_tmid%d" % index] = svo_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            # Not verified &　Open
            locals()["puo_tmid%d" % index] = puo_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["luo_tmid%d" % index] = luo_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["auo_tmid%d" % index] = auo_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["suo_tmid%d" % index] = suo_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            # Private
            locals()["pp_tmid%d" % index] = pp_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["lp_tmid%d" % index] = lp_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["ap_tmid%d" % index] = ap_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["sp_tmid%d" % index] = sp_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            # failed verified
            locals()["pf_tmid%d" % index] = pf_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["lf_tmid%d" % index] = lf_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["af_tmid%d" % index] = af_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
            locals()["sf_tmid%d" % index] = sf_count.filter(
                area_name_en__in=locals()["get_mid%d" % index]).count()
        for index in range(len(south_city)):
            locals()["get_south%d" % index] = models.Area.objects.filter(
                area_country=south_city[index]).values_list('area_name_en')
            # Total
            locals()["poi_tsouth%d" % index] = poi_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["loi_tsouth%d" % index] = loi_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["aoi_tsouth%d" % index] = aoi_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["soi_tsouth%d" % index] = soi_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            #Verified % open
            locals()["pvo_tsouth%d" % index] = pvo_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["lvo_tsouth%d" % index] = lvo_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["avo_tsouth%d" % index] = avo_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["svo_tsouth%d" % index] = svo_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            # Not verified &　Open
            locals()["puo_tsouth%d" % index] = puo_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["luo_tsouth%d" % index] = luo_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["auo_tsouth%d" % index] = auo_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["suo_tsouth%d" % index] = suo_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            # Private
            locals()["pp_tsouth%d" % index] = pp_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["lp_tsouth%d" % index] = lp_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["ap_tsouth%d" % index] = ap_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["sp_tsouth%d" % index] = sp_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            # failed verified
            locals()["pf_tsouth%d" % index] = pf_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["lf_tsouth%d" % index] = lf_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["af_tsouth%d" % index] = af_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
            locals()["sf_tsouth%d" % index] = sf_count.filter(
                area_name_en__in=locals()["get_south%d" % index]).count()
        for index in range(len(east_city)):
            locals()["get_east%d" % index] = models.Area.objects.filter(
                area_country=east_city[index]).values_list('area_name_en')
            # Total
            locals()["poi_teast%d" % index] = poi_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["loi_teast%d" % index] = loi_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["aoi_teast%d" % index] = aoi_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["soi_teast%d" % index] = soi_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            #Verified % open
            locals()["pvo_teast%d" % index] = pvo_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["lvo_teast%d" % index] = lvo_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["avo_teast%d" % index] = avo_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["svo_teast%d" % index] = svo_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            # Not verified &　Open
            locals()["puo_teast%d" % index] = puo_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["luo_teast%d" % index] = luo_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["auo_teast%d" % index] = auo_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["suo_teast%d" % index] = suo_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            # Private
            locals()["pp_teast%d" % index] = pp_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["lp_teast%d" % index] = lp_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["ap_teast%d" % index] = ap_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["sp_teast%d" % index] = sp_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            # failed verified
            locals()["pf_teast%d" % index] = pf_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["lf_teast%d" % index] = lf_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["af_teast%d" % index] = af_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
            locals()["sf_teast%d" % index] = sf_count.filter(
                area_name_en__in=locals()["get_east%d" % index]).count()
        for index in range(len(island_city)):
            locals()["get_island%d" % index] = models.Area.objects.filter(
                area_country=island_city[index]).values_list('area_name_en')
            # Total
            locals()["poi_tisland%d" % index] = poi_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["loi_tisland%d" % index] = loi_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["aoi_tisland%d" % index] = aoi_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["soi_tisland%d" % index] = soi_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            #Verified % open
            locals()["pvo_tisland%d" % index] = pvo_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["lvo_tisland%d" % index] = lvo_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["avo_tisland%d" % index] = avo_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["svo_tisland%d" % index] = svo_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            # Not verified &　Open
            locals()["puo_tisland%d" % index] = puo_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["luo_tisland%d" % index] = luo_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["auo_tisland%d" % index] = auo_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["suo_tisland%d" % index] = suo_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            # Private
            locals()["pp_tisland%d" % index] = pp_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["lp_tisland%d" % index] = lp_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["ap_tisland%d" % index] = ap_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["sp_tisland%d" % index] = sp_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            # failed verified
            locals()["pf_tisland%d" % index] = pf_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["lf_tisland%d" % index] = lf_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["af_tisland%d" % index] = af_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
            locals()["sf_tisland%d" % index] = sf_count.filter(
                area_name_en__in=locals()["get_island%d" % index]).count()
        template = get_template('contents_cal.html')
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')


def AutoIncrementSqlSave(obj, table_name):
    cursor = connection.cursor()
    sql = "SET IDENTITY_INSERT %s ON" % (table_name)
    cursor.execute(sql)
    obj.save()
    sql = "SET IDENTITY_INSERT %s OFF" % (table_name)
    cursor.execute(sql)

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


def get_all_point_account(request, coi):
    username = request.POST.get('id')
    data = []
    valid_length = 0
    if not models.UserProfile.objects.filter(user_name=username).exists():
        return JsonResponse(data, safe=False)

    poi_list = models.Dublincore.objects.filter(rights=username)
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
                poi = models.Dublincore.objects.get(poi_id=point.point_id)
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


def make_xoi(request, coi='', xoi=None):
    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        language = request.session['%slanguage' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
    except:
        return HttpResponseRedirect('/%s' % (coi))

    try:
        nickname = request.session['%snickname' % (coi)]
        user = models.UserProfile.objects.get(user_name=username)
    except:
        pass
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if language == '中文':
        areas = models.Area.objects.values('area_country').distinct()
    else:
        areas = models.Area.objects.values('area_country_en',
                                           'area_country').distinct()
    #get group id
    group_list = models.GroupsMember.objects.filter(user_id=user.user_id)

    print("test")
    group_id_list = group_list.values_list('foreignkey', flat=True) 
    group = models.Groups.objects.filter(group_id__in=group_id_list)

    print("group = ", group)

    poi_added_time = datetime.now()
    messages.get_messages(request)
    if coi != '':
        template = get_template('%s/%s.html' % (coi, xoi))
    else:
        template = get_template('%s.html' % (xoi))
    html = template.render(locals())
    return HttpResponse(html)


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

#for sdc
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


def delete_all_xoi_in_coi(ids, types):
    all_del = models.CoiPoint.objects.filter(types=types, point_id=ids)
    if all_del != None:
        all_del.delete()


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
            result_list = models.Dublincore.objects.filter(
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
            result_list = models.Dublincore.objects.all()
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
                    point = models.Dublincore.objects.filter(
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


def find_latilong(point_id, point_type):    
    if point_type == 'poi':
        point_list = models.Dublincore.objects.filter(poi_id=point_id).values_list('latitude', 'longitude', 'poi_address')
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
        poi = models.Dublincore.objects.get(poi_id=poi_id)
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

def game(request, coi=''):  # 學堂群組頁面

    if coi != '':
        template_url = "%s/game.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
    except:
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    if coi != '':
        group = models.Groups.objects.filter(coi_name=coi, language=language)
    else:
        group = models.Groups.objects.filter(coi_name='deh', language=language)
    
    try:
        user = models.UserProfile.objects.get(user_name=username)
        group_list = models.GroupsMember.objects.filter(user_id=user.user_id, foreignkey__in=group)
    except:
        group_list = None

    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def game_room(request, group_id, coi=''): # 學堂場次頁面

    if coi != '':
        template_url = "%s/game_room.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_room.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        user = models.UserProfile.objects.get(user_name=username)
        group = models.Groups.objects.get(group_id=group_id)
    except:
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    try:
        game_list = models.GameSetting.objects.filter(group_id=group_id)
        for item in game_list:
            item.chests =  models.GameChestSetting.objects.filter(room_id=item).order_by('id')
            if item.is_playing != 0:
                item.is_playing = models.GameHistory.objects.get(id=item.is_playing)
    except:
        game_list = None

    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def event_room(request, event_id, coi=''): # 學堂場次頁面

    if coi != '':
        template_url = "%s/game_room.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_room.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        user = models.UserProfile.objects.get(user_name=username)
        eventleader = models.EventsMember.objects.get(identifier='leader', event_id=event_id)
        if eventleader.user_id == user:
            isleader = True
        else:
            isleader = False
    except:
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    try:
        print("event_id = ", event_id)
        game_list = models.EventSetting.objects.filter(event_id_id=event_id)
        for item in game_list:
            item.chests =  models.EventChestSetting.objects.filter(room_id_id=item.id).order_by('id')
            if item.is_playing != 0:
                item.is_playing = models.EventHistory.objects.get(id=item.is_playing)
    except Exception as ex:
        print(ex)
        print("except happened")
        game_list = None

    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def game_setting(request, group_id, room_id, coi=''): # 走讀設定及題目設定頁面

    if coi != '':
        template_url = "%s/game_setting.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_setting.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        user = models.UserProfile.objects.get(user_name=username)
        Public_prize = models.prize_profile.objects.all()
        print(group_id)
        prize_can_use_id = []
        for p in Public_prize:
            group_id_list = p.group_id.split(",",-1)
            print(group_id_list)
            if group_id in group_id_list:
                # print("小夫我在裡面了")
                prize_can_use_id.append(p.prize_id)
        prize_can_use = models.prize_profile.objects.filter(prize_id__in=prize_can_use_id)

        if coi != '':
            groups = models.Groups.objects.filter(coi_name=coi, group_leader_id=user.user_id, language=language)
        else:
            groups = models.Groups.objects.filter(coi_name='deh', group_leader_id=user.user_id, language=language)
        group = groups.get(group_id=group_id)
        poi_ids = models.GroupsPoint.objects.filter(foreignkey_id=group_id, types='poi').values_list('point_id', flat=True)
        poi = models.Dublincore.objects.filter(poi_id__in=poi_ids)
        rooms = models.GameSetting.objects.filter(group_id__in=groups)
        game_setting = rooms.get(id=room_id)
        rooms = rooms.exclude(id=room_id)
        game_chest_setting = models.GameChestSetting.objects.filter(room_id_id=room_id)

        if game_setting.game_prize_detail:
            if game_setting.game_prize_detail != '沒有設置獎品':
                prize_detail = game_setting.game_prize_detail
                list_prize_detail = prize_detail.split(",", -1)
                show_prize_detail = []
                rank = 1
                for i in range(0, len(list_prize_detail)-1, 3):
                    temp = {}
                    prize = models.prize_profile.objects.get(prize_id = list_prize_detail[i+1])
                    temp ={'rank': rank,'prize_detail': list_prize_detail[i], 'prize_id': list_prize_detail[i+1], 'prize_name':prize.prize_name, 'prize_count':list_prize_detail[i+2]}
                    show_prize_detail.append(temp)
                    rank = rank + 1
        
        for c in game_chest_setting:
            c.expound = models.GameATT.objects.filter(chest_id=c, ATT_format='expound')
            c.att = models.GameATT.objects.filter(chest_id=c).exclude(ATT_format='expound')
    except:
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def event_setting(request, event_id, room_id, coi=''): # 走讀設定及題目設定頁面

    if coi != '':
        template_url = "%s/game_setting.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_setting.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        user = models.UserProfile.objects.get(user_name=username)
        Public_prize = models.prize_profile.objects.all()

        #到 prize_porfile 撈可以授權獎品的群組(現為活動) 
        prize_can_use_id = []
        for p in Public_prize:
            group_id_list = p.group_id.split(",",-1)
            print(group_id_list)
            if event_id in group_id_list:                
                prize_can_use_id.append(p.prize_id)
        prize_can_use = models.prize_profile.objects.filter(prize_id__in=prize_can_use_id)
        #暫時讓所有人都可以撈獎品，還要再改成可以指定活動，要到edit_prize改
        # prize_can_use = models.prize_profile.objects.all()
        if coi != '':
            events = models.Events.objects.filter(coi_name=coi, Event_leader_id=user.user_id, language=language)
        else:
            events = models.Events.objects.filter(coi_name='deh', Event_leader_id=user.user_id, language=language)
        event = events.get(Event_id=event_id)
        print(event.Event_name)
        # 目前設定撈出user 為 leader的群組 且公開並驗證通過
        groups = models.Groups.objects.filter(group_leader_id=user.user_id)
        pois = models.GroupsPoint.objects.filter(foreignkey__in=groups).values_list('point_id', flat=True)
        poi = models.Dublincore.objects.filter(open=1, verification=1,poi_id__in=pois)

        rooms = models.EventSetting.objects.filter(event_id__in=events)
        game_setting = rooms.get(id=room_id)
        rooms = rooms.exclude(id=room_id)
        game_chest_setting = models.EventChestSetting.objects.filter(room_id_id=room_id)

        if game_setting.game_prize_detail:
            if game_setting.game_prize_detail != '沒有設置獎品':
                prize_detail = game_setting.game_prize_detail
                list_prize_detail = prize_detail.split(",", -1)
                show_prize_detail = []
                rank = 1
                for i in range(0, len(list_prize_detail)-1, 3):
                    temp = {}
                    prize = models.prize_profile.objects.get(prize_id = list_prize_detail[i+1])
                    temp ={'rank': rank,'prize_detail': list_prize_detail[i], 'prize_id': list_prize_detail[i+1], 'prize_name':prize.prize_name, 'prize_count':list_prize_detail[i+2]}
                    show_prize_detail.append(temp)
                    rank = rank + 1
        
        for c in game_chest_setting:
            c.expound = models.EventATT.objects.filter(chest_id=c, ATT_format='expound')
            c.att = models.EventATT.objects.filter(chest_id=c).exclude(ATT_format='expound')
    except Exception as ex:
        print(ex)
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def game_history(request, group_id, room_id, page, coi=''): # 答題歷史頁面

    if coi != '':
        template_url = "%s/game_history.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_history.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        try:
            user = models.objects.filter(user_name=username)
        except:
            pass
    except:
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    history_list = models.GameHistory.objects.filter(room_id_id=room_id).order_by('-start_time')

    try:
        page = int(page)
        last_page = int(math.ceil( history_list.count() / 5 ))
        if last_page == 0:
            last_page = 1
        if page < 1 or page > last_page:
            raise Exception('page out of range')
        pages = range(1, last_page + 1)
        if page <= 3:
            pages = pages[0:5]
        elif page >= last_page - 3:
            pages = pages[-5:]
        else:
            pages = pages[page-3:page+2]  
        history_list = history_list[page * 5 - 5:page * 5]
    except:
        return HttpResponseRedirect('./1')

    def calcScoreBoard(item):   # 計分板在這啦!!!!
        item.members = models.GroupsMember.objects.filter(foreignkey=item.room_id.group_id)
        item.records = models.GameRecordHistory.objects.filter(game_id=item).order_by('answer_time')
        rtemp = models.GameRecordHistory.objects.filter(game_id=item).order_by('answer_time')
        temp = []
        for r in rtemp:
            if (r.user_id_id,r.chest_id_id) in temp:
                item.records = item.records.exclude(id=r.id)
            else:
                temp.append((r.user_id_id,r.chest_id_id))
        for m in item.members:
            records = item.records.filter(user_id=m.user_id,correctness=True).order_by('-answer_time')
            m.rank = 1
            m.score = records.aggregate(Sum('point'))['point__sum']
            if m.score == None:
                m.score = 0
            m.last_correct_time = records[0].answer_time if records.count() > 0 else None
        item.members = sorted(item.members, key=lambda x: (x.last_correct_time == None, x.last_correct_time))
        item.members = sorted(item.members, key=lambda x: x.score, reverse=True)
        item.prize_name = "123"
        for i in range(1, len(item.members)):
            if item.members[i].score == item.members[i-1].score and item.members[i].last_correct_time == item.members[i-1].last_correct_time:
                item.members[i].rank = item.members[i-1].rank
            else:
                item.members[i].rank = item.members[i-1].rank + 1
        
        for r in item.records:
            r.chest_id.expound = models.GameATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
            r.chest_id.att = models.GameATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
            r.att = models.GameATTRecord.objects.filter(record_id=r)

    pool = []
    for item in history_list:
        pool.append(threading.Thread(target = calcScoreBoard, args = (item,)))
        pool[-1].start()
    
    for item in pool:
        item.join()   

    for h in history_list:
        game = models.GameSetting.objects.get(id = h.room_id_id)
        if game.game_prize_detail:
            if game.game_prize_detail != '沒有設置獎品':
                prize_detail = game.game_prize_detail
                list_prize_detail = prize_detail.split(",", -1)
                print(list_prize_detail)
                current_num = {}
                rank_to_prize = {}
                x = 1
                for i in range(0, len(list_prize_detail)-1, 3):      # 製作{排名：{獎品id : 獎品數量}}
                    award_name = list_prize_detail[i]
                    prize_id = list_prize_detail[i+1]
                    prize_count = list_prize_detail[i+2]
                    rank_to_prize.update({str(x):{award_name:{prize_id:prize_count}}})
                    # print("++++++++++++++++++++++++++++")
                    # print(prize_id)
                    # print(prize_count)
                    # print(rank_to_prize)
                    # print("++++++++++++++++++++++++++++")
                    x = x + 1  
                for m in h.members:
                    if str(m.rank) in rank_to_prize:                     #　依照排名分配獎品，寫入prize_to_player資料表
                        print("****************************")
                        prize_info = rank_to_prize[str(m.rank)]
                        print(prize_info)
                        award_name = list(prize_info.keys())[0]
                        m.award_name = award_name
                        print(m.award_name)
                        PID_amount = prize_info[award_name]
                        print(PID_amount)
                        prize_id = list(PID_amount.keys())[0]
                        print(prize_id)
                        prize_amount = list(PID_amount.values())[0]
                        print(prize_amount)
                        print("****************************")
                        # try:
                        #     test = models.prize_to_player.objects.get(user_id_id = m.user_id.user_id,
                        #     start_time = h.start_time)
                        # except:
                        #     test = None
                        # if test == None:  
                        #     max_PTP_id = models.prize_to_player.objects.all().aggregate(Max('PTP_id'))  # 取得最大PTP_id
                        #     PTP_id = int(max_PTP_id['PTP_id__max']) + 1
                            # obj = {
                            #     'PTP_id' : PTP_id,
                            #     'end_time' : h.end_time,
                            #     'play_time' : h.play_time,
                            #     'room_id_id' : h.room_id_id,
                            #     'player_prize_id' : int(prize_id),
                            #     'prize_amount' : int(prize_amount),
                            # }
                            # models.prize_to_player.objects.update_or_create(
                            #     user_id_id = m.user_id.user_id,
                            #     start_time = h.start_time,
                            #     defaults=obj
                            # )
                
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def event_history(request, event_id, room_id, page, coi=''): # 答題歷史頁面

    if coi != '':
        template_url = "%s/game_history.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_history.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        try:
            user = models.objects.filter(user_name=username)
        except:
            pass
    except:
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    history_list = models.EventHistory.objects.filter(room_id_id=room_id).order_by('-start_time')

    try:
        page = int(page)
        last_page = int(math.ceil( history_list.count() / 5 ))
        if last_page == 0:
            last_page = 1
        if page < 1 or page > last_page:
            raise Exception('page out of range')
        pages = range(1, last_page + 1)
        if page <= 3:
            pages = pages[0:5]
        elif page >= last_page - 3:
            pages = pages[-5:]
        else:
            pages = pages[page-3:page+2]  
        history_list = history_list[page * 5 - 5:page * 5]
    except:
        return HttpResponseRedirect('./1')

    def calcScoreBoard(item):   # 計分板在這啦!!!! #item = EventHistory object
        item.members = models.EventsMember.objects.filter(event_id=item.room_id.event_id)
        item.records = models.EventRecordHistory.objects.filter(game_id=item).order_by('answer_time')
        rtemp = models.EventRecordHistory.objects.filter(game_id=item).order_by('answer_time')
        temp = []
        for r in rtemp:
            if (r.user_id_id,r.chest_id_id) in temp:
                item.records = item.records.exclude(id=r.id)
            else:
                temp.append((r.user_id_id,r.chest_id_id))
        for m in item.members:
            print("123312")
            records = item.records.filter(user_id=m.user_id,correctness=True).order_by('-answer_time')
            m.rank = 1
            m.score = records.aggregate(Sum('point'))['point__sum']
            if m.score == None:
                m.score = 0
            m.last_correct_time = records[0].answer_time if records.count() > 0 else None
        item.members = sorted(item.members, key=lambda x: (x.last_correct_time == None, x.last_correct_time))
        item.members = sorted(item.members, key=lambda x: x.score, reverse=True)
        item.prize_name = "123"
        for i in range(1, len(item.members)):
            if item.members[i].score == item.members[i-1].score and item.members[i].last_correct_time == item.members[i-1].last_correct_time:
                item.members[i].rank = item.members[i-1].rank
            else:
                item.members[i].rank = item.members[i-1].rank + 1
        
        for r in item.records:
            r.chest_id.expound = models.EventATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
            r.chest_id.att = models.EventATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
            r.att = models.EventATTRecord.objects.filter(record_id=r)

    pool = []
    for item in history_list:
        pool.append(threading.Thread(target = calcScoreBoard, args = (item,)))
        pool[-1].start()
    
    for item in pool:
        item.join()   

    for h in history_list:
        game = models.EventSetting.objects.get(id = h.room_id_id)
        if game.game_prize_detail:
            if game.game_prize_detail != '沒有設置獎品':
                prize_detail = game.game_prize_detail
                list_prize_detail = prize_detail.split(",", -1)
                print(list_prize_detail)
                current_num = {}
                rank_to_prize = {}
                x = 1
                for i in range(0, len(list_prize_detail)-1, 3):      # 製作{排名：{獎品id : 獎品數量}}
                    award_name = list_prize_detail[i]
                    prize_id = list_prize_detail[i+1]
                    prize_count = list_prize_detail[i+2]
                    rank_to_prize.update({str(x):{award_name:{prize_id:prize_count}}})
                    # print("++++++++++++++++++++++++++++")
                    # print(prize_id)
                    # print(prize_count)
                    # print(rank_to_prize)
                    # print("++++++++++++++++++++++++++++")
                    x = x + 1  
                for m in h.members:
                    if str(m.rank) in rank_to_prize:                     #　依照排名分配獎品，寫入prize_to_player資料表
                        
                        prize_info = rank_to_prize[str(m.rank)]                        
                        award_name = list(prize_info.keys())[0]
                        m.award_name = award_name                       
                        PID_amount = prize_info[award_name]                        
                        prize_id = list(PID_amount.keys())[0]                        
                        prize_amount = list(PID_amount.values())[0]

                        print("****************************")
                        print(prize_info)
                        print(m.award_name)
                        print(PID_amount)
                        print(prize_id)
                        print(prize_amount)
                        print("****************************")
                        # try:
                        #     test = models.prize_to_player.objects.get(user_id_id = m.user_id.user_id,
                        #     start_time = h.start_time)
                        # except:
                        #     test = None
                        # if test == None:  
                        #     max_PTP_id = models.prize_to_player.objects.all().aggregate(Max('PTP_id'))  # 取得最大PTP_id
                        #     PTP_id = int(max_PTP_id['PTP_id__max']) + 1
                            # obj = {
                            #     'PTP_id' : PTP_id,
                            #     'end_time' : h.end_time,
                            #     'play_time' : h.play_time,
                            #     'room_id_id' : h.room_id_id,
                            #     'player_prize_id' : int(prize_id),
                            #     'prize_amount' : int(prize_amount),
                            # }
                            # models.prize_to_player.objects.update_or_create(
                            #     user_id_id = m.user_id.user_id,
                            #     start_time = h.start_time,
                            #     defaults=obj
                            # )
                
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def game_history_export(request, group_id, game_id, coi=''): # 匯出成績

    if coi != '':
        template_url = "%s/game_history_export.html" % (coi)
    else:
        template_url = "game_history_export.html"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        if coi == '':
            try:
                is_leader = request.session['is_leader']
            except:
                is_leader = ''
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
    
        game_history = models.GameHistory.objects.get(id=game_id)

        game_history.members = models.GroupsMember.objects.filter(foreignkey=game_history.room_id.group_id)
        game_history.chests = models.GameChestHistory.objects.filter(game_id=game_history).order_by('id')
        game_history.records = models.GameRecordHistory.objects.filter(game_id=game_history).order_by('answer_time')
        rtemp = models.GameRecordHistory.objects.filter(game_id=game_history).order_by('answer_time')
        temp = []
        for r in rtemp:
            if (r.user_id_id,r.chest_id_id) in temp:
                game_history.records = game_history.records.exclude(id=r.id)
            else:
                temp.append((r.user_id_id,r.chest_id_id))
        for m in game_history.members:
            now = 0
            m.records = [None] * game_history.chests.count()
            m.score = 0
            m.rank = 1
            m.last_correct_time = game_history.records.filter(user_id=m.user_id,correctness=True).order_by('-answer_time')
            m.last_correct_time = m.last_correct_time[0].answer_time if m.last_correct_time.count() > 0 else None
            for r in game_history.records.filter(user_id=m.user_id).order_by('chest_id'):
                while r.chest_id != game_history.chests[now]:
                    now += 1
                m.records[now] = r
                if r.correctness and r.point != None:
                    m.score += r.point
        game_history.members = sorted(game_history.members, key=lambda x: (x.last_correct_time == None, x.last_correct_time))
        game_history.members = sorted(game_history.members, key=lambda x: x.score, reverse=True)
        
        for i in range(1, len(game_history.members)):
            if game_history.members[i].score == game_history.members[i-1].score and game_history.members[i].last_correct_time == game_history.members[i-1].last_correct_time:
                game_history.members[i].rank = game_history.members[i-1].rank
            else:
                game_history.members[i].rank = game_history.members[i-1].rank + 1
        
        for r in game_history.records:
            r.chest_id.expound = models.GameATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
            r.chest_id.att = models.GameATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
            r.att = models.GameATTRecord.objects.filter(record_id=r)

    except:
        return HttpResponse('Error')
                
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def event_history_export(request, event_id, game_id, coi=''): # 匯出成績

    if coi != '':
        template_url = "%s/game_history_export.html" % (coi)
    else:
        template_url = "game_history_export.html"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        if coi == '':
            try:
                is_leader = request.session['is_leader']
            except:
                is_leader = ''
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
    
        event_history = models.EventHistory.objects.get(id=game_id)

        event_history.members = models.EventsMember.objects.filter(event_id=event_history.room_id.event_id)
        event_history.chests = models.EventChestHistory.objects.filter(game_id=event_history).order_by('id')
        event_history.records = models.EventRecordHistory.objects.filter(game_id=event_history).order_by('answer_time')
        rtemp = models.EventRecordHistory.objects.filter(game_id=event_history).order_by('answer_time')
        temp = []
        for r in rtemp:
            if (r.user_id_id,r.chest_id_id) in temp:
                event_history.records = event_history.records.exclude(id=r.id)
            else:
                temp.append((r.user_id_id,r.chest_id_id))
        for m in event_history.members:
            now = 0
            m.records = [None] * event_history.chests.count()
            m.score = 0
            m.rank = 1
            m.last_correct_time = event_history.records.filter(user_id=m.user_id,correctness=True).order_by('-answer_time')
            m.last_correct_time = m.last_correct_time[0].answer_time if m.last_correct_time.count() > 0 else None
            for r in event_history.records.filter(user_id=m.user_id).order_by('chest_id'):
                while r.chest_id != event_history.chests[now]:
                    now += 1
                m.records[now] = r
                if r.correctness and r.point != None:
                    m.score += r.point
        event_history.members = sorted(event_history.members, key=lambda x: (x.last_correct_time == None, x.last_correct_time))
        event_history.members = sorted(event_history.members, key=lambda x: x.score, reverse=True)
        
        for i in range(1, len(event_history.members)):
            if event_history.members[i].score == event_history.members[i-1].score and event_history.members[i].last_correct_time == event_history.members[i-1].last_correct_time:
                event_history.members[i].rank = event_history.members[i-1].rank
            else:
                event_history.members[i].rank = event_history.members[i-1].rank + 1
        
        for r in event_history.records:
            r.chest_id.expound = models.EventATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
            r.chest_id.att = models.EventATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
            r.att = models.EventATTRecord.objects.filter(record_id=r)

    except:
        return HttpResponse('Error')
                
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def game_history_record(request, group_id, game_id, record_id, coi=''): # 答題記錄頁面

    if coi != '':
        template_url = "%s/game_history_record.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_history_record.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        if coi == '':
            try:
                is_leader = request.session['is_leader']
            except:
                is_leader = ''
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        group = models.Groups.objects.get(group_id=group_id)
        game_history = models.GameHistory.objects.get(id=game_id)
        game_record = models.GameRecordHistory.objects.filter(game_id=game_history).order_by('answer_time')
        record_id = int(record_id)
        for r in game_record:
            if record_id == 0:
                return HttpResponseRedirect(str(r.id))
            elif record_id == r.id:
                r.chest_id.expound = models.GameATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
                r.chest_id.att = models.GameATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
                r.att = models.GameATTRecord.objects.filter(record_id=r)
                grading_record = r
                break
        else:
            if record_id != 0:
                raise Exception("unknown record id")
    except:
        traceback.print_exc()
        return HttpResponseRedirect(redirect_url)


    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def event_history_record(request, event_id, game_id, record_id, coi=''): # 答題記錄頁面

    if coi != '':
        template_url = "%s/game_history_record.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_history_record.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        if coi == '':
            try:
                is_leader = request.session['is_leader']
            except:
                is_leader = ''
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        event = models.Events.objects.get(Event_id=event_id)
        event_history = models.EventHistory.objects.get(id=game_id)
        event_record = models.EventRecordHistory.objects.filter(game_id=event_history).order_by('answer_time')
        record_id = int(record_id)
        for r in event_record:
            if record_id == 0:
                return HttpResponseRedirect(str(r.id))
            elif record_id == r.id:
                r.chest_id.expound = models.EventATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
                r.chest_id.att = models.EventATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
                r.att = models.EventATTRecord.objects.filter(record_id=r)
                grading_record = r
                break
        else:
            if record_id != 0:
                raise Exception("unknown record id")
    except:
        traceback.print_exc()
        return HttpResponseRedirect(redirect_url)


    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def game_history_correction(request, group_id, game_id, record_id, coi=''): # 走讀批改頁面

    if coi != '':
        template_url = "%s/game_history_correction.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_history_correction.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        if coi == '':
            try:
                is_leader = request.session['is_leader']
            except:
                is_leader = ''
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        group = models.Groups.objects.get(group_id=group_id)
        game_history = models.GameHistory.objects.get(id=game_id)
        game_record = models.GameRecordHistory.objects.filter(game_id=game_history, correctness=None).order_by('answer_time')
        record_id = int(record_id)
        for r in game_record:
            if record_id == 0:
                return HttpResponseRedirect(str(r.id))
            elif record_id == r.id:
                r.chest_id.expound = models.GameATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
                r.chest_id.att = models.GameATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
                r.att = models.GameATTRecord.objects.filter(record_id=r)
                grading_record = r
                break
        else:
            raise Exception("unknown record id")
    except:
        return HttpResponseRedirect(redirect_url)


    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def event_history_correction(request, event_id, game_id, record_id, coi=''): # 走讀批改頁面

    if coi != '':
        template_url = "%s/game_history_correction.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_history_correction.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        if coi == '':
            try:
                is_leader = request.session['is_leader']
            except:
                is_leader = ''
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        event = models.Events.objects.get(Event_id=event_id)
        game_history = models.EventHistory.objects.get(id=game_id)
        game_record = models.EventRecordHistory.objects.filter(game_id=game_history, correctness=None).order_by('answer_time')
        record_id = int(record_id)
        print("record id = ", record_id)
        for r in game_record:
            if record_id == 0:
                return HttpResponseRedirect(str(r.id))
            elif record_id == r.id:
                r.chest_id.expound = models.EventATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
                r.chest_id.att = models.EventATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
                r.att = models.EventATTRecord.objects.filter(record_id=r)
                grading_record = r
                break
        else:
            raise Exception("unknown record id")
    except Exception as e:
        print(e)
        return HttpResponseRedirect(redirect_url)


    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

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
    #print(prize_detail)
    list_prize_detail = prize_detail.split(",", -1)
    # print(list_prize_detail)
    current_num = {}
    for i in range(0, len(list_prize_detail)-1, 3):
        prize_id = list_prize_detail[i+1]
        #print("-----------------------------")
        #print(prize_id)
        Prize = models.prize_profile.objects.get(prize_id=prize_id)
        prize_count = list_prize_detail[i+2]
        #print(prize_count)
        
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
        #print(current_num[prize_id])
        #print("--------------------------------")


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

                    max_poi_id = models.Dublincore.objects.all().aggregate(Max('poi_id'))  # 取得最大poi_id
                    poi_id = int(max_poi_id['poi_id__max']) + 1  # 最大poi_id轉成整數+1
                    obj = models.Dublincore(
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

def searchGrade(request,game_id=-1):
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
        language = request.session['language']
    except Exception as e:
        print(e)
        pass

    template_url='searchGrade.html'
    flag=1

    if game_id == -1:
        template = get_template(template_url)
        html = template.render(locals())
        return HttpResponse(html)

    try:
        #取得成績
        GameRecord = models.EventRecordHistory.objects.filter(game_id=game_id, correctness=1).values('user_id').order_by('user_id').annotate(grade=Sum('point'))
        print(GameRecord[0])
    except Exception as e:
        flag=-1
        print(e)
    
    try:
        for G in GameRecord:
            G['name'] = models.UserProfile.objects.get(user_id=G['user_id']).user_name
        #print(GameRecord)
            
        room = models.EventHistory.objects.get(id=game_id)

        event_id = room.room_id.event_id.Event_id
        #print(group_id)
    except Exception as e:
        print(e)

    

    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def SendMailThread(title,mail_content,mail_address):
    # 利用thread 平行寄信 減少等待時間
    def SendMail():
        print("Send mail through thread : to ", mail_address)
        msg = EmailMessage(title, mail_content, to=[mail_address])
        msg.send()

    t = threading.Thread(target = SendMail)
    t.start()    

def Prevent_Inspector_Attact(types, point_id, group_id):
    try:
        models.GroupsPoint.objects.get(types=types, point_id= point_id, foreignkey_id=group_id)
        return True
    except Exception as e:
        print(e)
        return False


def apscheduler_for_group(): 
    # 定時任務 https://www.cnblogs.com/diaolanshan/p/7841169.html
    # 需安裝 pip install apscheduler==2.1.2
    # 定時查看 group open 狀態有無超過規定時間 
    groups = models.Groups.objects.filter(manage = True)
    for group in groups:
        # 將time標準化到以秒為單位
        start_time = time.mktime(group.manage_start_time.timetuple())
        end_time = time.mktime(group.manage_end_time.timetuple()) 
        now = time.mktime(datetime.now().timetuple())   

        if((now - start_time) > 0 and (end_time - now) > 0):
            #print("it's on time zone")
            print(group.open)
            if(group.open_origin == True):
                group.open = False
            else:
                group.open = True
        elif((end_time - now) < 0):
            #print("over date")
            print(group.open)
            group.manage = False
            group.open = group.open_origin
        else:
            #print("not yet")
            print(group.open)
        group.save()

def apscheduler_for_EventSetting(): 
    # 定時任務 https://www.cnblogs.com/diaolanshan/p/7841169.html
    # 需安裝 pip install apscheduler==2.1.2
    # 定時查看 event is_playing 狀態有無超過規定時間 
    
    events = models.EventSetting.objects.filter(auto_start = 1)
    for event in events:
        # 將time標準化到以秒為單位
        start_time = time.mktime(event.start_time.timetuple())
        end_time = time.mktime(event.end_time.timetuple()) 

        now = time.mktime(datetime.now().timetuple())  
        
        temp = event.is_playing
        now = time.mktime(datetime.now().timetuple())   

        if((now - start_time) > 0 and (end_time - now) > 0):
            if event.is_playing == 0:
                
                obj = models.EventHistory.objects.create(
                    start_time=event.start_time,
                    end_time=event.end_time,
                    play_time=event.play_time,
                    state=0,    #正在進行
                    room_id=event
                )
                #******************************************
                questions = models.EventChestSetting.objects.filter(room_id=event)
                for Q in questions:
                    ques = models.EventChestHistory.objects.create(
                        game_id=obj,
                        poi_id=Q.poi_id,
                        src_id=Q.id,
                        lat=Q.lat,    
                        lng=Q.lng,
                        num=Q.num,
                        remain=Q.num,
                        point=Q.point,
                        distance=Q.distance,
                        question_type=Q.question_type,
                        question=Q.question,
                        option1=Q.option1,
                        option2=Q.option2,
                        option3=Q.option3,
                        option4=Q.option4,
                        hint1=Q.hint1,
                        hint2=Q.hint2,
                        hint3=Q.hint3,
                        hint4=Q.hint4,
                        answer=Q.answer
                    )
                    try:
                        questionsATT = models.EventATT.objects.filter(chest_id=Q)
                        for qATT in questionsATT:
                            ques = models.EventATTHistory.objects.create(
                                chest_id=ques,
                                ATT_url=qATT.ATT_url,
                                ATT_upload_time=qATT.ATT_upload_time,
                                ATT_format=qATT.ATT_format 
                            )
                    except Exception as e:
                        pass

                #******************************************
                
                print("game_history.id : ",obj.id)
                event.is_playing = obj.id
                
                event.save()
                print(event.room_name," 正在進行")
            else :
                pass
            #print("it's on time zone")
            # event.is_playing = 1
            # print(event.room_name," 正在進行")
        else:
            if event.is_playing != 0:
                obj = models.EventHistory.objects.get(id=event.is_playing)
                obj.state = 2
                obj.save()
                event.is_playing = 0
                event.save()
                print(event.room_name," 沒有在進行")
            else :
                pass
            # event.is_playing = 0
            # print(event.room_name," 沒有在進行")
        # if temp != event.is_playing:
        #     event.save()

def apscheduler_for_test():
    #about state : 0 for playing; 1 for end game but not corrected; 2 for end game and corrected
    nowtime = datetime.now()
    event_history = models.EventHistory.objects.filter(~Q(state=2),end_time__lt=nowtime)
    event_history_id = event_history.values_list('id', flat=True)
    
    for eh in event_history:
        initial_state = eh.state
        eh.state = 2
        eh.save()
        sql = models.EventSetting.objects.get(is_playing=eh.id)
        sql.is_playing = 0
        sql.save()

    event_record_history = models.EventRecordHistory.objects.filter(game_id_id__in=event_history_id,correctness__isnull=True)
    for erh in event_record_history:
        sql = models.EventHistory.objects.get(id=erh.event_id_id)
        sql.state = 1
        sql.save()

    eventsetting = models.EventSetting.objects.filter(auto_start=1, is_playing=0, start_time__lt=nowtime)
    for es in eventsetting:
        start_time = time.mktime(es.start_time.timetuple())        
        now = time.mktime(datetime.now().timetuple())  
        # 10.0 為排程一次執行的時間,請參考url.py最下方
        #代表遊戲開始
        if (now - start_time) < 10.0:
            
            obj = models.EventHistory(
                start_time=es.start_time,
                end_time=es.end_time,
                play_time=es.play_time,
                state=0,
                room_id_id= es.id
            )
            obj.save()
            eventchestsettings = models.EventChestSetting.objects.filter(room_id=es)
            for eventchestsetting in eventchestsettings:
                obj2 = models.EventChestHistory(
                    src_id= eventchestsetting.id,
                    lat=eventchestsetting.lat,
                    lng=eventchestsetting.lng,
                    num=eventchestsetting.num,
                    remain=eventchestsetting.num,
                    point=eventchestsetting.point,
                    distance=eventchestsetting.distance,
                    question_type=eventchestsetting.question_type,
                    question=eventchestsetting.question,
                    option1=eventchestsetting.option1,
                    option2=eventchestsetting.option2,
                    option3=eventchestsetting.option3,
                    option4=eventchestsetting.option4,
                    hint1=eventchestsetting.hint1,
                    hint2=eventchestsetting.hint2,
                    hint3=eventchestsetting.hint3,
                    hint4=eventchestsetting.hint4,
                    answer=eventchestsetting.answer,
                    game_id=obj,
                    poi_id_id=eventchestsetting.poi_id_id
                )
                obj2.save()
                eventatts = models.EventATT.objects.filter(chest_id=eventchestsetting)
                for eventatt in eventatts:
                    obj3 = models.EventATTHistory(
                        ATT_url=eventatt.ATT_url,
                        ATT_upload_time=eventatt.ATT_upload_time,
                        ATT_format=eventatt.ATT_format,
                        chest_id= obj2
                    )
                    obj3.save()
            #alternate   is_playing            
            es.is_playing = obj.id
            es.save()

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
def GetEventNotification(username):  # Get invite notifications
    user_id = models.UserProfile.objects.get(user_name=username)
    msg = models.EventsMessage.objects.filter(receiver=user_id.user_id, is_read=False)
    return msg, user_id

def list_events(request, ids=None, types=None, coi=''):
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
        list_event_url = '/%s/list_events' % (coi)
        template_url = '%s/list_event.html' % (coi)
    else:
        list_event_url = '/list_events'
        template_url = 'list_event.html'
        coi = 'deh'

    event = models.Events.objects.filter(coi_name=coi)
    msg, user_id = GetEventNotification(username)  # Get invite notifications
    msg_count = msg.count()
    try:
        # 撈出我的活動
        user = models.UserProfile.objects.get(user_name=username)
        eventmember_list = models.EventsMember.objects.filter(user_id=user.user_id)
        member_list = eventmember_list.values_list('event_id', flat=True)
        for m in member_list:
            print(m)
        event_list = models.Events.objects.filter(Event_id__in=member_list,coi_name=coi).order_by('Event_id')
        
    except:
        event_list = None

    for item in event_list:
        if item.Event_leader_id == user.user_id:
            item.identifier = 'leader'
        else:
            item.identifier = 'member'

    if ids and types:
        try:
            if types == 'event':
                del_event = models.Events.objects.get(Event_id=ids)
            elif types == 'leave':
                leave_event = models.EventsMember.objects.get(
                    foreignkey=ids, user_id=user)
            else:
                del_event = None
                leave_event = None
        except:
            del_event = None
            leave_event = None
    if types == 'event' and del_event:
        del_event.delete()
        user = models.UserProfile.objects.get(user_name = username)
        events = models.Events.objects.filter(Event_leader_id = user.user_id)    
        #print(events.count())
        if( events.count() != 0):
            request.session['%sis_leader' % (coi)] = "is_leader"
            print("have more than 1 event")
        else :
            print("have no event")
            request.session['%sis_leader' % (coi)] = ""
        return HttpResponseRedirect(list_event_url)
    elif types == 'leave' and leave_event:
        leave_event.delete()
        return HttpResponseRedirect(list_event_url)
    else:
        del_event = None
        leave_event = None
    messages.get_messages(request)
    template = get_template(template_url)
    html = template.render(locals())
    return HttpResponse(html)

def make_events(request, coi=''):  # 製做景點頁面
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
        if  coi=='':
            template = get_template('make_event.html')
        else:
            template = get_template('sdc/make_event.html')
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')


def manage_event(request, event_id, coi=''):  # event detail page
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
        template_url = '%s/manage_event.html' % (coi)
        list_url = '/%s/list_event' % (coi)
        make_url = '/%s/make_player' % (coi)
    else:
        template_url = 'manage_event.html'
        list_url = '/list_events'
        make_url = '/make_player'
        coi = 'deh'
    try:
        event = models.Events.objects.get(Event_id=event_id, language=language)
        member = models.EventsMember.objects.filter(event_id=event)
        leader_id = event.Event_leader_id
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
        page = 'http://deh.csie.ncku.edu.tw/manage_event/' + event_id
        request.session['pre_page'] = 'http://deh.csie.ncku.edu.tw/list_events/'
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
        request.session['pre_page'] = event_id
        # models.Logs.objects.filter(page='http://deh.csie.ncku.edu.tw/aoi_detail/'+aoi_id | ).count()

        if username == leader_name.user_name or role == 'admin':  # 檢查是否為leader
            is_leader = True
        else:
            is_leader = False
        try:  # 檢查是否為member
            member_name = models.UserProfile.objects.get(user_name=username)
            is_member = models.EventsMember.objects.filter(
                user_id=member_name.user_id, event_id=event).exists()
        except:
            is_member = False

        #*******************************************************************
        
        group = models.Groups.objects.filter(coi_name=coi)
        # msg, user_id = GetNotification(username)  # Get invite notifications
        # msg_count = msg.count()
        try:
            user = models.UserProfile.objects.get(user_name=username)
            group_list = models.GroupsMember.objects.filter(user_id=user.user_id, foreignkey__in=group)
            eventgroups = models.EventsGroup.objects.filter(event_id = event_id)
            
            for g in group_list:
                g.checked = 'hello'
                for eventgroup in eventgroups:                    
                    if g.foreignkey.group_id == eventgroup.group_id.group_id:
                        g.checked = 'checked'
                        break
        except:
            group_list = None

        #*******************************************************************

        template = get_template(template_url)
        html = template.render(locals())
        return HttpResponse(html)
    except ObjectDoesNotExist:
        print('ObjectDoesNotExist')
        return HttpResponseRedirect(make_url)

def Event_Authority(request):
    event_id = request.POST.get('event_id')
    group_ids = json.loads(request.POST.get('selectedGroupID'))

    #刪除全部之已授權group
    allselectedGroup = models.EventsGroup.objects.filter(event_id=event_id)
    allselectedGroup.delete()

    #新增新授權之group
    for group_id in group_ids:
        group = models.Groups.objects.get(group_id=group_id)
        event = models.Events.objects.get(Event_id=event_id)
        obj = models.EventsGroup(            
            event_id=event,
            group_id=group
        )
        obj.save()

    return HttpResponse('success')

def GetEventMessageid():
    try:
        max_message_id = models.EventsMessage.objects.all(
        ).aggregate(Max('message_id'))  # 取得最大message_id
        # 最大message_id轉成整數+1
        message_id = int(max_message_id['message_id__max']) + 1
    except:
        message_id = 0
    return message_id

def GetEventMemberid():
    try:
        max_member_id = models.EventsMember.objects.all(
        ).aggregate(Max('member_id'))  # 取得最大member_id
        # 最大member_id轉成整數+1
        member_id = int(max_member_id['member_id__max']) + 1
    except:
        member_id = 0
    return member_id

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

def prize_patch(request):  # soi page load
    if 'username' in request.session:
        username = request.session['username']
        language = request.session['language']
        role = request.session['role']
        try:
            nickname = request.session['nickname']
        except:
            pass
       
        template = get_template('prize_exchange.html')
        if language == '中文':
            areas = models.Area.objects.values('area_country').distinct()
        else:
            areas = models.Area.objects.values(
                'area_country_en', 'area_country').distinct()
        html = template.render(locals())
        return HttpResponse(html)
    else:
        return HttpResponseRedirect('/')

def prize_distribution(request, game_id,  coi=''): # 答題歷史頁面

    if coi != '':
        template_url = "%s/game_history.html" % (coi)
        redirect_url = "/%s/index" % (coi)
    else:
        template_url = "game_history.html"
        redirect_url = "/"

    try:
        username = request.session['%susername' % (coi)]
        role = request.session['%srole' % (coi)]
        is_leader = request.session['%sis_leader' % (coi)]
        language = request.session['%slanguage' % (coi)]
        nickname = request.session['%snickname' % (coi)]
        try:
            user = models.objects.filter(user_name=username)
        except:
            pass
    except:
        return HttpResponseRedirect(redirect_url)
    if coi == '':
        try:
            is_leader = request.session['is_leader']
        except:
            is_leader = ''
    history_list = models.EventHistory.objects.filter(id=game_id)


    def calcScoreBoard(item):   # 計分板在這啦!!!! #item = EventHistory object
        item.members = models.EventsMember.objects.filter(event_id=item.room_id.event_id)
        item.records = models.EventRecordHistory.objects.filter(game_id=item).order_by('answer_time')
        rtemp = models.EventRecordHistory.objects.filter(game_id=item).order_by('answer_time')
        temp = []
        for r in rtemp:
            if (r.user_id_id,r.chest_id_id) in temp:
                item.records = item.records.exclude(id=r.id)
            else:
                temp.append((r.user_id_id,r.chest_id_id))
        for m in item.members:
            print("123312")
            records = item.records.filter(user_id=m.user_id,correctness=True).order_by('-answer_time')
            m.rank = 1
            m.score = records.aggregate(Sum('point'))['point__sum']
            if m.score == None:
                m.score = 0
            m.last_correct_time = records[0].answer_time if records.count() > 0 else None
        item.members = sorted(item.members, key=lambda x: (x.last_correct_time == None, x.last_correct_time))
        item.members = sorted(item.members, key=lambda x: x.score, reverse=True)
        item.prize_name = "123"
        for i in range(1, len(item.members)):
            if item.members[i].score == item.members[i-1].score and item.members[i].last_correct_time == item.members[i-1].last_correct_time:
                item.members[i].rank = item.members[i-1].rank
            else:
                item.members[i].rank = item.members[i-1].rank + 1
        
        for r in item.records:
            r.chest_id.expound = models.EventATTHistory.objects.filter(chest_id=r.chest_id, ATT_format='expound')
            r.chest_id.att = models.EventATTHistory.objects.filter(chest_id=r.chest_id).exclude(ATT_format='expound')
            r.att = models.EventATTRecord.objects.filter(record_id=r)

    pool = []
    for item in history_list:
        pool.append(threading.Thread(target = calcScoreBoard, args = (item,)))
        pool[-1].start()
    
    for item in pool:
        item.join()   

    for h in history_list:
        game = models.EventSetting.objects.get(id = h.room_id_id)
        if game.game_prize_detail:
            if game.game_prize_detail != '沒有設置獎品':
                prize_detail = game.game_prize_detail
                list_prize_detail = prize_detail.split(",", -1)
                print(list_prize_detail)
                current_num = {}
                rank_to_prize = {}
                x = 1
                for i in range(0, len(list_prize_detail)-1, 3):      # 製作{排名：{獎品id : 獎品數量}}
                    award_name = list_prize_detail[i]
                    prize_id = list_prize_detail[i+1]
                    prize_count = list_prize_detail[i+2]
                    rank_to_prize.update({str(x):{award_name:{prize_id:prize_count}}})
                    # print("++++++++++++++++++++++++++++")
                    # print(prize_id)
                    # print(prize_count)
                    # print(rank_to_prize)
                    # print("++++++++++++++++++++++++++++")
                    x = x + 1  
                for m in h.members:
                    if m.rank and str(m.rank) in rank_to_prize:                     #　依照排名分配獎品，寫入prize_to_player資料表
                        #print("****************************")
                        prize_info = rank_to_prize[str(m.rank)]
                        #print(prize_info)
                        award_name = list(prize_info.keys())[0]
                        m.award_name = award_name
                        #print(m.award_name)
                        PID_amount = prize_info[award_name]
                        #print(PID_amount)
                        prize_id = list(PID_amount.keys())[0]
                        #print(prize_id)
                        prize_amount = list(PID_amount.values())[0]
                        #print(prize_amount)
                        #print("****************************")
                        try:
                            test = models.prize_to_player.objects.get(user_id_id = m.user_id.user_id,
                            start_time = h.start_time)
                        except:
                            test = None
                        if test == None:  
                            max_PTP_id = models.prize_to_player.objects.all().aggregate(Max('PTP_id'))  # 取得最大PTP_id
                            PTP_id = int(max_PTP_id['PTP_id__max']) + 1
                            obj = {
                                'PTP_id' : PTP_id,
                                'end_time' : h.end_time,
                                'play_time' : h.play_time,
                                'room_id_id' : h.room_id_id,
                                'player_prize_id' : int(prize_id),
                                'prize_amount' : int(prize_amount),
                            }
                            models.prize_to_player.objects.update_or_create(
                                user_id_id = m.user_id.user_id,
                                start_time = h.start_time,
                                defaults=obj
                            )
                
    return HttpResponse("Success")