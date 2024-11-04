/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getRoomAvailability, createBooking } from '../api';

function BookingForm({ office }) {
    const [rooms, setRooms] = useState([]); // Список комнат в офисе
    const [selectedRoom, setSelectedRoom] = useState(null); // Выбранная комната
    const [selectedWorkplace, setSelectedWorkplace] = useState(null); // Выбранное рабочее место
    const [availableWorkplaces, setAvailableWorkplaces] = useState([]); // Доступные рабочие места для выбранной комнаты
    const [startTime, setStartTime] = useState(''); // Время начала бронирования
    const [endTime, setEndTime] = useState(''); // Время окончания бронирования
    const [error, setError] = useState(''); // Ошибка для отображения пользователю
    const [message, setMessage] = useState(''); // Успешное сообщение для отображения пользователю

    // Загрузка доступности комнат для офиса
    const loadRoomAvailability = async () => {
        try {
            const data = await getRoomAvailability(office.id);
            setRooms(data); // Сохраняем список комнат
        } catch {
            setError('Не удалось загрузить доступность комнат');
        }
    };

    useEffect(() => {
        loadRoomAvailability();
    }, [office]);

    // Обработка выбора комнаты
    const handleRoomSelect = (e) => {
        const roomId = Number(e.target.value);
        const room = rooms.find((room) => room.id === roomId);
        
        if (room) {
            setSelectedRoom(room); // Устанавливаем выбранную комнату
            setAvailableWorkplaces(Array.from({ length: room.available_workplaces }, (_, i) => i + 1)); // Устанавливаем доступные рабочие места
            setSelectedWorkplace(null); // Сбрасываем выбор рабочего места
        } else {
            setSelectedRoom(null);
            setAvailableWorkplaces([]);
        }
    };

    // Обработка создания бронирования
    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Проверка наличия всех необходимых данных
        if (!selectedRoom || !selectedWorkplace || !startTime || !endTime) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        // Проверка корректности времени
        if (endTime <= startTime) {
            setError('Дата окончания должна быть позже даты начала');
            return;
        }

        try {
            await createBooking(selectedRoom.id, selectedWorkplace, startTime, endTime); // Запрос на создание бронирования
            setMessage('Бронирование успешно создано!');
            setError('');
            setSelectedRoom(null);
            setSelectedWorkplace(null);
            setStartTime('');
            setEndTime('');
            loadRoomAvailability(); // Обновляем доступные комнаты после бронирования
        } catch {
            setError('Ошибка при создании бронирования');
        }
    };

    return (
        <div>
            <h3>Доступные комнаты для офиса: {office.address}</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {/* Выбор комнаты */}
            <select onChange={handleRoomSelect} defaultValue="">
                <option value="" disabled>Выберите комнату</option>
                {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                        Комната {room.number} — Свободных мест: {room.available_workplaces}
                    </option>
                ))}
            </select>

            {/* Выбор рабочего места */}
            {selectedRoom && (
                <>
                    <select onChange={(e) => setSelectedWorkplace(Number(e.target.value))} defaultValue="">
                        <option value="" disabled>Выберите рабочее место</option>
                        {availableWorkplaces.map((workplace) => (
                            <option key={workplace} value={workplace}>
                                Рабочее место {workplace}
                            </option>
                        ))}
                    </select>

                    {/* Форма для указания времени бронирования */}
                    <form onSubmit={handleBookingSubmit}>
                        <label>Начало бронирования:</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />

                        <label>Конец бронирования:</label>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            min={startTime || undefined}
                        />

                        <button type="submit">Забронировать</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default BookingForm;