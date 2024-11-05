import {Container, Table, Dropdown} from "react-bootstrap";
import {Link, useLocation} from "react-router-dom";
import Th from "../../components/common/Th.jsx";
import React, {useEffect, useState} from "react";
import {useActiveLink} from "../../providers/ActiveLinkProvider.jsx";
import FormField from "../../components/common/FormField.jsx";
import http from "../../services/httpService.js";
import ContentLoader from "react-content-loader";
import _ from "lodash";
import AppPagination from "../../components/common/AppPagination.jsx";
import {paginate} from "../../components/common/paginate.jsx";
import {format} from 'date-fns';
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import AppCard from "../../components/common/AppCard.jsx";

function Sales() {
    const location = useLocation();
    const isPosUrl = location.pathname.includes('pos/history')
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [search, setSearch] = useState('');
    const pageSize = 10;

    const handlePrint = (id) => {
        http.get(`/sales/show/${id}`).then((res) => {
            const sale = res.data;

            // HTML content for the print page
            const printContent = `
        <html>
            <head>
                <title>Sale Receipt</title>
                <!-- Tailwind CSS CDN link -->
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <link rel="stylesheet" href="../../scss/styles.scss">
                <link href="../../index.csss">
            </head>
            <body class="bg-gray-100 p-10">
                <div class="container mx-auto bg-white p-6 rounded shadow">
                    <div class="flex  justify-between items-center">
                    <img src="https://infypos-demo.nyc3.digitaloceanspaces.com/settings/337/logo-80.png" alt="logo" class="w-20 h-20"/>
                    <div class="mb-6">
                        <p><strong>Reference:</strong> ${sale.reference}</p>
                        <p><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
              
                    </div>
                    </div>
                    <div class="mb-6">
                        <h2 class="text-xl font-semibold">Customer Information</h2>
                        <p><strong>Name:</strong> ${sale.customer.name}</p>
                        <p><strong>Email:</strong> ${sale.customer.email}</p>
                        <p><strong>Phone:</strong> ${sale.customer.phone}</p>
                        <p><strong>Address:</strong> ${sale.customer.address}</p>
                    </div>
                    <div class="mt-6">
                        <table class="border-collapse border mb-4 border-gray-300 w-full">
                            <thead style="background-color: #46D5FF">
                            <tr>
                            <th class="border text-white border-gray-300 px-4 py-2">Product ID</th>
                            <th class="border text-white border-gray-300 px-4 py-2">Quantity</th>
                            <th class="border text-white border-gray-300 px-4 py-2">Price</th>
                            <th class="border text-white border-gray-300 px-4 py-2">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                                ${sale.items.map(item => `
                                    <tr>
                                        <td class="border border-gray-300 px-4 py-2">${item.product}</td>
                                        <td class="border border-gray-300 px-4 py-2">${item.quantity}</td>
                                        <td class="border border-gray-300 px-4 py-2">Rwf ${Number(item.price).toLocaleString()}</td>
                                        <td class="border border-gray-300 px-4 py-2">Rwf ${Number(item.amount).toLocaleString()}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div class="flex justify-end flex-col items-end">
                        <p><strong>Order Tax:</strong> Rwf ${sale.orderTAX}</p>
                        <p><strong>Discount:</strong> Rwf ${sale.discount}</p>
                        <p><strong>Shipping:</strong> Rwf ${sale.shipping}</p>
                        <p><strong>Total Amount:</strong> Rwf ${Number(sale.items.reduce((acc, item) => acc + item.amount, 0)).toLocaleString()}</p>
</div>
                    </div>
                </div>
            </body>
        </html>
        `;

            const printWindow = window.open("", "_blank");

            if (printWindow) {
                // Write the HTML content to the new tab
                printWindow.document.open();
                printWindow.document.write(printContent);
                printWindow.document.close();

                // Trigger print dialog once the content is loaded
                printWindow.onload = () => {
                    printWindow.print();
                    printWindow.onafterprint = () => {
                        printWindow.close();
                    };
                };
            }
        }).catch((error) => {
            console.log(error);
        });
    };
    const fetchSales = () => {
        setIsLoading(true);
        http.get("/sales")
            .then((res) => {
                let data = res.data;
                setPurchases(data);
            }).catch(() => {

        })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const handleShowModal = () => {
        window.location.href = isPosUrl ? '/pos' : '/create-sale';
    };
    const getPagedData = () => {
        let salesData = purchases.filter((sale) => sale.isPos === false);
        let posData = purchases.filter((sale) => sale.isPos === true);
        let filtered = isPosUrl ? posData : salesData;
        if (search) {
            filtered = filtered.filter((sale) =>
                (sale.reference.toLowerCase() || '').includes(search.toLowerCase()) ||
                (sale.status.toLowerCase() || '').includes(search.toLowerCase()) ||
                (sale.createdAt.toLowerCase() || '').includes(search.toLowerCase()) ||
                (sale.totalAmount.toLocaleString() || '').includes(search.toLowerCase()) ||
                (sale.customer.name.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedSales} = getPagedData();
    const from = paginatedSales.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
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
                        console.log(res);
                        toast.success(res.data.message);
                        fetchSales();
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


    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }

    useEffect(() => {
        fetchSales();
    }, []);
    useEffect(() => {

        setActiveLinkGlobal("sales");
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
                            {isPosUrl ? '  POS - History' : 'Sales'}
                        </li>
                    </ol>
                </nav>
                <h5 className="my-4"></h5>
                <div className="row">
                    <div className="col-12">
                        <AppCard>
                            <h5 className="card-title my-3">
                                {isPosUrl ? '  POS - History' : 'Sales'}
                            </h5>
                            <div className="d-flex mb-3 justify-content-between align-items-center">
                                <div className="col-lg-4 mb-2">
                                    <FormField type="text" isRequired={false}
                                               value={search}
                                               onChange={handleSearch}
                                               placeholder="Search ..."/>
                                </div>
                                <button className="btn tw-py-3 px-4 text-white btn-primary"
                                        onClick={handleShowModal}>
                                    Create
                                </button>
                            </div>
                            <Table hover responsive>
                                <thead
                                    className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                    style={{borderRadius: "20"}}>
                                <Th column="Created At"/>

                                <Th column="Reference"/>
                                <Th column="Customer"/>
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
                                    paginatedSales.map((sale, index) => (
                                        <tr key={index}>
                                            <td className="tw-text-xs">{format(new Date(sale.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                            <td className="tw-text-xs">{sale.reference}</td>
                                            <td className="tw-text-xs">{sale?.customer?.name}</td>
                                            <td className="tw-text-xs">Rwf {Number(sale.totalAmount).toLocaleString()}</td>
                                            <td className="tw-text-xs">
                                                <span
                                                    className={`badge ${sale.status === 'pending' ? 'bg-warning' : 'bg-success'} rounded-pill`}>{sale.status}</span>
                                            </td>
                                            <td className="tw-text-xs">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" className="tw-text-white"
                                                                     id="dropdown-basic">
                                                        options
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item>
                                                            {
                                                                isPosUrl ? <Link to={`/pos/${sale.id}`}
                                                                                 className="text-decoration-none">Edit</Link> :
                                                                    <Link to={`/create-purchase/${sale.id}`}
                                                                          className="text-decoration-none">Edit</Link>
                                                            }
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleDelete(sale.id)}>Delete</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handlePrint(sale.id)}>Print
                                                            Receipt</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                            {
                                !paginatedSales.length &&
                                <div className="text-center">
                                    <h3 className="text-muted">No data found</h3>
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
            </Container>
        }</div>

    );
}

export default Sales;