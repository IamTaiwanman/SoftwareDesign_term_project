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
        poi = models.Poi.objects.filter(poi_id__in=poi_ids)
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
        poi = models.Poi.objects.filter(open=1, verification=1,poi_id__in=pois)

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


#####local function#####

def get_user_ip(request):
    x_forward = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forward:
        ip = x_forward.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

