import AppCard from "../components/common/AppCard.jsx";
import {Link} from "react-router-dom";
import {Card, CardBody, Container} from "react-bootstrap";
import FormField from "../components/common/FormField.jsx";
import {useEffect} from "react";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";

function Settings() {
    const {setActiveLinkGlobal} = useActiveLink();
    useEffect(() => {

        setActiveLinkGlobal("settings");
    }, [setActiveLinkGlobal]);
    return (

        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Settings
                    </li>
                </ol>
            </nav>
            <AppCard>
                <Card className="border-0">
                    <CardBody>
                        <form>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group mb-3">
                                        <label htmlFor="name" className="mb-2">Default Currency</label>
                                        <select className="form-select tw-py-3" id="currency">
                                            <option value="RWF">RWF</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group mb-3">
                                        <FormField label="Default Email" type="email" id="email"
                                                   placeholder="Enter default Email"/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group mb-3">
                                        <FormField label="Company Name" type="text" id="text"
                                                   placeholder="Company name"/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group mb-3">
                                        <FormField label="Company Phone" type="email" id="email"
                                                   placeholder="Company phone"/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group mb-3">
                                        <FormField label="Developed By" type="email" id="email"
                                                   placeholder="Developed By"/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group mb-3">
                                        <FormField label="Footer" isRequired={false} type="email" id="footer"
                                                   placeholder="Enter Footer"/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="form-group mb-3">
                                        <FormField label="Default Customer" isRequired={false} type="email" id="footer"
                                                   placeholder="Default Customer"/>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </AppCard>
        </Container>
    );
}

export default Settings;