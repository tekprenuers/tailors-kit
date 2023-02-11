import React, { useEffect } from "react";
import Core from "../../Hooks/Core";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// import "../../../assets/main.min.css";

export default function Aside() {
    const { LoadExternalScript, isAuthenticated, loadExternalStyle } = Core()
    const location = useLocation();
    //load css file
    loadExternalStyle('/main.min.css')
    //load the chart script
    LoadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js");
    // LoadExternalScript("/chart.sample.js");

    //load javascript file
    // LoadExternalScript("/dash.js");
    //add class to HTML tag
    window.document.querySelector('html').setAttribute("class", "has-aside-left has-aside-mobile-transition has-navbar-fixed-top has-aside-expanded")

    //check if user is logged in
    useEffect(() => {
        isAuthenticated().then(res => {
            if(!res){
                //the login url
                const loginUrl = new URL(import.meta.env.VITE_FRONTEND_URL + '/login');
                //check if user is trying to access dashboard without logging in
                if(window.location.href.match(new RegExp('/dashboard', 'i'))){
                    //redirect the user to the url he wanted to visit
                    const next = window.location.href
                    //append redirect url
                    loginUrl.searchParams.append('next', next);
                }
                //redirect
                window.location.href = loginUrl.href.toString()
            }
        })
    }, [])

    
    const submenusToggle = (e) => {
        //select the second icon
        const dropdownIcon = e.currentTarget.querySelectorAll('.mdi')[1]
        e.currentTarget.parentNode.classList.toggle('is-active')
        dropdownIcon.classList.toggle('mdi-plus')
        dropdownIcon.classList.toggle('mdi-minus')
    }
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
                            <a href={import.meta.env.VITE_DASHBOARD_URL + '/license'} className="router-link-active has-icon">
                                <span className="icon"><i className="mdi mdi-clock has-text-success"></i></span>
                                <span className="menu-item-label has-text-success">License</span>
                            </a>
                        </li>
                        <li>
                            <a href={import.meta.env.VITE_DASHBOARD_URL + '/help-desk'} className="router-link-active has-icon">
                                <span className="icon"><i className="mdi mdi-help-box"></i></span>
                                <span className="menu-item-label">Help Desk</span>
                            </a>
                        </li>
                        <li>
                            <a target={"_blank"} href="https://docs.google.com/forms/d/e/1FAIpQLSdVHMXjkB9YsFUbS0yVj8YSBGmNfUk1Oy8KpIqlQfepmFqI0g/viewform?usp=pp_url" className="router-link-active has-icon">
                                <span className="icon"><i className="mdi mdi-star"></i></span>
                                <span className="menu-item-label">Send Feedback</span>
                            </a>
                        </li>
                    </ul>
                    <p className="menu-label">CUSTOMERS</p>
                    <ul className="menu-list">
                        <li>
                            <a className="has-icon has-dropdown-icon" onClick={submenusToggle}>
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
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/add-measurement'}>
                                        <span>Add measurement</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL + '/view-customers'}>
                                        <span>View all customers</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a className="has-icon has-dropdown-icon" onClick={submenusToggle}>
                                <span className="icon">
                                    <i className="mdi mdi-cart"></i>
                                </span>
                                <span className="menu-item-label">Orders</span>
                                <div className="dropdown-icon">
                                    <span className="icon"><i className="mdi mdi-plus"></i></span>
                                </div>
                            </a>
                            <ul>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/new-order'}>
                                        <span>Create Order</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/view-orders'}>
                                        <span>View all Orders</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a className="has-icon has-dropdown-icon" onClick={submenusToggle}>
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
                                        <span>Update profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a href={import.meta.env.VITE_DASHBOARD_URL+'/settings/configure-measurements'}>
                                        <span>Configure measurements</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </aside></>
    )
}