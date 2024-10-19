import {Link} from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

export default function SideBarLink({icon, text, path, isActive = false}) {
    // const location = useLocation()
    return (<div className="text-white tw-text-sm  border-3 border-primary">
        <Link to={path}
              className={`text-decoration-none border-3 fw-bold text-muted  d-flex align-items-center px-3 mb-2 py-2  tw-text-sm d-block  rounded-0 hover:tw-bg-white hover:tw-bg-opacity-60 hover:tw-rounded-0 hover:tw-text-primary tw-transition tw-duration-300 tw-ease-in-out  ${isActive ? 'text-black bg-primary-subtle border-5 border-start border-primary rounded-2' : 'text-black'}`}>
            {React.createElement(icon, {className: "tw-h-6 tw-w-6 tw-inline-block text-muted fw-normal tw-mr-2"})}
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