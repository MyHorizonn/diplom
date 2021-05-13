from rest_framework.routers import DefaultRouter
from .views import *

app_name = "park_manage"

router = DefaultRouter()

router.register(r'orders', OrderView, 'orders')
router.register(r'machines', MachineView, 'machines')
router.register(r'machinelists', MachineListView, 'machinelists')
router.register(r'freemachines', FreeMachineView, 'freemachines')

urlpatterns = router.urls
