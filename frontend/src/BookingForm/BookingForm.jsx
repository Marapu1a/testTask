import { useState, useEffect } from 'react';
import { createBooking, getUserByEmail } from '../api';
import './BookingForm.css';

/* eslint-disable react/prop-types */
function BookingForm({ workplaceId, onBookingSuccess }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUserId() {
      const email = localStorage.getItem('Email');
      try {
        const user = await getUserByEmail(email);
        setUserId(user.id);
      } catch (error) {
        console.error('Ошибка получения userId:', error);
      }
    }

    fetchUserId();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await createBooking({ 
        workplace: workplaceId, 
        user: userId, 
        start_time: startTime, 
        end_time: endTime 
      });
      onBookingSuccess();
      setError(null);
    } catch (err) {
      setError('Ошибка при создании бронирования');
      console.error(err);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleBooking}>
      <h4>Забронировать рабочее место</h4>
      <div>
        <label>Время начала:</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>
      <div>
        <label>Время окончания:</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <button type="submit">Забронировать</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default BookingForm;