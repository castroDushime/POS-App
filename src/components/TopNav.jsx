import PropTypes from "prop-types";
import {AiOutlineMessage} from "react-icons/ai";
import {LuMail} from "react-icons/lu";
import {FaRegSquare} from "react-icons/fa";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {TbUserPlus} from "react-icons/tb";
import {Button, Dropdown, Modal} from "react-bootstrap";
import {BiMenuAltLeft} from "react-icons/bi";
import http from "../services/httpService.js";
import {useEffect, useState} from "react";
import axios from "axios";
import FormField from "./common/FormField.jsx";
import PasswordForm from "./common/PasswordForm.jsx";
import {toast} from "react-toastify";


export function TopNav({toggle, isOpen}) {
    const [profile, setProfile] = useState({});
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const fetchProfile = () => {
        axios.get('http://127.0.0.1:3000/api/auth/profile', {
            withCredentials: true, // Ensures that cookies are sent with the request
        }).then(({data}) => {
            console.log(data);
            setProfile(data);
        }).catch((error) => {
            console.log(error);
        });
    }
    useEffect(() => {
        fetchProfile();
    }, []);
    const handleChangePassword = (e) => {
        e.preventDefault();
       toast.success('Password changed successfully');
        handleClose();
    }

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
                                <input
                                    className="form-control focus:tw-ring-0 focus:tw-border-gray-200 border-start-0 me-2"
                                    type="search" placeholder="Search.."
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
                    <div className="d-flex justify-content-center align-items-center">
                        <div
                            className="rounded-circle d-flex justify-content-center text-white align-items-center fw-bold  border border-white border-3 bg-primary tw-h-12 tw-w-12">
                            POS
                        </div>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic" className="tw-bg-transparent border-0">
                                Dushime Eric
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="/admin/profile">profile</Dropdown.Item>
                                <Dropdown.Item onClick={handleShow} href="#/action-2">Change Password</Dropdown.Item>
                                <Dropdown.Item href="/">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

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
    toggle: PropTypes.func.isRequired, isOpen: PropTypes.bool.isRequired
}