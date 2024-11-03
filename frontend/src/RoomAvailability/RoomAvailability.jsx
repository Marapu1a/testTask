/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { getRoomAvailability, fetchOffices } from '../api';

function RoomAvailability({ onRoomSelect }) {
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadOffices = async () => {
            try {
                const data = await fetchOffices();
                setOffices(data);
                if (data.length > 0) {
                    setSelectedOffice(data[0].id); // По умолчанию выбираем первый офис
                }
            } catch (err) {
                setError('Не удалось загрузить список офисов', err);
            }
        };
        loadOffices();
    }, []);

    useEffect(() => {
        const fetchRoomAvailability = async () => {
            if (!selectedOffice) return;

            try {
                const data = await getRoomAvailability(selectedOffice);
                setRooms(data);
            } catch (err) {
                setError('Не удалось загрузить данные о доступности комнат', err);
            }
        };
        fetchRoomAvailability();
    }, [selectedOffice]);

    const handleOfficeChange = (e) => {
        setSelectedOffice(e.target.value);
    };

    return (
        <div>
            <h2>Доступность комнат</h2>
            {error && <p>{error}</p>}

            <label htmlFor="officeSelect">Выберите офис:</label>
            <select id="officeSelect" onChange={handleOfficeChange} value={selectedOffice || ''}>
                {offices.map((office) => (
                    <option key={office.id} value={office.id}>
                        {office.address}
                    </option>
                ))}
            </select>

            <ul>
                {rooms.map((room) => (
                    <li key={room.room_id} onClick={() => onRoomSelect(room.room_id)}>
                        <p>Комната {room.room_number}</p>
                        <p>Всего мест: {room.total_workplaces}</p>
                        <p>Занятых мест: {room.occupied_workplaces}</p>
                        <p>Свободных мест: {room.available_workplaces}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoomAvailability;