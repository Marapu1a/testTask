from rest_framework import serializers
from django.utils import timezone
from .models import Office, Room, Workplace, Booking

class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ['id', 'name', 'address']

class RoomSerializer(serializers.ModelSerializer):
    office = serializers.PrimaryKeyRelatedField(queryset=Office.objects.all())
    workplaces = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    available_workplaces = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'number', 'capacity', 'office', 'workplaces', 'available_workplaces']

    def get_available_workplaces(self, obj):
        # Подсчитываем количество свободных рабочих мест в комнате
        return obj.workplaces.filter(is_occupied=False).count()

class WorkplaceSerializer(serializers.ModelSerializer):
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())

    class Meta:
        model = Workplace
        fields = ['id', 'number', 'is_occupied', 'room']

class BookingSerializer(serializers.ModelSerializer):
    workplace = serializers.PrimaryKeyRelatedField(queryset=Workplace.objects.all())
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = Booking
        fields = ['id', 'workplace', 'user', 'start_time', 'end_time']

    def validate(self, data):
        """Проверка на пересечение времени бронирования."""
        start_time = data['start_time']
        end_time = data['end_time']
        workplace = data['workplace']

        if start_time >= end_time:
            raise serializers.ValidationError("Время окончания должно быть позже времени начала.")
        
        overlapping_bookings = Booking.objects.filter(
            workplace=workplace,
            start_time__lt=end_time,
            end_time__gt=start_time
        )

        if overlapping_bookings.exists():
            raise serializers.ValidationError("Это рабочее место уже забронировано на выбранное время.")
        
        return data