import React from "react"

export default function KnowledgePanel() {

    return(
        <section className="section is-main-section has-background-white">
            <p className="notification is-info is-light">On this page, you will see links to YouTube videos explaining how you can use TailorsKit</p>
            <div className="kp-divider">
                <h4 className="title is-5">Get started</h4>
                <ul>
                    <li className="kp-li">
                        <a href="">How to update your profile</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to configure your measurements</a>
                    </li>
                </ul>
            </div>
            <div className="kp-divider">
                <h4 className="title is-5">Customers</h4>
                <ul>
                    <li className="kp-li">
                        <a href="">How to add a customer</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to view all customers</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to update a customer</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to delete a customer</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to view a customer's profile</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to add a customer's measurement</a>
                    </li>
                </ul>
            </div>
            <div className="kp-divider">
                <h4 className="title is-5">Requests</h4>
                <ul>
                    <li className="kp-li">
                        <a href="">How to add a request</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to update a request</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to delete a request</a>
                    </li>
                    <li className="kp-li">
                        <a href="">How to view customer's requests</a>
                    </li>
                </ul>
            </div>
        </section>
    )
}