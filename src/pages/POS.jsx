import {Button, Col, Row, Table} from "react-bootstrap";
import {FaBagShopping, FaHand, FaMagnifyingGlass} from "react-icons/fa6";
import Select from "react-select";
import {useEffect, useRef, useState} from "react";
import http from "../services/httpService.js";
import {BiCalculator, BiReset} from "react-icons/bi";
import FormField from "../components/common/FormField.jsx";
import {AiOutlineFullscreen, AiOutlineMenu} from "react-icons/ai";
import {GrDashboard} from "react-icons/gr";
import {Link} from "react-router-dom";
import BLogo from '../assets/brand_logo.png'
import {toast} from "react-toastify";
import {FaMoneyBill} from "react-icons/fa";
import {ArrowRightCircleIcon} from "@heroicons/react/16/solid/index.js";
import Td from "../components/common/Td.jsx";


function Pos() {
    const [products, setProducts] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const iframeRef = useRef(null);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [formData, setFormData] = useState({
        tax: '',
        discount: '',
        shipping: ''
    });
    const fetchProducts = () => {
        http.get("/products")
            .then((res) => {
                let data = res.data;
                setProducts(data);
            }).catch(() => {
        }).finally(() => {
        });
    }
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
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
        if (tableRows.length < 5) {
            const netUnitPrice = product.price;
            const qty = 1;
            const newRow = {
                product: product.name,
                qty: qty,
                netUnitPrice: netUnitPrice,
                subTotal: netUnitPrice * qty
            };
            setTableRows([...tableRows, newRow]);
            setSelectedProductIds([...selectedProductIds, product.id]);
        } else {
            toast.error('You can not add more than 5 products')
        }
    };
    const handleQtyChange = (index, value) => {
        const newRows = [...tableRows];
        newRows[index].qty = value;
        newRows[index].subTotal = newRows[index].netUnitPrice * value; // Recalculate subTotal
        setTableRows(newRows);
    };

    function toggleFullScreen(iframeElement) {
        if (!document.fullscreenElement) {
            // If not in full screen, enter it
            if (iframeElement.requestFullscreen) {
                iframeElement.requestFullscreen();
            } else if (iframeElement.mozRequestFullScreen) { /* Firefox */
                iframeElement.mozRequestFullScreen();
            } else if (iframeElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                iframeElement.webkitRequestFullscreen();
            } else if (iframeElement.msRequestFullscreen) { /* IE/Edge */
                iframeElement.msRequestFullscreen();
            }
        } else {
            // If in full screen, exit it
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
    }

    const handleFilterProducts = (selectedItem) => {
        setSelectedCategory(selectedItem);

    }
    const handleFilterProductsByBrand = (selectedItem) => {
        setSelectedBrand(selectedItem);

    }
    let filteredProducts = selectedCategory||selectedBrand ? products.filter((product) => product.categoryId === selectedCategory && product.brandId === setSelectedBrand) : products;
    let grandTotal = tableRows.reduce((total, row) => total + row.subTotal, 0);
    const calculateTotalAmount = () => {
        let total = grandTotal - formData.tax + formData.shipping - formData.discount;
        return Number(total).toLocaleString();
    };
    useEffect(() => {
        fetchProducts();
        fetchBrands();
        fetchCategories();
    }, []);
    return (
        <div className="tw-bg-blue-200 min-vh-100 tw-bg-opacity-20 card card-body border-0">
            <Row>
                <Col lg={4}>
                    <Row>
                        <Col lg={12}>
                            <div className="mb-2">
                                <Select
                                    isMulti={false}
                                    name="tags"
                                    options={
                                        products.map((product) => {
                                            return {value: product.id, label: product.name}
                                        })
                                    }
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
                                />
                            </div>
                        </Col>
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
                                        </Td>
                                        <Td className="tw-text-xs">{Number(row.netUnitPrice).toLocaleString()}</Td>
                                        <Td className="tw-text-xs">{Number(row.subTotal).toLocaleString()}</Td>
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
                                            name="tax"
                                            type="number"
                                            placeholder="Tax"
                                            onChange={handleChange}
                                            value={formData.tax}
                                            isRequired={false}
                                            id="customer"
                                        />
                                    </div>
                                    <div className="mb-2 gap-1 d-flex">
                                        <span>Discount</span>
                                        <div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault"
                                                       id="flexRadioDefault1" checked/>
                                                <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                    Fixed
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="flexRadioDefault"
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
                                        className="btn w-100 py-2 tw-bg-pink-400 tw-text-lg text-white">Hold <FaHand/>
                                    </button>
                                </Col>
                                <Col xl={4} className="mb-2">
                                    <button onClick={() => {
                                        setTableRows([]);
                                        setSelectedProductIds([])
                                    }}
                                            className="btn w-100 py-2 btn-danger d-flex align-items-center justify-content-center tw-text-lg">Reset <BiReset/>
                                    </button>
                                </Col>
                                <Col xl={4} className="mb-2">
                                    <button className="btn w-100 py-2 tw-bg-green-500 text-white tw-text-lg">Pay
                                        now <FaMoneyBill/></button>
                                </Col>
                            </Row>

                        </div>
                    </div>
                </Col>
                <Col lg={8}>
                    <Row className="align-items-center mb-2">
                        <Col lg={11}>
                            <div className="input-group my-lg-3 border-0 ">
                                <button className="btn bg-white border-0 rounded-start-4 border tw-py-5  border-end-0"
                                        type="submit">
                                    <FaMagnifyingGlass/>
                                </button>
                                <input
                                    className="form-control  focus:tw-ring-0 border-0 rounded-end-4 focus:tw-border-gray-200 border-start-0 "
                                    type="search" placeholder="Scan/Search product by code name"
                                    aria-label="Search"/>

                            </div>
                        </Col>
                        <Col lg={1}>
                            <div className="d-flex gap-3 my-2">
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
                                {/*<button className="btn rounded-3  tw-text-2xl btn-primary text-white">*/}
                                {/*    <BiCalculator/>*/}
                                {/*</button>*/}
                                <Link to={'/admin/dashboard'}
                                      className="btn rounded-3  tw-text-2xl btn-primary text-white">
                                    <GrDashboard/>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                    <div className="card card-body h-100 border-0 rounded-4 ">
                        <div className="d-flex gap-3 flex-nowrap tw-overflow-x-scroll  align-items-center  scrollbar">
                            <button onClick={() => handleFilterProducts(null)}
                                    className={`btn btn-light tw-tracking-wide ${selectedCategory === null ? 'bg-primary text-white' : ''}  text-nowrap  btn-lg tw-text-sm `}>All
                                Products
                            </button>
                            {
                                categories.map((category, index) => {
                                    return <div key={index}>
                                        <button onClick={() => handleFilterProducts(category.id)}
                                                className={`btn btn-light tw-tracking-wide ${selectedCategory === category.id ? 'bg-primary text-white' : ''}  text-nowrap  btn-lg tw-text-sm `}>{category.name}</button>
                                    </div>
                                })
                            }
                        </div>
                        <div className="d-flex gap-3 flex-nowrap tw-overflow-x-scroll  align-items-center  scrollbar">
                            <button onClick={() => handleFilterProductsByBrand(null)}
                                    className={`btn btn-light tw-tracking-wide ${selectedBrand === null ? 'bg-primary text-white' : ''}  text-nowrap  btn-lg tw-text-sm `}>All Brands</button>
                            {
                                brands.map((brand, index) => {
                                    return <div key={index}>
                                        <button onClick={() => handleFilterProductsByBrand(brand.id)}
                                                className={`btn btn-light tw-tracking-wide ${selectedBrand === brand.id ? 'bg-primary text-white' : ''}  text-nowrap  btn-lg tw-text-sm `}>{brand.name}</button>
                                    </div>
                                })
                            }
                        </div>

                        <Row>
                            {filteredProducts.map((product) => (
                                <Col key={product.id} xs={6} className="mb-3" md={4} lg={3} xl={2}>
                                    <button
                                        onClick={() => handleAddRow(product)}
                                        className={`card shadow-sm h-100 w-100 card-body mb-3 d-flex flex-column align-items-center rounded ${selectedProductIds.includes(product.id) ? 'border border-primary' : ''}`}
                                    >
                                        {product?.image ? <img src={product.img} alt="brand logo"/> :
                                            <img src={BLogo} className="h-75 w-75" alt="brand logo"/>}
                                        <span className="tw-text-xs">{product.name}</span>
                                        <div className="d-flex justify-content-between">
                                            <span className="badge "></span>
                                        </div>
                                    </button>
                                </Col>
                            ))}
                            {
                                filteredProducts.length < 1 &&
                                <div className="d-flex  align-items-center  justify-content-center">
                                    <span className=" tw-text-xl">No Data Available</span>
                                </div>
                            }
                        </Row>
                    </div>
                </Col>
            </Row>

        </div>
    );
}

export default Pos;