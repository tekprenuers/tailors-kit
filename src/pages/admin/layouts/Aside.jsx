import React, { useEffect } from "react";
import Core from "../../Hooks/Core";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// import "../../../assets/main.min.css";

export default function Aside() {
    const { LoadExternalScript, isAuthenticated, loadExternalStyle } = Core()
    const location = useLocation();
    // console.log(location);
    //load css file
    loadExternalStyle('/main.min.css')
    //load the chart script
    LoadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js");
    LoadExternalScript("/chart.sample.js");

    const navigate = useNavigate()

    //load javascript file
    LoadExternalScript("/dash.js");
    //add class to HTML tag
    window.document.querySelector('html').setAttribute("class", "has-aside-left has-aside-mobile-transition has-navbar-fixed-top has-aside-expanded")

    //check if user is logged in
    useEffect(() => {
        isAuthenticated().then(res => {
            if (!res) window.location.href = import.meta.env.VITE_FRONTEND_URL + '/login';
        })
    }, [])
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnHover
                draggable
                theme="colored"
            />
            <aside className="aside is-placed-left is-expanded">
                <div className="aside-tools">
                    <div className="aside-tools-label">
                        <span>TAILOR'S KIT</span>
                    </div>
                </div>
                <div className="menu is-menu-main">
                    <p className="menu-label">General</p>
                    <ul className="menu-list">
                        <li>
                            <a href={import.meta.env.VITE_DASHBOARD_URL + '/home'} className="router-link-active has-icon">
                                <span className="icon"><i className="mdi mdi-desktop-mac"></i></span>
                                <span className="menu-item-label">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href={import.meta.env.VITE_FRONTEND_URL + '/contact-us'} className="router-link-active has-icon">
                                <span className="icon"><i className="mdi mdi-clock"></i></span>
                                <span className="menu-item-label">My Subscription</span>
                            </a>
                        </li>
                        <li>
                            <a href={import.meta.env.VITE_FRONTEND_URL + '/contact-us'} className="router-link-active has-icon">
                                <span className="icon"><i className="mdi mdi-email"></i></span>
                                <span className="menu-item-label">Contact us</span>
                            </a>
                        </li>
                    </ul>
                    <p className="menu-label">CUSTOMERS</p>
                    <ul className="menu-list">
                        <li>
                            <a className="has-icon has-dropdown-icon">
                                <span className="icon">
                                    <i className="mdi mdi-account-multiple-outline"></i>
                                </span>
                                <span className="menu-item-label">Customers</span>
                                <div className="dropdown-icon">
                                    <span className="icon"><i className="mdi mdi-plus"></i></span>
                                </div>
                            </a>
                            <ul>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL + '/add-customer'}>
                                        <span>Add customer</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL + '/view-customers'}>
                                        <span>View Customers</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a className="has-icon has-dropdown-icon">
                                <span className="icon">
                                    <i className="mdi mdi-ruler-square"></i>
                                </span>
                                <span className="menu-item-label">Measurements</span>
                                <div className="dropdown-icon">
                                    <span className="icon"><i className="mdi mdi-plus"></i></span>
                                </div>
                            </a>
                            <ul>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/update-measurement'}>
                                        <span>Update Measurement</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a className="has-icon has-dropdown-icon">
                                <span className="icon">
                                    <i className="mdi mdi-view-grid-outline"></i>
                                </span>
                                <span className="menu-item-label">Requests</span>
                                <div className="dropdown-icon">
                                    <span className="icon"><i className="mdi mdi-plus"></i></span>
                                </div>
                            </a>
                            <ul>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/new-request'}>
                                        <span>New Request</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/view-requests'}>
                                        <span>View Requests</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a className="has-icon has-dropdown-icon">
                                <span className="icon">
                                    <i className="mdi mdi-cogs"></i>
                                </span>
                                <span className="menu-item-label">Settings</span>
                                <div className="dropdown-icon">
                                    <span className="icon"><i className="mdi mdi-plus"></i></span>
                                </div>
                            </a>
                            <ul>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/settings/update-profile'}>
                                        <span>My Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/settings/update-measurement'}>
                                        <span>My Measurements</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p className="menu-label">About</p>
                    <ul className="menu-list">
                        <li>
                            <a href="https://justboil.me/bulma-admin-template/free-html-dashboard/" className="has-icon">
                                <span className="icon"><i className="mdi mdi-help-circle"></i></span>
                                <span className="menu-item-label">About</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside></>
    )
}