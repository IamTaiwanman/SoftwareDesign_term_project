#_*_ coding: utf-8 _*_
from __future__ import unicode_literals
from django.db import models
from django.utils import timezone
from django.utils.http import urlquote
from django.contrib.contenttypes.models import ContentType
from datetime import datetime
import uuid
import os
from uuid import UUID
from json import JSONEncoder

JSONEncoder_olddefault = JSONEncoder.default
def JSONEncoder_newdefault(self, o):
    if isinstance(o, UUID): 
        return str(o)
    return JSONEncoder_olddefault(self, o)
JSONEncoder.default = JSONEncoder_newdefault


class Logs(models.Model):
    user_id = models.IntegerField(primary_key=True)
    ip = models.CharField(max_length=50)
    dt = models.DateTimeField(blank=True, null=True)
    page = models.CharField(max_length=255, blank=True, null=True)
    pre_page = models.CharField(max_length = 255, blank = True, null=True)
    # Field name made lowercase.
    dveviceid = models.CharField(
        db_column='dveviceID', max_length=50, blank=True, null=True)
    # Field name made lowercase.
    appver = models.CharField(
        db_column='appVer', max_length=10, blank=True, null=True)
    ulatitude = models.FloatField(blank=True, null=True)
    ulongitude = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'Logs'

class Area(models.Model):
    area_id = models.FloatField(primary_key=True,default=0)
    area_country = models.CharField(max_length=255, blank=True, null=True)
    area_name_ch = models.CharField(max_length=255, blank=True, null=True)
    area_name_en = models.CharField(max_length=255, blank=True, null=True)
    area_count = models.FloatField(blank=True, null=True)
    f6 = models.CharField(db_column='F6', max_length=255, blank=True, null=True)  # Field name made lowercase.
    f7 = models.CharField(db_column='F7', max_length=255, blank=True, null=True)  # Field name made lowercase.
    f8 = models.CharField(db_column='F8', max_length=255, blank=True, null=True)  # Field name made lowercase.
    area_country_en = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'area'


class Area00(models.Model):
    area_id = models.IntegerField(primary_key=True,default=0)
    area_country = models.CharField(max_length=50, blank=True, null=True)
    area_type = models.CharField(max_length=50, blank=True, null=True)
    area_name_en = models.CharField(max_length=50)
    area_name_ch = models.CharField(max_length=50)
    area_description = models.CharField(max_length=1000, blank=True, null=True)
    area_city = models.CharField(max_length=50, blank=True, null=True)
    area_coordinate = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'area00'


class Area2(models.Model):
    area_id = models.IntegerField(primary_key=True,default=0)
    area_country = models.CharField(max_length=50)
    area_name_ch = models.CharField(max_length=50)
    area_name_en = models.CharField(max_length=50)
    area_count = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'area2'


class Chapter(models.Model):
    chapterid = models.CharField(db_column='chapterId', max_length=50,primary_key=True)  # Field name made lowercase.
    poiid = models.CharField(db_column='POIId', max_length=50, blank=True, null=True)  # Field name made lowercase.
    sequence = models.IntegerField(blank=True, null=True)
    chaptertitle = models.CharField(db_column='chapterTitle', max_length=100, blank=True, null=True)  # Field name made lowercase.
    chapterdescription = models.CharField(db_column='chapterDescription', max_length=500, blank=True, null=True)  # Field name made lowercase.
    posttime = models.DateTimeField(db_column='postTime', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'chapter'


class Country(models.Model):
    country_id = models.IntegerField(primary_key=True)
    area_country = models.CharField(max_length=50)
    area_country_en = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'country'


class DailyXoi(models.Model):
    xoi_id = models.IntegerField(primary_key=True)
    sequence = models.SmallIntegerField()
    xoi_type = models.IntegerField()

    class Meta:
        db_table = 'daily_xoi'



class DocentArea(models.Model):
    fk_userid = models.IntegerField(primary_key=True)
    area_name_en = models.CharField(max_length=255)

    class Meta:
        db_table = 'docent_area'



class Dublincore(models.Model):
    poi_id = models.IntegerField(db_column='POI_id',primary_key=True)  # Field name made lowercase.
    poi_name = models.CharField(db_column='POI_name', max_length=100, blank=True, null=True)  # Field name made lowercase.
    poi_name_old = models.CharField(db_column='POI_name_old', max_length=50, blank=True, null=True)  # Field name made lowercase.
    poi_title = models.CharField(db_column='POI_title', max_length=100)  # Field name made lowercase.
    subject = models.CharField(max_length=150, null=True)
    parent_id = models.CharField(max_length=50, blank=True, null=True)
    area_name_en = models.CharField(max_length=50, blank=True, null=True)
    type1 = models.CharField(max_length=50, blank=True, null=True)
    type2 = models.CharField(max_length=50, blank=True, null=True)
    keyword1 = models.CharField(max_length=150)
    keyword2 = models.CharField(max_length=150, blank=True, null=True)
    keyword3 = models.CharField(max_length=150, blank=True, null=True)
    keyword4 = models.CharField(max_length=150, blank=True, null=True)
    keyword5 = models.CharField(max_length=150, blank=True, null=True)
    relation1 = models.CharField(max_length=50, blank=True, null=True)
    relation2 = models.CharField(max_length=50, blank=True, null=True)
    relation3 = models.CharField(max_length=50, blank=True, null=True)
    relation4 = models.CharField(max_length=50, blank=True, null=True)
    relation5 = models.CharField(max_length=50, blank=True, null=True)
    period = models.CharField(max_length=50, blank=True, null=True)
    year = models.CharField(max_length=50, blank=True, null=True)
    poi_address = models.CharField(db_column='POI_address', max_length=250)  # Field name made lowercase.
    latitude = models.FloatField()
    longitude = models.FloatField()
    height = models.IntegerField(blank=True, null=True,default=0)
    scope = models.IntegerField(default=30)
    poi_description_1 = models.TextField(db_column='POI_description_1')  # Field name made lowercase.
    poi_description_2 = models.TextField(db_column='POI_description_2', blank=True,default='')  # Field name made lowercase.
    descriptioneng = models.TextField(db_column='descriptionEng', blank=True, null=True)  # Field name made lowercase.
    poi_source = models.CharField(db_column='POI_source', max_length=600, blank=True, null=True)  # Field name made lowercase.
    language = models.CharField(max_length=50)
    format = models.CharField(max_length=50)
    creator = models.CharField(max_length=50, blank=True, null=True)
    publisher = models.CharField(max_length=50, blank=True, null=True)
    contributor = models.CharField(max_length=100, blank=True, null=True)
    rights = models.CharField(max_length=50, blank=True, null=True)
    identifier = models.CharField(max_length=50, blank=True, null=True)
    pa_description = models.CharField(max_length=300, blank=True, null=True)
    pa_embedcode = models.CharField(max_length=50, blank=True, null=True)
    poi_fk = models.IntegerField(db_column='POI_FK', blank=True, null=True)  # Field name made lowercase.
    verification = models.IntegerField(default=0, null=True)
    open = models.BooleanField(default=True)
    poi_added_time = models.DateTimeField(db_column='POI_added_time', blank=True, null=True)  # Field name made lowercase.
    bk_rights = models.CharField(max_length=50, blank=True, null=True)
    orig_poi = models.IntegerField(blank=True, null=True)
    media = models.CharField(max_length=200, blank=True, null=True)
    sub_identifier = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'dublincore'
    def __str__(self):
        return self.poi_title


def content_file_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = "media/%s.%s" % (instance.foreignkey.pk, ext)
    print(filename)
    return filename

class Mpeg(models.Model):
    picture_id = models.IntegerField(primary_key=True)
    picture_name = models.CharField(max_length=50)
    picture_type = models.CharField(max_length=50)
    picture_url = models.FileField(upload_to='../player_pictures/')
    picture_size = models.IntegerField()
    picture_upload_user = models.CharField(max_length=50, blank=True, null=True)
    picture_source = models.CharField(max_length=50, blank=True, null=True)
    picture_rights = models.CharField(max_length=50, blank=True, null=True)
    picture_upload_time = models.DateTimeField()
    foreignkey = models.ForeignKey(Dublincore,db_column='foreignKey', related_name="poi",on_delete = models.CASCADE, null=True)  # Field name made lowercase.
    format = models.SmallIntegerField()

    class Meta:
        db_table = 'mpeg'


class RoutePlanning(models.Model):
    TOOL = (
        ('開車','開車'),
        ('騎腳踏車','騎腳踏車'),
        ('走路','走路'),
        )
    route_id = models.IntegerField(primary_key=True)
    route_title = models.CharField(max_length=50)
    area_name_en = models.CharField(max_length=50)
    route_upload_time = models.DateTimeField()
    route_description = models.CharField(max_length=800, blank=True, null=True)
    route_owner = models.CharField(max_length=50, blank=True, null=True)
    coverage = models.FloatField(default=0)
    duration = models.IntegerField(default=0)
    transportation = models.CharField(max_length=50, blank=True, null=True,choices=TOOL)
    publish = models.CharField(max_length=10, blank=True, null=True)
    open = models.BooleanField(default=True)
    identifier = models.CharField(max_length=50, blank=True, null=True)
    verification = models.IntegerField(default=0)  #new
    contributor = models.CharField(max_length=50, blank=True, null=True) #new
    language = models.CharField(max_length=50, blank=True, null=True,default='中文' ) #new
    class Meta:
        db_table = 'route_planning'


class Sequence(models.Model):
    sequence_id = models.IntegerField(primary_key=True)
    poi_title = models.CharField(db_column='POI_title', max_length=100)  # Field name made lowercase.
    sequence = models.IntegerField()
    stay_time = models.IntegerField(default=0)
    next_time = models.IntegerField(blank=True, null=True,default=0)
    next_distance = models.FloatField(blank=True, null=True,default=0)
    foreignkey = models.ForeignKey(RoutePlanning,db_column='foreignKey' , related_name="loi",on_delete = models.CASCADE)  # Field name made lowercase.
    context_title = models.CharField(db_column='Context_title', max_length=50, blank=True, null=True)  # Field name made lowercase.
    context_content = models.CharField(db_column='Context_content', max_length=400, blank=True, null=True)  # Field name made lowercase.
    context_picture = models.CharField(db_column='Context_picture', max_length=50, blank=True, null=True)  # Field name made lowercase.
    poi_id = models.ForeignKey(Dublincore,db_column='POI_id', related_name="pois",on_delete = models.CASCADE, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 'sequence'


class UserProfile(models.Model):
    EDUCATION = (
            ('高中','高中'),
            ('大學','大學'),
            ('博士','博士'),
            ('碩士','碩士'),
            ('其它','其它'),
        )
    SEX = (
            (1,'男'),
            (0,'女'),
        )
    CAREER = (
            ('農漁牧','農漁牧'),
            ('政府機關','政府機關'),
            ('軍警','軍警'),
            ('教育/研究','教育/研究'),
            ('經商','經商'),
            ('建築/營造','建築/營造'),
            ('製造/供應商','製造/供應商'),
            ('金融/保險','金融/保險'),
            ('房地產','房地產'),
            ('資訊','資訊'),
            ('服務','服務'),
            ('學生','學生'),
            ('家管','家管'),
            ('醫療','醫療'),
            ('法律相關行業','法律相關行業'),
            ('流通/零售','流通/零售'),
            ('交通/運輸/旅遊','交通/運輸/旅遊'),
            ('娛樂/出版','娛樂/出版'),
            ('傳播/行銷','傳播/行銷'),
            ('藝術','藝術'),
            ('待業中','待業中'),
            ('其它','其它'),
        )
    IDENTITY = (
            ('user','玩家'),
            ('docent','解說員'),
            # ('expert','專家')
        )
    user_id = models.IntegerField(primary_key=True)
    user_name = models.CharField(max_length=50, unique=True, default="")
    password = models.CharField(max_length=50, blank=True, null=True)
    nickname = models.CharField(max_length=50, blank=True, null=True)
    gender = models.IntegerField(blank=True, null=True,choices=SEX)
    email = models.EmailField(max_length=100, blank=True, null=True)
    ishiddenemail = models.SmallIntegerField(db_column='isHiddenEmail', blank=True, null=True)  # Field name made lowercase.
    homepage = models.CharField(db_column='homePage', max_length=100, blank=True, null=True, default="無")  # Field name made lowercase.
    regtime = models.DateTimeField(db_column='regTime', blank=True, null=True,default=datetime.now)  # Field name made lowercase.
    regip = models.CharField(db_column='regIp', max_length=50, blank=True, null=True)  # Field name made lowercase.
    role = models.CharField(max_length=50, blank=True, null=True, choices=IDENTITY)
    postlogs = models.IntegerField(db_column='postLogs', blank=True, null=True)  # Field name made lowercase.
    postcomms = models.IntegerField(db_column='postComms', blank=True, null=True)  # Field name made lowercase.
    postmessages = models.IntegerField(db_column='postMessages', blank=True, null=True)  # Field name made lowercase.
    lastvisittime = models.DateTimeField(db_column='lastVisitTime', blank=True, null=True,default=datetime.now)  # Field name made lowercase.
    lastvisitip = models.CharField(db_column='lastVisitIP', max_length=50, blank=True, null=True)  # Field name made lowercase.
    hashkey = models.CharField(db_column='hashKey', max_length=50, blank=True, null=True)  # Field name made lowercase.
    birthday = models.DateField(blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    user_address = models.CharField(max_length=255, blank=True, null=True)
    education = models.CharField(max_length=50, blank=True, null=True,choices=EDUCATION)
    career = models.CharField(max_length=50, blank=True, null=True,choices=CAREER)
    income = models.IntegerField(blank=True, null=True, default=10000)
    interest = models.CharField(max_length=150, blank=True, null=True)
    coordinate = models.CharField(max_length=50, blank=True, null=True)
    # group_id = models.IntegerField(blank=True, null=True)
    # group_info = models.CharField(max_length=50, blank=True, null=True)
    coor_timestamp = models.DateTimeField(blank=True, null=True)
    account_state = models.SmallIntegerField(blank=True, null=True,default=1)
    experience = models.TextField(blank=True, null=True)
    bk_role = models.CharField(max_length=50, blank=True, null=True)
    is_prizeadder = models.IntegerField(default=0, null=True) # 是否為獎品登錄者,預設是0(不是獎品登錄者的麻瓜)

    class Meta:
        db_table = 'user_profile'

class DocentProfile(models.Model):
    fk_userid = models.ForeignKey(UserProfile,primary_key=True,on_delete = models.CASCADE)
    name = models.CharField(max_length=50)
    telphone = models.CharField(max_length=20, blank=True, null=True)
    cellphone = models.CharField(max_length=20, blank=True, null=True)
    docent_language = models.CharField(max_length=100, blank=True, null=True)
    charge = models.CharField(max_length=50, blank=True, null=True)
    photography = models.CharField(max_length=255, blank=True, null=True)
    introduction = models.CharField(max_length=255, blank=True, null=True)
    social_id = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'docent_profile'

class Aoi(models.Model):
    TOOL = (
        ('開車','開車'),
        ('騎腳踏車','騎腳踏車'),
        ('走路','走路'),
        )
    aoi_id = models.IntegerField(db_column='AOI_id',primary_key=True)  # Field name made lowercase.
    title = models.CharField(max_length=50)
    area_name_en = models.CharField(max_length=50)
    upload_time = models.DateTimeField()
    description = models.CharField(max_length=400, blank=True, null=True)
    owner = models.CharField(max_length=50, blank=True, null=True)
    coverage = models.FloatField(blank=True, null=True, default=0)
    no_pois = models.SmallIntegerField(default=0)
    open = models.BooleanField(default=True)
    identifier = models.CharField(max_length=50, blank=True, null=True)
    verification = models.IntegerField(default=0) #new
    contributor = models.CharField(max_length=50, blank=True, null=True) #new
    language = models.CharField(max_length=50, blank=True, null=True,default='中文') #new
    transportation = models.CharField(max_length=30, blank=True, null=True,default='開車',choices=TOOL) #new

    class Meta:
        db_table = 'AOI'


class AoiPois(models.Model):
    ids = models.IntegerField(primary_key=True)
    poi_title = models.CharField(db_column='POI_title', max_length=100)  # Field name made lowercase.
    aoi_id_fk = models.ForeignKey(Aoi,db_column='AOI_id_fk',on_delete = models.CASCADE)  # Field name made lowercase.
    context_title = models.CharField(db_column='Context_title', max_length=50, blank=True, null=True)  # Field name made lowercase.
    context_content = models.CharField(db_column='Context_content', max_length=400, blank=True, null=True)  # Field name made lowercase.
    context_picture = models.CharField(db_column='Context_picture', max_length=50, blank=True, null=True)  # Field name made lowercase.
    poi_id = models.ForeignKey(Dublincore,db_column='POI_id', blank=True, null=True,on_delete = models.CASCADE)  # Field name made lowercase.

    class Meta:
        db_table = 'AOI_POIs'


class SoiStory(models.Model):
    soi_id = models.IntegerField(db_column='SOI_id',primary_key=True)  # Field name made lowercase.
    soi_title = models.CharField(db_column='SOI_title', max_length=50)  # Field name made lowercase.
    area_name_en = models.CharField(max_length=50)
    soi_upload_time = models.DateTimeField(db_column='SOI_upload_time')  # Field name made lowercase.
    soi_description = models.TextField(db_column='SOI_description')  # Field name made lowercase.
    soi_user_name = models.CharField(db_column='SOI_user_name', max_length=50)  # Field name made lowercase.
    transportation = models.CharField(max_length=50,default='走路')
    open = models.BooleanField(default=True)
    identifier = models.CharField(max_length=50)
    language = models.CharField(max_length=50, blank=True, null=True)
    verification = models.IntegerField(default=0) #new
    contributor = models.CharField(max_length=50, blank=True, null=True) #new

    class Meta:
        db_table = 'SOI_story'


class SoiStoryXoi(models.Model):
    soi_xois_id = models.IntegerField(db_column='SOI_XOIs_id',primary_key=True)  # Field name made lowercase.
    soi_id_fk = models.ForeignKey(SoiStory,db_column='SOI_id_fk',on_delete = models.CASCADE)  # Field name made lowercase.
    poi_id = models.ForeignKey(Dublincore,db_column='POI_id',default=0,on_delete = models.CASCADE)  # Field name made lowercase.
    aoi_id = models.ForeignKey(Aoi,db_column='AOI_id',default=0,on_delete = models.CASCADE)  # Field name made lowercase.
    loi_id = models.ForeignKey(RoutePlanning,db_column='LOI_id',default=0,on_delete = models.CASCADE)  # Field name made lowercase.

    class Meta:
        db_table = 'SOI_story_xoi'

class Groups(models.Model):  # new
    group_id = models.IntegerField(primary_key=True)
    group_name = models.CharField(max_length=50, blank=True, null=True)
    group_leader_id = models.IntegerField(blank=True, null=True)
    group_info = models.TextField(blank=True, null=True)
    create_time = models.DateTimeField(
        blank=True, null=True, default=datetime.now)
    language = models.CharField(max_length=50, blank=True, null=True)
    verification = models.IntegerField(default=0)  # new
    open = models.BooleanField(default=True)
    coi_name = models.CharField(max_length=50, default="deh", null=True)
    manage_start_time = models.DateTimeField(blank=True, null=True)
    manage_end_time = models.DateTimeField(blank=True, null=True)
    manage = models.BooleanField(default=False)
    open_origin = models.BooleanField(default=True)

    class Meta:
        db_table = 'Groups'


class GroupsMember(models.Model):  # new
    member_id = models.IntegerField(primary_key=True)
    user_id = models.ForeignKey(UserProfile, default=0)
    join_time = models.DateTimeField(
        blank=True, null=True, default=datetime.now)
    foreignkey = models.ForeignKey(Groups, default=0, on_delete=models.CASCADE)
    identifier = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'GroupsMember'


class GroupsMessage(models.Model):
    message_id = models.IntegerField(primary_key=True)
    is_read = models.BooleanField(default=True)
    sender = models.ForeignKey(UserProfile, default=0, related_name='sender')
    receiver = models.ForeignKey(
        UserProfile, default=0, related_name='receiver')
    message_type = models.IntegerField(default=0)
    group_id = models.ForeignKey(Groups, default=0)

    class Meta:
        db_table = 'GroupsMessage'


class GroupsPoint(models.Model):
    id = models.IntegerField(primary_key=True)
    foreignkey = models.ForeignKey(Groups, default=0, on_delete=models.CASCADE)
    types = models.CharField(max_length=50, blank=True, null=True)
    point_id = models.IntegerField(default=0)

    class Meta:
        db_table = 'GroupsPoint'

class CoiPoint(models.Model):
    id = models.IntegerField(primary_key=True)
    types = models.CharField(max_length=50, blank=True, null=True)
    point_id = models.IntegerField(default=0)
    coi_name = models.CharField(max_length=50, blank=True, null=True)
    verification = models.IntegerField(default=0)
    feedback_mes = models.TextField(blank=True, default='驗證未通過')

    class Meta:
        db_table = 'CoiPoint'

class CoiUser(models.Model):
    id = models.IntegerField(primary_key=True)
    user_fk = models.ForeignKey(UserProfile, default=0, related_name='user_fk')
    coi_name = models.CharField(max_length=50, blank=True, null=True)
    role = models.IntegerField(default=0)

    class Meta:
        db_table = 'CoiUser'

class prize_profile(models.Model):
    prize_id = models.AutoField(primary_key=True)
    prize_name =  models.CharField(max_length=400, blank=True, null=True)
    prize_description =  models.CharField(max_length=400, blank=True, null=True)
    prize_url = models.FileField(upload_to='../player_pictures/prize/')
    prize_number =  models.IntegerField()
    upload_time =  models.DateTimeField()
    is_open = models.IntegerField()
    is_allocated = models.IntegerField()
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    group_id = models.CharField(max_length=400, blank=True, null=True)

    class Meta:
        db_table = 'prize_profile'

class GameSetting(models.Model):
    id = models.AutoField(primary_key=True)
    group_id = models.ForeignKey(Groups, on_delete=models.CASCADE)
    room_name = models.CharField(max_length=500)
    auto_start = models.BooleanField()
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    play_time = models.IntegerField()
    is_playing = models.IntegerField(default=0)
    game_prize_detail = models.CharField(max_length=2000,null=True)

    class Meta:
        db_table = 'GameSetting'

class GameChestSetting(models.Model):
    id = models.AutoField(primary_key=True)
    room_id = models.ForeignKey(GameSetting, on_delete=models.CASCADE)
    poi_id = models.ForeignKey(Dublincore,blank=True, null=True, on_delete=models.SET_NULL)
    lat = models.FloatField()
    lng = models.FloatField()
    num = models.IntegerField(blank=True, null=True)
    point = models.IntegerField(blank=True, null=True)
    distance = models.IntegerField(blank=True, null=True)
    question_type = models.IntegerField()
    question = models.CharField(max_length=500, blank=True, null=True)
    option1 = models.CharField(max_length=500, blank=True, null=True)
    option2 = models.CharField(max_length=500, blank=True, null=True)
    option3 = models.CharField(max_length=500, blank=True, null=True)
    option4 = models.CharField(max_length=500, blank=True, null=True)
    hint1 = models.CharField(max_length=500, blank=True, null=True)
    hint2 = models.CharField(max_length=500, blank=True, null=True)
    hint3 = models.CharField(max_length=500, blank=True, null=True)
    hint4 = models.CharField(max_length=500, blank=True, null=True)
    answer = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'GameChestSetting'

class GameHistory(models.Model):
    id = models.AutoField(primary_key=True)
    room_id = models.ForeignKey(GameSetting, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    play_time = models.IntegerField()
    state = models.IntegerField(default=0)

    class Meta:
        db_table = 'GameHistory'

class GameChestHistory(models.Model):
    id = models.AutoField(primary_key=True)
    game_id = models.ForeignKey(GameHistory, on_delete=models.CASCADE)
    poi_id = models.ForeignKey(Dublincore,blank=True, null=True, on_delete=models.SET_NULL)
    src_id = models.IntegerField(blank=True, null=True)
    lat = models.FloatField()
    lng = models.FloatField()
    num = models.IntegerField(blank=True, null=True)
    remain = models.IntegerField(blank=True, null=True)
    point = models.IntegerField(blank=True, null=True)
    distance = models.IntegerField(blank=True, null=True)
    question_type = models.IntegerField()
    question = models.CharField(max_length=500, blank=True, null=True)
    option1 = models.CharField(max_length=500, blank=True, null=True)
    option2 = models.CharField(max_length=500, blank=True, null=True)
    option3 = models.CharField(max_length=500, blank=True, null=True)
    option4 = models.CharField(max_length=500, blank=True, null=True)
    hint1 = models.CharField(max_length=500, blank=True, null=True)
    hint2 = models.CharField(max_length=500, blank=True, null=True)
    hint3 = models.CharField(max_length=500, blank=True, null=True)
    hint4 = models.CharField(max_length=500, blank=True, null=True)
    answer = models.CharField(max_length=500, blank=True, null=True)
    class Meta:
        db_table = 'GameChestHistory'

class GameRecordHistory(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    game_id = models.ForeignKey(GameHistory, on_delete=models.CASCADE)
    chest_id = models.ForeignKey(GameChestHistory, on_delete=models.CASCADE)
    answer = models.CharField(max_length=500, blank=True, null=True)
    answer_time = models.DateTimeField()
    correctness = models.NullBooleanField()
    lat = models.FloatField()
    lng = models.FloatField()
    point = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'GameRecordHistory'
        unique_together = ('user_id', 'game_id', 'chest_id')

class GameATT(models.Model):
    ATT_id = models.AutoField(primary_key=True)
    chest_id = models.ForeignKey(GameChestSetting, on_delete=models.CASCADE)
    ATT_url = models.FileField(upload_to='chest_media/')
    ATT_upload_time = models.DateTimeField()
    ATT_format = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'GameATT'

class GameATTHistory(models.Model):
    ATT_id = models.AutoField(primary_key=True)
    chest_id = models.ForeignKey(GameChestHistory, on_delete=models.CASCADE)
    ATT_url = models.FileField(upload_to='chest_media/')
    ATT_upload_time = models.DateTimeField()
    ATT_format = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'GameATTHistory'

class GameATTRecord(models.Model):
    ATT_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey(GameRecordHistory, on_delete=models.CASCADE)
    ATT_url = models.FileField(upload_to='record_media/')
    ATT_upload_time = models.DateTimeField()
    ATT_format = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'GameATTRecord'



class prize_to_player(models.Model):
    PTP_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    room_id = models.ForeignKey(GameSetting, on_delete=models.CASCADE)
    player_prize_id = models.IntegerField(null=True)
    prize_amount = models.IntegerField(null=True)
    start_time = models.CharField(max_length=400, blank=True, null=True)
    end_time = models.CharField(max_length=400, blank=True, null=True)
    play_time = models.CharField(max_length=400, blank=True, null=True)
    is_exchanged = models.IntegerField(default=0)

    class Meta:
        db_table = 'prize_to_player'

class Events(models.Model):  # new
    Event_id = models.IntegerField(primary_key=True)
    Event_name = models.CharField(max_length=50, blank=True, null=True)
    Event_leader_id = models.IntegerField(blank=True, null=True)
    Event_info = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=50, blank=True, null=True)
    verification = models.IntegerField(default=0) 
    open = models.BooleanField(default=True)
    coi_name = models.CharField(max_length=50, default="deh", null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'Events'

class EventsMember(models.Model):  # new
    member_id = models.AutoField(primary_key=True)
    identifier = models.CharField(max_length=50, blank=True, null=True)
    user_id = models.ForeignKey(UserProfile, default=0)
    event_id = models.ForeignKey(Events, default=0, on_delete=models.CASCADE)

    class Meta:
        db_table = 'EventsMember'

class EventsMessage(models.Model):
    message_id = models.IntegerField(primary_key=True)
    is_read = models.BooleanField(default=True)
    message_type = models.IntegerField(default=0)
    sender = models.ForeignKey(UserProfile, default=0, related_name='events_sender')
    receiver = models.ForeignKey(UserProfile, default=0, related_name='events_receiver')
    Event_id = models.ForeignKey(Events, default=0)

    class Meta:
        db_table = 'EventsMessage'

class EventsGroup(models.Model):  # new
    id = models.AutoField(primary_key=True)
    event_id = models.ForeignKey(Events, default=0)
    group_id = models.ForeignKey(Groups, default=0, on_delete=models.CASCADE)

    class Meta:
        db_table = 'EventsGroup'

class EventSetting(models.Model):
    id = models.AutoField(primary_key=True)
    event_id = models.ForeignKey(Events, on_delete=models.CASCADE)
    room_name = models.CharField(max_length=500)
    auto_start = models.BooleanField()
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    play_time = models.IntegerField()
    is_playing = models.IntegerField(default=0)
    game_prize_detail = models.CharField(max_length=2000,null=True)

    class Meta:
        db_table = 'EventSetting'

class EventHistory(models.Model):
    id = models.AutoField(primary_key=True)
    room_id = models.ForeignKey(EventSetting, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    play_time = models.IntegerField()
    state = models.IntegerField(default=0)

    class Meta:
        db_table = 'EventHistory'

class EventChestSetting(models.Model):
    id = models.AutoField(primary_key=True)
    room_id = models.ForeignKey(EventSetting, on_delete=models.CASCADE)
    poi_id = models.ForeignKey(Dublincore,blank=True, null=True, on_delete=models.SET_NULL)
    lat = models.FloatField()
    lng = models.FloatField()
    num = models.IntegerField(blank=True, null=True)
    point = models.IntegerField(blank=True, null=True)
    distance = models.IntegerField(blank=True, null=True)
    question_type = models.IntegerField()
    question = models.CharField(max_length=500, blank=True, null=True)
    option1 = models.CharField(max_length=500, blank=True, null=True)
    option2 = models.CharField(max_length=500, blank=True, null=True)
    option3 = models.CharField(max_length=500, blank=True, null=True)
    option4 = models.CharField(max_length=500, blank=True, null=True)
    hint1 = models.CharField(max_length=500, blank=True, null=True)
    hint2 = models.CharField(max_length=500, blank=True, null=True)
    hint3 = models.CharField(max_length=500, blank=True, null=True)
    hint4 = models.CharField(max_length=500, blank=True, null=True)
    answer = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'EventChestSetting'

class EventChestHistory(models.Model):
    id = models.AutoField(primary_key=True)
    game_id = models.ForeignKey(EventHistory, on_delete=models.CASCADE)
    poi_id = models.ForeignKey(Dublincore,blank=True, null=True, on_delete=models.SET_NULL)
    src_id = models.IntegerField(blank=True, null=True)
    lat = models.FloatField()
    lng = models.FloatField()
    num = models.IntegerField(blank=True, null=True)
    remain = models.IntegerField(blank=True, null=True)
    point = models.IntegerField(blank=True, null=True)
    distance = models.IntegerField(blank=True, null=True)
    question_type = models.IntegerField()
    question = models.CharField(max_length=500, blank=True, null=True)
    option1 = models.CharField(max_length=500, blank=True, null=True)
    option2 = models.CharField(max_length=500, blank=True, null=True)
    option3 = models.CharField(max_length=500, blank=True, null=True)
    option4 = models.CharField(max_length=500, blank=True, null=True)
    hint1 = models.CharField(max_length=500, blank=True, null=True)
    hint2 = models.CharField(max_length=500, blank=True, null=True)
    hint3 = models.CharField(max_length=500, blank=True, null=True)
    hint4 = models.CharField(max_length=500, blank=True, null=True)
    answer = models.CharField(max_length=500, blank=True, null=True)
    class Meta:
        db_table = 'EventChestHistory'

class EventRecordHistory(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    game_id = models.ForeignKey(EventHistory, on_delete=models.CASCADE)
    chest_id = models.ForeignKey(EventChestHistory, on_delete=models.CASCADE)
    answer = models.CharField(max_length=500, blank=True, null=True)
    answer_time = models.DateTimeField()
    correctness = models.NullBooleanField()
    lat = models.FloatField()
    lng = models.FloatField()
    point = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'EventRecordHistory'
        unique_together = ('user_id', 'game_id', 'chest_id')

class EventATT(models.Model):
    ATT_id = models.AutoField(primary_key=True)
    chest_id = models.ForeignKey(EventChestSetting, on_delete=models.CASCADE)
    ATT_url = models.FileField(upload_to='chest_media/')
    ATT_upload_time = models.DateTimeField()
    ATT_format = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'EventATT'

class EventATTHistory(models.Model):
    ATT_id = models.AutoField(primary_key=True)
    chest_id = models.ForeignKey(EventChestHistory, on_delete=models.CASCADE)
    ATT_url = models.FileField(upload_to='chest_media/')
    ATT_upload_time = models.DateTimeField()
    ATT_format = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'EventATTHistory'

class EventATTRecord(models.Model):
    ATT_id = models.AutoField(primary_key=True)
    record_id = models.ForeignKey(EventRecordHistory, on_delete=models.CASCADE)
    ATT_url = models.FileField(upload_to='record_media/')
    ATT_upload_time = models.DateTimeField()
    ATT_format = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'EventATTRecord'

