import React from "react";
import { Helmet } from "react-helmet";
import Core from "./Hooks/Core";

export default function PageNotFound() {
    const {loadExternalStyle} = Core()
    
    loadExternalStyle('/bulma.min.css')
    return (
        <>
            <Helmet>
                <title>Page Not Found - TailorsKit</title>
                <meta property="og:title" content={"Page Not Found - TailorsKit"} />
                <meta name="description" content={"The page or resource you're looking for cannot be found"} />
            </Helmet>
            <section className="p-50 has-text-centered">
                <div className="mw-500 m-auto">
                    <img src="/404-error.svg" alt="Page Not Found" width={"500px"} />
                </div>
                <h4 className="title col-title is-3">PAGE NOT FOUND</h4>
                <h5 className="subtitle">The Requested Resource Cannot Be Found</h5>
                <p className="is-bold mb-3">We've searched far and wide, but cannot find the page or resource that you are looking for.</p>
                <a onClick={() => window.history.go(-1)} className="button is-app-primary">Go back</a>
            </section>
        </>
    )
}