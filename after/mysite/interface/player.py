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

def make_player(request, ids=None, types=None):
    if 'username' in request.session:
        try:
            nickname = request.session['nickname']
        except:
            pass
        username = request.session['username']
        role = request.session['role']
        language = request.session['language']
        all_poi = models.Poi.objects.filter(
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
                    del_poi = models.Poi.objects.get(poi_id=ids)
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


#####local functions#####

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

def get_user_all_coi(user_id):
    coi_list = list(
        models.CoiUser.objects.filter(user_fk=user_id).values_list(
            'coi_name', flat=True))
    return coi_list

def delete_all_xoi_in_coi(ids, types):

    all_del = models.CoiPoint.objects.filter(types=types, point_id=ids)
    if all_del != None:
        all_del.delete()

def GetEventMessageid():
    try:
        max_message_id = models.EventsMessage.objects.all(
        ).aggregate(Max('message_id'))  # 取得最大message_id
        # 最大message_id轉成整數+1
        message_id = int(max_message_id['message_id__max']) + 1
    except:
        message_id = 0
    return message_id



