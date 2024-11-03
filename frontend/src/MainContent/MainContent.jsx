/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { fetchOffices } from '../api';
import BookingForm from '../BookingForm/BookingForm';

function MainContent({ onLogout }) {
  const [offices, setOffices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOffices = async () => {
      try {
        const data = await fetchOffices();
        setOffices(data);
      } catch (err) {
        setError('Не удалось загрузить офисы', err);
      }
    };
    loadOffices();
  }, []);

  const handleOfficeSelect = (e) => {
    const officeId = e.target.value;
    const office = offices.find((office) => office.id === Number(officeId));
    setSelectedOffice(office);
  };

  return (
    <div>
      <h2>Выберите офис</h2>
      {error && <p>{error}</p>}
      <select onChange={handleOfficeSelect} defaultValue="">
        <option value="" disabled>Выберите офис</option>
        {offices.map((office) => (
          <option key={office.id} value={office.id}>
            {office.address}
          </option>
        ))}
      </select>
      <button onClick={onLogout}>Выйти</button>

      {selectedOffice && <BookingForm office={selectedOffice} />}
    </div>
  );
}

export default MainContent;