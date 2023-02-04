import React from "react"

export default function KnowledgePanel() {

    return(
        <section className="section is-main-section has-background-white">
            <p className="notification is-info is-light">On this page, you will see links to YouTube videos explaining how you can use TailorsKit</p>
            <div className="kp-divider">
                <h4 className="title is-5">Get started</h4>
                <ul>
                    <li className="kp-li">
                        <a href="https://youtu.be/U6xuvUtkhpI" target={"_blank"}>How to update your profile</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/HpAbs8InH20" target={"_blank"}>How to configure your measurements</a>
                    </li>
                </ul>
            </div>
            <div className="kp-divider">
                <h4 className="title is-5">Customers</h4>
                <ul>
                    <li className="kp-li">
                        <a href="https://youtu.be/J0Cn9Hnp0lY" target={"_blank"}>How to add a customer</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/Pjov9Aa7SJo" target={"_blank"}>How to view all customers</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/802O2O_rhjo" target={"_blank"}>How to update a customer's profile</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/Pjov9Aa7SJo" target={"_blank"}>How to delete a customer</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/5aHojbK10pw" target={"_blank"}>How to view a customer's profile</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/4YBsLSJs2zU" target={"_blank"}>How to add a customer's measurement</a>
                    </li>
                </ul>
            </div>
            <div className="kp-divider">
                <h4 className="title is-5">Requests/Orders</h4>
                <ul>
                    <li className="kp-li">
                        <a href="https://youtu.be/SDBbnNrwTIU" target={"_blank"}>How to add a request for a customer</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/1KdYobMBSeg" target={"_blank"}>How to update a customer's request</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/n3ffksAhBFQ" target={"_blank"}>How to delete a customer's request</a>
                    </li>
                    <li className="kp-li">
                        <a href="https://youtu.be/n3ffksAhBFQ" target={"_blank"}>How to view a customer's request</a>
                    </li>
                </ul>
            </div>
        </section>
    )
}