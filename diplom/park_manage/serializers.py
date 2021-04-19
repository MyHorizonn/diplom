from .models import *
from rest_framework import serializers


class MachineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Machine
        fields = '__all__'

    def create(self, validated_data):
        return Machine.objects.create(**validated_data)


class MachineListSerializer(serializers.ModelSerializer):
    machine_name = serializers.CharField(source='machine.name')

    class Meta:
        model = MachineList
        fields = ('machine_name', 'hour_or_day', 'duration', 'cost')

    def create(self, validated_data):
        return MachineList.objects.create(**validated_data)


class OrderSerializer(serializers.ModelSerializer):
    machines = MachineListSerializer(many=True)

    class Meta:
        model = Order
        fields = ('id', 'date_of_order', 'cost', 'client_num',
                  'client_fio', 'address', 'machines')

    def create(self, validated_data):
        return Order.objects.create(**validated_data)
