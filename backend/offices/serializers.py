from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Office, Room, Workplace, Booking

User = get_user_model()

# Сериализатор для модели User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'is_active', 'is_staff']

# Сериализатор для модели Office
class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ['id', 'name', 'address']

# Сериализатор для модели Room
class RoomSerializer(serializers.ModelSerializer):
    office = serializers.PrimaryKeyRelatedField(queryset=Office.objects.all())
    workplaces = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'number', 'capacity', 'office', 'workplaces']

# Сериализатор для модели Workplace
class WorkplaceSerializer(serializers.ModelSerializer):
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())

    class Meta:
        model = Workplace
        fields = ['id', 'number', 'is_occupied', 'room']

# Сериализатор для модели Booking с проверкой пересечения времени
class BookingSerializer(serializers.ModelSerializer):
    workplace = serializers.PrimaryKeyRelatedField(queryset=Workplace.objects.all())
    user_email = serializers.EmailField(source='user.email', read_only=True)  # Добавляем email пользователя

    class Meta:
        model = Booking
        fields = ['id', 'workplace', 'user', 'user_email', 'start_time', 'end_time']  # Включаем user_email

    def validate(self, data):
        """Проверка на пересечение времени бронирования"""
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