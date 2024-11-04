import { useState, useEffect } from 'react';
import { setAuthToken, logoutUser } from '../api';
import Login from '../Login/Login';
import MainContent from '../MainContent/MainContent';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (token) => {
        setAuthToken(token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        logoutUser();
        setIsAuthenticated(false);
    };

    return (
        <div>
            {isAuthenticated ? (
                <MainContent onLogout={handleLogout} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;