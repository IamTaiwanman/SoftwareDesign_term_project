#_*_ encoding: utf-8 *_*
from django import forms
from mysite import models
from captcha.fields import CaptchaField
from django.forms import ModelForm,extras
from django.core.exceptions import ValidationError
from mysite import models
from django.db.models import F
import hashlib



#使用者登入
class LoginForm(forms.Form):
    username = forms.CharField(label='帳號', max_length=20)
    password = forms.CharField(label='密碼', widget=forms.PasswordInput())

class DateInput(forms.DateInput):
    input_type = 'date'


# 使用者資料
class ProfileForm(forms.ModelForm):
    birthday = forms.DateField(widget=forms.extras.SelectDateWidget(years=range(1950, 2017)))
    class Meta:
        model = models.UserProfile
        fields = ['nickname','gender','email','birthday','education','homepage','career','user_address']

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.fields['nickname'].label = '姓名/暱稱'
        self.fields['gender'].label = '性別'
        self.fields['email'].label = 'Email'
        self.fields['birthday'].label = '生日'
        self.fields['education'].label = '學歷'
        self.fields['homepage'].label = '個人網頁'
        self.fields['career'].label = '職業'
        self.fields['user_address'].label = '地址'


def computeMD5hash(string):
    m = hashlib.md5()
    m.update(string.encode('utf-8'))
    return m.hexdigest()

# 註冊資料
class RegForm(forms.ModelForm):
    password=forms.CharField(widget=forms.PasswordInput())
    password_confirm = forms.CharField(widget=forms.PasswordInput())
    birthday = forms.DateField(widget=forms.extras.SelectDateWidget(years=range(1950, 2017)))
    user_id = forms.IntegerField(widget=forms.HiddenInput())
    class Meta:
        model = models.UserProfile
        fields = ['user_name','password','nickname','email','gender','birthday','homepage','education','career','user_address','role','user_id']

    def __init__(self, *args, **kwargs):
        super(RegForm, self).__init__(*args, **kwargs)
        self.fields['user_name'].label = '帳號(必要)'
        self.fields['password'].label = '密碼(必要)'
        self.fields['nickname'].label = '姓名/暱稱'
        self.fields['email'].label = 'Email'
        self.fields['gender'].label = '性別'
        self.fields['birthday'].label = '生日'
        self.fields['homepage'].label = '網站'
        self.fields['education'].label = '學歷'
        self.fields['career'].label = '職業'
        self.fields['user_address'].label = '地址'
        self.fields['role'].label = '身份'

    def clean(self):
        # user_id = models.UserProfile.user_id
        cleaned_data = super(RegForm, self).clean()
        password = computeMD5hash(cleaned_data["password"])
        password_confirm = computeMD5hash(cleaned_data["password_confirm"])

        if password != password_confirm:
            raise forms.ValidationError("密碼不正確")
        else:
            cleaned_data["password"] = computeMD5hash(cleaned_data["password"])
            cleaned_data["password_confirm"] = computeMD5hash(cleaned_data["password_confirm"])
        return self.cleaned_data

    def clean_asset_code(self):
        user_name = self.cleaned_data['user_name']
        if models.UserProfile.objects.filter(user_name=user_name).exists():
            raise forms.ValidationError("This user_name already exist.")
        return user_name