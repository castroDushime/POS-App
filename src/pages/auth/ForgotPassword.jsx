import React from 'react';
import {Col, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import Joi from "joi";
import FormField from "../../components/common/FormField.jsx";
import {toast} from "react-toastify";
import http from "../../services/httpService.js";
import {BsArrowLeft, BsArrowRight} from "react-icons/bs";

const validationSchema = Joi.object({
    email: Joi.string().required().email({tlds:{allow:false}}).label('email'),
});

function ForgotPassword() {
    const [errors, setErrors] = React.useState({});
    const [submitting, setSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
    });
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    }
    // const navigate = useNavigate();
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
            http.post('/auth/forgot-password', {
                email: formData.email,
            }).then((res) => {
                console.log(res);
                toast.success(res.data.message);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setSubmitting(false);
                setFormData({
                    email: '',
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
                                    Enter your email address associated with an account and we'll send you a link to reset your password.
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <FormField type="text"
                                                   label="Email"
                                                   onChange={handleChange}
                                                   value={formData.email}
                                                   error={errors.email} id="email"
                                                   name="email"/>
                                    </div>
                                    <button type="submit"
                                            className="btn w-100 mb-3 tw-py-3 text-white fw-bold btn-dark">
                                        Continue
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

export default ForgotPassword;