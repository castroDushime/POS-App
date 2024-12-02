import {Container, Table,  Modal, Button, Form, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import Th from "../components/common/Th.jsx";
import {BsPlus} from "react-icons/bs";
import React, {useEffect, useState} from "react";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import FormField from "../components/common/FormField.jsx";
import http from "../services/httpService.js";
import AppPagination from "../components/common/AppPagination.jsx";
import {paginate} from "../components/common/paginate.jsx";
import {format} from 'date-fns';
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import Joi from "joi";
import {useContent} from "../providers/ContentProvider.jsx";


const validationSchema = Joi.object({
    name: Joi.string().required().label('Name'),
    shortName: Joi.string().required().label('Short Name')
});

function Branches() {
    const {branches,setBranches,fetchBranches} = useContent();
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [validations, setValidations] = useState("");
    const [search, setSearch] = useState('');
    const pageSize = 10;
    const [formData, setFormData] = useState({
        name: "",
        shortName: ""
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
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
            shortName: ""
        });
    };
    const getPagedData = () => {
        let filtered = branches;
        if (search) {
            filtered = filtered.filter((branch) =>
                (branch.name.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedBranches} = getPagedData();
    const from = paginatedBranches.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);

    const handleEdit = (branch) => {
        setFormData({
            name: branch.name,
            shortName: branch.shortName
        });
        setSelectedBranchId(branch.id);
        setIsEditMode(true);
        setShowModal(true);
    };


    const handleDelete = (branchId) => {
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
                http.delete(`/branches/${branchId}`)
                    .then((res) => {
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: res.data.message,
                            icon: "success"
                        }).then(() => {
                            setBranches(branches.filter((branch) => branch.id !== branchId));
                        });
                    }).catch((error) => {
                    toast.error(error.response.data.message);
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your Branch  is safe :)",
                    icon: "error"
                });
            }
        });
    };

    const saveBranch = (e) => {
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
            const url = isEditMode ? `/branches/${selectedBranchId}` : "/branches";
            const method = isEditMode ? "put" : "post";
            http[method](url, {
                name: formData.name,
                shortName: formData.shortName.toUpperCase()
            }).then((res) => {
                toast.success(res.data.message);
                console.log(res);
                if (res.data.action === 1) {
                    handleCloseModal();
                    setFormData({
                        name: "",
                        shortName: ""
                    });
                    fetchBranches();
                }
            }).catch((error) => {
                console.log(error);
                setValidations(error?.response?.data?.errors);
            }).finally(() => {

            });

        }
        if (validations === null) {
            handleCloseModal();
            setFormData({
                name: "",
                shortName: ""
            });
        }
    }
    console.log(validations);

    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }

    useEffect(() => {
        setActiveLinkGlobal("warehouses");
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
                            Branches
                        </li>
                    </ol>
                </nav>
                <h5 className="my-4"></h5>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title my-3">All Branches</h5>
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
                                        Add Branch
                                    </button>
                                </div>
                                <Table hover responsive>
                                    <thead
                                        className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                        style={{borderRadius: "20"}}>
                                    <Th column="Created At"/>

                                    <Th column="Name"/>
                                    <Th column="Short Name"/>
                                    <th className="border-top-0 border-0 border border-primary cursor-pointer">
                                        <div
                                            className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                            <span>Action</span>
                                        </div>
                                    </th>
                                    </thead>
                                    <tbody>
                                    {
                                        paginatedBranches.map((branch, index) => (
                                            <tr key={index}>
                                                <td className="tw-text-sm">{format(new Date(branch.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                                <td className="tw-text-sm">{branch.name}</td>
                                                <td className="tw-text-sm">{branch.shortName}</td>
                                                <td className="tw-text-sm">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" className="tw-text-white"
                                                                         id="dropdown-basic">
                                                            options
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item
                                                                onClick={() => handleEdit(branch)}>Edit</Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => handleDelete(branch.id)}>Delete</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                                {
                                    !paginatedBranches.length &&
                                    <div className="text-center">
                                        <h4 className="text-muted">No data found</h4>
                                    </div>
                                }
                                <div className="align-items-center d-flex justify-content-between">
                                    <div>
                                        <span
                                            className="tw-text-gray-500">Showing {from} to {to} of {branches?.length} entries</span>
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

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditMode ? "Edit Branch" : "Add New Branch"}</Modal.Title>
                    </Modal.Header>

                    <Form onSubmit={saveBranch}>
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
                            <div className="mb-3">
                                <FormField label="Name"
                                           onChange={handleChange}
                                           error={errors.name}
                                           value={formData.name}
                                           name="name" id="name"/>
                            </div>
                            <div className="mb-3">
                                <FormField label="Short Name"
                                           onChange={handleChange}
                                           error={errors.shortName}
                                           value={formData.shortName}
                                           name="shortName" id="shortName"/>
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
        </div>

    );
}

export default Branches;