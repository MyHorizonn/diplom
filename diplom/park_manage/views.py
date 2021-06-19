from django.contrib import auth
from django.http.response import HttpResponse, HttpResponseBadRequest
from django.urls import exceptions
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.core.exceptions import ObjectDoesNotExist

class MachineView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MachineSerializer
    queryset = Machine.objects.all()


class MachineListView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MachineListSerializer
    queryset = MachineList.objects.all()


class OrderView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class MachineTypeView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MachineTypeSerializer
    queryset = MachineType.objects.all()


class TimingTableView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TimingTableSerializer
    queryset = TimingTable.objects.all()


class FreeMachinesView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MachineSerializer
    queryset = Machine.objects.filter(status='FREE')


@api_view(['GET', 'POST'])
def my_login(request):
    username = request.data['username']
    password = request.data['password']
    user = authenticate(request, username=username, password=password)
    # проверка на пустоту
    try:
        user_id = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return HttpResponseBadRequest()
    try:
        group = user_id.groups.all()[0].id
    except IndexError:
        group = 0
    if user is not None:
        if user.is_active:
            login(request, user)
            return JsonResponse({'group': group})
    else:
        return HttpResponseBadRequest()
