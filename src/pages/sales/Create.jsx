import {useEffect} from "react";
import {Link} from "react-router-dom";
import { Container} from "react-bootstrap";
import {useActiveLink} from "../../providers/ActiveLinkProvider.jsx";
import PurchaseSalesForm from "../../components/PurchaseSalesForm.jsx";

function Create() {
    const {setActiveLinkGlobal} = useActiveLink();
    useEffect(() => {

        setActiveLinkGlobal("sales");
    }, [setActiveLinkGlobal]);

    return (
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item"><Link to="/sales">Sales</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Create Sale
                    </li>
                </ol>
            </nav>
            <PurchaseSalesForm/>
        </Container>
    );
}

export default Create;