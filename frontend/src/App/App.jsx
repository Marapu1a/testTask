import { useState, useEffect } from 'react';
import { setAuthToken, logoutUser } from '../api';
import Login from '../Login/Login';
import MainContent from '../MainContent/MainContent';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // При загрузке компонента проверяем, есть ли токен в localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);  // Устанавливаем токен для авторизации
      setIsAuthenticated(true);  // Обновляем состояние авторизации
    }
  }, []);

    const handleLogin = (token) => {
        setAuthToken(token);
        setIsAuthenticated(true);
    };

  const handleLogout = () => {
    logoutUser();  // Очищаем токен из заголовков и localStorage
    setIsAuthenticated(false);  // Сбрасываем авторизацию
  };

  return (
    <div>
      {isAuthenticated ? (
        <MainContent onLogout={handleLogout} />  // Основной контент для авторизованных пользователей
      ) : (
        <Login onLogin={handleLogin} />  // Форма авторизации для неавторизованных пользователей
      )}
    </div>
  );
}

export default App;