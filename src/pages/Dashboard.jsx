
import { Container } from 'react-bootstrap';
import { HiOutlineDownload } from 'react-icons/hi';
import { FiArrowUpRight } from 'react-icons/fi';
import PercentStackedBarChart from '../components/PercentStackedBarChart';
import {TbDotsVertical} from "react-icons/tb";
import BarCharts from "../components/BarChart.jsx";
import AllEmployees from "../components/AllEmployees.jsx";

function Dashboard() {
    return (
        <div>
            <Container fluid={true}>
                <div className="tw-flex tw-flex-col lg:tw-flex-row my-4 justify-content-between">
                    <h4>Good Morning, Turja sen</h4>
                    <div className="tw-flex tw-flex-col lg:tw-flex-row gap-2 align-items-center">
                        <select className="form-select">
                            <option>Today</option>
                            <option>Yesterday</option>
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                        <button className="btn tw-bg-violet-600 w-100 text-white d-flex align-items-center ms-2">
                            <HiOutlineDownload/>
                            Export Data
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 mb-2 col-lg-4">
                        <div className="card h-100  tw-border-gray-100 tw-border-2">
                            <div className="card-body text-black">
                                <div className="d-flex justify-content-between">
                                    <h6>Total Employees</h6>
                                    <button className="btn border-0">
                                        <TbDotsVertical/>
                                    </button>
                                </div>
                                <div className="tw-bg-info tw-bg-opacity-15 mb-2 rounded align-items-center d-flex">
                                    <div className="d-flex gap-2 card-body py-2 align-items-center">
                                        <h4 className="my-0">150</h4>
                                        <span className="badge tw-bg-info tw-bg-opacity-20 text-success">
                      <FiArrowUpRight/>
                      50
                    </span>
                                    </div>
                                    <span className="text-success mx-2">Fulltime Employee</span>
                                </div>
                                <div className="tw-bg-warning tw-bg-opacity-15 rounded mb-3 align-items-center d-flex">
                                    <div className="d-flex card-body py-2 gap-2 align-items-center">
                                        <h4 className="my-0">150</h4>
                                        <span className="badge tw-text-warning tw-bg-warning tw-bg-opacity-20 rounded">
                      <FiArrowUpRight/>
                      50
                    </span>
                                    </div>
                                    <span className="tw-text-warning mx-2">Fulltime Employee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-2 col-lg-4">
                        <div className="card mb-2 tw-border-gray-100 h-100 tw-border-2">
                            <div className="card-body text-black">
                                <div className="d-flex justify-content-between">
                                    <h6>Attendance Overview</h6>
                                    <button className="btn border-0">
                                        <TbDotsVertical/>
                                    </button>
                                </div>
                                <div className=" mb-2 rounded align-items-center d-flex">
                                    <div className="d-flex justify-content-between card-body py-2 align-items-center">
                                        <h4 className="my-0">90%</h4>
                                    </div>
                                    <div className="d-flex card-body py-2 justify-content-end">
                                        <div className="badge py-1 tw-bg-teal-100 text-success">
                                            <FiArrowUpRight/>20%
                                        </div>
                                        <span className="tw-text-gray-400 mx-2">Fulltime Employee</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3 px-1">
                                        <div className="tw-bg-info w-100 tw-rounded-full  tw-h-2"></div>
                                    </div>
                                    <div className="col-3 px-1">
                                        <div className="tw-bg-warning w-100 tw-rounded-full tw-w-full tw-h-2"></div>
                                    </div>
                                    <div className="col-6 px-1">
                                        <div className="tw-bg-violet-500 w-100 tw-rounded-full tw-w-full tw-h-2"></div>
                                    </div>
                                </div>
                                <div>
                                    <ul className="nav d-flex my-3 align-items-center gap-4 ">
                                        <li className="text-muted ">
                                            <span className="legend-icon text-muted"
                                                  style={{backgroundColor: '#F0C252', borderRadius: '20px'}}></span>
                                            Sick Leave
                                        </li>

                                        <li className="text-muted ">
                                            <span className="legend-icon text-muted"
                                                  style={{backgroundColor: '#5EAFED'}}></span>
                                            Day Off
                                        </li>
                                        <li className="text-muted ">
                                            <span className="legend-icon text-muted"
                                                  style={{backgroundColor: '#8252ED', borderRadius: '20px'}}></span>
                                            On time
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-2 col-lg-4">
                        <div className="card mb-2 tw-border-gray-100 h-100 tw-border-2">
                            <div className="card-body text-black">
                                <div className="d-flex justify-content-between">
                                    <h6>Attendance Overview</h6>
                                    <button className="btn border-0">
                                        <TbDotsVertical/>
                                    </button>
                                </div>
                                <div className=" mb-2 rounded align-items-center d-flex">
                                    <div className="d-flex justify-content-between card-body py-2 align-items-center">
                                        <h4 className="my-0">90%</h4>
                                    </div>
                                    <div className="d-flex card-body py-2 justify-content-end">
                                        <div className="badge py-1 tw-bg-teal-100 text-success">
                                            <FiArrowUpRight/>20%
                                        </div>
                                        <span className="tw-text-gray-400 mx-2">Fulltime Employee</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3 px-1">
                                        <div className="tw-bg-info w-100 tw-rounded-full  tw-h-2"></div>
                                    </div>
                                    <div className="col-3 px-1">
                                        <div className="tw-bg-warning w-100 tw-rounded-full tw-w-full tw-h-2"></div>
                                    </div>
                                    <div className="col-6 px-1">
                                        <div className="tw-bg-violet-500 w-100 tw-rounded-full tw-w-full tw-h-2"></div>
                                    </div>
                                </div>
                                <div>
                                    <ul className="nav d-flex my-3 align-items-center gap-4 ">
                                        <li className="text-muted ">
                                            <span className="legend-icon text-muted"
                                                  style={{backgroundColor: '#F0C252', borderRadius: '20px'}}></span>
                                            Sick Leave
                                        </li>

                                        <li className="text-muted ">
                                            <span className="legend-icon text-muted"
                                                  style={{backgroundColor: '#5EAFED'}}></span>
                                            Day Off
                                        </li>
                                        <li className="text-muted ">
                                            <span className="legend-icon text-muted"
                                                  style={{backgroundColor: '#8252ED', borderRadius: '20px'}}></span>
                                            On time
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col-lg-12 col-xl-5">
                        <PercentStackedBarChart/>
                    </div>
                    <div className="col-lg-12 col-xl-7">
                        <BarCharts/>
                    </div>
                </div>
                <div>
                    <AllEmployees/>
                </div>
            </Container>
        </div>
    );
}

export default Dashboard;