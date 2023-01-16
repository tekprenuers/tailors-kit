import React from "react";

export default function BreadCrumb({ pageName = "Dashboard", showButton = true, buttonProp = {iconClass :"mdi mdi-account", buttonClass : "button is-primary", buttonText :"Update Profile", buttonLink : import.meta.env.VITE_DASHBOARD_URL + '/update-profile'} }) {
    return (
        <section className="section is-title-bar">
            <div className="level">
                <div className="level-left">
                    <div className="level-item">
                        <ul>
                            <li>Admin</li>
                            <li>{pageName}</li>
                        </ul>
                    </div>
                </div>
                {
                    (showButton == "true") ?
                        <div className="level-right">
                            <div className="level-item">
                                <div className="buttons is-right">
                                    <a
                                        href={buttonProp.buttonLink}
                                        target="_self"
                                        className={buttonProp.buttonClass}
                                    >
                                        <span className="icon">
                                            <i className={buttonProp.iconClass}></i>
                                        </span>
                                        <span>{buttonProp.buttonText}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>
        </section>
    );
}
