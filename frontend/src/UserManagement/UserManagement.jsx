import { useState } from 'react';
import { createUser } from '../api';

function UserManagement() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Поле подтверждения пароля
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setMessage('Пароли не совпадают');
      return;
    }

    try {
      const response = await createUser(email, password);
      setMessage(response.message);
      setEmail('');
      setPassword('');
      setConfirmPassword(''); // Сброс поля подтверждения пароля
    } catch (err) {
      setMessage('Ошибка при создании пользователя');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Создание нового пользователя</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Пароль:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Подтвердите пароль:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Создать пользователя</button>
      </form>
      {message && <p style={{ color: 'red' }}>{message}</p>}
    </div>
  );
}

export default UserManagement;