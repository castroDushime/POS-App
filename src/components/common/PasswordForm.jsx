import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormField from "./FormField.jsx";

const PasswordField = ({ label, name }) => {
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
            />
            <span
                className="tw-absolute tw-bottom-1 end-0 translate-middle-y me-3"
                onClick={toggleVisibility}
                style={{ cursor: "pointer" }}
            >
                {isVisible ? <FaEyeSlash className="text-primary" /> : <FaEye className="text-primary" />}
            </span>
        </div>
    );
};

const PasswordForm = () => (
    <>
        <PasswordField label="Old Password" name="oldPassword" />
        <PasswordField label="New Password" name="newPassword" />
        <PasswordField label="Confirm Password" name="confirmPassword" />
    </>
);

export default PasswordForm;