import PropTypes from "prop-types";

const ErrorMessage = ({error}) => {
    const formattedError = error ? error.replace(/['"]+/g, '') : null;
    return (
        formattedError && <span className="invalid-feedback">{formattedError}</span>
    );
};

export default ErrorMessage;

ErrorMessage.propTypes = {
    error: PropTypes.string
};