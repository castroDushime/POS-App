import AppCard from "../components/common/AppCard.jsx";
import {Link} from "react-router-dom";
import {Container} from "react-bootstrap";

function Settings() {
    return (

        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Settings
                    </li>
                </ol>
            </nav>
            <AppCard>

            </AppCard>
        </Container>
    );
}

export default Settings;