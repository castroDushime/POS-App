import http from "./httpService";
import {decryptData, encryptData} from "./cryptoService.js";


const tokenKey = 'token';
export function login(body) {
    return http.post(`/auth/login`, body)
        .then(({data}) => {
            if (data.action === 1) {
                const token = data.token;
                if (token) loginWithJwt(token);
                document.cookie = `token=${token}; path=/;`;
                setUser(data);

            }

            console.log(data);

            return data;
        });
}

let newToken = '';

export function changeInitialPassword(body, token) {
    newToken = token;
    return http.post(`/customer/registered/initial-change-password`, body, {
        headers: {
            'api-token': token
        }
    })
        .then(({data}) => {
            if (data.action === 1) {
                return data;
            } else {
                return Promise.reject(data);
            }
        });
}


export function verifyOtp(otpData) {
    return http.post(`/customer/registered/verify-otp`, otpData)
        .then(({data}) => {
            if (data.action === 1) {
                return data;
            } else {
                return Promise.reject(data);
            }
        });
}
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export function getToken(token) {
    return token;
}

export function resendOtp(customerId) {
    return http.post(`/customer/registered/resend-otp`, customerId).then(({data}) => {
        if (data.action === 1) {
            return data;
        } else {
            return Promise.reject(data);
        }
    })
}

export function loginWithJwt(token) {
    const encryptedToken = encryptData(token);
    localStorage.setItem(tokenKey, encryptedToken);
}

export function setUser(user) {
    const encryptedUser = encryptData(user);
    localStorage.setItem('user', encryptedUser);
}

export function logout() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem('user');
}


export function getCurrentUser() {
    const encryptedUser = localStorage.getItem('user');
    if (encryptedUser) {
        try {
            const user = decryptData(encryptedUser);
            if (user) {
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error( error);
            return null;
        }
    }
    return null;
}

export function isLoggedIn() {
    let user = getCurrentUser();
    return !!user;
}


export function generateOTP() {
    let user = getCurrentUser();
    let clientId = user.id;
    let body = {
        "client_id": clientId,
    };
    return http.post(`/generate-customer-otp`, body);
}

export function getJwt() {
    const encryptedToken = localStorage.getItem(tokenKey);
    if (encryptedToken) {
        return decryptData(encryptedToken);
    }
    return null;
}

let exports = {
    login,
    logout,
    getCurrentUser,
    loginWithJwt,
    getJwt,
    isLoggedIn,
    generateOTP,
    verifyOtp,
    resendOtp,
    changeInitialPassword
};
export default exports;

