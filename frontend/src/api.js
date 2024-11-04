import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Установка токена авторизации
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

// Обновление токена авторизации
export const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Refresh token отсутствует');
    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
    const newAccessToken = response.data.access;
    setAuthToken(newAccessToken);
    return newAccessToken;
};

// Логин пользователя
export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/token/`, { email, password });
    const { access, refresh } = response.data;
    setAuthToken(access);
    localStorage.setItem('refreshToken', refresh);
    return access;
};

// Получение списка офисов
export const fetchOffices = async () => {
    const response = await axios.get(`${API_URL}/offices/`);
    return response.data;
};

// Получение доступности комнат для офиса
export const getRoomAvailability = async (officeId) => {
    const response = await axios.get(`${API_URL}/bookings/room_availability/`, {
        params: { office: officeId },
    });
    return response.data;
};

// Создание бронирования
export const createBooking = async (roomId, workplaceId, startTime, endTime) => {
    const response = await axios.post(`${API_URL}/bookings/`, {
        room: roomId,
        workplace: workplaceId,
        start_time: startTime,
        end_time: endTime,
    });
    return response.data;
};

// Логаут пользователя
export const logoutUser = () => {
    setAuthToken(null);
    localStorage.removeItem('refreshToken');
};