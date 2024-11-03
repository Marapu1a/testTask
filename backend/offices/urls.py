from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfficeViewSet, RoomViewSet, WorkplaceViewSet, BookingViewSet, UserCreateView

router = DefaultRouter()
router.register(r'offices', OfficeViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'workplaces', WorkplaceViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create-user/', UserCreateView.as_view(), name='create_user'),  # маршрут для создания пользователя
    path('bookings/room_availability/', BookingViewSet.as_view({'get': 'room_availability'}), name='room_availability'),  # маршрут для проверки доступности комнат
]