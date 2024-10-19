import React from 'react';
import {BiChevronDown, BiChevronUp} from "react-icons/bi";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";

function Th({column}) {
    return (
        <>
            <th  className="  border-top-0 border-0  border  border-primary cursor-pointer">
                <div className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-between mx-0 fw-normal tw-bg-opacity-70 pe-2">
                    <span>{column}</span>
                    {/*<div className="d-flex flex-column tw-text-gray-400 text-sm">*/}
                    {/*    <FaChevronUp/>*/}
                    {/*    <FaChevronDown/>*/}
                    {/*</div>*/}
                </div>
            </th>
        </>
    );
}

export default Th;