from django.contrib import admin
from .models import CustomUser, Office, Room, Workplace, Booking
from .forms import BookingForm

# Регистрация модели пользователя
@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_staff', 'is_active')
    search_fields = ('email',)
    list_filter = ('is_staff', 'is_active')
    ordering = ('email',)

# Регистрация офисов
@admin.register(Office)
class OfficeAdmin(admin.ModelAdmin):
    list_display = ('name', 'address')
    search_fields = ('name', 'address')

# Регистрация комнат
@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('number', 'office', 'capacity')
    list_filter = ('office',)

# Регистрация рабочих мест
@admin.register(Workplace)
class WorkplaceAdmin(admin.ModelAdmin):
    list_display = ('room', 'number', 'is_occupied')
    list_filter = ('room', 'is_occupied')

# Регистрация бронирований с кастомной формой
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    form = BookingForm
    list_display = ('workplace', 'user', 'start_time', 'end_time')
    list_filter = ('workplace', 'user')

    class Media:
        js = ('/static/booking_admin.js',)  # Указываем полный путь