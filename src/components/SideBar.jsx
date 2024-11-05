import PropTypes from 'prop-types';
import SideBarLink from "./SideBarLink.jsx";
import {GiExitDoor} from "react-icons/gi";
import {FaFileInvoiceDollar, FaUserPlus, FaUsers} from "react-icons/fa";
import {TiHomeOutline} from "react-icons/ti";
import {IoSettingsOutline} from "react-icons/io5";
import {BiBarChartAlt2} from "react-icons/bi";
import {TbDatabaseDollar, TbUsersGroup} from "react-icons/tb";
import {FaCartShopping, FaSackDollar, FaScaleBalanced} from "react-icons/fa6";
import {VscFileSubmodule} from "react-icons/vsc";
import {HiOutlineMegaphone} from "react-icons/hi2";
import {Link} from "react-router-dom";
import {useActiveLink} from "../providers/ActiveLinkProvider.jsx";
import SideBarLinks from "./SideBarLinks.jsx";
import {SubmenuLinks} from "./SubmenuLinks.jsx";
import {LuPackageOpen, LuUserPlus2} from "react-icons/lu";
import {IconReceipt} from "@tabler/icons-react";
import {useProfile} from "../providers/AuthProvider.jsx";
import {FiShoppingCart} from "react-icons/fi";
import {PiUsersThreeBold} from "react-icons/pi";

export default function SideBar({isOpen}) {
    const {activeLink} = useActiveLink();
    const {user} = useProfile();

    return (
        <aside
            className={`tw-min-h-[72vh] mx-0 px-1 tw-bg-gray-100    py-4 tw-flex-shrink-0 border-end position-relative tw-bg-repeat tw-bg-contain py-3 tw-border-slate-100 tw-transition-all ${isOpen ? 'tw-w-64' : 'tw-w-0 tw-opacity-0'}`}>
            <div className="d-flex flex-column justify-content-between h-100 position-relative">
                <div>
                    <div className="mb-3 text-center mx-1 d-flex justify-content-between logo-container">
                        <div className="d-flex align-items-center gap-2">
                            <div
                                className="tw-w-10 text-white fw-bold tw-h-10 bg-primary tw-rounded-xl tw-flex tw-items-center tw-justify-center">
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

                        <SideBarLink
                            path='/dashboard'
                            text="Dashboard"
                            isActive={activeLink === 'dashboard'}
                            icon={TiHomeOutline}
                            title="Dashboard"
                        />
                        {
                            user?.user?.role?.permissions?.includes('manage-branches') &&
                            <SideBarLink
                                path='/warehouse'
                                text="Branches"
                                isActive={activeLink === 'warehouses'}
                                icon={GiExitDoor}
                                title="Branches"
                            />
                        }
                        {
                            user?.user?.role?.permissions?.includes('manage-sales') &&
                            <SideBarLink
                                path='/sales'
                                text="Sales"
                                isActive={activeLink === 'sales'}
                                icon={FiShoppingCart}
                                title="Sales"
                            />
                        }
                        {
                            user?.user?.role?.permissions?.includes('manage-purchases') &&
                            <SideBarLink
                                path='/purchase'
                                text="Purchases"
                                isActive={activeLink === 'purchase'}
                                icon={IconReceipt}
                                title="Purchases"
                            />
                        }
                    </div>
                    {
                        user?.user?.role?.permissions?.includes('manage-products', 'manage-product-categories') &&
                        <SideBarLinks icon={LuPackageOpen} text="Products">
                            {
                                user?.user?.role?.permissions?.includes('manage-products') &&
                                <SubmenuLinks path={'/products'} text={'Product'}
                                              isActive={activeLink === 'products'}/>
                            }
                            {
                                user?.user?.role?.permissions?.includes('manage-product-categories') &&
                                <SubmenuLinks path={'/product-category'} text={'Product Categories'}
                                              isActive={activeLink === 'categories'}/>
                            }
                            {
                                user?.user?.role?.permissions?.includes('manage-brands') &&
                                <SubmenuLinks path={'/brands'} text={'Brands'}
                                              isActive={activeLink === 'brands'}/>
                            }
                            {
                                user?.user?.role?.permissions?.includes('manage-units') &&
                                <SubmenuLinks path={'/units'} text={'Units'} isActive={activeLink === 'units'}/>
                            }
                        </SideBarLinks>
                    }
                    <span className="px-3 mb-2 fw-semibold tw-text-gray-400">TEAM MANAGEMENT</span>
                    <SideBarLinks icon={TbUsersGroup  } text="People">
                        {
                            user?.user?.role?.permissions?.includes('manage-users') &&
                            <SubmenuLinks path={'/users'} text={'Users'} isActive={activeLink === 'user'}/>
                        }
                        {
                            user?.user?.role?.permissions?.includes('manage-customers') &&
                            <SubmenuLinks path={'/customers'} text={'Customers'}
                                          isActive={activeLink === 'customers'}/>
                        }
                    </SideBarLinks>
                    {
                        user?.user?.role?.permissions?.includes('manage-suppliers') &&
                        <SideBarLink
                            path='/suppliers'
                            text="Suppliers"
                            isActive={activeLink === 'supp'}
                            icon={TbDatabaseDollar}
                            title="Suppliers"
                        />
                    }
                    {
                        user?.user?.role?.permissions?.includes('manage-roles') &&
                        <SideBarLink
                            path='/roles'
                            text="Roles/Permissions"
                            isActive={activeLink === 'roles'}
                            icon={LuUserPlus2 }
                            title="Roles/Permissions"
                        />
                    }
                    <span className="px-3 mb-2 fw-semibold tw-text-gray-400">Lists</span>
                    {
                        user?.user?.role?.name==='Administrator' &&
                        <SideBarLink
                            path='/reports'
                            text="Reports"
                            isActive={activeLink === 'reports'}
                            icon={BiBarChartAlt2}
                            title="Reports"
                        />
                    }
                    <SideBarLink
                        path='/settings'
                        text="Settings"
                        isActive={activeLink === 'settings'}
                        icon={IoSettingsOutline}
                        title="Settings"
                    />

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
