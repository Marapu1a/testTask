from django import forms
from .models import Booking, Office, Room, Workplace

class BookingForm(forms.ModelForm):
    office = forms.ModelChoiceField(queryset=Office.objects.all(), required=False)
    room = forms.ModelChoiceField(queryset=Room.objects.none(), required=False)
    workplace = forms.ModelChoiceField(queryset=Workplace.objects.none(), required=True)

    class Meta:
        model = Booking
        fields = ['office', 'room', 'workplace', 'user', 'start_time', 'end_time']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Если это редактирование (существующий объект), показываем только поле workplace
        if self.instance.pk:
            self.fields['office'].widget = forms.HiddenInput()
            self.fields['room'].widget = forms.HiddenInput()
            self.fields['workplace'].queryset = Workplace.objects.filter(room=self.instance.workplace.room)
        else:
            # Новый объект: каскадная логика для выбора офиса -> комнаты -> рабочих мест
            if 'office' in self.data:
                try:
                    office_id = int(self.data.get('office'))
                    self.fields['room'].queryset = Room.objects.filter(office_id=office_id)
                except (ValueError, TypeError):
                    pass

            if 'room' in self.data:
                try:
                    room_id = int(self.data.get('room'))
                    self.fields['workplace'].queryset = Workplace.objects.filter(room_id=room_id, is_occupied=False)
                except (ValueError, TypeError):
                    pass