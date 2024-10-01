import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './App';
import './scss/styles.scss'
import {ToastContainer} from "react-toastify";
import PageLoader from "./Layouts/PageLoader.jsx";
import {ActiveLinkProvider} from "./providers/ActiveLinkProvider.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ActiveLinkProvider>
        <Router>
            <Suspense fallback={<PageLoader/>}>
                <App/>
            </Suspense>
            <ToastContainer/>
        </Router>
        </ActiveLinkProvider>
    </React.StrictMode>
);