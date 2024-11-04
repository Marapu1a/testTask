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
    const token = response.data.access;
    setAuthToken(token);
    return token;
  } catch (error) {
    console.error('Ошибка при входе:', error);
    throw error;
  }
};

// Функция для выхода
export const logoutUser = () => {
  setAuthToken(null);
};

// Получение списка офисов
export const getOffices = async () => {
  try {
    const response = await axios.get(`${API_URL}/offices/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении офисов:', error);
    throw error;
  }
};

// Получение списка комнат для выбранного офиса
export const getRooms = async (officeId) => {
  try {
    const response = await axios.get(`${API_URL}/get_rooms/${officeId}/`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении комнат:', error);
    throw error;
  }
};

// Получение всех рабочих мест для выбранной комнаты (включая занятые и свободные)
export const getWorkplaces = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/get_workplaces/${roomId}/`);
    console.log("API Ответ для рабочих мест:", response.data);  // Отладка ответа от API
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении рабочих мест:', error);
    throw error;
  }
};