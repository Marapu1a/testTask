from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OfficeViewSet, RoomViewSet, WorkplaceViewSet, BookingViewSet

# Создаем роутер и регистрируем в нем наши ViewSets
router = DefaultRouter()
router.register(r'offices', OfficeViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'workplaces', WorkplaceViewSet)
router.register(r'bookings', BookingViewSet)

# Подключаем маршруты к API
urlpatterns = [
    path('', include(router.urls)),
]