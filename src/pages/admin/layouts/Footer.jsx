import React from "react";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="container-fluid">
                    <div className="level">
                        <div className="level-left">
                            <div className="level-item">
                                Copyright © 2023, Tailors Kit
                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                <div className="logo">
                                    <a href={import.meta.env.VITE_FRONTEND_URL}><img src="/navbar-icon.png" alt="Tailors Kit" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}