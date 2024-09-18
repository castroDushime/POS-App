import {Link} from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

export default function SideBarLink({icon, text, path, isActive = false}) {
    // const location = useLocation()
    return (<div className="text-white tw-text-sm tw-font-semibold tw-border-b tw-border-gray-200">
        <Link to={path}
              className={`text-decoration-none d-flex align-items-center px-3 mb-2 py-2  tw-text-sm d-block fw-semibold rounded-0 hover:tw-bg-white hover:tw-bg-opacity-60 hover:tw-rounded-0 hover:tw-text-primary tw-transition tw-duration-300 tw-ease-in-out  ${isActive ? 'text-primary bg-white rounded-0' : 'text-black'}`}>
            {React.createElement(icon, {className: "tw-h-6 tw-w-6 tw-inline-block tw-mr-2"})}
            <span className="side-nav-text">{text}</span>
        </Link>
    </div>);
}

SideBarLink.propTypes = {
    icon: PropTypes.elementType.isRequired,
    text: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    isActive: PropTypes.bool
}