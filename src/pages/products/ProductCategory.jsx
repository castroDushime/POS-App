import {Container, Table,Modal, Button, Form, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
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
import Td from "../../components/common/Td.jsx";
import brandLogo from "../../assets/brand_logo.png"

function ProductCategory() {
    const {setActiveLinkGlobal} = useActiveLink();
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const pageSize = 10;
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchCategories = () => {
        setIsLoading(true);
        http.get("/categories")
            .then((res) => {
                console.log(res);
                let data = res.data;
                setCategories(data);
            }).catch(() => {

        })
            .finally(() => {
                setIsLoading(false);
            });
    }
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files.length > 0) {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file
            });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setFormData({
            name: "",
            image: null
        });
    };
    const getPagedData = () => {
        let filtered = categories;
        if (search) {
            filtered = filtered.filter((user) =>
                (user.name.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.code.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.status.toLowerCase() || '').includes(search.toLowerCase()) ||
                (user.note.toLowerCase() || '').includes(search.toLowerCase())
            );
        }
        const paginated = paginate(filtered, currentPage, pageSize)
        return {totalCount: filtered.length, data: paginated}
    }
    const {totalCount, data: paginatedcategories} = getPagedData();
    const from = paginatedcategories.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const to = Math.min((currentPage * pageSize), totalCount);

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            image: user.image
        });
        setSelectedUserId(user.id);
        setIsEditMode(true);
        setShowModal(true);
    };


    const handleDelete = (userId) => {
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
                http.delete(`/categories/${userId}`)
                    .then((res) => {
                        console.log(res);
                        toast.success(res.data.message);
                        fetchCategories();
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
    const fetchSuppliers = () => {
        setIsLoading(true);
        http.get("/suppliers")
            .then((res) => {
                console.log(res);
                let data = res.data;
                setSuppliers(data);
            }).catch(() => {

        })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const saveProduct = (e) => {
        e.preventDefault();
        const url = isEditMode ? `/categories/${selectedUserId}` : "/categories";
        const method = isEditMode ? "put" : "post";
        http[method](url, {
            name: formData.name,
            image:formData.image
        }, {headers: {
            'Content-Type': 'multipart/form-data',
        }}).then((res) => {
            console.log(res);
            toast.success(res.data.message);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            handleCloseModal();
            fetchCategories();
        });
    }

    function handleSearch(event) {
        setSearch(event.target.value);
        console.log("Search state: ", event.target.value); // Add this line
        setCurrentPage(1);
    }

    useEffect(() => {
        fetchCategories();
        fetchSuppliers();
    }, []);
    useEffect(() => {

        setActiveLinkGlobal("categories");
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
                            Product Categories
                        </li>
                    </ol>
                </nav>
                <h5 className="my-4"></h5>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title my-3">All Product Categories</h5>
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
                                        Add Category
                                    </button>
                                </div>
                                <Table hover responsive>
                                    <thead
                                        className="tw-border-gray-100 tw-bg-gray-100 tw-bg-opacity-70 tw-border-2 rounded"
                                        style={{borderRadius: "20"}}>
                                    <Th column="Created At"/>
                                    <Th column="Product Image"/>

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
                                        paginatedcategories.map((category, index) => (
                                            <tr key={index}>
                                                <td className="tw-text-xs">{format(new Date(category.createdAt), 'dd-MM-yyy HH:mm:ss')}</td>
                                                <td className="tw-text-xs">

                                                    {category.image ? <img src={category.image}
                                                                            className="img-thumbnail rounded-circle"
                                                                            style={{width: "60px", height: "60px"}}/> :
                                                        <img src={brandLogo}
                                                             className=" rounded-circle"
                                                             style={{width: "60px", height: "60px"}}/>}
                                                </td>
                                                <td className="tw-text-xs">{category.name}</td>
                                                <Td>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" className="tw-text-white"
                                                                         id="dropdown-basic">
                                                            options
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item
                                                                onClick={() => handleEdit(category)}>Edit</Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => handleDelete(category.id)}>Delete</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </Table>
                                <div className="align-items-center d-flex justify-content-between">
                                    <div>
                                        <span
                                            className="tw-text-gray-500">Showing {from} to {to} of {categories?.length} entries</span>
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

                <Modal show={showModal}  onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditMode ? "Edit Product" : "Add New Product"}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={saveProduct}>
                        <Modal.Body className="px-4">

                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <FormField label="Name" onChange={handleChange} value={formData.name}
                                                   name="name" id="name"/>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Product image</label>
                                        <input
                                            type="file"
                                            onChange={handleChange}
                                            name="image"
                                            id="image"
                                            className="form-control tw-py-3"
                                        />
                                        {imagePreview && (
                                            <div className="mt-3 d-flex justify-content-center">
                                                <img src={imagePreview} alt="Profile Preview" className="img-thumbnail rounded-circle tw-object-contain"
                                                     style={{width: "150px", height: "150px"}}/>
                                            </div>
                                        )}
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
        }</div>

    );
}

export default ProductCategory;