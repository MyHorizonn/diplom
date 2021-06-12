from django.contrib import admin
from .models import *


class Machines(admin.TabularInline):
    model = MachineList
    extra = 1


class OrderAdmin(admin.ModelAdmin):
    inlines = [
        Machines
    ]


admin.site.register(Machine)
admin.site.register(MachineList)
admin.site.register(Order, OrderAdmin)