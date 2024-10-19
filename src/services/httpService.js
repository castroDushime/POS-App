import axios from "axios";
import {toast} from "react-toastify";
import {jwtDecode} from "jwt-decode";
import {getCurrentUser, getJwt, logout} from "./authService.js";
import Cookies from "js-cookie";

const apiUrl = import.meta.env.VITE_APP_API_URL;
// const apiToken = import.meta.env.VITE_APP_API_TOKEN;

const http = axios.create({
    baseURL: apiUrl + '/api',
});

http.interceptors.request.use(config => {
    // let user = getCurrentUser();
    // // config.headers["api-token"] = apiToken;
    //
    // const jwt = getJwt();z
    // console.log("JWT Token:", jwt); // Debugging line
    config.withCredentials = true;

    // if (jwt) {
    //     config.headers.Authorization = `Bearer ${jwt}`;
    // }

    // try {
    //     let decodedToken = jwtDecode(jwt);// Debugging line
    //
    //     let exp = decodedToken.exp;
    //     let now = new Date().getTime() / 1000; // Debugging line
    //
    //     if (exp < now) {
    //         localStorage.setItem('attemptedUrl', window.location.href);
    //         logout();
    //         toast.error("Please login again.", {
    //             theme: "colored", position: "bottom-right",
    //         });
    //         window.location = "/";
    //     }
    // } catch (e) {
    //     console.error("Error decoding token:", e); // Debugging line
    //     return config;
    // }

    return config;
}, error => {
    return Promise.reject(error);
});
http.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;
    toast.dismiss();
    if (error.code === "ERR_NETWORK") {
        toast.error("Please check your internet connection.", {
            theme: "colored", position: "top-right",
        });
    } else if (error.response) {
        if (error.response.status === 401) {
            // window.location = "/";
            // logout();
            toast.error(error.response.data?.message+"Please login again.", {
                theme: "colored", position: "top-right",
            });
            let pathname = window.location.href;
            pathname = new URL(pathname).pathname;
            if (pathname === "/") {
                localStorage.setItem('attemptedUrl', pathname);
            }



        } else if (expectedError) {
            let data = error.response.data?.message ?? "An unexpected error occurred.";
            toast.error(data, {
                theme: "colored", position: "top-right",
            });
        } else {
            toast.error(error.response.status + ':' + error.response.data?.message, {
                theme: "colored", position: "top-right",
            });
        }
    } else {
        console.log('error.response is undefined or null');
        toast.error("An unexpected error occurred.", {
            theme: "colored", position: "top-right",
        });
    }

    return Promise.reject(error);
});

function setJwt(jwt) {
    http.defaults.headers.common.Authorization = `Bearer ${jwt}`;
}

let exports = {
    get: http.get, post: http.post, put: http.put, delete: http.delete, setJwt
};
export default exports;