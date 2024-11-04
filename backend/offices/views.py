from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Office, Room, Workplace, Booking
from .serializers import OfficeSerializer, RoomSerializer, WorkplaceSerializer, BookingSerializer

# Представление для модели Office
class OfficeViewSet(viewsets.ModelViewSet):
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer
    permission_classes = [IsAuthenticated]

# Представление для модели Room
class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

# Представление для модели Workplace
class WorkplaceViewSet(viewsets.ModelViewSet):
    queryset = Workplace.objects.all()
    serializer_class = WorkplaceSerializer
    permission_classes = [IsAuthenticated]

# Представление для модели Booking
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Добавим проверку на конфликты времени бронирования
        serializer.save()

# Функция для получения списка комнат по выбранному офису
def get_rooms(request, office_id):
    rooms = Room.objects.filter(office_id=office_id).values('id', 'number')
    return JsonResponse(list(rooms), safe=False)

# Функция для получения списка всех рабочих мест по комнате
def get_workplaces(request, room_id):
    workplaces = Workplace.objects.filter(room_id=room_id).values('id', 'number', 'is_occupied')
    return JsonResponse(list(workplaces), safe=False)