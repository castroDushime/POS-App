import {Container, Table, Pagination, Modal, Button, Form, Dropdown, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import Th from "../components/common/Th.jsx";
import {BsPlus} from "react-icons/bs";
import {LuEye} from "react-icons/lu";
import {useEffect, useState} from "react";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import FormField from "../components/common/FormField.jsx";
import {FaAsterisk} from "react-icons/fa6";
import http from "../services/httpService.js";
import AppPagination from "../components/common/AppPagination.jsx";
import {paginate} from "../components/common/paginate.jsx";
import {format} from 'date-fns';
import {toast} from "react-toastify";
import Swal from 'sweetalert2';
import Joi from "joi";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import {useContent} from "../providers/ContentProvider.jsx";

const validationSchema = Joi.object({
    name: Joi.string().required().label("Name"),
    code: Joi.string().required().label("Code"),
    unitId: Joi.string().required().label("Unit"),
    categoryId: Joi.string().required().label("Category"),
    brandId: Joi.string().required().label("Brand"),
    price: Joi.string().required().label("Price"),
    note: Joi.string().label("Note"),
});

function Products() {
    const {products,setProducts,categories,units,brands,fetchProducts} = useContent();
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    // const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const pageSize = 10;
    const [validations, setValidations] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        unitId: "",
        brandId: "",
        code: "",
        price: "",
        categoryId: "",
        note: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({})
    }

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData({
            name: "",
            unitId: "",
            brandId: "",
            code: "",
            price: "",
            categoryId: "",
            note: "",
        });
    };
    const getPagedData = () => {
        let filtered = products;
        if (search) {
            filtered = filtered.filter((product) =>
                (product.name.toLowerCase() || '').includes(search.toLowerCase()) ||
                (product.code.toLowerCase() || '').includes(search.toLowerCase()) ||
                (product.status.toLowerCase() || '').includes(search.toLowerCase()) ||
                (product.note.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedProducts} = getPagedData();
    const from = paginatedProducts.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            code: product.code,
            unitId: product.unitId,
            categoryId: product.categoryId,
            note: product.note,
            price: Number(product.price),
            brandId: product.brandId,
        });
        setSelectedProductId(product.id);
        setIsEditMode(true);
        setShowModal(true);
    };


    const handleDelete = (productId) => {
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
                http.delete(`/products/${productId}`)
                    .then((res) => {
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: res.data.message,
                            icon: "success"
                        }).then(() => {
                            setProducts(products.filter((product) => product.id !== productId));
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
        setValidations("");
        setErrors({})
        const {error} = validationSchema.validate(formData, {abortEarly: false});
        if (error) {
            setErrors(error.details.reduce((errors, error) => {
                errors[error.path[0]] = error.message;
                return errors;
            }, {}));
        } else {
            const url = isEditMode ? `/products/${selectedProductId}` : "/products";
            const method = isEditMode ? "put" : "post";
            http[method](url, {
                name: formData.name,
                code: formData.code,
                unitId: formData.unitId,
                note: formData.note,
                categoryId: formData.categoryId,
                brandId: formData.brandId,
                price: Number(formData.price)
            }).then((res) => {
                toast.success(res.data.message);
                if (res.data.action === 1) {
                    handleCloseModal();
                    fetchProducts();
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
        setActiveLinkGlobal("products");
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
                        Products
                    </li>
                </ol>
            </nav>
            <h5 className="my-4"></h5>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title my-3">All Products</h5>
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
                                    Add Product
                                </button>
                            </div>
                            <Table hover responsive>
                                <thead
                                    className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                    style={{borderRadius: "20"}}>
                                <Th column="Created At"/>

                                <Th column="Name"/>
                                <Th column="Code"/>
                                <Th column="Price"/>
                                <Th column="Status"/>
                                <Th column="Description"/>
                                <th className="border-top-0 border-0 border border-primary cursor-pointer">
                                    <div
                                        className="d-flex align-items-center tw-bg-gray-100 tw-text-gray-400 justify-content-center h-100 tw-py-3 mx-0 fw-normal tw-bg-opacity-70 pe-2">
                                        <span>Action</span>
                                    </div>
                                </th>
                                </thead>
                                <tbody>
                                {
                                    paginatedProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td className="tw-text-xs">{format(new Date(product.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                            <td className="tw-text-xs">{product.name}</td>
                                            <td className="tw-text-xs">{product.code}</td>
                                            <td className="tw-text-xs">{product.price}</td>
                                            <td className="tw-text-xs">
                                                    <span
                                                        className={`badge bg-${product.status === 'active' ? 'success' : 'danger'}`}>{product.status}</span>

                                            </td>
                                            <td className="tw-text-xs">{product.note}</td>
                                            <td className="tw-text-xs">
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="primary" className="tw-text-white"
                                                                     id="dropdown-basic">
                                                        options
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() => handleEdit(product)}>Edit</Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => handleDelete(product.id)}>Delete</Dropdown.Item>
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
                                            className="tw-text-gray-500">Showing {from} to {to} of {products?.length} entries</span>
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

            <Modal show={showModal} size="lg" onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? "Edit Product" : "Add New Product"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={saveProduct}>
                    <Modal.Body>
                        {
                            validations.length > 0 &&
                            <div className="alert alert-danger">
                                <ul>
                                    {
                                        validations.map((error, index) => (
                                            <li className="text-danger" key={index}>{error?.msg}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <FormField label="Name"
                                               error={errors.name}
                                               onChange={handleChange} value={formData.name}
                                               name="name" id="name"/>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <FormField label="Code"
                                               error={errors.code}
                                               onChange={handleChange}
                                               value={formData.code}
                                               name="code" id="code"/>
                                </div>
                            </div>
                        </div>
                        <Row>
                            <div className="mb-3 col-lg-6">
                                <label htmlFor="role" className="form-label">
                                    Units <FaAsterisk className="text-danger ms-1" size={10}/>
                                </label>
                                <select className={`form-select ${errors.unitId ? 'is-invalid' : ''} tw-py-3`}
                                        onChange={handleChange} name="unitId"
                                        value={formData.unitId} aria-label="Default select example">
                                    <option value="" disabled>Select unit</option>
                                    {
                                        units.map((unit, index) => (
                                            <option key={index} value={unit.id}>{unit.name}</option>
                                        ))
                                    }
                                </select>
                                <ErrorMessage error={errors.unitId}/>
                            </div>
                            <div className="mb-3 col-lg-6">
                                <label htmlFor="role" className="form-label">
                                    Brands <FaAsterisk className="text-danger ms-1" size={10}/>
                                </label>
                                <select className={`form-select ${errors.brandId ? 'is-invalid' : ''} tw-py-3`}
                                        onChange={handleChange} name="brandId"
                                        value={formData.brandId} aria-label="Default select example">
                                    <option value="" disabled>Select Brand</option>
                                    {
                                        brands.map((unit, index) => (
                                            <option key={index} value={unit.id}>{unit.name}</option>
                                        ))
                                    }
                                </select>
                                <ErrorMessage error={errors.brandId}/>
                            </div>
                            <div className="mb-3 col-lg-6">
                                <label htmlFor="role" className="form-label">
                                    Category <FaAsterisk className="text-danger ms-1" size={10}/>
                                </label>
                                <select className={`form-select ${errors.categoryId ? 'is-invalid' : ''} tw-py-3`}
                                        onChange={handleChange} name="categoryId"
                                        value={formData.categoryId} aria-label="Default select example">
                                    <option value="" disabled>Select Category</option>
                                    {
                                        categories.map((cat, index) => (
                                            <option key={index} value={cat.id}>{cat.name}</option>
                                        ))
                                    }
                                </select>
                                <ErrorMessage error={errors.categoryId}/>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <FormField label="Price"
                                               type="number"
                                               error={errors.price}
                                               onChange={handleChange}
                                               value={formData.price}
                                               name="price" id="price"/>
                                </div>
                            </div>
                        </Row>

                        <div className="mb-3">
                            <FormField label="Notes"
                                       name="note"
                                       error={errors.note}
                                       type="textarea"
                                       onChange={handleChange}
                                       value={formData.note}
                                       id="note"/>
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

export default Products;