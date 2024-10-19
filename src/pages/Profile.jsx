import {Container, Row, Col, Card, Button} from 'react-bootstrap';

import {Link} from "react-router-dom";
import FormField from "../components/common/FormField.jsx";
import {useProfile} from "../providers/AuthProvider.jsx";


const Profile = () => {
    const user = useProfile();



    return (<Container fluid={true} className="min-vh-100">
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
                                {
                                    user?.user?.name.split(" ").map((n) => n[0]).join("")
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
                                    <input type="text" className="form-control" value={user?.user?.name?.split(" ")[+1]} disabled/>
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
