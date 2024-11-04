import { useState, useEffect } from 'react';
import { setAuthToken, logoutUser } from '../api';
import Login from '../Login/Login';
import MainContent from '../MainContent/MainContent';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверка токена в localStorage при загрузке
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    setAuthToken(token);  // Устанавливаем токен в заголовки
    setIsAuthenticated(true);  // Обновляем состояние
  };

  const handleLogout = () => {
    logoutUser();  // Удаляем токен
    setIsAuthenticated(false);  // Сбрасываем авторизацию
  };

  return (
    <div>
      {isAuthenticated ? (
        <MainContent onLogout={handleLogout} />  // Основной контент для авторизованных пользователей
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
