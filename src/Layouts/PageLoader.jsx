import  loader from '../assets/loader.svg';
const PageLoader = () => {
    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
            <div className="d-flex align-items-center gap-2">
                <img src={loader} className="tw-h-20" alt="loader"/>
                <h6 className="text-center">Loading...</h6>
            </div>
        </div>
    );
}

export default PageLoader;