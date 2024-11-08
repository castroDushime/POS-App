import {Button, Col, ListGroup, Modal, Row, Table} from "react-bootstrap";
import {FaHand, FaMagnifyingGlass} from "react-icons/fa6";
import Select from "react-select";
import React, {useEffect, useState} from "react";
import http from "../services/httpService.js";
import {BiHistory, BiReset, BiTrash} from "react-icons/bi";
import FormField from "../components/common/FormField.jsx";
import {GrDashboard} from "react-icons/gr";
import {Link, useNavigate, useParams} from "react-router-dom";
import BLogo from '../assets/brand_logo.png'
import {toast} from "react-toastify";
import {FaMoneyBill} from "react-icons/fa";
import Td from "../components/common/Td.jsx";
import {FiPlusCircle} from "react-icons/fi";
import SaveCustomerModel from "../components/SaveCustomerModel.jsx";
import PrintComponent from "../components/PrintableContent.jsx";


function Pos() {
    const {id} = useParams();
    let navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [productsFetched, setProductsFetched] = useState(false);
    const [receivedAmount, setReceivedAmount] = useState('');
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
    const [cuFormData, setCuFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const fetchProducts = () => {
        http.get("/products")
            .then((res) => {
                let data = res.data;
                setProducts(data);
                setProductsFetched(true);
            }).catch(() => {
        }).finally(() => {
        });
    }
    const [paymentData, setPaymentData] = useState({
        receivedAmount: receivedAmount,
        payingAmount: receivedAmount,
        changeReturn: '',
        PaymentType: 'cash',
        note: '',
        paymentStatus: 'paid'
    });
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setCuFormData({
            ...cuFormData,
            [e.target.name]: e.target.value
        });
    }

    const handleShowModal = () => setShowModal(true);

    const handleShowPaymentModal = (e) => {
        e.preventDefault();
        setShowPaymentModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setShowPaymentModal(false);
        setShowPrintModal(false);
        setCuFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
        });
    };
    const fetchCustomers = () => {
        http.get("/customers")
            .then((res) => {
                console.log(res);
                let data = res.data;
                setCustomers(data);
            }).catch(({error}) => {
            console.log(error);
        })
            .finally(() => {
            });
    }
    const fetchCategories = () => {
        http.get("/categories")
            .then((res) => {
                let data = res.data;
                setCategories(data);
            }).catch(() => {
        }).finally(() => {
        });
    }
    const fetchPurchase = () => {
        http.get(`/sales/show/${id}`)
            .then((res) => {
                const data = res.data;
                setSelectedProductIds(data.items.map(item => item.productId));
                if (id) {
                    setFormData({
                        date: new Date().toLocaleDateString('en-GB'),
                        customerId: data.customerId,
                        status: data.status,
                        orderTAX: data.orderTAX,
                        discount: data.discount,
                        shipping: data.shipping,
                        note: data.note,
                        items: data.items
                    });
                    setTableRows(data?.items?.map(item => ({
                        product: products.filter(product => product.id === item.productId)[0].name,
                        productId: item.productId,
                        netUnitPrice: item.price,
                        qty: item.quantity,
                        discount: item.discount,
                        tax: item.tax,
                        subTotal: item.amount
                    })));
                }

            }).catch(() => {
        });
    };
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const submitData = tableRows.map(row => ({
            productId: row.productId,
            price: row.netUnitPrice,
            quantity: row.qty,
            amount: row.subTotal
        }));
        console.log(submitData);
        const url = id ? `/sales/${id}` : "/sales";
        const method = id ? "put" : "post";
        http[method](url, {
            date: new Date().toLocaleDateString('en-CA'),
            customerId: formData.customerId,
            status: formData.status,
            orderTAX: Number(formData.orderTAX),
            discount: Number(formData.discount),
            shipping: Number(formData.shipping),
            note: formData.note,
            items: submitData,
            isPos: true
        }).then(({data}) => {
            toast.success(data.message)
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            // setTableRows([]);
            // setFormData({
            //     date: '',
            //     customerId: '',
            //     status: 'pending',
            //     orderTAX: '',
            //     discount: '',
            //     shipping: '',
            //     note: '',
            //     items: []
            // });
        });
    };
    const handleShowPrintModal = () => {
        handleSubmit();
        setShowPaymentModal(false);
        setShowPrintModal(true);
    }
    const handleHold = (e) => {
        e.preventDefault();
        const submitData = tableRows.map(row => ({
            productId: row.productId,
            price: row.netUnitPrice,
            quantity: row.qty,
            amount: row.subTotal
        }));
        const url = id ? `/sales/${id}` : "/sales";
        const method = id ? "put" : "post";
        http[method](url, {
            date: new Date().toLocaleDateString('en-CA'),
            customerId: formData.customerId,
            status: 'draft',
            orderTAX: Number(formData.orderTAX),
            discount: Number(formData.discount),
            shipping: Number(formData.shipping),
            note: formData.note,
            items: submitData,
            isPos: true
        }).then(({data}) => {
            toast.success(data.message)
            navigate('/pos/history');
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setTableRows([]);
            setFormData({
                date: '',
                customerId: '',
                status: 'draft',
                orderTAX: '',
                discount: '',
                shipping: '',
                note: '',
                items: []
            });
        });

    }
    const fetchBrands = () => {
        http.get("/brands")
            .then((res) => {
                let data = res.data;
                setBrands(data);
            }).catch(() => {
        }).finally(() => {
        });
    }
    const handleAddRow = (product) => {

        if (selectedProductIds.includes(product.id)) {
            toast.error('Product already added');
        } else {
            const netUnitPrice = product.price;
            const qty = 1;
            const newRow = {
                productId: product.id,
                product: product.name,
                qty: qty,
                netUnitPrice: netUnitPrice,
                subTotal: netUnitPrice * qty
            };
            setTableRows([...tableRows, newRow]);
            setSelectedProductIds([...selectedProductIds, product.id]);
        }
    };
    const handleRemoveRow = (index) => {
        const newRows = [...tableRows];
        newRows.splice(index, 1);
        setTableRows(newRows);
        const selectedProduct = tableRows[index];
        const newSelectedProductIds = selectedProductIds.filter(id => id !== selectedProduct.productId);
        setSelectedProductIds(newSelectedProductIds);
    }
    const handleQtyChange = (index, value) => {
        const newRows = [...tableRows];
        newRows[index].qty = value;
        newRows[index].subTotal = newRows[index].netUnitPrice * value; // Recalculate subTotal
        setTableRows(newRows);
    };


    const handleFilterProducts = (selectedItem) => {
        setSelectedCategory(selectedItem);

    }
    const handleFilterProductsByBrand = (selectedItem) => {
        setSelectedBrand(selectedItem);

    }
    const handleSearch = (e) => {
        let value = e.target.value;
        if (value) {
            let filteredProducts = products.filter((product) => product.name.toLowerCase().includes(value.toLowerCase()));
            setProducts(filteredProducts);
        } else {
            fetchProducts();
        }
    }
    const handleChangeCustomer = (selectedOption) => {
        setFormData({
            ...formData,
            customerId: selectedOption.value,
        });
    }
    let filteredProducts = selectedCategory || selectedBrand ? products.filter((product) => product.categoryId === selectedCategory && product.brandId === setSelectedBrand) : products;
    let grandTotal = tableRows.reduce((total, row) => total + row.subTotal, 0);
    let total = Number(grandTotal) + Number(formData.shipping) + Number(formData.orderTAX) - Number(formData.discount);
    const calculateTotalAmount = () => {
        let total = Number(grandTotal) + Number(formData.shipping) + Number(formData.orderTAX) - Number(formData.discount);
        return total.toLocaleString();
    };
    let selectedCustomer = customers.filter(customer => customer.id === formData.customerId)[0];
    useEffect(() => {
        fetchProducts();
        fetchBrands();
        fetchCustomers();
        fetchCategories();
    }, []);
    useEffect(() => {
        if (productsFetched && id) {
            fetchPurchase();
        }
    }, [productsFetched, id]);
    return (
        <div className="tw-bg-blue-200 min-vh-100 tw-bg-opacity-20 card card-body border-0">
            <form onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={4}>
                            <Row className="align-items-center">
                                <div className="col-8 col-lg-9 col-xxl-10">
                                    <div className="mb-2">
                                        <Select
                                            isMulti={false}
                                            name="tags"
                                            options={
                                                customers.map((customer) => {
                                                    return {value: customer.id, label: customer.name}
                                                })
                                            }
                                            placeholder="Select Customer"
                                            className="basic-multi-select shadow-sm rounded-5"
                                            classNamePrefix="select"
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    borderColor: state.isFocused ? '#6571FF' : "#fff",
                                                    boxShadow: state.isFocused ? '0 0 0 0.1rem rgba(38, 132, 255, 0.25)' : null,
                                                    '&:hover': {
                                                        borderColor: state.isFocused ? '#2684ff' : base.borderColor,
                                                    },
                                                    padding: '0.75rem 0.75rem',
                                                    borderRadius: '0.95rem',
                                                }),
                                            }}
                                            onChange={handleChangeCustomer}
                                        />
                                    </div>

                                </div>
                                <div className="col-4 col-lg-3 col-xxl-2">
                                    <Button onClick={handleShowModal}
                                            className="btn mb-2 w-100 rounded-4 tw-py-3 text-white fw-bolder btn-primary">
                                        <FiPlusCircle className="tw-w-8 tw-h-8"/>
                                    </Button>
                                </div>
                            </Row>
                            <div
                                className="card rounded-4 d-flex flex-column justify-content-end overflow-hidden border-0 min-vh-100">
                                <div className="table-responsive  bg-white  tw-h-96 mb-4">
                                    <Table hover responsive>
                                        <thead
                                            className="tw-bg-opacity-70  rounded"
                                            style={{borderRadius: "20"}}>
                                        <tr>
                                            <th className="py-3">Product</th>
                                            <th className="py-3">Qty</th>
                                            <th className="py-3">Price</th>
                                            <th className="py-3">Sub Total</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tableRows.map((row, index) => (
                                            <tr key={index}>
                                                <Td className="tw-text-xs">{row.product}</Td>
                                                <Td className="tw-text-xs d-flex  align-items-center">
                                                    <Button variant="outline-secondary"
                                                            className="bg-primary-subtle border-0"
                                                            onClick={() => handleQtyChange(index, row.qty - 1)}>-</Button>
                                                    <input
                                                        type="number"
                                                        value={row.qty}
                                                        onChange={(e) => handleQtyChange(index, e.target.value)}
                                                        className="form-control border-0 border-opacity-50 bg-transparent text-center focus:tw-ring-0"
                                                        style={{width: '90px'}}
                                                    />
                                                    <Button variant="outline-secondary"
                                                            className="bg-primary-subtle border-0"
                                                            onClick={() => handleQtyChange(index, row.qty + 1)}>+</Button>
                                                </Td>
                                                <Td className="tw-text-xs">{Number(row.netUnitPrice).toLocaleString()}</Td>
                                                <Td className="tw-text-xs">{Number(row.subTotal).toLocaleString()}
                                                    <Button onClick={() => handleRemoveRow(index)}
                                                            className="btn btn-danger btn-sm rounded-circle ms-2">
                                                        <BiTrash/>
                                                    </Button>
                                                </Td>
                                            </tr>
                                        ))}
                                        </tbody>

                                    </Table>
                                    {
                                        tableRows.length < 1 && <div className="d-flex   justify-content-center">
                                            <span>No Data Available</span>
                                        </div>
                                    }
                                </div>
                                <div className="card card-body border-0">
                                    <Row className="">
                                        <Col xl={6}>
                                            <div className="mb-3">
                                                <FormField
                                                    name="orderTAX"
                                                    type="number"
                                                    placeholder="Tax"
                                                    onChange={handleChange}
                                                    value={formData.orderTAX}
                                                    isRequired={false}
                                                    id="orderTAX"
                                                />
                                            </div>
                                            <div className="mb-2 gap-1 d-flex">
                                                <span>Discount</span>
                                                <div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio"
                                                               name="flexRadioDefault"
                                                               id="flexRadioDefault1" checked/>
                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                            Fixed
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="radio"
                                                               name="flexRadioDefault"
                                                               id="flexRadioDefault2"/>
                                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                            Percentage
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-1">
                                                <FormField
                                                    name="discount"
                                                    type="number"
                                                    onChange={handleChange}
                                                    value={formData.discount}
                                                    placeholder="Discount"
                                                    isRequired={false}
                                                    id="customer"
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <FormField
                                                    name="shipping"
                                                    type="number"
                                                    onChange={handleChange}
                                                    value={formData.shipping}
                                                    placeholder="Shipping"
                                                    isRequired={false}
                                                    id="customer"
                                                />
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <div className="d-flex my-5 gap-2 align-items-end flex-column">
                                                <div>
                                                    <span>Total QTY : </span>
                                                    <span>{tableRows.length}</span>
                                                </div>
                                                <div className="fw-bolder text-muted">
                                                    <span>Sub Total : </span>
                                                    <span>Rwf {Number(grandTotal).toLocaleString()}</span>
                                                </div>
                                                <div className="fw-bolder tw-text-lg">
                                                    <span> Total : </span>
                                                    <span>Rwf {calculateTotalAmount()}</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl={4} className="mb-2">
                                            <button
                                                onClick={handleHold}
                                                className="btn w-100 py-2 tw-bg-pink-400 tw-text-lg text-white">Hold <FaHand/>
                                            </button>
                                        </Col>
                                        <Col xl={4} className="mb-2">
                                            <button onClick={() => {
                                                setTableRows([]);
                                                setSelectedProductIds([])
                                                setFormData({
                                                    orderTAX: '',
                                                    discount: '',
                                                    shipping: ''
                                                })
                                            }}
                                                    className="btn w-100 py-2 btn-danger d-flex align-items-center justify-content-center tw-text-lg">Reset <BiReset/>
                                            </button>
                                        </Col>
                                        <Col xl={4} className="mb-2">
                                            <button type="button"
                                                    onClick={handleShowPaymentModal}
                                                    className="btn w-100 py-2 tw-bg-green-500 text-white tw-text-lg">Pay
                                                now <FaMoneyBill/></button>
                                        </Col>
                                    </Row>

                                </div>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <Row className="align-items-center mb-2">
                                <Col lg={10}>
                                    <div className="input-group mb-lg-3 border-0 ">
                                        <button
                                            className="btn bg-white border-0 rounded-start-4 border tw-py-5  border-end-0"
                                            type="submit">
                                            <FaMagnifyingGlass/>
                                        </button>
                                        <input onChange={handleSearch}
                                               className="form-control  focus:tw-ring-0 border-0 rounded-end-4 focus:tw-border-gray-200 border-start-0 "
                                               type="search" placeholder="Scan/Search product by code name"
                                               aria-label="Search"/>

                                    </div>
                                </Col>
                                <Col lg={2}>
                                    <div className="d-flex gap-3 mb-2">
                                        {/*<button className="btn rounded-3  tw-text-2xl btn-danger">*/}
                                        {/*    <AiOutlineMenu/>*/}
                                        {/*</button>*/}
                                        {/*<button className="btn rounded-3  tw-text-2xl btn-success">*/}
                                        {/*    <FaBagShopping/>*/}
                                        {/*</button>*/}
                                        {/*<button onClick={() => toggleFullScreen(iframeRef.current)}*/}
                                        {/*        className="btn rounded-3  tw-text-2xl text-white btn-primary">*/}
                                        {/*    <AiOutlineFullscreen/>*/}
                                        {/*</button>*/}
                                        <Link to={'/pos/history'}
                                              className="btn rounded-3  tw-text-2xl btn-primary text-white">
                                            <BiHistory/>
                                        </Link>
                                        <Link to={'/dashboard'}
                                              className="btn rounded-3  tw-text-2xl btn-primary text-white">
                                            <GrDashboard/>
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                            <div className="card card-body h-100 border-0 rounded-4 ">

                                <Row>
                                    <Col lg={4} className="d-flex mb-3 justify-content-between flex-column flex-lg-row">
                                        <ListGroup
                                            className="d-flex flex-row gap-1 tw-overflow-y-scroll scrollbar flex-lg-column  ">
                                            <ListGroup.Item onClick={() => handleFilterProducts(null)}
                                                            className={` rounded btn border-0   tw-tracking-wide ${selectedCategory === null ? 'bg-primary text-white' : 'bg-light'}  text-nowrap  btn-lg tw-text-sm `}>
                                                All Products
                                            </ListGroup.Item>
                                            {
                                                categories.map((category, index) => {
                                                    return <div key={index}>
                                                        <ListGroup.Item
                                                            onClick={() => handleFilterProducts(category.id)}
                                                            className={`btn btn-light border-0   rounded mb-1  text-start tw-tracking-wide ${selectedCategory === category.id ? 'bg-primary text-white' : 'bg-light'}  text-nowrap  btn-lg tw-text-sm `}>
                                                            {category.name}
                                                        </ListGroup.Item>
                                                    </div>
                                                })
                                            }
                                        </ListGroup>
                                        <ListGroup
                                            className="d-flex flex-row gap-1 tw-overflow-y-scroll scrollbar flex-lg-column ">
                                            <ListGroup.Item onClick={() => handleFilterProductsByBrand(null)}
                                                            className={`btn rounded border-0 mb-1  tw-tracking-wide ${selectedBrand === null ? 'bg-primary text-white' : 'bg-light'}  text-nowrap  btn-lg tw-text-sm `}>
                                                All Brands
                                            </ListGroup.Item>
                                            {
                                                brands.map((brand, index) => {
                                                    return <div key={index}>
                                                        <ListGroup.Item
                                                            onClick={() => handleFilterProductsByBrand(brand.id)}
                                                            className={`btn btn-light border-0 rounded mb-1  text-start tw-tracking-wide ${selectedBrand === brand.id ? 'bg-primary text-white' : 'bg-light'}  text-nowrap  btn-lg tw-text-sm `}>
                                                            {brand.name}
                                                        </ListGroup.Item>
                                                    </div>
                                                })
                                            }
                                        </ListGroup>
                                    </Col>
                                    <Col lg={8}>
                                        <Row>
                                            {filteredProducts.map((product) => (
                                                <Col key={product.id} xs={6} className="mb-3" md={3} lg={4} xl={3}>
                                                    <button type="button"
                                                            onClick={() => handleAddRow(product)}
                                                            className={`card shadow-sm h-100 w-100 card-body mb-3 d-flex flex-column align-items-center rounded ${selectedProductIds.includes(product.id) ? 'border border-primary' : ''}`}
                                                    >
                                                        {product?.image ? <img src={product.img} alt="brand logo"/> :
                                                            <img src={BLogo} className="w-50 " alt="brand logo"/>}
                                                        <span className="tw-text-xs">{product.name}</span>
                                                        <div className="d-flex justify-content-between">
                                                            <span
                                                                className="badge text-black ">Rwf {product.price}</span>
                                                        </div>
                                                    </button>
                                                </Col>
                                            ))}
                                            {
                                                filteredProducts.length < 1 &&
                                                <div
                                                    className="d-flex my-5  align-items-center  justify-content-center">
                                                <span
                                                    className="bg-info-subtle p-4 w-100 text-center rounded-4 tw-text-xl">No Data Available</span>
                                                </div>
                                            }
                                        </Row>
                                    </Col>
                                </Row>


                            </div>
                        </Col>
                    </Row>
                <SaveCustomerModel fetchCustomers={fetchCustomers}
                                   formData={cuFormData}
                                   handleChange={handleChange}
                                   setFormData={setCuFormData}
                                   isEditMode={false}
                                   showModal={showModal}
                                   selectedUserId={null}
                                   handleCloseModal={handleCloseModal}
                />
                <Modal show={showPaymentModal} size='xl' onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Make Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col lg="8">
                                <Row>
                                    <Col lg="6">
                                        <div className="mb-3">
                                            <FormField
                                                label="Received Amount"
                                                name="receivedAmount"
                                                type="number"
                                                placeholder="Received Amount"
                                                onChange={handleChange}
                                                value={total}
                                                isRequired={false}
                                                id="receivedAmount"
                                            />
                                        </div>
                                    </Col>
                                    <Col lg="6">
                                        <div className="mb-3">
                                            <FormField
                                                label="Paying Amount"
                                                name="receivedAmount"
                                                type="number"
                                                disabled
                                                placeholder="Paying Amount"
                                                onChange={handleChange}
                                                value={total}
                                                isRequired={false}
                                                id="receivedAmount"
                                            />
                                        </div>
                                    </Col>
                                    <Col lg="6">
                                        <div className="mb-3">
                                            <FormField
                                                label="Paying Amount"
                                                name="receivedAmount"
                                                type="number"
                                                disabled
                                                placeholder="Paying Amount"
                                                onChange={handleChange}
                                                value={total}
                                                isRequired={false}
                                                id="receivedAmount"
                                            />
                                        </div>
                                    </Col>
                                    <Col lg="6">
                                        <div className="mb-3">
                                            <label className="mb-2" htmlFor="PaymentType">Payment Type</label>
                                            <select className="form-select tw-py-3" id="PaymentType" name="PaymentType">
                                                <option value="cash">Cash</option>
                                                <option value="card">Card</option>
                                                <option value="mobile">Mobile</option>
                                            </select>
                                        </div>
                                    </Col>
                                    <Col lg="12">
                                        <div className="mb-3">
                                            <FormField
                                                label="Note"
                                                name="note"
                                                type="textarea"
                                                placeholder="Note"
                                                onChange={handleChange}
                                                value={formData.note}
                                                isRequired={false}
                                                id="note"
                                            />
                                        </div>
                                    </Col>
                                    <Col lg="12">
                                        <label htmlFor="paymentStatus">Payment Status</label>
                                        <select className="form-select tw-py-3" id="paymentStatus" name="paymentStatus">
                                            <option value="paid">Paid</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="4">
                                <div className="card card-body shadow rounded-3 border-0">
                                    <table className="table table-bordered">
                                        <tbody>
                                        <tr>
                                            <td>Total Products</td>
                                            <td>{tableRows.length}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Amount</td>
                                            <td>Rwf {grandTotal.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Order Tax</td>
                                            <td>Rwf {formData.orderTAX}</td>
                                        </tr>
                                        <tr>
                                            <td>Shipping</td>
                                            <td>Rwf {formData.shipping}</td>
                                        </tr>
                                        <tr>
                                            <td>Grand Total</td>
                                            <td>Rwf{calculateTotalAmount()}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleSubmit} type="submit" className="btn text-white btn-primary">
                            Submit
                        </Button>
                        <button onClick={handleShowPrintModal} className="btn text-white btn-primary">
                            Submit & Print
                        </button>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showPrintModal} size="sm" onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sale Receipt</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/*<div className="container-fluid  bg-white rounded ">*/}
                        {/*    <div className="tw-flex tw-flex-col tw-items-center">*/}
                        {/*        <img src="https://infypos-demo.nyc3.digitaloceanspaces.com/settings/337/logo-80.png"*/}
                        {/*             alt="logo" className="w-20 h-20"/>*/}
                        {/*        <div className="mb-6">*/}
                        {/*            <p className="mb-2"><strong>Reference:</strong> SA_112323232</p>*/}
                        {/*            <p className="mb-2">*/}
                        {/*                <strong>Date:</strong> {new Date().toLocaleDateString()}</p>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="mb-4">*/}
                        {/*        <h2 className="tw-text-xl tw-font-semibold">Customer Information</h2>*/}
                        {/*        <p className="mb-0 border border-bottom border-0">*/}
                        {/*            <strong>Name:</strong> {selectedCustomer?.name}</p>*/}
                        {/*        <p className="mb-0 border border-bottom border-0">*/}
                        {/*            <strong>Email:</strong> {selectedCustomer?.email}</p>*/}
                        {/*        <p className="mb-0 border border-bottom border-0">*/}
                        {/*            <strong>Phone:</strong> {selectedCustomer?.phone}</p>*/}
                        {/*        <p className="mb-0 border border-bottom border-0">*/}
                        {/*            <strong>Address:</strong> {selectedCustomer?.address}</p>*/}
                        {/*    </div>*/}
                        {/*    <div className="mb-">*/}
                        {/*        {tableRows.map((item, index) => (*/}
                        {/*            <div key={index}*/}
                        {/*                 className="tw-border mb-3 tw-border-b-1 tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-border-dashed">*/}
                        {/*                <h6 className="tw-font-semibold mb-1">{item.product}</h6>*/}
                        {/*                <div className="tw-flex tw-justify-between">*/}
                        {/*                    <p className="mb-1">{item.qty}x{Number(item.netUnitPrice).toLocaleString()}</p>*/}
                        {/*                    <p className="mb-1">Rwf {Number(item.subTotal).toLocaleString()}</p>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        ))}*/}
                        {/*        <div className="tw-flex  tw-flex-col ">*/}
                        {/*            <div className="d-flex justify-content-between">*/}
                        {/*                <p className="mb-1"><strong>Order Tax:</strong></p>*/}
                        {/*                <p className="mb-1">Rwf {formData.orderTAX}</p>*/}
                        {/*            </div>*/}
                        {/*            <div className="d-flex justify-content-between">*/}
                        {/*                <p className="mb-1"><strong>Discount:</strong></p>*/}
                        {/*                <p className="mb-1">Rwf {formData.discount}</p>*/}
                        {/*            </div>*/}
                        {/*            <div className="d-flex justify-content-between">*/}
                        {/*                <p className="mb-1"><strong>Shipping:</strong></p>*/}
                        {/*                <p className="mb-1">Rwf {formData.shipping}</p>*/}
                        {/*            </div>*/}
                        {/*            <p><strong>Total*/}
                        {/*                Amount:</strong>  Rwf {calculateTotalAmount()}*/}
                        {/*            </p>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <PrintComponent
                            ref={null}
                            selectedCustomer={selectedCustomer}
                            tableRows={tableRows}
                            formData={formData}
                            calculateTotalAmount={calculateTotalAmount}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" className="text-white" >
                            Print
                        </Button>
                        <Button variant="secondary" className="text-white" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </form>
        </div>
    );
}

export default Pos;