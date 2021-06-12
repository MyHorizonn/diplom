from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User


class MachineListSerializer(serializers.ModelSerializer):

    class Meta:
        model = MachineList
        fields = '__all__'

    def create(self, validated_data):
        return MachineList.objects.create(**validated_data)


class MachineSerializer(serializers.ModelSerializer):
    orders = MachineListSerializer(many=True, read_only=True)

    class Meta:
        model = Machine
        fields = ('id', 'name', 'about', 'cost_to_hour',
                  'cost_to_day', 'status', 'orders')

    def create(self, validated_data):
        return Machine.objects.create(**validated_data)


class OrderSerializer(serializers.ModelSerializer):
    machines = MachineListSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'date_of_order', 'order_time', 'end_date_of_order',
         'end_order_time', 'cost',
        'client_num', 'client_fio', 'address', 'coordinate', 'machines')

    def create(self, validated_data):
        return Order.objects.create(**validated_data)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
