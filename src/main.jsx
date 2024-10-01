import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './App';
import './scss/styles.scss'
import {ToastContainer} from "react-toastify";
import PageLoader from "./Layouts/PageLoader.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <Suspense fallback={<PageLoader/>}>
                <App/>
            </Suspense>
            <ToastContainer/>
        </Router>
    </React.StrictMode>
);