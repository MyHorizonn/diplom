from rest_framework.routers import DefaultRouter
from .views import *

app_name = "park_manage"

router = DefaultRouter()

router.register(r'orders', OrderView, basename='user')
router.register(r'machines', MachineView, basename='user')
router.register(r'machinelists', MachineListView, basename='user')

urlpatterns = router.urls
