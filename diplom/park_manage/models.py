from django.db import models
from django.contrib.auth import authenticate
from django.db.models.deletion import CASCADE
from django.db.models.expressions import Case


class MachineType(models.Model):
    name = models.CharField(null=False, max_length=100, blank=False)
    about = models.TextField(null=False, blank=False)
    cost_to_hour = models.DecimalField(
        null=False, max_digits=10, decimal_places=2, blank=False)
    cost_to_day = models.DecimalField(
        null=False, max_digits=10, decimal_places=2, blank=False)
    
    def __str__(self):
        return "%s" % self.name


class Order(models.Model):
    date_of_order = models.DateField(null=False, blank=False)
    order_time = models.TimeField(null=False, blank=False)
    end_date_of_order = models.DateField(null=False, blank=False)
    end_order_time = models.TimeField(null=False, blank=False)
    cost = models.DecimalField(
        decimal_places=2, max_digits=10, null=False, blank=False, default=0)
    client_num = models.CharField(null=False, blank=False, max_length=150)
    client_fio = models.CharField(null=False, blank=False, max_length=150)
    address = models.CharField(null=False, blank=False, max_length=150)
    coordinate = models.JSONField(null=False, blank=False)
    machine_type = models.ForeignKey(
        MachineType, on_delete=models.CASCADE, null=False, related_name='machine_type'
    )

    def __str__(self):
        return "%s" % self.address


class Machine(models.Model):
    name = models.CharField(null=False, max_length=150, blank=False)
    about = models.TextField(null=False, blank=False)
    STATUS = (
        ('FREE', 'free'),
        ('REPAIR', 'on repair'),
    )
    status = models.CharField(max_length=150, choices=STATUS)
    type = models.ForeignKey(
        MachineType, on_delete=models.CASCADE, null=False, related_name='type'
    )
    
    def __str__(self):
        return "%s" % self.name


class TimingTable(models.Model):
    machine = models.ForeignKey(
        Machine, on_delete=CASCADE, null=False, related_name='timing_orders' 
    )
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=False, related_name='timing_machines')


class MachineList(models.Model):
    machine = models.ForeignKey(
        MachineType, on_delete=models.CASCADE, null=False, related_name='orders')
    CHOICES = (
        ('HOUR', 'hour'),
        ('DAY', 'day'),
    )
    hour_or_day = models.CharField(max_length=150, choices=CHOICES)
    duration = models.IntegerField(null=False, blank=False)
    cost = models.DecimalField(
        max_digits=10, decimal_places=2, null=False, blank=False, default=0)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=False, related_name='machines')

    def __str__(self):
        return "%s" % self.order.address

    @property
    def new_cost(self):
        if self.hour_or_day == 'HOUR':
            return self.machine.cost_to_hour * self.duration
        else:
            return self.machine.cost_to_day * self.duration

    def save(self, *args, **kwargs):
        self.cost = self.new_cost
        order = Order.objects.get(pk=self.order.id)
        order.cost += self.cost
        super(MachineList, self).save(*args, **kwargs)
        order.save()
