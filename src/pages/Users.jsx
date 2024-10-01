import {Container, Table, Pagination, Modal, Button, Form, Col, Row, FormControl, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import Th from "../components/common/Th.jsx";
import { BsPlus} from "react-icons/bs";
import {LuEye} from "react-icons/lu";
import {TbDotsVertical} from "react-icons/tb";
import  {useEffect, useState} from "react";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import FormField from "../components/common/FormField.jsx";


const suppliers = [
    {
        id: 1,
        createdAt: "2021-09-01",
        name: "Mugabo Steven",
        email: "mugabo@gmail.com",
        phone: "0781234567",
        role: "Admin",

    },{
        id: 2,
        createdAt: "2021-09-01",
        name: "Rwanda Alex",
        email: "mugabo@gmail.com",
        phone: "0780007101",
        role: "Sales Manager",
    },{
        id: 3,
        createdAt: "2021-09-01",
        name: "Calim Mugabe",
        email: "calim@gmail.com",
        phone: "0780007101",
        role: "Branch Manager",
    }]

function Users() {
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newPermission, setNewPermission] = useState('');
    const itemsPerPage = 5;
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const handlePermissionChange = (e, permissionId) => {
        if (e.target.checked) {
            setSelectedPermissions([...selectedPermissions, permissionId]);
        } else {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
        }
    };

    useEffect(() => {
        setActiveLinkGlobal("user");
    }, [setActiveLinkGlobal]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentsuppliers = suppliers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(suppliers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
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

    return (
        <Container fluid={true}>
            <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Users
                    </li>
                </ol>
            </nav>
            <h5 className="my-4"></h5>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title my-3">All Users</h5>
                            <div className="d-flex mb-3 justify-content-between">
                                <div className="d-flex align-items-center">
                                    <input type="text" className="form-control focus:tw-ring-0 me-2" placeholder="Search"/>
                                </div>
                                <button className="btn text-white btn-primary" onClick={handleShowModal}>
                                    <BsPlus/>
                                    Add User
                                </button>
                            </div>
                            <Table hover responsive>
                                <thead
                                    className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                    style={{borderRadius: "20"}}>
                                <Th column="ID"/>
                                <Th column="Created At"/>

                                <Th column="Name"/>
                                <Th column="Email"/>
                                <Th column="Phone"/>
                                <Th column="Role"/>
                                <th className="border-top-0 border-0 border border-primary cursor-pointer">
                                    <div className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                        <span>Action</span>
                                    </div>
                                </th>
                                </thead>
                                <tbody>
                                {
                                    currentsuppliers.map((role, index) => (
                                        <tr key={index}>
                                            <td>{role.id}</td>
                                            <td>{role.createdAt}</td>
                                            <td>{role.name}</td>
                                            <td>{role.email}</td>
                                            <td>{role.phone}</td>
                                            <td>{role.role}</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <Dropdown>
                                                        <Dropdown.Toggle id="dropdown-button-dark-example1" className="tw-text-white" variant="primary">
                                                            Options
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item href="#/action-1" >
                                                                Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Item href="#/action-2">Delete</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>

                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                            <div className="d-flex my-2 justify-content-between">
                                <div>
                                    <p>Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {suppliers.length} entries</p>
                                </div>
                                <div>
                                    <Pagination>
                                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1}/>
                                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <Pagination.Item  key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}/>
                                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}/>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal}  onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="mb-3">
                            <FormField label="Name" name="name" id="name"/>
                        </div>
                        <div className="mb-3">
                            <FormField label="Email" name="email" id="email"/>
                        </div>
                        <div className="mb-3">
                            <FormField label="Phone" name="phone" id="phone"/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <FormControl as="textarea" placeholder="Address" aria-label="With textarea"/>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" className="text-white" onClick={handleAddPermission}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Users;