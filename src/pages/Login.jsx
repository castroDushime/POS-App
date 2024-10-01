import React from 'react';
import {Col, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import Joi from "joi";
import {login} from "../services/authService.js";
import {toast} from "react-toastify";

const validationSchema = Joi.object({
    email: Joi.string().required().min(10).label('Phone'),
    password: Joi.string().required().label('Password'),
});

function Login() {
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/admin/dashboard');
        toast.success('Login SuccessFully', {
            theme: "colored", position: "top-right",
        });
    // let body = {
    //     email: formData.email,
    //     password: formData.password
    // }
    //     login(body).then((data) => {
    //         if (data.action === 1) {
    //
    //         }
    //     }).catch((error) => {
    //         console.log(error);
    //     });
    }
        return (
            <div className="d-flex align-items-center min-vh-100">
                <div className="container">
                    <Row>
                        <Col lg={7} xl={7}>
                            <div className="d-flex align-items-start justify-content-center flex-column">
                                <h1 className="text-white display-4 fw-bold text-center py-3">Welcome To POS</h1>
                                <h2 className="text-white text-center"></h2>
                                <h2 className="text-white text-center">Sign in to your account</h2>
                            </div>
                        </Col>
                        <Col lg={5} xl={5}>
                            <div className="">
                                <div className="card-body">
                                    <h1 className="text-primary text-center py-3">Sign In</h1>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="phone" className="form-label">Email</label>
                                            <input type="text"
                                                   onChange={handleChange}
                                                   value={formData.email}
                                                   className="form-control tw-py-3 focus:tw-ring-0" id="email"
                                                   name="email"/>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password"
                                                   className="form-label">Password</label>
                                            <input type="password"
                                                   value={formData.password}
                                                    onChange={handleChange}
                                                   className="form-control tw-py-3 focus:tw-ring-0 mb-5" id="password"
                                                   name="password"/>
                                        </div>
                                        <button type="submit"
                                                className="btn w-100 tw-py-3 text-white fw-bold btn-primary">Login
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

            </div>
        );
    }

    export default Login;