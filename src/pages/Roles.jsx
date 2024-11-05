import {Container, Table, Pagination, Modal, Button, Form, Col, Row, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import Th from "../components/common/Th.jsx";
import {BsPlus} from "react-icons/bs";
import {LuEye} from "react-icons/lu";
import {TbDotsVertical} from "react-icons/tb";
import {useEffect, useState} from "react";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import http from "../services/httpService.js";
import {toast} from "react-toastify";
import {paginate} from "../components/common/paginate.jsx";
import AppPagination from "../components/common/AppPagination.jsx";
import FormField from "../components/common/FormField.jsx";
import Swal from "sweetalert2";
import {format} from "date-fns";

const Permissions = [
    {
        id: 1,
        name: 'Manage Users',
        value: 'manage-users'
    }, {
        id: 2,
        name: 'Manage Roles',
        value: 'manage-roles'
    },
    {
        id: 3,
        name: 'Manage Permissions',
        value: 'manage_permissions'
    },
    {
        id: 4,
        name: 'Manage Branches',
        value: 'manage-branches'
    },
    {
        id: 5,
        name: 'Manage Categories',
        value: 'manage-product-categories'
    },
    {
        id: 16,
        name: 'Manage Products',
        value: 'manage-products'
    },
    {
        id: 17,
        name: 'Manage Purchases',
        value: 'manage-purchases'
    },
    {
        id: 18,
        name: 'Manage Units',
        value: 'manage-units'
    },
    {
        id: 19,
        name: 'Manage Sales',
        value: 'manage-sales'
    },
    {
        id: 22,
        name: 'Manage Brands',
        value: 'manage-brands'
    },
    {
        id: 24,
        name: 'Manage Suppliers',
        value: 'manage-suppliers'
    },
    {
        id: 25,
        name: 'Manage Reports',
        value: 'manage-reports'
    },
    {
        id: 26,
        name: 'Manage Customers',
        value: 'manage-customers'
    }
]


function Roles() {
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newPermission, setNewPermission] = useState('');
    const pageSize = 10;
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState('');
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [modalPermissions, setModalPermissions] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        permissions: []
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleShowPermissionsModal = (permissions) => {
        if (Array.isArray(permissions)) {
            setModalPermissions(permissions);
        } else {
            setModalPermissions([]);
        }
        setShowPermissionsModal(true);
    };

    const fetchRoles = () => {
        http.get('/roles').then(({data}) => {
            setRoles(data);
        }).catch((error) => {
            console.log(error);
        });
    }
    const handleAddRole = (e) => {
        e.preventDefault();
        http.post('/roles', {
            name: formData.name,
            permissions: selectedPermissions
        }).then(({data}) => {
            setRoles([...roles, data]);
            handleCloseModal();
            toast.success(data.message);
        }).catch((error) => {
            console.log(error);
        });
    }
    const handleEdit = (role) => {
        setFormData({
            name: role.name,
            shortName:role.shortName
        });
        setSelectedRoleId(role.id);
        setIsEditMode(true);
        setShowModal(true);
    };

    const handlePermissionChange = (e, permissionId) => {
        if (e.target.checked) {
            setSelectedPermissions([...selectedPermissions, permissionId]);
        } else {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
        }
    };

    useEffect(() => {
        setActiveLinkGlobal("roles");
        fetchRoles();
    }, [setActiveLinkGlobal]);

    const getPagedData = () => {
        let filtered = roles;
        if (search) {
            filtered = filtered.filter((branch) =>
                (branch.name.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedRoles} = getPagedData();
    const from = paginatedRoles.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleDelete = (roleId) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-primary text-white me-2",
                cancelButton: "btn btn-danger me-2"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                http.delete(`/roles/${roleId}`)
                    .then((res) => {
                        console.log(res);
                        toast.success(res.data.message);
                        fetchRoles();
                    }).catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.message);
                });

                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your imaginary file is safe :)",
                    icon: "error"
                });
            }
        });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddPermission = () => {
        if (newPermission.trim()) {
            Permissions.push({ id: Permissions.length + 1, name: newPermission });
            setNewPermission('');
            handleCloseModal();
        }
    };
    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }

    return (
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Roles and Permissions
                    </li>
                </ol>
            </nav>
            <h5 className="my-4"></h5>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title my-3">Roles and Permissions</h5>
                            <div className="d-flex mb-3 justify-content-between align-items-center flex-wrap">
                                <div className="d-flex align-items-center">
                                    <div className="col-lg-12 mb-2">
                                        <FormField type="text" isRequired={false}
                                                   value={search}
                                                   onChange={handleSearch}
                                                   placeholder="Search ..."/>
                                    </div>
                                </div>
                                <button className="btn text-white btn-primary" onClick={handleShowModal}>
                                    <BsPlus/>
                                    Add Role
                                </button>
                            </div>
                            <Table hover responsive>
                            <thead
                                    className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                    style={{borderRadius: "20"}}>
                                <Th column="Created At"/>
                                <Th column="Name"/>
                                <th className="border-top-0 border-0 border border-primary cursor-pointer">
                                    <div className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                        <span>Action</span>
                                    </div>
                                </th>
                                </thead>
                                <tbody>
                                {
                                    paginatedRoles.map((role, index) => (
                                        <tr key={index}>
                                            <td className="">{format(new Date(role.createdAt), 'dd-MM-yyyy')}</td>
                                            <td className="">{role.name}</td>
                                            <td className="d-flex justify-content-center">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" className="tw-text-white"
                                                                     id="dropdown-basic">
                                                        options
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() => handleEdit(role)}>Edit</Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleDelete(role.id)}>Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                            <div className="align-items-center d-flex justify-content-between">
                                <div>
                                        <span
                                            className="tw-text-gray-500">Showing {from} to {to} of {roles?.length} entries</span>
                                </div>
                                <AppPagination
                                    total={totalCount}
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} size="lg" onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Role</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddRole}>
                    <Modal.Body>

                        <Form.Group controlId="formPermissionName" className="mb-3">
                            <label>Role Name</label>
                            <Form.Control
                                type="text"
                                placeholder="Enter role name"
                                value={formData.name}
                                name="name"
                                className="tw-py-3"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPermissions">
                            <label>Select Permissions</label>
                            <Row>
                                {Permissions.map((permission) => (
                                    <Col lg={4} key={permission.id}>
                                        <Form.Check
                                            key={permission.id}
                                            type="checkbox"
                                            label={permission.name}
                                            value={permission.value}
                                            onChange={(e) => handlePermissionChange(e, permission.value)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit" className="text-white" onClick={handleAddPermission}>
                        Add Role
                    </Button>
                </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={showPermissionsModal} onHide={() => setShowPermissionsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Permissions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {modalPermissions.map((permission, index) => (
                            <li key={index}>{permission.name}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPermissionsModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Roles;