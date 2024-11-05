from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, OfficeViewSet, RoomViewSet, WorkplaceViewSet, BookingViewSet, get_rooms, get_workplaces

router = DefaultRouter()
router.register(r'offices', OfficeViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'workplaces', WorkplaceViewSet)
router.register(r'bookings', BookingViewSet, basename='booking')  # Указываем basename
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('get_rooms/<int:office_id>/', get_rooms, name='get_rooms'),
    path('get_workplaces/<int:room_id>/', get_workplaces, name='get_workplaces'),
]