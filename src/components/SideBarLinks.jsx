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
                className="text-black tw-text-sm tw-font-semibold tw-border-b tw-border-gray-200 tw-cursor-pointer">
                <div
                    onClick={toggle}
                    className={`text-decoration-none text-black d-flex align-items-center p-2 justify-content-between mx-2 tw-rounded-sm tw-text-sm d-block fw-normal hover:tw-bg-white hover:tw-text-primary  tw-transition  tw-ease-in-out ${open ? 'text-black bg-primary-subtle border-5 border-start border-primary ' : 'tw-text-gray-200'}`}>
                    <div>
                        {React.createElement(icon, {className: "tw-h-6 tw-w-6 tw-inline-block tw-mr-2"})}
                        <span className="side-nav-text">{text}</span>
                    </div>
                    <IconChevronRight size={24}
                                      className={`tw-ml-auto tw-transition tw-ease-in-out ${open ? 'tw-rotate-90' : ''}`}/>
                </div>
                {open && <div className="p-2 mx-2  tw-transition-all tw-delay-200 tw-ease-in-out">
                    {children}
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
