import {Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import Sidebar from "../components/SideBar.jsx";
import {TopNav} from "../components/TopNav.jsx";
import {Container} from "react-bootstrap";
import Footer from "../components/Footer.jsx";

export default function MasterLayout() {
    let [isOpen, setIsOpen] = useState(true);
    useEffect(() => {
        window.addEventListener("resize", function () {
            setIsOpen(window.innerWidth > 992);
        });
        setIsOpen(window.innerWidth > 992);
    }, []);

    function toggle() {
        setIsOpen(!isOpen);
    }

    return (
        <div className="bg-secondary bg-opacity-10">
            <Container fluid={true} className="p-0">
                <div className="d-flex justify-content-between">
                    <Sidebar isOpen={isOpen}/>
                    <div
                        className={`d-flex flex-column justify-content-between  tw-min-h-screen  ${isOpen ? 'rounded-end-0' : 'rounded-0'} w-100`}>
                        <TopNav toggle={toggle} isOpen={isOpen}/>
                        {/* main */}
                        <main className="flex-grow-1 bg-white  tw-w-full ">
                            <div className="  rounded-0">
                                <div className="bg-light   d-flex flex-column justify-content-between min-vh-100 ">
                                    <Outlet/>

                                </div>
                            </div>
                        </main>
                        <div>
                            <Footer/>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}