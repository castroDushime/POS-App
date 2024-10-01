import {Container, Row, Col, Card, Button, Spinner} from 'react-bootstrap';
// import {getCurrentUser, setUser} from "../../services/authService.js";
// import {useEffect, useState} from "react";
// import FormField from "../../components/common/FormField.jsx";
// import Joi from "joi";
import {Link} from "react-router-dom";
import FormField from "../components/common/FormField.jsx";
// import httpService from "../../services/httpService.js";
// import {toast} from "react-toastify";
// import {useAuth} from "../../providers/AuthProvider.jsx";

// const validationSchema = Joi.object({
//     name: Joi.string().required().label("Name"),
// });

const Profile = () => {
    // const auth = useAuth();
    // const user = getCurrentUser();
    // const [errors, setErrors] = useState({});
    // const [submitting, setSubmitting] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    // const [formData, setFormData] = useState({
    //     name: user.name,
    // });
    // const [profile, setProfile] = useState({});
    //
    // const handleChange = (e) => {
    //     setFormData({
    //         ...formData, [e.target.name]: e.target.value,
    //     });
    // }
    // const initials = user.name.split(" ").map((n) => n[0]).join("");
    //
    // const fetchProfile = () => {
    //     setIsLoading(true);
    //     httpService.get("/applicants/profile")
    //         .then((res) => {
    //             let data = res.data;
    //             setProfile(data);
    //             setFormData({
    //                 name: data.name,
    //             })
    //         }).catch(() => {
    //
    //     })
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // }
    // useEffect(() => {
    //     fetchProfile();
    // }, []);
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const {error} = validationSchema.validate(formData, {abortEarly: false});
    //     if (error) {
    //         const errors = {};
    //         for (let item of error.details) {
    //             errors[item.path[0]] = item.message;
    //         }
    //         setErrors(errors);
    //         return;
    //     }
    //     setSubmitting(true);
    //     httpService.put(`/applicants/update-profile?name=${formData.name}`).then(() => {
    //         toast("Profile updated successfully", {type: "success", theme: "colored"});
    //         auth.setUserData({...user, name: formData.name,phone: profile.phone,id: profile.id});
    //     }).catch(() => {
    //
    //     }).finally(() => {
    //         setSubmitting(false);
    //     });
    //
    // }

    return (<Container className="">
        <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
            <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
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
                            </div>
                            <div className="text-center mt-3">
                                <h2>
                                    Castro
                                </h2>
                                <p className="text-muted">
                                    Admin
                                </p>
                            </div>
                        </div>
                        <hr className="tw-border-dashed py-4"/>
                        <div className="row">
                                <div className="mb-3 col-lg-6">
                                    <label className="form-label">First Name</label>
                                    <input type="text" className="form-control" value="Dushimimana"
                                           disabled/>
                                </div>
                                <div className="mb-3 col-lg-6">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" className="form-control" value="Eric" disabled/>
                                </div>
                            </div>
                        <div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="text" className="form-control" value="dushimeeric26@gmail.com" disabled/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input type="text" className="form-control" value="0780007101" disabled/>
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
                        <form>
                            <div className="mb-3">
                                <FormField label="Email" name="name"/>
                            </div>
                            <div className="mb-3">
                                <FormField label="Name" name="name"/>
                            </div>
                            <div className="mb-3">
                                <FormField label="Phone" name="name"/>
                            </div>

                            <div className="mb-3">
                                <Button variant="primary" type="submit"

                                        className="text-white w-100 px-4 py-2">
                                    Update Profile
                                    {/*{*/}
                                    {/*    submitting && <Spinner className="ms-2" animation="border" size="sm"/>*/}
                                    {/*}*/}
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
