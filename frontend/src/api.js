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

// API запрос для бронирования
export const createBooking = async ({ workplace, user, start_time, end_time }) => {
    try {
        const response = await axios.post(`${API_URL}/bookings/`, {
            workplace,
            user,   // передаем userId
            start_time,
            end_time
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании бронирования:', error);
        throw error; // Ретранслируем ошибку для обработки в компоненте
    }
};

// API для получения userId по email
export const getUserByEmail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/users`); // получаем всех пользователей
        const users = response.data;

        // Ищем пользователя с нужным email
        const user = users.find((user) => user.email === email);

        if (user) {
            return user; // Возвращаем объект пользователя, если найден
        } else {
            throw new Error('Пользователь с таким email не найден');
        }
    } catch (error) {
        console.error('Ошибка при получении userId по email:', error);
        throw error;
    }
};