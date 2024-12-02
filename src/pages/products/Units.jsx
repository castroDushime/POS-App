import {Container, Table, Modal, Button, Form, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import Th from "../../components/common/Th.jsx";
import {BsPlus} from "react-icons/bs";
import {useEffect, useState} from "react";
import {useActiveLink} from "../../providers/ActiveLinkProvider.jsx";
import FormField from "../../components/common/FormField.jsx";
import http from "../../services/httpService.js";
import AppPagination from "../../components/common/AppPagination.jsx";
import {paginate} from "../../components/common/paginate.jsx";
import {format} from 'date-fns';
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import {useContent} from "../../providers/ContentProvider.jsx";

function Units() {
    const {units, setUnits, fetchUnits} = useContent();
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const pageSize = 10;
    const [formData, setFormData] = useState({
        name: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUnitId, setSelectedUnitId] = useState(null);
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData({
            name: "",
        });
    };
    const getPagedData = () => {
        let filtered = units;
        if (search) {
            filtered = filtered.filter((brand) =>
                (brand.name.toLowerCase() || '').includes(search.toLowerCase()) ||
                (brand.createdAt.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedUnits} = getPagedData();
    const from = paginatedUnits.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            image: user.image
        });
        setSelectedUnitId(user.id);
        setIsEditMode(true);
        setShowModal(true);
    };


    const handleDelete = (unitId) => {
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
                http.delete(`/units/${unitId}`)
                    .then((res) => {
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: res.data.message,
                            icon: "success"
                        }).then(() => {
                            setUnits(units.filter((unit) => unit.id !== unitId));
                        });
                    }).catch((error) => {
                    console.log(error);
                    toast.error(error.response.data.message);
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
    const saveProduct = (e) => {
        e.preventDefault();
        const url = isEditMode ? `/units/${selectedUnitId}` : "/units";
        const method = isEditMode ? "put" : "post";
        http[method](url, {
            name: formData.name,
            code: formData.email,
            units: formData.phone,
            status: "pending",
            note: formData.address,
            supplierId: formData.supplier
        }).then((res) => {
            console.log(res);
            toast.success(res.data.message);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            handleCloseModal();
            fetchUnits();
        });
    }

    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }

    useEffect(() => {

        setActiveLinkGlobal("units");
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
                            Product units
                        </li>
                    </ol>
                </nav>
                <h5 className="my-4"></h5>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title my-3">All Product units</h5>
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
                                        Add Unit
                                    </button>
                                </div>
                                <Table hover responsive>
                                    <thead
                                        className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                        style={{borderRadius: "20"}}>
                                    <Th column="Created At"/>

                                    <Th column="Name"/>
                                    <th className="border-top-0 border-0 border border-primary cursor-pointer">
                                        <div
                                            className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                            <span>Action</span>
                                        </div>
                                    </th>
                                    </thead>
                                    <tbody>
                                    {
                                        paginatedUnits.map((brand, index) => (
                                            <tr key={index}>
                                                <td className="tw-text-xs">{format(new Date(brand.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                                <td className="tw-text-xs">{brand.name}</td>
                                                <td className="tw-text-xs">
                                                    <div className="d-flex justify-content-center">
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="primary" className="tw-text-white"
                                                                             id="dropdown-basic">
                                                                options
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                    onClick={() => handleEdit(brand)}>Edit</Dropdown.Item>
                                                                <Dropdown.Item
                                                                    onClick={() => handleDelete(brand.id)}>Delete</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                                <div className="align-items-center d-flex justify-content-between">
                                    <div>
                                        <span
                                            className="tw-text-gray-500">Showing {from} to {to} of {units?.length} entries</span>
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
                        <Modal.Title>{isEditMode ? "Edit Units" : "Add New Units"}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={saveProduct}>
                        <Modal.Body>

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <FormField label="Name" onChange={handleChange} value={formData.name}
                                                   name="name" id="name"/>
                                    </div>
                                </div>
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

export default Units;