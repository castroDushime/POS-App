import React, {useEffect} from 'react';
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import http from "../services/httpService.js";
import AppCard from "../components/common/AppCard.jsx";
import {Container} from "react-bootstrap";
import SalesReport from "../components/reports/SalesReport.jsx";
import PurchaseReport from "../components/reports/PurchaseReport.jsx";
import StockReport from "../components/reports/StockReport.jsx";

function Reports() {
    const {setActiveLinkGlobal} = useActiveLink();

    useEffect(() => {
        setActiveLinkGlobal("reports");
    }, [setActiveLinkGlobal]);
    return (
        <Container fluid={true}>
            <h1 className="p-3">Reports</h1>
            <AppCard>
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home"
                                aria-selected="true">Sales Report
                        </button>
                        <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile"
                                aria-selected="false">Purchase Report
                        </button>
                        <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact"
                                aria-selected="false">Stock Report
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel"
                         aria-labelledby="nav-home-tab" tabIndex="0">
                        <SalesReport/>
                    </div>
                    <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab"
                         tabIndex="0">
                        <PurchaseReport/>
                    </div>
                    <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab"
                         tabIndex="0">
                        <StockReport/>
                    </div>
                </div>
            </AppCard>
        </Container>
    );
}

export default Reports;