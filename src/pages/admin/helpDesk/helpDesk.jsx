import React from "react";
import { Helmet } from "react-helmet";

export default function HelpDesk() {
    return (
        <section className="section is-main-section">
            <Helmet>
                <title>Settings Page - TailorsKit</title>
                <meta property="og:title" content={"Help Desk - TailorsKit"} />
                <meta name="description" content={"View the various channels that can provide support in case you encounter issues while using TailorsKit"} />
            </Helmet>
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        <span className="icon"><i className="mdi mdi-help-box"></i></span>
                        Help Channels
                    </p>
                </header>
                <div className="card-content p-5">
                    <p className="notification is-info is-light">We encourage you to visit the Knowledge panel if you have any inquiry regarding the use of TailorsKit.</p>
                    <div className="columns">
                        <div className="column is-half">
                            <div className="card help-desk-card p-5 m-auto mw-300">
                                <div className="card-body has-text-centered">
                                    <h4 className="title is-5 mb-0">Knowledge Panel</h4>
                                    <p className="has-text-app-primary"><i className="mdi mdi-library fa-3x"></i></p>
                                    <p>
                                        <a href={import.meta.env.VITE_DASHBOARD_URL + '/help-desk/knowledge-panel'} className="button is-app-primary">Visit now</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-half">
                            <div className="card help-desk-card p-5 m-auto mw-300">
                                <div className="card-body has-text-centered">
                                    <h4 className="title is-5 mb-0">Contact Support</h4>
                                    <p className="has-text-app-primary"><i className="mdi mdi-email-fast fa-3x"></i></p>
                                    <p>
                                        <a href={import.meta.env.VITE_DASHBOARD_URL + '/help-desk/support'} className="button is-app-primary">Send mail</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}