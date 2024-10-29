import PropTypes from "prop-types";
import { LuMail } from "react-icons/lu";
import { FaRegSquare } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { BiMenuAltLeft } from "react-icons/bi";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../providers/AuthProvider.jsx";
import PasswordForm from "./common/PasswordForm.jsx";
import http from "../services/httpService.js";

export function TopNav({ toggle, isOpen }) {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const { user } = useProfile(); // Access user from AuthProvider

    console.log(user);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleLogout = (e) => {
        e.preventDefault();
        http.post('/auth/logout').then(({ data }) => {
            if (data) {
                navigate("/");
            }
        }).catch((error) => {
            console.log(error);
        });
    };
    const handleChangePassword = (e) => {
        e.preventDefault();
        toast.success('Password changed successfully');
        handleClose();
    };

    return (
        <div className="">
            <nav className="navbar navbar-expand-lg bg-white border-bottom">
                <div className="container-fluid">
                    <div className="row  d-flex align-items-center">

                        <div className="col-2 col-lg-1 mb-2">
                            <button className="btn border-0" onClick={toggle}>
                                <BiMenuAltLeft className="tw-h-12 tw-w-8"/>
                            </button>
                        </div>
                        <div className="col-2 mb-2"><a className="navbar-brand tw-font-bold" href="#">POS App</a></div>
                        <div className="col-8 d-block d-lg-none">
                            <div className="d-flex d-lg-none mb-2 justify-content-end">

                                <div className="d-flex justify-content-center align-items-center">

                                    <Dropdown>
                                        <Dropdown.Toggle id="dropdown-basic" className="tw-bg-transparent border-0">
                                            {
                                                user?.user?.name
                                            }
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/admin/profile">
                                                <Link to="/admin/profile"
                                                      className="text-decoration-none text-black">Profile</Link>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={handleShow} href="#/action-2">Change
                                                Password</Dropdown.Item>
                                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 d-flex justify-content-end  mb-2">
                            <div className="collapse d-flex justify-content-center navbar-collapse"
                                 id="navbarSupportedContent">

                                <form className="d-flex align-items-center gap-2" role="search">
                                    <div className="input-group">
                                        <button className="btn border border-end-0" type="submit">
                                            <FaMagnifyingGlass/>
                                        </button>
                                        <input
                                            className="form-control focus:tw-ring-0 focus:tw-border-gray-200 border-start-0 me-2"
                                            type="search" placeholder="Search.."
                                            aria-label="Search"/>
                                    </div>
                                    <button className="btn btn-outline-secondary tw-border-gray-200 tw-border-2"
                                            type="submit">
                                        <LuMail/>
                                    </button>
                                    <button className="btn btn-outline-secondary tw-border-gray-200 tw-border-2"
                                            type="submit">
                                        <FaRegSquare/>
                                    </button>
                                </form>
                                <div>
                                    <div className="tw-relative d-none d-lg-block mx-2">
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
                        </div>
                    </div>

                    {/*<button className="navbar-toggler" type="button" data-bs-toggle="collapse"*/}
                    {/*        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"*/}
                    {/*        aria-expanded="false" aria-label="Toggle navigation">*/}
                    {/*    <span className="navbar-toggler-icon"></span>*/}
                    {/*</button>*/}

                    <div className="d-flex mb-2  justify-content-end">
                        <Link to={"/admin/pos"}
                              className="rounded-circle me-lg-3 btn btn-outline-primary d-flex justify-content-center align-items-center fw-bold border border-3 tw-h-12 tw-w-12">
                            POS
                        </Link>
                        <div className="d-none d-lg-flex justify-content-center align-items-center">
                            <div
                                className="rounded-circle d-flex justify-content-center text-white align-items-center fw-bold border border-white border-3 bg-primary tw-h-12 tw-w-12">
                                {
                                    user?.user?.name?.split(" ").map((n) => n[0]).join("")
                                }
                            </div>
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-basic" className="tw-bg-transparent border-0">
                                    {
                                        user?.user?.name
                                    }
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="/admin/profile">
                                        <Link to="/admin/profile"
                                              className="text-decoration-none text-black">Profile</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleShow} href="#/action-2">Change
                                        Password</Dropdown.Item>
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </nav>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PasswordForm />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" className="text-white" onClick={handleChangePassword}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

TopNav.propTypes = {
    toggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
};