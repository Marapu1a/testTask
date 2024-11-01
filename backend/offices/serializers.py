from rest_framework import serializers
from .models import Office, Room, Workplace

# Сериализатор для модели Office
class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ['id', 'name', 'address']

# Сериализатор для модели Room
class RoomSerializer(serializers.ModelSerializer):
    # Автоматически включает связанные рабочие места (workplaces) через related_name
    workplaces = serializers.StringRelatedField(many=True)

    class Meta:
        model = Room
        fields = ['id', 'number', 'capacity', 'office', 'workplaces']

# Сериализатор для модели Workplace
class WorkplaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workplace
        fields = ['id', 'number', 'is_occupied', 'room']