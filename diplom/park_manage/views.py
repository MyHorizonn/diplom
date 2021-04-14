from rest_framework import viewsets
from .serializers import *


class MachineView(viewsets.ModelViewSet):

    serializer_class = MachineSerializer
    queryset = Machine.objects.all()


class MachineListView(viewsets.ModelViewSet):

    serializer_class = MachineListSerializer
    queryset = MachineList.objects.all()


class OrderView(viewsets.ModelViewSet):

    serializer_class = OrderSerializer
    queryset = Order.objects.all()
