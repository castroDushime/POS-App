function Footer() {
    return (
        <div
            className="bg-light d-flex py-3 gap-3 flex-column justify-content-lg-start align-items-center justify-content-center">
            {/*<img src={logo} alt="logo" className="tw-h-20" />*/}
            <p className="text-primary-emphasis tw-text-sm mb-0">Copyright &copy; {new Date().getFullYear()}
                <span className="text-primary-emphasis ms-1">
                  POS App All Rights Reserved
                </span>
            </p>
        </div>
    );
}

export default Footer;