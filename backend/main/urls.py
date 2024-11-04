from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from offices.views import OfficeViewSet, RoomViewSet, WorkplaceViewSet, BookingViewSet, UserCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Создаем роутер и регистрируем viewset'ы
router = DefaultRouter()
router.register(r'offices', OfficeViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'workplaces', WorkplaceViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # Подключаем роутер для эндпоинтов моделей
    path('api/create-user/', UserCreateView.as_view(), name='create_user'),  # Добавляем маршрут для создания пользователя
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Токены
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('offices.urls')),  # Добавляем пути из `offices/urls.py`
]