import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import FormField from "./common/FormField.jsx";
import http from "../services/httpService.js";
import {toast} from "react-toastify";
import PropTypes from "prop-types";
import {BiSave} from "react-icons/bi";
import Joi from "joi";

const validationSchema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email({tlds:{allow:false}}).required().label("Email"),
    phone: Joi.string().required().label("Phone"),
    address: Joi.string().required().label("Address"),
});

function SaveCustomerModel({
                               formData,
                               setFormData,
                               showModal,
                               handleCloseModal,
                               fetchCustomers,
                               selectedUserId,
                               isEditMode
                           }) {

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: null
        });
    }
    const saveUser = (e) => {
        e.preventDefault();
        setErrors({})
        const {error} = validationSchema.validate(formData, {abortEarly: false});
        if (error) {
            setErrors(error.details.reduce((errors, error) => {
                errors[error.path[0]] = error.message;
                return errors;
            }, {}));
        } else {
            setIsLoading(true);
            const url = isEditMode ? `/customers/${selectedUserId}` : "/customers";
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
                let response = error?.response?.data;
                console.log(error);
            }).finally(() => {
                handleCloseModal();
                fetchCustomers();
                setIsLoading(false)
            });
        }
    }
    return (
        <div>
            <Modal show={showModal} size="lg" onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? "Edit Customer" : "Add New Customer"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={saveUser}>
                    <Modal.Body>

                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <FormField label="Name"
                                               onChange={handleChange}
                                               error={errors.name}
                                               value={formData.name}
                                               name="name" id="name"/>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <FormField label="Email"
                                               onChange={handleChange}
                                               error={errors.email}
                                               value={formData.email}
                                               name="email" id="email"/>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <FormField label="Phone"
                                       name="phone"
                                       error={errors.phone}
                                       onChange={handleChange}
                                       value={formData.phone}
                                       id="phone"/>
                        </div>
                        <div className="mb-3">
                            <FormField label="Address"
                                       name="address"
                                       type="textarea"
                                       error={errors.address}
                                       onChange={handleChange}
                                       value={formData.address}
                                       id="address"/>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit" className="text-white d-flex gap-2 align-items-center">
                            {
                                isLoading ? <span className="spinner-border spinner-border-sm"/> : <BiSave/>
                            }
                            Save
                        </Button>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>

                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

SaveCustomerModel.propTypes = {
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    fetchCustomers: PropTypes.func.isRequired,
    selectedUserId: PropTypes.number,
    isEditMode: PropTypes.bool
};

export default SaveCustomerModel;