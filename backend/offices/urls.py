from django.urls import include, path
from rest_framework import routers
from .views import OfficeViewSet, RoomViewSet, WorkplaceViewSet

# Роутер для автоматического создания маршрутов
router = routers.DefaultRouter()
router.register(r'offices', OfficeViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'workplaces', WorkplaceViewSet)

# Подключение маршрутов через роутер
urlpatterns = [
    path('', include(router.urls)),
]