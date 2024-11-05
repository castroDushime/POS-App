import React, {useEffect, useState} from 'react';
import http from "../../services/httpService.js";
import AppCard from "../../components/common/AppCard.jsx";
import {Container, Dropdown, Row, Table} from "react-bootstrap";
import Th from "../common/Th.jsx";
import {format} from "date-fns";
import {Link} from "react-router-dom";
import AppPagination from "../common/AppPagination.jsx";
import FormField from "../common/FormField.jsx";
import {paginate} from "../common/paginate.jsx";

function SalesReport() {
    const hasFetched = React.useRef(false);
    const [branches, setBranches] = React.useState([]);
    const isPosUrl = location.pathname.includes('pos/history')
    const [currentPage, setCurrentPage] = useState(1);
    const [purchases, setPurchases] = useState([]);
    const [search, setSearch] = useState('');
    const pageSize = 10;
    const fetchBranches = () => {
        http.get("/branches")
            .then((response) => {
                setBranches(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const filterByBranch = (branchId) => {
        http.get(`/report/purchases?branchId=${branchId}`)
            .then((response) => {
                console.log(response.data);
                setPurchases(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const getPagedData = () => {
        let filtered = purchases;
        if (search) {
            filtered = filtered.filter((sale) =>
                (sale.reference.toLowerCase() || '').includes(search.toLowerCase()) ||
                (sale.status.toLowerCase() || '').includes(search.toLowerCase()) ||
                (sale.createdAt.toLowerCase() || '').includes(search.toLowerCase()) ||
                (sale.totalAmount.toLocaleString() || '').includes(search.toLowerCase()) ||
                (sale.supplier.name.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedSales} = getPagedData();
    const from = paginatedSales.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);
    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        if (!hasFetched.current) {
            fetchBranches();
            filterByBranch("");
            hasFetched.current = true;
        }
    }, []);
    return (
        <div className="card card-body border-0">
            <div className="d-flex mb-3 justify-content-between align-items-center flex-wrap">
                <div className="tw-w-80 mb-3">
                    <FormField type="text" isRequired={false}
                               value={search}
                               onChange={handleSearch}
                               placeholder="Search ..."/>
                </div>
                <div className="tw-w-80">
                    <select className="form-select tw-py-3" onChange={(e) => filterByBranch(e.target.value)}>
                        <option value="">All Branches</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="table-responsive">
                <Table hover responsive>
                    <thead
                        className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                        style={{borderRadius: "20"}}>
                    <Th column="Created At"/>

                    <Th column="Reference"/>
                    <Th column="Supplier"/>
                    <Th column="Total Amount"/>
                    <Th column="Status"/>
                    <Th column="Branch"/>
                    </thead>
                    <tbody>
                    {
                        paginatedSales.map((sale, index) => (
                            <tr className="" key={index}>
                                <td className="tw-text-xs py-3">{format(new Date(sale.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                <td className="tw-text-xs py-3">{sale.reference}</td>
                                <td className="tw-text-xs py-3">{sale?.supplier?.name}</td>
                                <td className="tw-text-xs py-3">Rwf {Number(sale.totalAmount).toLocaleString()}</td>
                                <td className="tw-text-xs py-3">
                                                <span
                                                    className={`badge ${sale.status === 'pending' ? 'bg-warning' : 'bg-success'} rounded-pill`}>{sale.status}</span>
                                </td>
                                <td className="tw-text-xs">{sale?.branch?.name}</td>
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
            </div>

        </div>
    );
}

export default SalesReport;