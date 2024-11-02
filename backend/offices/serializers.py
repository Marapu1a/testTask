from rest_framework import serializers
from django.contrib.auth.models import User  # Импорт модели пользователя
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Office, Room, Workplace, Booking

# Убираем кастомизацию, используем стандартный сериализатор TokenObtainPairSerializer

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

# Сериализатор для модели Booking
class BookingSerializer(serializers.ModelSerializer):
    workplace = serializers.PrimaryKeyRelatedField(queryset=Workplace.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Booking
        fields = ['id', 'workplace', 'user', 'start_time', 'end_time']