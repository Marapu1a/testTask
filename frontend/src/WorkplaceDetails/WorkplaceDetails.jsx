import { useEffect, useState } from 'react';
import { getActiveBookingsForWorkplace } from '../api';
import BookingForm from '../BookingForm/BookingForm';
import './WorkplaceDetails.css';

/* eslint-disable react/prop-types */
function WorkplaceDetails({ workplace, onClose }) {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem('userId'); // Загружаем userId из локального хранилища

  useEffect(() => {
    loadBookings();
  }, [workplace.id]);

  async function loadBookings() {
    try {
      const bookingsData = await getActiveBookingsForWorkplace(workplace.id);
      setBookings(bookingsData);
    } catch (error) {
      console.error("Ошибка загрузки бронирований:", error);
    }
  }

  return (
    <div className="details-container">
      <button onClick={onClose}>Назад</button>
      <h3>Детали рабочего места {workplace.number}</h3>
      
      <div>
        <h4>Активные бронирования:</h4>
        <ul className="bookings-list">
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

      {/* Форма бронирования */}
      <BookingForm 
        workplaceId={workplace.id} 
        userId={userId} 
        onBookingSuccess={loadBookings} // Обновление списка бронирований
      />
    </div>
  );
}

export default WorkplaceDetails;