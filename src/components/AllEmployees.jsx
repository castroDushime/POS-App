import React from 'react';
import {Table} from "react-bootstrap";
import Th from "./common/Th.jsx";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {BsDot} from "react-icons/bs";
import {LuEye} from "react-icons/lu";
import {TbDotsVertical} from "react-icons/tb";

const employees = [
    { id: 'TUR871219', name: 'John Doe', email: 'john.doe@example.com', role: 'Developer', department: 'Engineering', status: 'Full-time' },
    { id: 'TUR871103', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Designer', department: 'Head of Projects', status: 'Freelance' },
    { id: 'TUR871481', name: 'Sam Johnson', email: 'sam.johnson@example.com', role: 'Manager', department: 'Client & Team Work', status: 'Full-time' },
    // Add more employee objects as needed
];

function AllEmployees(props) {
    return (
        <div>
            <div className="card tw-border-gray-100 border-2">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <h4>All Employees</h4>

                        <div className="tw-flex tw-mb-4 tw-justify-between gap-2 ">
                            <div className="input-group ">
                                <button className="btn border border-end-0" type="submit">
                                    <FaMagnifyingGlass/>
                                </button>
                                <input className="form-control border-start-0  me-2" type="search" placeholder="Search.."
                                       aria-label="Search"/>

                            </div>
                            <select className="form-select">
                                <option>All Status</option>
                                <option>Full-time</option>
                                <option>Freelance</option>
                            </select>
                            <select className="form-select">
                                <option>All Role</option>
                                <option>Full-time</option>
                                <option>Freelance</option>
                            </select>
                            <button className="btn tw-bg-violet-600 w-100 text-white d-flex align-items-center ms-2">
                                Export Data
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <Table   hover responsive>
                            <thead className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded" style={{borderRadius:"20"}}>
                            <th className="  border-top-0 border-0  border  border-primary cursor-pointer">
                                <div
                                    className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-end h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                <span>
                                    <FormCheckInput type="checkbox"/>
                                </span>
                                </div>
                            </th>
                            <Th column="Employee ID"/>
                            <Th column="Employee Name"/>
                            <Th column="Email"/>
                            <Th column="Role"/>
                            <Th column="Departements"/>
                            <Th column="Status"/>
                            <th className="  border-top-0 border-0  border  border-primary cursor-pointer">
                                <div
                                    className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                <span>
                                    Action
                                </span>
                                </div>
                            </th>
                            </thead>
                            <tbody>
                            {employees.map(employee => (
                                <tr key={employee.id}>
                                    <td>
                                        <div
                                            className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-end h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                <span>
                                    <FormCheckInput type="checkbox"/>
                                </span>
                                        </div>
                                    </td>
                                    <td>{employee.id}</td>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.role}</td>
                                    <td>
                                        <span className="tw-border-gray-500 tw-border-2 tw-bg-gray-200 p-1  rounded">
                                            {employee.department}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={`btn btn-outline-${employee.status==='Freelance'?'warning':'info'}`}>
                                            <BsDot/>
                                            {employee.status}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn tw-border-gray-200 me-2">
                                            <LuEye/>
                                        </button>
                                        <button className="btn tw-border-gray-200">
                                            <TbDotsVertical/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllEmployees;