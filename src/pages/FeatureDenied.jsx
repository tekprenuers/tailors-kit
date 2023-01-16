import React from "react";

export default function FeatureDenied() {
    return(
        <>
        <section className="feature-denied-section">
            <div className="overlay"></div>
            <div className="has-text-centered denied-content">
                <h4 className="title is-4">Get Access To Our <span className="has-text-app-primary">PREMIUM FEATURES</span> </h4>
                <h5 className="subtitle">STARTING FROM &#8358;5,500 per year</h5>
                <a className="button is-app-primary is-cta">Subscribe Now</a>
            </div>
        </section>
        </>
    )
}