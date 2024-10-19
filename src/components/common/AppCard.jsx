import React from 'react';
import {Card, CardBody} from "react-bootstrap";
import PropTypes from "prop-types";

function AppCard({children}) {
    return (
        <Card className="min-vh-100 border-0 rounded-4 ">
            <CardBody>
                {children}
            </CardBody>
        </Card>
    );
}

AppCard.propTypes={
    children:PropTypes.any
}

export default AppCard;