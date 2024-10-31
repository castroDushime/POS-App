import {Link} from "react-router-dom";

export function SubmenuLinks({text, path, isActive=false}) {
    return (
        <div>
            <Link to={path}
                  className={`text-decoration-none d-flex  tw-text-sm align-items-center py-2 px-4 tw-rounded-0 tw-group  d-block fw-normal  tw-transition-all tw-duration-300 tw-ease-in-out ${isActive ? 'text-black bg-primary-subtle border-5  rounded-2' : 'text-black'}`}>
                {/*{React.createElement(icon, {className: "tw-h-6 tw-w-6 tw-inline-block tw-mr-2"})}*/}
                <span
                    className="tw-h-2 tw-w-2 bg-primary-subtle rounded-circle me-1 tw-mb-0.5  group-hover:tw-bg-white"></span>
                <span className="side-nav-text">{text}</span>
            </Link>

        </div>
    )
}
