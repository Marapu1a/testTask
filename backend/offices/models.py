from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings  # Используем кастомного пользователя из настроек

# Кастомный менеджер пользователей
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# Кастомная модель пользователя
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

# Модель для офиса
class Office(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name

# Модель для комнаты
class Room(models.Model):
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name="rooms")
    number = models.CharField(max_length=10)
    capacity = models.IntegerField()

    def __str__(self):
        return f"Room {self.number} in {self.office.name}"

# Модель для рабочего места
class Workplace(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="workplaces")
    number = models.CharField(max_length=10)
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f"Workplace {self.number} in {self.room}"

# Модель для бронирования рабочего места
class Booking(models.Model):
    workplace = models.ForeignKey(Workplace, on_delete=models.CASCADE, related_name="bookings")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"Booking by {self.user.email} from {self.start_time} to {self.end_time}"