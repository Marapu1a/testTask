from rest_framework import viewsets
from .models import Office, Room, Workplace
from .serializers import OfficeSerializer, RoomSerializer, WorkplaceSerializer

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