import React from 'react';
import {Button} from "react-bootstrap";
import PropTypes from "prop-types";

function Td({children}) {
    return (
        <td className=" ">
            <div className="d-flex align-items-center justify-content-center">
                {children}
            </div>
        </td>
    );
}
Td.propTypes = {
    children: PropTypes.any,
};

export default Td;