import PropTypes from 'prop-types';
import SideBarLink from "./SideBarLink.jsx";
import {ImCodepen} from "react-icons/im";
import {GiExitDoor} from "react-icons/gi";
import {FaCalendarAlt, FaFileInvoiceDollar, FaUserPlus, FaUsers} from "react-icons/fa";
import {TiHomeOutline} from "react-icons/ti";
import {IoSettingsOutline} from "react-icons/io5";
import {IoMdNotificationsOutline} from "react-icons/io";
import {BiBarChartAlt2, BiMessageError} from "react-icons/bi";
import {TbDatabaseDollar} from "react-icons/tb";
import {FaSackDollar, FaScaleBalanced} from "react-icons/fa6";
import {VscFileSubmodule} from "react-icons/vsc";
import {HiOutlineMegaphone} from "react-icons/hi2";
import {Link} from "react-router-dom";
import {RiQuestionnaireLine} from "react-icons/ri";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import SideBarLinks from "./SideBarLinks.jsx";
import {IconTransferVertical} from "@tabler/icons-react";
import {SubmenuLinks} from "./SubmenuLinks.jsx";

export default function SideBar({isOpen}) {
    const {activeLink} = useActiveLink();
    const sideBarLinks = [
        {path: '/admin/dashboard', text: 'Dashboard', isActive: 'dashboard', icon: TiHomeOutline, title: 'Calendar'},
        {path: '/', text: 'Project', isActive: false, icon: GiExitDoor, title: 'Project'},
        {path: '/', text: 'Leave Management', isActive: false, icon: FaCalendarAlt, title: 'Leave Management'},
        {path: '/', text: 'Notification', isActive: false, icon: IoMdNotificationsOutline, title: 'Notification'},
        {path: '/', text: 'Help Center', isActive: false, icon: RiQuestionnaireLine, title: 'Help Center'},
    ];
    const TeamManagement = [
        {path: '/', text: 'Performance', isActive: false, icon: BiBarChartAlt2, title: 'Performance'},
        {path: '/admin/suppliers', text: 'Suppliers', isActive: 'supp', icon: TbDatabaseDollar, title: 'Suppliers'},
        {path: '/', text: 'Invoices', isActive: false, icon: FaFileInvoiceDollar, title: 'Invoices'},
        {path: '/', text: 'Employees', isActive: false, icon: FaUsers, title: 'Employees'},
        {path: '/admin/roles', text: 'Role/Permission', isActive: 'roles', icon: FaUserPlus, title: 'Role/Permission'},
    ];
    const Lists = [
        {path: '/', text: 'Salary Information', isActive: false, icon: FaSackDollar, title: 'Salary Information'},
        {
            path: '/',
            text: 'Compensation Breakdown',
            isActive: false,
            icon: FaScaleBalanced,
            title: 'Compensation Breakdown'
        },
        {
            path: '/',
            text: 'Project-specific Data',
            isActive: false,
            icon: VscFileSubmodule,
            title: 'Project-specific Data'
        },
        {path: '/', text: 'Settings', isActive: false, icon: IoSettingsOutline, title: 'Settings'},
    ];


    return (
        <aside
            className={`tw-min-h-[72vh] mx-0 px-1 tw-bg-gray-100   d-none d-lg-block py-4 tw-flex-shrink-0 border-end position-relative tw-bg-repeat tw-bg-contain py-3 tw-border-slate-100 tw-transition-all ${isOpen ? 'tw-w-64' : 'tw-w-0 tw-opacity-0'}`}>
            <div className="d-flex flex-column justify-content-between h-100 position-relative">
                <div>
                    <div className="mb-3 text-center mx-1 d-flex justify-content-between logo-container">
                        <div className="d-flex align-items-center gap-2">
                            <div
                                className="tw-w-10 text-white fw-bold tw-h-10 tw-bg-violet-600 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                                P
                            </div>
                            <div className=" tw-items-start">
                                <span className="tw-text-sm tw-font-semibold">POS</span>
                            </div>
                        </div>
                        <div
                            className="rounded-circle  border border-white border-3 bg-primary-subtle tw-h-11 tw-w-11">
                        </div>
                    </div>
                    <div className="tw-list-none px-1 d-flex flex-column menu-container">
                        {sideBarLinks.map((link, index) => (
                            <SideBarLink
                                key={index}
                                path={link.path}
                                text={link.text}
                                isActive={activeLink === link.isActive}
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
                            isActive={activeLink === link.isActive}
                            icon={link.icon}
                            title={link.title}
                        />
                    ))}
                    <SideBarLinks icon={FaUsers} text="People">
                        <SubmenuLinks path={'/admin/users'} text={'Users'} isActive={activeLink === 'user'}/>
                        <SubmenuLinks  path={'/admin/employees'} text={'Customers'} isActive={activeLink === 'customers'}/>
                    </SideBarLinks>
                    <span className="px-3 mb-2 fw-semibold tw-text-gray-400">Lists</span>
                    {Lists.map((link, index) => (
                        <SideBarLink
                            key={index}
                            path={link.path}
                            text={link.text}
                            isActive={activeLink === link.isActive}
                            icon={link.icon}
                            title={link.title}
                        />
                    ))}

                </div>
                <div className="text-center p-3  tw-bottom-5 tw-right-0 tw-left-0">
                    <div className="card bg-white">
                        <div className="card-body ">
                            <div className="d-flex gap-2">
                                <div
                                    className="tw-w-10 tw-h-10 tw-bg-violet-600 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                                    <HiOutlineMegaphone className="tw-text-white tw-text-lg"/>
                                </div>
                                <div className="tw-flex tw-flex-col tw-items-start">
                                    <span className="tw-text-sm tw-font-semibold">Announcements</span>
                                    <span className="tw-text-xs tw-text-gray-400">Stay updates with TurHR</span>
                                    <Link to={'/'} className="tw-text-violet-500">Create New</Link>
                                </div>
                            </div>
                            <div className="d-flex py-4 align-items-center">
                                <span className="fw-semibold">Read by:</span>
                                <div>
                                    <div className="tw-relative  mx-2">
                                        <div
                                            className="rounded-circle tw-absolute -tw-top-6 border border-white border-3 bg-danger-subtle tw-h-11 tw-w-11">
                                        </div>
                                        <div
                                            className="rounded-circle tw-absolute -tw-top-6 tw-left-6 border border-white border-3 tw-bg-violet-100 tw-h-11 tw-w-11">
                                        </div>
                                        <div
                                            className="rounded-circle tw-absolute -tw-top-6 tw-left-12 tw-bg-violet-200 border border-white border-3 tw-h-11 tw-w-11">
                                        </div>
                                        <div
                                            className="rounded-circle tw-absolute -tw-top-6 tw-left-20 tw-bg-gray-100 border border-white border-3 tw-h-11 tw-w-11">
                                        </div>
                                    </div>
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
