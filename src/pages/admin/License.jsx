import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation} from "react-router-dom";
import { toast } from "react-toastify";
import Core from "../Hooks/Core";

export default function License() {
    const { getToken, Preloader } = Core();
    const [licData, setLicData] = useState({});
    const [status, setStatus] = useState("loading");
    const searchParams = new URLSearchParams(useLocation().search)
    //success
    const suc = searchParams.get('success') || ''
    //reference
    const ref = searchParams.get('reference') || ''
    useEffect(() => {
        getLicense().then((res) => {
            setStatus("loaded")
            if (res.success) {
                setLicData(res.data)
            } else {
                toast.error(res.message)
            }
        })
    }, [])

    const initPayment = (e) => {
        //the button
        const btn = e.target;
        //toggle loading state
        btn.classList.toggle('is-loading');
        //the payment url
        const payUrl = new URL(import.meta.env.VITE_BACKEND_URL + 'subscriptions/init.php');
        fetch(payUrl.href.toString(), {
            method: "get",
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    window.location.href = res.data.url
                } else {
                    toast.error("An Error has occured")
                }
            })
            .catch(err => {
                console.log(err)
                toast.error("Network Error!");
            })
    }

    const getLicense = async () => {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + 'api/license/get_license.php');

        return (await fetch(url.toString(), {
            method: "get",
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        })
            .then(res => res.json())
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log(err)
                toast.error("Network Error!");
                return;
            })
        )
    }

    return (<>
        <Helmet>
            <title>My License - TailorsKit</title>
            <meta property="og:title" content={"My License - TailorsKit"} />
            <meta name="title" content={"My License - TailorsKit"} />
            <meta name="description" content={"View how much time is left until your license expires"} />
            <meta property="og:description" content={"View how much time is left until your license expires"} />
        </Helmet>
        {
            (status !== "loaded") ?
                <>
                    {Preloader()}
                </> :
                <section className="section is-main-section has-background-white">
                    {/* //check if success & reference param is provided  */}
                    {(suc === "false") ?
                        <>
                            <div className="notification is-danger is-light">
                                <p className="mb-1">Your license renewal failed.</p>
                                <p>If you have already made payment, please contact support with this reference id: <strong>{ref}</strong></p>
                            </div>
                        </> :
                        (suc === "true") ?
                            <>
                                <div className="notification is-success is-light">
                                    <p className="mb-0">Your license was renewed successfully.</p>
                                </div>
                            </>
                            /*check if license has expired*/
                            : (licData?.expired) ? <>
                                <div className="notification is-danger is-light">
                                    <p className="mb-1">Your license has <b>expired.</b></p>
                                    <p>Click on the button below to renew your license.</p>
                                    <button className="button is-danger mt-3" onClick={(e) => initPayment(e)}>Renew License</button>
                                </div>
                            </> :
                                <div className="notification is-info is-light">
                                    {(licData?.next_renewal) ?
                                        <p className="mb-0">Your license will expire after <b>{licData.next_renewal}</b>. <br />Don't you worry, we'll let you know when it is about to expire.</p>
                                        : <p className="mb-0">Loading License Data</p>}
                                </div>
                    }

                </section>
        }
    </>
    )
}