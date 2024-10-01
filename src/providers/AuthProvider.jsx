import {createContext, useContext, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useLocalStorage} from "../hooks/useLocalStorage.jsx";
import PropTypes from "prop-types";
import {logout as authLogout} from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();

    // call this function when you want to authenticate the user
    const login = async (data) => {
        setUserData(data);
        // Retrieve the stored attempted URL from local storage
  /*      const attemptedUrl = localStorage.getItem('attemptedUrl');
        if (attemptedUrl) {
            window.location = attemptedUrl;
            return;
        }*/
        navigate("/client/dashboard");
    };

    const setUserData = (data) => {
        setUser(data);
    }

    // call this function to sign out logged-in user
    const logout = () => {
        setUser(null);
        authLogout();
        navigate("/", {replace: true});
    };

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            setUserData
        }),
        [login, logout, user, setUserData]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
AuthProvider.prototype = {
    children: PropTypes.element
}