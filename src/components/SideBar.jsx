
import PropTypes from 'prop-types';
import SideBarLink from "./SideBarLink.jsx";
import {ImCodepen} from "react-icons/im";
import {GiExitDoor} from "react-icons/gi";
import {FaCalendarAlt, FaFileInvoiceDollar, FaUserPlus, FaUsers} from "react-icons/fa";
import {TiHomeOutline} from "react-icons/ti";
import {IoSettingsOutline} from "react-icons/io5";
import {IoMdNotificationsOutline} from "react-icons/io";
import {BiBarChartAlt2} from "react-icons/bi";
import {TbDatabaseDollar} from "react-icons/tb";
import {FaSackDollar, FaScaleBalanced} from "react-icons/fa6";
import {VscFileSubmodule} from "react-icons/vsc";
import {HiOutlineMegaphone} from "react-icons/hi2";
import {Link} from "react-router-dom";

export default function SideBar({ isOpen }) {
    const sideBarLinks = [
        { path: '/', text: 'Dashboard', isActive: true, icon: TiHomeOutline, title: 'Calendar' },
        { path: '/', text: 'Project', isActive: false, icon: GiExitDoor, title: 'Project' },
        { path: '/', text: 'Leave Management', isActive: false, icon: FaCalendarAlt, title: 'Leave Management' },
        { path: '/', text: 'Settings', isActive: false, icon: IoSettingsOutline, title: 'Settings' },
        { path: '/', text: 'Notification', isActive: false, icon: IoMdNotificationsOutline, title: 'Notification' },
        { path: '/', text: 'Help Center', isActive: false, icon: IoMdNotificationsOutline, title: 'Notification' },
    ];
    const TeamManagement = [
        { path: '/', text: 'Performance', isActive: false, icon: BiBarChartAlt2, title: 'Performance' },
        { path: '/', text: 'Payrolls', isActive: false, icon: TbDatabaseDollar , title: 'Payrolls' },
        { path: '/', text: 'Invoices', isActive: false, icon: FaFileInvoiceDollar , title: 'Invoices' },
        { path: '/', text: 'Employees', isActive: false, icon: FaUsers , title: 'Employees' },
        { path: '/', text: 'Recruitment & Hiring', isActive: false, icon: FaUserPlus , title: 'Recruitment & Hiring' },
    ];
    const Lists = [
        { path: '/', text: 'Salary Information', isActive: false, icon: FaSackDollar , title: 'Salary Information' },
        { path: '/', text: 'Compensation Breakdown', isActive: false, icon: FaScaleBalanced  , title: 'Compensation Breakdown' },
        { path: '/', text: 'Project-specific Data', isActive: false, icon: VscFileSubmodule  , title: 'Project-specific Data' },
    ];


    return (
        <aside
                className={`tw-min-h-[72vh] tw-bg-gray-100  mx-0 d-none d-lg-block py-4 tw-flex-shrink-0 border-end position-relative tw-bg-repeat tw-bg-contain py-3 tw-border-slate-100 tw-transition-all ${isOpen ? 'tw-w-64' : 'tw-w-0 tw-opacity-0'}`}>
            <div className="d-flex flex-column justify-content-between h-100 position-relative">
                <div>
                    <div className="w-100 text-center my-3 logo-container">
                        <h1 className="text-white">Logo</h1>
                    </div>
                    <div className="tw-list-none px-1 d-flex flex-column menu-container">
                        {sideBarLinks.map((link, index) => (
                            <SideBarLink
                                key={index}
                                path={link.path}
                                text={link.text}
                                isActive={link.isActive}
                                icon={link.icon}
                                title={link.title}
                            />
                        ))}
                    </div>
                    <span className="px-3 mb-2 fw-semibold tw-text-gray-400">TEAM MANAGEMENT</span>
                    {TeamManagement.map((link, index) => (
                        <SideBarLink
                            key={index}
                            path={link.path}
                            text={link.text}
                            isActive={link.isActive}
                            icon={link.icon}
                            title={link.title}
                        />
                    ))}
                    <span className="px-3 mb-2 fw-semibold tw-text-gray-400">TEAM MANAGEMENT</span>
                    {Lists.map((link, index) => (
                        <SideBarLink
                            key={index}
                            path={link.path}
                            text={link.text}
                            isActive={link.isActive}
                            icon={link.icon}
                            title={link.title}
                        />
                    ))}

                </div>
                <div className="text-center p-3 position-absolute tw-bottom-20 tw-right-0 tw-left-0">
                    <div className="card bg-white">
                        <div className="card-body">
                            <div className="d-flex gap-2">
                                <div className="tw-w-10 tw-h-10 tw-bg-violet-600 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                                    <HiOutlineMegaphone className="tw-text-white tw-text-lg"/>
                                </div>
                                <div className="tw-flex tw-flex-col tw-items-start">
                                    <span className="tw-text-sm tw-font-semibold">Announcements</span>
                                    <span className="tw-text-xs tw-text-gray-400">Stay updates with TurHR</span>

                                    <Link to={'/'} className="tw-text-violet-500">Create New</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

SideBar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
};
