from rest_framework import viewsets
from .models import Office, Room, Workplace, Booking
from .serializers import OfficeSerializer, RoomSerializer, WorkplaceSerializer, BookingSerializer

# Представление для модели Office
class OfficeViewSet(viewsets.ModelViewSet):
    """
    API endpoint для просмотра и редактирования офисов.
    """
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer

# Представление для модели Room
class RoomViewSet(viewsets.ModelViewSet):
    """
    API endpoint для просмотра и редактирования комнат.
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

# Представление для модели Workplace
class WorkplaceViewSet(viewsets.ModelViewSet):
    """
    API endpoint для просмотра и редактирования рабочих мест.
    """
    queryset = Workplace.objects.all()
    serializer_class = WorkplaceSerializer

# Представление для модели Booking
class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint для просмотра, создания и удаления бронирований.
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        # Этот метод вызывается при создании нового бронирования
        # Позже сюда добавим логику проверки конфликтов времени
        serializer.save()