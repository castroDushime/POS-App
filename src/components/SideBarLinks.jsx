import {useLocation} from "react-router-dom";
import React from "react";
import {IconChevronRight} from "@tabler/icons-react";
import PropTypes from "prop-types";

export default function SideBarLinks({icon, text, children}) {
    useLocation();
    const [open, setOpen] = React.useState(false);
    const toggle = () => setOpen(!open);

    return (
        <div>
            <div
                className="text-black tw-text-lg fw-light tw-border-b tw-border-gray-200 tw-cursor-pointer">
                <div
                    onClick={toggle}
                    className={`text-decoration-none fw-light text-muted  d-flex align-items-center px-3  py-2  justify-content-between mx-1 tw-rounded-sm tw-text-lg d-block fw-normal hover:tw-bg-white hover:tw-text-primary  tw-transition  tw-ease-in-out ${open ? 'text-black bg-primary-subtle border-5 border-start border-primary ' : 'tw-text-gray-200'}`}>
                    <div>
                        {React.createElement(icon, {className: "tw-h-5 tw-w-5 text-muted fw-normal tw-inline-block tw-mr-2"})}
                        <span className="side-nav-text">{text}</span>
                    </div>
                    <IconChevronRight size={24}
                                      className={`tw-ml-auto tw-transition text-muted fw-normal tw-ease-in-out ${open ? 'tw-rotate-90' : ''}`}/>
                </div>
                {open && <div className="p-2 mx-2   tw-transition-all tw-delay-200 tw-ease-in-out">
                    {Array.isArray(children) ? <>{children}</> : children}
                </div>}
            </div>
        </div>
    );
}

SideBarLinks.propTypes = {
    icon: PropTypes.elementType.isRequired,
    text: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
}
