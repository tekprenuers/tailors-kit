import React from "react";

export default function MeasurementCustomerSearch() {
    return (
        <section className="section is-main-section">
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">
                        <span className="icon"><i className="mdi mdi-account-multiple"></i></span>
                        Account Settings
                    </p>
                </header>
                <div className="card-content p-5">
                    <div className="columns">
                        <div className="column is-half">
                            <div className="card settings-card p-3 m-auto mw-300">
                                <div className="card-body has-text-centered">
                                    <h4 className="title is-5 mb-0">My Profile</h4>
                                    <p className="has-text-app-primary"><i className="mdi mdi-account fa-3x"></i></p>
                                    <p>
                                        <a href={import.meta.env.VITE_DASHBOARD_URL+'/settings/update-profile'} className="button is-app-primary">Update</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-half">
                            <div className="card settings-card p-3 m-auto mw-300">
                                <div className="card-body has-text-centered">
                                    <h4 className="title is-5 mb-0">My Measurements</h4>
                                    <p className="has-text-app-primary"><i className="mdi mdi-ruler-square fa-3x"></i></p>
                                    <p>
                                        <a href={import.meta.env.VITE_DASHBOARD_URL+'/settings/update-measurement'} className="button is-app-primary">Update</a>
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