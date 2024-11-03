/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getRoomAvailability, createBooking } from '../api';

function BookingForm({ office }) {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedWorkplace, setSelectedWorkplace] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadRoomAvailability = async () => {
            try {
                const data = await getRoomAvailability(office.id);
                setRooms(data);
            } catch (err) {
                setError('Не удалось загрузить доступность комнат', err);
            }
        };
        loadRoomAvailability();
    }, [office]);

    const handleRoomSelect = (e) => {
        const roomId = e.target.value;
        const room = rooms.find((room) => room.room_id === Number(roomId));
        setSelectedRoom(room);
        setSelectedWorkplace(null); // Сбрасываем выбор рабочего места при смене комнаты
    };

    const handleWorkplaceSelect = (e) => {
        setSelectedWorkplace(e.target.value);
    };

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
        // Сбрасываем дату окончания, если выбрана новая дата начала
        if (endTime && e.target.value >= endTime) {
            setEndTime('');
        }
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRoom || !selectedWorkplace || !startTime || !endTime) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        if (endTime <= startTime) {
            setError('Дата окончания должна быть позже даты начала');
            return;
        }
        try {
            await createBooking(selectedRoom.room_id, selectedWorkplace, startTime, endTime);
            setMessage('Бронирование успешно создано!');
            setError('');
            setSelectedRoom(null);
            setSelectedWorkplace(null);
            setStartTime('');
            setEndTime('');
        } catch (err) {
            setError('Ошибка при создании бронирования', err);
        }
    };

    return (
        <div>
            <h3>Доступные комнаты для офиса: {office.address}</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <select onChange={handleRoomSelect} defaultValue="">
                <option value="" disabled>Выберите комнату</option>
                {rooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>
                        Комната {room.room_number} — Свободных мест: {room.available_workplaces}
                    </option>
                ))}
            </select>

            {selectedRoom && (
                <>
                    <select onChange={handleWorkplaceSelect} defaultValue="">
                        <option value="" disabled>Выберите рабочее место</option>
                        {Array.from({ length: selectedRoom.available_workplaces }, (_, i) => i + 1).map((workplace) => (
                            <option key={workplace} value={workplace}>
                                Рабочее место {workplace}
                            </option>
                        ))}
                    </select>
                    <form onSubmit={handleBookingSubmit}>
                        <label>Начало бронирования:</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={handleStartTimeChange}
                        />

                        <label>Конец бронирования:</label>
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            min={startTime || undefined} // Устанавливаем минимальное значение для endTime
                        />

                        <button type="submit">Забронировать</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default BookingForm;