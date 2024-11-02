from django.db import models
from django.contrib.auth.models import User  # Импортируем модель пользователя для связи с бронированием

# Модель, представляющая офис
class Office(models.Model):
    # Поле для хранения адреса офиса
    address = models.CharField(max_length=255)
    # Имя или название офиса
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name  # Отображение имени офиса в админке и при выводе объекта

# Модель, представляющая комнату в офисе
class Room(models.Model):
    # Связь комнаты с конкретным офисом (при удалении офиса, все комнаты удаляются)
    office = models.ForeignKey(Office, on_delete=models.CASCADE, related_name='rooms')
    # Номер комнаты
    number = models.CharField(max_length=10)
    # Вместимость комнаты по количеству рабочих мест
    capacity = models.IntegerField()

    def __str__(self):
        # Отображение комнаты с номером и привязкой к офису
        return f"Room {self.number} in {self.office.name}"

# Модель, представляющая рабочее место в комнате
class Workplace(models.Model):
    # Связь рабочего места с конкретной комнатой
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='workplaces')
    # Номер рабочего места
    number = models.CharField(max_length=10)
    # Статус рабочего места, по умолчанию свободно
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        # Отображение рабочего места с номером и привязкой к комнате
        return f"Workplace {self.number} in {self.room}"

# Модель бронирования рабочего места
class Booking(models.Model):
    # Рабочее место, которое бронируется
    workplace = models.ForeignKey(Workplace, on_delete=models.CASCADE, related_name='bookings')
    # Пользователь, забронировавший место
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    # Время начала бронирования
    start_time = models.DateTimeField()
    # Время окончания бронирования
    end_time = models.DateTimeField()

    def __str__(self):
        return f"Booking by {self.user} from {self.start_time} to {self.end_time}"