import {Container, Table,Modal, Button, Form, Dropdown} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import Th from "../../components/common/Th.jsx";
import {BsPlus} from "react-icons/bs";
import {LuEye} from "react-icons/lu";
import {useEffect, useState} from "react";
import {useActiveLink} from "../../providers/ActiveLinkProvider.jsx";
import FormField from "../../components/common/FormField.jsx";
import {FaAsterisk} from "react-icons/fa6";
import http from "../../services/httpService.js";
import ContentLoader from "react-content-loader";
import _ from "lodash";
import AppPagination from "../../components/common/AppPagination.jsx";
import {paginate} from "../../components/common/paginate.jsx";
import {format} from 'date-fns';
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import AppCard from "../../components/common/AppCard.jsx";

function Purchase() {
    const {setActiveLinkGlobal} = useActiveLink();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [search, setSearch] = useState('');
    const pageSize = 10;
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);

    const fetchPurchases = () => {
        setIsLoading(true);
        http.get("/purchases")
            .then((res) => {
                console.log(res);
                let data = res.data;
                setPurchases(data);
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

    const handleShowModal = () => {
        window.location.href='/admin/create-purchase';
    };
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
        let filtered = purchases;
        if (search) {
            filtered = filtered.filter((purchase) =>
                (purchase.reference.toLowerCase() || '').includes(search.toLowerCase()) ||
                (purchase.status.toLowerCase() || '').includes(search.toLowerCase()) ||
                (purchase.createdAt.toLowerCase() || '').includes(search.toLowerCase()) ||
                (purchase.totalAmount.toLowerCase() || '').includes(search.toLowerCase()) ||
                (purchase.supplier.name.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedpurchases} = getPagedData();
    const from = paginatedpurchases.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);

    const handleEdit = (purchase) => {
        setFormData({
            name: purchase.name,
            email: purchase.email,
            phone: purchase.phone,
            address: purchase.address,
            password: ""
        });
        setSelectedPurchaseId(purchase.id);
        setIsEditMode(true);
        setShowModal(true);
    };


    const handleDelete = (purchaseId) => {
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
                http.delete(`/purchases/${purchaseId}`)
                    .then((res) => {
                        console.log(res);
                        toast.success(res.data.message);
                        fetchPurchases();
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

    const savepurchase = (e) => {
        e.preventDefault();
        const url = isEditMode ? `/purchases/${selectedPurchaseId}` : "/purchases";
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
        }).finally(() => {
            handleCloseModal();
            fetchPurchases();
        });
    }

    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }

    useEffect(() => {
        fetchPurchases();
    }, []);
    useEffect(() => {

        setActiveLinkGlobal("purchase");
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
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Purchase
                        </li>
                    </ol>
                </nav>
                <h5 className="my-4"></h5>
                <div className="row">
                    <div className="col-12">
                        <AppCard>
                            <h5 className="card-title my-3">Purchase</h5>
                            <div className="d-flex mb-3 justify-content-between align-items-center">
                                <div className="col-lg-4 mb-2">
                                    <FormField type="text" isRequired={false}
                                               value={search}
                                               onChange={handleSearch}
                                               placeholder="Search ..."/>
                                </div>
                                <button className="btn tw-py-3 px-4 text-white btn-primary"
                                        onClick={handleShowModal}>
                                    Create Purchase
                                </button>
                            </div>
                            <Table hover responsive>
                                <thead
                                    className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                    style={{borderRadius: "20"}}>
                                <Th column="Created At"/>

                                <Th column="Reference"/>
                                <Th column="Supplier"/>
                                <Th column="Total Amount"/>
                                <Th column="Status"/>
                                <th className="border-top-0 border-0 border border-primary cursor-pointer">
                                    <div
                                        className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                        <span>Action</span>
                                    </div>
                                </th>
                                </thead>
                                <tbody>
                                {
                                    paginatedpurchases.map((purchase, index) => (
                                        <tr key={index}>
                                            <td className="tw-text-xs">{format(new Date(purchase.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                            <td className="tw-text-xs">{purchase.reference}</td>
                                            <td className="tw-text-xs">{purchase?.supplier?.name}</td>
                                            <td className="tw-text-xs">Rwf {purchase.totalAmount}</td>
                                            <td className="tw-text-xs">
                                                <span
                                                    className={`badge ${purchase.status === 'pending' ? 'bg-warning' : 'bg-success'} rounded-pill`}>{purchase.status}</span>
                                            </td>
                                            <td className="tw-text-xs">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" className="tw-text-white"
                                                                     id="dropdown-basic">
                                                        options
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item>
                                                            <Link to={`/admin/create-purchase/${purchase.id}`} className="text-decoration-none">Edit</Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleDelete(purchase.id)}>Delete</Dropdown.Item>
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
                                            className="tw-text-gray-500">Showing {from} to {to} of {purchases?.length} entries</span>
                                </div>
                                <AppPagination
                                    total={totalCount}
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </AppCard>
                    </div>
                </div>

                <Modal show={showModal} size="lg" onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditMode ? "Edit Customer" : "Add New Customer"}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={savepurchase}>
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

export default Purchase;