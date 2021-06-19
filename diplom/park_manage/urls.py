from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path
from django.contrib.auth import views as auth_views

app_name = "park_manage"

router = DefaultRouter()

router.register(r'orders', OrderView, 'orders')
router.register(r'machines', MachineView, 'machines')
router.register(r'machinelists', MachineListView, 'machinelists')
router.register(r'machinetypes', MachineTypeView, 'machinetypes')
router.register(r'timingtables', TimingTableView, 'timingtables')
router.register(r'freemachines', FreeMachinesView, 'freemachines')
urlpatterns = router.urls

urlpatterns += [
    path('users/', my_login, name='users'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout')
]
