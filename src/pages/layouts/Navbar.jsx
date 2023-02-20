import { Outlet, Link, useLocation } from "react-router-dom";
import React from 'react'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Core from "../Hooks/Core";

export default function Navbar() {
    const location = useLocation()
    const { loadExternalStyle } = Core()

    loadExternalStyle('/bulma.min.css')

    const toggleMobileNav = function (e) {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        document.querySelector('.navbar-burger')?.classList.toggle('is-active');
        document.querySelector('.navbar-menu')?.classList.toggle('is-active');
    }
    const unToggleMobileNav = () => {
        document.querySelector('.navbar-burger')?.classList.remove('is-active');
        document.querySelector('.navbar-menu')?.classList.remove('is-active');
    }
    //check for changes in the variable
    React.useEffect(() => {
        if (location) {
            if (document.querySelector('a')) {
                //remove any active class present in any element
                document.querySelectorAll('a').forEach(elem => {
                    elem.classList.remove('navbar-item-active')
                })
                const elem = (location.pathname && !location.search) ? document.querySelector(
                    `a[href="${location.pathname}"]`
                ) : document.querySelector(
                    `a[href="${window.location.origin + location.pathname + location.search}"]`
                );
                if (elem && !elem.classList.contains('button')) {
                    elem.classList.add('navbar-item-active')
                }
            }
        }
    }, [location])

    // 👇️ scroll to top on page change
    React.useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, []);

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
            <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="./">
                        <img src="/navbar-icon.png" />
                    </a>

                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="tailorsNavbar" onClick={(event) => toggleMobileNav(event)}>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="tailorsNavbar" className="navbar-menu">
                    <div className="navbar-end">
                        <Link onClick={unToggleMobileNav} to="/" className="navbar-item">
                            Home
                        </Link>
                        {/* <a onClick={unToggleMobileNav} href="https://forms.gle/K9Fd5yzo7m9hJW2D8" className="navbar-item" target={"_blank"}>
                            Join the waitlist
                        </a> */}
                        <Link onClick={unToggleMobileNav} to="/register" className="navbar-item">
                            Register
                        </Link>
                        <Link onClick={unToggleMobileNav} to="/login" className="navbar-item">
                            Login
                        </Link>
                        <Link onClick={unToggleMobileNav} to="/contact" className="navbar-item">
                            Contact us
                        </Link>
                        <span className="navbar-item">
                        <button className="button is-app-primary pwaAppInstallBtn">
                            Install TailorsKit
                        </button>
                        </span>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    )
}