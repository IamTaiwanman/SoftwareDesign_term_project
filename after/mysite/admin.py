from django.contrib import admin
from mysite import models
from django.contrib.auth.admin import UserAdmin
from mysite.models import UserProfile
# from mysite.forms import CustomUserChangeForm, CustomUserCreationForm

class PoiAdmin(admin.ModelAdmin):
    list_display = ('poi_id' , 'poi_title')

class LoiAdmin(admin.ModelAdmin):
    list_display = ('route_id' , 'route_title')

# class AoiAdmin(admin.ModelAdmin):
#     list_display = ('aoi_id' , 'AOI_title' , 'user')

# class SoiAdmin(admin.ModelAdmin):
#     list_display = ('soi_id' , 'SOI_title' , 'user')

class UserAdmin(admin.ModelAdmin):
	list_display = ('user_id','user_name','password','email')


admin.site.register(models.Poi, PoiAdmin)
admin.site.register(models.RoutePlanning, LoiAdmin)
admin.site.register(models.Aoi)
admin.site.register(UserProfile,UserAdmin)