import {createContext, useContext, useState} from 'react';
import PropTypes from "prop-types";

const ActiveLinkContext = createContext();

export const useActiveLink = () => {
    return useContext(ActiveLinkContext);
};

export const ActiveLinkProvider = ({children}) => {
    const [activeLink, setActiveLink] = useState('');

    const setActiveLinkGlobal = (link) => {
        setActiveLink(link);
    };

    return (
        <ActiveLinkContext.Provider value={{activeLink, setActiveLinkGlobal}}>
            {children}
        </ActiveLinkContext.Provider>
    );
};

ActiveLinkProvider.propTypes = {
    children: PropTypes.node
};