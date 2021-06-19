from django.db.models import fields
from django.db.models.query_utils import select_related_descend
from .models import *
from rest_framework import serializers

class MachineTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = MachineType
        fields = '__all__'

    def create(self, validated_data):
        return MachineType.objects.create(**validated_data)


class TimingTableSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimingTable
        fields = '__all__'

    def create(self, validated_data):
        return TimingTable.objects.create(**validated_data)


class MachineListSerializer(serializers.ModelSerializer):

    class Meta:
        model = MachineList
        fields = '__all__'

    def create(self, validated_data):
        return MachineList.objects.create(**validated_data)


class MachineSerializer(serializers.ModelSerializer):
    timing_orders = TimingTableSerializer(many=True, read_only=True)

    class Meta:
        model = Machine
        fields = ('id', 'name', 'about', 'status', 'type', 'timing_orders')

    def create(self, validated_data):
        return Machine.objects.create(**validated_data)


class OrderSerializer(serializers.ModelSerializer):
    timing_machines = TimingTableSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'date_of_order', 'order_time', 'end_date_of_order',
         'end_order_time', 'cost',
        'client_num', 'client_fio', 'address', 'coordinate', 'machine_type', 'timing_machines')

    def create(self, validated_data):
        return Order.objects.create(**validated_data)
