// FormField.jsx
import ErrorMessage from './ErrorMessage';
import PropTypes from "prop-types";
import {TbAsterisk} from "react-icons/tb";
import {FaAsterisk} from "react-icons/fa6";

const FormField = ({label, id, name, value, error, onChange, accept, isRequired = true, type = 'text', ...props}) => {
    const InputComponent = type === 'textarea' ? 'textarea' : 'input';

    return (
        <div>
            {/* Label */}
            <label htmlFor={id} className="form-label">
                {label}
                {isRequired && <FaAsterisk className="text-danger ms-1" size={10}/>}
            </label>

            {/* Input field or textarea */}
            <InputComponent
                value={value}
                className={`form-control focus:tw-ring-0 tw-py-3 ${error ? 'is-invalid' : ''}`}
                onChange={onChange}
                id={id}
                name={name}
                {...props}
                type={type}
                accept={accept}
            />

            {/* Error message */}
            <ErrorMessage error={error}/>
        </div>
    );
};

export default FormField;

FormField.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    error: PropTypes.string,
    onChange: PropTypes.func,
    type: PropTypes.string,
    accept: PropTypes.string,
    isRequired: PropTypes.bool
};
