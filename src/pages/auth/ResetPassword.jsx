import React, {useState} from 'react';
import {Col, Row} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import Joi from "joi";
import FormField from "../../components/common/FormField.jsx";
import {toast} from "react-toastify";
import http from "../../services/httpService.js";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {BsArrowLeft} from "react-icons/bs";

const validationSchema = Joi.object({
    password: Joi.string().required().label('password'),
});

function ResetPassword() {
    const {id: token} = useParams();
    const [errors, setErrors] = React.useState({});
    const [submitting, setSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState({
        password: '',
    });
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };
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
            http.post(`/auth/reset-password/${token}`, {
                password: formData.password,
            }).then((res) => {
                let data = res.data;
                toast.success(data.message);
                if (data.action === 1) {
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setSubmitting(false);
                setFormData({
                    password: '',
                });
                // navigate('/login');
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
                            <h2 className="text-black text-center">Reset Your Password</h2>
                        </div>
                    </Col>
                    <Col lg={5} xl={5}>
                        <div className="">
                            <div className="card-body">
                                <h1 className="text-black text-center py-3">Reset Password</h1>
                                <p>
                                    Please enter your new password in the field below. Make sure it is at least 6
                                    characters long, includes both uppercase and lowercase letters, and contains at
                                    least one number and one special character.
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <div className="mb-3 tw-relative">
                                        <FormField
                                                label="Password"
                                                type={isVisible ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                error={errors.password}
                                            />
                                            <span
                                                className="tw-absolute tw-bottom-1 end-0 translate-middle-y me-3"
                                                onClick={toggleVisibility}
                                                style={{cursor: "pointer"}}
                                            >
                {isVisible ? <FaEyeSlash className="text-primary"/> : <FaEye className="text-primary"/>}
            </span>
                                        </div>
                                    </div>
                                    <button type="submit"
                                            className="btn w-100 tw-py-3 mb-3 text-white fw-bold btn-dark">
                                        Reset Password
                                        {
                                            submitting &&
                                            <span className="spinner-border spinner-border-sm ms-2" role="status"
                                                  aria-hidden="true"/>
                                        }
                                    </button>
                                </form>
                                <Link to={'/'} className="text-black py-3 text-decoration-none">Back to login
                                    <BsArrowLeft className="ms-2"/>
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

        </div>
    );
}

export default ResetPassword;