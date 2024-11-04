import { useState } from 'react';
import { loginUser, setAuthToken } from '../api';

// eslint-disable-next-line react/prop-types
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Логиним пользователя и устанавливаем токен при успехе
      const token = await loginUser(email, password);
      setAuthToken(token);  // Устанавливаем токен в заголовки
      onLogin(token);  // Передаём родителю (App), что пользователь авторизован
      setError(null);  // Сбрасываем ошибку, если вход успешен
    } catch (err) {
      setError('Неверные данные для входа', err);
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Войти</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;