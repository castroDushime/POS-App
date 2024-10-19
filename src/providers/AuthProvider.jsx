// src/providers/AuthProvider.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import http from "../services/httpService.js";
import { login as authLogin, logout as authLogout } from '../services/authService.js';

const AuthContext = createContext();

export const useProfile = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchUserProfile = () => {
        return http.get('/auth/profile')
            .then(({ data }) => {
                setUser(data);
                return data;
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
    };

    const login = (body) => {
        return authLogin(body)
            .then((data) => {
                return fetchUserProfile().then((profileData) => {
                    return { ...data, profile: profileData };
                });
            });
    };

    const logout = () => {
        setUser(null);
        authLogout();
        navigate("/", { replace: true });
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

AuthProvider.propTypes = {
    children: PropTypes.element.isRequired
};