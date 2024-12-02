import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css';
import App from './App';
import './scss/styles.scss'
import {ToastContainer} from "react-toastify";
import PageLoader from "./Layouts/PageLoader.jsx";
import {ActiveLinkProvider} from "./providers/ActiveLinkProvider.jsx";
import {AuthProvider} from "./providers/AuthProvider.jsx";
import {ContentProvider} from "./providers/ContentProvider.jsx";
import ContentLoader from "./components/common/ContentLoader.jsx";
import _ from "lodash";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>

        <ActiveLinkProvider>
            <Router>
                <AuthProvider>
                    <ContentProvider>
                        <Suspense fallback={_.times(11, (i) => (
                            <div className="my-2" key={`place_${i}`}>
                                <ContentLoader/>
                            </div>
                        ))}>
                            <App/>
                        </Suspense>
                    </ContentProvider>
                </AuthProvider>
                <ToastContainer/>
            </Router>
        </ActiveLinkProvider>
    </React.StrictMode>
);