from .models import *
from rest_framework import serializers


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
        fields = ('id', 'date_of_order', 'order_time', 'cost',
        'client_num', 'client_fio', 'address', 'machines')

    def create(self, validated_data):
        return Order.objects.create(**validated_data)
