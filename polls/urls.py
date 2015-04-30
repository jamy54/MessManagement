from django.conf.urls import patterns, url

from polls import views

urlpatterns = patterns('',
    url(r'^$', views.htmlRander, name='index'),
    url(r'^(?P<poll_i>\d+)/$', views.detail, name='detail'),
    url(r'^features$', views.features , name='detail'),
    url(r'^news$', views.news, name='detail'),
    url(r'^post$', views.post, name='detail'),
    url(r'^about$', views.about, name='detail'),
    url(r'^contact$', views.contact , name='detail'),
    url(r'^getName$', views.getName , name='detail'),
    url(r'^addcatagory', views.addcatagory , name='detail'),
    url(r'^getcatagory', views.getcatagory , name='detail'),
    url(r'^insertMeal', views.insertMeal , name='detail'),
    url(r'^getInfo', views.get_info , name='detail'),
    url(r'^index$', views.htmlRander , name='detail')
)