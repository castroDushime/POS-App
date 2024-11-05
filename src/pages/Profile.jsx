import {Container, Row, Col, Card, Button, Spinner} from 'react-bootstrap';

import {Link} from "react-router-dom";
import FormField from "../components/common/FormField.jsx";
import {useProfile} from "../providers/AuthProvider.jsx";
import {useState} from "react";
import Joi from "joi";
import http from "../services/httpService.js";
import {toast} from "react-toastify";

const validationSchema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email({tlds: {allow: false}}).required().label("Email"),
    phone: Joi.string().required().label("Phone"),
});


const Profile = () => {
    const {user} = useProfile();
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.user?.name,
        email: user?.user?.email,
        phone: user?.user?.phone,
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }
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
            http.put('/auth/profile', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            }).then((res) => {
                setSubmitting(false);
                let data = res.data;

                if (data.action === 1) {

                    toast.success(res.data.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setSubmitting(false);
            });
        }
    }


    return (<Container fluid={true} className="min-vh-100">
        <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
            <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active" aria-current="page">
                    My Profile
                </li>
            </ol>
        </nav>
        <h5 className="my-4">
            My Profile
        </h5>
        {/*{*/}
        {/*    isLoading &&*/}
        {/*    <div className="d-flex justify-content-center align-items-center">*/}
        {/*        <Spinner animation="border" variant="primary"/>*/}
        {/*        Fetching profile info....*/}
        {/*    </div>*/}
        {/*}*/}
        {/*{*/}
        {/*    !isLoading && profile &&*/}
        {/*    */}
        {/*}*/}
        <Row className="">
            <Col lg={8}>
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-center align-items-center flex-column">
                            <div
                                className="d-flex align-items-center tw-text-2xl fw-semibold justify-content-center rounded-circle bg-primary-subtle text-primary border border-primary-subtle tw-h-40 tw-w-40">
                                {/*{initials}*/}
                                {
                                    user?.user?.name?.split(" ").map((n) => n[0]).join("")
                                }
                            </div>
                            <div className="text-center mt-3">
                                <h2>
                                    {
                                        user?.user?.name
                                    }
                                </h2>
                                <p className="text-muted">
                                    {
                                        user?.user?.role?.name
                                    }
                                </p>
                            </div>
                        </div>
                        <hr className="tw-border-dashed py-4"/>
                        <div className="row">
                            <div className="mb-3 col-lg-6">
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control" value={user?.user?.name?.split(" ")[0]}
                                       disabled/>
                            </div>
                            <div className="mb-3 col-lg-6">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control" value={user?.user?.name?.split(" ")[+1]}
                                       disabled/>
                            </div>
                        </div>
                        <div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="text" className="form-control" value={user?.user?.email} disabled/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Branch</label>
                                <input type="text" className="form-control" value={user?.user?.branch?.name} disabled/>
                            </div>
                        </div>

                    </Card.Body>
                </Card>
            </Col>
            <Col lg={4}>
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <h5>
                            Update Profile Form
                        </h5>
                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <FormField label="Name"
                                           value={formData.name}
                                           onChange={handleChange}
                                           error={errors.name}
                                           name="name"/>
                            </div>
                            <div className="mb-3">
                                <FormField value={formData.email}
                                           label="Email"
                                           error={errors.email}
                                           onChange={handleChange}
                                           name="email"/>
                            </div>
                            <div className="mb-3">
                                <FormField label="Phone"
                                           value={formData.phone}
                                           onChange={handleChange}
                                           error={errors.phone}
                                           name="phone"/>
                            </div>

                            <div className="mb-3">
                                <Button variant="primary" disabled={submitting} type="submit"

                                        className="text-white w-100 px-4 py-2">
                                    Update Profile
                                    {
                                        submitting && <Spinner className="ms-2" animation="border" size="sm"/>
                                    }
                                </Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>);
};

export default Profile;
