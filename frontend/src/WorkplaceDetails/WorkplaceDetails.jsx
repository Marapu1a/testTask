import { useState, useEffect } from 'react';
import { getActiveBookingsForWorkplace } from '../api';

/* eslint-disable react/prop-types */
function WorkplaceDetails({ workplace, onClose }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function loadBookings() {
      try {
        const bookingsData = await getActiveBookingsForWorkplace(workplace.id);
        console.log("Активные бронирования для рабочего места:", bookingsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Ошибка загрузки бронирований:", error);
      }
    }
    loadBookings();
  }, [workplace.id]);

  return (
    <div>
      <button onClick={onClose}>Назад</button>
      <h3>Детали рабочего места {workplace.number}</h3>
      
      <div>
        <h4>Активные бронирования:</h4>
        <ul>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <li key={booking.id}>
                {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}
                (Пользователь: {booking.user_email || 'неизвестен'})
              </li>
            ))
          ) : (
            <li>Активных бронирований не найдено</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default WorkplaceDetails;