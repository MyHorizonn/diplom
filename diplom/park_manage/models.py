from django.db import models


class Order(models.Model):
    date_of_order = models.DateField(null=False, blank=False)
    cost = models.DecimalField(
        decimal_places=2, max_digits=10, null=False, blank=False, default=0)
    client_num = models.CharField(null=False, blank=False, max_length=150)
    client_fio = models.CharField(null=False, blank=False, max_length=150)
    address = models.CharField(null=False, blank=False, max_length=150)

    def __str__(self):
        return "%s" % self.address


class Machine(models.Model):
    name = models.CharField(null=False, max_length=150, blank=False)
    about = models.TextField(null=False, blank=False)
    cost_to_hour = models.DecimalField(
        null=False, max_digits=10, decimal_places=2, blank=False)
    cost_to_day = models.DecimalField(
        null=False, max_digits=10, decimal_places=2, blank=False)
    STATUS = (
        ('FREE', 'free'),
        ('NOT_FREE', 'busy'),
        ('REPAIR', 'on repair'),
    )
    status = models.CharField(max_length=150, choices=STATUS)

    def __str__(self):
        return "%s" % self.name


class MachineList(models.Model):
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, null=False)
    CHOICES = (
        ('HOUR', 'hour'),
        ('DAY', 'day'),
    )
    hour_or_day = models.CharField(max_length=150, choices=CHOICES)
    duration = models.IntegerField(null=False, blank=False)
    cost = models.DecimalField(
        max_digits=10, decimal_places=2, null=False, blank=False, default=0)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='machines')

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
