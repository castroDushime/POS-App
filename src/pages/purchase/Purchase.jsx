import {Container, Table,Modal, Button, Form, Dropdown} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import Th from "../../components/common/Th.jsx";
import {BsPlus} from "react-icons/bs";
import {LuEye} from "react-icons/lu";
import React, {useEffect, useState} from "react";
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
import {useContent} from "../../providers/ContentProvider.jsx";

function Purchase() {
    const {purchases,setPurchases}=useContent();
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const handleShowModal = () => {
        window.location.href='/create-purchase';
    };
    const getPagedData = () => {
        let filtered = purchases;
        if (search) {
            filtered = filtered.filter((purchase) =>
                (purchase.reference.toLowerCase() || '').includes(search.toLowerCase()) ||
                (purchase.status.toLowerCase() || '').includes(search.toLowerCase()) ||
                (purchase.createdAt.toLowerCase() || '').includes(search.toLowerCase()) ||
                (purchase.totalAmount.toLocaleString() || '').includes(search.toLowerCase()) ||
                (purchase.supplier.name.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedPurchases} = getPagedData();
    const from = paginatedPurchases.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);


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
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: res.data.message,
                            icon: "success"
                        }).then(() => {
                            setPurchases(purchases.filter((p) => p.id!== purchaseId));
                        })
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
    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }

    useEffect(() => {

        setActiveLinkGlobal("purchase");
    }, [setActiveLinkGlobal]);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div><Container fluid={true}>
            <nav aria-label="breadcrumb" className="bg-light mb-3 px-3 py-2 rounded">
                <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
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
                                paginatedPurchases.map((purchase, index) => (
                                    <tr key={index}>
                                        <td className="tw-text-xs">{format(new Date(purchase.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                        <td className="tw-text-xs">{purchase.reference}</td>
                                        <td className="tw-text-xs">{purchase?.supplier?.name}</td>
                                        <td className="tw-text-xs">Rwf {Number(purchase.totalAmount).toLocaleString()}</td>
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
                                                        <Link to={`/create-purchase/${purchase.id}`} className="text-decoration-none">Edit</Link>
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
                        {
                            !paginatedPurchases.length && <div className="text-center">
                                <h4 className="text-muted">No data found</h4>
                            </div>
                        }
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
        </Container></div>

    );
}

export default Purchase;