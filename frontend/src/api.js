import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Установка access-токена в заголовки
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

// Функция для обновления токена
export const refreshAuthToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
        try {
            const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
            const newAccessToken = response.data.access;
            setAuthToken(newAccessToken);  // Устанавливаем новый access-токен
            return newAccessToken;
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error);
            throw error;
        }
    } else {
        throw new Error('Refresh token отсутствует');
    }
};

// Функция для входа
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/token/`, { email, password });
        const { access, refresh } = response.data;
        setAuthToken(access);
        localStorage.setItem('refreshToken', refresh);
        return access;
    } catch (error) {
        console.error('Ошибка при входе:', error);
        throw error;
    }
};

// Получение списка офисов
export const fetchOffices = async () => {
    try {
        const response = await axios.get(`${API_URL}/offices/`);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await refreshAuthToken();
            const response = await axios.get(`${API_URL}/offices/`);
            return response.data;
        } else {
            console.error('Ошибка при получении списка офисов:', error);
            throw error;
        }
    }
};

// Получение доступности комнат
export const getRoomAvailability = async (officeId) => {
    try {
        const response = await axios.get(`${API_URL}/bookings/room_availability/`, {
            params: { office: officeId }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await refreshAuthToken();
            const response = await axios.get(`${API_URL}/bookings/room_availability/`, {
                params: { office: officeId }
            });
            return response.data;
        } else {
            console.error('Ошибка при получении доступности комнат:', error);
            throw error;
        }
    }
};

// Функция для создания пользователя
export const createUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/create-user/`, { email, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await refreshAuthToken();
            const response = await axios.post(`${API_URL}/create-user/`, { email, password });
            return response.data;
        }
        console.error('Ошибка при создании пользователя:', error);
        throw error;
    }
};

// Создание бронирования
export const createBooking = async (roomId, workplaceId, startTime, endTime) => {
    try {
        const response = await axios.post(`${API_URL}/bookings/`, {
            room: roomId,
            workplace: workplaceId,
            start_time: startTime,
            end_time: endTime
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            await refreshAuthToken();
            const response = await axios.post(`${API_URL}/bookings/`, {
                room: roomId,
                workplace: workplaceId,
                start_time: startTime,
                end_time: endTime
            });
            return response.data;
        }
        console.error('Ошибка при создании бронирования:', error);
        throw error;
    }
};

// Функция для выхода
export const logoutUser = () => {
    setAuthToken(null);
    localStorage.removeItem('refreshToken');
};