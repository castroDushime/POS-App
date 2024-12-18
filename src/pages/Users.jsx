import {Container, Table, Pagination, Modal, Button, Form, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import Th from "../components/common/Th.jsx";
import {BsPlus} from "react-icons/bs";
import {useEffect, useState} from "react";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import FormField from "../components/common/FormField.jsx";
import {FaAsterisk} from "react-icons/fa6";
import http from "../services/httpService.js";
import ContentLoader from "react-content-loader";
import _ from "lodash";
import AppPagination from "../components/common/AppPagination.jsx";
import {paginate} from "../components/common/paginate.jsx";
import {format} from 'date-fns';
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import Joi from "joi";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import {useContent} from "../providers/ContentProvider.jsx";

const validationSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().email({tlds: {allow: false}}).required(),
    phone: Joi.string().required().min(10).max(15),
    role: Joi.number().required(),
    branch: Joi.number().required(),
    password: Joi.string().allow("").min(8).max(20).required()
});

function Users() {
    const {users,setUsers,branches,roles,fetchUsers}=useContent();
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [search, setSearch] = useState('');
    const pageSize = 10;
    const [validations, setValidations] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        branch: "",
        password: ""
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({...errors, [e.target.name]: ""});
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData({
            name: "",
            email: "",
            phone: "",
            role: "",
            branch: "",
            password: ""
        });
    };
    const getPagedData = () => {
        let filtered = users;
        if (search) {
            filtered = filtered.filter((user) =>
                (user.name.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.email.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.phone.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.role.name.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.branch.name.toLowerCase() || '').includes(search.toLowerCase())
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
            role: user.roleId,
            branch: user.branchId,
            password: ""
        });
        setSelectedUserId(user.id);
        setIsEditMode(true);
        setShowModal(true);
        setErrors({...errors, name: "", email: "", phone: "", role: "", branch: "", password: ""})
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
                http.delete(`/users/${userId}`)
                    .then((res) => {
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: res.data.message,
                            icon: "success"
                        }).then(() => {
                            setUsers(users.filter((user) => user.id !== userId));
                        })
                    }).catch((error) => {
                    console.log(error);
                    toast.error("Error deleting user");
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
        setValidations("");
        setErrors({})
        const {error} = validationSchema.validate(formData, {abortEarly: false});
        if (error) {
            setErrors(error.details.reduce((errors, error) => {
                errors[error.path[0]] = error.message;
                return errors;

            }, {}));
        } else {
            const url = isEditMode ? `/users/${selectedUserId}` : "/users";
            const method = isEditMode ? "put" : "post";
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                roleId: formData.role,
                branchId: formData.branch,
            };
            if (formData.password) {
                payload.password = formData.password;
            }
            http[method](url, payload).then((res) => {
                toast.success(res.data.message);
                if (res.data.action === 1) {
                    handleCloseModal();
                    fetchUsers();
                }
            }).catch((error) => {
                console.log(error);
                setValidations(error?.response?.data?.errors);
            });
        }
    }

    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }
    useEffect(() => {

        setActiveLinkGlobal("user");
    }, [setActiveLinkGlobal]);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div>
            <Container fluid={true}>
                <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
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
                                        Add User
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

                <div className="mx-4">
                    <Modal show={showModal} size="lg" onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditMode ? "Edit User" : "Add New User"}</Modal.Title>
                        </Modal.Header>

                        <Form onSubmit={saveUser}>
                            <Modal.Body>
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
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <FormField label="Name"
                                                       error={errors?.name}
                                                       onChange={handleChange}
                                                       value={formData.name}
                                                       name="name" id="name"/>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <FormField label="Email"
                                                       error={errors?.email}
                                                       onChange={handleChange}
                                                       value={formData.email}
                                                       name="email" id="email"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className={`${isEditMode ? 'col-lg-12' : 'col-lg-6'}`}>
                                        <div className="mb-3">
                                            <FormField label="Phone"
                                                       name="phone"
                                                       error={errors?.phone}
                                                       onChange={handleChange}
                                                       value={formData.phone}
                                                       id="phone"/>
                                        </div>
                                    </div>
                                    {
                                        !isEditMode && <div className="col-lg-6">
                                            <div className="mb-3">
                                                <FormField label="Password" name="password" type="password"
                                                           onChange={handleChange}
                                                           value={formData.password}
                                                           error={errors?.password}
                                                           id="phone"/>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label">
                                        Role <FaAsterisk className="text-danger ms-1" size={10}/>
                                    </label>
                                    <select className={`form-select tw-py-3 ${errors?.role ? 'is-invalid' : ''}`} onChange={handleChange} name="role"
                                            value={formData.role} aria-label="Default select example">
                                        <option value="" disabled>Select Role</option>
                                        {
                                            roles.map((role, index) => (
                                                <option key={index} value={role.id}>{role.name}</option>
                                            ))
                                        }
                                    </select>
                                    <ErrorMessage error={errors?.role}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="branch" className="form-label">
                                        Branch <FaAsterisk className="text-danger ms-1" size={10}/>
                                    </label>
                                    <select className={`form-select tw-py-3 ${errors?.branch ? 'is-invalid' : ''}`} onChange={handleChange} name="branch"
                                            value={formData.branch} aria-label="Default select example">
                                        <option value="" disabled>Select Branch</option>
                                        {
                                            branches.map((branch, index) => (
                                                <option key={index} value={branch.id}>{branch.name}</option>
                                            ))
                                        }
                                    </select>
                                    <ErrorMessage error={errors?.branch}/>
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
                </div>
            </Container>
        </div>

    );
}

export default Users;