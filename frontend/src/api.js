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
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении рабочих мест:', error);
        throw error;
    }
};

// Получение всех бронирований и фильтрация для конкретного рабочего места
export const getActiveBookingsForWorkplace = async (workplaceId) => {
    try {
        const response = await axios.get(`${API_URL}/bookings/`);
        const allBookings = response.data;

        const activeBookings = allBookings.filter(booking =>
            booking.workplace === workplaceId &&
            new Date(booking.end_time) > new Date()
        );

        return activeBookings;
    } catch (error) {
        console.error('Ошибка при получении бронирований:', error);
        throw error;
    }
};

// Получение информации о пользователе по ID
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}/`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении информации о пользователе:', error);
        throw error;
    }
};