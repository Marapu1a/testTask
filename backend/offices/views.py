from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from django.contrib.auth import get_user_model  # Используем get_user_model для кастомной модели
from .models import Office, Room, Workplace, Booking
from .serializers import OfficeSerializer, RoomSerializer, WorkplaceSerializer, BookingSerializer

User = get_user_model()  # Используем кастомную модель

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
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def room_availability(self, request):
        # Получаем текущий момент времени
        now = timezone.now()
        availability_data = []

        # Проходимся по всем комнатам и вычисляем занятые и свободные места
        rooms = Room.objects.all()
        for room in rooms:
            total_workplaces = room.workplaces.count()  # исправлено на "workplaces" для related_name
            occupied_workplaces = room.workplaces.filter(
                bookings__end_time__gt=now,
                bookings__start_time__lte=now
            ).count()
            available_workplaces = total_workplaces - occupied_workplaces
            availability_data.append({
                "room_id": room.id,
                "room_number": room.number,
                "office": room.office.address,
                "total_workplaces": total_workplaces,
                "occupied_workplaces": occupied_workplaces,
                "available_workplaces": available_workplaces,
            })

        return Response(availability_data)

# Представление для создания пользователя (доступно только администратору)
class UserCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if email and password:
            # Создаём пользователя только с email и password
            user = User.objects.create_user(email=email, password=password)
            return Response({"message": "Пользователь создан"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Неверные данные"}, status=status.HTTP_400_BAD_REQUEST)