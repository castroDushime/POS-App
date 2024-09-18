import PropTypes from "prop-types";
import {AiOutlineMessage} from "react-icons/ai";
import {LuMail} from "react-icons/lu";
import {FaRegSquare} from "react-icons/fa";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {TbUserPlus} from "react-icons/tb";
import {Button} from "react-bootstrap";
import {BiMenuAltLeft} from "react-icons/bi";


export function TopNav({toggle, isOpen}) {

    return (
        <div className="d-none d-lg-block">
            <nav className="navbar navbar-expand-lg bg-white border-bottom">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-10">
                            <button className="btn " onClick={toggle}>
                                <BiMenuAltLeft/>
                            </button>
                        </div>
                    </div>
                    <a className="navbar-brand tw-font-bold" href="#">Dashboard</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse   d-flex justify-content-center navbar-collapse"
                         id="navbarSupportedContent">

                        <form className="d-flex align-items-center gap-2" role="search">
                            <div className="input-group">
                                <button className="btn border border-end-0" type="submit">
                                    <FaMagnifyingGlass/>
                                </button>
                                <input className="form-control border-start-0 me-2" type="search" placeholder="Search.."
                                       aria-label="Search"/>

                            </div>
                            <button className="btn btn-outline-secondary  tw-border-gray-200 tw-border-2" type="submit">
                                <LuMail/>
                            </button>
                            <button className="btn btn-outline-secondary  tw-border-gray-200 tw-border-2" type="submit">
                                <FaRegSquare/>
                            </button>
                        </form>
                        <div>
                            <div className="tw-relative  mx-2">
                                <div
                                    className="rounded-circle tw-absolute -tw-top-6 border border-white border-3 bg-danger-subtle tw-h-11 tw-w-11">
                                </div>
                                <div
                                    className="rounded-circle tw-absolute -tw-top-6 tw-left-6 border border-white border-3 tw-bg-violet-100 tw-h-11 tw-w-11">
                                </div>
                                <div
                                    className="rounded-circle tw-absolute -tw-top-6 tw-left-12 tw-bg-violet-200 border border-white border-3 tw-h-11 tw-w-11">
                                </div>
                                <div
                                    className="rounded-circle tw-absolute -tw-top-6 tw-left-20 tw-bg-gray-100 border border-white border-3 tw-h-11 tw-w-11">
                                </div>
                            </div>
                        </div>

                    </div>
                    <button className="btn btn-outline-secondary">
                        <TbUserPlus/>
                        Invite
                    </button>


                </div>
            </nav>
        </div>

    );
}

TopNav.propTypes = {
    toggle: PropTypes.func.isRequired, isOpen: PropTypes.bool.isRequired
}