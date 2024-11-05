import {useState} from "react";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import FormField from "./FormField.jsx";
import http from "../../services/httpService.js";
import Joi from "joi";
import {Spinner} from "react-bootstrap";
import {toast} from "react-toastify";

const PasswordField = ({label, name, value, onChange, error}) => {
    const [isVisible, setIsVisible] = useState(false);


    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="mb-3 tw-relative">
            <FormField
                label={label}
                type={isVisible ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                error={error}
            />
            <span
                className="tw-absolute tw-bottom-1 end-0 translate-middle-y me-3"
                onClick={toggleVisibility}
                style={{cursor: "pointer"}}
            >
                {isVisible ? <FaEyeSlash className="text-primary"/> : <FaEye className="text-primary"/>}
            </span>
        </div>
    );
};

const PasswordForm = ({setShow}) => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const validationSchema = Joi.object({
        currentPassword: Joi.string().required().label("Current Password"),
        newPassword: Joi.string().required().min(2).label("New Password"),
        confirmPassword: Joi.string().required().label("Confirm Password"),
    });
    const [validations, setValidations] = useState("");
    const [errors, setErrors] = useState({});
    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
        setErrors({...errors, [name]: null});
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({})
        const {error} = validationSchema.validate(formData, {abortEarly: false});
        if (error) {
            setErrors(error.details.reduce((errors, error) => {
                errors[error.path[0]] = error.message;
                return errors;
            }, {}));
        } else {
            setSubmitting(true);
            http.put("/auth/change-password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            }).then((response) => {
                console.log(response.data);
                toast.success(response.data.message);
            }).catch((error) => {
                console.log(error?.response?.data?.errors?.map((error) => error.msg));
                toast.error(error?.response?.data);
                setValidations(error?.response?.data?.errors);
            }).finally(() => {
                setSubmitting(false);
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                // {
                //     !validations && setShow(false);
                // }
            });
        }
    }
    return <div className="card card-body border-0">
        {
            validations &&
            <div className="alert alert-danger">{
                validations && <ul>
                    {
                        validations.map((error, index) => (
                            <li className="text-danger" key={index}>{error?.msg}</li>
                        ))
                    }
                </ul>
            }
            </div>
        }
        <form onSubmit={handleSubmit}>
            <PasswordField label="Current Password"
                           value={formData.currentPassword}
                           onChange={handleChange}
                           error={errors.currentPassword}
                           name="currentPassword"/>
            <PasswordField label="New Password"
                           value={formData.newPassword}
                           error={errors.newPassword}
                           onChange={handleChange}
                           name="newPassword"/>
            <PasswordField label="Confirm Password"
                           value={formData.confirmPassword}
                           error={errors.confirmPassword}
                           onChange={handleChange}
                           name="confirmPassword"/>
            <button className="btn w-100 tw-py-3 my-3 btn-primary">
                Change Password
                {
                    submitting && <Spinner className="ms-2" animation="border" size="sm"/>
                }
            </button>
        </form>
    </div>
};

export default PasswordForm;