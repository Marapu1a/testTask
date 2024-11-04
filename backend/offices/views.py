from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from datetime import datetime
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Office, Room, Workplace, Booking
from .serializers import OfficeSerializer, RoomSerializer, WorkplaceSerializer, BookingSerializer

User = get_user_model()

class OfficeViewSet(viewsets.ModelViewSet):
    queryset = Office.objects.all()
    serializer_class = OfficeSerializer
    permission_classes = [IsAuthenticated]

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

class WorkplaceViewSet(viewsets.ModelViewSet):
    queryset = Workplace.objects.all()
    serializer_class = WorkplaceSerializer
    permission_classes = [IsAuthenticated]

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def room_availability(self, request):
        """Получить доступность всех комнат и рабочих мест в офисе."""
        now = timezone.now()
        office_id = request.query_params.get('office')
        if not office_id:
            return Response({"error": "Office ID не указан."}, status=status.HTTP_400_BAD_REQUEST)

        rooms = Room.objects.filter(office_id=office_id)
        availability_data = []

        for room in rooms:
            total_workplaces = room.workplaces.count()
            
            # Подсчитываем количество занятых рабочих мест на текущий момент
            occupied_workplaces = room.workplaces.filter(
                bookings__start_time__lte=now,
                bookings__end_time__gt=now
            ).distinct().count()
            
            available_workplaces = total_workplaces - occupied_workplaces
            availability_data.append({
                "room_id": room.id,
                "room_number": room.number,
                "total_workplaces": total_workplaces,
                "occupied_workplaces": occupied_workplaces,
                "available_workplaces": available_workplaces,
            })

        return Response(availability_data)

    @action(detail=True, methods=['get'])
    def workplace_availability(self, request, pk=None):
        """Получить информацию о доступности конкретного рабочего места."""
        now = timezone.now()
        workplace = Workplace.objects.get(pk=pk)
        current_booking = workplace.bookings.filter(
            start_time__lte=now,
            end_time__gt=now
        ).first()

        if current_booking:
            availability = {
                "occupied_until": current_booking.end_time,
                "occupied_by": current_booking.user.email
            }
        else:
            next_booking = workplace.bookings.filter(start_time__gt=now).order_by('start_time').first()
            availability = {
                "available_until": next_booking.start_time if next_booking else "доступно без ограничений",
                "next_occupant": next_booking.user.email if next_booking else None
            }

        return Response(availability)

    @action(detail=False, methods=['post'])
    def check_availability(self, request):
        """Проверить доступность рабочего места на указанный интервал времени."""
        workplace_id = request.data.get("workplace")
        start_time = request.data.get("start_time")
        end_time = request.data.get("end_time")

        overlapping_bookings = Booking.objects.filter(
            workplace_id=workplace_id,
            start_time__lt=end_time,
            end_time__gt=start_time
        )

        if overlapping_bookings.exists():
            return Response({"error": "Рабочее место уже забронировано на выбранное время."},
                            status=status.HTTP_409_CONFLICT)
        return Response({"message": "Место доступно для бронирования."})

class UserCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if email and password:
            user = User.objects.create_user(email=email, password=password)
            return Response({"message": "Пользователь создан"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Неверные данные"}, status=status.HTTP_400_BAD_REQUEST)