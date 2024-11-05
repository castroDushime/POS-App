import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import FormField from "./common/FormField.jsx";
import {FaAsterisk} from "react-icons/fa6";
import Select from "react-select";
import Th from "./common/Th.jsx";
import {BiTrash} from "react-icons/bi";
import http from "../services/httpService.js";
import AppCard from "./common/AppCard.jsx";
import {useProfile} from "../providers/AuthProvider.jsx";
import {useLocation, useParams} from 'react-router-dom';
import {AiOutlinePlus} from "react-icons/ai";
import {IoIosSave} from "react-icons/io";
import {toast} from "react-toastify";
import {format} from "date-fns";
import Td from "./common/Td.jsx";

function PurchaseSalesForm() {
    const {user} = useProfile();
    const {id} = useParams();
    const location = useLocation();
    const isCreatePurchase = location.pathname.includes('/create-purchase');
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplierLabel, setSelectedSupplierLabel] = useState('');
    const [formData, setFormData] = useState({
        date: '',
        supplierId: '',
        status: 'pending',
        orderTAX: '',
        discount: '',
        shipping: '',
        note: '',
        customerId: '',
        items: []
    });
    const [tableRows, setTableRows] = useState([]);

    const fetchProducts = () => {
        http.get("/products")
            .then((res) => {
                let data = res.data;
                setProducts(data);
            }).catch(() => {
        }).finally(() => {
        });
    }
    const url = isCreatePurchase ? `/purchases/show/${id}` : `/sales/show/${id}`;
    const fetchPurchase = () => {
        http.get(url)
            .then((res) => {
                const data = res.data;
                setFormData({
                    date: data.date,
                    [isCreatePurchase ? 'supplierId' : 'customerId']: isCreatePurchase ? data.supplierId : data.customerId,
                    status: data.status,
                    orderTAX: data.orderTAX,
                    discount: data.discount,
                    shipping: data.shipping,
                    note: data.note,
                    items: data.items
                });
                setTableRows(data.items.map(item => ({
                    product: item.productName,
                    productId: item.productId,
                    netUnitPrice: item.price,
                    qty: item.quantity,
                    discount: item.discount,
                    tax: item.tax,
                    subTotal: item.amount
                })));
            }).catch(() => {
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = tableRows.map(row => ({
            productId: row.productId,
            price: row.netUnitPrice,
            quantity: row.qty,
            amount: row.subTotal
        }));
        const salesUrl = id ? `/sales/${id}` : "/sales";
        const purchaseUrl = id ? `/purchases/${id}` : "/purchases";
        const url = isCreatePurchase ? purchaseUrl : salesUrl;
        const method = id ? "put" : "post";
        http[method](url, {
            date: formData.date,
            [isCreatePurchase ? 'supplierId' : 'customerId']: isCreatePurchase ? formData.supplierId : formData.customerId,
            status: formData.status,
            orderTAX: Number(formData.orderTAX),
            discount: Number(formData.discount),
            shipping: Number(formData.shipping),
            note: formData.note,
            items: submitData,
            isPos: false
        }).then(({data}) => {
            toast.success(data.message)
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setTableRows([]);
            setFormData({
                date: '',
                [isCreatePurchase ? 'supplierId' : 'customerId']: '',
                status: 'pending',
                orderTAX: '',
                discount: '',
                shipping: '',
                note: '',
                items: []
            });
        });
    };

    const fetchCustomers = () => {
        http.get("/customers")
            .then((res) => {
                let data = res.data;
                setCustomers(data);
            }).catch(() => {
        }).finally(() => {
        });
    }
    const fetchSuppliers = () => {
        http.get("/suppliers")
            .then((res) => {
                let data = res.data;
                setSuppliers(data);
            }).catch(() => {
        }).finally(() => {
        });
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleChangeCustomer = (selectedOption) => {
        setFormData({
            ...formData,
            customerId: selectedOption.value,
        });
        setSelectedSupplierLabel(selectedOption.label);
    }
    const handleChangeSupplier = (selectedOption) => {
        setFormData({
            ...formData,
            supplierId: selectedOption.value
        });
    }


    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            const product = products.find(product => product.id === selectedOption.value);
            const productExists = tableRows.some(row => row.productId === selectedOption.value);
            if (!productExists){
                const netUnitPrice = product.price;
                const qty = 1; // Default quantity
                const newRow = {
                    product: selectedOption.label,
                    productId: selectedOption.value,
                    netUnitPrice: netUnitPrice,
                    qty: qty,
                    tax: '10', // Dummy data
                    subTotal: netUnitPrice * qty // Calculate subTotal
                };
                setTableRows(prevRows => [...prevRows, newRow]);
            }else {
                toast.error("Product already added");
            }
        }
    };

    const handleQtyChange = (index, value) => {
        const newRows = [...tableRows];
        newRows[index].qty = value;
        newRows[index].subTotal = newRows[index].netUnitPrice * value; // Recalculate subTotal
        setTableRows(newRows);
    };
    const handleDeleteRow = (index) => {
        const newRows = [...tableRows];
        newRows.splice(index, 1);
        setTableRows(newRows);

    }
    const calculateTotalAmount = () => {
        let grandTotal = tableRows.reduce((total, row) => total + row.subTotal, 0);
        return Number(grandTotal - formData.orderTAX + formData.shipping - formData.discount).toLocaleString();
    };
    useEffect(() => {
        fetchProducts();
        fetchCustomers();
        fetchSuppliers();
        if (id) {
            fetchPurchase(id);
        }
    }, [id]);
    return (
        <div>
            <AppCard>
                <div>
                    {isCreatePurchase ? (
                        <h4 className="mb-4 pb-3 border-bottom">Create Purchase</h4>
                    ) : (
                        <h4 className="mb-4 pb-3 border-bottom">Create Sales</h4>
                    )}
                </div>
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <FormField label="Date" type="date" onChange={handleChange}
                                           value={formData.date}
                                           name="date" id="date"/>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-3">
                                <div className="mb-3">
                                    {
                                        isCreatePurchase ? <div><label className="form-label">
                                            Supplier <FaAsterisk className="text-danger ms-1" size={10}/></label>
                                            <div className="row gap-0 align-items-center d-flex">
                                                <div className="col-10">
                                                    <Select
                                                        isMulti={false}
                                                        name="supplierId"
                                                        options={
                                                            suppliers.map((supplier) => {
                                                                return {value: supplier.id, label: supplier.name}
                                                            })
                                                        }
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                borderColor: state.isFocused ? '#6571FF' : base.borderColor,
                                                                boxShadow: state.isFocused ? '0 0 0 0.1rem rgba(38, 132, 255, 0.25)' : null,
                                                                '&:hover': {
                                                                    borderColor: state.isFocused ? '#2684ff' : base.borderColor,
                                                                },
                                                                padding: '0.2rem 0.75rem',
                                                                borderRadius: '0.35rem',
                                                                width: '100%',
                                                            }),
                                                        }}
                                                        onChange={handleChangeSupplier}
                                                    />
                                                </div>
                                                <div className="col-2">
                                                    <button className="btn   text-white fw-bold tw-text-lg btn-primary"
                                                            type="button"><AiOutlinePlus/></button>
                                                </div>
                                            </div>
                                        </div> : <div><label className="form-label">
                                            Customer <FaAsterisk className="text-danger ms-1" size={10}/></label>
                                            <div className="row gap-0 align-items-center d-flex">
                                                <div className="col-10">
                                                    <Select
                                                        isMulti={false}
                                                        name="customerId"
                                                        options={
                                                            customers.map((customer) => {
                                                                return {value: customer.id, label: customer.name}
                                                            })
                                                        }
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                borderColor: state.isFocused ? '#6571FF' : base.borderColor,
                                                                boxShadow: state.isFocused ? '0 0 0 0.1rem rgba(38, 132, 255, 0.25)' : null,
                                                                '&:hover': {
                                                                    borderColor: state.isFocused ? '#2684ff' : base.borderColor,
                                                                },
                                                                padding: '0.2rem 0.75rem',
                                                                borderRadius: '0.35rem',
                                                                width: '100%',
                                                            }),
                                                        }}
                                                        onChange={handleChangeCustomer}
                                                    />
                                                </div>
                                                <div className="col-2">
                                                    <button className="btn   text-white fw-bold tw-text-lg btn-primary"
                                                            type="button"><AiOutlinePlus/></button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="mb-4">
                                <label className="form-label">
                                    Product <FaAsterisk className="text-danger ms-1" size={10}/></label>
                                <Select
                                    isMulti={false}
                                    name="products"
                                    options={
                                        products.map((product) => {
                                            return {value: product.id, label: product.name}
                                        })
                                    }
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: state.isFocused ? '#6571FF' : base.borderColor,
                                            boxShadow: state.isFocused ? '0 0 0 0.1rem rgba(38, 132, 255, 0.25)' : null,
                                            '&:hover': {
                                                borderColor: state.isFocused ? '#2684ff' : base.borderColor,
                                            },
                                            padding: '0.2rem 0.75rem',
                                            borderRadius: '0.35rem',
                                        }),
                                    }}
                                    onChange={handleSelectChange}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="table-responsive mb-4">
                        <Table responsive>
                            <thead
                                className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                style={{borderRadius: "20"}}>
                            <Th column="Product"/>
                            <Th column="Net Unit Price"/>
                            <Th column="Qty"/>
                            <Th column="Tax"/>
                            <Th column="Sub Total"/>
                            <th className="border-top-0 border-0 border border-primary cursor-pointer">
                                <div
                                    className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                    <span>Action</span>
                                </div>
                            </th>
                            </thead>
                            <tbody>
                            {tableRows.map((row, index) => (
                                <tr key={index}>
                                    <Td>{row.product}</Td>
                                    <Td>{row.netUnitPrice}</Td>
                                    <Td>
                                        <div className="d-flex justify-content-center">
                                            <Button variant="outline-secondary" className="bg-primary-subtle border-0"
                                                    onClick={() => handleQtyChange(index, row.qty - 1)}>-</Button>
                                            <input
                                                type="number"
                                                value={row.qty}
                                                onChange={(e) => handleQtyChange(index, e.target.value)}
                                                className="form-control border-0 border-opacity-50 bg-transparent text-center focus:tw-ring-0"
                                                style={{width: '90px'}}
                                            />
                                            <Button variant="outline-secondary" className="bg-primary-subtle border-0"
                                                    onClick={() => handleQtyChange(index, row.qty + 1)}>+</Button>
                                        </div>
                                    </Td>
                                    <Td>{row.tax}</Td>
                                    <Td>{Number(row.subTotal).toLocaleString()}</Td>
                                    <Td>
                                        <Button variant="outline-danger"
                                                onClick={() => handleDeleteRow(index)}>
                                            <BiTrash/>
                                        </Button>
                                    </Td>
                                </tr>
                            ))}
                            </tbody>

                        </Table>
                        {
                            tableRows.length < 1 && <div className="d-flex text-muted justify-content-center">
                                <span>No Data Available</span>
                            </div>
                        }
                    </div>
                    <div className="justify-content-lg-end d-lg-flex mb-3">
                        <Col lg={4}>
                            <ul className="list-group ">
                                <li className="list-group-item text-muted bg-secondary border-0 mb-1 bg-opacity-10 py-3 d-flex justify-content-between">
                                    <Col><span>Order Tax</span></Col>
                                    <Col><span>Rwf {formData.orderTAX ? formData.orderTAX : '0.00(0.00)'}</span></Col>
                                </li>
                                <li className="list-group-item py-3 text-muted bg-secondary border-0 mb-1 bg-opacity-10 d-flex justify-content-between">
                                    <Col><span>Discount</span></Col>
                                    <Col><span>Rwf {formData.discount ? formData.discount : '0.00'}</span></Col>
                                </li>
                                <li className="list-group-item py-3 d-flex text-muted bg-secondary border-0 mb-1 bg-opacity-10 justify-content-between">
                                    <Col><span>Shipping</span></Col>
                                    <Col><span>Rwf {formData.shipping ? formData.shipping : '0.00'}</span></Col>
                                </li>
                                <li className="list-group-item fw-bold py-3 d-flex bg-secondary border-0 mb-1 bg-opacity-10 justify-content-between">
                                    <Col><span>Grand Total</span></Col>
                                    <Col><span>Rwf {calculateTotalAmount()}</span></Col>
                                </li>
                            </ul>
                        </Col>
                    </div>
                    <Row>
                        <Col lg={4}>
                            <div className="mb-3">
                                <FormField label="Order Tax" type="text" onChange={handleChange}
                                           value={formData.orderTAX}
                                           isRequired={false}
                                           name="orderTAX" id="orderTAX"/>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-3">
                                <FormField label="Discount" type="text" onChange={handleChange}
                                           value={formData.discount}
                                           isRequired={false}
                                           name="discount" id="discount"/>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="mb-3">
                                <FormField label="Shipping" type="text" onChange={handleChange}
                                           value={formData.shipping}
                                           isRequired={false}
                                           name="shipping" id="shipping"/>
                            </div>
                        </Col>
                        {/*<Col lg={4}>*/}
                        {/*    <div className="mb-3">*/}
                        {/*        <FormField label="Status" type="text" onChange={handleChange}*/}
                        {/*                   value={formData.name}*/}
                        {/*                   isRequired={true}*/}
                        {/*                   name="name" id="name"/>*/}
                        {/*    </div>*/}
                        {/*</Col>*/}
                        <Col lg={4}>
                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">
                                    Payment Status <FaAsterisk className="text-danger ms-1" size={10}/>
                                </label>
                                <select className="form-select focus:tw-ring-0 tw-py-3" onChange={handleChange}
                                        name="role" aria-label="Default select example">
                                    <option value="" disabled>Select Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                            </div>
                        </Col>
                        <Col lg="12">
                            <div className="mb-3">
                                <FormField label="Description" type="textarea" onChange={handleChange}
                                           value={formData.note}
                                           isRequired={true}
                                           name="note" id="note"/>
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end ">
                        <div className="d-flex gap-2">
                            <button className="btn text-white d-flex align-items-center gap-2 btn-primary px-4 py-2">
                                <IoIosSave/> Save
                            </button>
                            <button className="btn btn-secondary px-4">
                                Cancel
                            </button>
                        </div>
                    </div>
                </Form>
            </AppCard>
        </div>
    );
}

export default PurchaseSalesForm;