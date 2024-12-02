import React, {useState} from 'react';
import {Col, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import Joi from "joi";
import {useAuth} from "../../providers/AuthProvider.jsx";
import FormField from "../../components/common/FormField.jsx";
import {FaEye, FaEyeSlash} from "react-icons/fa";

const validationSchema = Joi.object({
    email: Joi.string().required().min(10).label('Phone'),
    password: Joi.string().required().label('Password'),
});

function Login() {
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    });
    const [isVisible, setIsVisible] = useState(false);


    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };
    const [errors, setErrors] = React.useState({});
    const [submitting, setSubmitting] = React.useState(false);
    const {login} = useAuth();
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({})
        const {error} = validationSchema.validate(formData, {abortEarly: false});
        if (error) {
            setErrors(error.details.reduce((errors, error) => {
                errors[error.path[0]] = error.message;
                return errors;
            }, {}));
        } else {
            setSubmitting(true);
            let body = {
                email: formData.email,
                password: formData.password
            }
            login(body).then((data) => {
                setSubmitting(false);
                if (data.action === 1) {
                    navigate('/dashboard');
                    window.location.reload();
                }
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setSubmitting(false);
            });
        }
    }
    return (
        <div className="d-flex align-items-center min-vh-100">
            <div className="container">
                <Row>
                    <Col lg={7} xl={7}>
                        <div className="d-flex align-items-start justify-content-center flex-column">
                            <h1 className="text-black display-4 fw-bold text-center py-3">Welcome To POS</h1>
                            <h2 className="text-black text-center"></h2>
                            <h2 className="text-black text-center">Sign in to your account</h2>
                        </div>
                    </Col>
                    <Col lg={5} xl={5}>
                        <div className="">
                            <div className="card-body">
                                <h1 className="text-black text-center py-3">Sign In</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <FormField type="text"
                                                   label="Email"
                                                   onChange={handleChange}
                                                   value={formData.email}
                                                   error={errors.email}
                                                   id="email"
                                                   name="email"/>
                                    </div>
                                    <div className="mb-3 tw-relative">
                                        <FormField type={isVisible ? "text" : "password"}
                                                   value={formData.password}
                                                   label="Password"
                                                   onChange={handleChange}
                                                   error={errors.password}
                                                   id="password"
                                                   name="password"/>
                                        <span
                                            className="tw-absolute tw-bottom-1 end-0 translate-middle-y me-3"
                                            onClick={toggleVisibility}
                                            style={{cursor: "pointer"}}
                                        >
                {isVisible ? <FaEyeSlash className="text-primary"/> : <FaEye className="text-primary"/>}
            </span>
                                    </div>
                                    <div className="d-flex  mb-4 justify-content-end">
                                        <Link to={'forgot-password'} className="text-black text-decoration-none">Forgot
                                            password?</Link>
                                    </div>
                                    <button type="submit"
                                            className="btn w-100 tw-py-3 text-white fw-bold btn-dark">
                                        Login
                                        {
                                            submitting &&
                                            <span className="spinner-border spinner-border-sm ms-2" role="status"
                                                  aria-hidden="true"/>
                                        }
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