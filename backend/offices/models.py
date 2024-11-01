from django.db import models

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
