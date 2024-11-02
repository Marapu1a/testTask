import axios from 'axios';

// Базовый URL для запросов
const API_URL = 'http://127.0.0.1:8000/api';

// Установка токена в заголовки
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Функция для входа (аутентификация пользователя)
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, { email, password });
    const token = response.data.access;  // Получаем access-токен из ответа
    setAuthToken(token);  // Сохраняем токен
    return token;  // Возвращаем токен, чтобы использовать его при входе
  } catch (error) {
    console.error('Ошибка при входе:', error);
    throw error;
  }
};

// Функция для выхода
export const logoutUser = () => {
  setAuthToken(null);  // Удаляем токен из заголовков и localStorage
};

// Пример запроса для получения списка офисов
export const getOffices = async () => {
  try {
    const response = await axios.get(`${API_URL}/offices/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении офисов:', error);
    throw error;
  }
};