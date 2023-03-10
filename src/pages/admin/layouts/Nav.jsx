import React, {useState} from "react";
import Core from "../../Hooks/Core";

export default function Nav() {
    const {getUserData, doLogOut} = Core()

    const userData = getUserData();

    const asideMobileToggle = (e) => {
        const dropdownIcon = e.currentTarget.querySelector('.mdi')
        document.documentElement.classList.toggle('has-aside-mobile-expanded')
        dropdownIcon.classList.toggle('mdi-forwardburger')
        dropdownIcon.classList.toggle('mdi-backburger')
    }

    const navbarMobileToggle = (e) => {
        const dropdownIcon = e.currentTarget.querySelector('.mdi')

        document.getElementById(e.currentTarget.getAttribute('data-target')).classList.toggle('is-active')
        dropdownIcon.classList.toggle('mdi-dots-vertical')
        dropdownIcon.classList.toggle('mdi-close')
    }


    return (
        <>
            <nav id="navbar-main" className="navbar is-fixed-top">
                <div className="navbar-brand">
                    <a onClick={asideMobileToggle} className="navbar-item is-hidden-desktop jb-aside-mobile-toggle">
                        <span className="icon"><i className="mdi mdi-forwardburger mdi-24px"></i></span>
                    </a>
                    <div className="navbar-item has-control">
                        <div className="control"><img src="/navbar-icon.png" /></div>
                    </div>
                </div>
                <div className="navbar-brand is-right">
                    <a onClick={navbarMobileToggle} className="navbar-item is-hidden-desktop jb-navbar-menu-toggle" data-target="navbar-menu">
                        <span className="icon"><i className="mdi mdi-dots-vertical"></i></span>
                    </a>
                </div>
                <div className="navbar-menu fadeIn animated faster" id="navbar-menu">
                    <div className="navbar-end">
                        <div className="d-none navbar-item has-dropdown has-dropdown-with-icons has-divider is-hoverable">
                            <a className="navbar-link is-arrowless">
                                <span className="icon"><i className="mdi mdi-menu"></i></span>
                                <span>Sample Menu</span>
                                <span className="icon">
                                    <i className="mdi mdi-chevron-down"></i>
                                </span>
                            </a>
                            <div className="navbar-dropdown d-none">
                                <a href={import.meta.env.VITE_DASHBOARD_URL+'/update-profile'} className="navbar-item">
                                    <span className="icon"><i className="mdi mdi-account"></i></span>
                                    <span>My Profile</span>
                                </a>
                                <a className="navbar-item">
                                    <span className="icon"><i className="mdi mdi-settings"></i></span>
                                    <span>Settings</span>
                                </a>
                                <a className="navbar-item">
                                    <span className="icon"><i className="mdi mdi-email"></i></span>
                                    <span>Messages</span>
                                </a>
                                <hr className="navbar-divider" />
                                    <a className="navbar-item">
                                        <span className="icon"><i className="mdi mdi-logout"></i></span>
                                        <span>Log Out</span>
                                    </a>
                            </div>
                        </div>
                        <div className="navbar-item has-dropdown has-dropdown-with-icons has-divider has-user-avatar is-hoverable">
                            <a className="navbar-link is-arrowless">
                                <div className="is-user-avatar">
                                    <img src={ (userData?.image) ? userData?.image : "https://avatars.dicebear.com/v2/initials/john-doe.svg"} alt={userData?.fname} />
                                </div>
                                <div className="is-user-name"><span>{userData?.fname}</span></div>
                                <span className="icon"><i className="mdi mdi-chevron-down"></i></span>
                            </a>
                            <div className="navbar-dropdown">
                                <a href={import.meta.env.VITE_DASHBOARD_URL+'/settings'} className="navbar-item">
                                    <span className="icon"><i className="mdi mdi-account-settings"></i></span>
                                    <span>Settings</span>
                                </a>
                                <hr className="navbar-divider" />
                                    <a onClick={(e) => doLogOut()} className="navbar-item">
                                        <span className="icon"><i className="mdi mdi-logout"></i></span>
                                        <span>Log Out</span>
                                    </a>
                            </div>
                        </div>
                        <a href={import.meta.env.VITE_DASHBOARD_URL+'/help-desk'} title="Help Desk" className="navbar-item has-divider is-desktop-icon-only">
                            <span className="icon"><i className="mdi mdi-help-circle-outline"></i></span>
                            <span>Help Desk</span>
                        </a>
                        <a onClick={(e) => doLogOut()} title="Log out" className="navbar-item is-desktop-icon-only">
                            <span className="icon"><i className="mdi mdi-logout"></i></span>
                            <span>Log out</span>
                        </a>
                    </div>
                </div>
            </nav>
        </>
    )
}