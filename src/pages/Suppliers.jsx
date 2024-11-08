import {Container, Table, Modal, Button, Form, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import Th from "../components/common/Th.jsx";
import {BsPlus} from "react-icons/bs";
import {useEffect, useState} from "react";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import FormField from "../components/common/FormField.jsx";
import http from "../services/httpService.js";
import ContentLoader from "react-content-loader";
import _ from "lodash";
import AppPagination from "../components/common/AppPagination.jsx";
import {paginate} from "../components/common/paginate.jsx";
import {format} from 'date-fns';
import {toast} from "react-toastify";
import Swal from 'sweetalert2';


function Users() {
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const pageSize = 10;
    const [validations, setValidations] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchSuppliers = () => {
        setIsLoading(true);
        http.get("/suppliers")
            .then((res) => {
                console.log(res);
                let data = res.data;
                setUsers(data);
            }).catch(() => {

        })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
        });
    };
    const getPagedData = () => {
        let filtered = users;
        if (search) {
            filtered = filtered.filter((user) =>
                (user.name.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.email.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.phone.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.address.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.branch.name.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.user.name.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedUsers} = getPagedData();
    const from = paginatedUsers.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            password: ""
        });
        setSelectedUserId(user.id);
        setIsEditMode(true);
        setShowModal(true);
    };


    const handleDelete = (userId) => {
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
                http.delete(`/suppliers/${userId}`)
                    .then((res) => {
                        console.log(res);
                        toast.success(res.data.message);
                        fetchSuppliers();
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

    const saveUser = (e) => {
        e.preventDefault();
        const url = isEditMode ? `/suppliers/${selectedUserId}` : "/suppliers";
        const method = isEditMode ? "put" : "post";
        http[method](url, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
        }).then((res) => {
            console.log(res);
            toast.success(res.data.message);
        }).catch((error) => {
            console.log(error);
            setValidations(error?.response?.data?.errors);
        }).finally(() => {
            if (validations.length < 1) {
                handleCloseModal();
                fetchSuppliers();
            }
        });
    }

    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }

    useEffect(() => {
        fetchSuppliers();
    }, []);
    useEffect(() => {

        setActiveLinkGlobal("supp");
    }, [setActiveLinkGlobal]);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div>{
            isLoading ? (
                // Show loader while games are loading or while images are still being loaded
                _.times(6, (i) => (
                    <div className="my-2" key={`place_${i}`}>
                        <ContentLoader/>
                    </div>
                ))
            ) : <Container fluid={true}>
                <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Suppliers
                        </li>
                    </ol>
                </nav>
                <h5 className="my-4"></h5>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title my-3">All Suppliers</h5>
                                <div className="d-flex mb-3 justify-content-between align-items-center">
                                    <div className="col-lg-4 mb-2">
                                        <FormField type="text" isRequired={false}
                                                   value={search}
                                                   onChange={handleSearch}
                                                   placeholder="Search ..."/>
                                    </div>
                                    <button className="btn tw-py-3 px-4 text-white btn-primary"
                                            onClick={handleShowModal}>
                                        <BsPlus/>
                                        Add Supplier
                                    </button>
                                </div>
                                <Table hover responsive>
                                    <thead
                                        className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                        style={{borderRadius: "20"}}>
                                    <Th column="Created At"/>

                                    <Th column="Name"/>
                                    <Th column="Email"/>
                                    <Th column="Phone"/>
                                    <Th column="Address"/>
                                    <th className="border-top-0 border-0 border border-primary cursor-pointer">
                                        <div
                                            className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                            <span>Action</span>
                                        </div>
                                    </th>
                                    </thead>
                                    <tbody>
                                    {
                                        paginatedUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td className="tw-text-xs">{format(new Date(user.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                                <td className="tw-text-xs">{user.name}</td>
                                                <td className="tw-text-xs">{user.email}</td>
                                                <td className="tw-text-xs">{user.phone}</td>
                                                <td className="tw-text-xs">{user.address}</td>
                                                <td className="tw-text-xs">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" className="tw-text-white"
                                                                         id="dropdown-basic">
                                                            options
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item
                                                                onClick={() => handleEdit(user)}>Edit</Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => handleDelete(user.id)}>Delete</Dropdown.Item>
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
                                            className="tw-text-gray-500">Showing {from} to {to} of {users?.length} entries</span>
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
                        <Modal.Title>{isEditMode ? "Edit Supplier" : "Add New Supplier"}</Modal.Title>
                    </Modal.Header>
                    <Container className="py-2">
                        {
                            validations &&
                            <div className="alert alert-danger">{
                                validations && <ul>
                                    {
                                        validations.map((error, index) => (
                                            <li className="text-danger" key={index}>{error?.msg}</li>
                                        ))
                                    }
                                </ul>
                            }
                            </div>
                        }
                    </Container>
                    <Form onSubmit={saveUser}>
                        <Modal.Body>

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <FormField label="Name" onChange={handleChange} value={formData.name}
                                                   name="name" id="name"/>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <FormField label="Email" onChange={handleChange} value={formData.email}
                                                   name="email" id="email"/>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3">
                                <FormField label="Phone" name="phone" onChange={handleChange}
                                           value={formData.phone}
                                           id="phone"/>
                            </div>
                            <div className="mb-3">
                                <FormField label="Address" name="address" type="textarea" onChange={handleChange}
                                           value={formData.address}
                                           id="address"/>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" className="text-white">
                                Save
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        }</div>

    );
}

export default Users;