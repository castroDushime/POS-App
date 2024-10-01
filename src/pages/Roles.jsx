import {Container, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import Th from "../components/common/Th.jsx";
import FormCheckInput from "react-bootstrap/FormCheckInput";
import {BsDot} from "react-icons/bs";
import {LuEye} from "react-icons/lu";
import {TbDotsVertical} from "react-icons/tb";
import React, {useEffect} from "react";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";

const Permissions = [
    {
        id: 1,
        name: 'Manage Users',
    }, {
        id: 2,
        name: 'Manage Roles',
    },
    {
        id: 3,
        name: 'Manage Permissions',
    },
    {
        id: 4,
        name: 'Manage Branches',
    },
    {
        id: 5,
        name: 'Manage Categories',
    },
    {
        id: 6,
        name: 'Manage Sub Categories',
    },
    {
        id: 7,
        name: 'Manage Applications',
    },
    {
        id: 8,
        name: 'Manage Licenses',
    },
    {
        id: 9,
        name: 'Manage Health Facilities',
    },
    {
        id: 10,
        name: 'Manage Health Facility Sub Categories',
    },
    {
        id: 11,
        name: 'Manage Provinces',
    },
    {
        id: 12,
        name: 'Manage Districts',
    },
    {
        id: 13,
        name: 'Manage Sectors',
    },
    {
        id: 14,
        name: 'Manage Cells',
    },
    {
        id: 15,
        name: 'Manage Villages',
    },
    {
        id: 16,
        name: 'Manage Users',
    },
    {
        id: 17,
        name: 'Manage Roles',
    },
    {
        id: 18,
        name: 'Manage Permissions',
    },
    {
        id: 19,
        name: 'Manage Branches',
    },
    {
        id: 20,
        name: 'Manage Categories',
    },
    {
        id: 21,
        name: 'Manage Sub Categories',
    },
    {
        id: 22,
        name: 'Manage Brands',
    },
    {
        id: 23,
        name: 'Manage Licenses',
    },
    {
        id: 24,
        name: 'Manage Suppliers',
    },
    {
        id: 25,
        name: 'Manage Currency',
    },
    {
        id: 26,
        name: 'Manage Customers',
    }
]
const roles = [
    {
        id: 1,
        name: 'Admin',
        permissions: 5,
    }, {
        id: 2,
        name: 'Manager',
        permissions: 4,
    }, {
        id: 3,
        name: 'User',
        permissions: 3,
    }, {
        id: 4,
        name: 'Guest',
        permissions: 2,

    }]

function Roles() {
    const {setActiveLinkGlobal} = useActiveLink();
    useEffect(() => {
        setActiveLinkGlobal("roles");

    }, [setActiveLinkGlobal]);
    return (
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Roles and Permissions
                    </li>
                </ol>
            </nav>
            <h5 className="my-4">

            </h5>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title my-3">Roles and Permissions</h5>
                            <Table hover responsive>
                                <thead
                                    className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                    style={{borderRadius: "20"}}>

                                <Th column=" ID"/>
                                <Th column=" Name"/>
                                <Th column="Permissions"/>
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
                                {
                                    roles.map((role, index) => (
                                        <tr key={index}>
                                            <td>{role.id}</td>
                                            <td>{role.name}</td>
                                            <td>
                                                <div className="badge bg-primary">{role.permissions}</div>
                                            </td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <Link to={`/admin/roles/${role.id}`}
                                                          className="btn btn-sm btn-primary me-2">
                                                        <LuEye/>
                                                    </Link>
                                                    <Link to={`/admin/roles/${role.id}`}
                                                          className="btn btn-sm btn-primary">
                                                        <TbDotsVertical/>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default Roles;